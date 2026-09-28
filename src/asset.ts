/** Prefix public asset paths with Vite's base (needed for GitHub Pages). */
export function asset(path: string) {
  const base = import.meta.env.BASE_URL || "/";
  const clean = path.replace(/^\//, "");
  return `${base}${clean}`;
}
