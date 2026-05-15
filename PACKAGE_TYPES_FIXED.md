# Package Types Fix Summary

## Issue
TypeScript was unable to find declaration files for `@solo-leveling/shared` and other workspace packages, causing TS7016 errors.

## Root Causes Identified

### 1. Shared Package Issues
- **Duplicate Exports**: `UserProfile` was exported from both `types/index.ts` and `schemas/index.ts`, causing conflicts
- **Missing Declaration Files**: The build process wasn't generating `.d.ts` files
- **Wrong TypeScript Config**: Extended `tsconfig.react.json` instead of `tsconfig.base.json`
- **Incremental Build Issues**: `incremental: true` in base config caused issues with `tsup`

### 2. Telegram SDK Package Issues
- **Conflicting Type Declarations**: Multiple hooks declared overlapping `Window.Telegram` global types
- **Type Fragmentation**: Each hook had its own local type definitions instead of unified types

### 3. UI Package Issues
- **Type Conflicts with Framer Motion**: Components extended `React.HTMLAttributes` which conflicted with `motion.*` components
- **Missing Declaration Files**: Build wasn't generating `.d.ts` files

## Solutions Implemented

### 1. Fixed Shared Package
**File: `packages/shared/tsconfig.json`**
- Changed to extend `tsconfig.base.json` instead of `tsconfig.react.json`
- Explicitly set `declaration: true` and `declarationMap: true`
- Disabled `incremental` builds

**File: `packages/shared/src/schemas/index.ts`**
- Removed duplicate `UserProfile` type export
- Added comment explaining why it's not duplicated

**Result**: Successfully generates `dist/index.d.ts` and `dist/index.d.mts`

### 2. Fixed Telegram SDK Package
**New File: `packages/telegram-sdk/src/types/telegram.ts`**
- Created unified type definitions for all Telegram Web App features
- Single source of truth for `TelegramWebApp`, `MainButton`, `BackButton`, `HapticFeedback`, etc.
- Centralized global `Window.Telegram` type declaration

**Updated Files**:
- `hooks/useTelegramApp.ts`: Import types instead of declaring
- `hooks/useMainButton.ts`: Import shared types
- `hooks/useBackButton.ts`: Import shared types
- `hooks/useHapticFeedback.ts`: Import shared types
- `hooks/useTheme.ts`: Import shared types
- `hooks/useInitData.ts`: Import shared types
- `index.ts`: Export all types

**File: `packages/telegram-sdk/tsconfig.json`**
- Explicitly set `declaration: true` and `declarationMap: true`

**Result**: Successfully generates declaration files with unified types

### 3. Fixed UI Package
**File: `packages/ui/src/components/Button.tsx`**
- Changed from `extends React.ButtonHTMLAttributes` to `extends Omit<HTMLMotionProps<'button'>, 'children'>`
- Added explicit `children?: React.ReactNode`
- Imported `HTMLMotionProps` from framer-motion

**File: `packages/ui/src/components/Card.tsx`**
- Replaced `extends React.HTMLAttributes<HTMLDivElement>` with explicit interface properties
- Conditional rendering: only uses `motion.div` when `hoverable` is true
- Avoids type conflicts by being explicit about accepted props

**Result**: Successfully generates declaration files without type conflicts

### 4. Fixed Base TypeScript Config
**File: `packages/config/tsconfig.base.json`**
- Changed `incremental: true` to `incremental: false`
- This prevents issues with `tsup` when generating declaration files

### 5. Fixed Database Package
**File: `packages/database/tsconfig.json`**
- Explicitly set `declaration: true` and `declarationMap: true`

**Result**: Successfully generates declaration files

## Build Results

All packages now successfully build with declaration files:

```bash
packages/shared/dist/
  ├── index.d.ts
  ├── index.d.mts
  ├── index.js
  └── index.mjs

packages/database/dist/
  ├── index.d.ts
  ├── index.d.ts.map
  ├── index.js
  └── index.js.map

packages/telegram-sdk/dist/
  ├── index.d.ts
  ├── index.d.mts
  ├── index.js
  └── index.mjs

packages/ui/dist/
  ├── index.d.ts
  ├── index.d.mts
  ├── index.js
  └── index.mjs
```

## Verification

Ran TypeScript error check on apps:
- ✅ No errors in `/apps/web/src`
- ✅ No errors in `/apps/api/src`

## Best Practices Applied

1. **Single Source of Truth**: Created unified type files instead of scattered declarations
2. **Explicit Type Exports**: Export types separately from runtime code
3. **Avoid Type Conflicts**: Don't mix framer-motion and React HTML attributes
4. **Proper Configuration**: Ensure `declaration: true` in all package tsconfigs
5. **Build Tool Compatibility**: Disable `incremental` builds when using `tsup` for packages

## Future Recommendations

1. **Add Build Script**: Create a root-level script to build all packages in order
   ```bash
   pnpm run build:packages
   ```

2. **Pre-commit Hook**: Ensure all packages build successfully before pushing

3. **CI/CD**: Add package build step to CI pipeline to catch these issues early

4. **Type Testing**: Consider adding `@ts-expect-error` tests for type validation

5. **Version Sync**: Keep TypeScript versions synchronized across all packages

## Commands to Rebuild All Packages

```bash
# Rebuild all packages
cd packages/shared && npx tsup src/index.ts --format cjs,esm --dts
cd ../database && npx tsc
cd ../telegram-sdk && npx tsup src/index.ts --format cjs,esm --dts
cd ../ui && npx tsup src/index.ts --format cjs,esm --dts
```

Or add to root `package.json`:
```json
{
  "scripts": {
    "build:packages": "pnpm --filter './packages/*' build"
  }
}
```

## Key Learnings

1. **Workspace Packages Need Declaration Files**: Internal packages need `.d.ts` files just like external npm packages
2. **TypeScript Config Inheritance**: Extending the wrong config can cause subtle issues
3. **Global Type Declarations**: Should be centralized and imported, not duplicated
4. **Framer Motion + TS**: Requires careful handling of prop types to avoid conflicts
5. **tsup + incremental**: Don't mix incremental builds with tsup's declaration generation
