import { Hero } from "@/components/sections/Hero";
import { PracticeSection } from "@/components/sections/PracticeSection";
import { AchievementsCarousel } from "@/components/sections/AchievementsCarousel";
import { CompetitionsSection } from "@/components/sections/CompetitionsSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <PracticeSection />
      <CompetitionsSection />
      <AchievementsCarousel />
    </>
  );
}
