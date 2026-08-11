import type { Category } from "@/types/project";
import type { OtherProject } from "@/types/other-project";

type ProjectIndexProps = {
  category: Category;
  projects: OtherProject[];
};

/** Splits sequential data into equally sized, top-to-bottom columns. */
export function splitIntoBalancedColumns<T>(
  items: T[],
  columnCount: number,
): T[][] {
  const itemsPerColumn = Math.ceil(items.length / columnCount);

  return Array.from({ length: columnCount }, (_, index) =>
    items.slice(index * itemsPerColumn, (index + 1) * itemsPerColumn),
  ).filter((column) => column.length > 0);
}

function ProjectColumns({
  projects,
  columns,
  className,
}: {
  projects: OtherProject[];
  columns: number;
  className: string;
}) {
  const balancedColumns = splitIntoBalancedColumns(projects, columns);

  return (
    <div className={className}>
      {balancedColumns.map((column, columnIndex) => {
        const start =
          balancedColumns
            .slice(0, columnIndex)
            .reduce((total, previousColumn) => total + previousColumn.length, 0) +
          1;

        return (
          <ol
            key={columnIndex}
            start={start}
            className="space-y-3.5"
          >
            {column.map((project, itemIndex) => {
              const position = start + itemIndex;

              return (
                <li
                  key={project.documentId ?? project.slug}
                  value={position}
                  className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-4 text-[15px] leading-[1.6] text-white"
                >
                  <span
                    aria-hidden="true"
                    className="pt-0.5 font-mono text-[11px] tabular-nums tracking-[0.06em] text-muted"
                  >
                    {String(position).padStart(2, "0")}
                  </span>
                  <span>{project.name}</span>
                </li>
              );
            })}
          </ol>
        );
      })}
    </div>
  );
}

function BalancedProjectList({
  projects,
  desktopColumns,
}: {
  projects: OtherProject[];
  desktopColumns: 1 | 2 | 3;
}) {
  if (desktopColumns === 1) {
    return (
      <ProjectColumns
        projects={projects}
        columns={1}
        className="grid max-w-3xl"
      />
    );
  }

  if (desktopColumns === 2) {
    return (
      <>
        <ProjectColumns
          projects={projects}
          columns={1}
          className="grid md:hidden"
        />
        <ProjectColumns
          projects={projects}
          columns={2}
          className="hidden gap-x-14 md:grid md:grid-cols-2 lg:gap-x-20"
        />
      </>
    );
  }

  return (
    <>
      <ProjectColumns
        projects={projects}
        columns={1}
        className="grid md:hidden"
      />
      <ProjectColumns
        projects={projects}
        columns={2}
        className="hidden gap-x-14 md:grid md:grid-cols-2 lg:hidden"
      />
      <ProjectColumns
        projects={projects}
        columns={3}
        className="hidden gap-x-16 lg:grid lg:grid-cols-3"
      />
    </>
  );
}

function desktopColumnCount(projectCount: number): 1 | 2 | 3 {
  if (projectCount <= 6) return 1;
  if (projectCount <= 14) return 2;
  return 3;
}

export function ProjectIndex({ category, projects }: ProjectIndexProps) {
  if (projects.length === 0) return null;

  const countLabel = `${projects.length} ${projects.length === 1 ? "project" : "projects"}`;
  const columns = desktopColumnCount(projects.length);

  return (
    <section aria-labelledby="other-projects-heading" className="bg-paper">
      <div className="mx-auto max-w-[1360px] px-6 pb-16 pt-10 md:px-14 md:pb-20 md:pt-12">
        <header>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-micro">
            Other Projects
          </p>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
            <h2
              id="other-projects-heading"
              className="font-serif text-3xl leading-none text-white sm:text-4xl"
            >
              {category.label}
            </h2>
            <p className="shrink-0 text-[13px] leading-none text-copy">
              {countLabel}
            </p>
          </div>

          <div className="mt-6 border-b border-line-strong" />
        </header>

        <div className="border-b border-line pb-10 pt-8 md:pb-12 md:pt-9">
          <BalancedProjectList
            projects={projects}
            desktopColumns={columns}
          />
        </div>
      </div>
    </section>
  );
}
