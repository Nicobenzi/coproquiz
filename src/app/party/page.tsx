"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const MIN_PLAYERS = 2;
const MAX_PLAYERS = 3;

export default function PartySetupPage() {
  const router = useRouter();
  const [players, setPlayers] = useState<string[]>(["", ""]);
  const [error, setError] = useState("");

  const addPlayer = () => {
    if (players.length < MAX_PLAYERS) {
      setPlayers([...players, ""]);
    }
  };

  const removePlayer = (index: number) => {
    if (players.length > MIN_PLAYERS) {
      setPlayers(players.filter((_, i) => i !== index));
    }
  };

  const updatePlayer = (index: number, name: string) => {
    const updated = [...players];
    updated[index] = name;
    setPlayers(updated);
    setError("");
  };

  const handleStart = () => {
    const names = players.map((p) => p.trim()).filter(Boolean);

    if (names.length < MIN_PLAYERS) {
      setError("Il faut au moins 2 joueurs !");
      return;
    }

    const unique = new Set(names);
    if (unique.size !== names.length) {
      setError("Les noms doivent être différents !");
      return;
    }

    // Stocker les joueurs en sessionStorage pour la page jeu
    sessionStorage.setItem("party_players", JSON.stringify(names));
    router.push("/party/jeu");
  };

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-purple-600 transition-colors mb-8 cursor-pointer">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" /></svg>
        Retour à l&apos;accueil
      </Link>

      <div className="text-4xl mb-4">🎉</div>
      <h1 className="text-3xl font-bold text-slate-800 mb-2">Mode Party</h1>
      <p className="text-slate-500 mb-8">Qui sont les challengers ?</p>

      <div className="w-full max-w-sm space-y-3">
        {players.map((name, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ backgroundColor: ["#6366f1", "#ec4899", "#14b8a6"][i] }}>
              {i + 1}
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => updatePlayer(i, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleStart();
              }}
              placeholder={`Joueur ${i + 1}...`}
              className="flex-1 px-4 py-3.5 rounded-xl border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 text-slate-700 bg-white shadow-sm transition-all"
              autoFocus={i === 0}
            />
            {players.length > MIN_PLAYERS && (
              <button
                onClick={() => removePlayer(i)}
                className="text-slate-400 hover:text-red-500 text-xl px-1"
                title="Retirer"
              >
                ×
              </button>
            )}
          </div>
        ))}

        {players.length < MAX_PLAYERS && (
          <button
            onClick={addPlayer}
            className="w-full py-2.5 rounded-xl border-2 border-dashed border-slate-300 text-slate-400 hover:border-purple-400 hover:text-purple-600 transition-all text-sm flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            Ajouter un joueur
          </button>
        )}

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        <button
          onClick={handleStart}
          className="w-full py-3.5 rounded-xl btn-gradient-purple text-white font-semibold mt-4 flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Lancer la partie !</span>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
        </button>
      </div>
    </main>
  );
}
