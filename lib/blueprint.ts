import type { CtflQuestion } from "./types";

/**
 * Blueprint configurável.
 * A ideia é manter o simulado "realista":
 * - distribuição por capítulo
 * - mix de K-level (K1/K2/K3) respeitando disponibilidade
 *
 * Você pode ajustar esses números sem mexer no restante do app.
 */
export const CHAPTER_TARGETS: Record<1|2|3|4|5|6, number> = {
  1: 20,
  2: 20,
  3: 15,
  4: 30,
  5: 25,
  6: 10,
};

export const KLEVEL_TARGETS: Record<"K1"|"K2"|"K3", number> = {
  K1: 48,
  K2: 54,
  K3: 18,
};

// PRNG determinístico (Mulberry32)
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function() {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleInPlace<T>(arr: T[], rnd: () => number) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

type KLevel = "K1"|"K2"|"K3";
type Chapter = 1|2|3|4|5|6;

export function buildOrderedQuestionIds(all: CtflQuestion[], seed: number): string[] {
  const rnd = mulberry32(seed);

  // Bucket por capítulo e K-level
  const buckets: Record<Chapter, Record<KLevel, CtflQuestion[]>> = {
    1: { K1: [], K2: [], K3: [] },
    2: { K1: [], K2: [], K3: [] },
    3: { K1: [], K2: [], K3: [] },
    4: { K1: [], K2: [], K3: [] },
    5: { K1: [], K2: [], K3: [] },
    6: { K1: [], K2: [], K3: [] },
  };

  for (const q of all) buckets[q.chapter][q.kLevel].push(q);

  // Shuffle dentro de cada bucket (para randomizar seleção/ordem)
  (Object.keys(buckets) as unknown as Chapter[]).forEach((c) => {
    (["K1","K2","K3"] as KLevel[]).forEach((k) => shuffleInPlace(buckets[c][k], rnd));
  });

  // Alocação alvo por capítulo (respeita o mix K-level por disponibilidade)
  const chapterTargets = { ...CHAPTER_TARGETS };
  const kTargets = { ...KLEVEL_TARGETS };

  // Para cada capítulo, tentamos um mix "realista"
  // (mais K2; K3 quando fizer sentido)
  const desiredKMix: Record<Chapter, Record<KLevel, number>> = {
    1: { K1: 0.40, K2: 0.60, K3: 0.00 },
    2: { K1: 0.45, K2: 0.55, K3: 0.00 },
    3: { K1: 0.50, K2: 0.50, K3: 0.00 },
    4: { K1: 0.20, K2: 0.50, K3: 0.30 },
    5: { K1: 0.25, K2: 0.50, K3: 0.25 },
    6: { K1: 0.55, K2: 0.45, K3: 0.00 },
  };

  const chosen: CtflQuestion[] = [];

  function takeFrom(ch: Chapter, k: KLevel): CtflQuestion | null {
    if (chapterTargets[ch] <= 0) return null;
    if (kTargets[k] <= 0) return null;
    const item = buckets[ch][k].shift() ?? null;
    if (!item) return null;
    chapterTargets[ch] -= 1;
    kTargets[k] -= 1;
    return item;
  }

  // Passo 1: preencher por capítulo seguindo o mix desejado
  (Object.keys(desiredKMix) as unknown as Chapter[]).forEach((ch) => {
    const count = CHAPTER_TARGETS[ch];
    const kOrder: KLevel[] = ["K2","K1","K3"]; // prioriza K2, depois K1, depois K3
    const kQuota: Record<KLevel, number> = { K1: 0, K2: 0, K3: 0 };
    (["K1","K2","K3"] as KLevel[]).forEach((k) => {
      kQuota[k] = Math.round(count * desiredKMix[ch][k]);
    });

    // ajuste para fechar exatamente count
    const sum = kQuota.K1 + kQuota.K2 + kQuota.K3;
    if (sum !== count) kQuota.K2 += (count - sum);

    // pega respeitando quotas
    (kOrder).forEach((k) => {
      for (let i = 0; i < kQuota[k]; i++) {
        const got = takeFrom(ch, k);
        if (got) chosen.push(got);
      }
    });

    // fallback: se ainda faltou no capítulo, preenche com o que houver
    while (chapterTargets[ch] > 0) {
      const fallback = takeFrom(ch, "K2") ?? takeFrom(ch, "K1") ?? takeFrom(ch, "K3");
      if (!fallback) break;
      chosen.push(fallback);
    }
  });

  // Passo 2: se por algum motivo faltou total, preenche globalmente
  while (chosen.length < all.length) {
    const any =
      takeFrom(4,"K2") ?? takeFrom(5,"K2") ??
      takeFrom(1,"K2") ?? takeFrom(2,"K2") ??
      takeFrom(3,"K2") ?? takeFrom(6,"K2") ??
      takeFrom(4,"K1") ?? takeFrom(5,"K1") ??
      takeFrom(1,"K1") ?? takeFrom(2,"K1") ??
      takeFrom(3,"K1") ?? takeFrom(6,"K1") ??
      takeFrom(4,"K3") ?? takeFrom(5,"K3");
    if (!any) break;
    chosen.push(any);
  }

  // Ordem do simulado: intercalar capítulos para evitar blocos gigantes do mesmo tema
  const byChapter: Record<Chapter, CtflQuestion[]> = {1:[],2:[],3:[],4:[],5:[],6:[]};
  for (const q of chosen) byChapter[q.chapter].push(q);
  (Object.keys(byChapter) as unknown as Chapter[]).forEach((c) => shuffleInPlace(byChapter[c], rnd));

  const ordered: CtflQuestion[] = [];
  const chapterCycle: Chapter[] = [1,4,2,5,3,4,6,5]; // ciclo com ênfase em 4/5
  let guard = 0;
  while (ordered.length < chosen.length && guard++ < 5000) {
    let progressed = false;
    for (const ch of chapterCycle) {
      const item = byChapter[ch].shift();
      if (item) {
        ordered.push(item);
        progressed = true;
        if (ordered.length >= chosen.length) break;
      }
    }
    if (!progressed) {
      // qualquer resto
      for (const ch of [1,2,3,4,5,6] as Chapter[]) {
        const item = byChapter[ch].shift();
        if (item) ordered.push(item);
      }
    }
  }

  return ordered.map((q) => q.id);
}
