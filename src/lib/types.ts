// ===== TYPES CENTRAUX COPROQUIZ =====

export type QuestionType = "qcm" | "vrai-faux" | "ouverte";
export type Difficulty = "debutant" | "confirme" | "expert";
export type QuestionSource = "340q" | "bts" | "general";

export type Question = {
  id: string;                       // ex: "cadre-juridique-q01"
  type: QuestionType;
  category: string;                 // slug catégorie
  chapter: number;                  // chapitre source
  difficulty: Difficulty;
  question: string;
  choices?: string[];               // options QCM ou ["Vrai","Faux"]
  correctAnswer: number | string;   // index (QCM/VF) ou texte (ouverte)
  explanation: string;              // explication pédagogique
  legalRef?: string;                // ex: "Art. 25 loi 10/07/1965"
  source?: QuestionSource;
};

export type CategorySlug =
  | "cadre-juridique"
  | "vocabulaire"
  | "parties-charges"
  | "energie-fluides"
  | "organes-gestion"
  | "travaux-securite"
  | "finances"
  | "vie-copro"
  | "mutations";

export type Category = {
  slug: CategorySlug;
  name: string;
  emoji: string;
  color: string;
  chapters: number[];
  description: string;
};

// ===== PROGRESSION SOLO =====

export type LevelProgress = {
  answered: number;
  correct: number;
  unlocked: boolean;
};

export type CategoryProgress = {
  debutant: LevelProgress;
  confirme: LevelProgress;
  expert: LevelProgress;
  mastered: boolean;
};

export type PlayerProgress = {
  name: string;
  categories: Record<string, CategoryProgress>;
  totalScore: number;
  gamesPlayed: number;
};

// ===== MODE PARTY =====

export type PartyPlayer = {
  name: string;
  score: number;
  badges: string[];           // slugs des catégories obtenues
  badgeProgress: Record<string, number>; // slug -> bonnes réponses consécutives (0-3)
  streak: number;             // série en cours
};

export type PartyState = {
  players: PartyPlayer[];
  currentPlayerIndex: number;
  currentQuestion: Question | null;
  questionNumber: number;
  maxQuestions: number;        // 30 par défaut
  phase: "setup" | "category-reveal" | "question" | "answer-reveal" | "steal" | "results";
  currentCategory: string | null;
  stealPlayerIndex: number | null;
  gameOver: boolean;
};

// ===== MODE SOLO =====

export type SoloState = {
  playerName: string;
  currentCategory: CategorySlug | null;
  currentDifficulty: Difficulty;
  questions: Question[];
  currentQuestionIndex: number;
  answers: (number | string | null)[];
  correctCount: number;
  phase: "select-category" | "question" | "answer-reveal" | "results";
  progress: PlayerProgress;
};

// ===== GAME GÉNÉRIQUE =====

export type GameMode = "solo" | "party";
