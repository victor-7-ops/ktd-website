import type { Metadata } from "next";
import { Bebas_Neue, DM_Sans, Lora, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { CustomCursor } from "@/components/layout/CustomCursor";

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const dmSans = DM_Sans({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const lora = Lora({
  weight: ["400", "500"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "KIDZ THESE DAYS — Cebu City Indie Pop-Rock",
  description:
    "Official site of KIDZ THESE DAYS (KTD), a Cebu City indie pop-rock band signed to Unstable Records. Indie Pop-Rock · OPM · City Pop · Funk.",
  openGraph: {
    title: "KIDZ THESE DAYS",
    description: "Cebu City indie pop-rock. We aim to flip that script.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bebas.variable} ${dmSans.variable} ${lora.variable} ${jetbrains.variable}`}
    >
      <body>
        <div className="grain" aria-hidden="true" />
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
