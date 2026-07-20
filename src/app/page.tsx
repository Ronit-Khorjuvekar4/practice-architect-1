import { Hero } from "@/components/sections/Hero";
import { PracticeSection } from "@/components/sections/PracticeSection";
import { AchievementsCarousel } from "@/components/sections/AchievementsCarousel";
import { CompetitionsSection } from "@/components/sections/CompetitionsSection";
import { getCategories } from "@/lib/categories";
import { getPhotoGallery } from "@/lib/photo-gallery";

export default async function HomePage() {
  const [categories, photoGallery] = await Promise.all([
    getCategories(),
    getPhotoGallery(),
  ]);

  return (
    <>
      <Hero />
      <PracticeSection categories={categories} />
      <AchievementsCarousel images={photoGallery} />
      <CompetitionsSection />
    </>
  );
}
