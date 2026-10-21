import {stegaClean} from 'next-sanity'

import {PopularSearchesToggle, type PopularSearchLink} from '@/components/PopularSearchesToggle'
import {resolveHref} from '@/sanity/lib/utils'

/** Shape of `settingsQuery.popularSearches`. Loose string types so stega-typed results fit. */
interface PopularSearchesData {
  label?: string | null
  links?: Array<{
    _key: string
    label?: string | null
    external?: boolean | null
    url?: string | null
    newTab?: boolean | null
    internal?: {_type: string; title?: string | null; slug?: string | null} | null
  } | null> | null
}

/**
 * Resolves Settings → Footer → Popular searches into hrefs and renders the toggle.
 * Renders nothing when there are no usable links.
 */
export function PopularSearches({
  data,
  variant,
}: {
  data: PopularSearchesData | null | undefined
  variant?: 'site' | 'home'
}) {
  const links: PopularSearchLink[] = []
  for (const item of data?.links ?? []) {
    if (!item) continue
    if (item.external) {
      const href = stegaClean(item.url)
      if (!href) continue
      links.push({
        key: item._key,
        label: stegaClean(item.label) || href,
        href,
        external: /^(https?:|mailto:|tel:)/.test(href),
        newTab: !!item.newTab,
      })
    } else {
      const ref = item.internal
      const href = ref ? resolveHref(ref._type, stegaClean(ref.slug)) : undefined
      if (!href) continue
      links.push({
        key: item._key,
        label: stegaClean(item.label) || stegaClean(ref?.title) || href,
        href,
        external: false,
        newTab: !!item.newTab,
      })
    }
  }

  if (!links.length) return null
  return (
    <PopularSearchesToggle
      label={stegaClean(data?.label) || 'Popular Searches'}
      links={links}
      variant={variant}
    />
  )
}
