type SectionHeadingProps = {
  /** Two-digit editorial index, e.g. "01". */
  index: string;
  /** Uppercase micro-label shown after the index. */
  eyebrow: string;
  /** Serif section title. */
  title: string;
  /** Optional supporting copy shown to the right on wider screens. */
  description?: string;
};

/**
 * The numbered editorial section header used across the homepage sections.
 * Keeps the "01 / Eyebrow" + serif title + supporting copy rhythm consistent.
 */
export function SectionHeading({
  index,
  eyebrow,
  title,
}: SectionHeadingProps) {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-12">
      <div>
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-micro">
          {index} / {eyebrow}
        </span>
        <h2 className="mt-3 font-serif text-3xl uppercase leading-tight tracking-[0.02em] text-white sm:text-4xl">
          {title}
        </h2>
      </div>
    </div>
  );
}
