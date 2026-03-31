'use client'

import { useEffect } from 'react'

export default function StudioWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    // Hide header, footer, and main on mount
    const header = document.querySelector('header')
    const footer = document.querySelector('footer')
    const main = document.querySelector('main')
    
    if (header) header.style.display = 'none'
    if (footer) footer.style.display = 'none'
    if (main) main.style.cssText = 'flex: 1; display: flex; padding: 0; margin: 0;'
    
    // Cleanup: restore on unmount
    return () => {
      if (header) header.style.display = ''
      if (footer) footer.style.display = ''
      if (main) main.style.cssText = ''
    }
  }, [])

  return (
    <div className="fixed inset-0 z-[100] bg-white dark:bg-black">
      {children}
    </div>
  )
}
