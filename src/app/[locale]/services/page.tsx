import { getServicesAction } from "@/app/actions";
import CtaSection from "@/components/landing/CtaSection";
import ServicesSection from "@/components/landing/ServicesSection";

export default async function ServicesPage() {
  const services = await getServicesAction();

  return (
    <div className="pt-16">
      <ServicesSection services={services} />
      <CtaSection />
    </div>
  );
}