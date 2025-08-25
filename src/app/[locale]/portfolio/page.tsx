import { getProjectsAction } from "@/app/actions";
import CtaSection from "@/components/landing/CtaSection";
import PortfolioSection from "@/components/landing/PortfolioSection";

export default async function PortfolioPage() {
  const projects = await getProjectsAction();
  return (
    <div className="pt-16">
      <PortfolioSection projects={projects} />
      <CtaSection />
    </div>
  );
}