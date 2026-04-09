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
        <Link href="/" className="text-sm text-slate-400 hover:text-indigo-600 mb-8">
          ← Retour à l&apos;accueil
        </Link>

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
                  className="w-full text-left px-4 py-3 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 transition-all font-medium text-slate-700"
                >
                  👤 {name}
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
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-slate-700 mb-3"
            autoFocus
          />
          <button
            onClick={handleStart}
            disabled={!playerName.trim()}
            className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold transition-all hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            C&apos;est parti ! 🚀
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
          className="text-sm text-slate-400 hover:text-indigo-600 transition-colors"
        >
          ← Accueil
        </Link>
      </div>

      <p className="text-slate-500 mb-6">Choisis une catégorie</p>

      <CategoryGrid progress={progress!} />
    </main>
  );
}
