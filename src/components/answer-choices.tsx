"use client";

const LETTER_COLORS = [
  "bg-indigo-100 text-indigo-600",
  "bg-purple-100 text-purple-600",
  "bg-teal-100 text-teal-600",
  "bg-amber-100 text-amber-600",
];

type AnswerChoicesProps = {
  choices: string[];
  onSelect: (index: number) => void;
  selectedIndex: number | null;
  correctIndex: number | null;
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
        let cardClass = "bg-white border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 hover:shadow-md hover:-translate-y-0.5";
        let textClass = "text-slate-700";
        let letterClass = LETTER_COLORS[i] || LETTER_COLORS[0];
        let iconEl: React.ReactNode = null;

        if (correctIndex !== null) {
          if (i === correctIndex) {
            cardClass = "bg-emerald-50 border-emerald-400 shadow-sm";
            textClass = "text-emerald-800";
            letterClass = "bg-emerald-500 text-white";
            iconEl = <span className="ml-auto text-emerald-500 text-lg flex-shrink-0">✓</span>;
          } else if (i === selectedIndex && i !== correctIndex) {
            cardClass = "bg-red-50 border-red-400 shadow-sm";
            textClass = "text-red-800";
            letterClass = "bg-red-500 text-white";
            iconEl = <span className="ml-auto text-red-500 text-lg flex-shrink-0">✗</span>;
          } else {
            cardClass = "bg-slate-50 border-slate-200 opacity-40";
            letterClass = "bg-slate-200 text-slate-400";
          }
        } else if (i === selectedIndex) {
          cardClass = "bg-indigo-100 border-indigo-500 shadow-md ring-2 ring-indigo-200";
          textClass = "text-indigo-800";
          letterClass = "bg-indigo-500 text-white";
          iconEl = <span className="ml-auto text-indigo-500 flex-shrink-0"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg></span>;
        }

        return (
          <button
            key={i}
            onClick={() => onSelect(i)}
            disabled={disabled}
            className={`w-full flex items-center gap-3 text-left px-4 py-3.5 rounded-xl border-2 transition-all duration-200 cursor-pointer ${cardClass} ${textClass} font-medium disabled:cursor-default disabled:hover:translate-y-0 disabled:hover:shadow-none`}
          >
            <span className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-colors ${letterClass}`}>
              {String.fromCharCode(65 + i)}
            </span>
            <span className="flex-1">{choice}</span>
            {iconEl}
          </button>
        );
      })}
    </div>
  );
}
