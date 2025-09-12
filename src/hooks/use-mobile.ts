"use client"

import * as React from "react"

/**
 * useIsMobile
 * A small hook that returns `true` when the viewport is considered mobile.
 * Uses a CSS media query and is SSR-safe (defaults to false on the server).
 */
export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = React.useState(() => {
    // During SSR `window` is undefined, assume desktop (false) to avoid
    // hydration mismatch. Components that care should handle the initial
    // transient state if needed.
    if (typeof window === "undefined") return false
    return window.innerWidth < breakpoint
  })

  React.useEffect(() => {
    if (typeof window === "undefined") return

    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`)

    const handler = (e: MediaQueryListEvent | MediaQueryList) => {
      // Some older browsers call listener with MediaQueryList (not event).
      // Normalize to boolean.
      setIsMobile(Boolean((e as any).matches))
    }

    // Set initial value
    setIsMobile(mq.matches)

    // Use addEventListener when available to match modern typing
    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", handler)
    } else {
      // Older browsers
      // @ts-ignore
      mq.addListener(handler)
    }

    return () => {
      if (typeof mq.removeEventListener === "function") {
        mq.removeEventListener("change", handler)
      } else {
        // @ts-ignore
        mq.removeListener(handler)
      }
    }
  }, [breakpoint])

  return isMobile
}

export default useIsMobile
