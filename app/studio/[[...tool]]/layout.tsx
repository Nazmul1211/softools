import type { Metadata } from 'next'
import StudioWrapper from './StudioWrapper'

export const metadata: Metadata = {
  title: 'Softzar CMS Studio',
  robots: {
    index: false,
    follow: false,
  },
}

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <StudioWrapper>{children}</StudioWrapper>
}
