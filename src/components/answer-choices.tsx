"use client";

type AnswerChoicesProps = {
  choices: string[];
  onSelect: (index: number) => void;
  selectedIndex: number | null;
  correctIndex: number | null;   // null = pas encore révélé
  disabled: boolean;
};

export default function AnswerChoices({
  choices,
  onSelect,
  selectedIndex,
  correctIndex,
  disabled,
}: AnswerChoicesProps) {
  return (
    <div className="grid grid-cols-1 gap-3">
      {choices.map((choice, i) => {
        let bgClass = "bg-white border-slate-200 hover:border-indigo-400 hover:bg-indigo-50";
        let textClass = "text-slate-700";

        if (correctIndex !== null) {
          // Résultat révélé
          if (i === correctIndex) {
            bgClass = "bg-emerald-50 border-emerald-400";
            textClass = "text-emerald-800";
          } else if (i === selectedIndex && i !== correctIndex) {
            bgClass = "bg-red-50 border-red-400";
            textClass = "text-red-800";
          } else {
            bgClass = "bg-slate-50 border-slate-200 opacity-50";
          }
        } else if (i === selectedIndex) {
          bgClass = "bg-indigo-100 border-indigo-500";
          textClass = "text-indigo-800";
        }

        return (
          <button
            key={i}
            onClick={() => onSelect(i)}
            disabled={disabled}
            className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all ${bgClass} ${textClass} font-medium disabled:cursor-default`}
          >
            <span className="mr-2 text-sm opacity-50">
              {String.fromCharCode(65 + i)}.
            </span>
            {choice}
          </button>
        );
      })}
    </div>
  );
}
