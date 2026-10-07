import { Experience } from "@/components/home/experience";
import { IntroSection } from "@/components/home/intro-section";
import { SelectedWork } from "@/components/home/selected-work";
import { TinkeredWorks } from "@/components/home/tinkered-works";

export default function Home() {
  return (
    <>
      <IntroSection />
      <SelectedWork />
      <TinkeredWorks />
      <Experience />
    </>
  );
}
