"use client";

import { Question } from "@/lib/types";
import AnswerChoices from "./answer-choices";
import VraiFauxButtons from "./vrai-faux-buttons";
import AnswerReveal from "./answer-reveal";
import LevelBadge from "./level-badge";
import Timer from "./timer";

type QuestionCardProps = {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  selectedAnswer: number | null;
  revealed: boolean;
  onSelectAnswer: (index: number) => void;
  onNext: () => void;
  categoryColor?: string;
  showTimer?: boolean;
  timerKey?: number;
  onTimeUp?: () => void;
};

export default function QuestionCard({
  question,
  questionIndex,
  totalQuestions,
  selectedAnswer,
  revealed,
  onSelectAnswer,
  onNext,
  categoryColor = "#6366f1",
  showTimer = false,
  timerKey = 0,
  onTimeUp,
}: QuestionCardProps) {
  const isCorrect =
    revealed && selectedAnswer !== null && selectedAnswer === question.correctAnswer;

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress header */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <span className="text-xs sm:text-sm text-slate-500">
          Question {questionIndex + 1}/{totalQuestions}
        </span>
        <div className="flex items-center gap-2">
          {showTimer && onTimeUp && (
            <Timer
              key={timerKey}
              difficulty={question.difficulty}
              isActive={!revealed}
              onTimeUp={onTimeUp}
            />
          )}
          <LevelBadge level={question.difficulty} />
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-slate-200 rounded-full mb-4 sm:mb-6 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${((questionIndex + 1) / totalQuestions) * 100}%`,
            backgroundColor: categoryColor,
          }}
        />
      </div>

      {/* Question */}
      <div className="glass-card rounded-2xl p-4 sm:p-6 mb-3 sm:mb-4">
        <h2 className="text-base sm:text-lg font-semibold text-slate-800 leading-relaxed mb-4 sm:mb-6">
          {question.question}
        </h2>

        {/* Choix */}
        {question.type === "vrai-faux" ? (
          <VraiFauxButtons
            onSelect={onSelectAnswer}
            selectedIndex={selectedAnswer}
            correctIndex={revealed ? (question.correctAnswer as number) : null}
            disabled={revealed}
          />
        ) : (
          <AnswerChoices
            choices={question.choices ?? []}
            onSelect={onSelectAnswer}
            selectedIndex={selectedAnswer}
            correctIndex={revealed ? (question.correctAnswer as number) : null}
            disabled={revealed}
          />
        )}
      </div>

      {/* Valider (si pas encore révélé et réponse sélectionnée) */}
      {!revealed && selectedAnswer !== null && (
        <button
          onClick={onNext}
          className="w-full py-3.5 rounded-xl btn-gradient text-white font-semibold"
        >
          Valider
        </button>
      )}

      {/* Reveal */}
      {revealed && (
        <AnswerReveal
          isCorrect={isCorrect}
          explanation={question.explanation}
          legalRef={question.legalRef}
          onNext={onNext}
        />
      )}
    </div>
  );
}
