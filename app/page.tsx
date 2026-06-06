import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Members } from "@/components/sections/Members";
import { Music } from "@/components/sections/Music";
import { Achievements } from "@/components/sections/Achievements";
import { StoryMap } from "@/components/sections/StoryMap";
import { Media } from "@/components/sections/Media";
import { Shows } from "@/components/sections/Shows";
import { Merch } from "@/components/sections/Merch";
import { Social } from "@/components/sections/Social";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      <Members />
      <Music />
      <Achievements />
      <StoryMap />
      <Media />
      <Shows />
      <Merch />
      <Social />
      <Contact />
      <Footer />
    </main>
  );
}
