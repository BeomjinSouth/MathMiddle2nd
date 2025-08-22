/**
 * Isosceles Triangle Proof Steps Configuration
 * 
 * This file defines the step-by-step workflow for proving properties of isosceles triangles.
 * The proof demonstrates that base angles of an isosceles triangle are equal by constructing
 * an angle bisector and using SAS congruence conditions.
 * 
 * The proof follows this logical sequence:
 * 1. Draw angle bisector from vertex angle to base
 * 2. Prove two smaller triangles are congruent (SAS)
 * 3. Conclude base angles are equal (corresponding angles of congruent triangles)
 * 4. Additional property: angle bisector is also perpendicular bisector of base
 */

/**
 * Represents a single step in the geometry proof workflow
 * 
 * Each step contains all the information needed to guide students through
 * the proof process, including validation criteria and feedback messages.
 */
export interface Step {
  /** Unique identifier for the step (used for tracking progress and validation) */
  id: string;
  
  /** Human-readable title displayed in the step guide */
  title: string;
  
  /** Main objective or instruction for this step */
  goal: string;
  
  /** Array of helpful hints to guide students when they're stuck */
  hints: string[];
  
  /** Array of validation criteria keys that must be satisfied to complete this step */
  criteria: string[];
  
  /** Success message shown when all criteria are met */
  onSuccessMessage: string;
}

/**
 * Complete step sequence for isosceles triangle proof
 * 
 * This array defines the logical progression of the proof, with each step
 * building upon the previous ones to establish the final conclusion.
 */
export const isoscelesSteps: Step[] = [
  {
    id: '1',
    title: '보조선 긋기', // Drawing auxiliary lines
    goal: '∠A의 이등분선을 그어 변 BC와의 교점을 D라고 하자.',
    // Goal: Draw the angle bisector of ∠A to intersect side BC at point D
    hints: [
      'A에서 시작해 ∠A를 양분하는 반직선을 그어 보세요.',
      // Hint: Draw a ray from A that bisects angle ∠A
      '교점에 D 라벨을 붙여보세요.',
      // Hint: Label the intersection point as D
    ],
    // Validation criteria: must be angle bisector AND point must be on the line BC
    criteria: ['isAngleBisector', 'isPointOnLine'],
    onSuccessMessage: '∠A의 이등분선 AD가 올바르게 그어졌습니다!',
    // Success: Angle bisector AD has been drawn correctly!
  },
  {
    id: '2', 
    title: '두 삼각형이 합동임을 보이기', // Proving triangle congruence
    goal: '△ABD와 △ACD에서 SAS 합동 조건을 확인하자.',
    // Goal: Verify SAS congruence conditions for triangles ABD and ACD
    hints: [
      'AB = AC (이등변삼각형의 정의)',
      // Hint: AB = AC (definition of isosceles triangle)
      '∠BAD = ∠CAD (각의 이등분선)',
      // Hint: ∠BAD = ∠CAD (angle bisector property)
      'AD는 공통변입니다.',
      // Hint: AD is a common side
    ],
    // Validation: must satisfy SAS (Side-Angle-Side) congruence conditions
    criteria: ['isSASCongruent'],
    onSuccessMessage: '△ABD ≡ △ACD 임이 확인되었습니다!',
    // Success: Triangle ABD ≡ Triangle ACD has been confirmed!
  },
  {
    id: '3',
    title: '이등변삼각형의 두 밑각의 크기가 서로 같음을 보이기', 
    // Proving base angles of isosceles triangle are equal
    goal: '따라서 ∠B = ∠C임을 확인하자.',
    // Goal: Therefore, confirm that ∠B = ∠C
    hints: [
      '합동인 삼각형의 대응각은 크기가 같습니다.',
      // Hint: Corresponding angles of congruent triangles are equal
      '각도를 측정해서 확인해보세요.',
      // Hint: Measure the angles to verify
    ],
    // Validation: base angles must be equal
    criteria: ['isBaseAnglesEqual'],
    onSuccessMessage: '∠B = ∠C 임이 증명되었습니다!',
    // Success: ∠B = ∠C has been proven!
  },
  {
    id: '2-2', // Substep of step 2
    title: '꼭지각의 이등분선은 밑변을 수직 이등분한다',
    // The angle bisector from vertex angle perpendicularly bisects the base
    goal: 'AD가 BC를 수직이등분함을 확인하자.',
    // Goal: Confirm that AD perpendicularly bisects BC
    hints: [
      'BD = CD인지 확인해보세요.',
      // Hint: Check if BD = CD
      '∠ADB = ∠ADC = 90°인지 확인해보세요.',
      // Hint: Check if ∠ADB = ∠ADC = 90°
    ],
    // Validation: must be midpoint AND perpendicular
    criteria: ['isMidpoint', 'isPerpendicular'],
    onSuccessMessage: 'AD가 BC의 수직이등분선임이 확인되었습니다!',
    // Success: AD being the perpendicular bisector of BC has been confirmed!
  },
];
