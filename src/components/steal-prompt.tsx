"use client";

type StealPromptProps = {
  stealerName: string;
  question: string;
  onAttempt: () => void;
  onPass: () => void;
};

export default function StealPrompt({
  stealerName,
  question,
  onAttempt,
  onPass,
}: StealPromptProps) {
  return (
    <div className="flex flex-col items-center text-center px-4 animate-fade-in-up">
      <div className="text-5xl mb-4">🏴‍☠️</div>

      <h2 className="text-xl font-bold text-slate-800 mb-2">
        Vol possible !
      </h2>
      <p className="text-slate-600 mb-4">
        <span className="font-semibold">{stealerName}</span>, tu peux tenter de voler la question :
      </p>
      <p className="text-sm text-slate-500 italic mb-6 max-w-md">
        &ldquo;{question}&rdquo;
      </p>

      <div className="flex gap-4">
        <button
          onClick={onAttempt}
          className="px-6 py-3 rounded-xl bg-amber-500 text-white font-semibold transition-all hover:bg-amber-600 active:scale-95"
        >
          Je tente ! 🎯
        </button>
        <button
          onClick={onPass}
          className="px-6 py-3 rounded-xl bg-slate-200 text-slate-600 font-semibold transition-all hover:bg-slate-300 active:scale-95"
        >
          Je passe
        </button>
      </div>

      <p className="text-xs text-slate-400 mt-4">
        +15 points si tu trouves la bonne réponse
      </p>
    </div>
  );
}
