/**
 * Desmos-based Geometry Validators
 * 
 * This module provides validation functions for geometric constructions using
 * the Desmos API instead of JSXGraph. It validates geometric relationships,
 * measures, and proof steps for educational geometry tools.
 */

type DesmosValidator = () => Record<string, boolean>;

interface ToleranceSettings {
  angle: number; // degrees
  lengthPx: number; // pixels (converted to math units)
}

/**
 * Creates an isosceles triangle validator for Desmos calculator
 */
export function createDesmosIsoscelesValidator(params: {
  board: Desmos.Calculator;
  tolerance?: ToleranceSettings;
}): DesmosValidator {
  const { board, tolerance = { angle: 1, lengthPx: 2 } } = params;

  return () => {
    const results: Record<string, boolean> = {};

    try {
      // Get triangle points from expressions
      const points = getTrianglePoints(board);
      if (!points) {
        return results;
      }

      const { A, B, C } = points;
      
      // Calculate side lengths
      const AB = distance(A, B);
      const AC = distance(A, C);
      const BC = distance(B, C);
      
      // Calculate angles (in degrees)
      const angleB = calculateAngle(A, B, C);
      const angleC = calculateAngle(A, C, B);

      // Isosceles triangle basic properties
      results['isIsosceles'] = Math.abs(AB - AC) <= tolerance.lengthPx;
      results['triangleValid'] = AB + AC > BC && AB + BC > AC && AC + BC > AB;
      results['vertexAngleCorrect'] = A.y > Math.max(B.y, C.y); // A is at top
      
      // Angle bisector construction
      const hasBisector = hasBisectorConstruction(board);
      results['isAngleBisector'] = hasBisector;
      results['isPointOnLine'] = hasPointD(board);
      
      // SAS congruence conditions
      results['isSASCongruent'] = Math.abs(AB - AC) <= tolerance.lengthPx && hasBisector;
      
      // Base angles equality (consequence of isosceles triangle)
      results['isBaseAnglesEqual'] = Math.abs(angleB - angleC) <= tolerance.angle;
      
      // Advanced validations if point D exists
      if (hasPointD(board)) {
        const D = getPointD(board);
        if (D) {
          const BD = distance(B, D);
          const CD = distance(C, D);
          
          // Check if D is midpoint of BC
          results['isMidpoint'] = Math.abs(BD - CD) <= tolerance.lengthPx;
          
          // Check if AD is perpendicular to BC (for perpendicular bisector)
          const AD_vec = { x: D.x - A.x, y: D.y - A.y };
          const BC_vec = { x: C.x - B.x, y: C.y - B.y };
          const dotProduct = AD_vec.x * BC_vec.x + AD_vec.y * BC_vec.y;
          results['isPerpendicular'] = Math.abs(dotProduct) <= tolerance.lengthPx * 0.1;
        }
      }

    } catch (error) {
      console.warn('[DesmosValidator] Validation error:', error);
    }

    return results;
  };
}

import { getTrianglePoints, distance } from './desmosParse';

/**
 * Calculate angle at vertex B formed by points A-B-C (in degrees)
 */
function calculateAngle(
  A: { x: number; y: number },
  B: { x: number; y: number },
  C: { x: number; y: number }
): number {
  const BA = { x: A.x - B.x, y: A.y - B.y };
  const BC = { x: C.x - B.x, y: C.y - B.y };
  
  const dot = BA.x * BC.x + BA.y * BC.y;
  const lenBA = Math.sqrt(BA.x * BA.x + BA.y * BA.y);
  const lenBC = Math.sqrt(BC.x * BC.x + BC.y * BC.y);
  
  if (lenBA === 0 || lenBC === 0) return NaN;
  
  const cos = dot / (lenBA * lenBC);
  const clampedCos = Math.max(-1, Math.min(1, cos));
  return Math.acos(clampedCos) * (180 / Math.PI);
}

/**
 * Check if angle bisector construction exists
 */
function hasBisectorConstruction(calculator: Desmos.Calculator): boolean {
  const expressions = calculator.getExpressions();
  return expressions.some(expr => 
    expr.id === 'tool-bisector-line' || 
    (expr.latex && expr.latex.includes('bisector'))
  );
}

/**
 * Check if point D exists (intersection of bisector with BC)
 */
function hasPointD(calculator: Desmos.Calculator): boolean {
  const expressions = calculator.getExpressions();
  return expressions.some(expr => 
    expr.id === 'tool-bisector-point-D' || 
    (expr.latex && expr.latex.includes('D'))
  );
}

/**
 * Get coordinates of point D
 */
function getPointD(calculator: Desmos.Calculator): { x: number; y: number } | null {
  try {
    const expressions = calculator.getExpressions();
    
    for (const expr of expressions) {
      if (expr.id === 'tool-bisector-point-D' && expr.latex) {
        const match = expr.latex.match(/D\s*=\s*\\left\(([^,]+),([^)]+)\)/);
        if (match) {
          return {
            x: parseFloat(match[1]),
            y: parseFloat(match[2])
          };
        }
      }
    }
  } catch (error) {
    console.warn('[getPointD] Error extracting point D:', error);
  }
  
  return null;
}

/**
 * Creates a right triangle congruence validator for RHA/RHS modes
 */
export function createDesmosRightTriangleValidator(params: {
  board: Desmos.Calculator;
  mode: 'RHA' | 'RHS';
  tolerance?: ToleranceSettings;
}): DesmosValidator {
  const { board, mode, tolerance = { angle: 1, lengthPx: 2 } } = params;

  return () => {
    const results: Record<string, boolean> = {};

    try {
      const points = getTrianglePoints(board);
      if (!points) {
        return results;
      }

      const { A, B, C } = points;
      
      // Calculate side lengths
      const AB = distance(A, B);
      const AC = distance(A, C);
      const BC = distance(B, C);
      
      // Calculate angles
      const angleA = calculateAngle(B, A, C);
      const angleB = calculateAngle(A, B, C);
      const angleC = calculateAngle(A, C, B);

      // Determine which angle is the right angle (closest to 90°)
      const angles = [
        { angle: angleA, vertex: 'A' },
        { angle: angleB, vertex: 'B' },
        { angle: angleC, vertex: 'C' }
      ];
      const rightAngle = angles.reduce((prev, curr) => 
        Math.abs(curr.angle - 90) < Math.abs(prev.angle - 90) ? curr : prev
      );
      
      const isRightTriangle = Math.abs(rightAngle.angle - 90) <= tolerance.angle;

      // Basic right triangle validation
      results['isRightTriangle'] = isRightTriangle;
      results['rightAngleIdentified'] = isRightTriangle;
      results['verticesLabeled'] = true;
      
      // Determine hypotenuse (side opposite to right angle)
      let hypotenuseLength = 0;
      if (rightAngle.vertex === 'A') {
        hypotenuseLength = BC;
      } else if (rightAngle.vertex === 'B') {
        hypotenuseLength = AC;
      } else {
        hypotenuseLength = AB;
      }
      
      results['hypotenuseIdentified'] = hypotenuseLength > 0;
      
      if (mode === 'RHA') {
        // RHA: Right angle + Hypotenuse + Acute angle
        const acuteAngles = angles.filter(a => a.vertex !== rightAngle.vertex);
        const hasValidAcuteAngle = acuteAngles.some(a => a.angle > 0 && a.angle < 90);
        
        results['acuteAngleIdentified'] = hasValidAcuteAngle;
        results['rhaConditionsPresent'] = isRightTriangle && hasValidAcuteAngle;
      } else if (mode === 'RHS') {
        // RHS: Right angle + Hypotenuse + Side (leg)
        const legs = [];
        if (rightAngle.vertex === 'A') {
          legs.push(AB, AC);
        } else if (rightAngle.vertex === 'B') {
          legs.push(AB, BC);
        } else {
          legs.push(AC, BC);
        }
        
        const hasValidLeg = legs.some(leg => leg > 0);
        results['legIdentified'] = hasValidLeg;
        results['rhsConditionsPresent'] = isRightTriangle && hasValidLeg;
      }

    } catch (error) {
      console.warn('[DesmosRightTriangleValidator] Validation error:', error);
    }

    return results;
  };
}