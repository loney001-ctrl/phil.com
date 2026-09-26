import type {MetadataRoute} from 'next'
import {defineQuery} from 'next-sanity'

import {siteUrl} from '@/sanity/lib/api'
import {client} from '@/sanity/lib/client'
import {resolveHref} from '@/sanity/lib/utils'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const query = defineQuery(`{
    "pages": *[_type == "page" && defined(slug.current)]{"slug": slug.current, _updatedAt},
    "projects": *[_type == "project" && defined(slug.current)]{"slug": slug.current, _updatedAt},
    "posts": *[_type == "post" && defined(slug.current) && !noIndex]{"slug": slug.current, _updatedAt, publishedAt},
  }`)
  const {pages, projects, posts} = await client.fetch(query)

  const entries: MetadataRoute.Sitemap = [
    {url: siteUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1},
    {
      url: `${siteUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ]

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

  for (const project of projects || []) {
    const href = resolveHref('project', project.slug)
    if (!href) continue
    entries.push({
      url: `${siteUrl}${href}`,
      lastModified: project._updatedAt,
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
