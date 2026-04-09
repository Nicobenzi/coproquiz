"use client";

type PlayerTurnProps = {
  playerName: string;
  playerIndex: number;
  categoryName: string;
  categoryEmoji: string;
  categoryColor: string;
  onReady: () => void;
};

const PLAYER_COLORS = ["#6366f1", "#ec4899", "#14b8a6"];

export default function PlayerTurn({
  playerName,
  playerIndex,
  categoryName,
  categoryEmoji,
  categoryColor,
  onReady,
}: PlayerTurnProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center px-4 animate-scale-in">
      <div
        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6"
        style={{ backgroundColor: PLAYER_COLORS[playerIndex] || "#6366f1" }}
      >
        {playerName.charAt(0).toUpperCase()}
      </div>

      <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2">
        C&apos;est au tour de {playerName} !
      </h2>

      <div
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white mb-6 sm:mb-8"
        style={{ backgroundColor: categoryColor }}
      >
        <span>{categoryEmoji}</span>
        <span>{categoryName}</span>
      </div>

      <button
        onClick={onReady}
        className="px-6 sm:px-8 py-3 sm:py-4 rounded-2xl bg-purple-600 text-white text-base sm:text-lg font-bold transition-all hover:bg-purple-700 hover:scale-105 active:scale-95"
      >
        Prêt ! 💪
      </button>

      <p className="text-xs text-slate-400 mt-4">
        Passez le téléphone au joueur avant de cliquer
      </p>
    </div>
  );
}
