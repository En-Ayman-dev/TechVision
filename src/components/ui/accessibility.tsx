"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "./button"
import { Eye, EyeOff, Type, Contrast, Volume2, VolumeX } from "lucide-react"

interface AccessibilityContextType {
  fontSize: number
  highContrast: boolean
  reducedMotion: boolean
  screenReader: boolean
  setFontSize: (size: number) => void
  toggleHighContrast: () => void
  toggleReducedMotion: () => void
  toggleScreenReader: () => void
}

const AccessibilityContext = React.createContext<AccessibilityContextType | undefined>(undefined)

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [fontSize, setFontSize] = React.useState(16)
  const [highContrast, setHighContrast] = React.useState(false)
  const [reducedMotion, setReducedMotion] = React.useState(false)
  const [screenReader, setScreenReader] = React.useState(false)

  const toggleHighContrast = React.useCallback(() => {
    setHighContrast(prev => !prev)
  }, [])

  const toggleReducedMotion = React.useCallback(() => {
    setReducedMotion(prev => !prev)
  }, [])

  const toggleScreenReader = React.useCallback(() => {
    setScreenReader(prev => !prev)
  }, [])

  // Apply accessibility settings to document
  React.useEffect(() => {
    const root = document.documentElement
    root.style.fontSize = `${fontSize}px`
    
    if (highContrast) {
      root.classList.add('high-contrast')
    } else {
      root.classList.remove('high-contrast')
    }

    if (reducedMotion) {
      root.classList.add('reduce-motion')
    } else {
      root.classList.remove('reduce-motion')
    }
  }, [fontSize, highContrast, reducedMotion])

  return (
    <AccessibilityContext.Provider
      value={{
        fontSize,
        highContrast,
        reducedMotion,
        screenReader,
        setFontSize,
        toggleHighContrast,
        toggleReducedMotion,
        toggleScreenReader,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  )
}

export function useAccessibility() {
  const context = React.useContext(AccessibilityContext)
  if (context === undefined) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider")
  }
  return context
}

export function AccessibilityToolbar() {
  const {
    fontSize,
    highContrast,
    reducedMotion,
    screenReader,
    setFontSize,
    toggleHighContrast,
    toggleReducedMotion,
    toggleScreenReader,
  } = useAccessibility()

  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div
        className={cn(
          "bg-background border rounded-lg shadow-lg transition-all duration-200",
          isOpen ? "p-4 space-y-3" : "p-2"
        )}
      >
        {isOpen ? (
          <>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">Accessibility</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                aria-label="Close accessibility toolbar"
              >
                <EyeOff className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-3">
              {/* Font Size */}
              <div className="space-y-2">
                <label className="text-xs font-medium">Font Size</label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFontSize(Math.max(12, fontSize - 2))}
                    disabled={fontSize <= 12}
                    aria-label="Decrease font size"
                  >
                    A-
                  </Button>
                  <span className="text-xs px-2">{fontSize}px</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFontSize(Math.min(24, fontSize + 2))}
                    disabled={fontSize >= 24}
                    aria-label="Increase font size"
                  >
                    A+
                  </Button>
                </div>
              </div>

              {/* High Contrast */}
              <Button
                variant={highContrast ? "default" : "outline"}
                size="sm"
                onClick={toggleHighContrast}
                className="w-full justify-start"
                aria-pressed={highContrast}
              >
                <Contrast className="w-4 h-4 mr-2" />
                High Contrast
              </Button>

              {/* Reduced Motion */}
              <Button
                variant={reducedMotion ? "default" : "outline"}
                size="sm"
                onClick={toggleReducedMotion}
                className="w-full justify-start"
                aria-pressed={reducedMotion}
              >
                <Type className="w-4 h-4 mr-2" />
                Reduce Motion
              </Button>

              {/* Screen Reader */}
              <Button
                variant={screenReader ? "default" : "outline"}
                size="sm"
                onClick={toggleScreenReader}
                className="w-full justify-start"
                aria-pressed={screenReader}
              >
                {screenReader ? (
                  <Volume2 className="w-4 h-4 mr-2" />
                ) : (
                  <VolumeX className="w-4 h-4 mr-2" />
                )}
                Screen Reader
              </Button>
            </div>
          </>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsOpen(true)}
            aria-label="Open accessibility toolbar"
          >
            <Eye className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  )
}

// Skip to content link
export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50"
    >
      Skip to main content
    </a>
  )
}

// Screen reader only text
export function ScreenReaderOnly({ children }: { children: React.ReactNode }) {
  return <span className="sr-only">{children}</span>
}

// Focus trap for modals and dialogs
export function FocusTrap({ children, active }: { children: React.ReactNode; active: boolean }) {
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!active || !containerRef.current) return

    const container = containerRef.current
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus()
          e.preventDefault()
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus()
          e.preventDefault()
        }
      }
    }

    container.addEventListener('keydown', handleTabKey)
    firstElement?.focus()

    return () => {
      container.removeEventListener('keydown', handleTabKey)
    }
  }, [active])

  return <div ref={containerRef}>{children}</div>
}

// Announce changes to screen readers
export function LiveRegion({ 
  children, 
  politeness = "polite" 
}: { 
  children: React.ReactNode
  politeness?: "polite" | "assertive" | "off"
}) {
  return (
    <div
      aria-live={politeness}
      aria-atomic="true"
      className="sr-only"
    >
      {children}
    </div>
  )
}

