import Image from "next/image";
import { ButtonLink } from "@/components/ui/button";

const stats = [
  { label: "Founded", value: "2008" },
  { label: "Projects", value: "142" },
  { label: "Studios", value: "02" },
];

export function Hero() {
  return (
    <section className="border-b border-line-strong bg-paper">
      <div className="mx-auto grid max-w-[1360px] gap-12 px-6 py-16 md:px-14 md:py-24 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
        <div className="flex flex-col max-w-[620px]">

          {/* Top Label */}
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-micro">
            Multidisciplinary Practice / Est. 2008
          </p>

          {/* Hero Heading */}
          <h1 className="mt-10 font-serif text-5xl uppercase leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-[88px]">
            Practice
            <br />
            <span className="font-light italic text-[#d7d2ca]">
              Architect
            </span>
          </h1>

          {/* Description */}
          <p className="mt-10 max-w-[520px] text-[15px] leading-[1.9] text-copy">
            A multidisciplinary studio working across architecture,
            interiors, planning and landscape, building considered,
            site-specific environments with a quiet rigor.
          </p>

          {/* Stats */}
          <div className="mt-12">
            <dl className="grid grid-cols-3 border-t border-line-strong pt-8">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col gap-3"
                >
                  <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                    {stat.label}
                  </dt>

                  <dd className="font-serif text-[36px] leading-none text-white">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

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
              alt="Portrait of the founding architect of Practice Architect"
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
