// src/components/landing/LoadingScreen.tsx
"use client"; // هذا المكون هو Client Component

import { useState, useEffect } from 'react';
import { Code } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next'; // استخدام useTranslation

// إزالة تعريف الـ props التي تستقبل t
// interface LoadingScreenProps { t: (key: string) => string; }

// المكون لم يعد يستقبل t كـ prop
export default function LoadingScreen() { // إزالة { t }: LoadingScreenProps
  // استخدام useTranslation مباشرة هنا
  const { t } = useTranslation('LoadingScreen'); // جلب الترجمة لـ namespace 'LoadingScreen'

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
        {/* استخدام t مباشرة مع المفتاح من الـ namespace المحدد */}
        <p className="text-sm text-muted-foreground">{t('message')}</p>
      </div>
    </div>
  );
}
