import Link from "next/link";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-12">
      {/* Logo / Titre */}
      <div className="text-center mb-8 sm:mb-12 animate-fade-in-up">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-2">
          <span className="text-indigo-600">Copro</span>
          <span className="text-slate-800">Quiz</span>
        </h1>
        <p className="text-slate-500 text-lg">
          Apprends la copropriété en jouant
        </p>
        <p className="text-slate-400 text-sm mt-1">par Coprovia</p>
      </div>

      {/* Choix du mode */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full max-w-lg stagger-children">
        {/* Mode Solo */}
        <Link
          href="/solo"
          className="group relative overflow-hidden rounded-2xl bg-white border-2 border-slate-200 p-6 sm:p-8 text-center transition-all hover:border-indigo-400 hover:shadow-lg hover:shadow-indigo-100"
        >
          <div className="text-4xl mb-4">🎯</div>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">
            Mode Solo
          </h2>
          <p className="text-sm text-slate-500">
            Quiz par catégorie, niveaux à débloquer, progression sauvegardée
          </p>
          <div className="mt-4 inline-block text-xs font-medium text-indigo-600 bg-indigo-50 rounded-full px-3 py-1">
            1 joueur
          </div>
        </Link>

        {/* Mode Party */}
        <Link
          href="/party"
          className="group relative overflow-hidden rounded-2xl bg-white border-2 border-slate-200 p-6 sm:p-8 text-center transition-all hover:border-purple-400 hover:shadow-lg hover:shadow-purple-100"
        >
          <div className="text-4xl mb-4">🎉</div>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">
            Mode Party
          </h2>
          <p className="text-sm text-slate-500">
            Trivial Pursuit : badges, vol, compétition entre associés
          </p>
          <div className="mt-4 inline-block text-xs font-medium text-purple-600 bg-purple-50 rounded-full px-3 py-1">
            2-3 joueurs
          </div>
        </Link>
      </div>

      {/* Lien classement */}
      <Link
        href="/classement"
        className="mt-8 text-sm text-slate-400 hover:text-indigo-600 transition-colors"
      >
        🏆 Voir le classement
      </Link>
    </main>
  );
}
