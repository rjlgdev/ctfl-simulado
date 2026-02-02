"use client";

import { useEffect, useRef, useState } from "react";

type Mode = "focus" | "break";

export default function Pomodoro({
  focusMin = 25,
  breakMin = 5,
}: {
  focusMin?: number;
  breakMin?: number;
}) {
  const [mode, setMode] = useState<Mode>("focus");
  const [seconds, setSeconds] = useState(focusMin * 60);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = window.setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          const nextMode: Mode = mode === "focus" ? "break" : "focus";
          setMode(nextMode);
          return (nextMode === "focus" ? focusMin : breakMin) * 60;
        }
        return s - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [running, mode, focusMin, breakMin]);

  function toggle() {
    setRunning((r) => !r);
  }

  function reset() {
    setRunning(false);
    setMode("focus");
    setSeconds(focusMin * 60);
  }

  const min = Math.floor(seconds / 60).toString().padStart(2, "0");
  const sec = (seconds % 60).toString().padStart(2, "0");

  return (
    <div className="rounded-3xl border bg-gradient-to-br from-zinc-50 to-white p-5 shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-zinc-500">Pomodoro</div>
          <div className="text-sm font-semibold">
            {mode === "focus" ? "🧠 Foco" : "☕ Pausa"}
          </div>
        </div>
        <span
          className={
            "rounded-full px-3 py-1 text-xs font-medium " +
            (mode === "focus"
              ? "bg-emerald-100 text-emerald-800"
              : "bg-amber-100 text-amber-800")
          }
        >
          {mode === "focus" ? `${focusMin} min` : `${breakMin} min`}
        </span>
      </div>

      <div className="mt-4 text-center">
        <div className="text-5xl font-bold tracking-tight">
          {min}:{sec}
        </div>
      </div>

      <div className="mt-5 flex gap-2">
        <button
          onClick={toggle}
          className="flex-1 rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          {running ? "Pausar" : "Iniciar"}
        </button>
        <button
          onClick={reset}
          className="rounded-xl border px-4 py-2 text-sm hover:bg-zinc-50"
        >
          Resetar
        </button>
      </div>

      <p className="mt-3 text-xs text-zinc-500">
        Dica: faça 1 Pomodoro por seção e só avance quando marcar o checklist.
      </p>
    </div>
  );
}
