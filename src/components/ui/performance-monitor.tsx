"use client"

import * as React from "react"
import { useNotifications } from "./notification"

interface PerformanceMetrics {
  loadTime: number
  renderTime: number
  memoryUsage: number
  networkRequests: number
}

export function PerformanceMonitor() {
  const { addNotification } = useNotifications()
  const [metrics, setMetrics] = React.useState<PerformanceMetrics | null>(null)

  React.useEffect(() => {
    // Monitor page load performance
    const measurePerformance = () => {
      if (typeof window !== 'undefined' && 'performance' in window) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
        const loadTime = navigation.loadEventEnd - navigation.loadEventStart
        const renderTime = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart
        
        // Get memory usage if available
        const memoryUsage = (performance as any).memory?.usedJSHeapSize || 0
        
        // Count network requests
        const networkRequests = performance.getEntriesByType('resource').length

        const newMetrics: PerformanceMetrics = {
          loadTime,
          renderTime,
          memoryUsage: memoryUsage / 1024 / 1024, // Convert to MB
          networkRequests
        }

        setMetrics(newMetrics)

        // Alert if performance is poor
        if (loadTime > 3000) {
          addNotification({
            type: "warning",
            title: "Slow page load detected",
            description: `Page took ${(loadTime / 1000).toFixed(2)}s to load`,
          })
        }

        // Log performance metrics in development
        if (process.env.NODE_ENV === 'development') {
          console.group('Performance Metrics')
          console.log('Load Time:', `${(loadTime / 1000).toFixed(2)}s`)
          console.log('Render Time:', `${(renderTime / 1000).toFixed(2)}s`)
          console.log('Memory Usage:', `${newMetrics.memoryUsage.toFixed(2)}MB`)
          console.log('Network Requests:', networkRequests)
          console.groupEnd()
        }
      }
    }

    // Measure performance after page load
    if (document.readyState === 'complete') {
      measurePerformance()
    } else {
      window.addEventListener('load', measurePerformance)
      return () => window.removeEventListener('load', measurePerformance)
    }
  }, [addNotification])

  // Monitor Core Web Vitals
  React.useEffect(() => {
    if (typeof window !== 'undefined' && 'web-vitals' in window) {
      // This would require installing web-vitals package
      // For now, we'll use a simplified version
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'largest-contentful-paint') {
            const lcp = entry.startTime
            if (lcp > 2500) {
              addNotification({
                type: "warning",
                title: "Poor LCP detected",
                description: `Largest Contentful Paint: ${(lcp / 1000).toFixed(2)}s`,
              })
            }
          }
        }
      })

      try {
        observer.observe({ entryTypes: ['largest-contentful-paint'] })
      } catch (error) {
        // Observer not supported
      }

      return () => observer.disconnect()
    }
  }, [addNotification])

  // Error boundary for JavaScript errors
  React.useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      addNotification({
        type: "error",
        title: "JavaScript Error",
        description: event.message,
      })
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      addNotification({
        type: "error",
        title: "Unhandled Promise Rejection",
        description: String(event.reason),
      })
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [addNotification])

  // Development-only performance display
  if (process.env.NODE_ENV === 'development' && metrics) {
    return (
      <div className="fixed bottom-4 left-4 bg-background border rounded-lg p-3 text-xs font-mono z-50 shadow-lg">
        <div className="font-semibold mb-2">Performance</div>
        <div>Load: {(metrics.loadTime / 1000).toFixed(2)}s</div>
        <div>Render: {(metrics.renderTime / 1000).toFixed(2)}s</div>
        <div>Memory: {metrics.memoryUsage.toFixed(1)}MB</div>
        <div>Requests: {metrics.networkRequests}</div>
      </div>
    )
  }

  return null
}

// Hook for accessing performance metrics
export function usePerformanceMetrics() {
  const [metrics, setMetrics] = React.useState<PerformanceMetrics | null>(null)

  React.useEffect(() => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      const loadTime = navigation.loadEventEnd - navigation.loadEventStart
      const renderTime = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart
      const memoryUsage = (performance as any).memory?.usedJSHeapSize || 0
      const networkRequests = performance.getEntriesByType('resource').length

      setMetrics({
        loadTime,
        renderTime,
        memoryUsage: memoryUsage / 1024 / 1024,
        networkRequests
      })
    }
  }, [])

  return metrics
}

