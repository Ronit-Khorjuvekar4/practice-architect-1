import Image from "next/image";
import { ButtonLink } from "@/components/ui/button";

export function Hero() {
  return (
    <section
      className="border-b border-line-strong bg-paper"
      aria-labelledby="studio-introduction"
    >
      <div className="mx-auto grid max-w-[1360px] gap-14 px-6 py-16 md:px-14 md:py-24 lg:grid-cols-[1.08fr_0.92fr] lg:gap-20">
        <div className="flex max-w-[660px] flex-col">

          {/* Top Label */}
          <div className="inline-flex w-fit items-center gap-3 rounded-full border border-line-strong bg-card/40 px-4 py-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#d7d2ca]" aria-hidden="true" />

            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-micro">
              Multidisciplinary Practice
            </p>

            <span className="h-4 w-px bg-line-strong" aria-hidden="true" />

            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#d7d2ca]">
              Founded 2011
            </p>
          </div>

          {/* Hero Heading */}
          <div className="mt-10 sm:align-middle align-middle">
            <Image
              src="/logo-tarns.webp"
              alt="Practice Architects"
              width={520}
              height={220}
              priority
              className="h-auto w-[2800px] sm:w-[420px] lg:w-[560px]"
            />
          </div>


          {/* Studio introduction */}
          <div className="mt-10 max-w-[620px]">
            <p
              id="studio-introduction"
              className="font-mono text-[10px] uppercase tracking-[0.2em] text-micro"
            >
              About the studio
            </p>

            <p className="mt-4 text-[15px] leading-[1.85] text-copy">
              Practice Architects was founded in the year 2011 by Ar. Shashiker
              Chowdhary, who has vast and rich experience in the execution of
              complex projects of varying scales.
            </p>

            <div className="mt-7 border-y border-line">
              <p className="py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-micro">
                Key features
              </p>
              <ul className="divide-y divide-line border-t border-line">
                <li className="grid grid-cols-[2rem_1fr] gap-3 py-3.5 text-[13px] leading-[1.65] text-copy">
                  <span className="font-mono text-[10px] tracking-[0.16em] text-micro" aria-hidden="true">
                    01
                  </span>
                  <span>
                    We design buildings of all use types, ranging from
                    institutional and residential to commercial, including
                    interior design for each.
                  </span>
                </li>
                <li className="grid grid-cols-[2rem_1fr] gap-3 py-3.5 text-[13px] leading-[1.65] text-copy">
                  <span className="font-mono text-[10px] tracking-[0.16em] text-micro" aria-hidden="true">
                    02
                  </span>
                  <span>
                    We have executed over 100 architectural and interior design
                    projects.
                  </span>
                </li>
                <li className="grid grid-cols-[2rem_1fr] gap-3 py-3.5 text-[13px] leading-[1.65] text-copy">
                  <span className="font-mono text-[10px] tracking-[0.16em] text-micro" aria-hidden="true">
                    03
                  </span>
                  <span>
                    We have participated and been shortlisted in national and
                    international design competitions, receiving recognition
                    for our contribution.
                  </span>
                </li>
              </ul>
            </div>

            <p className="mt-6 border-l border-accent pl-4 text-[14px] leading-[1.75] text-copy">
              To ensure that clients receive value for money and quality
              service, we undertake interior design projects on a turnkey
              basis.
            </p>
          </div>

          {/* CTA */}
          <div className="mt-10">
            <ButtonLink
              href="#selected-work"
              variant="primary"
            >
              Explore the practice
            </ButtonLink>
          </div>

        </div>

        <div className="relative lg:pt-12">
          <div className="relative aspect-[4/5] w-full overflow-hidden border border-line-strong bg-card lg:sticky lg:top-28">
            <Image
              src="/home/sachiker.jpeg"
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
