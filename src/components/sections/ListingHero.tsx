import Link from "next/link";
import type { Category, Project } from "@/types/project";

type ListingHeroProps = {
  category: Category;
  /** All categories — used to show this discipline's position in the set. */
  categories: Category[];
  projects: Project[];
};

export function ListingHero({
  category,
  categories,
  projects,
}: ListingHeroProps) {
  const position = categories.findIndex((c) => c.slug === category.slug) + 1;

  // const stats = [
  //   { label: "Total", value: projects.length },
  //   {
  //     label: "Completed",
  //     value: projects.filter((p) => p.status === "Completed").length,
  //   },
  //   {
  //     label: "In Progress",
  //     value: projects.filter((p) => p.status === "In Progress").length,
  //   },
  // ];

  return (
    <section className="border-b border-line-strong bg-paper">
      <div className="mx-auto max-w-[1360px] px-6 md:px-14">
        <nav aria-label="Breadcrumb" className="pt-7">
          <ol className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
            <li>
              <Link href="/" className="transition-colors hover:text-accent">
                Home
              </Link>
            </li>
            <li aria-hidden="true" className="opacity-50">
              /
            </li>
            <li className="text-white">{category.label}</li>
          </ol>
        </nav>

        <div className="grid gap-10 py-10 md:py-16 lg:grid-cols-[1.4fr_1fr] lg:items-end lg:gap-20">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-micro">
              Discipline / {String(position).padStart(2, "0")} of{" "}
              {String(categories.length).padStart(2, "0")}
            </span>

            <h1 className="mt-5 font-serif uppercase text-white leading-none whitespace-normal lg:whitespace-nowrap text-[clamp(2.5rem,7vw,4.5rem)]">
              {category.label} Portfolio
            </h1>
          </div>

          {/* <div className="flex flex-col gap-6">
            <p className="text-[14px] leading-[1.7] text-copy">
              {category.description}
            </p>
            <dl className="grid grid-cols-3 border-y border-line-strong py-4">
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col gap-1">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                    {stat.label}
                  </dt>
                  <dd className="font-serif text-3xl text-white">
                    {String(stat.value).padStart(2, "0")}
                  </dd>
                </div>
              ))}
            </dl>
          </div> */}
        </div>
      </div>
    </section>
  );
}
