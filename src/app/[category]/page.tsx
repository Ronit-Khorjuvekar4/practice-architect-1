import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategories, getCategoryBySlug, getCategorySlugs } from "@/lib/categories";
import { getProjectsByCategory } from "@/lib/projects";
import { ProjectListingPage } from "@/components/project/ProjectListingPage";

type CategoryPageProps = {
  params: Promise<{ category: string }>;
};

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
    description: categoryData.description,
  };
}

/**
 * Dynamic category listing route — handles /architecture, /interior,
 * /planning, /landscape (and any future Strapi category) from one file.
 */
export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;

  // Fetched in parallel — none of these depend on each other.
  const [categoryData, categories, projects] = await Promise.all([
    getCategoryBySlug(category),
    getCategories(),
    getProjectsByCategory(category),
  ]);

  if (!categoryData) {
    notFound();
  }
  
  console.log("categoryData:",categoryData)

  return (
    <ProjectListingPage
      category={categoryData}
      categories={categories}
      projects={projects}
    />
  );
}
