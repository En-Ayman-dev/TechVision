import { getProjectsAction } from "@/app/actions";
import CtaSection from "@/components/landing/CtaSection";
import PortfolioSection from "@/components/landing/PortfolioSection";

export default async function PortfolioPage() {
  const projects = await getProjectsAction();
  return (
    <>
      <PortfolioSection projects={projects} />
      <CtaSection />
    </>
  );
}