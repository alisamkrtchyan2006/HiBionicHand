export class SlugUtil {
  static generate(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  }

  static isValid(slug: string): boolean {
    return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
  }

  static makeUnique(baseSlug: string, existingSlugs: string[]): string {
    let uniqueSlug = baseSlug;
    let counter = 1;

    while (existingSlugs.includes(uniqueSlug)) {
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    return uniqueSlug;
  }
}

