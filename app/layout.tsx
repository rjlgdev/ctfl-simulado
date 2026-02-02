import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Simulado CTFL (PT-BR)",
  description: "Simulado estilo CTFL com timer por questão e revisão com explicações.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-gradient-to-br from-zinc-100 via-white to-zinc-100" className="min-h-screen">
        <div className="mx-auto max-w-3xl px-4 py-8">
          <header className="mb-8 rounded-2xl border bg-white p-5 shadow-sm">
            <h1 className="text-2xl font-semibold">Simulado CTFL (PT-BR)</h1>
            <span className="ml-2 rounded-full bg-zinc-100 px-2 py-0.5 text-xs">120 questões</span>
            <p className="text-sm text-zinc-600">
              Timer por questão • Resultado final • Revisão com explicações
            </p>
          </header>
          <div className="rounded-2xl bg-white p-5 shadow-sm border">
            {children}
          </div>
          <footer className="mt-10 border-t pt-4 text-xs text-zinc-500 print:hidden">
            Feito para a comunidade QA • Conteúdo original inspirado no syllabus CTFL
          </footer>
        </div>
      </body>
    </html>
  );
}
