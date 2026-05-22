import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categories, getCategory } from "@/lib/categories";
import { getProjectsByCategory } from "@/lib/projects";
import { ProjectListingPage } from "@/components/project/ProjectListingPage";

type CategoryPageProps = {
  params: Promise<{ category: string }>;
};

/** Pre-render the four known category routes at build time. */
export function generateStaticParams() {
  return categories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const categoryData = getCategory(category);

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
 * /planning and /landscape from a single file.
 */
export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const categoryData = getCategory(category);

  if (!categoryData) {
    notFound();
  }

  const categoryProjects = getProjectsByCategory(category);

  return (
    <ProjectListingPage category={categoryData} projects={categoryProjects} />
  );
}
