import type {Metadata} from 'next'

import {fontClassName} from '@/app/fonts'

import '@/app/globals.css'

export const metadata: Metadata = {
  title: 'Studio',
  robots: {index: false, follow: false},
}

/**
 * Root layout for the embedded Sanity Studio. Deliberately has no global head/body code: third-party
 * scripts must not run on the origin that holds the editor's Sanity session.
 */
export default function StudioRootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={fontClassName}>
      <body>{children}</body>
    </html>
  )
}
