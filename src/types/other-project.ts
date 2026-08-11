import type { CategorySlug } from "@/types/project";

/** A text-only project mention shown in the cross-practice index. */
export type OtherProject = {
  documentId?: string;
  name: string;
  slug: string;
  category: CategorySlug;
};
