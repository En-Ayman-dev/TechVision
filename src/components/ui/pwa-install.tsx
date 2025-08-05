"use client"

import * as React from "react"
import { Button } from "./button"
import { Card, CardContent } from "./card"
import { useNotifications } from "./notification"
import { Download, X, Smartphone, Monitor } from "lucide-react"

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = React.useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallPrompt, setShowInstallPrompt] = React.useState(false)
  const [isInstalled, setIsInstalled] = React.useState(false)
  const { addNotification } = useNotifications()

  React.useEffect(() => {
    // Check if app is already installed
    const checkIfInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true)
      }
    }

    checkIfInstalled()

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      
      // Show install prompt after a delay (don't be too aggressive)
      setTimeout(() => {
        if (!isInstalled) {
          setShowInstallPrompt(true)
        }
      }, 30000) // Show after 30 seconds
    }

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowInstallPrompt(false)
      setDeferredPrompt(null)
      
      addNotification({
        type: "success",
        title: "App installed!",
        description: "TechVision has been installed on your device.",
      })
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [isInstalled, addNotification])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        addNotification({
          type: "success",
          title: "Installing app...",
          description: "TechVision is being installed on your device.",
        })
      }
      
      setDeferredPrompt(null)
      setShowInstallPrompt(false)
    } catch (error) {
      addNotification({
        type: "error",
        title: "Installation failed",
        description: "Could not install the app. Please try again.",
      })
    }
  }

  const handleDismiss = () => {
    setShowInstallPrompt(false)
    
    // Don't show again for this session
    sessionStorage.setItem('pwa-install-dismissed', 'true')
  }

  // Don't show if already installed or dismissed
  if (isInstalled || !showInstallPrompt || !deferredPrompt) {
    return null
  }

  // Check if user already dismissed this session
  if (sessionStorage.getItem('pwa-install-dismissed')) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-80">
      <Card className="shadow-lg border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">TV</span>
              </div>
              <div>
                <h3 className="font-semibold text-sm">Install TechVision</h3>
                <p className="text-xs text-muted-foreground">Get the app experience</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="h-6 w-6 p-0"
              aria-label="Dismiss install prompt"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-2 mb-3">
            <div className="flex items-center text-xs text-muted-foreground">
              <Smartphone className="h-3 w-3 mr-1" />
              Works offline
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Monitor className="h-3 w-3 mr-1" />
              Fast loading
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Download className="h-3 w-3 mr-1" />
              No app store needed
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button
              onClick={handleInstallClick}
              size="sm"
              className="flex-1"
            >
              <Download className="h-4 w-4 mr-2" />
              Install
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDismiss}
            >
              Later
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Hook to check PWA installation status
export function usePWAInstall() {
  const [isInstalled, setIsInstalled] = React.useState(false)
  const [canInstall, setCanInstall] = React.useState(false)

  React.useEffect(() => {
    // Check if app is installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
    }

    // Check if app can be installed
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setCanInstall(true)
    }

    const handleAppInstalled = () => {
      setIsInstalled(true)
      setCanInstall(false)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  return { isInstalled, canInstall }
}

