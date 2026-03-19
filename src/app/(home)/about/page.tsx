import type { Metadata } from "next";
import Link from "next/link";
import { getSiteUrl } from "@/lib/site-url";

const siteUrl = getSiteUrl();
const pagePath = "/about";
const canonicalUrl = `${siteUrl}${pagePath}`;

const pageTitle =
  "About Strangeflix — Lovecraft reader, public-domain horror & reading-focused UI";
const pageDescription =
  "Strangeflix is a free, distraction-free reader for H. P. Lovecraft and public-domain horror: adjustable typography, themes, and a growing catalog aligned with the H.P. Lovecraft Archive. Translations in Portuguese, Spanish, French, Italian, German, and Japanese planned.";

export const metadata: Metadata = {
  title: "About",
  description: pageDescription,
  keywords: [
    "Strangeflix",
    "H. P. Lovecraft reader",
    "public domain horror",
    "weird fiction online",
    "Lovecraft ebooks",
    "read Lovecraft free",
    "Cthulhu Mythos reader",
  ],
  alternates: { canonical: canonicalUrl },
  openGraph: {
    title: `${pageTitle} | Strangeflix`,
    description: pageDescription,
    url: canonicalUrl,
    siteName: "Strangeflix",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${pageTitle} | Strangeflix`,
    description: pageDescription,
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Strangeflix",
  description: pageDescription,
  url: siteUrl,
  publisher: {
    "@type": "Organization",
    name: "Strangeflix",
    url: siteUrl,
  },
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="mx-auto max-w-2xl flex-1 px-5 py-10 sm:px-8">
        <header className="mb-8">
          <h1 className="mb-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            About Strangeflix
          </h1>
          <p className="text-sm text-zinc-400">
            A calm home for public-domain horror and weird fiction — built for reading.
          </p>
        </header>

        <div className="space-y-8 text-sm leading-relaxed text-zinc-300 sm:text-[0.9375rem]">
          <section className="space-y-3" aria-labelledby="about-project">
            <h2 id="about-project" className="text-lg font-semibold text-zinc-100">
              What we&apos;re building
            </h2>
            <p>
              <strong className="text-zinc-100">Strangeflix</strong> is a web reader for classic{" "}
              <strong className="text-zinc-100">horror</strong> and{" "}
              <strong className="text-zinc-100">weird fiction</strong> that is legally in the{" "}
              <strong className="text-zinc-100">public domain</strong> (or otherwise free to share) in
              the territories we target. There are no paywalls and no ad clutter — only the text,
              presented with care.
            </p>
            <p>
              Our first focus is the legacy of{" "}
              <Link
                href="/lovecraft"
                className="font-medium text-zinc-100 underline-offset-2 hover:underline"
              >
                H. P. Lovecraft
              </Link>
              : making his stories easy to discover and pleasant to read in the browser, with covers
              and metadata that respect the material.
            </p>
          </section>

          <section className="space-y-3" aria-labelledby="about-reading">
            <h2 id="about-reading" className="text-lg font-semibold text-zinc-100">
              Built for long reading sessions
            </h2>
            <p>
              The in-book experience is designed around <strong className="text-zinc-100">comfort</strong>
              : you can switch <strong className="text-zinc-100">fonts</strong>,{" "}
              <strong className="text-zinc-100">text size</strong>,{" "}
              <strong className="text-zinc-100">line spacing</strong>, and{" "}
              <strong className="text-zinc-100">color themes</strong> (including dark-friendly palettes)
              so the page stays readable on phones, tablets, and desktops.
            </p>
            <p>
              Navigation is organized by <strong className="text-zinc-100">sections and parts</strong>{" "}
              where it helps — for longer works you can move through the structure without losing your
              place. Preferences you set are kept locally in your browser; see our{" "}
              <Link href="/privacy" className="font-medium text-zinc-100 underline-offset-2 hover:underline">
                privacy policy
              </Link>{" "}
              for details.
            </p>
          </section>

          <section className="space-y-3" aria-labelledby="about-catalog">
            <h2 id="about-catalog" className="text-lg font-semibold text-zinc-100">
              Growing toward a full Lovecraft shelf
            </h2>
            <p>
              We add <strong className="text-zinc-100">new books over time</strong>. Our long-term aim
              is to offer a <strong className="text-zinc-100">comprehensive in-app library </strong> of
              Lovecraft&apos;s fiction and related public-domain material, aligned with the scope of
              texts that enthusiasts curate on authoritative resources such as the{" "}
              <a
                href="https://www.hplovecraft.com/"
                className="font-medium text-zinc-100 underline-offset-2 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                H.P. Lovecraft Archive
              </a>{" "}
              — fiction, essays, and letters where rights allow — always with clear attribution and
              respect for the originals.
            </p>
            <p className="text-zinc-500">
              Strangeflix does not claim copyright on Lovecraft&apos;s texts; we format and display
              them. Always verify the legal status of a work in your country before relying on it for
              anything beyond personal reading.
            </p>
          </section>

          <section className="space-y-3" aria-labelledby="about-languages">
            <h2 id="about-languages" className="text-lg font-semibold text-zinc-100">
              Languages on the roadmap
            </h2>
            <p>
              Today the library is primarily in <strong className="text-zinc-100">English</strong>. We
              plan to add <strong className="text-zinc-100">translations</strong> over time so more
              readers can enjoy the same stories in their language — starting with high-quality
              editions where we can secure or use appropriate rights.
            </p>
            <p>
              Target languages include:{" "}
              <strong className="text-zinc-100">
                Portuguese, Spanish, French, Italian, German, and Japanese
              </strong>
              . Timelines will depend on sourcing texts, licensing, and editorial review; we&apos;ll
              announce additions on the site as they ship.
            </p>
          </section>

          <section className="space-y-3" aria-labelledby="about-more">
            <h2 id="about-more" className="text-lg font-semibold text-zinc-100">
              Explore
            </h2>
            <ul className="list-inside list-disc space-y-2 text-zinc-400">
              <li>
                <Link href="/" className="text-zinc-200 underline-offset-2 hover:underline">
                  Browse the catalog
                </Link>
              </li>
              <li>
                <Link href="/lovecraft" className="text-zinc-200 underline-offset-2 hover:underline">
                  H. P. Lovecraft — biography
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-zinc-200 underline-offset-2 hover:underline">
                  Privacy policy
                </Link>
              </li>
            </ul>
          </section>
        </div>
      </article>
    </>
  );
}
