import React from 'react'

interface SidebarProps {
  className?: string
}

export function Sidebar({ className = '' }: SidebarProps) {
  return (
    <aside id="secondary" className={`overflow-visible ${className}`}>
      <div className="sticky space-y-6" style={{ top: 'var(--sticky-sidebar-top)', maxHeight: '500px' }}>
        {/* ATF Ad Target - Journey/Mediavine */}
        <div id="sidebar_atf" className="widget" />

        {/* Optional: Add a simple widget between ads for better UX */}
        {/* You can uncomment this if needed */}
        {/* <div className="widget rounded-xl border border-border bg-white p-5 dark:bg-muted/50">
          <h3 className="font-semibold text-foreground">Advertisement</h3>
        </div> */}

        {/* BTF Ad Target - Journey/Mediavine */}
        <div id="sidebar_btf" className="widget" />

        {/* Sidebar Stopper - Journey/Mediavine */}
        <div id="mv-sidebar-stopper" />
      </div>
    </aside>
  )
}
