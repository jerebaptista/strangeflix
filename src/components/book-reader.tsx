"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, Menu, X } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "strangeflix-reader-prefs";

/** 14 opções: 14, 16, …, 40 px */
const FONT_SIZE_STEPS = Array.from({ length: 14 }, (_, i) => 14 + i * 2);

export type ReaderFont = "georgia" | "verdana";
export type ReaderTheme = "light" | "dark" | "beige" | "green";
export type ReaderSpacing = "narrow" | "medium" | "wide";

type Prefs = {
  font: ReaderFont;
  sizeIndex: number;
  theme: ReaderTheme;
  spacing: ReaderSpacing;
};

const DEFAULT_PREFS: Prefs = {
  font: "georgia",
  sizeIndex: 3,
  theme: "light",
  spacing: "medium",
};

const SPACING_LINE_HEIGHT: Record<ReaderSpacing, number> = {
  narrow: 1.4,
  medium: 1.65,
  wide: 1.9,
};

/** Apenas fontes do sistema — sem Google Fonts. */
const FONT_OPTIONS: { id: ReaderFont; label: string; fontFamily: string }[] = [
  { id: "georgia", label: "Georgia", fontFamily: 'Georgia, "Times New Roman", serif' },
  { id: "verdana", label: "Verdana", fontFamily: "Verdana, Geneva, sans-serif" },
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
    label: "Claro",
  },
  dark: {
    bg: "#18181b",
    fg: "#e4e4e7",
    header: "#0f0f0f",
    headerFg: "#fafafa",
    border: "#27272a",
    label: "Escuro",
  },
  beige: {
    bg: "#e5dcc5",
    fg: "#3d2914",
    header: "#b8a990",
    headerFg: "#2d1f0f",
    border: "#a89880",
    label: "Bege",
  },
  green: {
    bg: "#d4edda",
    fg: "#1e3a2f",
    header: "#8fbf9a",
    headerFg: "#143028",
    border: "#7aad85",
    label: "Verde",
  },
};

function loadPrefs(): Prefs {
  if (typeof window === "undefined") return DEFAULT_PREFS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PREFS;
    const p = JSON.parse(raw) as Partial<Prefs>;
    const font =
      p.font === "georgia" || p.font === "verdana" ? p.font : DEFAULT_PREFS.font;
    const spacing =
      p.spacing === "narrow" || p.spacing === "wide" ? p.spacing : DEFAULT_PREFS.spacing;
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
  fullText: string;
};

export function BookReader({ title, authorName, fullText }: Props) {
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS);
  const [menuOpen, setMenuOpen] = useState(false);

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

  return (
    <>
      <div
        className="flex min-h-dvh flex-col font-sans"
        style={{ backgroundColor: t.bg, color: t.fg }}
      >
        <header
          className="fixed left-0 right-0 top-0 z-30 flex h-12 shrink-0 items-center justify-between border-b px-4 font-sans backdrop-blur-md"
          style={{
            backgroundColor: `${t.header}e6`,
            color: t.headerFg,
            borderColor: t.border,
          }}
        >
          <Link
            href="/"
            className="font-semibold tracking-tight opacity-90 hover:opacity-100"
            style={{ color: "inherit" }}
          >
            Strangeflix
          </Link>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0 opacity-80 hover:opacity-100 hover:bg-black/10"
            style={{ color: "inherit" }}
            aria-label="Ajustes de leitura"
            onClick={() => setMenuOpen(true)}
          >
            <Menu className="size-5" />
          </Button>
        </header>

        <article
          className="mx-auto w-full max-w-2xl flex-1 px-5 pb-8 pt-12 sm:px-8"
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
          <div className="whitespace-pre-wrap">{fullText}</div>
        </article>
      </div>

      <Drawer direction="right" open={menuOpen} onOpenChange={setMenuOpen}>
        <DrawerContent
          className="data-[vaul-drawer-direction=right]:mt-0 data-[vaul-drawer-direction=right]:h-full data-[vaul-drawer-direction=right]:max-h-[100dvh] data-[vaul-drawer-direction=right]:rounded-l-xl data-[vaul-drawer-direction=right]:border-l data-[vaul-drawer-direction=right]:w-[min(85vw,384px)] data-[vaul-drawer-direction=right]:sm:max-w-sm"
          style={{
            backgroundColor: t.header,
            color: t.headerFg,
            borderColor: t.border,
            fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
          }}
        >
          <div className="flex h-full min-h-[100dvh] flex-col overflow-y-auto sm:min-h-0">
            <DrawerHeader
              className="shrink-0 border-b px-4 py-3 text-left"
              style={{ borderColor: t.border }}
            >
              <div className="flex w-full items-center justify-end">
                <DrawerClose asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="opacity-80 hover:opacity-100 hover:bg-black/10"
                    style={{ color: "inherit" }}
                    aria-label="Fechar"
                  >
                    <X className="size-5" />
                  </Button>
                </DrawerClose>
              </div>
            </DrawerHeader>

            <div className="flex flex-1 flex-col gap-6 p-4">
              <section className="space-y-2">
                <h3 className="text-xs font-medium uppercase tracking-wider opacity-70">
                  Font
                </h3>
                <Select
                  value={prefs.font}
                  onValueChange={(value) =>
                    persist({ ...prefs, font: value as ReaderFont })
                  }
                >
                  <SelectTrigger
                    className="w-full border border-current/30 bg-black/20 focus:ring-emerald-500/30"
                    style={{ color: "inherit" }}
                  >
                    <SelectValue placeholder="Fonte" />
                  </SelectTrigger>
                  <SelectContent
                    positionerClassName="z-[100]"
                    className="border border-current/20 bg-black/95 text-white"
                    side="left"
                    align="start"
                  >
                    {FONT_OPTIONS.map((opt) => (
                      <SelectItem
                        key={opt.id}
                        value={opt.id}
                        className="focus:bg-zinc-900 focus:text-white"
                      >
                        <span className="font-sans">{opt.label}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </section>

              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-medium uppercase tracking-wider opacity-70">
                    Size
                  </h3>
                  <span className="text-sm tabular-nums text-emerald-500">
                    {fontPx}px
                  </span>
                </div>
                <div
                  className="flex w-full items-center gap-3"
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  <span className="text-sm opacity-60" aria-hidden>A</span>
                  <div className="min-h-6 w-full flex-1">
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
                      className="w-full [&_[data-slot=slider-track]]:bg-zinc-700 [&_[data-slot=slider-range]]:bg-emerald-500"
                    />
                  </div>
                  <span className="text-lg font-medium opacity-60" aria-hidden>A</span>
                </div>
              </section>

              <section className="space-y-3">
                <h3 className="text-xs font-medium uppercase tracking-wider opacity-70">
                  Color
                </h3>
                <div className="flex flex-wrap gap-4">
                  {(Object.keys(THEMES) as ReaderTheme[]).map((key) => {
                    const th = THEMES[key];
                    const active = prefs.theme === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => persist({ ...prefs, theme: key })}
                        className="flex min-w-[4.5rem] shrink-0 flex-col items-center gap-2"
                      >
                        <span
                          className={cn(
                            "flex size-12 items-center justify-center rounded-full border-2 transition-colors",
                            active ? "border-emerald-500 ring-2 ring-emerald-500/40" : "border-current/40",
                          )}
                          style={{ backgroundColor: th.bg }}
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
                        <span className="text-xs opacity-70">{th.label}</span>
                      </button>
                    );
                  })}
                </div>
              </section>

              <section className="space-y-3">
                <h3 className="text-xs font-medium uppercase tracking-wider opacity-70">
                  Spacing
                </h3>
                <div className="flex gap-2">
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
                          "flex flex-1 flex-col items-center justify-center gap-2 rounded-lg border-2 py-4 transition-colors",
                          active
                            ? "border-emerald-500 bg-emerald-500/10 text-emerald-500"
                            : "border-current/30 bg-black/10 opacity-80 hover:border-current/50 hover:opacity-100",
                        )}
                      >
                        <span
                          className={cn(
                            "flex flex-col text-zinc-500",
                            lines === "tight" && "gap-px",
                            lines === "normal" && "gap-0.5",
                            lines === "wide" && "gap-1.5",
                          )}
                          aria-hidden
                        >
                          <span className="h-0.5 w-6 bg-current" />
                          <span className="h-0.5 w-6 bg-current" />
                          <span className="h-0.5 w-6 bg-current" />
                        </span>
                        <span className="text-xs font-medium">{label}</span>
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
