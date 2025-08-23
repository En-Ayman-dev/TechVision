// import { PortfolioSection } from "@/components/landing/PortfolioSection";
// import { CtaSection } from "@/components/landing/CtaSection";

import CtaSection from "@/components/landing/CtaSection";
import PortfolioSection from "@/components/landing/PortfolioSection";

export default function PortfolioPage() {
  return (
    <>
      <PortfolioSection projects={[]} />
      <CtaSection />
    </>
  );
}