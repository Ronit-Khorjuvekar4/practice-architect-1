import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategoryBySlug } from "@/lib/categories";
import { getProjectBySlug, getProjectSlugs } from "@/lib/projects";
import { getProjectCover } from "@/lib/media";
import { ProjectDetailLayout } from "@/components/project/ProjectDetailLayout";

type ProjectPageProps = {
  params: Promise<{ category: string; slug: string }>;
};

/** Pre-render every known project route from Strapi at build time. */
export async function generateStaticParams() {
  return getProjectSlugs();
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return { title: "Not Found" };
  }

  // Prefer SEO fields from Strapi's shared.seo component, then fall back to
  // the project's own title / short description / cover image.
  const seo = project.seo;
  const title = seo?.title ?? project.title;
  const description = seo?.description ?? project.shortDescription;
  const ogImage = seo?.ogImage ?? getProjectCover(project);

  return {
    title,
    description,
    alternates: seo?.canonicalUrl
      ? { canonical: seo.canonicalUrl }
      : undefined,
    openGraph: {
      title,
      description,
      type: "article",
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
  };
}

/**
 * Dynamic project detail route — handles /[category]/[slug] for every
 * project across all disciplines from one file.
 */
export default async function ProjectPage({ params }: ProjectPageProps) {
  const { category, slug } = await params;

  const [project, categoryData] = await Promise.all([
    getProjectBySlug(slug),
    getCategoryBySlug(category),
  ]);

  if (!project || !categoryData) {
    notFound();
  }

  // Reject URLs where the slug exists but under a different category,
  // e.g. /interior/house-on-the-cliff when the project is architecture.
  if (project.category !== category) {
    notFound();
  }

  return <ProjectDetailLayout project={project} category={categoryData} />;
}
