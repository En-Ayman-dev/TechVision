"use client";

import { useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { PartyPopper } from 'lucide-react';

export default function WelcomeNotification() {
    useEffect(() => {
        const timer = setTimeout(() => {
            const welcomeToastShown = sessionStorage.getItem('welcomeToastShown');
            if (!welcomeToastShown) {
                toast({
                    title: (
                        <div className="flex items-center gap-2">
                            <PartyPopper className="h-5 w-5 text-primary" />
                            <span className="font-bold">Welcome to TechVision!</span>
                        </div>
                    ),
                    description: "We're glad to have you here. Explore our work and services.",
                });
                sessionStorage.setItem('welcomeToastShown', 'true');
            }
        }, 2500);

        return () => clearTimeout(timer);
    }, []);

    return null;
}
