import Link from "next/link";
import Logo from "@/components/logo";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-12 relative">
      {/* Decorative blobs */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-soft pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-soft pointer-events-none" style={{ animationDelay: '1s' }} />

      {/* Logo / Titre */}
      <div className="text-center mb-10 sm:mb-14 animate-fade-in-up relative z-10">
        <div className="inline-block mb-5 animate-float">
          <Logo size={88} className="drop-shadow-lg" />
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
          className="group relative overflow-hidden rounded-2xl glass-card p-6 sm:p-8 text-center transition-all duration-300 border-2 border-white/60 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-100/50 hover:-translate-y-1 shimmer-hover cursor-pointer"
        >
          {/* Decorative mini-illustration */}
          <div className="relative inline-block mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-100 to-indigo-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-3xl">🎯</span>
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-indigo-500 text-white text-[10px] font-bold flex items-center justify-center shadow-sm">1</div>
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">
            Mode Solo
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            Progresse à ton rythme, débloque les niveaux et deviens expert
          </p>
          <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 group-hover:text-indigo-700 transition-colors">
            <span>Commencer</span>
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </div>
        </Link>

        {/* Mode Party */}
        <Link
          href="/party"
          className="group relative overflow-hidden rounded-2xl glass-card p-6 sm:p-8 text-center transition-all duration-300 border-2 border-white/60 hover:border-purple-300 hover:shadow-xl hover:shadow-purple-100/50 hover:-translate-y-1 shimmer-hover cursor-pointer"
        >
          {/* Decorative mini-illustration */}
          <div className="relative inline-block mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-3xl">🎉</span>
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-purple-500 text-white text-[10px] font-bold flex items-center justify-center shadow-sm">2+</div>
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">
            Mode Party
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            Défie tes collègues ! Collecte des badges et vole la victoire
          </p>
          <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-purple-600 group-hover:text-purple-700 transition-colors">
            <span>Jouer ensemble</span>
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </div>
        </Link>
      </div>

      {/* Stats teaser */}
      <div className="flex items-center gap-4 sm:gap-6 mt-8 text-xs text-slate-400 relative z-10">
        <span className="flex items-center gap-1.5"><span className="text-indigo-400">✦</span> 403 questions</span>
        <span className="w-1 h-1 rounded-full bg-slate-300" />
        <span className="flex items-center gap-1.5"><span className="text-purple-400">✦</span> 9 catégories</span>
        <span className="w-1 h-1 rounded-full bg-slate-300" />
        <span className="flex items-center gap-1.5"><span className="text-amber-400">✦</span> 3 niveaux</span>
      </div>

      {/* Liens footer */}
      <div className="flex gap-4 mt-6 relative z-10">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm text-slate-500 hover:text-indigo-600 hover:bg-white/60 transition-all font-medium cursor-pointer"
        >
          📊 Dashboard
        </Link>
        <Link
          href="/classement"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm text-slate-500 hover:text-indigo-600 hover:bg-white/60 transition-all font-medium cursor-pointer"
        >
          🏆 Classement
        </Link>
      </div>
    </main>
  );
}
