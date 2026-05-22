export type ClassValue = string | number | false | null | undefined;

/**
 * Joins conditional class names into a single space-separated string.
 * A dependency-free helper used across components.
 */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}
