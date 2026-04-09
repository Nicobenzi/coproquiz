"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Difficulty } from "@/lib/types";

const TIMER_DURATIONS: Record<Difficulty, number> = {
  debutant: 20,
  confirme: 30,
  expert: 45,
};

type TimerProps = {
  difficulty: Difficulty;
  isActive: boolean;
  onTimeUp: () => void;
};

export function getTimerDuration(difficulty: Difficulty): number {
  return TIMER_DURATIONS[difficulty];
}

export default function Timer({ difficulty, isActive, onTimeUp }: TimerProps) {
  const duration = TIMER_DURATIONS[difficulty];
  const [timeLeft, setTimeLeft] = useState(duration);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onTimeUpRef = useRef(onTimeUp);
  onTimeUpRef.current = onTimeUp;

  // Reset when difficulty changes (new question)
  useEffect(() => {
    setTimeLeft(TIMER_DURATIONS[difficulty]);
  }, [difficulty]);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!isActive) {
      clearTimer();
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearTimer();
          // Use setTimeout to avoid state update during render
          setTimeout(() => onTimeUpRef.current(), 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return clearTimer;
  }, [isActive, clearTimer]);

  const pct = (timeLeft / duration) * 100;
  const isLow = timeLeft <= 5;
  const isMedium = timeLeft <= 10 && !isLow;

  const color = isLow ? "#ef4444" : isMedium ? "#f59e0b" : "#6366f1";

  // SVG circle
  const circleSize = 56;
  const strokeWidth = 4;
  const r = (circleSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const dashOffset = circumference * (1 - pct / 100);

  return (
    <div className="relative flex items-center justify-center" style={{ width: circleSize, height: circleSize }}>
      <svg
        width={circleSize}
        height={circleSize}
        className={`-rotate-90 ${isLow ? "animate-pulse" : ""}`}
      >
        {/* Background circle */}
        <circle cx={circleSize / 2} cy={circleSize / 2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={strokeWidth} />
        {/* Progress circle */}
        <circle
          cx={circleSize / 2}
          cy={circleSize / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          className="transition-all duration-1000 ease-linear"
        />
      </svg>
      <span
        className={`absolute text-sm font-bold ${isLow ? "text-red-500" : "text-slate-700"}`}
      >
        {timeLeft}s
      </span>
    </div>
  );
}
