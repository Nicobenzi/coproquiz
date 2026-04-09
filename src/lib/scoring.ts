import { Difficulty } from "./types";

// ===== SCORING MODE PARTY =====

const DIFFICULTY_POINTS: Record<Difficulty, number> = {
  debutant: 10,
  confirme: 20,
  expert: 30,
};

const STEAL_BONUS = 15;
const STREAK_BONUS = 5;
const STREAK_THRESHOLD = 3;

/**
 * Points pour une bonne réponse en mode party
 */
export function getPartyPoints(
  difficulty: Difficulty,
  isSteal: boolean,
  currentStreak: number
): number {
  let points = DIFFICULTY_POINTS[difficulty];

  if (isSteal) {
    points = STEAL_BONUS;
  }

  // Streak bonus à partir de 3 bonnes réponses consécutives
  if (currentStreak >= STREAK_THRESHOLD) {
    points += STREAK_BONUS;
  }

  return points;
}

// ===== SCORING MODE SOLO =====

/**
 * Vérifie si le joueur peut débloquer le niveau suivant
 * Debutant -> Confirmé : 80% de réussite
 * Confirmé -> Expert : 75% de réussite
 * Expert -> Maîtrise : 70% de réussite
 */
export function canUnlockNextLevel(
  difficulty: Difficulty,
  answered: number,
  correct: number,
  minQuestions: number = 10
): boolean {
  if (answered < minQuestions) return false;

  const percentage = (correct / answered) * 100;

  switch (difficulty) {
    case "debutant":
      return percentage >= 80;
    case "confirme":
      return percentage >= 75;
    case "expert":
      return percentage >= 70;
    default:
      return false;
  }
}

/**
 * Retourne le niveau suivant ou null si déjà expert
 */
export function getNextDifficulty(
  current: Difficulty
): Difficulty | null {
  switch (current) {
    case "debutant":
      return "confirme";
    case "confirme":
      return "expert";
    case "expert":
      return null;
  }
}

/**
 * Calcule le pourcentage de réussite
 */
export function getSuccessRate(correct: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}

/**
 * Points pour le badge en party mode : 3 bonnes réponses = badge
 */
export const BADGE_THRESHOLD = 3;
