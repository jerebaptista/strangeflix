/**
 * Estrutura editorial original de *The Case of Charles Dexter Ward*:
 * I–V (capítulos) com 2, 6, 6, 4 e 7 partes.
 *
 * O texto em disco segue o Gutenberg (subtítulos _1. …_ … _5. …_); as partes
 * não coincidem com cada `* * * * *`. Usamos o início do primeiro parágrafo
 * de cada parte (substring estável) para alinhar à edição de referência.
 */

export const CHARLES_DEXTER_WARD_SLUG = "the-case-of-charles-dexter-ward";

const ROMAN = ["I", "II", "III", "IV", "V"] as const;

/** Converte título "1. A Result …" → "I. A Result …" */
export function wardDisplayChapterTitle(headingTitle: string): string {
  const m = headingTitle.match(/^(\d+)\.\s*(.+)$/);
  if (!m) return headingTitle;
  const n = Number(m[1]);
  if (n < 1 || n > 5) return headingTitle;
  return `${ROMAN[n - 1]}. ${m[2]}`;
}

/**
 * Para cada capítulo (índice 0–4), inícios do 2.º, 3.º, … parágrafo de cada parte
 * (texto do bloco parágrafo deve conter a substring).
 */
export const WARD_CHAPTER_PART_ANCHORS: string[][] = [
  // I — 2 partes
  ["One must look back at Charles Ward's earlier life"],
  // II — 6 partes
  [
    "The sight of this strange, pallid man, hardly middle-aged in aspect",
    "In 1766 came the final change in Joseph Curwen. It was very sudden,",
    "By the autumn of 1770 Weeden decided that the time was ripe",
    "The probability that Curwen was on guard and attempting unusual things,",
    "Not one man who participated in that terrible raid could ever be",
  ],
  // III — 6 partes
  [
    "Young Ward came home in a state of pleasant excitement, and spent",
    "We have now reached the point from which the more academic school of",
    "It was toward May when Dr. Willett, at the request of the senior Ward,",
    "Coming of age in April, 1923, and having previously inherited a small",
    "Then on the fifteenth of April a strange development occurred. While",
  ],
  // IV — 4 partes
  [
    "Not long after his mother's departure Charles Ward began negotiating",
    "The next morning Willett received a message from the senior Ward,",
    "And yet, after all, it was from no step of Mr. Ward's or Dr. Willett's",
  ],
  // V — 7 partes
  [
    "Willett freely admits that for a moment the memory of the old Curwen",
    "From that frightful smell and that uncanny noise Willett's attention",
    "In another moment he was hastily filling the burned-out lamps from an",
    "Marinus Bicknell Willett has no hope that any part of his tale will",
    "The following morning Dr. Willett hastened to the Ward home to",
    "That Dr. Willett's \"purgation\" had been an ordeal almost as",
  ],
];

export type WardBlock =
  | { type: "heading"; title: string; level: 1 | 2 }
  | { type: "paragraph"; text: string }
  | { type: "divider" };

/**
 * Partes do capítulo segundo âncoras; `null` se alguma âncora não for encontrada
 * (usa então o fallback por divisores `* * * * *` no reader).
 */
export function wardChapterPartsFromAnchors(
  chapterIndex: number,
  chapterStart: number,
  chapterEnd: number,
  blocks: WardBlock[],
): { title: string; start: number; end: number }[] | null {
  const anchors = WARD_CHAPTER_PART_ANCHORS[chapterIndex];
  if (!anchors?.length) {
    return [{ title: "Part 1", start: chapterStart, end: chapterEnd }];
  }

  let searchFrom = chapterStart;
  const partStarts: number[] = [chapterStart];

  for (const anchor of anchors) {
    let found = -1;
    for (let i = searchFrom; i < chapterEnd; i++) {
      const b = blocks[i];
      if (b?.type === "paragraph" && b.text.includes(anchor)) {
        found = i;
        break;
      }
    }
    if (found < 0) return null;
    partStarts.push(found);
    searchFrom = found + 1;
  }

  const parts: { title: string; start: number; end: number }[] = [];
  for (let p = 0; p < partStarts.length; p++) {
    const start = partStarts[p]!;
    const end = p + 1 < partStarts.length ? partStarts[p + 1]! : chapterEnd;
    if (start < end) {
      parts.push({ title: `Part ${p + 1}`, start, end });
    }
  }

  return parts.length > 0 ? parts : null;
}
