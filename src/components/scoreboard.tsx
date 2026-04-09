"use client";

import { PartyPlayer } from "@/lib/types";
import { categories } from "@/data/themes";

const PLAYER_COLORS = ["#6366f1", "#ec4899", "#14b8a6"];

type ScoreboardProps = {
  players: PartyPlayer[];
  currentPlayerIndex: number;
};

export default function Scoreboard({ players, currentPlayerIndex }: ScoreboardProps) {
  return (
    <div className="w-full max-w-2xl">
      <div className="flex gap-2 sm:gap-3">
        {players.map((player, i) => (
          <div
            key={i}
            className={`flex-1 rounded-xl p-2 sm:p-3 border-2 transition-all duration-300 min-w-0 ${
              i === currentPlayerIndex
                ? "border-purple-400 bg-purple-50/80 shadow-md shadow-purple-100 glow-ring"
                : "glass-card"
            }`}
            style={i === currentPlayerIndex ? {} : undefined}
          >
            {/* Name + Score */}
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm"
                style={{ backgroundColor: PLAYER_COLORS[i] }}
              >
                {player.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-800 truncate">
                  {player.name}
                </p>
                <p className="text-xs text-slate-500 font-medium">{player.score} pts</p>
              </div>
              {player.streak >= 3 && (
                <span className="text-xs bg-orange-100 text-orange-600 rounded-full px-1.5 py-0.5 font-bold" title={`Série de ${player.streak}`}>
                  🔥{player.streak}
                </span>
              )}
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-1">
              {categories.map((cat) => {
                const hasBadge = player.badges.includes(cat.slug);
                const progress = player.badgeProgress[cat.slug] || 0;

                return (
                  <div
                    key={cat.slug}
                    className="relative"
                    title={
                      hasBadge
                        ? `${cat.name} ✓`
                        : `${cat.name} (${progress}/3)`
                    }
                  >
                    <span
                      className={`text-sm transition-all duration-300 ${hasBadge ? "opacity-100 scale-110" : "opacity-25 grayscale"}`}
                    >
                      {cat.emoji}
                    </span>
                    {!hasBadge && progress > 0 && (
                      <span className="absolute -bottom-0.5 -right-0.5 text-[8px] bg-amber-200 rounded-full w-3 h-3 flex items-center justify-center font-bold text-amber-800">
                        {progress}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
