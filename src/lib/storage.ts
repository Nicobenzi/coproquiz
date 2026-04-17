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
const SOLO_SESSION_VERSION = 1;

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
