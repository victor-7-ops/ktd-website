import { discography } from "@/lib/data/discography";
import { members } from "@/lib/data/members";
import { SITE_URL, SITE_NAME } from "@/lib/site";

// TODO: add MusicEvent entries when lib/data/shows.ts has a dated upcoming show (startDate required by schema.org)

export function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    name: SITE_NAME,
    alternateName: "KTD",
    url: SITE_URL,
    genre: ["Indie Pop-Rock", "OPM", "City Pop", "Funk"],
    foundingDate: "2022-11",
    foundingLocation: { "@type": "Place", name: "Cebu City, Philippines" },
    recordLabel: "Unstable Records",
    member: members.map((m) => ({ "@type": "Person", name: m.name })),
    track: discography.map((d) => ({
      "@type": "MusicRecording",
      name: d.title,
      datePublished: d.year,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
