import Link from "next/link";
import type { Category, Project } from "@/types/project";
import { ProjectGallery } from "@/components/project/ProjectGallery";
import { ProjectHeroMedia } from "@/components/project/ProjectHeroMedia";
import { ProjectMetaGrid } from "@/components/project/ProjectMetaGrid";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StatusBadge } from "@/components/ui/StatusBadge";

type ProjectDetailLayoutProps = {
  project: Project;
  category: Category;
};

export function ProjectDetailLayout({
  project,
  category,
}: ProjectDetailLayoutProps) {
  const imageCount = project.media.filter(
    (item) => item.type === "image",
  ).length;
  const videoCount = project.media.length - imageCount;
  const galleryDescription =
    videoCount > 0
      ? `${imageCount} image${imageCount === 1 ? "" : "s"} and ${videoCount} video${
          videoCount === 1 ? "" : "s"
        } from ${project.title}.`
      : `${imageCount} project image${imageCount === 1 ? "" : "s"} from ${project.title}.`;

  return (
    <>
      <section className="border-b border-line-strong bg-paper">
        <div className="mx-auto max-w-[1600px] px-6 md:px-14">
          <nav aria-label="Breadcrumb" className="pt-7">
            <ol className="flex flex-wrap items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
              <li>
                <Link href="/" className="transition-colors hover:text-accent">
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="opacity-50">
                /
              </li>
              <li>
                <Link
                  href={`/${category.slug}`}
                  className="transition-colors hover:text-accent"
                >
                  {category.label}
                </Link>
              </li>
              <li aria-hidden="true" className="opacity-50">
                /
              </li>
              <li className="text-white">{project.title}</li>
            </ol>
          </nav>

          <div className="flex items-end justify-between gap-6 pb-5 pt-8 font-mono text-[11px] uppercase tracking-[0.18em] text-micro">
            <span>Featured Image</span>
            <span className="hidden sm:inline">16:9</span>
          </div>

          <figure className="relative mb-8 aspect-[16/9] w-full overflow-hidden border border-line-strong bg-card">
            <ProjectHeroMedia
              media={project.media}
              title={project.title}
              categoryLabel={category.label}
            />
          </figure>
        </div>
      </section>

      <section className="border-b border-line-strong bg-panel">
        <div className="mx-auto max-w-[1360px] px-6 py-16 md:px-14 md:py-24">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-micro">
                Project Overview
              </span>
              <h1 className="mt-5 max-w-5xl font-serif text-5xl uppercase leading-[0.98] tracking-normal text-white sm:text-6xl lg:text-8xl">
                {project.title}
              </h1>
              <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                {category.label} / {project.area} / {project.location}
              </p>
            </div>
            <StatusBadge status={project.status} className="mt-1" />
          </div>

          <div className="mt-12 grid gap-12 border-t border-line-strong pt-10 lg:grid-cols-2 lg:gap-20">
            <ProjectMetaGrid project={project} category={category} />
            <article className="max-w-[68ch]">
              <p className="font-serif text-2xl leading-[1.4] text-white">
                {project.shortDescription}
              </p>
              <p className="mt-7 text-[15px] leading-[1.8] text-copy">
                {project.description}
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="border-b border-line-strong bg-paper">
        <div className="mx-auto max-w-[1600px] px-6 py-16 md:px-14 md:py-24">
          <SectionHeading
            index="04"
            eyebrow="Media"
            title="Project Gallery"
            description={galleryDescription}
          />
          <div className="mt-12">
            <ProjectGallery media={project.media} title={project.title} />
          </div>
        </div>
      </section>

      <section className="border-b border-line-strong bg-panel">
        <div className="mx-auto flex max-w-[1360px] flex-col gap-5 px-6 py-14 md:flex-row md:items-center md:justify-between md:px-14 md:py-20">
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
            Back to {category.label} Portfolio
          </span>
          <ButtonLink href={`/${category.slug}`} variant="primary">
            Back to {category.label}
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
