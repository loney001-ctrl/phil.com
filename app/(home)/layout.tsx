import type {Metadata} from 'next'
import {Inter_Tight, Newsreader} from 'next/font/google'

import {siteUrl} from '@/sanity/lib/api'

const display = Inter_Tight({
  variable: '--font-home-display',
  subsets: ['latin'],
  weight: ['700', '800', '900'],
})
const serif = Newsreader({
  variable: '--font-home-serif',
  subsets: ['latin'],
  weight: ['400', '500'],
})

export const metadata: Metadata = {
  title: 'Phil Loney — Marketing strategist & systems thinker',
  description:
    'I find the commercial signal other marketers miss, turn it into a system you can test, then build the AI infrastructure to run that system at scale. Melbourne.',
  alternates: {canonical: siteUrl},
}

/**
 * Homepage-only chrome: the design uses its own pill nav and footer, distinct from the
 * generic settings-driven Navbar/Footer used everywhere else (see app/(website)/layout.tsx).
 * Deliberately not merged yet — see conversation notes / README for the plan to unify.
 */
export default function HomeLayout({children}: LayoutProps<'/'>) {
  return <div className={`${display.variable} ${serif.variable} home-page`}>{children}</div>
}
