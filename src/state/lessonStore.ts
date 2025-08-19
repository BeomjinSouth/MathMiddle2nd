import { create } from 'zustand';

export interface LessonState {
  currentStep: '1' | '2' | '3' | '2-2';
  objects: GeometryObject[];
  constraints: Constraint[];
  tolerance: {
    angle: number;
    lengthPx: number;
  };
  checks: Record<string, Record<string, boolean>>;
  setCurrentStep: (step: '1' | '2' | '3' | '2-2') => void;
  addObject: (object: GeometryObject) => void;
  removeObject: (id: string) => void;
  updateChecks: (stepId: string, criteriaKey: string, passed: boolean) => void;
  resetLesson: () => void;
}

export interface GeometryObject {
  id: string;
  type: 'point' | 'line' | 'segment' | 'angle' | 'label';
  data: any;
  style?: any;
}

export interface Constraint {
  id: string;
  type: 'equal' | 'perpendicular' | 'parallel' | 'midpoint' | 'angle_bisector';
  objects: string[];
}

const initialState = {
  currentStep: '1' as const,
  objects: [],
  constraints: [],
  tolerance: {
    angle: 1,
    lengthPx: 2,
  },
  checks: {},
};

export const useLessonStore = create<LessonState>((set) => ({
  ...initialState,
  setCurrentStep: (step) => set({ currentStep: step }),
  addObject: (object) => set((state) => ({ 
    objects: [...state.objects, object] 
  })),
  removeObject: (id) => set((state) => ({ 
    objects: state.objects.filter(obj => obj.id !== id) 
  })),
  updateChecks: (stepId, criteriaKey, passed) => set((state) => ({
    checks: {
      ...state.checks,
      [stepId]: {
        ...state.checks[stepId],
        [criteriaKey]: passed,
      },
    },
  })),
  resetLesson: () => set(initialState),
}));
