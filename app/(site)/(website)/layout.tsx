import {SpeedInsights} from '@vercel/speed-insights/next'
import type {Metadata, Viewport} from 'next'
import {defineQuery} from 'next-sanity'
import {VisualEditing} from 'next-sanity/visual-editing'
import {draftMode} from 'next/headers'
import {Suspense} from 'react'
import {Toaster} from 'sonner'

import {CustomPortableText} from '@/components/CustomPortableText'
import {DraftModeProvider} from '@/components/DraftModeContext'
import {JsonLd} from '@/components/JsonLd'
import {Navbar} from '@/components/Navbar'
import {PopularSearches} from '@/components/PopularSearches'
import IntroTemplate from '@/intro-template'
import {entityNode, graph, websiteNode} from '@/sanity/lib/jsonLd'
import {
  getDynamicFetchOptions,
  liveWaitFor,
  sanityFetch,
  sanityFetchMetadata,
  SanityLive,
  type DynamicFetchOptions,
} from '@/sanity/lib/live'
import {settingsQuery} from '@/sanity/lib/queries'
import {buildLayoutMetadata, getGlobalSeo} from '@/sanity/lib/seo'

import {handleError} from './client-functions'
import {DraftModeToast} from './DraftModeToast'

const homeTitleQuery = defineQuery(`*[_type == "home"][0]{title}`)

export async function generateMetadata(): Promise<Metadata> {
  const {perspective} = await getDynamicFetchOptions()
  const [global, {data: home}] = await Promise.all([
    getGlobalSeo(perspective),
    sanityFetchMetadata({query: homeTitleQuery, perspective}),
  ])
  return buildLayoutMetadata(global, home?.title)
}

export const viewport: Viewport = {themeColor: '#000'}

export default async function PersonalLayout({children}: LayoutProps<'/'>) {
  const {isEnabled: isDraftMode} = await draftMode()
  return (
    <DraftModeProvider isDraftMode={isDraftMode}>
      <div className="flex min-h-screen flex-col bg-white text-black">
        {isDraftMode ? (
          <Suspense fallback={<NavbarFallback />}>
            <DynamicNavbar />
          </Suspense>
        ) : (
          <CachedNavbar perspective="published" stega={false} />
        )}
        <div className="mt-20 flex-grow px-4 md:px-16 lg:px-32">{children}</div>
        {isDraftMode ? (
          <Suspense>
            <DynamicFooter />
          </Suspense>
        ) : (
          <CachedFooter perspective="published" stega={false} />
        )}
        <Suspense>
          <IntroTemplate />
        </Suspense>
      </div>
      <Suspense>
        <WebsiteJsonLd />
      </Suspense>
      <Toaster />
      <SanityLive onError={handleError} includeDrafts={isDraftMode} waitFor={liveWaitFor} />
      {isDraftMode && (
        <>
          <DraftModeToast
            action={async () => {
              'use server'

              const draft = await draftMode()
              draft.disable()
              // Simulate a delay to show the loading state
              await new Promise((resolve) => setTimeout(resolve, 1000))
            }}
          />
          <VisualEditing />
        </>
      )}
      <SpeedInsights />
    </DraftModeProvider>
  )
}

/**
 * Shared cache leaf — both the navbar and footer derive from the same `settingsQuery`, so
 * neither has to wait independently for the same data.
 */
async function fetchSettings({perspective, stega}: DynamicFetchOptions) {
  'use cache'
  const {data} = await sanityFetch({query: settingsQuery, perspective, stega})
  return data
}

async function DynamicNavbar() {
  const {perspective, stega} = await getDynamicFetchOptions()
  return <CachedNavbar perspective={perspective} stega={stega} />
}

async function CachedNavbar({perspective, stega}: DynamicFetchOptions) {
  'use cache'
  const data = await fetchSettings({perspective, stega})
  return <Navbar data={data} />
}

/**
 * Mirrors the real `<Navbar>` shell so the static fallback occupies the same vertical space.
 * Width of the placeholder link is arbitrary — height is what matters to avoid layout shift.
 */
function NavbarFallback() {
  return (
    <header
      aria-busy
      className="sticky top-0 z-10 flex flex-wrap items-center gap-x-5 bg-white/80 px-4 py-4 backdrop-blur md:px-16 md:py-5 lg:px-32"
      data-testid="site-header"
    >
      <span className="text-lg md:text-xl" aria-hidden>
        <span className="inline-block h-[1em] w-24 animate-pulse rounded bg-gray-200 align-middle md:w-32" />
      </span>
    </header>
  )
}

async function DynamicFooter() {
  const {perspective, stega} = await getDynamicFetchOptions()
  return <CachedFooter perspective={perspective} stega={stega} />
}

async function CachedFooter({perspective, stega}: DynamicFetchOptions) {
  'use cache'
  const data = await fetchSettings({perspective, stega})
  const hasText = Array.isArray(data?.footer) && data.footer.length > 0
  const hasSearches = !!data?.popularSearches?.links?.length
  if (!hasText && !hasSearches) {
    return null
  }
  return (
    <footer className="bottom-0 w-full bg-white" data-testid="site-footer">
      {hasText && data?.footer && (
        <div className="py-12 text-center md:py-20">
          <CustomPortableText
            id={data._id}
            type={data._type}
            path={['footer']}
            paragraphClasses="text-md md:text-xl"
            value={data.footer}
          />
        </div>
      )}
      <PopularSearches data={data?.popularSearches} variant="site" />
    </footer>
  )
}

/**
 * Sitewide WebSite + Person/Organization JSON-LD. Page-level nodes (WebPage, BlogPosting,
 * BreadcrumbList) are rendered by each route and reference these by @id.
 */
async function WebsiteJsonLd() {
  'use cache'
  const [global, {data: home}] = await Promise.all([
    getGlobalSeo('published'),
    sanityFetchMetadata({query: homeTitleQuery, perspective: 'published'}),
  ])
  const website = websiteNode(global, home?.title)
  if (!website) return null
  return <JsonLd data={graph([website, entityNode(global)])} />
}
