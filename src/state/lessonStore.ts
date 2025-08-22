/**
 * Lesson State Management Store
 * 
 * This file contains the main Zustand store for managing the state of geometry lesson applications.
 * It handles both isosceles triangle proofs and right triangle congruence (RHA/RHS) modes,
 * providing state management for interactive geometry boards, validation systems, and user interactions.
 */

import { create } from 'zustand';

/**
 * Main interface for the lesson state store
 * 
 * This interface defines the complete state structure and methods for managing
 * geometry lesson interactions, including both isosceles triangle proofs and
 * right triangle congruence (RHA/RHS) modes.
 */
export interface LessonState {
  // === Core Lesson State ===
  
  /** Current step in the lesson workflow ('1', '2', '3', or '2-2' for substeps) */
  currentStep: '1' | '2' | '3' | '2-2';
  
  /** Array of geometry objects (points, lines, segments, etc.) created on the board */
  objects: GeometryObject[];
  
  /** Array of geometric constraints applied to objects */
  constraints: Constraint[];
  
  /** Tolerance settings for geometric validation - prevents floating-point precision issues */
  tolerance: {
    /** Angle tolerance in degrees for angle comparisons */
    angle: number;
    /** Length tolerance in pixels for distance comparisons */
    lengthPx: number;
  };
  
  /** Updates tolerance settings (partial update supported) */
  setTolerance: (t: { angle?: number; lengthPx?: number }) => void;
  
  /** 
   * Nested validation results structure: checks[stepId][criteriaKey] = boolean
   * Used to track which validation criteria have been met for each step
   */
  checks: Record<string, Record<string, boolean>>;
  
  // === Tool Management ===
  
  /** Currently selected geometric tool for user interactions */
  selectedTool: ToolId;
  
  /** Sets the active tool for user interactions */
  setSelectedTool: (tool: ToolId) => void;
  
  // === Desmos Calculator Integration ===
  
  /** Reference to the Desmos calculator instance */
  board: Desmos.Calculator | null;
  
  /** Sets the Desmos calculator reference */
  setBoard: (board: Desmos.Calculator | null) => void;
  
  /** Sets external validator function for automatic validation checks */
  setValidator: (validator: (() => Record<string, boolean>) | null) => void;
  
  /** Runs the current validation function and updates checks state */
  runValidation: () => void;
  
  /** Removes the last created object from the board (undo functionality) */
  undoLast: () => void;
  
  /** Removes all user-created objects from the board (reset functionality) */
  clearCreated: () => void;
  
  // === RHA/RHS Mode State (Right Triangle Congruence) ===
  
  /** Current lesson mode: ISOSCELES for isosceles triangles, RHA/RHS for right triangle congruence */
  mode: 'ISOSCELES' | 'RHA' | 'RHS';
  
  /** Sets the lesson mode */
  setMode: (m: 'ISOSCELES' | 'RHA' | 'RHS') => void;
  
  /** Specifies which vertex has the right angle (90°) in RHA/RHS modes */
  rightAt: 'A' | 'B' | 'C' | null;
  
  /** Length constraint for the hypotenuse in RHA/RHS modes */
  hypotenuseLen: number | null;
  
  /** Angle constraint: locks a specific angle at a vertex to a specific degree value */
  angleLock: { at: 'A' | 'B' | 'C'; deg: number } | null;
  
  /** Side constraint: locks a specific side to a specific length */
  sideLock: { name: 'AB' | 'BC' | 'CA'; len: number } | null;
  
  /** Whether mirror/reflection transformations are allowed for triangle positioning */
  mirrorAllowed: boolean;
  
  /** Sets which vertex has the right angle */
  setRightAt: (v: 'A' | 'B' | 'C' | null) => void;
  
  /** Sets the hypotenuse length constraint */
  setHypotenuseLen: (len: number | null) => void;
  
  /** Sets an angle lock constraint */
  setAngleLock: (al: { at: 'A' | 'B' | 'C'; deg: number } | null) => void;
  
  /** Sets a side length lock constraint */
  setSideLock: (sl: { name: 'AB' | 'BC' | 'CA'; len: number } | null) => void;
  
  /** Sets whether mirror transformations are allowed */
  setMirrorAllowed: (v: boolean) => void;
  
  /** Resets all constraint locks to null */
  resetLocks: () => void;
  
  // === Correspondence Pin System (대응점 핀 고정) ===
  
  /** 
   * Maps each vertex of the first triangle (A, B, C) to corresponding vertices 
   * in the second triangle (A2, B2, C2). Used for establishing triangle correspondence
   * in congruence proofs.
   */
  pins: { A: 'A2' | 'B2' | 'C2' | null; B: 'A2' | 'B2' | 'C2' | null; C: 'A2' | 'B2' | 'C2' | null };
  
  /** Sets correspondence between a vertex and its target in the second triangle */
  setPin: (vertex: 'A' | 'B' | 'C', target: 'A2' | 'B2' | 'C2' | null) => void;
  
  // === Lesson Flow Management ===
  
  /** Sets the current step in the lesson workflow */
  setCurrentStep: (step: '1' | '2' | '3' | '2-2') => void;
  
  /** Adds a geometry object to the objects array */
  addObject: (object: GeometryObject) => void;
  
  /** Removes a geometry object by ID from the objects array */
  removeObject: (id: string) => void;
  
  /** Updates validation check results for a specific step and criteria */
  updateChecks: (stepId: string, criteriaKey: string, passed: boolean) => void;

  /** Sets all validation check results for the current step */
  setChecks: (results: Record<string, boolean>) => void;
  
  /** Resets the entire lesson state to initial values */
  resetLesson: () => void;
  
  // === Congruence Badge System (합동 배지 상태) ===
  
  /** Indicates whether triangles have been proven congruent */
  congruent: boolean;
  
  /** Sets the congruence status */
  setCongruent: (v: boolean) => void;
}

/**
 * Represents a geometric object created on the JSXGraph board
 * 
 * These objects are tracked separately from JSXGraph's internal object system
 * to allow for additional metadata and application-specific logic.
 */
export interface GeometryObject {
  /** Unique identifier for the geometric object */
  id: string;
  
  /** Type of geometric object - determines how it's rendered and behaves */
  type: 'point' | 'line' | 'segment' | 'angle' | 'label';
  
  /** Object-specific data (coordinates, parameters, etc.) - flexible structure */
  data: unknown;
  
  /** Optional styling properties for visual customization */
  style?: Record<string, unknown>;
}

/**
 * Represents a geometric constraint between objects
 * 
 * Constraints define relationships that should be maintained between
 * geometric objects (e.g., two segments must be equal length).
 */
export interface Constraint {
  /** Unique identifier for the constraint */
  id: string;
  
  /** Type of constraint - defines the mathematical relationship */
  type: 'equal' | 'perpendicular' | 'parallel' | 'midpoint' | 'angle_bisector';
  
  /** Array of object IDs that this constraint applies to */
  objects: string[];
}

/**
 * Available geometric tools for user interaction
 * 
 * Each tool provides different functionality for creating and manipulating
 * geometric objects on the board.
 */
export type ToolId =
  | 'select'      // Default selection tool for moving/selecting objects
  | 'point'       // Create points by clicking
  | 'line'        // Create infinite lines through two points
  | 'segment'     // Create line segments between two points  
  | 'angle'       // Create angle measurements
  | 'bisector'    // Create angle bisectors
  | 'intersection' // Find intersections between objects
  | 'measure'     // Measure distances, angles, etc.
  | 'delete';     // Delete objects from the board

/**
 * Initial state values for the lesson store
 * 
 * These default values are used when creating a new store instance
 * or when resetting the lesson to its starting state.
 */
const initialState = {
  // Start with the first step of the lesson
  currentStep: '1' as const,
  
  // No geometry objects created initially
  objects: [],
  
  // No constraints applied initially
  constraints: [],
  
  // Default tolerance values for geometric validation
  tolerance: {
    angle: 1,        // 1 degree tolerance for angle comparisons
    lengthPx: 2,     // 2 pixel tolerance for length comparisons
  },
  
  // No validation checks completed initially
  checks: {},
  
  // Default to selection tool
  selectedTool: 'select' as ToolId,
  
  // No Desmos calculator reference initially
  board: null as Desmos.Calculator | null,
  
  // Default to isosceles triangle mode
  mode: 'ISOSCELES' as const,
  
  // RHA/RHS specific state - all unset initially
  rightAt: null as 'A' | 'B' | 'C' | null,
  hypotenuseLen: null as number | null,
  angleLock: null as { at: 'A' | 'B' | 'C'; deg: number } | null,
  sideLock: null as { name: 'AB' | 'BC' | 'CA'; len: number } | null,
  mirrorAllowed: true, // Allow reflection by default
  
  // No congruence proven initially
  congruent: false,
  
  // No vertex correspondence pins set initially
  pins: { A: null, B: null, C: null },
};

/**
 * External validator function reference
 * 
 * This is stored outside the Zustand store to avoid serialization issues.
 * The validator function is injected from components that know the specific
 * validation logic for the current lesson mode (isosceles vs RHA/RHS).
 */
let externalValidator: (() => Record<string, boolean>) | null = null;

/**
 * Main Zustand store for lesson state management
 * 
 * This store provides centralized state management for geometry lessons,
 * handling user interactions, validation results, and JSXGraph board integration.
 * The store supports both isosceles triangle proofs and right triangle congruence modes.
 */
export const useLessonStore = create<LessonState>((set, get) => ({
  // Spread initial state to set default values
  ...initialState,
  
  // === Tolerance Management ===
  
  /**
   * Updates tolerance settings with partial updates supported
   * Only provided values are updated, others remain unchanged
   */
  setTolerance: (t) => set((state) => ({
    tolerance: {
      angle: t.angle ?? state.tolerance.angle,
      lengthPx: t.lengthPx ?? state.tolerance.lengthPx,
    },
  })),
  
  // === Tool Management ===
  
  /** Sets the currently selected tool for user interactions */
  setSelectedTool: (tool) => set({ selectedTool: tool }),
  
  // === Desmos Calculator Integration ===
  
  /** Sets the Desmos calculator reference for direct board manipulation */
  setBoard: (board) => set({ board }),
  
  /**
   * Sets the external validator function
   * This is stored outside Zustand to avoid serialization issues with functions
   */
  setValidator: (validator) => {
    externalValidator = validator;
  },
  
  /**
   * Runs the current validator function and updates validation results
   * Results are merged with existing checks for the current step
   */
  runValidation: () => {
    const { currentStep } = get();
    if (!externalValidator) return;
    
    const results = externalValidator();
    set((state) => ({
      checks: {
        ...state.checks,
        [currentStep]: {
          ...state.checks[currentStep],
          ...results,
        },
      },
    }));
  },
  
  // === Board Object Management ===
  
  /**
   * Removes the last created object from the Desmos calculator (undo functionality)
   * Uses calculator scratch.created array to track user-created expressions
   */
  undoLast: () => {
    const calculator = get().board as Desmos.Calculator | null;
    if (!calculator) return;
    
    try {
      const scratch = (calculator as any).scratch;
      const created: string[] = scratch?.created || [];
      const lastId = created.pop();
      
      if (lastId) {
        calculator.removeExpression({ id: lastId });
        console.log('[lessonStore.undoLast] Removed expression:', lastId);
      }
    } catch (err) {
      console.warn('[lessonStore.undoLast] removeExpression 실패', err);
    }
  },
  
  /**
   * Removes all user-created objects from the calculator (reset functionality)
   * Clears the entire calculator.scratch.created array
   */
  clearCreated: () => {
    const calculator = get().board as Desmos.Calculator | null;
    if (!calculator) return;
    
    try {
      const scratch = (calculator as any).scratch;
      const created: string[] = scratch?.created || [];
      
      // Remove all user-created expressions
      while (created.length) {
        const expressionId = created.pop();
        if (expressionId) {
          calculator.removeExpression({ id: expressionId });
        }
      }
      
      console.log('[lessonStore.clearCreated] Cleared all user-created expressions');
    } catch (err) {
      console.warn('[lessonStore.clearCreated] removeExpression 실패', err);
    }
  },
  
  // === Mode and Constraint Management ===
  
  /** Sets the current lesson mode (ISOSCELES, RHA, or RHS) */
  setMode: (m) => set({ mode: m }),
  
  /** Sets which vertex has the right angle in RHA/RHS modes */
  setRightAt: (v) => set({ rightAt: v }),
  
  /** Sets the hypotenuse length constraint for RHA/RHS modes */
  setHypotenuseLen: (len) => set({ hypotenuseLen: len }),
  
  /** Sets angle lock constraint (locks specific angle to specific degree) */
  setAngleLock: (al) => set({ angleLock: al }),
  
  /** Sets side lock constraint (locks specific side to specific length) */
  setSideLock: (sl) => set({ sideLock: sl }),
  
  /** Sets whether mirror/reflection transformations are allowed */
  setMirrorAllowed: (v) => set({ mirrorAllowed: v }),
  
  /** Resets all constraint locks to null (removes all constraints) */
  resetLocks: () => set({ 
    rightAt: null, 
    hypotenuseLen: null, 
    angleLock: null, 
    sideLock: null 
  }),
  
  // === Correspondence Pin Management ===
  
  /**
   * Sets vertex correspondence for triangle congruence proofs
   * Maps vertices from first triangle (A,B,C) to second triangle (A2,B2,C2)
   */
  setPin: (vertex, target) => set((state) => ({ 
    pins: { ...state.pins, [vertex]: target } 
  })),
  
  // === Lesson Flow Management ===
  
  /** Sets the current step in the lesson workflow */
  setCurrentStep: (step) => set({ currentStep: step }),
  
  /** Adds a new geometry object to the objects array */
  addObject: (object) => set((state) => ({ 
    objects: [...state.objects, object] 
  })),
  
  /** Removes a geometry object by ID from the objects array */
  removeObject: (id) => set((state) => ({ 
    objects: state.objects.filter(obj => obj.id !== id) 
  })),
  
  /**
   * Updates validation check results for a specific step and criteria
   * Creates nested structure: checks[stepId][criteriaKey] = passed
   */
  updateChecks: (stepId, criteriaKey, passed) => set((state) => ({
    checks: {
      ...state.checks,
      [stepId]: {
        ...state.checks[stepId],
        [criteriaKey]: passed,
      },
    },
  })),

  /** Sets all validation check results for the current step */
  setChecks: (results: Record<string, boolean>) => set((state) => {
    const { currentStep } = state;
    return {
      checks: {
        ...state.checks,
        [currentStep]: results,
      },
    };
  }),
  
  /** Resets the entire lesson state back to initial values */
  resetLesson: () => set(initialState),
  
  // === Congruence Status Management ===
  
  /** Sets whether triangles have been proven congruent */
  setCongruent: (v) => set({ congruent: v }),
}));
