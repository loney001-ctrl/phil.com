import {stegaClean} from 'next-sanity'

import {siteUrl} from '@/sanity/lib/api'
import type {GlobalSeo, SeoFields} from '@/sanity/lib/seo'
import {absoluteUrl} from '@/sanity/lib/seo'
import {urlForImage} from '@/sanity/lib/utils'

export type JsonLdNode = Record<string, unknown>

export interface Crumb {
  name: string
  path: string
}

export const ENTITY_ID = `${siteUrl}/#entity`
export const WEBSITE_ID = `${siteUrl}/#website`

/** Person or Organization node for the site owner, from Settings → SEO → Site entity. */
export function entityNode(global: GlobalSeo): JsonLdNode | null {
  const e = global?.seo?.entity
  const name = e?.name || global?.seo?.siteName
  if (!name) return null
  const type = e?.type === 'Organization' ? 'Organization' : 'Person'
  const image = e?.image
    ? urlForImage(e.image)?.width(512).height(512).fit('crop').url()
    : undefined
  return compact({
    '@type': type,
    '@id': ENTITY_ID,
    name,
    'url': siteUrl,
    'jobTitle': type === 'Person' ? e?.jobTitle || undefined : undefined,
    'image': type === 'Person' ? image : undefined,
    'logo': type === 'Organization' ? image : undefined,
    'sameAs': e?.sameAs?.filter(Boolean).length ? e.sameAs.filter(Boolean) : undefined,
  })
}

export function websiteNode(global: GlobalSeo, fallbackName?: string | null): JsonLdNode | null {
  const name = global?.seo?.siteName || fallbackName
  if (!name) return null
  const entity = entityNode(global)
  return compact({
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name,
    'url': siteUrl,
    'inLanguage': 'en-AU',
    'publisher': entity ? {'@id': ENTITY_ID} : undefined,
  })
}

/** BreadcrumbList. `crumbs` excludes Home; it is always added first. */
export function breadcrumbNode(crumbs: Crumb[], currentPath: string): JsonLdNode {
  const items = [{name: 'Home', path: '/'}, ...crumbs]
  return {
    '@type': 'BreadcrumbList',
    '@id': `${absoluteUrl(currentPath)}#breadcrumb`,
    'itemListElement': items.map((crumb, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': stegaClean(crumb.name),
      'item': absoluteUrl(crumb.path),
    })),
  }
}

export interface PageNodeInput {
  seo: SeoFields
  defaultType: string
  path: string
  title: string
  description?: string | null
  image?: string
  datePublished?: string | null
  dateModified?: string | null
  authorName?: string | null
  hasBreadcrumb: boolean
}

/**
 * The page-level node. Its `@type` comes from `seo.schemaType`, else `defaultType`. Returns null
 * when the editor picked "none".
 */
export function pageNode(input: PageNodeInput): JsonLdNode[] {
  const seo = stegaClean(input.seo) ?? {}
  const type = seo.schemaType || input.defaultType
  if (type === 'none') return []
  const url = absoluteUrl(input.path)
  const isArticle = type === 'Article' || type === 'BlogPosting'
  const title = stegaClean(input.title)
  const description = stegaClean(input.description) || undefined

  const webPage = compact({
    '@type': isArticle ? 'WebPage' : type,
    '@id': `${url}#webpage`,
    url,
    'name': title,
    description,
    'isPartOf': {'@id': WEBSITE_ID},
    'inLanguage': 'en-AU',
    'primaryImageOfPage': input.image ? {'@type': 'ImageObject', 'url': input.image} : undefined,
    'breadcrumb': input.hasBreadcrumb ? {'@id': `${url}#breadcrumb`} : undefined,
    'datePublished': input.datePublished || undefined,
    'dateModified': input.dateModified || undefined,
    'mainEntity':
      type === 'FAQPage' && seo.faqs?.length
        ? seo.faqs
            .filter((f) => f?.question && f?.answer)
            .map((f) => ({
              '@type': 'Question',
              'name': f.question,
              'acceptedAnswer': {'@type': 'Answer', 'text': f.answer},
            }))
        : undefined,
  })

  if (!isArticle) return [webPage]

  const article = compact({
    '@type': type,
    '@id': `${url}#article`,
    'headline': title,
    description,
    'image': input.image ? [input.image] : undefined,
    'datePublished': input.datePublished || undefined,
    'dateModified': input.dateModified || input.datePublished || undefined,
    'mainEntityOfPage': {'@id': `${url}#webpage`},
    'author': input.authorName
      ? {'@type': 'Person', 'name': stegaClean(input.authorName)}
      : {'@id': ENTITY_ID},
    'publisher': {'@id': ENTITY_ID},
    'keywords': seo.focusKeyword || undefined,
  })
  return [webPage, article]
}

export function graph(nodes: (JsonLdNode | null | undefined)[]): JsonLdNode {
  return {'@context': 'https://schema.org', '@graph': nodes.filter(Boolean)}
}

function compact(obj: JsonLdNode): JsonLdNode {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined && v !== null && v !== ''),
  )
}
