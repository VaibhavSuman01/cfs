"use client"

import type React from "react"

import { useEffect, useRef } from "react"

interface LottieAnimationProps {
  animationData?: string
  width?: number
  height?: number
  className?: string
  fallbackIcon?: React.ReactNode
}

export function LottieAnimation({
  animationData,
  width = 200,
  height = 200,
  className = "",
  fallbackIcon,
}: LottieAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Placeholder for Lottie animation
    // In a real implementation, you would load the Lottie library here
    if (containerRef.current) {
      containerRef.current.innerHTML = `
        <div class="flex items-center justify-center w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 rounded-full animate-pulse">
          <div class="w-16 h-16 bg-blue-500 rounded-full animate-bounce"></div>
        </div>
      `
    }
  }, [animationData])

  return (
    <div ref={containerRef} className={`inline-block ${className}`} style={{ width, height }}>
      {fallbackIcon && <div className="flex items-center justify-center w-full h-full">{fallbackIcon}</div>}
    </div>
  )
}
