import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#6366f1",
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "CoproQuiz — Apprends la copropriété en jouant",
  description:
    "Jeu éducatif pour maîtriser le syndic de copropriété. Mode Solo avec niveaux à débloquer et Mode Party façon Trivial Pursuit.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "CoproQuiz",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-dvh flex flex-col bg-slate-50 text-slate-900 font-[family-name:var(--font-geist-sans)] overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
