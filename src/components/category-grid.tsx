"use client";

import { useRouter } from "next/navigation";
import { categories } from "@/data/themes";
import { PlayerProgress, Difficulty } from "@/lib/types";
import { getCurrentLevel } from "@/lib/storage";
import CategoryCard from "./category-card";

type CategoryGridProps = {
  progress: PlayerProgress;
};

export default function CategoryGrid({ progress }: CategoryGridProps) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 w-full max-w-4xl stagger-children">
      {categories.map((cat) => {
        const currentLevel: Difficulty = getCurrentLevel(progress, cat.slug);
        const catProgress = progress.categories[cat.slug];

        return (
          <CategoryCard
            key={cat.slug}
            category={cat}
            progress={catProgress}
            currentLevel={currentLevel}
            onClick={() => router.push(`/solo/${cat.slug}`)}
          />
        );
      })}
    </div>
  );
}
