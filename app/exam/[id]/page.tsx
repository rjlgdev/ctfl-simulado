"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import bank from "../../../data/questions_pt_120.json";
import type { Attempt, CtflQuestion, OptionKey } from "../../../lib/types";
import { loadCurrentAttempt, saveAttempt } from "../../../lib/storage";
import { buildOrderedQuestionIds } from "../../../lib/blueprint";

function nowMs() { return Date.now(); }

function makeAttempt(examId: string, mode: "prova" | "treino", allQuestions: CtflQuestion[]): Attempt {
  const attemptId = crypto.randomUUID();
  const seed = Math.floor(Math.random() * 2 ** 31);
  const orderedQuestionIds = buildOrderedQuestionIds(allQuestions, seed);

  const answers: Attempt["answers"] = {};
  const flagged: Attempt["flagged"] = {};
  const timeSpentSec: Attempt["timeSpentSec"] = {};
  for (const q of allQuestions) {
    answers[q.id] = null;
    flagged[q.id] = false;
    timeSpentSec[q.id] = 0;
  }

  return {
    attemptId,
    examId,
    mode,
    startedAt: nowMs(),
    seed,
    orderedQuestionIds,
    answers,
    flagged,
    timeSpentSec,
    currentIndex: 0,
  };
}

export default function ExamPage() {
  const router = useRouter();
  const params = useSearchParams();
  const mode = (params.get("mode") === "treino" ? "treino" : "prova") as "prova" | "treino";

  const allQuestions = useMemo(() => bank.questions as CtflQuestion[], []);
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const attemptRef = useRef<Attempt | null>(null);

  const tickRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(nowMs());

  useEffect(() => {
    const saved = loadCurrentAttempt();
    if (saved && saved.examId === bank.examId) {
      setAttempt(saved);
      attemptRef.current = saved;
    } else {
      const a = makeAttempt(bank.examId, mode, allQuestions);
      setAttempt(a);
      attemptRef.current = a;
      saveAttempt(a);
    }
  }, [mode, allQuestions]);

  useEffect(() => {
    attemptRef.current = attempt;
  }, [attempt]);

  const questions = useMemo(() => {
    if (!attempt) return allQuestions;
    const map = new Map(allQuestions.map((q) => [q.id, q]));
    return attempt.orderedQuestionIds.map((id) => map.get(id)!).filter(Boolean);
  }, [attempt, allQuestions]);

  useEffect(() => {
    if (!attempt) return;

    if (tickRef.current) window.clearInterval(tickRef.current);
    lastTickRef.current = nowMs();

    tickRef.current = window.setInterval(() => {
      setAttempt((prev) => {
        if (!prev) return prev;
        const idx = prev.currentIndex;
        const q = questions[idx];
        const now = nowMs();
        const delta = Math.max(0, Math.round((now - lastTickRef.current) / 1000));
        lastTickRef.current = now;

        const updated: Attempt = {
          ...prev,
          timeSpentSec: {
            ...prev.timeSpentSec,
            [q.id]: (prev.timeSpentSec[q.id] ?? 0) + delta,
          },
        };

        const spent = updated.timeSpentSec[q.id] ?? 0;
        if (spent >= q.timeLimitSec && idx < questions.length - 1) {
          updated.currentIndex = idx + 1;
          lastTickRef.current = nowMs();
        }

        saveAttempt(updated);
        return updated;
      });
    }, 1000);

    return () => {
      if (tickRef.current) window.clearInterval(tickRef.current);
      tickRef.current = null;
    };
  }, [attempt, questions]);

  if (!attempt) return <div className="text-sm text-zinc-600">Carregando...</div>;

  const q = questions[attempt.currentIndex];
  const selected = attempt.answers[q.id];

  const spent = attempt.timeSpentSec[q.id] ?? 0;
  const remaining = Math.max(0, q.timeLimitSec - spent);

  function setAnswer(key: OptionKey) {
    setAttempt((prev) => {
      if (!prev) return prev;
      const updated: Attempt = { ...prev, answers: { ...prev.answers, [q.id]: key } };
      saveAttempt(updated);
      return updated;
    });
  }

  function toggleFlag() {
    setAttempt((prev) => {
      if (!prev) return prev;
      const updated: Attempt = {
        ...prev,
        flagged: { ...prev.flagged, [q.id]: !prev.flagged[q.id] },
      };
      saveAttempt(updated);
      return updated;
    });
  }

  function go(delta: number) {
    setAttempt((prev) => {
      if (!prev) return prev;
      const next = Math.min(Math.max(0, prev.currentIndex + delta), questions.length - 1);
      const updated: Attempt = { ...prev, currentIndex: next };
      saveAttempt(updated);
      lastTickRef.current = nowMs();
      return updated;
    });
  }

  function finish() {
    if (tickRef.current) {
      window.clearInterval(tickRef.current);
      tickRef.current = null;
    }

    const snapshot = attemptRef.current;
    if (!snapshot) return;

    const updated: Attempt = { ...snapshot, finishedAt: nowMs() };
    saveAttempt(updated);
    router.push(`/result/${updated.attemptId}`);
  }

  const progressPct = Math.round(((attempt.currentIndex + 1) / questions.length) * 100);

  return (
    <main className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm text-zinc-600">
          Questão <span className="font-medium text-zinc-900">{attempt.currentIndex + 1}</span> / {questions.length}
          <span className="ml-2 rounded-full border px-2 py-0.5 text-xs">{q.chapterName}</span>
          {attempt.flagged[q.id] ? <span className="ml-2 text-xs font-medium text-amber-700">⚑ marcada</span> : null}
        </div>

        <div className="text-sm">
          <span className="rounded-xl border px-3 py-1">
            ⏱️ {remaining}s
          </span>
        </div>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100">
        <div className="h-full bg-zinc-900" style={{ width: `${progressPct}%` }} />
      </div>

      <section className="rounded-3xl border p-5 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-zinc-500">
          <div>{q.kLevel} • {q.difficulty} • limite {q.timeLimitSec}s</div>
          <div className="text-xs">seed: {attempt.seed}</div>
        </div>

        <h2 className="mt-2 text-base font-semibold leading-relaxed">
          {q.stem}
        </h2>

        <div className="mt-4 space-y-2">
          {q.options.map((opt) => {
            const isSelected = selected === opt.key;
            return (
              <button
                key={opt.key}
                onClick={() => setAnswer(opt.key)}
                className={[
                  "w-full rounded-xl border px-4 py-3 text-left text-sm transition",
                  isSelected ? "border-zinc-900 bg-zinc-50" : "hover:bg-zinc-50"
                ].join(" ")}
              >
                <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-lg border text-xs font-bold">
                  {opt.key}
                </span>
                {opt.text}
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button className="rounded-xl border px-3 py-2 text-sm hover:bg-zinc-50" onClick={toggleFlag}>
            {attempt.flagged[q.id] ? "Desmarcar revisão" : "Marcar para revisão"}
          </button>
        </div>
      </section>

      <div className="flex items-center justify-between gap-3">
        <button className="rounded-xl border px-4 py-2 text-sm hover:bg-zinc-50 disabled:opacity-50" onClick={() => go(-1)} disabled={attempt.currentIndex === 0}>
          ← Anterior
        </button>

        <div className="flex items-center gap-2">
          <button className="rounded-xl border px-4 py-2 text-sm hover:bg-zinc-50 disabled:opacity-50" onClick={() => go(1)} disabled={attempt.currentIndex === questions.length - 1}>
            Próxima →
          </button>
          <button className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800" onClick={finish}>
            Finalizar
          </button>
        </div>
      </div>
    </main>
  );
}
