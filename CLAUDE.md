# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React-based educational tool for visualizing and interacting with middle school geometry proofs, specifically focused on isosceles triangles and right triangle congruence (RHA/RHS). The application allows students to manipulate geometric objects and follow guided proof steps.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
tsc -b && vite build

# Lint code
npm run lint

# Preview built application
npm run preview
```

## Core Architecture

### Technology Stack
- **Frontend**: React 19 + TypeScript + Vite
- **Geometry Engine**: JSXGraph for interactive geometric constructions
- **State Management**: Zustand for lesson state and user interactions
- **Routing**: React Router DOM for navigation
- **Styling**: Tailwind CSS with PostCSS

### Key Modules

#### 1. State Management (`src/state/lessonStore.ts`)
- **Primary Store**: `useLessonStore` - manages geometry objects, constraints, validation results, and tool selection
- **Multi-mode Support**: Handles both isosceles triangle proofs (`ISOSCELES`) and right triangle congruence (`RHA`/`RHS`)
- **Validation System**: External validator functions integrated with store for real-time proof checking
- **Tolerance Settings**: Configurable angle (degrees) and length (pixels) tolerances for geometric validations

#### 2. Interactive Geometry Board (`src/components/Board/GeometryBoard.tsx`)
- **JSXGraph Integration**: Primary component managing the interactive geometry canvas
- **Tool System**: Click handlers for various geometric tools (point, segment, angle, bisector, measure, delete)
- **Constraint Application**: Real-time application of geometric constraints and locks for RHA/RHS modes
- **Validation Engine**: Integration with `validators.ts` for automatic proof step checking

#### 3. Validation System (`src/utils/geometry/validators.ts`)
- **Isosceles Validator**: `createIsoscelesValidator` - checks angle bisector construction, SAS congruence, base angles equality
- **Tolerance-based Checking**: Configurable thresholds for angle and length comparisons
- **Step-by-step Validation**: Returns results for each proof criterion individually

### Route Structure
- `/` - Home page with module selection
- `/isosceles` - Isosceles triangle proof lab
- `/rha-rhs` - Right triangle congruence lab (RHA/RHS modes)

### State Flow
1. **Lesson Store** maintains current step, selected tool, and geometric objects
2. **Geometry Board** handles user interactions and updates JSXGraph
3. **Validators** run automatic checks and update lesson state
4. **UI Components** display current validation status and guide next steps

## Important Implementation Details

### JSXGraph Integration
- Board initialization with custom bounding box, grid, and interaction settings
- Scratch space (`board.scratch`) stores references to key geometric objects (A, B, C points, segments)
- Created objects tracking for undo/reset functionality
- Tool-specific interaction handlers for geometric construction

### Constraint System (RHA/RHS)
- **Lock Application**: Real-time constraint enforcement for right angles, hypotenuse lengths, and angle measurements
- **Degrees of Freedom (DoF)**: Progressive constraint application reduces DoF to achieve unique triangle determination
- **Congruence Checking**: Automatic comparison of triangle pairs with configurable correspondence mapping

### Validation Architecture
- External validator pattern allows swapping validation logic per lesson mode
- Results stored in nested structure: `checks[stepId][criteriaKey] = boolean`
- Tolerance system handles floating-point precision issues in geometric calculations

## File Organization
- `src/pages/` - Route components for different lab modules
- `src/components/Board/` - Interactive geometry canvas
- `src/components/Sidebar/` - Step guides and validation feedback
- `src/components/Toolbar/` - Geometric tool selection
- `src/state/` - Zustand stores for application state
- `src/utils/geometry/` - Validation algorithms and geometric calculations
- `src/config/steps/` - Step definitions and proof workflows

## Development Notes

### Working with JSXGraph
- All geometric objects should be tracked in `board.scratch` for external access
- Use `board.update()` after programmatic changes to refresh display
- Tool interactions require manual event handling due to custom tool requirements

### Adding New Validation Rules
1. Extend the validator function in `src/utils/geometry/validators.ts`
2. Add corresponding criteria keys to the lesson store checks
3. Update UI components to display new validation feedback

### State Management Patterns
- Use store selectors to avoid unnecessary re-renders
- External validator functions are stored separately from Zustand to avoid serialization issues
- Tolerance settings should be propagated to both store and board.scratch for consistency