import Link from "next/link";
import { categories } from "@/lib/categories";
import { Logo } from "@/components/ui/Logo";
import Image from "next/image";

const contactLines = [
  "studio@practicearchitect.co",
  "+44 (0) 20 7946 0911",
  "22 Foundry Lane, Studio 4",
  "Shoreditch, London EC2A 3DB",
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-paper text-white">
      <div className="mx-auto max-w-[1360px] px-6 md:px-14">
        <div className="grid gap-12 py-16 md:grid-cols-3 md:py-20">
          <div>
            <div className="relative h-11 w-[150px] sm:h-12 sm:w-[170px] md:h-20 md:w-[190px]">
              <Image
                src="/logo-tarns.webp"
                alt="Practice Architects mark"
                fill
                priority
                sizes="190px"
                className="object-contain object-left"
              />
            </div>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-muted">
              A studio for architecture, interior, planning and landscape.
              Drawing in black, building in light.
            </p>
          </div>

          <nav aria-label="Footer">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-micro">
              Navigate
            </h2>
            <ul className="mt-5 flex flex-col gap-3">
              <li>
                <Link
                  href="/"
                  className="text-sm text-copy transition-colors hover:text-accent"
                >
                  Home
                </Link>
              </li>
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/${category.slug}`}
                    className="text-sm text-copy transition-colors hover:text-accent"
                  >
                    {category.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-micro">
              Contact
            </h2>
            <ul className="mt-5 flex flex-col gap-3">
              {contactLines.map((line) => (
                <li key={line} className="text-sm text-copy">
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-line py-6 font-mono text-[11px] tracking-[0.08em] text-muted sm:flex-row sm:items-center sm:justify-between">
          <span>(c) {year} Practice Architects / All rights reserved.</span>
          <span>Architecture / Interior / Planning / Landscape</span>
        </div>
      </div>
    </footer>
  );
}
