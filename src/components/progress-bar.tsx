"use client";

type ProgressBarProps = {
  value: number;    // 0-100
  color?: string;
  height?: string;
  showLabel?: boolean;
};

export default function ProgressBar({
  value,
  color = "#6366f1",
  height = "h-2",
  showLabel = false,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className="w-full">
      <div className={`w-full bg-slate-200 rounded-full ${height} overflow-hidden`}>
        <div
          className={`${height} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${clamped}%`, backgroundColor: color }}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-slate-500 mt-1 text-right">{Math.round(clamped)}%</p>
      )}
    </div>
  );
}
