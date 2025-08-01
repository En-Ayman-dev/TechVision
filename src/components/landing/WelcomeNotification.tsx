// src/components/landing/WelcomeNotification.tsx
"use client"; // هذا المكون هو Client Component

import { useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { PartyPopper } from 'lucide-react';
import { useTranslation } from 'react-i18next'; // استخدام useTranslation

// إزالة تعريف الـ props التي تستقبل t
// interface WelcomeNotificationProps { t: (key: string) => string; }

// المكون لم يعد يستقبل t كـ prop
export default function WelcomeNotification() { // إزالة { t }: WelcomeNotificationProps
    // استخدام useTranslation مباشرة هنا
    const { t } = useTranslation('WelcomeNotification'); // جلب الترجمة لـ namespace 'WelcomeNotification'

    useEffect(() => {
        const timer = setTimeout(() => {
            const welcomeToastShown = sessionStorage.getItem('welcomeToastShown');
            if (!welcomeToastShown) {
                toast({
                    // استخدام الترجمة مباشرة كـ string
                    title: t('title'),
                    description: t('description'),
                });
                sessionStorage.setItem('welcomeToastShown', 'true');
            }
        }, 2500);

        return () => clearTimeout(timer);
    }, []); // إزالة t من dependencies array لأنها لم تعد prop

    return null;
}
