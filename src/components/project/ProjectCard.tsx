import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/types/project";
import { getCategory } from "@/lib/categories";
import { getProjectCover } from "@/lib/media";
// import { StatusBadge } from "@/components/ui/StatusBadge";

type ProjectCardProps = {
  project: Project;
  index?: number;
  imageSizes?: string;
};

export function ProjectCard({
  project,
  index,
  imageSizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
}: ProjectCardProps) {
  const category = getCategory(project.category);
  const categoryLabel = category?.label ?? project.category;

  return (
    <Link
      href={`/${project.category}/${project.slug}`}
      className="group flex flex-col border border-line bg-card transition-colors duration-300 hover:border-accent"
    >
      <div className="relative aspect-[4/5] overflow-hidden border-b border-line bg-panel">
        <Image
          src={getProjectCover(project)}
          alt={`${project.title} ${categoryLabel} project`}
          fill
          sizes={imageSizes}
          className="transition duration-700 ease-out group-hover:scale-105 group-hover:opacity-100"
          style={{ objectFit: "fill", objectPosition: "center" }}
        />
        <div className="absolute inset-0 bg-black/20" aria-hidden="true" />
        {/* <span className="absolute left-3 top-3">
          <StatusBadge status={project.status} />
        </span> */}
        {typeof index === "number" ? (
          <span className="absolute right-3 top-3 border border-line-strong bg-paper/90 px-2 py-1 font-mono text-[10px] tracking-[0.18em] text-white backdrop-blur">
            {String(index).padStart(2, "0")}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
          <span>{categoryLabel}</span>
          {/* <span>{project.dateOfCompletion}</span> */}
        </div>
        <h3 className="font-serif text-2xl uppercase leading-tight tracking-[0.02em] text-white">
          {project.title}
        </h3>
        {/* <p className="text-[12px] uppercase leading-relaxed tracking-[0.06em] text-muted">
          {project.location} / {project.area}
        </p> */}
        <div className="mt-auto flex items-center justify-between border-t border-line pt-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
            View Project
          </span>
          <span className="flex h-8 w-8 items-center justify-center border border-line text-white transition-colors duration-200 group-hover:border-accent group-hover:bg-accent group-hover:text-button-text">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
