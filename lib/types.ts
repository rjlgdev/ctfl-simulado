export type OptionKey = "A" | "B" | "C" | "D";

export type CtflQuestion = {
  id: string;
  chapter: 1 | 2 | 3 | 4 | 5 | 6;
  chapterName: string;
  kLevel: "K1" | "K2" | "K3";
  difficulty: "easy" | "medium" | "hard";
  timeLimitSec: number;
  stem: string;
  options: { key: OptionKey; text: string }[];
  correct: OptionKey;
  explanation: string;
  tags: string[];
};

export type ExamBank = {
  examId: string;
  language: "pt-BR";
  questionCount: number;
  questions: CtflQuestion[];
};

export type Attempt = {
  attemptId: string;
  examId: string;
  mode: "prova" | "treino";
  startedAt: number; // epoch ms
  finishedAt?: number; // epoch ms

  // Ordem do simulado (gerada de forma randômica, mas respeitando capítulos e K-level)
  seed: number;
  orderedQuestionIds: string[];

  answers: Record<string, OptionKey | null>;
  flagged: Record<string, boolean>;
  timeSpentSec: Record<string, number>;
  currentIndex: number;
};
