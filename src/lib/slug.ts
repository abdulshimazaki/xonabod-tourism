import slugify from "slugify";

export function toSlug(input: string): string {
  return slugify(input, { lower: true, strict: true, trim: true });
}

export function uniqueId(): string {
  return crypto.randomUUID();
}
