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
    { label: "Vrai", index: 0, baseColor: "emerald", hoverBorder: "hover:border-emerald-400 hover:bg-emerald-50/50" },
    { label: "Faux", index: 1, baseColor: "red", hoverBorder: "hover:border-red-400 hover:bg-red-50/50" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {buttons.map(({ label, index, hoverBorder }) => {
        let bgClass = `bg-white border-slate-200 ${hoverBorder} hover:shadow-md hover:-translate-y-0.5`;
        let textClass = "text-slate-700";
        let iconBg = index === 0 ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-500";

        if (correctIndex !== null) {
          if (index === correctIndex) {
            bgClass = "bg-emerald-50 border-emerald-400 shadow-sm";
            textClass = "text-emerald-800";
            iconBg = "bg-emerald-500 text-white";
          } else if (index === selectedIndex && index !== correctIndex) {
            bgClass = "bg-red-50 border-red-400 shadow-sm";
            textClass = "text-red-800";
            iconBg = "bg-red-500 text-white";
          } else {
            bgClass = "bg-slate-50 border-slate-200 opacity-40";
            iconBg = "bg-slate-200 text-slate-400";
          }
        } else if (index === selectedIndex) {
          bgClass = index === 0
            ? "bg-emerald-100 border-emerald-500 shadow-md ring-2 ring-emerald-200"
            : "bg-red-100 border-red-500 shadow-md ring-2 ring-red-200";
          textClass = index === 0 ? "text-emerald-800" : "text-red-800";
          iconBg = index === 0 ? "bg-emerald-500 text-white" : "bg-red-500 text-white";
        }

        return (
          <button
            key={index}
            onClick={() => onSelect(index)}
            disabled={disabled}
            className={`flex flex-col items-center justify-center py-6 rounded-xl border-2 transition-all duration-200 cursor-pointer ${bgClass} ${textClass} font-bold text-lg disabled:cursor-default disabled:hover:translate-y-0 disabled:hover:shadow-none`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl mb-2 transition-colors ${iconBg}`}>
              {index === 0 ? "✓" : "✗"}
            </div>
            {label}
          </button>
        );
      })}
    </div>
  );
}
