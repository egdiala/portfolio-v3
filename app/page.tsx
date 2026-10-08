import { Experience } from "@/components/home/experience";
import { IntroSection } from "@/components/home/intro-section";
import { SelectedWork } from "@/components/home/selected-work";
import { TinkeredWorks } from "@/components/home/tinkered-works";
import { pageMetadata, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/metadata";

export const metadata = pageMetadata({ title: SITE_NAME, description: SITE_DESCRIPTION, path: "/" });

const person = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Stephen Diala",
  alternateName: "egdiala",
  url: SITE_URL.href,
  jobTitle: "Frontend Engineer",
  worksFor: { "@type": "Organization", name: "Moniepoint", url: "https://moniepoint.com" },
  sameAs: [
    "https://x.com/e_diala",
    "https://www.linkedin.com/in/egwuchukwu-diala",
    "https://github.com/egdiala",
  ],
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
      <Experience />
    </>
  );
}
