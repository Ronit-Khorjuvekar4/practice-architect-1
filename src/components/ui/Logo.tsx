import { cn } from "@/lib/utils";
import Image from "next/image";

type LogoProps = {
  /** Render in white for use on dark surfaces (e.g. the footer). */
  inverted?: boolean;
  className?: string;
};

/**
 * The Practice Architect brand mark — a monochrome diamond glyph paired
 * with the serif wordmark. Used in the Navbar and Footer.
 */
export function Logo() {
  return (
    <div className="relative h-11 w-[150px] sm:h-12 sm:w-[170px] md:h-200 md:w-[190px]">
      <Image
        src="/logo-tarns.webp"
        alt="Practice Architect mark"
        fill
        priority
        sizes="190px"
        className="object-contain object-left"
      />
    </div>
  );
}