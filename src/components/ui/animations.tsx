"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface FadeInProps {
  children: React.ReactNode
  delay?: number
  duration?: number
  className?: string
}

export function FadeIn({ children, delay = 0, duration = 0.5, className }: FadeInProps) {
  const [isVisible, setIsVisible] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay * 1000)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [delay])

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all ease-out",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        className
      )}
      style={{
        transitionDuration: `${duration}s`,
      }}
    >
      {children}
    </div>
  )
}

interface SlideInProps {
  children: React.ReactNode
  direction?: "left" | "right" | "up" | "down"
  delay?: number
  duration?: number
  className?: string
}

export function SlideIn({ 
  children, 
  direction = "up", 
  delay = 0, 
  duration = 0.5, 
  className 
}: SlideInProps) {
  const [isVisible, setIsVisible] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  const getInitialTransform = () => {
    switch (direction) {
      case "left": return "translate-x-8"
      case "right": return "-translate-x-8"
      case "up": return "translate-y-8"
      case "down": return "-translate-y-8"
      default: return "translate-y-8"
    }
  }

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay * 1000)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [delay])

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all ease-out",
        isVisible ? "opacity-100 translate-x-0 translate-y-0" : `opacity-0 ${getInitialTransform()}`,
        className
      )}
      style={{
        transitionDuration: `${duration}s`,
      }}
    >
      {children}
    </div>
  )
}

interface ScaleInProps {
  children: React.ReactNode
  delay?: number
  duration?: number
  className?: string
}

export function ScaleIn({ children, delay = 0, duration = 0.5, className }: ScaleInProps) {
  const [isVisible, setIsVisible] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay * 1000)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [delay])

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all ease-out",
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95",
        className
      )}
      style={{
        transitionDuration: `${duration}s`,
      }}
    >
      {children}
    </div>
  )
}

interface StaggeredAnimationProps {
  children: React.ReactNode[]
  delay?: number
  staggerDelay?: number
  className?: string
}

export function StaggeredAnimation({ 
  children, 
  delay = 0, 
  staggerDelay = 0.1, 
  className 
}: StaggeredAnimationProps) {
  return (
    <div className={className}>
      {React.Children.map(children, (child, index) => (
        <FadeIn delay={delay + (index * staggerDelay)}>
          {child}
        </FadeIn>
      ))}
    </div>
  )
}

interface FloatingProps {
  children: React.ReactNode
  duration?: number
  className?: string
}

export function Floating({ children, duration = 3, className }: FloatingProps) {
  return (
    <div
      className={cn("animate-bounce", className)}
      style={{
        animationDuration: `${duration}s`,
        animationIterationCount: "infinite",
      }}
    >
      {children}
    </div>
  )
}

interface PulseProps {
  children: React.ReactNode
  duration?: number
  className?: string
}

export function Pulse({ children, duration = 2, className }: PulseProps) {
  return (
    <div
      className={cn("animate-pulse", className)}
      style={{
        animationDuration: `${duration}s`,
        animationIterationCount: "infinite",
      }}
    >
      {children}
    </div>
  )
}

interface TypewriterProps {
  text: string
  delay?: number
  speed?: number
  className?: string
}

export function Typewriter({ text, delay = 0, speed = 50, className }: TypewriterProps) {
  const [displayText, setDisplayText] = React.useState("")
  const [currentIndex, setCurrentIndex] = React.useState(0)

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (currentIndex < text.length) {
        setDisplayText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }
    }, currentIndex === 0 ? delay : speed)

    return () => clearTimeout(timer)
  }, [currentIndex, text, delay, speed])

  return (
    <span className={className}>
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  )
}

interface CountUpProps {
  end: number
  start?: number
  duration?: number
  delay?: number
  className?: string
}

export function CountUp({ 
  end, 
  start = 0, 
  duration = 2, 
  delay = 0, 
  className 
}: CountUpProps) {
  const [count, setCount] = React.useState(start)
  const [hasStarted, setHasStarted] = React.useState(false)
  const ref = React.useRef<HTMLSpanElement>(null)

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true)
          
          setTimeout(() => {
            const increment = (end - start) / (duration * 60) // 60fps
            let current = start
            
            const timer = setInterval(() => {
              current += increment
              if (current >= end) {
                setCount(end)
                clearInterval(timer)
              } else {
                setCount(Math.floor(current))
              }
            }, 1000 / 60)
          }, delay * 1000)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [end, start, duration, delay, hasStarted])

  return (
    <span ref={ref} className={className}>
      {count.toLocaleString()}
    </span>
  )
}

interface ParallaxProps {
  children: React.ReactNode
  speed?: number
  className?: string
}

export function Parallax({ children, speed = 0.5, className }: ParallaxProps) {
  const [offset, setOffset] = React.useState(0)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect()
        const scrolled = window.pageYOffset
        const rate = scrolled * -speed
        setOffset(rate)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [speed])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform: `translateY(${offset}px)`,
      }}
    >
      {children}
    </div>
  )
}

