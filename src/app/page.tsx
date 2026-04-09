import Link from "next/link";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-12 relative">
      {/* Decorative blobs */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-soft pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-soft pointer-events-none" style={{ animationDelay: '1s' }} />

      {/* Logo / Titre */}
      <div className="text-center mb-10 sm:mb-14 animate-fade-in-up relative z-10">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-3xl font-bold mb-5 shadow-lg shadow-indigo-200 animate-float">
          CQ
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-3">
          <span className="gradient-text">Copro</span>
          <span className="text-slate-800">Quiz</span>
        </h1>
        <p className="text-slate-500 text-lg">
          Apprends la copropriété en jouant
        </p>
        <p className="text-slate-400 text-sm mt-1">par Coprovia</p>
      </div>

      {/* Choix du mode */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full max-w-lg stagger-children relative z-10">
        {/* Mode Solo */}
        <Link
          href="/solo"
          className="group relative overflow-hidden rounded-2xl glass-card p-6 sm:p-8 text-center transition-all duration-300 border-2 border-white/60 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-100/50 hover:-translate-y-1 shimmer-hover"
        >
          <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">🎯</div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">
            Mode Solo
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            Quiz par catégorie, niveaux à débloquer, progression sauvegardée
          </p>
          <div className="mt-4 inline-block text-xs font-semibold text-indigo-600 bg-indigo-50 rounded-full px-3 py-1.5 group-hover:bg-indigo-100 transition-colors">
            1 joueur
          </div>
        </Link>

        {/* Mode Party */}
        <Link
          href="/party"
          className="group relative overflow-hidden rounded-2xl glass-card p-6 sm:p-8 text-center transition-all duration-300 border-2 border-white/60 hover:border-purple-300 hover:shadow-xl hover:shadow-purple-100/50 hover:-translate-y-1 shimmer-hover"
        >
          <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">🎉</div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">
            Mode Party
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            Trivial Pursuit : badges, vol, compétition entre associés
          </p>
          <div className="mt-4 inline-block text-xs font-semibold text-purple-600 bg-purple-50 rounded-full px-3 py-1.5 group-hover:bg-purple-100 transition-colors">
            2-3 joueurs
          </div>
        </Link>
      </div>

      {/* Stats teaser */}
      <div className="flex items-center gap-6 mt-8 text-xs text-slate-400 relative z-10">
        <span>403 questions</span>
        <span className="w-1 h-1 rounded-full bg-slate-300" />
        <span>9 catégories</span>
        <span className="w-1 h-1 rounded-full bg-slate-300" />
        <span>3 niveaux</span>
      </div>

      {/* Liens footer */}
      <div className="flex gap-6 mt-6 relative z-10">
        <Link
          href="/dashboard"
          className="text-sm text-slate-400 hover:text-indigo-600 transition-colors font-medium"
        >
          📊 Dashboard
        </Link>
        <Link
          href="/classement"
          className="text-sm text-slate-400 hover:text-indigo-600 transition-colors font-medium"
        >
          🏆 Classement
        </Link>
      </div>
    </main>
  );
}
