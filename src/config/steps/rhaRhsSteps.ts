/**
 * RHA/RHS Triangle Congruence Steps Configuration
 * 
 * This file defines the step-by-step workflow for demonstrating right triangle
 * congruence using RHA (Right-Hypotenuse-Acute) and RHS (Right-Hypotenuse-Side) criteria.
 * 
 * RHA Proof: Right angle + Hypotenuse + Acute angle → Unique triangle
 * RHS Proof: Right angle + Hypotenuse + One leg → Unique triangle
 * 
 * Both proofs demonstrate that these three conditions are sufficient to uniquely
 * determine a right triangle, proving congruence.
 */

/**
 * Represents a single step in the RHA/RHS congruence proof workflow
 * 
 * Each step progressively reduces the degrees of freedom of the triangle
 * by applying constraints until the triangle is uniquely determined.
 */
export interface RhaRhsStep {
  /** Unique identifier for the step (used for tracking progress) */
  id: string;
  
  /** Human-readable title displayed in the step guide */
  title: string;
  
  /** Which congruence method this step belongs to */
  mode: 'RHA' | 'RHS';
  
  /** Main objective or goal of this step */
  goal: string;
  
  /** Detailed explanation of what this step accomplishes */
  description: string;
  
  /** Step-by-step instructions for the user */
  instructions: string[];
  
  /** Expected constraint locks after completing this step */
  expectedLocks: {
    /** Whether right angle should be locked */
    rightAngle?: boolean;
    /** Whether hypotenuse length should be locked */
    hypotenuse?: boolean;
    /** Whether an acute angle should be locked (RHA only) */
    angle?: boolean;
    /** Whether a leg (side) should be locked (RHS only) */
    side?: boolean;
  };
  
  /** Success message displayed when step is completed */
  successMessage: string;
}

/**
 * Complete step sequences for both RHA and RHS congruence proofs
 * 
 * The steps are organized to demonstrate the logical progression:
 * 1. Establish right angle (reduces 1 degree of freedom)
 * 2. Fix hypotenuse length (reduces 1 more degree of freedom) 
 * 3. Fix either acute angle (RHA) or leg length (RHS) (reduces final degree of freedom)
 * 4. Verify congruence by creating identical triangle
 */
export const rhaRhsSteps: RhaRhsStep[] = [
  // === RHA Mode Steps (Right-Hypotenuse-Acute) ===
  // Proves that specifying right angle, hypotenuse, and one acute angle uniquely determines a triangle
  {
    id: 'rha-1',
    title: 'RHA 1단계: 직각 설정',
    mode: 'RHA',
    goal: '직각삼각형을 만들고 직각 꼭짓점을 지정합니다.',
    description: 'RHA(직각-빗변-예각) 합동을 확인하기 위해 먼저 직각을 설정합니다.',
    instructions: [
      '삼각형 ABC에서 직각이 될 꼭짓점을 선택하세요',
      '일반적으로 C를 직각 꼭짓점으로 설정합니다',
      '설정 후 삼각형이 직각삼각형으로 변경됨을 확인하세요'
    ],
    expectedLocks: { rightAngle: true },
    successMessage: '직각삼각형이 설정되었습니다!'
  },
  {
    id: 'rha-2',
    title: 'RHA 2단계: 빗변 길이 고정',
    mode: 'RHA',
    goal: '빗변의 길이를 고정하여 자유도를 줄입니다.',
    description: '직각의 대변인 빗변의 길이를 고정합니다.',
    instructions: [
      '빗변 길이를 입력하세요 (예: 100px)',
      '"빗변 길이 적용" 버튼을 클릭하세요',
      '빗변의 길이가 고정되어 더 이상 변하지 않음을 확인하세요'
    ],
    expectedLocks: { rightAngle: true, hypotenuse: true },
    successMessage: '빗변 길이가 고정되었습니다!'
  },
  {
    id: 'rha-3',
    title: 'RHA 3단계: 예각 고정',
    mode: 'RHA',
    goal: '한 예각을 고정하여 삼각형을 유일하게 결정합니다.',
    description: '예각 하나를 고정하면 삼각형이 유일하게 결정됩니다.',
    instructions: [
      '예각의 크기를 입력하세요 (예: 30도)',
      '"예각 적용" 버튼을 클릭하세요',
      '삼각형이 더 이상 변형되지 않음을 확인하세요 (자유도 = 0)'
    ],
    expectedLocks: { rightAngle: true, hypotenuse: true, angle: true },
    successMessage: 'RHA 조건이 완성되었습니다! 삼각형이 유일하게 결정되었습니다.'
  },
  {
    id: 'rha-4',
    title: 'RHA 4단계: 합동 확인',
    mode: 'RHA',
    goal: '같은 조건의 삼각형을 복제하여 합동임을 확인합니다.',
    description: '동일한 RHA 조건으로 만든 삼각형들은 합동입니다.',
    instructions: [
      '"삼각형 복제" 버튼을 클릭하세요',
      '복제된 삼각형을 이동시켜보세요',
      '"합동 검사" 버튼으로 두 삼각형이 합동인지 확인하세요'
    ],
    expectedLocks: { rightAngle: true, hypotenuse: true, angle: true },
    successMessage: 'RHA 합동이 확인되었습니다!'
  },

  // === RHS Mode Steps (Right-Hypotenuse-Side) ===
  // Proves that specifying right angle, hypotenuse, and one leg uniquely determines a triangle
  {
    id: 'rhs-1',
    title: 'RHS 1단계: 직각 설정',
    mode: 'RHS',
    goal: '직각삼각형을 만들고 직각 꼭짓점을 지정합니다.',
    description: 'RHS(직각-빗변-직각변) 합동을 확인하기 위해 먼저 직각을 설정합니다.',
    instructions: [
      '삼각형 ABC에서 직각이 될 꼭짓점을 선택하세요',
      '일반적으로 C를 직각 꼭짓점으로 설정합니다',
      '설정 후 삼각형이 직각삼각형으로 변경됨을 확인하세요'
    ],
    expectedLocks: { rightAngle: true },
    successMessage: '직각삼각형이 설정되었습니다!'
  },
  {
    id: 'rhs-2',
    title: 'RHS 2단계: 빗변 길이 고정',
    mode: 'RHS',
    goal: '빗변의 길이를 고정하여 자유도를 줄입니다.',
    description: '직각의 대변인 빗변의 길이를 고정합니다.',
    instructions: [
      '빗변 길이를 입력하세요 (예: 100px)',
      '"빗변 길이 적용" 버튼을 클릭하세요',
      '빗변의 길이가 고정되어 더 이상 변하지 않음을 확인하세요'
    ],
    expectedLocks: { rightAngle: true, hypotenuse: true },
    successMessage: '빗변 길이가 고정되었습니다!'
  },
  {
    id: 'rhs-3',
    title: 'RHS 3단계: 직각변 고정',
    mode: 'RHS',
    goal: '한 직각변을 고정하여 삼각형을 유일하게 결정합니다.',
    description: '직각변 중 하나를 고정하면 삼각형이 유일하게 결정됩니다.',
    instructions: [
      '고정할 직각변을 선택하세요 (AC 또는 BC)',
      '직각변의 길이를 입력하세요 (예: 60px)',
      '"직각변 적용" 버튼을 클릭하세요',
      '삼각형이 더 이상 변형되지 않음을 확인하세요 (자유도 = 0)'
    ],
    expectedLocks: { rightAngle: true, hypotenuse: true, side: true },
    successMessage: 'RHS 조건이 완성되었습니다! 삼각형이 유일하게 결정되었습니다.'
  },
  {
    id: 'rhs-4',
    title: 'RHS 4단계: 합동 확인',
    mode: 'RHS',
    goal: '같은 조건의 삼각형을 복제하여 합동임을 확인합니다.',
    description: '동일한 RHS 조건으로 만든 삼각형들은 합동입니다.',
    instructions: [
      '"삼각형 복제" 버튼을 클릭하세요',
      '복제된 삼각형을 이동시켜보세요',
      '"합동 검사" 버튼으로 두 삼각형이 합동인지 확인하세요'
    ],
    expectedLocks: { rightAngle: true, hypotenuse: true, side: true },
    successMessage: 'RHS 합동이 확인되었습니다!'
  }
];

/**
 * Utility Functions for Step Management
 */

/**
 * Filters steps by congruence mode (RHA or RHS)
 * @param mode - The congruence mode to filter by
 * @returns Array of steps for the specified mode
 */
export function getStepsByMode(mode: 'RHA' | 'RHS'): RhaRhsStep[] {
  return rhaRhsSteps.filter(step => step.mode === mode);
}

/**
 * Finds a specific step by its unique identifier
 * @param id - The step ID to search for
 * @returns The step object if found, undefined otherwise
 */
export function getStepById(id: string): RhaRhsStep | undefined {
  return rhaRhsSteps.find(step => step.id === id);
}