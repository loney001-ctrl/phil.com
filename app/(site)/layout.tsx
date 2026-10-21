import type {Metadata} from 'next'

import {fontClassName} from '@/app/fonts'
import {GlobalBodyCode, GlobalHeadTags} from '@/components/HeadCode'
import {siteUrl} from '@/sanity/lib/api'
import {sanityFetchMetadata} from '@/sanity/lib/live'
import {siteCodeQuery} from '@/sanity/lib/queries'

import '@/app/globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
}

/**
 * Root layout for the public site. The Studio has its own root layout in app/(studio), so the
 * global head and body code from Settings → Code never runs inside the authenticated CMS.
 */
export default function SiteRootLayout({children}: LayoutProps<'/'>) {
  return (
    <html lang="en-AU" className={fontClassName}>
      <head>
        <GlobalHeadCode />
      </head>
      <body>
        <GlobalBodyOpenCode />
        {children}
      </body>
    </html>
  )
}

/** Shared cached read. Published perspective only: draft code never reaches the live site. */
async function fetchSiteCode() {
  'use cache'
  const {data} = await sanityFetchMetadata({query: siteCodeQuery, perspective: 'published'})
  return data
}

async function GlobalHeadCode() {
  'use cache'
  const data = await fetchSiteCode()
  return <GlobalHeadTags code={data?.headCode} />
}

async function GlobalBodyOpenCode() {
  'use cache'
  const data = await fetchSiteCode()
  return <GlobalBodyCode code={data?.bodyCode} />
}
