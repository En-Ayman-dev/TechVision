"use client";

import { useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { useTranslations } from 'next-intl';

export default function WelcomeNotification() {
    const t = useTranslations('WelcomeNotification');

    useEffect(() => {
        const timer = setTimeout(() => {
            const welcomeToastShown = sessionStorage.getItem('welcomeToastShown');
            if (!welcomeToastShown) {
                toast({
                    title: t('title'),
                    description: t('description'),
                });
                sessionStorage.setItem('welcomeToastShown', 'true');
            }
        }, 2500);

        return () => clearTimeout(timer);
    }, [t]);

    return null;
}
