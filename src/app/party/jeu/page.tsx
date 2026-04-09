"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { PartyPlayer, Question, CategorySlug } from "@/lib/types";
import { categories, getCategoryBySlug } from "@/data/themes";
import { allQuestions } from "@/data/questions";
import { selectRandomQuestion, selectRandomCategory } from "@/lib/question-utils";
import { getPartyPoints, BADGE_THRESHOLD } from "@/lib/scoring";
import { savePartyResult } from "@/lib/storage";
import Scoreboard from "@/components/scoreboard";
import PlayerTurn from "@/components/player-turn";
import StealPrompt from "@/components/steal-prompt";
import QuestionCard from "@/components/question-card";
import Podium from "@/components/podium";

type Phase =
  | "loading"
  | "turn-announce"
  | "question"
  | "answer-reveal"
  | "steal-prompt"
  | "steal-question"
  | "steal-reveal"
  | "badge-celebration"
  | "results";

const MAX_QUESTIONS = 30;
const MAX_BADGES = 9;

function createPlayer(name: string): PartyPlayer {
  const badgeProgress: Record<string, number> = {};
  categories.forEach((c) => (badgeProgress[c.slug] = 0));
  return { name, score: 0, badges: [], badgeProgress, streak: 0 };
}

export default function PartyGamePage() {
  const router = useRouter();

  const [players, setPlayers] = useState<PartyPlayer[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("loading");
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [usedQuestionIds, setUsedQuestionIds] = useState<string[]>([]);

  // Question state
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [wasCorrect, setWasCorrect] = useState(false);

  // Steal state
  const [stealPlayerIndex, setStealPlayerIndex] = useState<number | null>(null);
  const [stealAnswer, setStealAnswer] = useState<number | null>(null);
  const [stealRevealed, setStealRevealed] = useState(false);

  // Timer key (incremented to reset timer on new question)
  const [timerKey, setTimerKey] = useState(0);

  // Badge celebration
  const [celebrationData, setCelebrationData] = useState<{
    playerName: string;
    categoryName: string;
    categoryEmoji: string;
  } | null>(null);

  // Init
  useEffect(() => {
    const stored = sessionStorage.getItem("party_players");
    if (!stored) {
      router.push("/party");
      return;
    }
    const names: string[] = JSON.parse(stored);
    setPlayers(names.map(createPlayer));
    setPhase("turn-announce");
    pickCategoryAndQuestion([], 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pickCategoryAndQuestion = useCallback(
    (excludeIds: string[], qNumber: number) => {
      const slugs = categories.map((c) => c.slug) as CategorySlug[];
      const cat = selectRandomCategory(slugs);
      setCurrentCategory(cat);

      const q = selectRandomQuestion(allQuestions, cat, excludeIds);
      if (q) {
        setCurrentQuestion(q);
        setUsedQuestionIds((prev) => [...prev, q.id]);
        setQuestionNumber(qNumber + 1);
      }
    },
    []
  );

  const checkGameOver = useCallback(
    (updatedPlayers: PartyPlayer[], qNum: number): boolean => {
      // Someone got all badges
      if (updatedPlayers.some((p) => p.badges.length >= MAX_BADGES)) return true;
      // Max questions reached
      if (qNum >= MAX_QUESTIONS) return true;
      return false;
    },
    []
  );

  const handleReady = () => {
    setSelectedAnswer(null);
    setRevealed(false);
    setWasCorrect(false);
    setTimerKey((k) => k + 1);
    setPhase("question");
  };

  const handleTimeUp = useCallback(() => {
    if (!currentQuestion) return;
    // Time's up = wrong answer with no selection
    setSelectedAnswer(-1);
    setRevealed(true);
    setWasCorrect(false);
  }, [currentQuestion]);

  const handleSelectAnswer = (index: number) => {
    if (revealed) return;
    setSelectedAnswer(index);
  };

  const handleValidateOrNext = () => {
    if (!currentQuestion || selectedAnswer === null) return;

    if (!revealed) {
      // Reveal
      setRevealed(true);
      const correct = selectedAnswer === currentQuestion.correctAnswer;
      setWasCorrect(correct);

      if (correct) {
        // Update score & badges
        const updated = [...players];
        const player = { ...updated[currentPlayerIndex] };
        const cat = currentQuestion.category;
        const points = getPartyPoints(currentQuestion.difficulty, false, player.streak);
        player.score += points;
        player.streak += 1;

        // Badge progress
        const progress = (player.badgeProgress[cat] || 0) + 1;
        player.badgeProgress = { ...player.badgeProgress, [cat]: progress };

        if (progress >= BADGE_THRESHOLD && !player.badges.includes(cat)) {
          player.badges = [...player.badges, cat];
          player.badgeProgress = { ...player.badgeProgress, [cat]: 0 };
          const catInfo = getCategoryBySlug(cat);
          setCelebrationData({
            playerName: player.name,
            categoryName: catInfo?.name || cat,
            categoryEmoji: catInfo?.emoji || "🏆",
          });
        }

        updated[currentPlayerIndex] = player;
        setPlayers(updated);
      }
    } else {
      // After reveal → next step
      if (celebrationData) {
        setPhase("badge-celebration");
        return;
      }

      if (!wasCorrect) {
        // Offer steal to next player
        const nextStealIndex = (currentPlayerIndex + 1) % players.length;
        setStealPlayerIndex(nextStealIndex);
        setStealAnswer(null);
        setStealRevealed(false);
        setPhase("steal-prompt");
        return;
      }

      advanceToNext();
    }
  };

  const handleStealAttempt = () => {
    setTimerKey((k) => k + 1);
    setPhase("steal-question");
  };

  const handleStealTimeUp = useCallback(() => {
    if (!currentQuestion || stealPlayerIndex === null) return;
    setStealAnswer(-1);
    setStealRevealed(true);
    // Reset stealer streak
    setPlayers((prev) => {
      const updated = [...prev];
      const stealer = { ...updated[stealPlayerIndex] };
      stealer.streak = 0;
      updated[stealPlayerIndex] = stealer;
      return updated;
    });
  }, [currentQuestion, stealPlayerIndex]);

  const handleStealPass = () => {
    advanceToNext();
  };

  const handleStealSelect = (index: number) => {
    if (stealRevealed) return;
    setStealAnswer(index);
  };

  const handleStealValidate = () => {
    if (!currentQuestion || stealAnswer === null || stealPlayerIndex === null) return;

    if (!stealRevealed) {
      setStealRevealed(true);
      const correct = stealAnswer === currentQuestion.correctAnswer;

      if (correct) {
        const updated = [...players];
        const stealer = { ...updated[stealPlayerIndex] };
        const points = getPartyPoints(currentQuestion.difficulty, true, stealer.streak);
        stealer.score += points;
        stealer.streak += 1;

        const cat = currentQuestion.category;
        const progress = (stealer.badgeProgress[cat] || 0) + 1;
        stealer.badgeProgress = { ...stealer.badgeProgress, [cat]: progress };

        if (progress >= BADGE_THRESHOLD && !stealer.badges.includes(cat)) {
          stealer.badges = [...stealer.badges, cat];
          stealer.badgeProgress = { ...stealer.badgeProgress, [cat]: 0 };
          const catInfo = getCategoryBySlug(cat);
          setCelebrationData({
            playerName: stealer.name,
            categoryName: catInfo?.name || cat,
            categoryEmoji: catInfo?.emoji || "🏆",
          });
        }

        updated[stealPlayerIndex] = stealer;
        setPlayers(updated);
      } else {
        // Reset stealer streak
        const updated = [...players];
        const stealer = { ...updated[stealPlayerIndex] };
        stealer.streak = 0;
        updated[stealPlayerIndex] = stealer;
        setPlayers(updated);
      }
    } else {
      if (celebrationData) {
        setPhase("badge-celebration");
        return;
      }
      advanceToNext();
    }
  };

  const advanceToNext = useCallback(() => {
    setCelebrationData(null);

    // Reset original player streak if they got it wrong
    if (!wasCorrect) {
      setPlayers((prev) => {
        const updated = [...prev];
        const player = { ...updated[currentPlayerIndex] };
        player.streak = 0;
        updated[currentPlayerIndex] = player;
        return updated;
      });
    }

    if (checkGameOver(players, questionNumber)) {
      // Save result
      const ranked = [...players].sort((a, b) =>
        b.badges.length !== a.badges.length
          ? b.badges.length - a.badges.length
          : b.score - a.score
      );
      savePartyResult({
        date: new Date().toISOString(),
        players: players.map((p) => ({
          name: p.name,
          score: p.score,
          badges: p.badges,
        })),
        winner: ranked[0].name,
      });
      setPhase("results");
      return;
    }

    // Next player
    const nextPlayer = (currentPlayerIndex + 1) % players.length;
    setCurrentPlayerIndex(nextPlayer);

    // Pick new question
    pickCategoryAndQuestion(usedQuestionIds, questionNumber);

    // Reset state
    setSelectedAnswer(null);
    setRevealed(false);
    setWasCorrect(false);
    setStealPlayerIndex(null);
    setStealAnswer(null);
    setStealRevealed(false);
    setPhase("turn-announce");
  }, [
    wasCorrect,
    currentPlayerIndex,
    players,
    questionNumber,
    usedQuestionIds,
    checkGameOver,
    pickCategoryAndQuestion,
  ]);

  const handleCelebrationDone = () => {
    setCelebrationData(null);
    if (checkGameOver(players, questionNumber)) {
      const ranked = [...players].sort((a, b) =>
        b.badges.length !== a.badges.length
          ? b.badges.length - a.badges.length
          : b.score - a.score
      );
      savePartyResult({
        date: new Date().toISOString(),
        players: players.map((p) => ({
          name: p.name,
          score: p.score,
          badges: p.badges,
        })),
        winner: ranked[0].name,
      });
      setPhase("results");
      return;
    }
    advanceToNext();
  };

  // ===== RENDERING =====

  if (phase === "loading" || !currentQuestion) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <p className="text-slate-400">Chargement...</p>
      </main>
    );
  }

  const catInfo = currentCategory ? getCategoryBySlug(currentCategory) : null;

  if (phase === "results") {
    return (
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <Podium
          players={players}
          onPlayAgain={() => {
            setPlayers(players.map((p) => createPlayer(p.name)));
            setCurrentPlayerIndex(0);
            setQuestionNumber(0);
            setUsedQuestionIds([]);
            pickCategoryAndQuestion([], 0);
            setPhase("turn-announce");
          }}
          onHome={() => router.push("/")}
        />
      </main>
    );
  }

  if (phase === "badge-celebration" && celebrationData) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="text-center">
          <div className="text-5xl sm:text-6xl mb-3 sm:mb-4 animate-celebrate">🏆</div>
          <h2 className="text-xl sm:text-2xl font-bold text-amber-600 mb-2">
            Badge obtenu !
          </h2>
          <p className="text-lg text-slate-700 mb-2">
            {celebrationData.playerName} remporte le badge
          </p>
          <div className="text-4xl mb-4">
            {celebrationData.categoryEmoji}
          </div>
          <p className="text-slate-500 mb-8">{celebrationData.categoryName}</p>
          <button
            onClick={handleCelebrationDone}
            className="px-8 py-3 rounded-xl bg-purple-600 text-white font-semibold transition-all hover:bg-purple-700"
          >
            Continuer →
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col items-center px-3 sm:px-4 py-4 sm:py-6">
      {/* Scoreboard toujours visible */}
      <div className="w-full max-w-2xl mb-3 sm:mb-4">
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <span className="text-xs text-slate-400">
            Question {questionNumber}/{MAX_QUESTIONS}
          </span>
          <button
            onClick={() => router.push("/")}
            className="text-xs text-slate-400 hover:text-red-500"
          >
            Quitter
          </button>
        </div>
        <Scoreboard players={players} currentPlayerIndex={currentPlayerIndex} />
      </div>

      {/* Phase content */}
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        {phase === "turn-announce" && catInfo && (
          <PlayerTurn
            playerName={players[currentPlayerIndex].name}
            playerIndex={currentPlayerIndex}
            categoryName={catInfo.name}
            categoryEmoji={catInfo.emoji}
            categoryColor={catInfo.color}
            onReady={handleReady}
          />
        )}

        {phase === "question" && (
          <QuestionCard
            question={currentQuestion}
            questionIndex={questionNumber - 1}
            totalQuestions={MAX_QUESTIONS}
            selectedAnswer={selectedAnswer}
            revealed={revealed}
            onSelectAnswer={handleSelectAnswer}
            onNext={handleValidateOrNext}
            categoryColor={catInfo?.color}
            showTimer
            timerKey={timerKey}
            onTimeUp={handleTimeUp}
          />
        )}

        {phase === "steal-prompt" && stealPlayerIndex !== null && (
          <StealPrompt
            stealerName={players[stealPlayerIndex].name}
            question={currentQuestion.question}
            onAttempt={handleStealAttempt}
            onPass={handleStealPass}
          />
        )}

        {phase === "steal-question" && (
          <QuestionCard
            question={currentQuestion}
            questionIndex={questionNumber - 1}
            totalQuestions={MAX_QUESTIONS}
            selectedAnswer={stealAnswer}
            revealed={stealRevealed}
            onSelectAnswer={handleStealSelect}
            onNext={handleStealValidate}
            categoryColor={catInfo?.color}
            showTimer
            timerKey={timerKey}
            onTimeUp={handleStealTimeUp}
          />
        )}
      </div>
    </main>
  );
}
