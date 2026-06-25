import { cn } from "@/lib/utils";
import Image from "next/image";

type LogoProps = {
  /** Render in white for use on dark surfaces (e.g. the footer). */
  inverted?: boolean;
  className?: string;
};

/**
 * The Practice Architects brand mark — a monochrome diamond glyph paired
 * with the serif wordmark. Used in the Navbar and Footer.
 */
export function Logo() {
  return (
    <div className="relative h-[clamp(550px,7vw,68px)] w-[clamp(165px,18vw,235px)] shrink-0">
      <Image
        src="/logo-tarns.webp"
        alt="Practice Architects mark"
        fill
        priority
        sizes="(max-width: 640px) 165px, (max-width: 1024px) 200px, 235px"
        className="object-contain object-left"
      />
    </div>
  );
}