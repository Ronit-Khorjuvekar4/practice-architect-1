import Link from "next/link";
import type { Category, Project } from "@/types/project";
import { GALLERY_PAGE_SIZE } from "@/lib/media";
import { ProjectGallery } from "@/components/project/ProjectGallery";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/SectionHeading";
// import { StatusBadge } from "@/components/ui/StatusBadge";

type ProjectDetailLayoutProps = {
  project: Project;
  category: Category;
};

export function ProjectDetailLayout({
  project,
  category,
}: ProjectDetailLayoutProps) {
  const galleryMedia = Array.isArray(project.project_media)
    ? project.project_media
    : [];
  const imageCount = galleryMedia.filter(
    (item) => item.type === "image",
  ).length;
  const totalGalleryItems = galleryMedia.length;
  const videoCount = totalGalleryItems - imageCount;
  const galleryDescription =
    videoCount > 0
      ? `${imageCount} image${imageCount === 1 ? "" : "s"} and ${videoCount} video${videoCount === 1 ? "" : "s"
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
        </div>
      </section>

      <section className="border-b border-line-strong bg-panel">
        <div className="mx-auto max-w-[1360px] px-6 py-16 md:px-14 md:py-24">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-micro">
                Project Overview
              </span>
              <h1 className="mt-5 max-w-5xl font-serif uppercase leading-[0.98] tracking-normal text-white text-3xl sm:text-6xl">
                {project.title}
              </h1>
            </div>
            {/* <StatusBadge status={project.status} className="mt-1" /> */}
          </div>
        </div>
      </section>

      <section className="border-b border-line-strong bg-paper">
        <div className="mx-auto max-w-[1600px] px-6 py-16 md:px-14 md:py-24">
          <SectionHeading
            index="01"
            eyebrow="Media"
            title="Project Gallery"
            description={galleryDescription}
          />
          <div className="mt-12">
            <ProjectGallery
              key={project.documentId ?? project.slug}
              initialMedia={galleryMedia.slice(0, GALLERY_PAGE_SIZE)}
              total={totalGalleryItems}
              documentId={project.documentId ?? ""}
              title={project.title}
            />
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
