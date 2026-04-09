"use client";

type VraiFauxButtonsProps = {
  onSelect: (index: number) => void;
  selectedIndex: number | null;
  correctIndex: number | null;
  disabled: boolean;
};

export default function VraiFauxButtons({
  onSelect,
  selectedIndex,
  correctIndex,
  disabled,
}: VraiFauxButtonsProps) {
  const buttons = [
    { label: "Vrai", icon: "✓", index: 0 },
    { label: "Faux", icon: "✗", index: 1 },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {buttons.map(({ label, icon, index }) => {
        let bgClass = "bg-white border-slate-200 hover:border-indigo-400";
        let textClass = "text-slate-700";

        if (correctIndex !== null) {
          if (index === correctIndex) {
            bgClass = "bg-emerald-50 border-emerald-400";
            textClass = "text-emerald-800";
          } else if (index === selectedIndex && index !== correctIndex) {
            bgClass = "bg-red-50 border-red-400";
            textClass = "text-red-800";
          } else {
            bgClass = "bg-slate-50 border-slate-200 opacity-50";
          }
        } else if (index === selectedIndex) {
          bgClass = "bg-indigo-100 border-indigo-500";
          textClass = "text-indigo-800";
        }

        return (
          <button
            key={index}
            onClick={() => onSelect(index)}
            disabled={disabled}
            className={`flex flex-col items-center justify-center py-6 rounded-xl border-2 transition-all ${bgClass} ${textClass} font-bold text-lg disabled:cursor-default`}
          >
            <span className="text-2xl mb-1">{icon}</span>
            {label}
          </button>
        );
      })}
    </div>
  );
}
