"use client";

import { Question } from "@/lib/types";
import AnswerChoices from "./answer-choices";
import VraiFauxButtons from "./vrai-faux-buttons";
import AnswerReveal from "./answer-reveal";
import LevelBadge from "./level-badge";

type QuestionCardProps = {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  selectedAnswer: number | null;
  revealed: boolean;
  onSelectAnswer: (index: number) => void;
  onNext: () => void;
  categoryColor?: string;
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
        <LevelBadge level={question.difficulty} />
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
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm mb-3 sm:mb-4">
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
          className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold transition-all hover:bg-indigo-700 active:scale-[0.98]"
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
