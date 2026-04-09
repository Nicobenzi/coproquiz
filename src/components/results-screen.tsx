"use client";

import { Difficulty } from "@/lib/types";
import LevelBadge from "./level-badge";
import { getSuccessRate } from "@/lib/scoring";

type ResultsScreenProps = {
  categoryName: string;
  categoryEmoji: string;
  categoryColor: string;
  correct: number;
  total: number;
  difficulty: Difficulty;
  levelUnlocked: Difficulty | null;
  onRetry: () => void;
  onBack: () => void;
};

export default function ResultsScreen({
  categoryName,
  categoryEmoji,
  categoryColor,
  correct,
  total,
  difficulty,
  levelUnlocked,
  onRetry,
  onBack,
}: ResultsScreenProps) {
  const rate = getSuccessRate(correct, total);
  const isGood = rate >= 70;

  return (
    <div className="w-full max-w-md mx-auto text-center animate-scale-in">
      <div className="glass-card rounded-2xl p-5 sm:p-8">
        {/* Emoji résultat */}
        <div className="text-5xl sm:text-6xl mb-3 sm:mb-4 animate-celebrate">
          {rate === 100 ? "🏆" : isGood ? "🎉" : "💪"}
        </div>

        {/* Catégorie */}
        <p className="text-sm text-slate-500 mb-1">
          {categoryEmoji} {categoryName}
        </p>

        {/* Score */}
        <h2 className="text-3xl sm:text-4xl font-bold mb-2" style={{ color: categoryColor }}>
          {correct}/{total}
        </h2>
        <p className="text-lg text-slate-600 mb-1">{rate}% de réussite</p>
        <div className="mb-6">
          <LevelBadge level={difficulty} size="md" />
        </div>

        {/* Level unlocked */}
        {levelUnlocked && (
          <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4 mb-6 animate-scale-in">
            <p className="text-amber-800 font-bold text-lg mb-1">
              🔓 Niveau débloqué !
            </p>
            <LevelBadge level={levelUnlocked} size="md" />
          </div>
        )}

        {/* Message */}
        <p className="text-sm text-slate-500 mb-6">
          {rate === 100
            ? "Parfait ! Tu maîtrises ce sujet."
            : rate >= 80
            ? "Excellent ! Continue comme ça."
            : rate >= 60
            ? "Bien joué ! Encore un petit effort."
            : "Pas mal, reviens t'entraîner !"}
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onRetry}
            className="w-full py-3.5 rounded-xl btn-gradient text-white font-semibold"
          >
            Rejouer cette catégorie
          </button>
          <button
            onClick={onBack}
            className="w-full py-3 rounded-xl bg-slate-100 text-slate-700 font-semibold transition-all hover:bg-slate-200"
          >
            ← Retour aux catégories
          </button>
        </div>
      </div>
    </div>
  );
}
