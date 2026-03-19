import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getSiteUrl } from "@/lib/site-url";

const siteUrl = getSiteUrl();
const pagePath = "/lovecraft";
const canonicalUrl = `${siteUrl}${pagePath}`;
const ogImageUrl = `${siteUrl}/images/hp-lovecraft-portrait.png`;

const pageTitle = "H. P. Lovecraft — biography, Cthulhu Mythos & public-domain horror";
const pageDescription =
  "Howard Phillips Lovecraft (1890–1937): life in Providence, weird fiction, Edgar Allan Poe and Lord Dunsany, pulp magazines, the Cthulhu Mythos, and legacy. Read public-domain Lovecraft on Strangeflix.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords: [
    "H. P. Lovecraft",
    "Howard Phillips Lovecraft",
    "Lovecraft biography",
    "Cthulhu Mythos",
    "weird fiction",
    "cosmic horror",
    "Providence Rhode Island",
    "Weird Tales",
    "public domain Lovecraft",
    "Lovecraftian horror",
  ],
  alternates: { canonical: canonicalUrl },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: canonicalUrl,
    siteName: "Strangeflix",
    locale: "en_US",
    type: "article",
    images: [
      {
        url: ogImageUrl,
        width: 600,
        height: 750,
        alt: "Black-and-white portrait of author H. P. Lovecraft in a suit",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
    images: [ogImageUrl],
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Howard Phillips Lovecraft",
  alternateName: "H. P. Lovecraft",
  birthDate: "1890-08-20",
  deathDate: "1937-03-15",
  birthPlace: {
    "@type": "Place",
    name: "Providence, Rhode Island, United States",
  },
  deathPlace: {
    "@type": "Place",
    name: "Providence, Rhode Island, United States",
  },
  jobTitle: "Writer",
  description: pageDescription,
  url: canonicalUrl,
  sameAs: ["https://en.wikipedia.org/wiki/H._P._Lovecraft"],
  knowsAbout: [
    "Weird fiction",
    "Horror fiction",
    "Cosmicism",
    "Cthulhu Mythos",
  ],
};

export default function LovecraftPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="mx-auto max-w-2xl flex-1 px-5 py-10 sm:px-8">
        <header className="mb-8 text-center">
          <h1 className="mb-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            H. P. Lovecraft
          </h1>
          <p className="mx-auto max-w-lg text-sm text-zinc-400">
            Howard Phillips Lovecraft · August 20, 1890 – March 15, 1937 · American writer of weird
            and cosmic horror
          </p>
        </header>

        <figure className="mb-10 overflow-hidden">
          <Image
            src="/images/hp-lovecraft-portrait.png"
            alt="Black-and-white portrait of author H. P. Lovecraft wearing a suit and tie"
            width={600}
            height={750}
            className="mx-auto h-auto w-full max-w-md object-cover object-top rounded-md"
            sizes="(max-width: 640px) 100vw, 28rem"
            priority
          />
          <figcaption className="px-4 py-6 text-center text-xs text-zinc-500">
            H. P. Lovecraft, 1934 — often used as a reference portrait of the author
          </figcaption>
        </figure>

        <div className="space-y-8 text-sm leading-relaxed text-zinc-300 sm:text-[0.9375rem]">
          <section className="space-y-3" aria-labelledby="lovecraft-intro">
            <h2 id="lovecraft-intro" className="text-lg font-semibold text-zinc-100">
              Who he was
            </h2>
            <p>
              <strong className="text-zinc-100">Howard Phillips Lovecraft</strong> was an American
              author of <strong className="text-zinc-100">weird fiction</strong>, horror, and early
              science fiction. He is remembered for a body of stories that stress{" "}
              <strong className="text-zinc-100">cosmicism</strong> — the idea that humanity is a small,
              fragile part of an indifferent universe — and for the shared motifs and entities later
              grouped under the name <strong className="text-zinc-100">Cthulhu Mythos</strong>.
            </p>
            <p>
              He was little known as a commercial author in his lifetime and lived modestly in New
              England. After his death, readers, editors, and scholars revived his work; today he is
              widely cited as a central figure in twentieth-century supernatural horror.
            </p>
          </section>

          <section className="space-y-3" aria-labelledby="lovecraft-birth">
            <h2 id="lovecraft-birth" className="text-lg font-semibold text-zinc-100">
              Birth, childhood, and early influences
            </h2>
            <p>
              Lovecraft was born on <strong className="text-zinc-100">August 20, 1890</strong>, in{" "}
              <strong className="text-zinc-100">Providence, Rhode Island</strong>, where he would
              spend most of his life. His father was institutionalized when Lovecraft was very young
              and died years later; he was raised largely by his mother and the extended Phillips
              family. His grandfather encouraged reading and storytelling, including Gothic-flavored
              tales that left a deep mark on his imagination.
            </p>
            <p>
              As a child he read widely — classical myth, the Arabian Nights, Poe, and illustrated
              editions such as Doré&apos;s <em>The Rime of the Ancient Mariner</em>. Around 1902 he
              became passionate about <strong className="text-zinc-100">astronomy</strong>, which
              shaped his sense of vast space and human smallness. Ill health and family losses
              shadowed his youth; nightmares and a precocious inner life later surface in his
              fiction.
            </p>
          </section>

          <section className="space-y-3" aria-labelledby="lovecraft-why-write">
            <h2 id="lovecraft-why-write" className="text-lg font-semibold text-zinc-100">
              Why and how he began to write
            </h2>
            <p>
              Lovecraft wrote poetry and juvenilia from an early age. In his teens the family&apos;s
              finances worsened after his grandfather&apos;s death; stress and nervous illness
              disrupted his schooling. He did not graduate high school or attend university, but he
              never stopped reading or composing.
            </p>
            <p>
              He found community in{" "}
              <strong className="text-zinc-100">amateur journalism</strong> — especially the United
              Amateur Press Association — where he debated literature, politics, and language, and
              published essays and verse. That network gave him discipline, correspondents, and an
              audience when commercial success was still out of reach. Fiction gradually took center
              stage: early tales such as &quot;The Alchemist&quot; and &quot;The Beast in the Cave&quot;
              led to more confident work.
            </p>
          </section>

          <section className="space-y-3" aria-labelledby="lovecraft-influences">
            <h2 id="lovecraft-influences" className="text-lg font-semibold text-zinc-100">
              Literary influences
            </h2>
            <p>
              Lovecraft called <strong className="text-zinc-100">Edgar Allan Poe</strong> a towering
              influence; Poe&apos;s unity of mood and cosmic unease echo throughout his early prose.
              In 1919 he discovered <strong className="text-zinc-100">Lord Dunsany</strong>; the ornate,
              dreamlike style of Dunsany&apos;s fantasies shaped stories such as &quot;The White
              Ship&quot; and &quot;The Cats of Ulthar&quot; and helped crystallize Lovecraft&apos;s{" "}
              <em>Dream Cycle</em> phase.
            </p>
            <p>
              He also drew on <strong className="text-zinc-100">Arthur Machen</strong>,{" "}
              <strong className="text-zinc-100">Algernon Blackwood</strong>, and the broader tradition
              of Gothic and decadent literature. Science — astronomy, geology, biology — supplied
              metaphors for the alien and the incomprehensible. New England history and geography
              became &quot;Lovecraft Country&quot;: renamed towns and colleges that feel uncannily
              real.
            </p>
          </section>

          <section className="space-y-3" aria-labelledby="lovecraft-publishing">
            <h2 id="lovecraft-publishing" className="text-lg font-semibold text-zinc-100">
              Publishing: pulps, letters, and the Mythos
            </h2>
            <p>
              A sharp letter to the magazine <em>Argosy</em> in <strong className="text-zinc-100">1913</strong>{" "}
              drew attention to his critical voice and helped pull him further into speculative-fiction
              circles. Through amateur journals he circulated stories and met peers; professionally,
              <strong className="text-zinc-100">Weird Tales</strong> became his most important market,
              though editors sometimes rejected or trimmed his work.
            </p>
            <p>
              In the early 1920s he began the interconnected tales of cosmic entities, forbidden
              books, and collapsing perspective that readers later labeled the{" "}
              <strong className="text-zinc-100">Cthulhu Mythos</strong> (Lovecraft himself joked about
              &quot;Yog-Sothothery&quot;). Stories such as &quot;The Nameless City,&quot; &quot;The
              Call of Cthulhu,&quot; and &quot;The Colour Out of Space&quot; refined his voice: learned
              narrators, cumulative dread, and hints of vast, indifferent powers.
            </p>
          </section>

          <section className="space-y-3" aria-labelledby="lovecraft-ny">
            <h2 id="lovecraft-ny" className="text-lg font-semibold text-zinc-100">
              Marriage, New York, and return to Providence
            </h2>
            <p>
              In <strong className="text-zinc-100">1924</strong> he married{" "}
              <strong className="text-zinc-100">Sonia Greene</strong> and moved to New York City. He
              admired the metropolis at first, but loneliness, money troubles, and culture shock wore
              him down; stories like &quot;He&quot; channel that exhaustion. In{" "}
              <strong className="text-zinc-100">1926</strong> he returned to Providence for good — the
              city he called home and often &quot;I AM PROVIDENCE&quot; in his letters.
            </p>
            <p>
              The late 1920s and 1930s produced some of his most famous fiction, including{" "}
              <em>The Case of Charles Dexter Ward</em>, <em>At the Mountains of Madness</em>,{" "}
              <em>The Shadow over Innsmouth</em>, and <em>The Shadow Out of Time</em>. He supported
              himself poorly from fiction; revision, ghostwriting, and correspondence filled much of
              his time. The &quot;Lovecraft Circle&quot; — friends such as{" "}
              <strong className="text-zinc-100">Robert E. Howard</strong> and{" "}
              <strong className="text-zinc-100">Clark Ashton Smith</strong> — traded ideas and
              cross-pollinated settings through voluminous letters.
            </p>
          </section>

          <section className="space-y-3" aria-labelledby="lovecraft-death">
            <h2 id="lovecraft-death" className="text-lg font-semibold text-zinc-100">
              Final years and death
            </h2>
            <p>
              Lovecraft&apos;s health declined in the mid-1930s. He avoided doctors for a long time;
              when examined, he was found to have terminal cancer. He died on{" "}
              <strong className="text-zinc-100">March 15, 1937</strong>, in Providence, aged 46, and
              was buried in Swan Point Cemetery. A modest headstone erected later by fans quotes his
              line <strong className="text-zinc-100">&quot;I AM PROVIDENCE.&quot;</strong>
            </p>
          </section>

          <section className="space-y-3" aria-labelledby="lovecraft-legacy">
            <h2 id="lovecraft-legacy" className="text-lg font-semibold text-zinc-100">
              Legacy
            </h2>
            <p>
              August Derleth and others kept Lovecraft in print through Arkham House; academic and
              popular interest grew from the 1970s onward. Writers from Stephen King to countless
              game designers and filmmakers have acknowledged his influence. Scholars debate his
              philosophy, politics, and prejudices; readers continue to grapple with the power of his
              atmosphere and the limits of his worldview.
            </p>
            <p>
              On <Link href="/" className="font-medium text-zinc-100 underline-offset-2 hover:underline">Strangeflix</Link>{" "}
              you can read <strong className="text-zinc-100">public-domain</strong> Lovecraft texts in
              a calm, adjustable reader — the same stories that helped define modern weird horror.
            </p>
          </section>

          <section
            className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-4 text-xs text-zinc-500"
            aria-labelledby="lovecraft-sources"
          >
            <h2 id="lovecraft-sources" className="mb-2 text-sm font-medium text-zinc-400">
              Further reading
            </h2>
            <p>
              This page is a concise overview for readers. For dates, bibliography, and scholarly
              detail, see the{" "}
              <a
                href="https://en.wikipedia.org/wiki/H._P._Lovecraft"
                className="text-zinc-300 underline-offset-2 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                H. P. Lovecraft article on Wikipedia
              </a>{" "}
              and references linked there.
            </p>
          </section>
        </div>
      </article>
    </>
  );
}
