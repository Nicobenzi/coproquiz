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
          ? "bg-emerald-50 border-emerald-300 animate-correct-flash"
          : "bg-red-50 border-red-300 animate-incorrect-flash"
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-3">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
            isCorrect ? "bg-emerald-500" : "bg-red-500"
          }`}
        >
          {isCorrect ? "✓" : "✗"}
        </div>
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
        <div className="inline-flex items-center gap-1.5 text-xs text-slate-500 bg-white/60 rounded-lg px-2.5 py-1.5 mb-4">
          <span>📖</span>
          <span className="italic">{legalRef}</span>
        </div>
      )}

      {/* Bouton suivant */}
      <button
        onClick={onNext}
        className="w-full mt-2 py-3.5 rounded-xl btn-gradient text-white font-semibold"
      >
        Question suivante →
      </button>
    </div>
  );
}
