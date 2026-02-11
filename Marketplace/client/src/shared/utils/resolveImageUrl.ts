const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function resolveImageUrl(path?: string | null): string {
  if (!path) return "";

  // already absolute (S3, CDN, etc.)
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  // ensure no double slashes
  if (path.startsWith("/")) {
    return `${API_BASE_URL}${path}`;
  }

  return `${API_BASE_URL}/${path}`;
}
