import { competitions } from "@/lib/competitions";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function CompetitionsSection() {
  const half = Math.ceil(competitions.length / 2);
  const columns = [competitions.slice(0, half), competitions.slice(half)];

  return (
    <section className="border-b border-line-strong bg-paper">
      <div className="mx-auto max-w-[1360px] px-6 py-20 md:px-14 md:py-28">
        <SectionHeading
          index="02"
          eyebrow="Submissions"
          title="Competitions"
          description="Open, invited and international competition entries from the studio archive."
        />

        <div className="mt-12 grid border-t border-line-strong md:grid-cols-2 md:gap-x-20">
          {columns.map((column, columnIndex) => (
            <ul key={columnIndex === 0 ? "left" : "right"}>
              {column.map((competition, rowIndex) => {
                const number = columnIndex * half + rowIndex + 1;

                return (
                  <li
                    key={competition.name}
                    className="group grid grid-cols-[2rem_1fr_auto] items-baseline gap-4 border-b border-line py-5 transition-colors last:border-b-0 hover:border-accent"
                  >
                    <span className="font-mono text-[11px] text-muted">
                      {String(number).padStart(2, "0")}
                    </span>
                    <span className="flex flex-col gap-1">
                      <span className="font-serif text-xl leading-tight text-white transition-transform duration-300 group-hover:translate-x-1">
                        {competition.name}
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                        {competition.type}
                      </span>
                    </span>
                    <span className="font-mono text-[12px] tracking-[0.08em] text-muted">
                      {competition.year}
                    </span>
                  </li>
                );
              })}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
