import {createClient} from '@sanity/client'
import {NextResponse, type NextRequest} from 'next/server'

import {matchRedirect, type RedirectRule} from '@/sanity/lib/redirects'

/**
 * Applies Studio-managed redirects (the `redirect` document type) before any route renders.
 *
 * Rules are read from the Sanity CDN and kept in memory for TTL_MS per server instance, so a new or
 * changed redirect takes effect within about a minute without a redeploy. If Sanity is
 * unreachable, requests pass through untouched (fail open).
 */

const TTL_MS = 60_000

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-02-27',
  useCdn: true,
  perspective: 'published',
  token: process.env.SANITY_API_READ_TOKEN,
})

let cache: {rules: RedirectRule[]; expires: number} | null = null
let inflight: Promise<RedirectRule[]> | null = null

async function getRules(): Promise<RedirectRule[]> {
  const now = Date.now()
  if (cache && cache.expires > now) return cache.rules
  if (inflight) return inflight
  inflight = client
    .fetch<RedirectRule[]>(
      `*[_type == "redirect" && enabled != false && defined(source) && defined(destination)]{
        source, destination, "permanent": permanent != false
      }`,
    )
    .then((rules) => {
      cache = {rules, expires: Date.now() + TTL_MS}
      return rules
    })
    .catch((error) => {
      console.error('[redirects] Could not load redirects, passing request through.', error)
      // Back off briefly so an outage doesn't add a failed fetch to every request.
      cache = {rules: cache?.rules ?? [], expires: Date.now() + 10_000}
      return cache.rules
    })
    .finally(() => {
      inflight = null
    })
  return inflight
}

export async function proxy(request: NextRequest) {
  const rules = await getRules()
  if (!rules.length) return NextResponse.next()

  const {pathname, search} = request.nextUrl
  const match = matchRedirect(rules, pathname, search)
  if (!match) return NextResponse.next()

  const target = new URL(match.destination, request.url)
  // Never redirect to the same URL.
  if (
    target.pathname === pathname &&
    target.search === search &&
    target.host === request.nextUrl.host
  ) {
    return NextResponse.next()
  }
  return NextResponse.redirect(target, match.permanent ? 308 : 307)
}

export const config = {
  matcher: [
    // Everything except Next.js internals, the Studio, API routes and metadata files.
    '/((?!_next/|studio|api/|favicon.ico|icon.png|apple-icon.png|robots.txt|sitemap.xml).*)',
  ],
}
