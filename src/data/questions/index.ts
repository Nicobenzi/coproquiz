import { Question } from "@/lib/types";
import { cadreJuridiqueQuestions } from "./cadre-juridique";
import { vocabulaireQuestions } from "./vocabulaire";
import { partiesChargesQuestions } from "./parties-charges";
import { energieFludesQuestions } from "./energie-fluides";
import { organesGestionQuestions } from "./organes-gestion";
import { travauxSecuriteQuestions } from "./travaux-securite";
import { financesQuestions } from "./finances";
import { vieCoproQuestions } from "./vie-copro";
import { mutationsQuestions } from "./mutations";

export const allQuestions: Question[] = [
  ...cadreJuridiqueQuestions,
  ...vocabulaireQuestions,
  ...partiesChargesQuestions,
  ...energieFludesQuestions,
  ...organesGestionQuestions,
  ...travauxSecuriteQuestions,
  ...financesQuestions,
  ...vieCoproQuestions,
  ...mutationsQuestions,
];

// Helpers
export const getQuestionsByCategory = (category: string): Question[] =>
  allQuestions.filter((q) => q.category === category);

export const getQuestionById = (id: string): Question | undefined =>
  allQuestions.find((q) => q.id === id);
