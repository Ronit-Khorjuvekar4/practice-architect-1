import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategory } from "@/lib/categories";
import { getProject, projects } from "@/lib/projects";
import { ProjectDetailLayout } from "@/components/project/ProjectDetailLayout";

type ProjectPageProps = {
  params: Promise<{ category: string; slug: string }>;
};

/** Pre-render every known project route at build time. */
export function generateStaticParams() {
  return projects.map((project) => ({
    category: project.category,
    slug: project.slug,
  }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { category, slug } = await params;
  const categoryData = getCategory(category);

  if (!categoryData) {
    return { title: "Not Found" };
  }

  const project = getProject(category, slug);

  if (!project) {
    return { title: "Not Found" };
  }

  return {
    title: project.title,
    description: project.title,
    openGraph: {
      title: `${project.title} / ${categoryData.label}`,
      description: project.title,
    },
  };
}

/**
 * Dynamic project detail route: handles /[category]/[slug] for every
 * project across all four disciplines from a single file.
 */
export default async function ProjectPage({ params }: ProjectPageProps) {
  const { category, slug } = await params;
  const categoryData = getCategory(category);

  if (!categoryData) {
    notFound();
  }

  const project = getProject(category, slug);

  if (!project) {
    notFound();
  }

  return <ProjectDetailLayout project={project} category={categoryData} />;
}
