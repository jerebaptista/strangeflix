"use client";

import Link from "next/link";
import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, ChevronLeft, ChevronRight, Menu } from "lucide-react";
import { Drawer, DrawerClose, DrawerContent } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import {
  CHARLES_DEXTER_WARD_SLUG,
  wardChapterPartsFromAnchors,
  wardDisplayChapterTitle,
} from "@/lib/charles-dexter-ward-structure";

const STORAGE_KEY = "strangeflix-reader-prefs";

/** 14 opções: 14, 16, …, 40 px */
const FONT_SIZE_STEPS = Array.from({ length: 14 }, (_, i) => 14 + i * 2);

export type ReaderFont = "libreBaskerville" | "inter" | "parisienne";
export type ReaderTheme = "light" | "dark" | "beige" | "green";
export type ReaderSpacing = "narrow" | "medium" | "wide";

type Prefs = {
  font: ReaderFont;
  sizeIndex: number;
  theme: ReaderTheme;
  spacing: ReaderSpacing;
};

const DEFAULT_PREFS: Prefs = {
  font: "libreBaskerville",
  sizeIndex: 3,
  theme: "light",
  spacing: "medium",
};

const SPACING_LINE_HEIGHT: Record<ReaderSpacing, number> = {
  narrow: 1.4,
  medium: 1.65,
  wide: 1.9,
};

const SPACING_PARAGRAPH_GAP_EM: Record<ReaderSpacing, number> = {
  narrow: 0.8,
  medium: 1.2,
  wide: 1.7,
};

/** Fontes carregadas no layout via next/font/google. */
const FONT_OPTIONS: { id: ReaderFont; label: string; fontFamily: string }[] = [
  {
    id: "libreBaskerville",
    label: "Baskerville",
    fontFamily: 'var(--font-libre-baskerville), Georgia, "Times New Roman", serif',
  },
  {
    id: "inter",
    label: "Inter",
    fontFamily: 'var(--font-inter), "Helvetica Neue", Arial, sans-serif',
  },
  {
    id: "parisienne",
    label: "Parisienne",
    fontFamily: 'var(--font-parisienne), "Brush Script MT", cursive',
  },
];

const THEMES: Record<
  ReaderTheme,
  { bg: string; fg: string; header: string; headerFg: string; border: string; label: string }
> = {
  light: {
    bg: "#ffffff",
    fg: "#1a1a1a",
    header: "#d4d4d8",
    headerFg: "#18181b",
    border: "#d4d4d8",
    label: "Light",
  },
  dark: {
    bg: "#18181b",
    fg: "#e4e4e7",
    header: "#0f0f0f",
    headerFg: "#fafafa",
    border: "#27272a",
    label: "Dark",
  },
  beige: {
    bg: "#e5dcc5",
    fg: "#3d2914",
    header: "#b8a990",
    headerFg: "#2d1f0f",
    border: "#a89880",
    label: "Beige",
  },
  green: {
    bg: "#d4edda",
    fg: "#1e3a2f",
    header: "#8fbf9a",
    headerFg: "#143028",
    border: "#7aad85",
    label: "Green",
  },
};

function loadPrefs(): Prefs {
  if (typeof window === "undefined") return DEFAULT_PREFS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PREFS;
    const p = JSON.parse(raw) as Partial<Prefs>;
    const font =
      p.font === "libreBaskerville" || p.font === "inter" || p.font === "parisienne"
        ? p.font
        : DEFAULT_PREFS.font;
    const spacing: ReaderSpacing =
      p.spacing === "narrow" || p.spacing === "medium" || p.spacing === "wide"
        ? p.spacing
        : DEFAULT_PREFS.spacing;
    return {
      font,
      sizeIndex:
        typeof p.sizeIndex === "number" && p.sizeIndex >= 0 && p.sizeIndex < 14
          ? p.sizeIndex
          : DEFAULT_PREFS.sizeIndex,
      theme:
        p.theme === "dark" || p.theme === "beige" || p.theme === "green" || p.theme === "light"
          ? p.theme
          : DEFAULT_PREFS.theme,
      spacing,
    };
  } catch {
    return DEFAULT_PREFS;
  }
}

function fontFamilyFor(f: ReaderFont): string {
  return FONT_OPTIONS.find((o) => o.id === f)?.fontFamily ?? FONT_OPTIONS[0].fontFamily;
}

type Props = {
  title: string;
  authorName: string;
  publicationDate?: string | null;
  publishedIn?: string | null;
  fullText: string;
  /** Quando definido, permite regras específicas (ex.: partes canónicas do Charles Dexter Ward). */
  bookSlug?: string;
};

type ReaderSection = {
  blockIndex: number;
  title: string;
  level: 1 | 2;
};

type ReaderBlock =
  | { type: "heading"; title: string; level: 1 | 2 }
  | { type: "paragraph"; text: string; isLetter?: boolean; isNews?: boolean }
  | { type: "divider" };

type ReaderPart = {
  title: string;
  start: number;
  end: number;
};

function detectSection(line: string): { title: string; level: 1 | 2 } | null {
  const italicNumericHeading = line.match(/^\s*_+(\d+)\.\s+(.+?)_+\s*$/);
  if (italicNumericHeading) {
    return {
      title: `${italicNumericHeading[1]}. ${italicNumericHeading[2].trim()}`,
      level: 1,
    };
  }

  const romanHeading = line.match(/^([IVXLCDM]+)\.\s+(.+)$/);
  if (romanHeading) {
    const headingText = romanHeading[2].trim();
    // Evita falso positivo em linhas do corpo (ex.: "VII. Booke. Whatever I gette, ...").
    const looksLikeHeading =
      /^[A-Z]/.test(headingText) &&
      headingText.length <= 80 &&
      !/[,:;!?]/.test(headingText) &&
      !headingText.includes(".");
    if (looksLikeHeading) {
      return { title: line.trim(), level: 1 };
    }
  }

  const numericHeading = line.match(/^(\d+)\.\s*(.*)$/);
  if (numericHeading) {
    const suffix = numericHeading[2]?.trim();
    // Só aceita "1. Algo..." como seção; ignora linha solta "1."
    if (suffix.length > 0) {
      return { title: line.trim(), level: 2 };
    }
  }

  return null;
}

function renderInlineEmphasis(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const re = /_([^_]+)_/g;
  let last = 0;
  let m: RegExpExecArray | null = re.exec(text);
  let key = 0;

  while (m) {
    if (m.index > last) {
      nodes.push(text.slice(last, m.index));
    }
    nodes.push(
      <em key={`em-${key++}`} className="italic">
        {m[1]}
      </em>,
    );
    last = m.index + m[0].length;
    m = re.exec(text);
  }

  if (last < text.length) {
    nodes.push(text.slice(last));
  }

  return nodes;
}

function uppercaseRatio(text: string): number {
  const letters = text.match(/[A-Za-z]/g) ?? [];
  if (letters.length === 0) return 0;
  const upper = letters.filter((c) => c >= "A" && c <= "Z").length;
  return upper / letters.length;
}

function isRitualParagraph(text: string): boolean {
  const t = text.trim();
  // Fórmulas rituais geralmente são curtas, densas em maiúsculas e símbolos.
  const shortEnough = t.length <= 140;
  const veryUppercase = uppercaseRatio(t) >= 0.45;
  const hasFormulaTokens = /[']|--|[A-Z]{3,}/.test(t);
  const hasOccultTerms =
    /(YOG|SABAOTH|METRATON|ALMOUSIN|THRODOG|ZHRO|DEESMEES|ENITEMOSS|ADONAI|NGAH|AI'F|GEB'L)/i.test(
      t,
    );
  return shortEnough && hasOccultTerms && veryUppercase && hasFormulaTokens;
}

function isMonsterSoundParagraph(text: string): boolean {
  const t = text.trim();
  return /(Waaaah|R'waaah|YI-NGAH|Yah!|DEESMEES|ENITEMOSS|ululantly)/i.test(t);
}

function stripLeadingQuote(text: string): string {
  return text.trim().replace(/^["']+\s*/, "");
}

function isLetterStartParagraph(text: string): boolean {
  const t = stripLeadingQuote(text);
  if (/^Dear\s+.+:/i.test(t)) return true;
  if (/^Brother in .+:/i.test(t)) return true;
  if (/^To\s+Mr\./i.test(t)) return true;
  return /\d{1,2}\s+\w+.*,\s+.*,\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}\.?/i.test(
    t,
  );
}

function isLetterEndParagraph(text: string): boolean {
  const t = stripLeadingQuote(text);
  return (
    /^Sincerely\b/i.test(t) ||
    /^Yours\b/i.test(t) ||
    /^With profoundest sympathy\b/i.test(t) ||
    /^Sir, I am\b/i.test(t)
  );
}

function isNewsHeadlineParagraph(text: string): boolean {
  const t = text.trim().replace(/[."']/g, "");
  if (t.length === 0 || t.length > 90) return false;
  if (/[,:;!?]/.test(t)) return false;
  const words = t.split(/\s+/).filter(Boolean);
  if (words.length < 2 || words.length > 7) return false;
  return words.every((w) => /^[A-Z][a-z]+$/.test(w));
}

export function BookReader({
  title,
  authorName,
  publicationDate,
  publishedIn,
  fullText,
  bookSlug,
}: Props) {
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [currentPartIndex, setCurrentPartIndex] = useState(0);
  const [expandedChapterIndex, setExpandedChapterIndex] = useState<number | null>(null);

  useEffect(() => {
    setPrefs(loadPrefs());
  }, []);

  const persist = useCallback((next: Prefs) => {
    setPrefs(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, []);

  const t = THEMES[prefs.theme];
  const fontPx = FONT_SIZE_STEPS[prefs.sizeIndex] ?? 18;
  const paragraphGap = SPACING_PARAGRAPH_GAP_EM[prefs.spacing];
  const lines = useMemo(() => {
    const normalized = fullText.replace(/\r\n/g, "\n");
    // Remove notas editoriais/transcrição comuns do Gutenberg para não poluir a leitura.
    const withoutTranscriberNote = normalized.replace(
      /\[Transcriber's Note:[\s\S]*?\]/gi,
      "",
    );
    return withoutTranscriberNote.split("\n");
  }, [fullText]);

  const blocks = useMemo<ReaderBlock[]>(() => {
    const result: ReaderBlock[] = [];
    let paragraphLines: string[] = [];

    const flushParagraph = () => {
      if (paragraphLines.length === 0) return;
      const text = paragraphLines.join(" ").replace(/\s+/g, " ").trim();
      if (text.length > 0) result.push({ type: "paragraph", text });
      paragraphLines = [];
    };

    for (const rawLine of lines) {
      const line = rawLine.trim();
      const section = detectSection(line);

      if (section) {
        flushParagraph();
        result.push({ type: "heading", title: section.title, level: section.level });
        continue;
      }

      if (/^\*[\s*]{2,}$/.test(line)) {
        flushParagraph();
        result.push({ type: "divider" });
        continue;
      }

      if (line.length === 0) {
        flushParagraph();
        continue;
      }

      paragraphLines.push(line);
    }

    flushParagraph();
    return result;
  }, [lines]);

  const blocksWithLetters = useMemo<ReaderBlock[]>(() => {
    let inLetter = false;
    let newsParagraphsRemaining = 0;
    return blocks.map((block) => {
      if (block.type !== "paragraph") {
        if (block.type === "heading" || block.type === "divider") inLetter = false;
        newsParagraphsRemaining = 0;
        return block;
      }

      const text = block.text.trim();
      if (!inLetter && isLetterStartParagraph(text)) {
        inLetter = true;
      }

      const isNewsHeadline = isNewsHeadlineParagraph(text);
      if (isNewsHeadline) {
        // Marca manchete + próximo bloco de conteúdo (recorte jornalístico).
        newsParagraphsRemaining = 4;
      } else if (newsParagraphsRemaining > 0) {
        newsParagraphsRemaining -= 1;
      }

      const mapped: ReaderBlock = {
        ...block,
        isLetter: inLetter || undefined,
        isNews: (isNewsHeadline || newsParagraphsRemaining > 0) || undefined,
      };

      if (inLetter && isLetterEndParagraph(text)) {
        inLetter = false;
      }

      return mapped;
    });
  }, [blocks]);

  const sections = useMemo<ReaderSection[]>(
    () =>
      blocksWithLetters.flatMap((block, blockIndex) =>
        block.type === "heading"
          ? [{ blockIndex, title: block.title, level: block.level }]
          : [],
      ),
    [blocksWithLetters],
  );

  const chapters = useMemo(() => {
    const topSections = sections.filter((s) => s.level === 1);
    if (topSections.length === 0) {
      return [{ title: "Chapter", start: 0, end: blocksWithLetters.length }];
    }

    return topSections.map((section, index) => ({
      title: section.title,
      start: index === 0 ? 0 : section.blockIndex,
      end: index + 1 < topSections.length ? topSections[index + 1].blockIndex : blocksWithLetters.length,
    }));
  }, [blocksWithLetters.length, sections]);

  const getPartsForChapter = useCallback(
    (chapterIndex: number): ReaderPart[] => {
      const chapter = chapters[chapterIndex];
      if (!chapter) return [];

      if (bookSlug === CHARLES_DEXTER_WARD_SLUG) {
        const byAnchors = wardChapterPartsFromAnchors(
          chapterIndex,
          chapter.start,
          chapter.end,
          blocksWithLetters,
        );
        if (byAnchors) return byAnchors;
      }

      const local = blocksWithLetters.slice(chapter.start, chapter.end);
      const parts: ReaderPart[] = [];
      let partStart = chapter.start;
      let partNumber = 1;

      for (let i = 0; i < local.length; i++) {
        const absoluteIndex = chapter.start + i;
        if (local[i]?.type !== "divider") continue;

        if (absoluteIndex > partStart) {
          parts.push({
            title: `Part ${partNumber}`,
            start: partStart,
            end: absoluteIndex,
          });
          partNumber += 1;
        }
        partStart = absoluteIndex + 1;
      }

      if (partStart < chapter.end) {
        parts.push({
          title: `Part ${partNumber}`,
          start: partStart,
          end: chapter.end,
        });
      }

      return parts.length > 0
        ? parts
        : [{ title: "Part 1", start: chapter.start, end: chapter.end }];
    },
    [blocksWithLetters, bookSlug, chapters],
  );

  const chapterParts = useMemo<ReaderPart[]>(() => {
    return getPartsForChapter(currentChapterIndex);
  }, [currentChapterIndex, getPartsForChapter]);

  useEffect(() => {
    setCurrentChapterIndex((prev) => Math.max(0, Math.min(prev, chapters.length - 1)));
  }, [chapters.length]);

  useEffect(() => {
    setCurrentPartIndex(0);
  }, [currentChapterIndex]);

  useEffect(() => {
    setExpandedChapterIndex(currentChapterIndex);
  }, [currentChapterIndex]);

  useEffect(() => {
    setCurrentPartIndex((prev) => Math.max(0, Math.min(prev, chapterParts.length - 1)));
  }, [chapterParts.length]);

  /** Apenas o texto do conto usa a fonte de leitura. A interface usa font-sans (shadcn). */
  const articleStyle = useMemo(
    () =>
      ({
        backgroundColor: t.bg,
        color: t.fg,
        fontFamily: fontFamilyFor(prefs.font),
        fontSize: `${fontPx}px`,
        lineHeight: SPACING_LINE_HEIGHT[prefs.spacing],
      }) as CSSProperties,
    [prefs.font, prefs.spacing, t.bg, t.fg, fontPx],
  );

  const goToChapter = useCallback(
    (index: number) => {
      setCurrentChapterIndex(index);
      setCurrentPartIndex(0);
      setMenuOpen(false);
    },
    [setMenuOpen],
  );

  const goToPart = useCallback(
    (index: number) => {
      setCurrentPartIndex(index);
      setMenuOpen(false);
    },
    [setMenuOpen],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [currentChapterIndex, currentPartIndex]);

  const currentChapter = chapters[currentChapterIndex];
  const currentPart = chapterParts[currentPartIndex];
  const visibleBlocks = useMemo(() => {
    if (currentPart) return blocksWithLetters.slice(currentPart.start, currentPart.end);
    if (!currentChapter) return blocksWithLetters;
    return blocksWithLetters.slice(currentChapter.start, currentChapter.end);
  }, [blocksWithLetters, currentChapter, currentPart]);

  return (
    <>
      <div
        className="flex min-h-dvh flex-col font-sans"
        style={{ backgroundColor: t.bg, color: t.fg }}
      >
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="fixed right-4 top-4 z-30 size-11 shrink-0 rounded-lg border-2 border-solid shadow-sm backdrop-blur-md transition-[background-color,box-shadow,opacity] hover:bg-foreground/10"
          style={{
            backgroundColor: `color-mix(in srgb, ${t.bg} 85%, ${t.fg})`,
            color: t.fg,
            borderColor: `color-mix(in srgb, ${t.fg} 30%, transparent)`,
          }}
          aria-label="Abrir menu de leitura"
          aria-expanded={menuOpen}
          aria-controls="reader-drawer-panel"
          onClick={() => setMenuOpen(true)}
        >
          <Menu className="size-5" />
        </Button>

        <article
          className="mx-auto w-full max-w-2xl flex-1 px-5 pb-8 pt-20 sm:px-8 sm:pt-24"
          style={articleStyle}
        >
          <h1
            className="mb-1 text-center text-[1.35em] font-semibold leading-tight"
            style={{ fontFamily: fontFamilyFor(prefs.font) }}
          >
            {title}
          </h1>
          <p
            className="mb-10 text-center text-[0.95em] opacity-80"
            style={{ fontFamily: fontFamilyFor(prefs.font) }}
          >
            {authorName}
          </p>
          {(publishedIn || publicationDate) && (
            <p
              className="-mt-7 mb-8 text-center text-[0.88em] opacity-70"
              style={{ fontFamily: fontFamilyFor(prefs.font) }}
            >
              {publishedIn ?? publicationDate}
            </p>
          )}
          <div>
            {visibleBlocks.map((block, index) => {
              if (block.type === "heading") {
                if (block.level === 1) {
                  const h2Title =
                    bookSlug === CHARLES_DEXTER_WARD_SLUG
                      ? wardDisplayChapterTitle(block.title)
                      : block.title;
                  return (
                    <h2
                      key={`h2-${currentChapterIndex}-${index}`}
                      className="mb-2 mt-8 text-[1.05em] font-semibold tracking-wide"
                    >
                      {h2Title}
                    </h2>
                  );
                }

                return (
                  <h3
                    key={`h3-${currentChapterIndex}-${index}`}
                    className="mb-1 mt-6 text-[0.98em] font-semibold"
                  >
                    {block.title}
                  </h3>
                );
              }

              if (block.type === "divider") {
                return (
                  <p
                    key={`div-${currentChapterIndex}-${index}`}
                    className="text-center tracking-[0.35em] opacity-70"
                    style={{ marginTop: `${paragraphGap}em` }}
                  >
                    * * * * *
                  </p>
                );
              }

              return (
                <div key={`p-${currentChapterIndex}-${index}`} style={{ marginTop: `${paragraphGap}em` }}>
                  <p
                    className={cn(
                      "m-0",
                      (isRitualParagraph(block.text) || block.isLetter || block.isNews) &&
                        "rounded-md bg-foreground/5 px-5 py-4 font-mono text-[0.92em] tracking-wide",
                      isMonsterSoundParagraph(block.text) && "italic text-[0.98em] opacity-95",
                    )}
                  >
                    {renderInlineEmphasis(block.text)}
                  </p>
                  {bookSlug === CHARLES_DEXTER_WARD_SLUG &&
                    block.text.includes("The briefly scrawled message was this") && (
                      <div className="mt-5 flex justify-center">
                        <Image
                          src="/images/cdw3-note.png"
                          alt="Briefly scrawled message illustration"
                          width={980}
                          height={321}
                          className="h-auto w-full max-w-[980px] rounded-md"
                          priority={false}
                        />
                      </div>
                    )}
                </div>
              );
            })}
          </div>

          <div className="mt-10 flex items-center justify-between gap-3 border-t pt-6" style={{ borderColor: t.border }}>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (currentPartIndex > 0) {
                  setCurrentPartIndex((i) => Math.max(0, i - 1));
                  return;
                }
                if (currentChapterIndex > 0) {
                  const prevChapter = currentChapterIndex - 1;
                  setCurrentChapterIndex(prevChapter);
                  const prevParts = getPartsForChapter(prevChapter);
                  setCurrentPartIndex(Math.max(0, prevParts.length - 1));
                }
              }}
              disabled={currentChapterIndex === 0 && currentPartIndex === 0}
              className="h-11 rounded-lg border-current/30 bg-transparent px-4"
            >
              <ChevronLeft className="mr-2 size-4" />
              Previous part
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (currentPartIndex < chapterParts.length - 1) {
                  setCurrentPartIndex((i) => Math.min(chapterParts.length - 1, i + 1));
                  return;
                }
                if (currentChapterIndex < chapters.length - 1) {
                  setCurrentChapterIndex((i) => Math.min(chapters.length - 1, i + 1));
                  setCurrentPartIndex(0);
                }
              }}
              disabled={currentChapterIndex >= chapters.length - 1 && currentPartIndex >= chapterParts.length - 1}
              className="h-11 rounded-lg border-current/30 bg-transparent px-4"
            >
              Next part
              <ChevronRight className="ml-2 size-4" />
            </Button>
          </div>
        </article>
      </div>

      <Drawer direction="right" open={menuOpen} onOpenChange={setMenuOpen}>
        <DrawerContent
          id="reader-drawer-panel"
          className="data-[vaul-drawer-direction=right]:mt-0 data-[vaul-drawer-direction=right]:h-full data-[vaul-drawer-direction=right]:max-h-[100dvh] data-[vaul-drawer-direction=right]:rounded-none data-[vaul-drawer-direction=right]:border-l data-[vaul-drawer-direction=right]:w-[min(85vw,384px)] data-[vaul-drawer-direction=right]:sm:max-w-sm"
          style={{
            fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
            backgroundColor: t.bg,
            color: t.fg,
            borderColor: t.border,
          }}
        >
          <div className="flex h-full min-h-[100dvh] flex-col overflow-hidden sm:min-h-0">
            <header
              className="flex shrink-0 items-center justify-between gap-3 border-b border-solid px-4 py-3 font-sans"
              style={{
                backgroundColor: t.bg,
                borderColor: t.border,
                color: t.fg,
              }}
            >
              <Link
                href="/"
                className="text-sm font-semibold transition-opacity hover:opacity-80"
                style={{ color: t.fg }}
                onClick={() => setMenuOpen(false)}
              >
                Close Book
              </Link>
              <DrawerClose asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="shrink-0 hover:bg-foreground/10"
                  style={{ color: t.fg }}
                  aria-label="Fechar painel"
                >
                  <ChevronRight className="size-5" />
                </Button>
              </DrawerClose>
            </header>
            <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto p-4 pt-4">
              {chapters.length > 0 && (
                <section className="space-y-3">
                  <h3 className="text-xs font-medium uppercase tracking-wider opacity-70">
                    Sections
                  </h3>
                  <div className="space-y-1">
                    {chapters.map((chapter, index) => (
                      <div key={`chapter-${chapter.start}-${chapter.end}`} className="space-y-1">
                        <button
                          type="button"
                          onClick={() => {
                            const parts = getPartsForChapter(index);
                            if (parts.length <= 1) {
                              goToChapter(index);
                              return;
                            }
                            setExpandedChapterIndex((prev) => (prev === index ? null : index));
                          }}
                          className={cn(
                            "w-full rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-foreground/10",
                            currentChapterIndex === index
                              ? "bg-white/10 font-semibold"
                              : "opacity-90",
                          )}
                        >
                          {bookSlug === CHARLES_DEXTER_WARD_SLUG
                            ? wardDisplayChapterTitle(chapter.title)
                            : chapter.title}
                        </button>

                        {expandedChapterIndex === index && getPartsForChapter(index).length > 1 && (
                          <div className="ml-3 space-y-1">
                            {getPartsForChapter(index).map((part, partIndex) => (
                              <button
                                key={`part-${part.start}-${part.end}`}
                                type="button"
                                onClick={() => {
                                  if (currentChapterIndex !== index) {
                                    setCurrentChapterIndex(index);
                                  }
                                  goToPart(partIndex);
                                }}
                                className={cn(
                                  "w-full rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-foreground/10",
                                  currentChapterIndex === index && currentPartIndex === partIndex
                                    ? "bg-white/10 font-semibold"
                                    : "opacity-90",
                                )}
                              >
                                {part.title}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <div
                className="h-px min-h-px w-full shrink-0 bg-current/20"
                aria-hidden
              />

              <section className="space-y-3">
                <h3
                  className="text-xs font-medium uppercase tracking-wider"
                  style={{ color: t.fg, opacity: 0.72 }}
                >
                  Font
                </h3>
                <div className="flex gap-2 overflow-visible py-1">
                  {FONT_OPTIONS.map((opt) => {
                    const active = prefs.font === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => persist({ ...prefs, font: opt.id })}
                        className={cn(
                          "box-border flex flex-1 flex-col items-center justify-center gap-2 overflow-visible rounded-lg border-2 border-solid py-4 transition-[border-color,box-shadow,opacity,background-color] hover:!bg-current/10",
                          active ? "border-foreground/40" : "border-foreground/20",
                        )}
                        style={{
                          backgroundColor: active
                            ? `color-mix(in srgb, ${t.fg} 12%, ${t.bg})`
                            : `color-mix(in srgb, ${t.bg} 96%, ${t.fg})`,
                          boxShadow: active
                            ? `0 0 0 3px color-mix(in srgb, ${t.fg} 30%, transparent)`
                            : undefined,
                          color: t.fg,
                          opacity: active ? 1 : 0.9,
                        }}
                      >
                        <span
                          className="text-[1.35rem] leading-none"
                          style={{ fontFamily: opt.fontFamily, color: t.fg }}
                          aria-hidden
                        >
                          Aa
                        </span>
                        <span className="text-xs font-medium" style={{ color: t.fg }}>
                          {opt.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>

              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3
                    className="text-xs font-medium uppercase tracking-wider"
                    style={{ color: t.fg, opacity: 0.72 }}
                  >
                    Size
                  </h3>
                  <span className="text-sm tabular-nums" style={{ color: t.fg }}>
                    {fontPx}px
                  </span>
                </div>
                <div
                  className="flex w-full items-stretch gap-3"
                  style={
                    {
                      color: t.fg,
                      ["--reader-slider-track" as string]: `color-mix(in srgb, ${t.fg} 32%, transparent)`,
                      ["--reader-slider-range" as string]: t.fg,
                      ["--reader-slider-thumb-bg" as string]: t.bg,
                      ["--reader-slider-thumb-border" as string]: t.fg,
                    } as CSSProperties
                  }
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  <span
                    className="flex w-5 shrink-0 items-center justify-center text-base font-medium leading-none opacity-80"
                    aria-hidden
                  >
                    A
                  </span>
                  <div className="flex min-h-8 flex-1 items-center">
                    <Slider
                      min={0}
                      max={13}
                      step={1}
                      value={[prefs.sizeIndex]}
                      onValueChange={(values) => {
                        const arr = Array.isArray(values) ? [...values] : [values];
                        const v = arr[0];
                        persist({
                          ...prefs,
                          sizeIndex: typeof v === "number" ? v : 0,
                        });
                      }}
                      className="w-full [&_[data-slot=slider-track]]:!bg-[var(--reader-slider-track)] [&_[data-slot=slider-range]]:!bg-[var(--reader-slider-range)] [&_[data-slot=slider-thumb]]:!border-[var(--reader-slider-thumb-border)] [&_[data-slot=slider-thumb]]:!bg-[var(--reader-slider-thumb-bg)] [&_[data-slot=slider-thumb]]:!ring-[color-mix(in_srgb,var(--reader-slider-thumb-border)_45%,transparent)]"
                    />
                  </div>
                  <span
                    className="flex w-5 shrink-0 items-center justify-center text-base font-medium leading-none opacity-80"
                    aria-hidden
                  >
                    A
                  </span>
                </div>
              </section>

              <section className="space-y-3">
                <h3
                  className="text-xs font-medium uppercase tracking-wider"
                  style={{ color: t.fg, opacity: 0.72 }}
                >
                  Color
                </h3>
                <div className="flex flex-wrap gap-x-3 gap-y-2 overflow-visible py-1">
                  {(Object.keys(THEMES) as ReaderTheme[]).map((key) => {
                    const th = THEMES[key];
                    const active = prefs.theme === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => persist({ ...prefs, theme: key })}
                        className="flex min-w-[4.5rem] shrink-0 flex-col items-center gap-2 overflow-visible rounded-lg px-1.5 py-1.5 transition-colors hover:bg-current/10"
                        style={{ color: t.fg }}
                      >
                        {/* Um só círculo: antes havia dois com size-12 e o interior tapava a borda. */}
                        <span
                          className={cn(
                            "box-border flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-solid transition-[box-shadow,border-color]",
                            active ? "border-foreground/50" : "border-foreground/20",
                          )}
                          style={{
                            backgroundColor: th.bg,
                            boxShadow: active
                              ? `0 0 0 3px color-mix(in srgb, ${t.fg} 30%, transparent)`
                              : undefined,
                          }}
                          title={th.label}
                        >
                          {active && (
                            <Check
                              className="size-6 shrink-0"
                              style={{ color: th.fg }}
                              strokeWidth={2.5}
                            />
                          )}
                        </span>
                        <span className="text-xs font-medium" style={{ color: t.fg }}>
                          {th.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>

              <section className="space-y-3">
                <h3
                  className="text-xs font-medium uppercase tracking-wider"
                  style={{ color: t.fg, opacity: 0.72 }}
                >
                  Spacing
                </h3>
                <div className="flex gap-2 overflow-visible py-1">
                  {(
                    [
                      { id: "narrow" as const, label: "Narrow", lines: "tight" },
                      { id: "medium" as const, label: "Medium", lines: "normal" },
                      { id: "wide" as const, label: "Wide", lines: "wide" },
                    ] as const
                  ).map(({ id, label, lines }) => {
                    const active = prefs.spacing === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => persist({ ...prefs, spacing: id })}
                        className={cn(
                          "box-border flex flex-1 flex-col items-center gap-2 overflow-visible rounded-lg border-2 border-solid py-4 transition-[border-color,box-shadow,opacity,background-color] hover:!bg-current/10",
                          active ? "border-foreground/40" : "border-foreground/20",
                        )}
                        style={{
                          backgroundColor: active
                            ? `color-mix(in srgb, ${t.fg} 12%, ${t.bg})`
                            : `color-mix(in srgb, ${t.bg} 96%, ${t.fg})`,
                          boxShadow: active
                            ? `0 0 0 3px color-mix(in srgb, ${t.fg} 30%, transparent)`
                            : undefined,
                          color: t.fg,
                          opacity: active ? 1 : 0.9,
                        }}
                      >
                        <span
                          className={cn(
                            "flex min-h-0 w-full flex-1 flex-col items-center justify-center",
                            lines === "tight" && "gap-px",
                            lines === "normal" && "gap-0.5",
                            lines === "wide" && "gap-1.5",
                          )}
                          style={{ color: `color-mix(in srgb, ${t.fg} 55%, ${t.bg})` }}
                          aria-hidden
                        >
                          <span
                            className="h-0.5 w-6 rounded-[1px]"
                            style={{ backgroundColor: t.fg }}
                          />
                          <span
                            className="h-0.5 w-6 rounded-[1px]"
                            style={{ backgroundColor: t.fg }}
                          />
                          <span
                            className="h-0.5 w-6 rounded-[1px]"
                            style={{ backgroundColor: t.fg }}
                          />
                        </span>
                        <span
                          className="shrink-0 text-xs font-medium leading-none"
                          style={{ color: t.fg }}
                        >
                          {label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
