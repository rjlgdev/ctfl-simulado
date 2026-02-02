"use client";

import Link from "next/link";
import bank from "../data/questions_pt_120.json";
import { clearAllAttempts } from "../lib/storage";

export default function HomePage() {
  return (
    <main className="space-y-6">
      <section className="rounded-2xl border p-5 shadow-sm bg-white">
        <h2 className="text-lg font-semibold">Escolha o modo</h2>
        <p className="mt-1 text-sm text-zinc-600">
          Simulado com {bank.questionCount} questões. A ordem é randômica por tentativa, respeitando capítulos e K-level (K1/K2/K3). No modo Prova, você só vê as explicações no final.
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
            href="/exam/ctfl-pt-120?mode=prova"
            onClick={() => clearAllAttempts()}
          >
            Iniciar modo Prova
          </Link>

          <Link
            className="rounded-xl border px-4 py-2 text-sm font-medium"
            href="/exam/ctfl-pt-120?mode=treino"
            onClick={() => clearAllAttempts()}
          >
            Iniciar modo Treino
          </Link>
        </div>

        <p className="mt-4 text-xs text-zinc-500">
          Dica: em Treino você pode exibir feedback imediato depois de responder (opcional). Em Prova, só no resultado final.
        </p>
      </section>

      <section className="rounded-2xl border p-5 shadow-sm bg-white">
        <h3 className="text-base font-semibold">O que você recebe no final</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-700">
          <li>Nota final + aprovado/reprovado (corte 65%)</li>
          <li>Tempo total</li>
          <li>Revisão: só aparecem explicações nas questões erradas (e também dá pra ver em todas, se você quiser depois)</li>
        </ul>
      </section>
    </main>
  );
}
