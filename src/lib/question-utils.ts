import { Question, Difficulty, CategorySlug } from "./types";

/**
 * Mélange un tableau (Fisher-Yates)
 */
export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Filtre les questions par catégorie et difficulté
 */
export function filterQuestions(
  questions: Question[],
  category: CategorySlug,
  difficulty: Difficulty
): Question[] {
  return questions.filter(
    (q) => q.category === category && q.difficulty === difficulty
  );
}

/**
 * Prépare une question pour l'affichage :
 * - QCM : mélange les choix et ré-indexe correctAnswer
 * - vrai-faux / ouverte : renvoyée inchangée (l'ordre Vrai/Faux est fixe)
 */
export function prepareQuestion(q: Question): Question {
  if (q.type !== "qcm" || !q.choices || q.choices.length === 0) return q;
  if (typeof q.correctAnswer !== "number") return q;
  const { shuffledChoices, newCorrectIndex } = shuffleChoices(
    q.choices,
    q.correctAnswer
  );
  return { ...q, choices: shuffledChoices, correctAnswer: newCorrectIndex };
}

/**
 * Sélectionne N questions aléatoires pour une session de quiz.
 * Les choix QCM sont mélangés pour éviter tout biais de position.
 */
export function selectQuestions(
  questions: Question[],
  category: CategorySlug,
  difficulty: Difficulty,
  count: number = 10
): Question[] {
  const filtered = filterQuestions(questions, category, difficulty);
  const shuffled = shuffle(filtered);
  return shuffled.slice(0, count).map(prepareQuestion);
}

/**
 * Sélectionne une question aléatoire d'une catégorie (mode party).
 * Les choix QCM sont mélangés.
 */
export function selectRandomQuestion(
  questions: Question[],
  category?: CategorySlug,
  excludeIds: string[] = []
): Question | null {
  let pool = questions.filter((q) => !excludeIds.includes(q.id));
  if (category) {
    pool = pool.filter((q) => q.category === category);
  }
  if (pool.length === 0) return null;
  const picked = pool[Math.floor(Math.random() * pool.length)];
  return prepareQuestion(picked);
}

/**
 * Sélectionne une catégorie aléatoire
 */
export function selectRandomCategory(
  categorySlugs: CategorySlug[]
): CategorySlug {
  return categorySlugs[Math.floor(Math.random() * categorySlugs.length)];
}

/**
 * Mélange les choix d'une question QCM tout en gardant la bonne réponse trackée
 */
export function shuffleChoices(
  choices: string[],
  correctIndex: number
): { shuffledChoices: string[]; newCorrectIndex: number } {
  const indexed = choices.map((c, i) => ({ choice: c, originalIndex: i }));
  const shuffled = shuffle(indexed);
  const newCorrectIndex = shuffled.findIndex(
    (item) => item.originalIndex === correctIndex
  );
  return {
    shuffledChoices: shuffled.map((item) => item.choice),
    newCorrectIndex,
  };
}
