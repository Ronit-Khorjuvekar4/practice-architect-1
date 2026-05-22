import { categories } from "@/lib/categories";
import { CategoryCard } from "@/components/category/CategoryCard";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function PracticeSection() {
  return (
    <section
      id="selected-work"
      className="scroll-mt-[100px] border-b border-line-strong bg-panel"
    >
      <div className="mx-auto max-w-[1360px] px-6 py-20 md:px-14 md:py-28">
        <SectionHeading
          index="01"
          eyebrow="Disciplines"
          title="Selected Practice"
          description="Four entry points into the studio portfolio; each card opens its own collection of built and unbuilt work."
        />
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category, i) => (
            <CategoryCard
              key={category.slug}
              category={category}
              index={i + 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
