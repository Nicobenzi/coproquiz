"use client";

import { Category, CategoryProgress, Difficulty } from "@/lib/types";
import LevelBadge from "./level-badge";
import ProgressBar from "./progress-bar";
import { getSuccessRate } from "@/lib/scoring";

type CategoryCardProps = {
  category: Category;
  progress?: CategoryProgress;
  currentLevel: Difficulty;
  onClick: () => void;
};

export default function CategoryCard({
  category,
  progress,
  currentLevel,
  onClick,
}: CategoryCardProps) {
  const levelProgress = progress?.[currentLevel];
  const rate = levelProgress
    ? getSuccessRate(levelProgress.correct, levelProgress.answered)
    : 0;
  const isMastered = progress?.mastered ?? false;

  return (
    <button
      onClick={onClick}
      className="relative w-full rounded-2xl glass-card border-2 p-4 sm:p-5 text-left transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 shimmer-hover"
      style={{
        borderColor: isMastered ? category.color : undefined,
        // @ts-expect-error custom focus ring color
        "--tw-ring-color": category.color,
      }}
    >
      {/* Mastered star */}
      {isMastered && (
        <div className="absolute -top-2 -right-2 text-2xl">⭐</div>
      )}

      {/* Emoji + Name */}
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl sm:text-3xl">{category.emoji}</span>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-slate-800 truncate">{category.name}</h3>
          <p className="text-xs text-slate-400 truncate">{category.description}</p>
        </div>
      </div>

      {/* Level badge */}
      <div className="mb-2">
        <LevelBadge level={currentLevel} />
      </div>

      {/* Progress bar */}
      <ProgressBar value={rate} color={category.color} showLabel />

      {/* Locked levels indicator */}
      <div className="flex gap-1 mt-2">
        {(["debutant", "confirme", "expert"] as Difficulty[]).map((d) => {
          const unlocked = progress?.[d]?.unlocked ?? d === "debutant";
          return (
            <span
              key={d}
              className={`text-xs ${unlocked ? "opacity-100" : "opacity-30"}`}
              title={unlocked ? `${d} débloqué` : `${d} verrouillé`}
            >
              {unlocked ? "🔓" : "🔒"}
            </span>
          );
        })}
      </div>
    </button>
  );
}
