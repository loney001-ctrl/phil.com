/**
 * Nested page URLs.
 *
 * A `page` can have a `parent` page. Its public URL is the chain of ancestor slugs plus its own
 * slug, e.g. `/services/seo/local-seo`. GROQ has no recursion, so the chain is resolved to a fixed
 * depth. `MAX_PAGE_DEPTH` is enforced by Studio validation on the `parent` field, so a page can
 * never sit deeper than the expression below can resolve.
 *
 * Keep `MAX_PAGE_DEPTH` and the number of `parent->` hops in `PAGE_PATH` in sync.
 */
export const MAX_PAGE_DEPTH = 5

/**
 * GROQ expression that evaluates to the full slug path of the current `page` document, without a
 * leading slash. Use it inside a projection or a filter where `@` is a `page` document.
 *
 * Strong references mean a page can't be published while its parent is unpublished, so the
 * published perspective never sees a broken chain.
 */
export const PAGE_PATH = `array::join(array::compact([
  parent->parent->parent->parent->slug.current,
  parent->parent->parent->slug.current,
  parent->parent->slug.current,
  parent->slug.current,
  slug.current
]), "/")`

/**
 * GROQ projection for a `page` document's ancestors, root first. Used for breadcrumbs.
 */
export const PAGE_ANCESTORS = `array::compact([
  parent->parent->parent->parent->{"title": coalesce(seo.breadcrumbTitle, title), "path": ${PAGE_PATH}},
  parent->parent->parent->{"title": coalesce(seo.breadcrumbTitle, title), "path": ${PAGE_PATH}},
  parent->parent->{"title": coalesce(seo.breadcrumbTitle, title), "path": ${PAGE_PATH}},
  parent->{"title": coalesce(seo.breadcrumbTitle, title), "path": ${PAGE_PATH}}
])`

/**
 * Paths that a root-level page slug must never take, because a route or file already owns them.
 */
export const RESERVED_ROOT_SLUGS = [
  'api',
  'blog',
  'case-studies',
  'studio',
  'robots.txt',
  'sitemap.xml',
  '_next',
] as const
