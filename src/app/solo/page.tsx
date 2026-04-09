"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import CategoryGrid from "@/components/category-grid";
import { getPlayerProgress, getAllPlayers } from "@/lib/storage";
import { PlayerProgress } from "@/lib/types";

export default function SoloPage() {
  const [playerName, setPlayerName] = useState("");
  const [progress, setProgress] = useState<PlayerProgress | null>(null);
  const [existingPlayers, setExistingPlayers] = useState<string[]>([]);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const players = getAllPlayers();
    setExistingPlayers(players.map((p) => p.name));

    // Si un seul joueur existe, le pré-sélectionner
    if (players.length === 1) {
      setPlayerName(players[0].name);
    }
  }, []);

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

      <p className="text-slate-500 mb-6">Choisis une catégorie</p>

      <CategoryGrid progress={progress!} />
    </main>
  );
}
