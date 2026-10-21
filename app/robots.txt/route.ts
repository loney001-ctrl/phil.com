import {defineQuery} from 'next-sanity'

import {siteUrl} from '@/sanity/lib/api'
import {sanityFetchMetadata} from '@/sanity/lib/live'
import {PAGE_PATH} from '@/sanity/lib/pagePath'
import {buildRobotsTxt} from '@/sanity/lib/robotsTxt'

const robotsQuery = defineQuery(`{
  "base": *[_type == "settings"][0].robotsTxt,
  "disallow": *[
    _type in ["page", "post", "caseStudy"] &&
    defined(slug.current) &&
    seo.disallowInRobotsTxt == true
  ]{
    _type,
    "path": select(_type == "page" => ${PAGE_PATH}, slug.current)
  }
}`)

const PREFIX: Record<string, string> = {page: '/', post: '/blog/', caseStudy: '/case-studies/'}

/**
 * Replaces the old app/robots.ts. A route handler is used because the file is edited as raw text
 * in Settings → Robots.txt, which the structured MetadataRoute.Robots type cannot express.
 */
async function getRobotsTxt() {
  'use cache'
  const {data} = await sanityFetchMetadata({query: robotsQuery, perspective: 'published'})
  return buildRobotsTxt({
    base: data?.base,
    disallowPaths: (data?.disallow ?? [])
      .filter((d) => d.path)
      .map((d) => `${PREFIX[d._type] ?? '/'}${d.path}`),
    sitemapUrl: `${siteUrl}/sitemap.xml`,
  })
}

export async function GET() {
  const body = await getRobotsTxt()
  return new Response(body, {
    headers: {'Content-Type': 'text/plain; charset=utf-8'},
  })
}
