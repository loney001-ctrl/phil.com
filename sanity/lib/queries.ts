import {defineQuery} from 'next-sanity'

import type {AllSanitySchemaTypes, Slug} from '@/sanity.types'
import {PAGE_ANCESTORS, PAGE_PATH} from '@/sanity/lib/pagePath'

/**
 * `slug` here is the full URL path for pages (`parent/child`) and the plain slug for everything
 * else, so `resolveHref(_type, slug)` always produces the right URL.
 */
export const settingsQuery = defineQuery(`
  *[_type == "settings"][0]{
    _id,
    _type,
    footer,
    menuItems[]{
      _key,
      ...@->{
        _type,
        "slug": select(_type == "page" => ${PAGE_PATH}, slug.current),
        title
      }
    },
    popularSearches{
      label,
      links[]{
        _key,
        label,
        "external": linkType == "external",
        url,
        newTab,
        "internal": internal->{
          _type,
          title,
          "slug": select(_type == "page" => ${PAGE_PATH}, slug.current)
        }
      }
    },
    ogImage,
  }
`)

/** Global head and body code. Published only: code never comes from drafts. */
export const siteCodeQuery = defineQuery(`
  *[_type == "settings"][0]{headCode, bodyCode}
`)

export const slugsByTypeQuery = defineQuery(`
  *[_type == $type && defined(slug.current)]{"slug": slug.current}
`)
// Infer valid `type` params from all TypeGen schema types that has a top-level `slug` field
export type SlugsByTypeQueryParams = {
  type: AllSanitySchemaTypes extends infer SchemaType
    ? SchemaType extends unknown
      ? 'slug' extends keyof SchemaType
        ? SchemaType extends {_type: infer Type extends string; slug?: Slug}
          ? Type
          : never
        : never
      : never
    : never
}

/** Every page's full path, split into segments for `[...slug]` static params. */
export const pagePathsQuery = defineQuery(`
  *[_type == "page" && defined(slug.current)]{"slug": string::split(${PAGE_PATH}, "/")}
`)

/** Finds a page by its full path. `$last` narrows the scan to one slug before the path check. */
export const pageByPathQuery = defineQuery(`
  *[_type == "page" && slug.current == $last && ${PAGE_PATH} == $path][0]{
    _id,
    _type,
    _updatedAt,
    body,
    overview,
    title,
    "path": ${PAGE_PATH},
    "ancestors": ${PAGE_ANCESTORS},
    seo,
  }
`)

export const pageMetadataByPathQuery = defineQuery(`
  *[_type == "page" && slug.current == $last && ${PAGE_PATH} == $path][0]{
    title,
    "overview": pt::text(overview),
    "path": ${PAGE_PATH},
    seo,
  }
`)
