import type { Project } from "@/types/project";
import { ProjectCard } from "@/components/project/ProjectCard";

type ProjectGridProps = {
  projects: Project[];
  /** Columns on large screens — defaults to a 3-up editorial grid. */
  columns?: 3 | 4;
};

const columnClass: Record<3 | 4, string> = {
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
};

const imageSizesByColumns: Record<3 | 4, string> = {
  3: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  4: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw",
};

/** Responsive grid of `ProjectCard`s — 1 / 2 / 3-4 columns. */
export function ProjectGrid({ projects, columns = 3 }: ProjectGridProps) {
  return (
    <div
      className={`grid grid-cols-1 gap-x-7 gap-y-12 sm:grid-cols-2 ${columnClass[columns]}`}
    >
      {projects.map((project, i) => (
        <ProjectCard
          key={`${project.category}/${project.slug}`}
          project={project}
          index={i + 1}
          imageSizes={imageSizesByColumns[columns]}
        />
      ))}
    </div>
  );
}
