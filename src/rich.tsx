import { type ReactNode } from "react";

const TOKEN = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;

/** Renders `**bold**` and `*italic*` inside copy strings from data.ts. */
export function rich(text: string): ReactNode[] {
  return text
    .split(TOKEN)
    .filter(Boolean)
    .map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith("*") && part.endsWith("*")) {
        return <em key={i}>{part.slice(1, -1)}</em>;
      }
      return part;
    });
}
