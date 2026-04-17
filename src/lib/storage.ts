import {
  PlayerProgress,
  CategoryProgress,
  Difficulty,
  CategorySlug,
  Question,
} from "./types";
import { categories } from "@/data/themes";
import { canUnlockNextLevel, getNextDifficulty } from "./scoring";

const STORAGE_KEY = "coproquiz_players";
const PARTY_HISTORY_KEY = "coproquiz_party_history";
const SOLO_SESSION_KEY = "coproquiz_solo_session";
const SOLO_HISTORY_KEY = "coproquiz_solo_history";
const SOLO_SESSION_VERSION = 1;
const MAX_SOLO_HISTORY = 300;

// ===== HELPERS =====

function getStorage(): Record<string, PlayerProgress> {
  if (typeof window === "undefined") return {};
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

function setStorage(data: Record<string, PlayerProgress>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// ===== PROGRESSION INITIALE =====

function createDefaultCategoryProgress(): CategoryProgress {
  return {
    debutant: { answered: 0, correct: 0, unlocked: true },
    confirme: { answered: 0, correct: 0, unlocked: false },
    expert: { answered: 0, correct: 0, unlocked: false },
    mastered: false,
  };
}

function createDefaultProgress(name: string): PlayerProgress {
  const cats: Record<string, CategoryProgress> = {};
  for (const cat of categories) {
    cats[cat.slug] = createDefaultCategoryProgress();
  }
  return {
    name,
    categories: cats,
    totalScore: 0,
    gamesPlayed: 0,
  };
}

// ===== API PUBLIQUE =====

/**
 * Récupère la progression d'un joueur (ou la crée)
 */
export function getPlayerProgress(name: string): PlayerProgress {
  const storage = getStorage();
  if (!storage[name]) {
    storage[name] = createDefaultProgress(name);
    setStorage(storage);
  }
  return storage[name];
}

/**
 * Liste tous les joueurs enregistrés
 */
export function getAllPlayers(): PlayerProgress[] {
  const storage = getStorage();
  return Object.values(storage).sort((a, b) => b.totalScore - a.totalScore);
}

/**
 * Met à jour la progression après une série de quiz solo
 */
export function updateSoloProgress(
  name: string,
  category: CategorySlug,
  difficulty: Difficulty,
  answeredCount: number,
  correctCount: number
): { progress: PlayerProgress; levelUnlocked: Difficulty | null } {
  const storage = getStorage();
  if (!storage[name]) {
    storage[name] = createDefaultProgress(name);
  }

  const player = storage[name];
  const catProgress = player.categories[category];
  const levelProgress = catProgress[difficulty];

  levelProgress.answered += answeredCount;
  levelProgress.correct += correctCount;

  player.gamesPlayed += 1;
  player.totalScore += correctCount * (difficulty === "expert" ? 30 : difficulty === "confirme" ? 20 : 10);

  // Vérifier le déblocage du niveau suivant
  let levelUnlocked: Difficulty | null = null;
  const nextDifficulty = getNextDifficulty(difficulty);

  if (
    nextDifficulty &&
    !catProgress[nextDifficulty].unlocked &&
    canUnlockNextLevel(difficulty, levelProgress.answered, levelProgress.correct)
  ) {
    catProgress[nextDifficulty].unlocked = true;
    levelUnlocked = nextDifficulty;
  }

  // Vérifier la maîtrise complète
  if (
    difficulty === "expert" &&
    canUnlockNextLevel("expert", levelProgress.answered, levelProgress.correct)
  ) {
    catProgress.mastered = true;
  }

  setStorage(storage);

  // Enregistrer le résultat dans l'historique solo
  saveSoloResult({
    date: new Date().toISOString(),
    playerName: name,
    categorySlug: category,
    difficulty,
    correct: correctCount,
    total: answeredCount,
  });

  return { progress: player, levelUnlocked };
}

/**
 * Récupère le niveau actuel (le plus haut débloqué) pour une catégorie
 */
export function getCurrentLevel(
  progress: PlayerProgress,
  category: CategorySlug
): Difficulty {
  const cat = progress.categories[category];
  if (cat?.expert.unlocked) return "expert";
  if (cat?.confirme.unlocked) return "confirme";
  return "debutant";
}

// ===== SESSION SOLO EN COURS =====

export type SoloSession = {
  version: number;
  playerName: string;
  categorySlug: CategorySlug;
  difficulty: Difficulty;
  questions: Question[];            // questions déjà mélangées (choix inclus)
  currentIndex: number;
  correctCount: number;
  selectedAnswer: number | null;
  revealed: boolean;
  startedAt: string;                // ISO date
  updatedAt: string;                // ISO date
};

export type SoloSessionInput = Omit<SoloSession, "version" | "startedAt" | "updatedAt"> & {
  startedAt?: string;
};

export function saveSoloSession(input: SoloSessionInput): void {
  if (typeof window === "undefined") return;
  try {
    const now = new Date().toISOString();
    const session: SoloSession = {
      ...input,
      version: SOLO_SESSION_VERSION,
      startedAt: input.startedAt ?? now,
      updatedAt: now,
    };
    localStorage.setItem(SOLO_SESSION_KEY, JSON.stringify(session));
  } catch {
    // ignore
  }
}

export function getSoloSession(): SoloSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SOLO_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SoloSession;
    if (parsed.version !== SOLO_SESSION_VERSION) return null;
    if (!parsed.questions || parsed.questions.length === 0) return null;
    // Session terminée = à ignorer
    if (parsed.currentIndex >= parsed.questions.length) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearSoloSession(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(SOLO_SESSION_KEY);
  } catch {
    // ignore
  }
}

// ===== HISTORIQUE SOLO =====

export type SoloGameResult = {
  date: string;            // ISO
  playerName: string;
  categorySlug: CategorySlug;
  difficulty: Difficulty;
  correct: number;
  total: number;
};

export function saveSoloResult(result: SoloGameResult): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(SOLO_HISTORY_KEY);
    const history: SoloGameResult[] = raw ? JSON.parse(raw) : [];
    history.unshift(result);
    localStorage.setItem(
      SOLO_HISTORY_KEY,
      JSON.stringify(history.slice(0, MAX_SOLO_HISTORY))
    );
  } catch {
    // ignore
  }
}

export function getSoloHistory(playerName?: string): SoloGameResult[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SOLO_HISTORY_KEY);
    const history: SoloGameResult[] = raw ? JSON.parse(raw) : [];
    return playerName
      ? history.filter((r) => r.playerName === playerName)
      : history;
  } catch {
    return [];
  }
}

/**
 * Nombre de jours consécutifs (jusqu'à aujourd'hui inclus) où le joueur
 * a terminé au moins un quiz. 0 si pas de partie aujourd'hui ni hier.
 *
 * Règle : la série reste "vivante" tant qu'on joue aujourd'hui OU hier.
 * Si on saute un jour complet, elle tombe à 0.
 */
export function getCurrentStreak(playerName: string): number {
  const history = getSoloHistory(playerName);
  if (history.length === 0) return 0;

  const daysPlayed = new Set<string>();
  for (const r of history) {
    const d = new Date(r.date);
    if (isNaN(d.getTime())) continue;
    daysPlayed.add(toDayKey(d));
  }

  const today = new Date();
  const todayKey = toDayKey(today);
  const yesterdayKey = toDayKey(addDays(today, -1));

  // Si ni aujourd'hui ni hier → streak cassé
  if (!daysPlayed.has(todayKey) && !daysPlayed.has(yesterdayKey)) return 0;

  // On part de aujourd'hui (ou hier si rien aujourd'hui) et on remonte
  let streak = 0;
  const cursor = daysPlayed.has(todayKey) ? new Date(today) : addDays(today, -1);

  while (daysPlayed.has(toDayKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

function toDayKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function addDays(d: Date, delta: number): Date {
  const copy = new Date(d);
  copy.setDate(copy.getDate() + delta);
  return copy;
}

/**
 * Stats agrégées d'un joueur à partir de l'historique solo.
 */
export type PlayerStats = {
  gamesPlayed: number;
  totalAnswered: number;
  totalCorrect: number;
  averageRate: number;      // 0-100
  bestCategorySlug: CategorySlug | null;
  bestCategoryRate: number; // 0-100
  streak: number;
};

export function getPlayerStats(playerName: string): PlayerStats {
  const history = getSoloHistory(playerName);
  const gamesPlayed = history.length;

  let totalAnswered = 0;
  let totalCorrect = 0;
  const byCat = new Map<CategorySlug, { answered: number; correct: number }>();

  for (const r of history) {
    totalAnswered += r.total;
    totalCorrect += r.correct;
    const acc = byCat.get(r.categorySlug) ?? { answered: 0, correct: 0 };
    acc.answered += r.total;
    acc.correct += r.correct;
    byCat.set(r.categorySlug, acc);
  }

  let bestCategorySlug: CategorySlug | null = null;
  let bestCategoryRate = 0;
  for (const [slug, acc] of byCat.entries()) {
    if (acc.answered < 10) continue; // éviter les outliers 100% sur 1 partie
    const rate = (acc.correct / acc.answered) * 100;
    if (rate > bestCategoryRate) {
      bestCategoryRate = rate;
      bestCategorySlug = slug;
    }
  }

  return {
    gamesPlayed,
    totalAnswered,
    totalCorrect,
    averageRate: totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0,
    bestCategorySlug,
    bestCategoryRate: Math.round(bestCategoryRate),
    streak: getCurrentStreak(playerName),
  };
}

// ===== HISTORIQUE PARTY =====

export type PartyResult = {
  date: string;
  players: { name: string; score: number; badges: string[] }[];
  winner: string;
};

export function savePartyResult(result: PartyResult) {
  if (typeof window === "undefined") return;
  try {
    const data = localStorage.getItem(PARTY_HISTORY_KEY);
    const history: PartyResult[] = data ? JSON.parse(data) : [];
    history.unshift(result);
    localStorage.setItem(PARTY_HISTORY_KEY, JSON.stringify(history.slice(0, 50)));
  } catch {
    // ignore
  }
}

export function getPartyHistory(): PartyResult[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(PARTY_HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}
