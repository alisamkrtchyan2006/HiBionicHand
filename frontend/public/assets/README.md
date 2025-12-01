# Assets Directory

This directory contains all static assets for the hiBionicHand frontend application.

## Directory Structure

```
assets/
├── images/     # General images (products, news, team photos, etc.)
├── icons/      # Icon files
└── logos/      # Logo files
```

## Usage in Next.js

### Using Next.js Image Component (Recommended)

```tsx
import Image from 'next/image';

<Image
  src="/assets/images/product-image.jpg"
  alt="Product image"
  width={500}
  height={300}
/>
```

### Using Regular img Tag

```tsx
<img src="/assets/images/product-image.jpg" alt="Product image" />
```

### Using in CSS

```css
.hero {
  background-image: url('/assets/images/hero-bg.jpg');
}
```

### Using in Inline Styles

```tsx
<div style={{ backgroundImage: "url('/assets/images/bg.jpg')" }}>
  Content
</div>
```

## Image Optimization

- Use **WebP** format when possible for better compression
- Optimize images before uploading (recommended tools: TinyPNG, ImageOptim)
- Use appropriate image sizes for different screen resolutions
- Consider using Next.js Image component for automatic optimization

## File Naming Conventions

- Use lowercase letters
- Use hyphens instead of spaces: `product-image.jpg` not `product image.jpg`
- Be descriptive: `bionic-hand-pro-front-view.jpg` not `img1.jpg`

## Current Image References

The following image paths are currently referenced in the codebase:
- `/images/product-placeholder.jpg` - Consider moving to `/assets/images/product-placeholder.jpg`

