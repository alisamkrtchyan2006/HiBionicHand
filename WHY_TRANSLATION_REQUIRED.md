# Why "At Least One Translation" is Required

## The Requirement

When creating a news article, **at least one translation with both title and content** is required. Here's why:

## Reasons

### 1. **Slug Generation** 🔗
The system needs at least one translation to auto-generate a URL slug if you don't provide one manually. The slug is generated from the first translation's title:

```typescript
// From backend/src/services/news.service.ts
const baseTitle = data.translations.find((t) => t.language === 'en')?.title || data.translations[0].title;
const slug = data.slug || SlugUtil.generate(baseTitle);
```

**Without a title, there's no way to create a unique URL for the article.**

### 2. **Content Display** 📄
A news article needs at least some content to display. Without title and content, the article would be empty and unusable.

### 3. **Database Constraints** 💾
The database schema requires:
- `title: z.string().min(1)` - Title must be at least 1 character
- `content: z.string().min(1)` - Content must be at least 1 character
- `translations: z.array(...).min(1)` - At least one translation must exist

### 4. **Multilanguage Support** 🌍
This is a multilanguage platform (EN, RU, ARM). While you don't need to fill all three languages, you need at least one to have a functional article.

## What This Means

✅ **You must fill in:**
- At least one language's **Title** field (required)
- At least one language's **Content** field (required)

❌ **You can leave empty:**
- Other languages (RU, ARM) if you only want to publish in one language
- Excerpt, Meta Title, Meta Description (all optional)
- Slug (will be auto-generated)
- Featured Image ID (optional)
- Published At (optional)

## Visual Indicators

The form now shows:
- ✅ **Green border + "✓ Complete"** - Translation has both title and content
- ⚠️ **Red "⚠ Incomplete"** - Translation is missing title or content

## Example

**Valid:**
- ✅ English: Title = "New Product Launch", Content = "We are excited to announce..."
- ❌ Russian: (can be empty)
- ❌ Armenian: (can be empty)

**Invalid:**
- ❌ All translations have empty title or content
- ❌ Title filled but content empty (or vice versa)

## Solution

Simply fill in the **Title** and **Content** fields for at least one language (preferably English) in the **Translations** tab, and you'll be able to save the article!

