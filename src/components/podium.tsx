"use client";

import { PartyPlayer } from "@/lib/types";
import BadgeCollection from "./badge-collection";

const PLAYER_COLORS = ["#6366f1", "#ec4899", "#14b8a6"];
const PODIUM_EMOJIS = ["🥇", "🥈", "🥉"];

type PodiumProps = {
  players: PartyPlayer[];
  onPlayAgain: () => void;
  onHome: () => void;
};

export default function Podium({ players, onPlayAgain, onHome }: PodiumProps) {
  // Trier par score décroissant
  const ranked = [...players].sort((a, b) => {
    if (b.badges.length !== a.badges.length) return b.badges.length - a.badges.length;
    return b.score - a.score;
  });

  const winner = ranked[0];

  return (
    <div className="w-full max-w-lg mx-auto text-center animate-fade-in-up">
      {/* Confetti emoji */}
      <div className="text-4xl sm:text-5xl mb-3 sm:mb-4 animate-celebrate">🎊</div>
      <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-1">
        {winner.name} remporte la partie !
      </h2>
      <p className="text-slate-500 mb-8">
        {winner.badges.length} badges · {winner.score} points
      </p>

      {/* Classement */}
      <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
        {ranked.map((player, rank) => {
          const originalIndex = players.findIndex((p) => p.name === player.name);
          return (
            <div
              key={player.name}
              className={`rounded-2xl border-2 p-4 sm:p-5 ${
                rank === 0
                  ? "border-amber-400 bg-amber-50"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{PODIUM_EMOJIS[rank] || "🏅"}</span>
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold text-white"
                  style={{ backgroundColor: PLAYER_COLORS[originalIndex] }}
                >
                  {player.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 text-left">
                  <p className="font-bold text-slate-800">{player.name}</p>
                  <p className="text-sm text-slate-500">
                    {player.score} points · {player.badges.length}/9 badges
                  </p>
                </div>
              </div>

              <BadgeCollection
                badges={player.badges}
                badgeProgress={player.badgeProgress}
              />
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <button
          onClick={onPlayAgain}
          className="w-full py-3 rounded-xl bg-purple-600 text-white font-semibold transition-all hover:bg-purple-700"
        >
          Revanche ! 🔥
        </button>
        <button
          onClick={onHome}
          className="w-full py-3 rounded-xl bg-slate-100 text-slate-700 font-semibold transition-all hover:bg-slate-200"
        >
          ← Retour à l&apos;accueil
        </button>
      </div>
    </div>
  );
}
