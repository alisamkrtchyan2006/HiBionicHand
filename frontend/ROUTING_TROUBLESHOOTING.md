# Routing Troubleshooting Guide

## Current Configuration

### ✅ Fixed Issues

1. **Root Layout**: Now correctly returns children only (no html/body)
2. **Middleware**: Updated to proper next-intl v3 matcher pattern
3. **Request Config**: Fixed async/await for message loading
4. **Routing Config**: Added `localePrefix: 'always'` to ensure locale is always in URL

### File Structure

```
app/
├── layout.tsx          # Root layout (returns children only)
├── page.tsx            # Root page (middleware redirects)
└── [locale]/
    ├── layout.tsx      # Locale layout (has html/body, theme, i18n)
    ├── page.tsx        # Homepage
    └── about/
        └── page.tsx
```

## How Routing Works

1. **Middleware** (`src/middleware.ts`):
   - Intercepts all requests (except `/api`, `/_next`, `/_vercel`, static files)
   - Redirects `/` → `/en` (default locale)
   - Redirects `/products` → `/en/products`
   - Allows `/en/products`, `/ru/products`, `/arm/products` directly

2. **Locale Layout** (`app/[locale]/layout.tsx`):
   - Validates locale is in allowed list
   - Loads translations for that locale
   - Provides NextIntlClientProvider
   - Wraps with ThemeContextProvider

3. **Language Switcher**:
   - Extracts path without locale
   - Replaces locale in URL
   - Navigates to new locale path

## Testing Steps

1. **Clear Next.js cache**:
   ```bash
   rm -rf .next
   ```

2. **Restart dev server**:
   ```bash
   npm run dev
   ```

3. **Test URLs**:
   - Visit `http://localhost:3001/` → Should redirect to `/en`
   - Visit `http://localhost:3001/en` → Should show homepage
   - Visit `http://localhost:3001/ru` → Should show homepage in Russian
   - Visit `http://localhost:3001/arm` → Should show homepage in Armenian
   - Visit `http://localhost:3001/en/products` → Should work
   - Visit `http://localhost:3001/ru/products` → Should work in Russian

4. **Test Language Switcher**:
   - Click language icon in header
   - Select different language
   - URL should change and content should translate

## Common Issues

### Issue: Routes not working / 404 errors

**Solution**:
- Ensure all routes are inside `app/[locale]/` folder
- Check middleware is running (check Network tab in DevTools)
- Verify `next.config.js` has next-intl plugin configured

### Issue: Language switcher not working

**Solution**:
- Check browser console for errors
- Verify `usePathname()` returns path with locale
- Ensure router is from `@/i18n/routing`, not `next/navigation`

### Issue: Translations not loading

**Solution**:
- Check `messages/` folder has all language files
- Verify JSON files are valid
- Check `src/i18n/request.ts` is loading messages correctly

### Issue: Middleware not redirecting

**Solution**:
- Verify middleware file is at `src/middleware.ts` (not `middleware.ts`)
- Check matcher pattern in middleware config
- Clear `.next` folder and restart

## Debug Commands

```bash
# Check if middleware is working
# Look for redirects in Network tab (should see 307/308)

# Check translations
cat frontend/messages/en.json | head -20

# Check routing config
cat frontend/src/i18n/routing.ts

# Check middleware
cat frontend/src/middleware.ts
```

## Next Steps if Still Not Working

1. Check browser console for errors
2. Check Network tab for failed requests
3. Verify Next.js version compatibility
4. Check next-intl version matches documentation
5. Review next-intl v3 documentation: https://next-intl-docs.vercel.app/

