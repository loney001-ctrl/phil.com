import type {MetadataRoute} from 'next'

import {siteUrl} from '@/sanity/lib/api'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/studio', '/studio/', '/api/'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
