"use client";

import { useState, useEffect, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import { CategorySlug, Difficulty, Question } from "@/lib/types";
import { getCategoryBySlug } from "@/data/themes";
import { allQuestions } from "@/data/questions";
import { selectQuestions } from "@/lib/question-utils";
import {
  getPlayerProgress,
  updateSoloProgress,
  getCurrentLevel,
  getSoloSession,
  saveSoloSession,
  clearSoloSession,
} from "@/lib/storage";
import QuestionCard from "@/components/question-card";
import ResultsScreen from "@/components/results-screen";

type Phase = "loading" | "name-prompt" | "quiz" | "results";

export default function SoloCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: categorySlug } = use(params);
  const router = useRouter();

  const [phase, setPhase] = useState<Phase>("loading");
  const [playerName, setPlayerName] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [difficulty, setDifficulty] = useState<Difficulty>("debutant");
  const [levelUnlocked, setLevelUnlocked] = useState<Difficulty | null>(null);
  const [sessionStartedAt, setSessionStartedAt] = useState<string | null>(null);

  const category = getCategoryBySlug(categorySlug);

  // Charger le joueur depuis le localStorage
  useEffect(() => {
    // 1) Session en cours pour cette catégorie → reprendre
    const existing = getSoloSession();
    if (existing && existing.categorySlug === categorySlug) {
      setPlayerName(existing.playerName);
      setDifficulty(existing.difficulty);
      setQuestions(existing.questions);
      setCurrentIndex(existing.currentIndex);
      setCorrectCount(existing.correctCount);
      setSelectedAnswer(existing.selectedAnswer);
      setRevealed(existing.revealed);
      setSessionStartedAt(existing.startedAt);
      setPhase("quiz");
      return;
    }

    // 2) Sinon, démarrer une nouvelle session avec le joueur courant
    const players = JSON.parse(localStorage.getItem("coproquiz_players") || "{}");
    const names = Object.keys(players);

    if (names.length === 1) {
      initQuiz(names[0]);
    } else if (names.length > 1) {
      const sorted = names.sort(
        (a, b) => (players[b]?.gamesPlayed ?? 0) - (players[a]?.gamesPlayed ?? 0)
      );
      initQuiz(sorted[0]);
    } else {
      setPhase("name-prompt");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initQuiz = useCallback(
    (name: string) => {
      setPlayerName(name);
      const progress = getPlayerProgress(name);
      const slug = categorySlug as CategorySlug;

      // Nouvelle session → on efface l'éventuelle session obsolète
      clearSoloSession();

      // Check if a forced level was selected from the solo page
      let level: Difficulty;
      const forcedLevel = sessionStorage.getItem("solo_forced_level");
      if (forcedLevel && ["debutant", "confirme", "expert"].includes(forcedLevel)) {
        level = forcedLevel as Difficulty;
        sessionStorage.removeItem("solo_forced_level");
      } else {
        level = getCurrentLevel(progress, slug);
      }
      setDifficulty(level);

      const selected = selectQuestions(allQuestions, slug, level, 10);

      let finalQuestions: Question[];
      let finalLevel = level;
      if (selected.length === 0) {
        finalQuestions = selectQuestions(allQuestions, slug, "debutant", 10);
        finalLevel = "debutant";
        setDifficulty("debutant");
      } else {
        finalQuestions = selected;
      }
      setQuestions(finalQuestions);
      setCurrentIndex(0);
      setSelectedAnswer(null);
      setRevealed(false);
      setCorrectCount(0);

      const startedAt = new Date().toISOString();
      setSessionStartedAt(startedAt);

      if (finalQuestions.length > 0) {
        saveSoloSession({
          playerName: name,
          categorySlug: slug,
          difficulty: finalLevel,
          questions: finalQuestions,
          currentIndex: 0,
          correctCount: 0,
          selectedAnswer: null,
          revealed: false,
          startedAt,
        });
      }

      setPhase("quiz");
    },
    [categorySlug]
  );

  const persist = useCallback(
    (patch: Partial<{
      currentIndex: number;
      correctCount: number;
      selectedAnswer: number | null;
      revealed: boolean;
    }>) => {
      if (!playerName || questions.length === 0) return;
      saveSoloSession({
        playerName,
        categorySlug: categorySlug as CategorySlug,
        difficulty,
        questions,
        currentIndex: patch.currentIndex ?? currentIndex,
        correctCount: patch.correctCount ?? correctCount,
        selectedAnswer:
          patch.selectedAnswer !== undefined ? patch.selectedAnswer : selectedAnswer,
        revealed: patch.revealed ?? revealed,
        startedAt: sessionStartedAt ?? undefined,
      });
    },
    [
      playerName,
      categorySlug,
      difficulty,
      questions,
      currentIndex,
      correctCount,
      selectedAnswer,
      revealed,
      sessionStartedAt,
    ]
  );

  const handleSelectAnswer = (index: number) => {
    if (revealed) return;
    setSelectedAnswer(index);
    persist({ selectedAnswer: index });
  };

  const handleValidate = () => {
    if (selectedAnswer === null) return;

    if (!revealed) {
      const isCorrect = selectedAnswer === questions[currentIndex].correctAnswer;
      const newCorrect = isCorrect ? correctCount + 1 : correctCount;
      setRevealed(true);
      if (isCorrect) setCorrectCount(newCorrect);
      persist({ revealed: true, correctCount: newCorrect });
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 >= questions.length) {
      // Fin du quiz → sauvegarder progression et afficher résultats
      const { levelUnlocked: unlocked } = updateSoloProgress(
        playerName,
        categorySlug as CategorySlug,
        difficulty,
        questions.length,
        correctCount
      );
      setLevelUnlocked(unlocked);
      clearSoloSession();
      setPhase("results");
      return;
    }

    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);
    setSelectedAnswer(null);
    setRevealed(false);
    persist({
      currentIndex: nextIndex,
      selectedAnswer: null,
      revealed: false,
    });
  };

  // Gestion du validate/next dans QuestionCard
  const handleQuestionAction = () => {
    if (!revealed) {
      handleValidate();
    } else {
      handleNext();
    }
  };

  if (!category) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <p className="text-slate-500">Catégorie introuvable.</p>
        <button
          onClick={() => router.push("/solo")}
          className="mt-4 text-indigo-600 hover:underline"
        >
          Retour
        </button>
      </main>
    );
  }

  if (phase === "loading") {
    return (
      <main className="flex-1 flex items-center justify-center">
        <p className="text-slate-400">Chargement...</p>
      </main>
    );
  }

  if (phase === "name-prompt") {
    return (
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Ton prénom ?</h2>
        <input
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && playerName.trim()) initQuiz(playerName.trim());
          }}
          placeholder="Prénom..."
          className="w-64 px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 mb-3"
          autoFocus
        />
        <button
          onClick={() => playerName.trim() && initQuiz(playerName.trim())}
          disabled={!playerName.trim()}
          className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold disabled:opacity-40"
        >
          Jouer
        </button>
      </main>
    );
  }

  if (phase === "results") {
    return (
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <ResultsScreen
          categoryName={category.name}
          categoryEmoji={category.emoji}
          categoryColor={category.color}
          correct={correctCount}
          total={questions.length}
          difficulty={difficulty}
          levelUnlocked={levelUnlocked}
          onRetry={() => {
            // Relancer avec le même joueur
            setCurrentIndex(0);
            setSelectedAnswer(null);
            setRevealed(false);
            setCorrectCount(0);
            setLevelUnlocked(null);
            initQuiz(playerName);
          }}
          onBack={() => router.push("/solo")}
        />
      </main>
    );
  }

  // Phase quiz
  const currentQuestion = questions[currentIndex];
  if (!currentQuestion) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <p className="text-slate-500">
          Pas de questions disponibles pour cette catégorie et ce niveau.
        </p>
        <button
          onClick={() => router.push("/solo")}
          className="mt-4 text-indigo-600 hover:underline"
        >
          Retour aux catégories
        </button>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col items-center px-4 py-8">
      {/* Header */}
      <div className="w-full max-w-2xl flex items-center justify-between mb-6">
        <button
          onClick={() => router.push("/solo")}
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" /></svg>
          Catégories
        </button>
        <div className="flex items-center gap-2">
          <span>{category.emoji}</span>
          <span className="text-sm font-medium text-slate-600">{category.name}</span>
        </div>
      </div>

      <QuestionCard
        question={currentQuestion}
        questionIndex={currentIndex}
        totalQuestions={questions.length}
        selectedAnswer={selectedAnswer}
        revealed={revealed}
        onSelectAnswer={handleSelectAnswer}
        onNext={handleQuestionAction}
        categoryColor={category.color}
      />
    </main>
  );
}
