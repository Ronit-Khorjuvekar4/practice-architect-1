import Image from "next/image";
import { ButtonLink } from "@/components/ui/button";

const stats = [
  { label: "Founded", value: "2008" },
];

export function Hero() {
  return (
    <section className="border-b border-line-strong bg-paper">
      <div className="mx-auto grid max-w-[1360px] gap-12 px-6 py-16 md:px-14 md:py-24 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
        <div className="flex flex-col max-w-[620px]">

          {/* Top Label */}
          <div className="inline-flex w-fit items-center gap-3 rounded-full border border-line-strong bg-card/40 px-4 py-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#d7d2ca]" aria-hidden="true" />

            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-micro">
              Multidisciplinary Practice
            </p>

            <span className="h-4 w-px bg-line-strong" aria-hidden="true" />

            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#d7d2ca]">
              Founded 2008
            </p>
          </div>

          {/* Hero Heading */}
          <h1 className="mt-10 font-serif text-5xl uppercase leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-[88px]">
            Practice
            <br />
            <span className="font-light italic text-[#d7d2ca]">
              Architects
            </span>
          </h1>


          {/* Description */}
          <p className="mt-10 max-w-[520px] text-[15px] leading-[1.9] text-copy">
            A multidisciplinary studio working across architecture,
            interiors, planning and landscape, building considered,
            site-specific environments with a quiet rigor.
          </p>
          
          {/* CTA */}
          <div className="mt-14">
            <ButtonLink
              href="#selected-work"
              variant="primary"
            >
              Explore the practice
            </ButtonLink>
          </div>

        </div>

        <div className="relative">
          <div className="relative aspect-[4/5] w-full overflow-hidden border border-line-strong bg-card">
            <Image
              src="/founder.png"
              alt="Portrait of the founding architect of Practice Architects"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/25" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}
