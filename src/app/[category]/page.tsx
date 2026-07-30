import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getCategories, getCategoryBySlug, getCategorySlugs } from "@/lib/categories";
import { getProjectsByCategory } from "@/lib/projects";
import { ProjectListingPage } from "@/components/project/ProjectListingPage";

type CategoryPageProps = {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

/** Reads the `?page=` query param as a 1-based page, falling back to 1. */
function parsePageParam(value: string | string[] | undefined): number {
  const raw = Array.isArray(value) ? value[0] : value;
  const page = Number(raw);
  return Number.isInteger(page) && page >= 1 ? page : 1;
}

/**
 * Pre-render every category route from Strapi at build time.
 * `dynamicParams` stays at its default (`true`), so a category added to
 * Strapi after a build still renders on-demand.
 */
export async function generateStaticParams() {
  const slugs = await getCategorySlugs();
  return slugs.map((category) => ({ category }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const categoryData = await getCategoryBySlug(category);

  if (!categoryData) {
    return { title: "Not Found" };
  }

  return {
    title: categoryData.title,
    description: "Practice Architects",
  };
}

/**
 * Dynamic category listing route — handles /architecture, /interior,
 * /planning, /landscape (and any future Strapi category) from one file.
 */
export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { category } = await params;
  const requestedPage = parsePageParam((await searchParams).page);

  // Fetched in parallel — none of these depend on each other.
  const [categoryData, categories, projectsPage] = await Promise.all([
    getCategoryBySlug(category),
    getCategories(),
    getProjectsByCategory(category, requestedPage),
  ]);

  if (!categoryData) {
    notFound();
  }

  // Clamp an out-of-range ?page= to the last real page (preserves the URL).
  const { pageCount } = projectsPage.pagination;
  if (pageCount >= 1 && requestedPage > pageCount) {
    redirect(`/${category}?page=${pageCount}`);
  }

  return (
    <ProjectListingPage
      category={categoryData}
      categories={categories}
      projects={projectsPage.projects}
      pagination={projectsPage.pagination}
    />
  );
}
