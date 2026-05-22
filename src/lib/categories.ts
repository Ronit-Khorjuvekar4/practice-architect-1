import type { Category, CategorySlug } from "@/types/project";

/**
 * The four practice disciplines. This is the single source of truth for
 * navigation, listing routes and footer links — never hardcode these.
 */
export const categories: Category[] = [
  {
    slug: "architecture",
    label: "Architecture",
    title: "Architecture Portfolio",
    description:
      "Built and unbuilt architectural work across residential, civic and cultural typologies — from small interventions to masterplanned districts.",
    img:"/Residential.png"
  },
  {
    slug: "interior",
    label: "Interior",
    title: "Interior Portfolio",
    description:
      "Interior commissions spanning hospitality, retail and residential — material-led, atmosphere-first, never decorative.",
    img:"/INTERIOR.png"
  },
  {
    slug: "planning",
    label: "Planning",
    title: "Planning Portfolio",
    description:
      "Urban planning, masterplanning and feasibility studies — neighbourhood-scale work that knits architecture to its city.",
    img:"/Commercial.png"
  },
  {
    slug: "landscape",
    label: "Landscape",
    title: "Landscape Portfolio",
    description:
      "Landscape, garden and public-realm design — sites read first as terrain, then as plan.",
    img:"/Landscape.png"
  },
];

/** Returns the category matching a route slug, or `undefined` if invalid. */
export function getCategory(slug: string): Category | undefined {
  return categories.find((category) => category.slug === slug);
}

/** Type guard: narrows an arbitrary string to a known `CategorySlug`. */
export function isCategorySlug(slug: string): slug is CategorySlug {
  return categories.some((category) => category.slug === slug);
}
