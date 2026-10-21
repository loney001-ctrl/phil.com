/**
 * Sets up the Presentation Resolver API,
 * see https://www.sanity.io/docs/presentation-resolver-api for more information.
 */

import {defineDocuments, defineLocations} from 'sanity/presentation'

import {resolveHref} from '@/sanity/lib/utils'

export const mainDocuments = defineDocuments([
  {
    route: '/case-studies/:slug',
    filter: `_type == "caseStudy" && slug.current == $slug`,
  },
  {
    route: '/blog/:slug',
    filter: `_type == "post" && slug.current == $slug`,
  },
  // Nested pages: the last segment is the page's own slug. Up to MAX_PAGE_DEPTH (5) levels.
  {route: '/:slug', filter: `_type == "page" && slug.current == $slug`},
  {
    route: '/:p1/:slug',
    filter: `_type == "page" && slug.current == $slug && parent->slug.current == $p1`,
  },
  {
    route: '/:p1/:p2/:slug',
    filter: `_type == "page" && slug.current == $slug && parent->slug.current == $p2 && parent->parent->slug.current == $p1`,
  },
  {
    route: '/:p1/:p2/:p3/:slug',
    filter: `_type == "page" && slug.current == $slug && parent->slug.current == $p3 && parent->parent->slug.current == $p2`,
  },
  {
    route: '/:p1/:p2/:p3/:p4/:slug',
    filter: `_type == "page" && slug.current == $slug && parent->slug.current == $p4 && parent->parent->slug.current == $p3`,
  },
])

export const locations = {
  settings: defineLocations({
    message: 'This document is used on all pages',
    tone: 'caution',
  }),
  home: defineLocations({
    message: 'This document is used to render the front page',
    tone: 'positive',
    locations: [{title: 'Home', href: resolveHref('home')!}],
  }),
  caseStudy: defineLocations({
    select: {title: 'title', slug: 'slug.current'},
    resolve: (doc) => ({
      locations: [
        {
          title: doc?.title || 'Untitled',
          href: resolveHref('caseStudy', doc?.slug)!,
        },
      ],
    }),
  }),
  page: defineLocations({
    select: {
      title: 'title',
      slug: 'slug.current',
      p1: 'parent.slug.current',
      p2: 'parent.parent.slug.current',
      p3: 'parent.parent.parent.slug.current',
      p4: 'parent.parent.parent.parent.slug.current',
    },
    resolve: (doc) => {
      const path = [doc?.p4, doc?.p3, doc?.p2, doc?.p1, doc?.slug].filter(Boolean).join('/')
      return {
        locations: [{title: doc?.title || 'Untitled', href: resolveHref('page', path)!}],
      }
    },
  }),
  post: defineLocations({
    select: {title: 'title', slug: 'slug.current'},
    resolve: (doc) => ({
      locations: [
        {
          title: doc?.title || 'Untitled',
          href: resolveHref('post', doc?.slug)!,
        },
      ],
    }),
  }),
}
