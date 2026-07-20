import { Hero } from "@/components/sections/Hero";
import { PracticeSection } from "@/components/sections/PracticeSection";
import { AchievementsCarousel } from "@/components/sections/AchievementsCarousel";
import { CompetitionsSection } from "@/components/sections/CompetitionsSection";
import { getCategories } from "@/lib/categories";

export default async function HomePage() {
  const categories = await getCategories();

  return (
    <>
      <Hero />
      <PracticeSection categories={categories} />
      <AchievementsCarousel />
      <CompetitionsSection />
    </>
  );
}
