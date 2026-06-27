import type { Category, Project } from "@/types/project";
// import { StatusBadge } from "@/components/ui/StatusBadge";

type ProjectMetaGridProps = {
  project: Project;
  category: Category;
};

/**
 * Monochrome project information grid matching the detail page brief.
 */
export function ProjectMetaGrid({ project, category }: ProjectMetaGridProps) {
  const items = [
    { label: "Location", value: project.location },
    { label: "Area", value: project.area },
    { label: "Date of Completion", value: project.dateOfCompletion },
  ];

  return (
    <dl className="grid grid-cols-1 gap-x-10 gap-y-7 sm:grid-cols-2">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex flex-col gap-2 border-t border-line pt-4"
        >
          <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
            {item.label}
          </dt>
          <dd className="font-serif text-xl leading-snug text-white">
            {item.value}
          </dd>
        </div>
      ))}
      <div className="flex flex-col gap-2 border-t border-line pt-4">
        <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
          Status
        </dt>
        <dd>
          {/* <StatusBadge status={project.status} /> */}
        </dd>
      </div>
      <div className="flex flex-col gap-2 border-t border-line pt-4">
        <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
          Category
        </dt>
        <dd className="font-serif text-xl leading-snug text-white">
          {category.label}
        </dd>
      </div>
    </dl>
  );
}
