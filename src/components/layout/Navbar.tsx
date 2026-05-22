"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { categories } from "@/lib/categories";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

const navLinks: { label: string; href: string }[] = [
  { label: "Home", href: "/" },
  ...categories.map((category) => ({
    label: category.label,
    href: `/${category.slug}`,
  })),
];

export function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex h-[82px] max-w-[1360px] items-center justify-between px-6 md:px-14">
        <Link href="/" aria-label="Practice Architect home">
          <Logo />
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-10">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={cn(
                    "border-b pb-1 text-[13px] uppercase tracking-[0.14em] transition-colors duration-200",
                    isActive(link.href)
                      ? "border-accent text-white"
                      : "border-transparent text-copy hover:border-accent hover:text-white",
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
          className="flex h-10 w-10 items-center justify-center border border-line text-white transition-colors hover:border-accent hover:bg-accent hover:text-button-text md:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
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
          className="border-t border-line bg-panel md:hidden"
        >
          <ul className="mx-auto max-w-[1360px] px-6">
            {navLinks.map((link) => (
              <li
                key={link.href}
                className="border-b border-line last:border-b-0"
              >
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={cn(
                    "block py-4 text-[13px] uppercase tracking-[0.14em] transition-colors",
                    isActive(link.href)
                      ? "text-white"
                      : "text-copy hover:text-white",
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
