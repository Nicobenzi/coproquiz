"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PlayerProgress } from "@/lib/types";
import { getAllPlayers, getPartyHistory, PartyResult } from "@/lib/storage";
import LeaderboardTable from "@/components/leaderboard-table";

type Tab = "solo" | "party";

export default function ClassementPage() {
  const [tab, setTab] = useState<Tab>("solo");
  const [players, setPlayers] = useState<PlayerProgress[]>([]);
  const [partyHistory, setPartyHistory] = useState<PartyResult[]>([]);

  useEffect(() => {
    setPlayers(getAllPlayers());
    setPartyHistory(getPartyHistory());
  }, []);

  return (
    <main className="flex-1 flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">🏆 Classement</h1>
            <p className="text-sm text-slate-500">Qui maîtrise le mieux la copro ?</p>
          </div>
          <Link
            href="/"
            className="text-sm text-slate-400 hover:text-indigo-600 transition-colors"
          >
            ← Accueil
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-100 rounded-xl p-1 mb-6">
          <button
            onClick={() => setTab("solo")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === "solo"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            🎯 Solo
          </button>
          <button
            onClick={() => setTab("party")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === "party"
                ? "bg-white text-purple-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            🎉 Party
          </button>
        </div>

        {/* Content */}
        {tab === "solo" && <LeaderboardTable players={players} />}

        {tab === "party" && (
          <div className="space-y-3">
            {partyHistory.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">🎉</div>
                <p className="text-slate-500">Aucune partie jouée</p>
                <p className="text-sm text-slate-400 mt-1">
                  Lance une partie Party pour voir l&apos;historique ici !
                </p>
              </div>
            ) : (
              partyHistory.map((result, i) => {
                const date = new Date(result.date);
                const dateStr = date.toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <div
                    key={i}
                    className="rounded-2xl glass-card p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-slate-400">{dateStr}</p>
                      <span className="text-xs font-medium text-purple-600 bg-purple-50 rounded-full px-2 py-0.5">
                        🏆 {result.winner}
                      </span>
                    </div>
                    <div className="flex gap-4">
                      {result.players
                        .sort((a, b) => b.score - a.score)
                        .map((p, j) => (
                          <div key={j} className="flex-1 text-center">
                            <p className="text-sm font-medium text-slate-700">
                              {j === 0 ? "🥇" : j === 1 ? "🥈" : "🥉"} {p.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {p.score} pts · {p.badges.length} badges
                            </p>
                          </div>
                        ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </main>
  );
}
