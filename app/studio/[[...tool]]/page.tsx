'use client'

import { NextStudio } from 'next-sanity/studio'
import config from '@/sanity.config'

export default function StudioPage() {
  return (
    <>
      {/* Disable Journey ads on Studio pages */}
      <div id="ad-management-config-settings" data-blocklist-all="1" />
      <NextStudio config={config} />
    </>
  )
}
