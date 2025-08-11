"use client"

export function FloatingElements() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating circles */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-float-slow"></div>
      <div className="absolute top-40 right-20 w-16 h-16 bg-blue-300 rounded-full opacity-30 animate-float-medium"></div>
      <div className="absolute bottom-40 left-20 w-12 h-12 bg-blue-400 rounded-full opacity-25 animate-float-fast"></div>
      <div className="absolute bottom-20 right-40 w-24 h-24 bg-blue-100 rounded-full opacity-15 animate-float-slow"></div>

      {/* Floating squares */}
      <div className="absolute top-60 left-1/4 w-8 h-8 bg-blue-500 opacity-20 rotate-45 animate-float-medium"></div>
      <div className="absolute top-80 right-1/3 w-6 h-6 bg-blue-600 opacity-30 rotate-12 animate-float-fast"></div>
    </div>
  )
}
