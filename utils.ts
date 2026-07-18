import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS class names safely.
 *
 * Example:
 * cn(
 *   "rounded-lg bg-blue-500",
 *   isActive && "bg-green-500",
 *   className
 * )
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number as USD currency.
 */
export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format a number with commas.
 */
export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

/**
 * Delay execution (useful for demos/loading states).
 */
export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Truncate long strings.
 */
export function truncate(text: string, length = 120) {
  if (text.length <= length) return text;

  return `${text.substring(0, length)}…`;
}

/**
 * Capitalize the first letter.
 */
export function capitalize(text: string) {
  if (!text.length) return "";

  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Create a URL-friendly slug.
 */
export function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Returns the full site URL.
 */
export function getSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://ahllc.biz"
  );
}

/**
 * Build an absolute URL from a relative path.
 */
export function absoluteUrl(path = "") {
  return `${getSiteUrl()}${path}`;
}
