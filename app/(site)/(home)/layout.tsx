import type {Metadata} from 'next'
import {Inter_Tight, Newsreader} from 'next/font/google'

import {getHomeData, HOME_FALLBACK} from '@/app/(site)/(home)/homeData'
import {buildLayoutMetadata, buildMetadata, getGlobalSeo} from '@/sanity/lib/seo'

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

/**
 * Home → SEO in the Studio overrides these. Without a Home document the hardcoded copy is used.
 */
export async function generateMetadata(): Promise<Metadata> {
  const [global, home] = await Promise.all([getGlobalSeo('published'), getHomeData()])
  const layout = buildLayoutMetadata(global, home?.title)
  const page = buildMetadata({
    seo: home?.seo,
    title: HOME_FALLBACK.title,
    description: home?.overview || HOME_FALLBACK.description,
    path: '/',
    global,
    isHome: true,
  })
  return {...layout, ...page}
}

/**
 * Homepage-only chrome: the design uses its own pill nav and footer, distinct from the
 * generic settings-driven Navbar/Footer used everywhere else (see app/(site)/(website)/layout.tsx).
 * Deliberately not merged yet — see conversation notes / README for the plan to unify.
 */
export default function HomeLayout({children}: LayoutProps<'/'>) {
  return <div className={`${display.variable} ${serif.variable} home-page`}>{children}</div>
}
