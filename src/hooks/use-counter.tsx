"use client";

import { useState, useEffect, useRef } from 'react';

const useCounter = (endValue: number, duration = 2000) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;

    const startAnimation = () => {
      let startTime: number | null = null;
      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = timestamp - startTime;
        const percentage = Math.min(progress / duration, 1);
        setCount(Math.floor(endValue * percentage));
        if (progress < duration) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    };

    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          startAnimation();
          observer.current?.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    observer.current.observe(currentRef);

    return () => {
      observer.current?.disconnect();
    };
  }, [endValue, duration]);

  return { count, ref };
};

export default useCounter;
