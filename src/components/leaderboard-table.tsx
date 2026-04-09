"use client";

import { PlayerProgress, Difficulty } from "@/lib/types";
import { categories } from "@/data/themes";
import { getSuccessRate } from "@/lib/scoring";
import { getCurrentLevel } from "@/lib/storage";

const RANK_EMOJIS = ["🥇", "🥈", "🥉"];

type LeaderboardTableProps = {
  players: PlayerProgress[];
};

export default function LeaderboardTable({ players }: LeaderboardTableProps) {
  if (players.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">🏆</div>
        <p className="text-slate-500">Aucun joueur enregistré</p>
        <p className="text-sm text-slate-400 mt-1">
          Joue une partie solo pour apparaître ici !
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {players.map((player, rank) => {
        const masteredCount = categories.filter(
          (c) => player.categories[c.slug]?.mastered
        ).length;

        // Count total correct / total answered
        let totalCorrect = 0;
        let totalAnswered = 0;
        categories.forEach((c) => {
          const cat = player.categories[c.slug];
          if (cat) {
            (["debutant", "confirme", "expert"] as Difficulty[]).forEach((d) => {
              totalCorrect += cat[d].correct;
              totalAnswered += cat[d].answered;
            });
          }
        });

        const globalRate = getSuccessRate(totalCorrect, totalAnswered);

        return (
          <div
            key={player.name}
            className={`rounded-2xl border-2 p-4 transition-all duration-300 ${
              rank === 0
                ? "border-amber-400 bg-amber-50/80 shadow-md shadow-amber-100"
                : "glass-card"
            }`}
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xl w-8 text-center">
                {RANK_EMOJIS[rank] || `${rank + 1}.`}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-800 truncate">{player.name}</p>
                <p className="text-xs text-slate-500">
                  {player.gamesPlayed} parties · {globalRate}% de réussite
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-indigo-600">
                  {player.totalScore}
                </p>
                <p className="text-xs text-slate-400">points</p>
              </div>
            </div>

            {/* Category progress */}
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => {
                const catProgress = player.categories[cat.slug];
                const level = getCurrentLevel(player, cat.slug);
                const isMastered = catProgress?.mastered;

                let levelIcon = "🌱";
                if (isMastered) levelIcon = "⭐";
                else if (level === "expert") levelIcon = "🏆";
                else if (level === "confirme") levelIcon = "📘";

                return (
                  <div
                    key={cat.slug}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${
                      isMastered
                        ? "bg-amber-100 text-amber-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                    title={`${cat.name}: ${level}${isMastered ? " (maîtrisé)" : ""}`}
                  >
                    <span>{cat.emoji}</span>
                    <span>{levelIcon}</span>
                  </div>
                );
              })}
            </div>

            {/* Mastered counter */}
            {masteredCount > 0 && (
              <p className="text-xs text-amber-600 mt-2">
                ⭐ {masteredCount}/9 catégories maîtrisées
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
