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
      <Link href="/" className="text-sm text-slate-400 hover:text-purple-600 mb-8">
        ← Retour à l&apos;accueil
      </Link>

      <div className="text-4xl mb-4">🎉</div>
      <h1 className="text-3xl font-bold text-slate-800 mb-2">Mode Party</h1>
      <p className="text-slate-500 mb-8">Qui sont les challengers ?</p>

      <div className="w-full max-w-sm space-y-3">
        {players.map((name, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-sm text-slate-400 w-6">J{i + 1}</span>
            <input
              type="text"
              value={name}
              onChange={(e) => updatePlayer(i, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleStart();
              }}
              placeholder={`Joueur ${i + 1}...`}
              className="flex-1 px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-400 text-slate-700"
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
            className="w-full py-2 rounded-xl border-2 border-dashed border-slate-300 text-slate-400 hover:border-purple-400 hover:text-purple-600 transition-all text-sm"
          >
            + Ajouter un joueur
          </button>
        )}

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        <button
          onClick={handleStart}
          className="w-full py-3.5 rounded-xl btn-gradient-purple text-white font-semibold mt-4"
        >
          Lancer la partie ! 🚀
        </button>
      </div>
    </main>
  );
}
