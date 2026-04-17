"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PlayerProgress } from "@/lib/types";
import {
  getAllPlayers,
  getPartyHistory,
  getSoloHistory,
  PartyResult,
  SoloGameResult,
} from "@/lib/storage";
import { getCategoryBySlug } from "@/data/themes";
import LeaderboardTable from "@/components/leaderboard-table";

type Tab = "solo" | "party" | "history";

const DIFFICULTY_LABEL: Record<string, string> = {
  debutant: "Débutant",
  confirme: "Confirmé",
  expert: "Expert",
};

export default function ClassementPage() {
  const [tab, setTab] = useState<Tab>("solo");
  const [players, setPlayers] = useState<PlayerProgress[]>([]);
  const [partyHistory, setPartyHistory] = useState<PartyResult[]>([]);
  const [soloHistory, setSoloHistory] = useState<SoloGameResult[]>([]);
  const [filterPlayer, setFilterPlayer] = useState<string>("");

  useEffect(() => {
    setPlayers(getAllPlayers());
    setPartyHistory(getPartyHistory());
    setSoloHistory(getSoloHistory());
  }, []);

  const filteredSoloHistory = filterPlayer
    ? soloHistory.filter((r) => r.playerName === filterPlayer)
    : soloHistory;

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
            className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" /></svg>
            Accueil
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
            onClick={() => setTab("history")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === "history"
                ? "bg-white text-emerald-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            📜 Historique
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

        {tab === "history" && (
          <div className="space-y-3">
            {soloHistory.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">📜</div>
                <p className="text-slate-500">Aucune partie solo enregistrée</p>
                <p className="text-sm text-slate-400 mt-1">
                  Joue un quiz pour voir l&apos;historique ici.
                </p>
              </div>
            ) : (
              <>
                {players.length > 1 && (
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => setFilterPlayer("")}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                        filterPlayer === ""
                          ? "bg-indigo-600 text-white"
                          : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      Tous ({soloHistory.length})
                    </button>
                    {players.map((p) => {
                      const count = soloHistory.filter((r) => r.playerName === p.name).length;
                      if (count === 0) return null;
                      return (
                        <button
                          key={p.name}
                          onClick={() => setFilterPlayer(p.name)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                            filterPlayer === p.name
                              ? "bg-indigo-600 text-white"
                              : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"
                          }`}
                        >
                          {p.name} ({count})
                        </button>
                      );
                    })}
                  </div>
                )}

                {filteredSoloHistory.slice(0, 50).map((r, i) => {
                  const cat = getCategoryBySlug(r.categorySlug);
                  const rate = Math.round((r.correct / r.total) * 100);
                  const d = new Date(r.date);
                  const dateStr = d.toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  const rateColor =
                    rate >= 80 ? "text-emerald-600" : rate >= 50 ? "text-amber-600" : "text-rose-600";

                  return (
                    <div key={`${r.date}-${i}`} className="rounded-xl glass-card p-3 flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0"
                        style={{ backgroundColor: `${cat?.color ?? "#6366f1"}20` }}
                      >
                        {cat?.emoji ?? "🎯"}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-slate-800 truncate">
                          {cat?.name ?? r.categorySlug}
                        </p>
                        <p className="text-xs text-slate-400">
                          {r.playerName} · {DIFFICULTY_LABEL[r.difficulty] ?? r.difficulty} · {dateStr}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className={`text-sm font-bold ${rateColor}`}>{rate}%</p>
                        <p className="text-xs text-slate-400">
                          {r.correct}/{r.total}
                        </p>
                      </div>
                    </div>
                  );
                })}

                {filteredSoloHistory.length > 50 && (
                  <p className="text-center text-xs text-slate-400 pt-2">
                    50 parties les plus récentes affichées · {filteredSoloHistory.length} au total
                  </p>
                )}
              </>
            )}
          </div>
        )}

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
