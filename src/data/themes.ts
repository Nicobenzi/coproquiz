import { Category } from "@/lib/types";

export const categories: Category[] = [
  {
    slug: "cadre-juridique",
    name: "Cadre juridique",
    emoji: "⚖️",
    color: "#6366f1",
    chapters: [1, 2, 5],
    description: "Loi 1965, statut de la copropriété, règlement de copropriété",
  },
  {
    slug: "vocabulaire",
    name: "Vocabulaire & Relations",
    emoji: "💬",
    color: "#8b5cf6",
    chapters: [3, 4],
    description: "Termes techniques, psychologie de la copropriété",
  },
  {
    slug: "parties-charges",
    name: "Parties & Charges",
    emoji: "🏗️",
    color: "#3b82f6",
    chapters: [6, 7, 8],
    description: "Parties communes/privatives, tantièmes, charges",
  },
  {
    slug: "energie-fluides",
    name: "Énergie & Fluides",
    emoji: "⚡",
    color: "#f59e0b",
    chapters: [9, 10, 16],
    description: "Chauffage, eau, rénovation énergétique",
  },
  {
    slug: "organes-gestion",
    name: "Organes de gestion",
    emoji: "🏛️",
    color: "#1f4f87",
    chapters: [11, 12, 13],
    description: "Syndic, conseil syndical, assemblée générale",
  },
  {
    slug: "travaux-securite",
    name: "Travaux & Sécurité",
    emoji: "🔧",
    color: "#ef4444",
    chapters: [14, 15],
    description: "Travaux en copropriété, santé et sécurité",
  },
  {
    slug: "finances",
    name: "Finances",
    emoji: "💰",
    color: "#4ea947",
    chapters: [17, 18, 20, 21, 22],
    description: "Charges, comptes, budget prévisionnel",
  },
  {
    slug: "vie-copro",
    name: "Vie de la copro",
    emoji: "🏠",
    color: "#ec4899",
    chapters: [19, 23, 24, 25, 28],
    description: "Personnel, justice, troubles de voisinage",
  },
  {
    slug: "mutations",
    name: "Mutations",
    emoji: "🔄",
    color: "#14b8a6",
    chapters: [26, 27, 29, 30],
    description: "Assurance, vente, création de copropriété",
  },
];

export const getCategoryBySlug = (slug: string): Category | undefined =>
  categories.find((c) => c.slug === slug);
