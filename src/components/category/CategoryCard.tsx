import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/types/project";

type CategoryCardProps = {
  category: Category;
  index: number;
};

export function CategoryCard({ category, index }: CategoryCardProps) {
  const number = String(index).padStart(2, "0");
  const imageSrc = category.bannerImage?.url || category.img;
  const imageAlt =
    category.bannerImage?.alternativeText ||
    `${category.label} practice discipline`;

  return (
    <Link
      href={`/${category.slug}`}
      className="group flex flex-col border border-line bg-card transition-colors duration-300 hover:border-accent"
    >
      <div className="relative aspect-[3/4] overflow-hidden border-b border-line">
        <Image
          src={imageSrc}
          alt={imageAlt}
          style={{ objectFit: "cover" }}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          fill
        />
        <div className="absolute inset-0 bg-black/20" aria-hidden="true" />
        <span className="absolute right-3 top-3 border border-line-strong bg-paper/90 px-2 py-1 font-mono text-[10px] tracking-[0.18em] text-white backdrop-blur">
          {number}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-micro">
          Practice {number}
        </span>
        <h3 className="font-serif text-2xl uppercase leading-tight tracking-[0.02em] text-white">
          {category.label}
        </h3>
        {/* <p className="line-clamp-3 text-[13px] leading-relaxed text-copy">
          {category.description}
        </p> */}
        <div className="mt-auto flex items-center justify-between border-t border-line pt-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
            View Practice
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
