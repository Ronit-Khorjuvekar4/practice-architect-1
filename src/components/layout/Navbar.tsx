"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Category } from "@/types/project";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

type NavbarProps = {
  /** Practice categories, supplied by the root layout (Strapi-backed). */
  categories: Category[];
};

export function Navbar({ categories }: NavbarProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks: { label: string; href: string }[] = [
    { label: "Home", href: "/" },
    ...categories.map((category) => ({
      label: category.label,
      href: `/${category.slug}`,
    })),
  ];

  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-[999] border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex h-[82px] max-w-[1360px] items-center justify-between gap-4 px-6 md:px-14">
        <div className="relative z-[1000]">
          <Link href="/" aria-label="Practice Architects home">
            <Logo />
          </Link>
        </div>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center md:gap-5 lg:gap-10">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={cn(
                    "block py-4 text-[13px] uppercase tracking-[0.14em] transition-colors",
                    isActive(link.href)
                      ? "text-white"
                      : "text-copy hover:text-white"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          className="relative z-[1000] flex h-10 w-10 items-center justify-center border border-line text-white transition-colors hover:border-accent hover:bg-accent hover:text-button-text md:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="sr-only">
            {menuOpen ? "Close menu" : "Open menu"}
          </span>

          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            {menuOpen ? (
              <path d="M5 5l14 14M19 5L5 19" />
            ) : (
              <path d="M3 6h18M3 12h18M3 18h18" />
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile"
          className="relative z-[1000] border-t border-line bg-panel md:hidden"
        >
          <ul className="mx-auto max-w-[1360px] px-6">
            {navLinks.map((link) => (
              <li
                key={link.href}
                className="border-b border-line last:border-b-0"
              >
                <Link
                  href={link.href}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={cn(
                    "relative z-[1000] block w-full py-4 text-[13px] uppercase tracking-[0.14em] transition-colors",
                    isActive(link.href)
                      ? "text-white"
                      : "text-copy hover:text-white"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}