import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "Strangeflix does not store personal data on our servers. How we handle privacy, local storage, and public-domain texts.",
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl flex-1 px-5 py-10 sm:px-8">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight text-white">
        Privacy policy
      </h1>
      <div className="space-y-6 text-sm leading-relaxed text-zinc-300">
        <p className="text-zinc-500">Last updated: March 2026</p>

        <section className="space-y-2">
          <h2 className="text-base font-medium text-zinc-100">
            We don&apos;t save your data
          </h2>
          <p>
            Strangeflix <strong className="text-zinc-100">does not collect or store personal data</strong>{" "}
            on our servers. There are no user accounts, profiles, reading history tied to you, or
            databases holding your identity or preferences on our side.
          </p>
          <p>
            What you do on the site (for example, which book you open or how you adjust the reader) is{" "}
            <strong className="text-zinc-100">not recorded by us</strong> as identifiable information.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-medium text-zinc-100">Only on your device</h2>
          <p>
            Some reader choices (font, theme, text size, spacing) may be saved{" "}
            <strong className="text-zinc-100">only in your browser&apos;s local storage</strong> so
            settings persist between visits. That data stays on your device, is{" "}
            <strong className="text-zinc-100">not sent</strong> to Strangeflix, and is not used to
            identify you.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-medium text-zinc-100">Analytics and technical logs</h2>
          <p>
            Our hosting provider (for example, Vercel) may produce{" "}
            <strong className="text-zinc-100">standard technical logs</strong> (page requests, errors,
            performance), usually in aggregate or without a direct link to an identifiable person. We do
            not sell data or use it for behavioral advertising.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-medium text-zinc-100">
            Public-domain texts and H. P. Lovecraft
          </h2>
          <p>
            The texts we offer are works in the{" "}
            <strong className="text-zinc-100">public domain</strong> or otherwise free to use under
            applicable copyright law. In particular,{" "}
            <strong className="text-zinc-100">H. P. Lovecraft&apos;s </strong> work is widely in the public
            domain in the United States and in other jurisdictions where the term of protection has
            expired (for example, Portugal and Brazil, where works typically enter the public domain a
            set number of decades after the author&apos;s death, under current law).
          </p>
          <p className="text-zinc-500">
            Strangeflix does not claim copyright in the original texts; we only provide a way to read
            them. Always confirm the legal status of a work in your region.
          </p>
        </section>

      </div>
    </main>
  );
}
