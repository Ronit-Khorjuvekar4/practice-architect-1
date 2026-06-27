import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BackToTopButton } from "@/components/ui/BackToTopButton";

export const metadata: Metadata = {
  title: {
    default:
      "Practice Architects — Architecture, Interior, Planning & Landscape",
    template: "%s · Practice Architects",
  },
  description:
    "Practice Architects is a multidisciplinary studio working across architecture, interior, planning and landscape — building considered, site-specific environments with a quiet rigor.",
  keywords: [
    "architecture",
    "interior design",
    "urban planning",
    "landscape architecture",
    "Practice Architects",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-paper text-ink antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <BackToTopButton />
      </body>
    </html>
  );
}
