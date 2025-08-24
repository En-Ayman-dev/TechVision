"use client";

import { useState, useEffect } from 'react';
import { Code } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

export default function LoadingScreen() {
  const t = useTranslations('LoadingScreen');
  const [isMounted, setIsMounted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const isFirstVisit = !sessionStorage.getItem('visited');
    if (!isFirstVisit) {
      setIsMounted(false);
      return;
    }

    document.body.style.overflow = 'hidden';

    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsFadingOut(true);
            setTimeout(() => {
              setIsMounted(false);
              document.body.style.overflow = 'auto';
              sessionStorage.setItem('visited', 'true');
            }, 500); // CSS transition duration
          }, 250);
          return 100;
        }
        const diff = Math.random() * 15;
        return Math.min(oldProgress + diff, 100);
      });
    }, 150);

    return () => {
      clearInterval(timer);
      document.body.style.overflow = 'auto';
    };
  }, []);

  if (!isMounted) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background transition-opacity duration-500",
        isFadingOut && "opacity-0"
      )}
    >
      <div className="w-64 flex flex-col items-center gap-4">
        <div className="flex items-center gap-2 text-2xl font-bold font-headline">
          <Code className="h-8 w-8 text-primary" />
          <span>TechVision</span>
        </div>
        <Progress value={progress} className="h-2" />
        <p className="text-sm text-muted-foreground">{t('message')}</p>
      </div>
    </div>
  );
}
