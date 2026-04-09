"use client";

import { Difficulty } from "@/lib/types";

const LEVEL_CONFIG: Record<Difficulty, { label: string; bg: string; text: string; icon: string }> = {
  debutant: { label: "Débutant", bg: "bg-emerald-100", text: "text-emerald-700", icon: "🌱" },
  confirme: { label: "Confirmé", bg: "bg-blue-100", text: "text-blue-700", icon: "📘" },
  expert: { label: "Expert", bg: "bg-amber-100", text: "text-amber-700", icon: "🏆" },
};

type LevelBadgeProps = {
  level: Difficulty;
  size?: "sm" | "md";
};

export default function LevelBadge({ level, size = "sm" }: LevelBadgeProps) {
  const config = LEVEL_CONFIG[level];
  const sizeClass = size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1";

  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium ${config.bg} ${config.text} ${sizeClass}`}>
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </span>
  );
}
