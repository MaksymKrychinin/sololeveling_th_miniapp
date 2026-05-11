# ToastProvider Export Fix ✅

## Date: May 11, 2026

## Issue
Web app was throwing error:
```
App.tsx:4 Uncaught SyntaxError: The requested module '/@fs/.../packages/ui/dist/index.mjs' 
does not provide an export named 'ToastProvider' (at App.tsx:4:10)
```

## Root Cause
The `ToastProvider` component existed in `packages/ui/src/components/Toast.tsx` but was not being exported from the package's main entry point (`packages/ui/src/index.ts`).

## Solution

### Files Modified

#### 1. `packages/ui/src/index.ts`
**Before:**
```typescript
export { Toast, useToast } from './components/Toast';
```

**After:**
```typescript
export { ToastProvider, useToast } from './components/Toast';
```

**Note:** The `Toast` component is not exported from `Toast.tsx` as it's an internal component used by `ToastContainer`. Only `ToastProvider` and `useToast` are meant to be public APIs.

## Verification

The fix was verified by checking the built output:
```bash
tail -20 packages/ui/dist/index.mjs
```

**Result:**
```javascript
export {
  Badge,
  Button,
  Card,
  Input,
  Modal,
  ProgressBar,
  Spinner,
  ToastProvider,  // ✅ Now exported
  useToast        // ✅ Already exported
};
```

## Usage in Web App

The web app (`apps/web/src/App.tsx`) imports and uses ToastProvider:

```typescript
import { ToastProvider } from '@solo-leveling/ui';

function App() {
  return (
    <TelegramProvider>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          {/* App content */}
        </ToastProvider>
      </QueryClientProvider>
    </TelegramProvider>
  );
}
```

Pages can now use the `useToast` hook:
```typescript
import { useToast } from '@solo-leveling/ui';

const MyComponent = () => {
  const { addToast } = useToast();
  
  const handleAction = () => {
    addToast({
      message: 'Quest completed! +XP gained',
      type: 'success',
      duration: 3000
    });
  };
};
```

## Toast System Architecture

### Components
- **ToastProvider**: Context provider that manages toast state
- **ToastContainer**: Internal component that renders all active toasts
- **Toast**: Internal component for individual toast display (not exported)

### Hook
- **useToast()**: Hook to access toast functionality
  - `addToast(toast)` - Add a new toast
  - `removeToast(id)` - Manually remove a toast
  - `toasts` - Array of active toasts

### Toast Types
- `info` - Blue/gray theme
- `success` - Green theme
- `warning` - Amber theme
- `error` - Red theme

## Status
✅ **Fixed** - ToastProvider is now properly exported and web app loads without errors

## Related Files
- `packages/ui/src/components/Toast.tsx` - Toast system implementation
- `packages/ui/src/index.ts` - Package exports
- `apps/web/src/App.tsx` - ToastProvider usage
- `apps/web/src/pages/Home.tsx` - useToast hook usage example
