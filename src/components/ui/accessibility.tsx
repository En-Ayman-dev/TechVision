"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "./button"
import { Separator } from "./separator"
import Link from "next/link"
import { Eye, Type, Contrast, Volume2, VolumeX, MessageSquare, Plus, X } from "lucide-react"
import { useTranslations } from "next-intl"
import { motion, AnimatePresence } from "framer-motion"

// ... سياق AccessibilityProvider و hook useAccessibility يبقى كما هو تمامًا ...
// ... (لا حاجة لنسخه مرة أخرى، فقط الجزء التالي هو الذي تغير)

// NOTE: The AccessibilityProvider and useAccessibility hook from your previous file remain UNCHANGED.
// The primary change is renaming AccessibilityToolbar to FloatingActionGroup and rewriting it completely.

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

  const toggleHighContrast = React.useCallback(() => setHighContrast(prev => !prev), [])
  const toggleReducedMotion = React.useCallback(() => setReducedMotion(prev => !prev), [])
  const toggleScreenReader = React.useCallback(() => setScreenReader(prev => !prev), [])

  React.useEffect(() => {
    const root = document.documentElement
    root.style.fontSize = `${fontSize}px`
    root.classList.toggle('high-contrast', highContrast)
    root.classList.toggle('reduce-motion', reducedMotion)
    root.classList.toggle('screen-reader-active', screenReader)
  }, [fontSize, highContrast, reducedMotion, screenReader])

  return (
    <AccessibilityContext.Provider
      value={{ fontSize, highContrast, reducedMotion, screenReader, setFontSize, toggleHighContrast, toggleReducedMotion, toggleScreenReader }}
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

// ====================================================================
// START: المكون الجديد والمُعاد هيكلته
// ====================================================================
export function FloatingActionGroup() {
  const t = useTranslations('Accessibility');
  const [isGroupOpen, setIsGroupOpen] = React.useState(false);
  const [isPanelOpen, setIsPanelOpen] = React.useState(false);

  // دالة لفتح لوحة التحكم وإغلاق مجموعة الأزرار
  const openAccessibilityPanel = () => {
    setIsPanelOpen(true);
    setIsGroupOpen(false);
  };

  // تعريفات الحركة للرسوم المتحركة
  const groupVariants = {
    closed: { scale: 0, transition: { staggerChildren: 0.05, staggerDirection: -1 } },
    open: { scale: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
  };

  const itemVariants = {
    closed: { y: 20, opacity: 0 },
    open: { y: 0, opacity: 1 },
  };

  return (
    <>
      {/* Grouped Floating Action Buttons */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3">
        <AnimatePresence>
          {isGroupOpen && (
            <motion.div
              variants={groupVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="flex flex-col items-end gap-3"
            >
              {/* Contact Us Button */}
              <motion.div variants={itemVariants} className="flex items-center gap-2">
                <span className="bg-background text-foreground text-sm py-1 px-3 rounded-md shadow-md">{t('contactUs')}</span>
                <Link href="/contact" passHref>
                  <Button size="sm" onClick={() => setIsGroupOpen(false)}>
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                </Link>
              </motion.div>

              {/* Accessibility Button */}
              <motion.div variants={itemVariants} className="flex items-center gap-2">
                <span className="bg-background text-foreground text-sm py-1 px-3 rounded-md shadow-md">{t('title')}</span>
                <Button size="sm" onClick={openAccessibilityPanel}>
                  <Eye className="w-4 h-4" />
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Toggle Button */}
        <Button
          size="sm"
          onClick={() => setIsGroupOpen(prev => !prev)}
          className="rounded-full w-12 h-12 shadow-lg"
          aria-label={t('openToolbar')}
        >
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={isGroupOpen ? "x" : "plus"}
              initial={{ rotate: -45, opacity: 0, scale: 0.5 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 45, opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}
            >
              {isGroupOpen ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
            </motion.div>
          </AnimatePresence>
        </Button>
      </div>

      {/* Accessibility Panel (Modal) */}
      <AnimatePresence>
        {isPanelOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-4 right-4 z-50"
          >
            <AccessibilityPanelContent closePanel={() => setIsPanelOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}


// تم فصل محتوى اللوحة إلى مكون خاص بها لتنظيم أفضل
function AccessibilityPanelContent({ closePanel }: { closePanel: () => void }) {
  const { fontSize, highContrast, reducedMotion, screenReader, setFontSize, toggleHighContrast, toggleReducedMotion, toggleScreenReader } = useAccessibility();
  const t = useTranslations('Accessibility');

  return (
    <div className="bg-background border rounded-lg shadow-lg p-4 space-y-3 w-64">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">{t('title')}</h3>
        <Button variant="ghost" size="sm" onClick={closePanel} aria-label={t('closeToolbar')}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-3">
        {/* Font Size */}
        <div className="space-y-2">
          <label className="text-xs font-medium">{t('fontSize')}</label>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setFontSize(Math.max(12, fontSize - 2))} disabled={fontSize <= 12} aria-label={t('decreaseFontSize')}>A-</Button>
            <span className="text-xs px-2">{fontSize}px</span>
            <Button variant="outline" size="sm" onClick={() => setFontSize(Math.min(24, fontSize + 2))} disabled={fontSize >= 24} aria-label={t('increaseFontSize')}>A+</Button>
          </div>
        </div>

        <Separator />

        {/* High Contrast */}
        <Button variant={highContrast ? "default" : "outline"} size="sm" onClick={toggleHighContrast} className="w-full justify-start" aria-pressed={highContrast}>
          <Contrast className="w-4 h-4 mr-2" /> {t('highContrast')}
        </Button>

        {/* Reduced Motion */}
        <Button variant={reducedMotion ? "default" : "outline"} size="sm" onClick={toggleReducedMotion} className="w-full justify-start" aria-pressed={reducedMotion}>
          <Type className="w-4 h-4 mr-2" /> {t('reduceMotion')}
        </Button>

        {/* Screen Reader */}
        <Button variant={screenReader ? "default" : "outline"} size="sm" onClick={toggleScreenReader} className="w-full justify-start" aria-pressed={screenReader}>
          {screenReader ? <Volume2 className="w-4 h-4 mr-2" /> : <VolumeX className="w-4 h-4 mr-2" />} {t('screenReader')}
        </Button>
      </div>
    </div>
  );
}

// ====================================================================
// END: المكون الجديد والمُعاد هيكلته
// ====================================================================

// ... (باقي المكونات المساعدة مثل SkipToContent تبقى كما هي)
export function SkipToContent() { /* ... unchanged ... */ }
export function ScreenReaderOnly({ children }: { children: React.ReactNode }) { /* ... unchanged ... */ }
export function FocusTrap({ children, active }: { children: React.ReactNode; active: boolean }) { /* ... unchanged ... */ }
export function LiveRegion({ children, politeness = "polite" }: { children: React.ReactNode; politeness?: "polite" | "assertive" | "off" }) { /* ... unchanged ... */ }