"use client";

import { useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { PartyPopper } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function WelcomeNotification() {
    const t = useTranslations('WelcomeNotification');

    useEffect(() => {
        const timer = setTimeout(() => {
            const welcomeToastShown = sessionStorage.getItem('welcomeToastShown');
            if (!welcomeToastShown) {
                toast({
                    title: (
                        <div className="flex items-center gap-2">
                            <PartyPopper className="h-5 w-5 text-primary" />
                            <span className="font-bold">{t('title')}</span>
                        </div>
                    ),
                    description: t('description'),
                });
                sessionStorage.setItem('welcomeToastShown', 'true');
            }
        }, 2500);

        return () => clearTimeout(timer);
    }, [t]);

    return null;
}
