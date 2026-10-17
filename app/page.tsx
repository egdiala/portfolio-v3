import { Contact } from "@/components/home/contact";
import { Experience } from "@/components/home/experience";
import { FiguredOut } from "@/components/home/figured-out";
import { IntroSection } from "@/components/home/intro-section";
import { SaidOutLoud } from "@/components/home/said-out-loud";
import { SelectedWork } from "@/components/home/selected-work";
import { TinkeredWorks } from "@/components/home/tinkered-works";
import { ELSEWHERE } from "@/lib/contact";
import { pageMetadata, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/metadata";
import { Metadata } from "next";

export const metadata: Metadata = pageMetadata({ title: SITE_NAME, description: SITE_DESCRIPTION, path: "/" });

const person = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Stephen Diala",
  alternateName: "egdiala",
  url: SITE_URL.href,
  jobTitle: "Frontend Engineer",
  worksFor: { "@type": "Organization", name: "Moniepoint", url: "https://moniepoint.com" },
  sameAs: ELSEWHERE.map((place) => place.href),
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(person).replace(/</g, "\\u003c") }}
      />
      <IntroSection />
      <SelectedWork />
      <TinkeredWorks />
      <FiguredOut />
      <SaidOutLoud />
      <Experience />
      <Contact />
    </>
  );
}
