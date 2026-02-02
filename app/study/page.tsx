"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { STUDY_CHAPTERS } from "../../lib/studyContent";
import Pomodoro from "../../components/Pomodoro";

type OpenMap = Record<string, boolean>;

function cn(...xs: (string | false | null | undefined)[]) {
  return xs.filter(Boolean).join(" ");
}

export default function StudyPage() {
  const [open, setOpen] = useState<OpenMap>({});

  const totalMinutes = useMemo(() => {
    return STUDY_CHAPTERS.reduce(
      (acc, ch) => acc + ch.sections.reduce((a, s) => a + s.minutes, 0),
      0
    );
  }, []);

  function toggle(id: string) {
    setOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <main className="space-y-6">
      <section className="rounded-3xl border bg-gradient-to-br from-white to-zinc-50 p-6 shadow-md">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold">📚 Material de estudo — CTFL 4.0 (PT-BR)</h1>
            <p className="mt-1 text-sm text-zinc-600">
              Resumo prático por capítulo + pegadinhas + mini-checklists. Ideal para estudar antes do simulado.
            </p>
            <p className="mt-2 text-xs text-zinc-500">
              Tempo sugerido total: <span className="font-medium text-zinc-900">{totalMinutes} min</span> (você pode fazer em blocos).
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link className="rounded-xl border px-4 py-2 text-sm hover:bg-zinc-50" href="/">
              ← Voltar
            </Link>
            <Link className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800" href="/exam/ctfl?mode=prova">
              Ir para o Simulado
            </Link>
          </div>
        </div>
      
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2 rounded-3xl border bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold">Como estudar aqui</h2>
            <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-zinc-700">
              <li>Escolha um capítulo.</li>
              <li>Inicie um Pomodoro de foco.</li>
              <li>Leia conceitos + pegadinhas.</li>
              <li>Marque o checklist.</li>
              <li>Faça questões no modo Treino.</li>
            </ol>
          </div>
          <Pomodoro />
        </div>
        </section>

      {STUDY_CHAPTERS.map((ch) => (
        <section key={ch.chapter} className="rounded-2xl border p-5 shadow-sm">
          <h2 className="text-base font-semibold">
            Capítulo {ch.chapter} — {ch.name}
          </h2>

          <div className="mt-4 space-y-3">
            {ch.sections.map((s) => {
              const isOpen = !!open[s.id];
              return (
                <div key={s.id} className="rounded-2xl border">
                  <button
                    onClick={() => toggle(s.id)}
                    className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                  >
                    <div>
                      <div className="text-sm font-semibold">{s.title}</div>
                      <div className="text-xs text-zinc-500">⏱️ {s.minutes} min</div>
                    </div>
                    <div className={cn("text-sm text-zinc-600", isOpen && "rotate-180")}>⌄</div>
                  </button>

                  {isOpen ? (
                    <div className="border-t px-4 py-4">
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="md:col-span-2">
                          <div className="text-sm font-semibold">Conceitos-chave</div>
                          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-700">
                            {s.bullets.map((b, i) => <li key={i}>{b}</li>)}
                          </ul>

                          <div className="mt-4 text-sm font-semibold">Pegadinhas de prova</div>
                          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-700">
                            {s.pegadinhas.map((p, i) => <li key={i}>{p}</li>)}
                          </ul>
                        </div>

                        <div>
                          <div className="text-sm font-semibold">Mini-checklist</div>
                          <ul className="mt-2 space-y-2 text-sm">
                            {s.miniChecklist.map((c, i) => (
                              <li key={i} className="flex gap-2">
                                <span className="mt-0.5 inline-block h-4 w-4 rounded border" />
                                <span className="text-zinc-700">{c}</span>
                              </li>
                            ))}
                          </ul>

                          <div className="mt-4 rounded-xl bg-zinc-50 p-3 text-xs text-zinc-600">
                            Dica: estude esta seção e depois faça 10 questões em modo <span className="font-medium text-zinc-900">Treino</span> focando no mesmo capítulo.
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </section>
      ))}

      <section className="rounded-3xl border bg-gradient-to-br from-white to-zinc-50 p-6 shadow-md">
        <h2 className="text-base font-semibold">✅ Roteiro rápido (para passar)</h2>
        <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-zinc-700">
          <li>Leia Cap. 1 e Cap. 4 com calma (são os mais cobrados).</li>
          <li>Faça 1 simulado em modo Prova e exporte o PDF do “Onde focar mais”.</li>
          <li>Volte aqui e estude as seções onde sua acurácia foi mais baixa (K1/K2/K3 e capítulos).</li>
          <li>Repita até estabilizar acima do corte.</li>
        </ol>

        <div className="mt-4">
          <Link className="inline-flex rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800" href="/exam/ctfl?mode=prova">
            Começar o Simulado agora →
          </Link>
        </div>
      </section>
    </main>
  );
}
