'use client';

import "./franchise/betz-mock-sections.css";
import { FranchiseFooter } from "./franchise/components/FranchiseFooter";
import { FranchiseHeader } from "./franchise/components/FranchiseHeader";
import { FranchiseHero } from "./franchise/components/FranchiseHero";
import { FranchiseJourney } from "./franchise/components/FranchiseJourney";
import { HeritageSection } from "./franchise/components/HeritageSection";
import { IdealPartners } from "./franchise/components/IdealPartners";
import { ModelSection } from "./franchise/components/ModelSection";
import { OpportunityIntro } from "./franchise/components/OpportunityIntro";
import { Since1945Badge } from "./franchise/components/Since1945Badge";
import { Territories } from "./franchise/components/Territories";
import { WaitlistForm } from "./franchise/components/WaitlistForm";
import { WhatYouGet } from "./franchise/components/WhatYouGet";
import { useActiveSection } from "./franchise/hooks/useActiveSection";

export default function Home() {
  const activeSection = useActiveSection();

  return (
    <>
      <FranchiseHeader activeSection={activeSection} />
      <main>
        <FranchiseHero />
        <OpportunityIntro />
        <FranchiseJourney />
        <WhatYouGet />
        <HeritageSection />
        <ModelSection />
        <Territories />
        <IdealPartners />
        <WaitlistForm />
      </main>
      <FranchiseFooter />
      <Since1945Badge />
    </>
  );
}
