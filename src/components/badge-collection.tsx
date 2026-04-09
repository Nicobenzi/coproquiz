"use client";

import { categories } from "@/data/themes";

type BadgeCollectionProps = {
  badges: string[];
  badgeProgress: Record<string, number>;
};

export default function BadgeCollection({ badges, badgeProgress }: BadgeCollectionProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {categories.map((cat) => {
        const hasBadge = badges.includes(cat.slug);
        const progress = badgeProgress[cat.slug] || 0;

        return (
          <div
            key={cat.slug}
            className={`flex flex-col items-center p-2 rounded-lg border transition-all ${
              hasBadge
                ? "border-amber-400 bg-amber-50"
                : "border-slate-200 bg-white"
            }`}
          >
            <span className={`text-2xl ${hasBadge ? "" : "grayscale opacity-40"}`}>
              {cat.emoji}
            </span>
            <span className="text-[10px] text-slate-500 text-center mt-1 leading-tight">
              {cat.name}
            </span>
            {hasBadge ? (
              <span className="text-xs text-amber-600 font-bold mt-0.5">✓</span>
            ) : (
              <div className="flex gap-0.5 mt-0.5">
                {[0, 1, 2].map((dot) => (
                  <div
                    key={dot}
                    className={`w-1.5 h-1.5 rounded-full ${
                      dot < progress ? "bg-amber-400" : "bg-slate-200"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
