/**
 * Desmos LaTeX 파싱 유틸리티
 */

export interface PointXY {
  x: number;
  y: number;
}

function extractPointFromLatex(latex: string, label: 'A' | 'B' | 'C'): PointXY | null {
  try {
    // Canonicalized form e.g., A=\left(1,2\right)
    const reCanon = new RegExp(`${label}=\\\\left\\\\\\(([^,]+),([^\\\\)]+)\\\\\\)`, '');
    const mCanon = latex.match(reCanon);
    if (mCanon) {
      return { x: parseFloat(mCanon[1]), y: parseFloat(mCanon[2]) };
    }

    // Simple form e.g., A=(1,2)
    const reSimple = new RegExp(`${label}=\\(([^,]+),([^\\)]+)\\)`);
    const mSimple = latex.match(reSimple);
    if (mSimple) {
      return { x: parseFloat(mSimple[1]), y: parseFloat(mSimple[2]) };
    }
  } catch {
    // ignore
  }
  return null;
}

export function getTrianglePoints(calculator: Desmos.Calculator): { A: PointXY; B: PointXY; C: PointXY } | null {
  try {
    const expressions = calculator.getExpressions();
    const points: any = {};

    for (const expr of expressions) {
      if (!expr.id || !expr.latex) continue;
      if (expr.id === 'point-A') {
        const p = extractPointFromLatex(expr.latex, 'A');
        if (p) points.A = p;
      }
      if (expr.id === 'point-B') {
        const p = extractPointFromLatex(expr.latex, 'B');
        if (p) points.B = p;
      }
      if (expr.id === 'point-C') {
        const p = extractPointFromLatex(expr.latex, 'C');
        if (p) points.C = p;
      }
    }

    if (points.A && points.B && points.C) return points as { A: PointXY; B: PointXY; C: PointXY };
  } catch {
    // ignore
  }
  return null;
}

export function distance(p1: PointXY, p2: PointXY): number {
  return Math.hypot(p2.x - p1.x, p2.y - p1.y);
}


