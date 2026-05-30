import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BackToTopButton } from "@/components/ui/BackToTopButton";
import { getCategories } from "@/lib/categories";

export const metadata: Metadata = {
  title: {
    default:
      "Practice Architect — Architecture, Interior, Planning & Landscape",
    template: "%s · Practice Architect",
  },
  description:
    "Practice Architect is a multidisciplinary studio working across architecture, interior, planning and landscape — building considered, site-specific environments with a quiet rigor.",
  keywords: [
    "architecture",
    "interior design",
    "urban planning",
    "landscape architecture",
    "Practice Architect",
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Fetched once here and passed into the nav chrome as props, so the
  // client Navbar never needs to be async or fetch on its own.
  const categories = await getCategories();

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-paper text-ink antialiased">
        <Navbar categories={categories} />
        <main className="flex-1">{children}</main>
        <Footer categories={categories} />
        <BackToTopButton />
      </body>
    </html>
  );
}
