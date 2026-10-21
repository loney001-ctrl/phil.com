import type {Metadata} from 'next'
import {defineQuery, stegaClean} from 'next-sanity'
import type {LivePerspective} from 'next-sanity/live'

import type {Seo} from '@/sanity.types'
import {siteUrl} from '@/sanity/lib/api'
import {sanityFetchMetadata} from '@/sanity/lib/live'
import {urlForImage, urlForOpenGraphImage} from '@/sanity/lib/utils'

/**
 * Global SEO defaults from Settings → SEO. Fetched with stega off, so values are safe to put in
 * tags. Cached per perspective via `sanityFetchMetadata`.
 */
export const globalSeoQuery = defineQuery(`*[_type == "settings"][0]{
  ogImage,
  seo{
    siteName,
    titleTemplate,
    defaultDescription,
    twitterHandle,
    discourageSearchEngines,
    entity{type, name, jobTitle, image, sameAs},
    verification{google, bing, yandex, pinterest, facebook}
  }
}`)

export async function getGlobalSeo(perspective: LivePerspective = 'published') {
  const {data} = await sanityFetchMetadata({query: globalSeoQuery, perspective})
  return data
}

export type GlobalSeo = Awaited<ReturnType<typeof getGlobalSeo>>

/**
 * The SEO object as returned by a `seo` projection. Every field optional. Literal unions from the
 * generated `Seo` type are widened to `string`, so stega-typed query results are assignable.
 */
type Widen<T> = T extends string
  ? string
  : T extends Array<infer U>
    ? Array<Widen<U>>
    : T extends object
      ? {[K in keyof T]?: Widen<T[K]> | null}
      : T
export type SeoFields = Widen<Partial<Omit<Seo, '_type'>>> | null | undefined

type ImageSource = Parameters<typeof urlForImage>[0]

export interface BuildMetadataInput {
  seo: SeoFields
  /** Document title. Goes through the title template unless `seo.metaTitle` is set. */
  title?: string | null
  /** Fallback description, usually the overview or excerpt as plain text. */
  description?: string | null
  /** Fallback social image, usually the cover image. */
  image?: ImageSource
  /** Site-relative path of this document, e.g. `/blog/my-post`. Used for the default canonical. */
  path: string
  global: GlobalSeo
  openGraphType?: 'website' | 'article'
  publishedTime?: string | null
  modifiedTime?: string | null
  authors?: string[]
  /** Homepage: title is used as-is, never templated. */
  isHome?: boolean
}

/**
 * Robots defaults match RankMath: index, follow, no snippet/preview caps. `max-image-preview:large`
 * is what makes pages eligible for large images in Discover.
 */
export function buildRobots(seo: SeoFields, global: GlobalSeo): Metadata['robots'] {
  const s = clean(seo) ?? {}
  const block = !!global?.seo?.discourageSearchEngines
  const directives = {
    'index': block ? false : !s.noIndex,
    'follow': block ? false : !s.noFollow,
    'noarchive': !!s.noArchive || undefined,
    'nosnippet': !!s.noSnippet || undefined,
    'noimageindex': !!s.noImageIndex || undefined,
    'max-snippet': typeof s.maxSnippet === 'number' ? s.maxSnippet : -1,
    'max-image-preview':
      (s.maxImagePreview as 'none' | 'standard' | 'large' | undefined) ?? 'large',
    'max-video-preview': typeof s.maxVideoPreview === 'number' ? s.maxVideoPreview : -1,
  }
  return directives
}

export function buildMetadata(input: BuildMetadataInput): Metadata {
  const seo = clean(input.seo) ?? {}
  const global = input.global
  const siteName = global?.seo?.siteName || undefined

  const docTitle = stegaClean(input.title) || ''
  const metaTitle = seo.metaTitle?.trim()
  // An explicit SEO title replaces the whole <title>. Otherwise the layout template applies.
  const title: Metadata['title'] = metaTitle
    ? {absolute: metaTitle}
    : input.isHome
      ? {absolute: docTitle || siteName || ''}
      : docTitle || undefined

  const description =
    seo.metaDescription?.trim() ||
    stegaClean(input.description)?.trim() ||
    global?.seo?.defaultDescription ||
    undefined

  const resolvedTitleText =
    metaTitle ||
    (input.isHome ? docTitle || siteName : applyTemplate(global?.seo?.titleTemplate, docTitle))

  const ogImageUrl =
    urlForOpenGraphImage(seo.ogImage) ||
    urlForOpenGraphImage(input.image) ||
    urlForOpenGraphImage(global?.ogImage)
  const ogImageAlt =
    (seo.ogImage as {alt?: string} | undefined)?.alt || resolvedTitleText || undefined

  const canonical = seo.canonicalUrl?.trim() || absoluteUrl(input.path)

  const ogTitle = seo.ogTitle?.trim() || resolvedTitleText || undefined
  const ogDescription = seo.ogDescription?.trim() || description
  const handle = global?.seo?.twitterHandle?.replace(/^@/, '')

  return {
    title,
    description,
    alternates: {canonical},
    robots: buildRobots(seo, global),
    authors: input.authors?.length ? input.authors.map((name) => ({name})) : undefined,
    openGraph: {
      type: input.openGraphType ?? 'website',
      url: absoluteUrl(input.path),
      siteName,
      locale: 'en_AU',
      title: ogTitle,
      description: ogDescription,
      images: ogImageUrl
        ? [{url: ogImageUrl, width: 1200, height: 627, alt: ogImageAlt}]
        : undefined,
      ...(input.openGraphType === 'article'
        ? {
            publishedTime: input.publishedTime || undefined,
            modifiedTime: input.modifiedTime || undefined,
            authors: input.authors,
          }
        : {}),
    },
    twitter: {
      card:
        (seo.twitterCard as 'summary' | 'summary_large_image' | undefined) ?? 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
      images: ogImageUrl ? [ogImageUrl] : undefined,
      site: handle ? `@${handle}` : undefined,
      creator: handle ? `@${handle}` : undefined,
    },
  }
}

/**
 * Site-wide metadata for a layout: title template, verification tags, default robots.
 */
export function buildLayoutMetadata(global: GlobalSeo, fallbackSiteName?: string | null): Metadata {
  const siteName = global?.seo?.siteName || fallbackSiteName || undefined
  const template = global?.seo?.titleTemplate || (siteName ? `%s | ${siteName}` : undefined)
  const v = global?.seo?.verification
  const other: Record<string, string> = {}
  if (v?.bing) other['msvalidate.01'] = v.bing
  if (v?.pinterest) other['p:domain_verify'] = v.pinterest
  if (v?.facebook) other['facebook-domain-verification'] = v.facebook
  const ogImage = urlForOpenGraphImage(global?.ogImage)

  return {
    title: template && siteName ? {template, default: siteName} : siteName,
    description: global?.seo?.defaultDescription || undefined,
    robots: buildRobots(null, global),
    verification: {
      google: v?.google || undefined,
      yandex: v?.yandex || undefined,
      other: Object.keys(other).length ? other : undefined,
    },
    openGraph: {siteName, locale: 'en_AU', images: ogImage ? [ogImage] : undefined},
  }
}

export function absoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path
  const normalised = path === '/' ? '' : path.replace(/\/$/, '')
  return `${siteUrl}${normalised}`
}

function applyTemplate(template: string | null | undefined, title: string): string {
  if (!title) return ''
  return template?.includes('%s') ? template.replace('%s', title) : title
}

/** Deep stega-clean. SEO values end up in tags and must never carry invisible stega characters. */
function clean<T>(value: T): T {
  return value == null ? value : (stegaClean(value) as T)
}
