import { getPartnersAction } from '@/app/actions';
import CtaSection from "@/components/landing/CtaSection";
import PartnersSection from '@/components/landing/PartnersSection';

export default async function PartnersPage() {
    const partners = await getPartnersAction();

    return (
        <>
            <PartnersSection partners={partners} />
            <CtaSection />
        </>
    );
}