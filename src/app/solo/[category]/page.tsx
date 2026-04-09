"use client";

import { useState, useEffect, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import { CategorySlug, Difficulty, Question, PlayerProgress } from "@/lib/types";
import { getCategoryBySlug } from "@/data/themes";
import { allQuestions } from "@/data/questions";
import { selectQuestions } from "@/lib/question-utils";
import { getPlayerProgress, updateSoloProgress, getCurrentLevel } from "@/lib/storage";
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

  const category = getCategoryBySlug(categorySlug);

  // Charger le joueur depuis le localStorage
  useEffect(() => {
    // Chercher le dernier joueur utilisé
    const players = JSON.parse(localStorage.getItem("coproquiz_players") || "{}");
    const names = Object.keys(players);

    if (names.length === 1) {
      initQuiz(names[0]);
    } else if (names.length > 1) {
      // Prendre le dernier joueur actif (le plus de parties)
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
      const level = getCurrentLevel(progress, slug);
      setDifficulty(level);

      const selected = selectQuestions(allQuestions, slug, level, 10);

      if (selected.length === 0) {
        // Pas assez de questions pour ce niveau → fallback débutant
        const fallback = selectQuestions(allQuestions, slug, "debutant", 10);
        setQuestions(fallback);
        setDifficulty("debutant");
      } else {
        setQuestions(selected);
      }

      setPhase("quiz");
    },
    [categorySlug]
  );

  const handleSelectAnswer = (index: number) => {
    if (revealed) return;
    setSelectedAnswer(index);
  };

  const handleValidate = () => {
    if (selectedAnswer === null) return;

    if (!revealed) {
      // Première pression = révéler la réponse
      setRevealed(true);
      if (selectedAnswer === questions[currentIndex].correctAnswer) {
        setCorrectCount((c) => c + 1);
      }
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 >= questions.length) {
      // Fin du quiz → sauvegarder et afficher résultats
      const finalCorrect =
        selectedAnswer === questions[currentIndex].correctAnswer
          ? correctCount
          : correctCount;

      const { levelUnlocked: unlocked } = updateSoloProgress(
        playerName,
        categorySlug as CategorySlug,
        difficulty,
        questions.length,
        finalCorrect
      );
      setLevelUnlocked(unlocked);
      setPhase("results");
      return;
    }

    setCurrentIndex((i) => i + 1);
    setSelectedAnswer(null);
    setRevealed(false);
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
          className="text-sm text-slate-400 hover:text-indigo-600 transition-colors"
        >
          ← Catégories
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
