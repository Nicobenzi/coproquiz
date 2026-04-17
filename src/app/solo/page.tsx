"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CategoryGrid from "@/components/category-grid";
import {
  getPlayerProgress,
  getAllPlayers,
  getSoloSession,
  clearSoloSession,
  type SoloSession,
} from "@/lib/storage";
import { getCategoryBySlug } from "@/data/themes";
import { PlayerProgress, Difficulty } from "@/lib/types";

export default function SoloPage() {
  const router = useRouter();
  const [playerName, setPlayerName] = useState("");
  const [progress, setProgress] = useState<PlayerProgress | null>(null);
  const [existingPlayers, setExistingPlayers] = useState<string[]>([]);
  const [started, setStarted] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<Difficulty | null>(null);
  const [pendingSession, setPendingSession] = useState<SoloSession | null>(null);

  useEffect(() => {
    const players = getAllPlayers();
    setExistingPlayers(players.map((p) => p.name));

    // Si un seul joueur existe, le pré-sélectionner
    if (players.length === 1) {
      setPlayerName(players[0].name);
    }

    setPendingSession(getSoloSession());
  }, []);

  const handleResume = () => {
    if (!pendingSession) return;
    router.push(`/solo/${pendingSession.categorySlug}`);
  };

  const handleAbandon = () => {
    clearSoloSession();
    setPendingSession(null);
  };

  const handleStart = () => {
    if (!playerName.trim()) return;
    const p = getPlayerProgress(playerName.trim());
    setProgress(p);
    setStarted(true);
  };

  const handleSelectPlayer = (name: string) => {
    setPlayerName(name);
    const p = getPlayerProgress(name);
    setProgress(p);
    setStarted(true);
  };

  // Phase 1 : Sélection / Saisie du joueur
  if (!started) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-indigo-600 transition-colors mb-8 cursor-pointer">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" /></svg>
          Retour à l&apos;accueil
        </Link>

        <div className="text-4xl mb-3">🎯</div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Mode Solo</h1>
        <p className="text-slate-500 mb-8">Qui joue ?</p>

        {pendingSession && (
          <ResumeBanner
            session={pendingSession}
            onResume={handleResume}
            onAbandon={handleAbandon}
          />
        )}

        {/* Joueurs existants */}
        {existingPlayers.length > 0 && (
          <div className="w-full max-w-sm mb-6">
            <p className="text-xs text-slate-400 uppercase tracking-wide mb-2">
              Joueurs enregistrés
            </p>
            <div className="flex flex-col gap-2">
              {existingPlayers.map((name) => (
                <button
                  key={name}
                  onClick={() => handleSelectPlayer(name)}
                  className="group w-full text-left px-4 py-3.5 rounded-xl bg-white border-2 border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 hover:shadow-sm hover:-translate-y-0.5 transition-all font-medium text-slate-700 flex items-center gap-3 cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
                    {name.charAt(0).toUpperCase()}
                  </div>
                  <span className="flex-1">{name}</span>
                  <svg className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-xs text-slate-400">ou nouveau joueur</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>
          </div>
        )}

        {/* Nouveau joueur */}
        <div className="w-full max-w-sm">
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleStart()}
            placeholder="Ton prénom..."
            className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 text-slate-700 mb-3 bg-white shadow-sm transition-all"
            autoFocus
          />
          <button
            onClick={handleStart}
            disabled={!playerName.trim()}
            className="w-full py-3.5 rounded-xl btn-gradient text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>C&apos;est parti !</span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </button>
        </div>
      </main>
    );
  }

  // Phase 2 : Grille des catégories
  return (
    <main className="flex-1 flex flex-col items-center px-3 sm:px-4 py-6 sm:py-8">
      <div className="flex items-center justify-between w-full max-w-4xl mb-6 sm:mb-8">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 truncate">
            Salut {progress!.name} 👋
          </h1>
          <p className="text-sm text-slate-500">
            {progress!.gamesPlayed} parties jouées · Score total : {progress!.totalScore}
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" /></svg>
          Accueil
        </Link>
      </div>

      {pendingSession && (
        <div className="w-full max-w-4xl mb-6">
          <ResumeBanner
            session={pendingSession}
            onResume={handleResume}
            onAbandon={handleAbandon}
          />
        </div>
      )}

      {/* Level selector */}
      <div className="w-full max-w-4xl mb-6">
        <p className="text-slate-500 mb-3">Choisis un niveau puis une catégorie</p>
        <div className="flex gap-2 sm:gap-3">
          {([
            { key: null, label: "Auto", icon: "✨", desc: "Meilleur niveau débloqué" },
            { key: "debutant" as Difficulty, label: "Débutant", icon: "🌱", desc: "Questions de base" },
            { key: "confirme" as Difficulty, label: "Confirmé", icon: "📘", desc: "80% pour débloquer" },
            { key: "expert" as Difficulty, label: "Expert", icon: "🏆", desc: "75% pour débloquer" },
          ] as const).map(({ key, label, icon, desc }) => {
            const isActive = selectedLevel === key;
            return (
              <button
                key={label}
                onClick={() => setSelectedLevel(key)}
                className={`flex-1 py-2.5 sm:py-3 px-2 sm:px-3 rounded-xl border-2 transition-all duration-200 text-center cursor-pointer ${
                  isActive
                    ? "border-indigo-500 bg-indigo-50 shadow-sm"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <div className="text-lg sm:text-xl mb-0.5">{icon}</div>
                <div className={`text-xs sm:text-sm font-semibold ${isActive ? "text-indigo-700" : "text-slate-700"}`}>{label}</div>
                <div className="text-[10px] sm:text-xs text-slate-400 hidden sm:block">{desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      <CategoryGrid progress={progress!} forcedLevel={selectedLevel} />
    </main>
  );
}

function ResumeBanner({
  session,
  onResume,
  onAbandon,
}: {
  session: SoloSession;
  onResume: () => void;
  onAbandon: () => void;
}) {
  const category = getCategoryBySlug(session.categorySlug);
  const remaining = session.questions.length - session.currentIndex;
  const difficultyLabel =
    session.difficulty === "debutant"
      ? "Débutant"
      : session.difficulty === "confirme"
      ? "Confirmé"
      : "Expert";

  return (
    <div className="w-full max-w-sm sm:max-w-4xl mb-6 rounded-2xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-white p-4 sm:p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl shrink-0"
            style={{ backgroundColor: `${category?.color ?? "#6366f1"}20` }}
          >
            {category?.emoji ?? "🎯"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-indigo-600 font-semibold uppercase tracking-wide">
              Session en cours
            </p>
            <p className="text-sm font-semibold text-slate-800 truncate">
              {session.playerName} · {category?.name ?? session.categorySlug}
            </p>
            <p className="text-xs text-slate-500">
              {difficultyLabel} · {remaining} question{remaining > 1 ? "s" : ""} restante{remaining > 1 ? "s" : ""} · {session.correctCount} bonne{session.correctCount > 1 ? "s" : ""} / {session.currentIndex}
            </p>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={onAbandon}
            className="px-3 py-2 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Abandonner
          </button>
          <button
            onClick={onResume}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors cursor-pointer inline-flex items-center gap-1.5"
          >
            Reprendre
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
