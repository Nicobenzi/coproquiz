"use client";

type AnswerRevealProps = {
  isCorrect: boolean;
  explanation: string;
  legalRef?: string;
  onNext: () => void;
};

export default function AnswerReveal({
  isCorrect,
  explanation,
  legalRef,
  onNext,
}: AnswerRevealProps) {
  return (
    <div
      className={`rounded-xl border-2 p-4 sm:p-5 mt-3 sm:mt-4 animate-fade-in-up ${
        isCorrect
          ? "bg-emerald-50 border-emerald-300"
          : "bg-red-50 border-red-300"
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">{isCorrect ? "✅" : "❌"}</span>
        <span
          className={`font-bold text-lg ${
            isCorrect ? "text-emerald-700" : "text-red-700"
          }`}
        >
          {isCorrect ? "Bonne réponse !" : "Mauvaise réponse"}
        </span>
      </div>

      {/* Explication */}
      <p className="text-slate-700 text-sm leading-relaxed mb-2">
        {explanation}
      </p>

      {/* Référence légale */}
      {legalRef && (
        <p className="text-xs text-slate-500 italic mb-4">
          📖 {legalRef}
        </p>
      )}

      {/* Bouton suivant */}
      <button
        onClick={onNext}
        className="w-full mt-2 py-3 rounded-xl bg-indigo-600 text-white font-semibold transition-all hover:bg-indigo-700 active:scale-[0.98]"
      >
        Question suivante →
      </button>
    </div>
  );
}
