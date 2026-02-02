import type { CtflQuestion, Attempt } from "./types";

export function scoreAttempt(questions: CtflQuestion[], attempt: Attempt) {
  let correct = 0;
  const perQuestion = questions.map((q) => {
    const given = attempt.answers[q.id] ?? null;
    const ok = given === q.correct;
    if (ok) correct += 1;
    return { id: q.id, given: given ?? null, correct: q.correct, ok };
  });

  const total = questions.length;
  const percent = total === 0 ? 0 : Math.round((correct / total) * 100);
  // corte default 65% (configurável)
  const passed = percent >= 65;

  const startedAt = attempt.startedAt;
  const finishedAt = attempt.finishedAt ?? Date.now();
  const totalTimeSec = Math.max(0, Math.round((finishedAt - startedAt) / 1000));

  return { correct, total, percent, passed, totalTimeSec, perQuestion };
}
