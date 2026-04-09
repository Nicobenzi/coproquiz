# CoproQuiz - Jeu d'apprentissage Syndic de Copropriete

## Contexte

Nicolas et ses 2 associes lancent Coprovia, un service de syndic de copropriete. Pour maitriser rapidement leur nouveau metier, ils veulent un jeu educatif et competitif. Le jeu a deux modes distincts :
- **Mode Solo** : quiz direct et efficace avec systeme de niveaux a debloquer
- **Mode Party** : Trivial Pursuit avec plateau, badges et competition a 2-3 joueurs

Sources de contenu : "La copropriete en 340 questions" (ARC, 14e ed.), manuel BTS syndics, connaissances verifiees.

---

## Architecture Technique

- **Emplacement** : `/Users/nicolas/Desktop/Claude/Projects/Main-project/coproquiz` (projet Next.js dedie)
- **Stack** : Next.js + React + Tailwind CSS + TypeScript (zero dependance externe)
- **Donnees** : Fichiers TypeScript statiques (200+ questions)
- **Persistance** : localStorage (scores, progression, niveaux debloques)
- **Deploiement** : Vercel (deploiement separe)

---

## Mode Solo : Quiz Direct avec Niveaux

### Principe
Pas de plateau ni de fioritures. Le jeu choisit le theme et bombarde de questions. L'objectif est l'efficacite d'apprentissage.

### Systeme de Niveaux a Debloquer

```
DEBUTANT (debloque par defaut)
  -> Reussir 80% des questions debutant d'une categorie
  -> Debloquer le palier CONFIRME pour cette categorie

CONFIRME (verrouille au debut)
  -> Reussir 75% des questions confirme d'une categorie
  -> Debloquer le palier EXPERT pour cette categorie

EXPERT (verrouille au debut)
  -> Reussir 70% des questions expert d'une categorie
  -> Categorie MAITRISEE = etoile doree
```

### Deroulement Solo
1. Le joueur entre son nom (ou le selectionne si deja enregistre)
2. Ecran principal : grille des 9 categories avec l'etat de progression
   - Chaque categorie montre : niveau actuel (Debutant/Confirme/Expert), % de reussite, icone si maitrise
3. Le joueur clique sur une categorie (ou "Aleatoire" pour que le jeu choisisse)
4. Serie de 10 questions du niveau en cours pour cette categorie
5. A la fin : score, % reussite, deblocage eventuel du niveau suivant
6. Retour a la grille avec progression mise a jour

### Interface Solo
- **Ecran principal** : grille 3x3 des categories, chaque case = carte avec emoji, nom, barre de progression, niveau actuel, cadenas si non debloque
- **En jeu** : question + 4 choix (ou Vrai/Faux), compteur "Question 3/10", barre de progression du quiz
- **Post-reponse** : Correct/Incorrect + explication + reference legale
- **Fin de serie** : score, nouveau niveau debloque ? (avec animation), stats

---

## Mode Party : Trivial Pursuit (2-3 joueurs)

### Le Plateau
- Grille visuelle des 9 categories (pas un plateau circulaire - plus simple a implementer)
- Chaque joueur a son propre jeu de badges a collecter
- Les badges sont affiches en haut de l'ecran par joueur

### Mecanique
1. Configuration : noms des 2-3 joueurs
2. A chaque tour : le jeu choisit une categorie aleatoire (ou le joueur actif choisit)
3. Ecran "C'est au tour de [Nom] !" + bouton "Pret !" (anti-triche)
4. Question affichee, le joueur repond
5. Si correct : progression vers le badge (3 bonnes = badge obtenu)
6. Si incorrect : **Vol !** Le joueur suivant peut tenter de repondre
7. Premier a 9 badges OU le plus de badges apres 30 questions = victoire
8. Podium final avec scores et stats

### Scoring Party
- Bonne reponse : +10 / +20 / +30 selon difficulte
- Vol reussi : +15 points
- Streak bonus (3+ bonnes consecutives) : +5 par question
- Pas de penalite pour mauvaise reponse

---

## Les 9 Categories

| # | Categorie | Couleur | Chapitres |
|---|---|---|---|
| 1 | Cadre juridique | `#6366f1` | Ch. 1, 2, 5 - Loi 1965, copro, reglement |
| 2 | Vocabulaire & Relations | `#8b5cf6` | Ch. 3, 4 - Termes, psychologie |
| 3 | Parties & Charges | `#3b82f6` | Ch. 6, 7, 8 - Communes/privatives, tantiemes |
| 4 | Energie & Fluides | `#f59e0b` | Ch. 9, 10, 16 - Chauffage, eau, reno energetique |
| 5 | Organes de gestion | `#1f4f87` | Ch. 11, 12, 13 - Syndic, CS, AG |
| 6 | Travaux & Securite | `#ef4444` | Ch. 14, 15 - Travaux, sante |
| 7 | Finances | `#4ea947` | Ch. 17, 18, 20, 21, 22 - Charges, comptes |
| 8 | Vie de la copro | `#ec4899` | Ch. 19, 23, 24, 25, 28 - Personnel, justice, bruit |
| 9 | Mutations | `#14b8a6` | Ch. 26, 27, 29, 30 - Assurance, vente, demarrage |

---

## Structure du Projet

```
coproquiz/
  src/
    app/
      layout.tsx                -- Layout racine (branding CoproQuiz)
      page.tsx                  -- Accueil : choix Solo / Party / Classement
      globals.css               -- Styles globaux

      solo/
        page.tsx                -- Grille des categories avec progression
        [category]/
          page.tsx              -- Quiz de 10 questions pour une categorie

      party/
        page.tsx                -- Setup joueurs
        jeu/
          page.tsx              -- Le jeu party en cours

      classement/
        page.tsx                -- Leaderboard global

    components/
      question-card.tsx         -- Affiche une question (QCM, VF, ouverte)
      answer-choices.tsx        -- Boutons de choix QCM
      vrai-faux-buttons.tsx     -- Deux gros boutons Vrai/Faux
      open-answer.tsx           -- Auto-evaluation question ouverte
      answer-reveal.tsx         -- Explication post-reponse
      category-grid.tsx         -- Grille 3x3 des categories (solo)
      category-card.tsx         -- Carte d'une categorie avec progression
      level-badge.tsx           -- Badge de niveau (Debutant/Confirme/Expert)
      progress-bar.tsx          -- Barre de progression
      player-turn.tsx           -- Interstitiel "Au tour de..."
      steal-prompt.tsx          -- Mechanique de vol
      scoreboard.tsx            -- Scores en live (party)
      badge-collection.tsx      -- Badges collectes par joueur (party)
      results-screen.tsx        -- Resultats fin de partie
      podium.tsx                -- Podium 1er/2e/3e (party)
      leaderboard-table.tsx     -- Tableau classement

    lib/
      types.ts                  -- Tous les types TypeScript
      game-state.ts             -- Reducer + logique du jeu
      solo-state.ts             -- Reducer specifique mode solo
      party-state.ts            -- Reducer specifique mode party
      scoring.ts                -- Calcul des points
      storage.ts                -- localStorage (progression, scores, niveaux)
      question-utils.ts         -- Melange, filtrage, selection

    data/
      themes.ts                 -- Les 9 categories
      questions/
        cadre-juridique.ts      -- ~22 questions (3 niveaux)
        vocabulaire.ts          -- ~22 questions
        parties-charges.ts      -- ~22 questions
        energie-fluides.ts      -- ~22 questions
        organes-gestion.ts      -- ~25 questions
        travaux-securite.ts     -- ~22 questions
        finances.ts             -- ~25 questions
        vie-copro.ts            -- ~22 questions
        mutations.ts            -- ~22 questions
      index.ts                  -- Export centralisé
```

---

## Modele de Donnees

```typescript
type Question = {
  id: string;                       // "ch11-q03"
  type: "qcm" | "vrai-faux" | "ouverte";
  category: string;                 // slug categorie
  chapter: number;                  // chapitre source
  difficulty: "debutant" | "confirme" | "expert";
  question: string;
  choices?: string[];               // options QCM ou ["Vrai","Faux"]
  correctAnswer: number | string;   // index ou texte
  explanation: string;              // explication pedagogique
  legalRef?: string;                // ex: "Art. 25 loi 10/07/1965"
  source?: "340q" | "bts" | "general";
};

type PlayerProgress = {
  name: string;
  categories: Record<string, {
    debutant: { answered: number; correct: number; unlocked: true };
    confirme: { answered: number; correct: number; unlocked: boolean };
    expert: { answered: number; correct: number; unlocked: boolean };
    mastered: boolean;              // les 3 niveaux completes
  }>;
  totalScore: number;
  gamesPlayed: number;
};
```

---

## Plan d'Implementation (7 sessions Cowork)

### Session 1 : Setup projet + Fondations
1. Initialiser le projet Next.js dans `/coproquiz`
2. Creer `types.ts`, `themes.ts`
3. Creer les utilitaires (`question-utils.ts`, `scoring.ts`, `storage.ts`)
4. Creer le layout racine et la page d'accueil
5. **Verif** : `npm run dev` affiche la page d'accueil

### Session 2 : Premier lot de questions (~75)
1. 25 questions "Organes de gestion" (syndic, conseil syndical, AG)
2. 25 questions "Finances" (charges, comptes, budget)
3. 25 questions "Cadre juridique" (loi 1965, definitions, reglement)
4. Mix de niveaux : ~10 debutant, ~10 confirme, ~5 expert par categorie

### Session 3 : Mode Solo jouable
1. Page grille des categories (`/solo`)
2. Page quiz par categorie (`/solo/[category]`)
3. Composants : `question-card`, `answer-choices`, `answer-reveal`
4. Logique de niveaux + deblocage
5. Sauvegarde progression localStorage
6. **Verif** : jouer une partie solo complete, verifier le deblocage de niveau

### Session 4 : Questions restantes (~130)
1. Completer les 6 categories manquantes (~22 questions chacune)
2. Equilibrer difficultes et types de questions
3. Ajouter references legales
4. **Verif** : toutes les categories ont des questions aux 3 niveaux

### Session 5 : Mode Party
1. Page setup joueurs (`/party`)
2. Jeu party avec tours, vol, badges (`/party/jeu`)
3. Composants : `player-turn`, `steal-prompt`, `scoreboard`, `badge-collection`
4. Podium et resultats
5. **Verif** : partie complete a 2 et 3 joueurs

### Session 6 : Classement + Polish
1. Page classement (`/classement`)
2. Historique des parties
3. Stats par joueur
4. Animations (deblocage niveau, badge obtenu)

### Session 7 : Deploiement + Finitions
1. Deployer sur Vercel
2. Responsive mobile
3. Timer optionnel en party mode
4. Corrections et ajustements
5. **Verif** : test complet sur telephone

---

## Verification Globale

1. `npm run dev` -> page d'accueil fonctionnelle
2. Mode solo : choisir une categorie, repondre a 10 questions, voir le score
3. Debloquer le niveau Confirme en reussissant 80% en Debutant
4. Mode party : 2 joueurs, tours alternés, vol, badges, podium
5. Classement : scores persistes entre sessions
6. `npm run build` : zero erreur
7. Mobile : jouable sur telephone

---

## Fichiers Cles

- `coproquiz/src/lib/types.ts` : types centraux
- `coproquiz/src/lib/storage.ts` : gestion localStorage et niveaux
- `coproquiz/src/data/themes.ts` : definition des 9 categories
- `coproquiz/src/data/questions/*.ts` : 200+ questions
- `coproquiz/src/app/solo/[category]/page.tsx` : coeur du quiz solo
- `coproquiz/src/app/party/jeu/page.tsx` : coeur du mode party
