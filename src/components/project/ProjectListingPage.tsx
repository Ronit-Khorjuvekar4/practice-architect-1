import type { Category, Project } from "@/types/project";
import { ListingHero } from "@/components/sections/ListingHero";
import { ProjectGrid } from "@/components/project/ProjectGrid";
import { ButtonLink } from "@/components/ui/button";

type ProjectListingPageProps = {
  category: Category;
  projects: Project[];
};

export function ProjectListingPage({
  category,
  projects,
}: ProjectListingPageProps) {
  const hasProjects = projects.length > 0;

  return (
    <>
      <ListingHero category={category} projects={projects} />

      <section className="border-b border-line-strong bg-panel">
        <div className="mx-auto max-w-[1360px] px-6 py-16 md:px-14 md:py-20">
          {hasProjects ? (
            <ProjectGrid projects={projects} columns={3} />
          ) : (
            <div className="flex flex-col items-center justify-center border border-line bg-card px-6 py-24 text-center">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-micro">
                {category.label} / Portfolio
              </span>
              <h2 className="mt-5 font-serif text-4xl uppercase tracking-tight text-white">
                No Projects Yet
              </h2>
              <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-copy">
                Work in this discipline is being prepared for publication.
                Please check back soon.
              </p>
              <ButtonLink href="/" variant="secondary" className="mt-8">
                Back to Home
              </ButtonLink>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
