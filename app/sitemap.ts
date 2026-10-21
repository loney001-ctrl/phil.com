import type {MetadataRoute} from 'next'
import {defineQuery} from 'next-sanity'

import {siteUrl} from '@/sanity/lib/api'
import {client} from '@/sanity/lib/client'
import {PAGE_PATH} from '@/sanity/lib/pagePath'
import {resolveHref} from '@/sanity/lib/utils'

/** Indexable = not noindex, not excluded from the sitemap, no canonical pointing elsewhere. */
const INDEXABLE = `seo.noIndex != true && seo.excludeFromSitemap != true && !defined(seo.canonicalUrl)`

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const query = defineQuery(`{
    "discourage": *[_type == "settings"][0].seo.discourageSearchEngines == true,
    "home": *[_type == "home"][0]{_updatedAt, "hidden": seo.noIndex == true},
    "pages": *[_type == "page" && defined(slug.current) && ${INDEXABLE}]{"slug": ${PAGE_PATH}, _updatedAt},
    "caseStudies": *[_type == "caseStudy" && defined(slug.current) && ${INDEXABLE}]{"slug": slug.current, _updatedAt},
    "posts": *[_type == "post" && defined(slug.current) && ${INDEXABLE}]{"slug": slug.current, _updatedAt, publishedAt},
  }`)
  const {discourage, home, pages, caseStudies, posts} = await client.fetch(query)

  // Staging switch: Settings → SEO → Discourage search engines.
  if (discourage) return []

  const entries: MetadataRoute.Sitemap = []
  if (!home?.hidden) {
    entries.push({
      url: siteUrl,
      lastModified: home?._updatedAt ?? new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    })
  }
  entries.push({
    url: `${siteUrl}/blog`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  })

  for (const page of pages || []) {
    const href = resolveHref('page', page.slug)
    if (!href) continue
    entries.push({
      url: `${siteUrl}${href}`,
      lastModified: page._updatedAt,
      changeFrequency: 'monthly',
      priority: 0.6,
    })
  }

  for (const caseStudy of caseStudies || []) {
    const href = resolveHref('caseStudy', caseStudy.slug)
    if (!href) continue
    entries.push({
      url: `${siteUrl}${href}`,
      lastModified: caseStudy._updatedAt,
      changeFrequency: 'monthly',
      priority: 0.7,
    })
  }

  for (const post of posts || []) {
    const href = resolveHref('post', post.slug)
    if (!href) continue
    entries.push({
      url: `${siteUrl}${href}`,
      lastModified: post._updatedAt || post.publishedAt || undefined,
      changeFrequency: 'monthly',
      priority: 0.7,
    })
  }

  return entries
}
