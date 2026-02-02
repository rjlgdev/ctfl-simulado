"use client";

import Link from "next/link";
import bank from "../../../data/questions_pt_120.json";
import type { Attempt, CtflQuestion } from "../../../lib/types";
import { loadAttemptById, clearAllAttempts } from "../../../lib/storage";
import { scoreAttempt } from "../../../lib/scoring";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";

type FocusRow = {
  label: string;
  total: number;
  wrong: number;
  accuracyPct: number;
};

export default function ResultPage() {
  const params = useParams<{ attemptId: string }>();
  const questions = useMemo(() => bank.questions as CtflQuestion[], []);
  const [attempt, setAttempt] = useState<Attempt | null>(null);

  useEffect(() => {
    const id = params?.attemptId;
    if (!id) return;
    const a = loadAttemptById(id);
    setAttempt(a);
  }, [params]);

  if (!attempt) return <div className="text-sm text-zinc-600">Carregando resultado...</div>;

  const s = scoreAttempt(questions, attempt);

  const wrongIds = new Set(s.perQuestion.filter((x) => !x.ok || x.given === null).map((x) => x.id));

  const focusByK = (["K1","K2","K3"] as const).map((k) => {
    const qs = questions.filter((q) => q.kLevel === k);
    const wrong = qs.filter((q) => wrongIds.has(q.id)).length;
    const total = qs.length;
    const accuracyPct = total === 0 ? 0 : Math.round(((total - wrong) / total) * 100);
    return { label: k, total, wrong, accuracyPct } satisfies FocusRow;
  });

  const focusByChapter = ([1,2,3,4,5,6] as const).map((c) => {
    const qs = questions.filter((q) => q.chapter === c);
    const wrong = qs.filter((q) => wrongIds.has(q.id)).length;
    const total = qs.length;
    const accuracyPct = total === 0 ? 0 : Math.round(((total - wrong) / total) * 100);
    const label = `Cap. ${c} — ${qs[0]?.chapterName ?? ""}`.trim();
    return { label, total, wrong, accuracyPct } satisfies FocusRow;
  });

  const suggestedFocus = [...focusByK, ...focusByChapter]
    .filter((r) => r.total > 0)
    .sort((a, b) => a.accuracyPct - b.accuracyPct)
    .slice(0, 3);

  function exportPdf() {
    window.print();
  }

  return (
    <main className="space-y-6">
      <section className="rounded-3xl border p-5 shadow-md print:border-0 print:p-0 print:shadow-none">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Resultado</h2>
            <p className="mt-1 text-xs text-zinc-500">
              Simulado: {bank.examId} • seed: {attempt.seed}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 print:hidden">
            <button className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800" onClick={exportPdf}>
              Exportar em PDF
            </button>
            <Link className="rounded-xl border px-4 py-2 text-sm hover:bg-zinc-50" href="/study">📚 Estudar</Link>
            <Link className="rounded-xl border px-4 py-2 text-sm hover:bg-zinc-50" href="/" onClick={() => clearAllAttempts()}>
              Voltar ao início
            </Link>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl border p-3 print:border">
            <div className="text-zinc-500">Acertos</div>
            <div className="text-xl font-semibold">{s.correct} / {s.total}</div>
          </div>
          <div className="rounded-xl border p-3 print:border">
            <div className="text-zinc-500">Nota</div>
            <div className="text-xl font-semibold">{s.percent}%</div>
          </div>
          <div className="rounded-xl border p-3 print:border">
            <div className="text-zinc-500">Status</div>
            <div className={"text-xl font-semibold " + (s.passed ? "text-emerald-700" : "text-rose-700")}>
              {s.passed ? "Aprovado" : "Reprovado"}
            </div>
          </div>
          <div className="rounded-xl border p-3 print:border">
            <div className="text-zinc-500">Tempo total</div>
            <div className="text-xl font-semibold">{s.totalTimeSec}s</div>
          </div>
        </div>

        <div className="mt-5 rounded-3xl border p-4 print:border">
          <h3 className="text-base font-semibold">Onde focar mais (resumo para PDF)</h3>
          <p className="mt-1 text-sm text-zinc-600">
            Baseado nos seus erros, estas são as áreas com menor acurácia.
          </p>

          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border p-3">
              <div className="text-sm font-semibold">Por K-level</div>
              <div className="mt-2 space-y-2 text-sm">
                {focusByK.map((r) => (
                  <div key={r.label} className="flex items-center justify-between">
                    <span className="text-zinc-700">{r.label}</span>
                    <span className="font-medium">{r.accuracyPct}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border p-3">
              <div className="text-sm font-semibold">Por capítulo</div>
              <div className="mt-2 space-y-2 text-sm">
                {focusByChapter.map((r) => (
                  <div key={r.label} className="flex items-center justify-between">
                    <span className="text-zinc-700">{r.label}</span>
                    <span className="font-medium">{r.accuracyPct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-3 rounded-xl bg-zinc-50 p-3 text-sm print:bg-transparent print:border">
            <div className="font-semibold">Sugestão rápida</div>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-zinc-700">
              {suggestedFocus.map((r) => (
                <li key={r.label}>
                  <span className="font-medium">{r.label}</span>: {r.accuracyPct}% (erros: {r.wrong}/{r.total})
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-3 text-xs text-zinc-500 print:hidden">
          Ao exportar, selecione “Salvar como PDF” no diálogo de impressão.
        </p>
      </section>

      <section className="rounded-3xl border p-5 shadow-md print:border-0 print:p-0 print:shadow-none">
        <h3 className="text-base font-semibold">Revisão (explicações apenas nas erradas)</h3>
        <p className="mt-1 text-sm text-zinc-600 print:hidden">
          Abaixo aparecem somente as questões em que você errou, com a alternativa correta e a explicação.
        </p>

        <div className="mt-4 space-y-4">
          {s.perQuestion.filter((x) => !x.ok || x.given === null).map((x) => {
            const q = questions.find((qq) => qq.id === x.id)!;
            const givenKey = x.given ?? null;
            const givenText = givenKey ? (q.options.find((o) => o.key === givenKey)?.text ?? "") : "";
            const correctText = q.options.find((o) => o.key === q.correct)?.text ?? "";

            return (
              <div key={q.id} className="rounded-3xl border p-4 print:break-inside-avoid">
                <div className="text-xs text-zinc-500">{q.chapterName} • {q.kLevel} • {q.difficulty}</div>
                <div className="mt-1 text-sm font-semibold">{q.id} — {q.stem}</div>

                <div className="mt-2 text-sm space-y-1">
                  <div>
                    <span className="font-semibold text-rose-700">Sua resposta:</span>{" "}
                    {givenKey ? `${givenKey} — ${givenText}` : "Não respondida"}
                  </div>
                  <div>
                    <span className="font-semibold text-emerald-700">Correta:</span>{" "}
                    {q.correct} — {correctText}
                  </div>
                </div>

                <div className="mt-2 rounded-xl bg-zinc-50 p-3 text-sm print:bg-transparent print:border">
                  <div className="font-semibold">Explicação</div>
                  <div className="mt-1 text-zinc-700">{q.explanation}</div>
                </div>
              </div>
            );
          })}

          {s.perQuestion.every((x) => x.ok) ? (
            <div className="rounded-3xl border p-4 text-sm text-zinc-700">
              Você acertou todas — excelente. 🎯
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
