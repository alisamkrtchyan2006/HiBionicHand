# Router Mounting Error Fix

## Problem
Error: "invariant expected app router to be mounted" and endless loading.

## Root Cause
Next.js App Router requires the **root layout** (`app/layout.tsx`) to have `<html>` and `<body>` tags. Nested layouts should NOT have these tags.

## Solution Applied

### 1. Root Layout (`app/layout.tsx`)
- ✅ Now has `<html>` and `<body>` tags
- ✅ Provides basic structure for all routes
- ✅ Includes global CSS

### 2. Locale Layout (`app/[locale]/layout.tsx`)
- ✅ Removed `<html>` and `<body>` tags (nested layout)
- ✅ Provides i18n context and theme
- ✅ Wraps locale-specific routes

### 3. Admin Layout (`app/admin/layout.tsx`)
- ✅ No html/body (nested layout)
- ✅ Wraps with ThemeContextProvider
- ✅ Provides admin sidebar and structure

## Layout Hierarchy

```
app/layout.tsx (root)
├── <html><body>
    ├── app/[locale]/layout.tsx (nested)
    │   └── NextIntlClientProvider + ThemeContextProvider
    │       └── Header + Footer + Content
    │
    └── app/admin/layout.tsx (nested)
        └── ThemeContextProvider
            └── Admin Sidebar + Content
```

## Next Steps

1. **Clear Next.js cache**:
   ```bash
   rm -rf .next
   ```

2. **Restart dev server**:
   ```bash
   npm run dev
   ```

3. **Test routes**:
   - `/admin` - Should work
   - `/en` - Should work
   - `/en/products` - Should work

## Why This Fixes It

- Next.js App Router requires exactly ONE `<html><body>` in the root layout
- Nested layouts are React components that wrap children
- Having html/body in nested layouts causes router mounting conflicts
- Admin routes now properly inherit from root layout

The error should be resolved now! 🎉

