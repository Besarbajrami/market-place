export function slugify(input: string): string {
    if (!input) return "";
  
    return input
      .normalize("NFKD")                     // split accents
      .replace(/[\u0300-\u036f]/g, "")       // remove diacritics
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")           // non-alphanum → -
      .replace(/^-+|-+$/g, "")               // trim leading/trailing -
      .replace(/-{2,}/g, "-");               // collapse multiple -
  }
  