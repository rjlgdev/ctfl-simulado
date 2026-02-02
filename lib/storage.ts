import type { Attempt } from "./types";

// Guarda o ID da última tentativa ativa
const CURRENT_KEY = "ctfl_simulado_current_attempt_v1";
// Guarda cada tentativa por ID
const ATTEMPT_PREFIX = "ctfl_simulado_attempt_v1:";

export function saveAttempt(attempt: Attempt) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ATTEMPT_PREFIX + attempt.attemptId, JSON.stringify(attempt));
  window.localStorage.setItem(CURRENT_KEY, attempt.attemptId);
}

export function loadAttemptById(attemptId: string): Attempt | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(ATTEMPT_PREFIX + attemptId);
  if (!raw) return null;
  try { return JSON.parse(raw) as Attempt; } catch { return null; }
}

export function loadCurrentAttempt(): Attempt | null {
  if (typeof window === "undefined") return null;
  const id = window.localStorage.getItem(CURRENT_KEY);
  if (!id) return null;
  return loadAttemptById(id);
}

export function clearAllAttempts() {
  if (typeof window === "undefined") return;

  const keys: string[] = [];
  for (let i = 0; i < window.localStorage.length; i++) {
    const k = window.localStorage.key(i);
    if (k && (k.startsWith(ATTEMPT_PREFIX) || k === CURRENT_KEY)) keys.push(k);
  }
  keys.forEach((k) => window.localStorage.removeItem(k));
}
