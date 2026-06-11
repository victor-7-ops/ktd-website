export interface Release {
  title: string;
  credit: string | null;
  year: string;
  duration?: string;
  label: string;
  chapter: string;
  desc: string;
  spotify: string | null;
  apple: string | null;
  youtube: string | null;
  accent: string;
  highlight: boolean;
}

export const discography: Release[] = [
  {
    title: "Huli Na Ba",
    credit: "DaivJstn feat. KTD",
    year: "2023",
    label: "Viva Records",
    chapter: "Collab",
    desc: "A heartfelt question to a love that may have already moved on.",
    spotify: null,
    apple: null,
    youtube: null,
    accent: "#16213e",
    highlight: false,
  },
  {
    title: "Liwasan",
    credit: null,
    year: "2024",
    label: "Viva Records",
    chapter: "Chapter I — The Spark",
    desc: "Where it begins. Friendship blooming into something more.",
    spotify: null,
    apple: null,
    youtube: null,
    accent: "#0d1f1a",
    highlight: false,
  },
  {
    title: "Maglaho",
    credit: null,
    year: "Jun 2025",
    duration: "4:52",
    label: "Viva Records",
    chapter: "Chapter II — The Unraveling",
    desc: "The moment everything starts to fade. The GoJam song.",
    spotify: null,
    apple: null,
    youtube: null,
    accent: "#2a1a0a",
    highlight: false,
  },
  {
    title: "Hustisya",
    credit: null,
    year: "Sep 2025",
    duration: "4:01",
    label: "Universal Music PH",
    chapter: "Chapter III — The Reckoning",
    desc: "Produced by Brian Lotho at Sonic State Audio, Manila.",
    spotify: null,
    apple: null,
    youtube: null,
    accent: "#2a0a0a",
    highlight: true,
  },
];
