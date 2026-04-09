"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getAllPlayers, getPartyHistory, PartyResult } from "@/lib/storage";
import { PlayerProgress, Difficulty } from "@/lib/types";
import { categories } from "@/data/themes";
import { getSuccessRate } from "@/lib/scoring";
import { getCurrentLevel } from "@/lib/storage";

// ===== RADAR CHART (SVG) =====

function RadarChart({ progress }: { progress: PlayerProgress }) {
  const size = 260;
  const center = size / 2;
  const radius = 100;
  const levels = 4;

  const cats = categories.map((cat) => {
    const cp = progress.categories[cat.slug];
    if (!cp) return { ...cat, rate: 0 };
    const total =
      cp.debutant.answered + cp.confirme.answered + cp.expert.answered;
    const correct =
      cp.debutant.correct + cp.confirme.correct + cp.expert.correct;
    return { ...cat, rate: total > 0 ? correct / total : 0 };
  });

  const angleStep = (2 * Math.PI) / cats.length;

  const getPoint = (index: number, value: number) => {
    const angle = angleStep * index - Math.PI / 2;
    return {
      x: center + radius * value * Math.cos(angle),
      y: center + radius * value * Math.sin(angle),
    };
  };

  const dataPoints = cats.map((c, i) => getPoint(i, c.rate));
  const dataPath =
    dataPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[260px] mx-auto">
      {/* Grid circles */}
      {Array.from({ length: levels }, (_, i) => {
        const r = (radius * (i + 1)) / levels;
        return (
          <circle
            key={i}
            cx={center}
            cy={center}
            r={r}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth={1}
          />
        );
      })}
      {/* Axes */}
      {cats.map((_, i) => {
        const p = getPoint(i, 1);
        return (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={p.x}
            y2={p.y}
            stroke="#e2e8f0"
            strokeWidth={1}
          />
        );
      })}
      {/* Data */}
      <path d={dataPath} fill="rgba(99,102,241,0.2)" stroke="#6366f1" strokeWidth={2} />
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={3.5} fill="#6366f1" />
      ))}
      {/* Labels */}
      {cats.map((c, i) => {
        const p = getPoint(i, 1.2);
        return (
          <text
            key={i}
            x={p.x}
            y={p.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-[9px] fill-slate-500"
          >
            {c.emoji}
          </text>
        );
      })}
    </svg>
  );
}

// ===== BAR CHART (SVG) =====

function CategoryBars({ progress }: { progress: PlayerProgress }) {
  return (
    <div className="space-y-2">
      {categories.map((cat) => {
        const cp = progress.categories[cat.slug];
        const total = cp
          ? cp.debutant.answered + cp.confirme.answered + cp.expert.answered
          : 0;
        const correct = cp
          ? cp.debutant.correct + cp.confirme.correct + cp.expert.correct
          : 0;
        const rate = total > 0 ? Math.round((correct / total) * 100) : 0;

        return (
          <div key={cat.slug} className="flex items-center gap-2">
            <span className="text-sm w-6 text-center">{cat.emoji}</span>
            <div className="flex-1 h-5 bg-slate-100 rounded-full overflow-hidden relative">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${rate}%`, backgroundColor: cat.color }}
              />
              {total > 0 && (
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-slate-700">
                  {rate}%
                </span>
              )}
            </div>
            <span className="text-xs text-slate-400 w-10 text-right">{total}q</span>
          </div>
        );
      })}
    </div>
  );
}

// ===== BADGE GRID =====

function BadgeGrid({ progress }: { progress: PlayerProgress }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {categories.map((cat) => {
        const cp = progress.categories[cat.slug];
        const level: Difficulty = getCurrentLevel(progress, cat.slug);
        const mastered = cp?.mastered ?? false;

        return (
          <div
            key={cat.slug}
            className={`rounded-xl p-2 text-center border ${
              mastered
                ? "border-amber-300 bg-amber-50"
                : "border-slate-200 bg-white"
            }`}
          >
            <div className="text-2xl mb-1">{cat.emoji}</div>
            <div className="text-[10px] text-slate-500 truncate">{cat.name}</div>
            <div className="text-[10px] mt-0.5">
              {mastered ? (
                <span className="text-amber-600 font-bold">⭐ Maîtrisé</span>
              ) : level === "expert" ? (
                <span className="text-purple-600">🏆 Expert</span>
              ) : level === "confirme" ? (
                <span className="text-blue-600">📘 Confirmé</span>
              ) : (
                <span className="text-green-600">🌱 Débutant</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ===== PAGE PRINCIPALE =====

export default function DashboardPage() {
  const [players, setPlayers] = useState<PlayerProgress[]>([]);
  const [selected, setSelected] = useState<PlayerProgress | null>(null);
  const [partyHistory, setPartyHistory] = useState<PartyResult[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const all = getAllPlayers();
    setPlayers(all);
    if (all.length > 0) setSelected(all[0]);
    setPartyHistory(getPartyHistory());
  }, []);

  if (!mounted) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <div className="text-slate-400">Chargement...</div>
      </main>
    );
  }

  if (players.length === 0) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="text-5xl mb-4">📊</div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Dashboard</h1>
        <p className="text-slate-500 mb-6">Aucun joueur enregistré pour le moment.</p>
        <Link
          href="/solo"
          className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-all"
        >
          Jouer en Solo
        </Link>
      </main>
    );
  }

  const p = selected!;
  const totalAnswered = categories.reduce((sum, cat) => {
    const cp = p.categories[cat.slug];
    return sum + (cp ? cp.debutant.answered + cp.confirme.answered + cp.expert.answered : 0);
  }, 0);
  const totalCorrect = categories.reduce((sum, cat) => {
    const cp = p.categories[cat.slug];
    return sum + (cp ? cp.debutant.correct + cp.confirme.correct + cp.expert.correct : 0);
  }, 0);
  const globalRate = getSuccessRate(totalCorrect, totalAnswered);

  const categoriesMastered = categories.filter(
    (c) => p.categories[c.slug]?.mastered
  ).length;
  const expertUnlocked = categories.filter(
    (c) => p.categories[c.slug]?.expert.unlocked
  ).length;

  // Points forts / faibles
  const catRates = categories
    .map((cat) => {
      const cp = p.categories[cat.slug];
      const total = cp
        ? cp.debutant.answered + cp.confirme.answered + cp.expert.answered
        : 0;
      const correct = cp
        ? cp.debutant.correct + cp.confirme.correct + cp.expert.correct
        : 0;
      return { cat, rate: total > 0 ? Math.round((correct / total) * 100) : -1, total };
    })
    .filter((c) => c.total > 0)
    .sort((a, b) => b.rate - a.rate);

  const strongest = catRates[0];
  const weakest = catRates[catRates.length - 1];

  // Party stats for this player
  const playerParties = partyHistory.filter((g) =>
    g.players.some((gp) => gp.name === p.name)
  );
  const partyWins = playerParties.filter((g) => g.winner === p.name).length;

  return (
    <main className="flex-1 flex flex-col items-center px-3 sm:px-4 py-6 sm:py-8">
      {/* Header */}
      <div className="flex items-center justify-between w-full max-w-2xl mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" /></svg>
          Accueil
        </Link>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800">📊 Dashboard</h1>
        <div className="w-16" />
      </div>

      {/* Player selector */}
      {players.length > 1 && (
        <div className="flex gap-2 mb-6 flex-wrap justify-center">
          {players.map((pl) => (
            <button
              key={pl.name}
              onClick={() => setSelected(pl)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selected?.name === pl.name
                  ? "bg-indigo-600 text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-indigo-400"
              }`}
            >
              {pl.name}
            </button>
          ))}
        </div>
      )}

      <div className="w-full max-w-2xl space-y-4 sm:space-y-6">
        {/* KPI cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="glass-card rounded-xl p-3 sm:p-4 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-indigo-600">{p.totalScore}</div>
            <div className="text-xs text-slate-500 mt-1">Score total</div>
          </div>
          <div className="glass-card rounded-xl p-3 sm:p-4 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-emerald-600">{globalRate}%</div>
            <div className="text-xs text-slate-500 mt-1">Taux de réussite</div>
          </div>
          <div className="glass-card rounded-xl p-3 sm:p-4 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-purple-600">{p.gamesPlayed}</div>
            <div className="text-xs text-slate-500 mt-1">Parties jouées</div>
          </div>
          <div className="glass-card rounded-xl p-3 sm:p-4 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-amber-600">{categoriesMastered}</div>
            <div className="text-xs text-slate-500 mt-1">Catégories maîtrisées</div>
          </div>
        </div>

        {/* Points forts / faibles */}
        {catRates.length >= 2 && strongest && weakest && strongest.cat.slug !== weakest.cat.slug && (
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-3 sm:p-4">
              <div className="text-xs text-emerald-600 font-medium mb-1">💪 Point fort</div>
              <div className="font-semibold text-slate-800 text-sm">
                {strongest.cat.emoji} {strongest.cat.name}
              </div>
              <div className="text-emerald-700 text-sm font-bold">{strongest.rate}%</div>
            </div>
            <div className="bg-red-50 rounded-xl border border-red-200 p-3 sm:p-4">
              <div className="text-xs text-red-600 font-medium mb-1">📚 À travailler</div>
              <div className="font-semibold text-slate-800 text-sm">
                {weakest.cat.emoji} {weakest.cat.name}
              </div>
              <div className="text-red-700 text-sm font-bold">{weakest.rate}%</div>
            </div>
          </div>
        )}

        {/* Radar + Bars side by side on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="glass-card rounded-xl p-4">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Radar des compétences</h3>
            <RadarChart progress={p} />
          </div>
          <div className="glass-card rounded-xl p-4">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Réussite par catégorie</h3>
            <CategoryBars progress={p} />
          </div>
        </div>

        {/* Badge collection */}
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">
            Progression des badges ({expertUnlocked}/9 experts débloqués)
          </h3>
          <BadgeGrid progress={p} />
        </div>

        {/* Party history */}
        {playerParties.length > 0 && (
          <div className="glass-card rounded-xl p-4">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">
              🎉 Mode Party ({partyWins} victoire{partyWins !== 1 ? "s" : ""} sur{" "}
              {playerParties.length} partie{playerParties.length !== 1 ? "s" : ""})
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {playerParties.slice(0, 10).map((game, i) => {
                const me = game.players.find((gp) => gp.name === p.name);
                const isWinner = game.winner === p.name;
                return (
                  <div
                    key={i}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm ${
                      isWinner ? "bg-amber-50" : "bg-slate-50"
                    }`}
                  >
                    <span className="text-slate-500 text-xs">
                      {new Date(game.date).toLocaleDateString("fr-FR")}
                    </span>
                    <span className="font-medium text-slate-700">
                      {game.players.map((gp) => gp.name).join(" vs ")}
                    </span>
                    <span className={isWinner ? "text-amber-600 font-bold" : "text-slate-500"}>
                      {isWinner ? "🏆" : ""} {me?.score ?? 0}pts
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/solo"
            className="flex-1 py-3 rounded-xl btn-gradient text-white font-semibold text-center flex items-center justify-center gap-2 cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>Jouer en Solo</span>
          </Link>
          <Link
            href="/party"
            className="flex-1 py-3 rounded-xl btn-gradient-purple text-white font-semibold text-center flex items-center justify-center gap-2 cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            <span>Mode Party</span>
          </Link>
          <Link
            href="/classement"
            className="flex-1 py-3 rounded-xl bg-white border-2 border-slate-200 text-slate-700 font-semibold text-center transition-all hover:bg-slate-50 hover:border-slate-300 hover:shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>🏆</span>
            <span>Classement</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
