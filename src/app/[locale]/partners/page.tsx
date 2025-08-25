import { getPartnersAction } from '@/app/actions';
import CtaSection from "@/components/landing/CtaSection";
import PartnersSection from '@/components/landing/PartnersSection';

export default async function PartnersPage() {
    const partners = await getPartnersAction();

    return (
        <div className="pt-16">
            <PartnersSection partners={partners} />
            <CtaSection />
        </div>
    );
}