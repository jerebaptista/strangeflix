/** Teasers de enredo (≤300 caracteres) para o overlay da home — fallback quando o slug não está listado. */
export const BOOK_PLOT_TEASERS: Record<string, string> = {
  "the-call-of-cthulhu":
    "Fragments of evidence—a sculptor’s fever dream, a cult in the bayous, a doomed ship’s log—converge on one truth: an ancient god sleeps beneath the sea, and the world is beginning to dream of his return.",
  "the-dunwich-horror":
    "In isolated Dunwich, the Whateley line guards a monstrous birth and a gate to something beyond human geometry. When the horror on Sentinel Hill breaks loose, few who hear the bellowing on the wind will sleep soundly again.",
  "at-the-mountains-of-madness":
    "An Antarctic expedition uncovers the ruins of a city older than mankind—stone corridors, murals of war with nameless foes, and tunnels that lead toward a truth Miskatonic University was never meant to publish.",
  "the-case-of-charles-dexter-ward":
    "Young Ward’s obsession with his ancestor Joseph Curwen leads him into alchemy, grave-robbing, and voices from beyond the grave—until Providence itself seems to house two men in one skin.",
  "the-shadow-over-innsmouth":
    "A stranded traveller finds Innsmouth’s people odd, their church stranger still, and the reef at Devil Reef hiding a bargain his bloodline may already have signed without his knowing.",
  "the-whisperer-in-darkness":
    "Vermont hermit Henry Akeley’s letters speak of fungoid visitors from Yuggoth and jars that hold more than brains—until the narrator must ask whether the voice on the telephone is still human.",
  "the-shadow-out-of-time":
    "Nathaniel Peaslee’s lost years were not sleep but exchange—his mind traded with the Great Race across aeons, leaving him with memories of archives buried under Australian sand.",
  "the-colour-out-of-space":
    "A meteorite poisons the Gardner farm with a hue no spectrum names; crops rot, animals twist, and the well glows with something that drinks life itself, leaving only grey dust behind.",
  "pickmans-model":
    "Boston artist Richard Pickman paints nightmares too precise to be invention. His studio holds canvases—and a subterranean truth about who models for the teeth in the dark.",
  "herbert-west-reanimator":
    "Medical student Herbert West’s reagent can restart flesh, but not soul; each new corpse teaches him that death was kinder than what clambers back to the table.",
  "the-rats-in-the-walls":
    "Restoring Exham Priory, Delapore hears scratching below the foundations—older than the house, older than England—and follows his bloodline down stairs that should never have been opened.",
  "the-music-of-erich-zann":
    "In a crooked street in Paris, a mute violist plays mad counterpoint to something pressing at the garret window—music meant to hold back what the cosmos would let in.",
  "the-thing-on-the-doorstep":
    "Edward Derby’s marriage to Asenath Waite hides a body-swapping horror; when a thing in Edward’s shape knocks at the door, Daniel Upton must decide who is still inside the skin.",
  "the-dreams-in-the-witch-house":
    "Graduate student Walter Gilman boards at the Witch House, where angles are wrong and dreams walk the same halls as Keziah Mason and her rat familiar—until waking and sleeping blur.",
  dagon:
    "Adrift after a Great War trauma, a castaway reaches a mud-choked shore and a monolith carved with glyphs older than man—then the tide brings up something vast against the moon.",
};

const FALLBACK =
  "A tale of cosmic dread and fragile sanity—open the reader to follow where the narrator’s evidence leads.";

export function getPlotTeaser(slug: string, descriptionFallback: string | null): string {
  const teaser = BOOK_PLOT_TEASERS[slug];
  if (teaser) return teaser.length > 300 ? `${teaser.slice(0, 297)}…` : teaser;
  if (descriptionFallback?.trim()) {
    const t = descriptionFallback.trim();
    return t.length > 300 ? `${t.slice(0, 297).trim()}…` : t;
  }
  return FALLBACK;
}
