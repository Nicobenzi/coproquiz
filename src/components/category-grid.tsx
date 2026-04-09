"use client";

import { useRouter } from "next/navigation";
import { categories } from "@/data/themes";
import { PlayerProgress, Difficulty } from "@/lib/types";
import { getCurrentLevel } from "@/lib/storage";
import CategoryCard from "./category-card";

type CategoryGridProps = {
  progress: PlayerProgress;
  forcedLevel?: Difficulty | null;
};

export default function CategoryGrid({ progress, forcedLevel }: CategoryGridProps) {
  const router = useRouter();

  const handleClick = (slug: string, level: Difficulty) => {
    // Store the chosen level in sessionStorage so the quiz page can read it
    sessionStorage.setItem("solo_forced_level", level);
    router.push(`/solo/${slug}`);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 w-full max-w-4xl stagger-children">
      {categories.map((cat) => {
        const autoLevel: Difficulty = getCurrentLevel(progress, cat.slug);
        const displayLevel = forcedLevel ?? autoLevel;
        const catProgress = progress.categories[cat.slug];
        const isLocked = forcedLevel && !catProgress?.[forcedLevel]?.unlocked;

        return (
          <CategoryCard
            key={cat.slug}
            category={cat}
            progress={catProgress}
            currentLevel={displayLevel}
            isLocked={!!isLocked}
            onClick={() => handleClick(cat.slug, displayLevel)}
          />
        );
      })}
    </div>
  );
}
