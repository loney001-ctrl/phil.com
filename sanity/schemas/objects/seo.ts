import {SearchIcon} from '@sanity/icons/Search'
import {defineField, defineType} from 'sanity'

import {SeoInput} from '@/sanity/components/SeoInput'

/**
 * Per-document SEO controls: the RankMath "meta box" equivalent.
 *
 * Added to `home`, `page`, `post` and `caseStudy`. Every field is optional. The frontend falls back
 * to the document's own title, overview and image, then to the global defaults in Settings → SEO.
 * See `sanity/lib/seo.ts` for how each field maps to a tag.
 */
export const SCHEMA_TYPES = [
  {title: 'Web page (default for pages)', value: 'WebPage'},
  {title: 'About page', value: 'AboutPage'},
  {title: 'Contact page', value: 'ContactPage'},
  {title: 'Collection page (index or hub)', value: 'CollectionPage'},
  {title: 'Profile page', value: 'ProfilePage'},
  {title: 'FAQ page', value: 'FAQPage'},
  {title: 'Article (default for case studies)', value: 'Article'},
  {title: 'Blog posting (default for posts)', value: 'BlogPosting'},
  {title: 'None — output no page-level schema', value: 'none'},
] as const

export default defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  icon: SearchIcon,
  components: {input: SeoInput},
  fieldsets: [
    {name: 'search', title: 'Search appearance', options: {collapsible: true, collapsed: false}},
    {
      name: 'indexing',
      title: 'Indexing and crawling',
      options: {collapsible: true, collapsed: true},
    },
    {name: 'social', title: 'Social sharing', options: {collapsible: true, collapsed: true}},
    {
      name: 'schema',
      title: 'Schema and breadcrumbs',
      options: {collapsible: true, collapsed: true},
    },
    {name: 'advanced', title: 'Head code', options: {collapsible: true, collapsed: true}},
  ],
  fields: [
    // ── Search appearance ────────────────────────────────────────────────────────────────────
    defineField({
      name: 'focusKeyword',
      title: 'Focus keyword',
      description: 'The main query this page targets. Drives the analysis checks above.',
      type: 'string',
      fieldset: 'search',
    }),
    defineField({
      name: 'secondaryKeywords',
      title: 'Secondary keywords',
      description: 'Supporting queries. The analysis checks that each one appears in the content.',
      type: 'array',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
      fieldset: 'search',
    }),
    defineField({
      name: 'metaTitle',
      title: 'SEO title',
      description:
        'Replaces the full <title>. The site title template is not added. Leave empty to use "Page title + template".',
      type: 'string',
      fieldset: 'search',
      validation: (rule) =>
        rule.max(65).warning('Google usually truncates titles longer than about 60 characters.'),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta description',
      description: 'Leave empty to use the overview or excerpt.',
      type: 'text',
      rows: 3,
      fieldset: 'search',
      validation: (rule) => [
        rule
          .max(160)
          .warning('Google usually truncates descriptions longer than about 160 characters.'),
        rule.min(70).warning('Descriptions under 70 characters waste SERP space.'),
      ],
    }),

    // ── Indexing and crawling ────────────────────────────────────────────────────────────────
    defineField({
      name: 'canonicalUrl',
      title: 'Canonical URL',
      description:
        'Leave empty for a self-referencing canonical. Only set this for syndicated or duplicate content.',
      type: 'url',
      fieldset: 'indexing',
      validation: (rule) => rule.uri({scheme: ['https', 'http']}),
    }),
    defineField({
      name: 'noIndex',
      title: 'No index',
      description: 'Adds "noindex" to the robots meta tag and removes the page from the sitemap.',
      type: 'boolean',
      initialValue: false,
      fieldset: 'indexing',
      validation: (rule) =>
        rule
          .custom((noIndex, context) => {
            const parent = context.parent as {canonicalUrl?: string} | undefined
            if (noIndex && parent?.canonicalUrl) {
              return 'noindex plus a canonical sends Google conflicting signals. Pick one.'
            }
            return true
          })
          .warning(),
    }),
    defineField({
      name: 'noFollow',
      title: 'No follow',
      description: 'Tells crawlers not to follow links on this page.',
      type: 'boolean',
      initialValue: false,
      fieldset: 'indexing',
    }),
    defineField({
      name: 'noArchive',
      title: 'No archive',
      description: 'Stops search engines from showing a cached copy.',
      type: 'boolean',
      initialValue: false,
      fieldset: 'indexing',
    }),
    defineField({
      name: 'noSnippet',
      title: 'No snippet',
      description: 'Stops text snippets and AI Overview excerpts from this page.',
      type: 'boolean',
      initialValue: false,
      fieldset: 'indexing',
    }),
    defineField({
      name: 'noImageIndex',
      title: 'No image index',
      description: 'Stops images on this page from appearing in image search.',
      type: 'boolean',
      initialValue: false,
      fieldset: 'indexing',
    }),
    defineField({
      name: 'maxSnippet',
      title: 'Max snippet length',
      description: 'Characters. -1 = no limit, 0 = no snippet. Leave empty for the default.',
      type: 'number',
      fieldset: 'indexing',
      validation: (rule) => rule.integer().min(-1),
    }),
    defineField({
      name: 'maxImagePreview',
      title: 'Max image preview',
      description: 'Leave empty for the default. "large" is needed for Discover eligibility.',
      type: 'string',
      options: {
        list: [
          {title: 'None', value: 'none'},
          {title: 'Standard', value: 'standard'},
          {title: 'Large', value: 'large'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      fieldset: 'indexing',
    }),
    defineField({
      name: 'maxVideoPreview',
      title: 'Max video preview',
      description: 'Seconds. -1 = no limit, 0 = static image only. Leave empty for the default.',
      type: 'number',
      fieldset: 'indexing',
      validation: (rule) => rule.integer().min(-1),
    }),
    defineField({
      name: 'excludeFromSitemap',
      title: 'Exclude from sitemap',
      description:
        'Keeps an indexable page out of sitemap.xml. No-index pages are always excluded.',
      type: 'boolean',
      initialValue: false,
      fieldset: 'indexing',
    }),
    defineField({
      name: 'disallowInRobotsTxt',
      title: 'Disallow in robots.txt',
      description:
        'Adds "Disallow: /this-path" to every user-agent group in robots.txt. This blocks crawling, not indexing.',
      type: 'boolean',
      initialValue: false,
      fieldset: 'indexing',
      validation: (rule) =>
        rule
          .custom((disallow, context) => {
            const parent = context.parent as {noIndex?: boolean} | undefined
            if (disallow && parent?.noIndex) {
              return 'Google cannot crawl a disallowed page, so it never sees the noindex tag. The URL can still be indexed from links. To de-index, use noindex alone.'
            }
            return true
          })
          .warning(),
    }),

    // ── Social ───────────────────────────────────────────────────────────────────────────────
    defineField({
      name: 'ogTitle',
      title: 'Social title',
      description: 'Open Graph and X title. Leave empty to use the SEO title.',
      type: 'string',
      fieldset: 'social',
    }),
    defineField({
      name: 'ogDescription',
      title: 'Social description',
      description: 'Leave empty to use the meta description.',
      type: 'text',
      rows: 2,
      fieldset: 'social',
    }),
    defineField({
      name: 'ogImage',
      title: 'Social image',
      description: '1200 × 630. Leave empty to use the cover image, then the site default.',
      type: 'image',
      options: {hotspot: true},
      fieldset: 'social',
      fields: [defineField({name: 'alt', type: 'string', title: 'Alt text'})],
    }),
    defineField({
      name: 'twitterCard',
      title: 'X card type',
      type: 'string',
      options: {
        list: [
          {title: 'Summary with large image', value: 'summary_large_image'},
          {title: 'Summary', value: 'summary'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      fieldset: 'social',
    }),

    // ── Schema ───────────────────────────────────────────────────────────────────────────────
    defineField({
      name: 'schemaType',
      title: 'Schema type',
      description:
        'The page-level JSON-LD @type. Leave empty for the default for this document type. Breadcrumb schema is always added.',
      type: 'string',
      options: {list: [...SCHEMA_TYPES]},
      fieldset: 'schema',
    }),
    defineField({
      name: 'faqs',
      title: 'FAQ items',
      description:
        'Only used when the schema type is "FAQ page". Must match Q&As visible on the page.',
      type: 'array',
      fieldset: 'schema',
      hidden: ({parent}) => (parent as {schemaType?: string} | undefined)?.schemaType !== 'FAQPage',
      of: [
        {
          type: 'object',
          name: 'faq',
          fields: [
            defineField({name: 'question', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'answer', type: 'text', rows: 3, validation: (r) => r.required()}),
          ],
          preview: {select: {title: 'question', subtitle: 'answer'}},
        },
      ],
    }),
    defineField({
      name: 'breadcrumbTitle',
      title: 'Breadcrumb title',
      description: 'Shorter label for breadcrumbs. Leave empty to use the page title.',
      type: 'string',
      fieldset: 'schema',
    }),

    // ── Head code ────────────────────────────────────────────────────────────────────────────
    defineField({
      name: 'headCode',
      title: 'Page head code',
      description:
        'Raw HTML for this page only, added after the global head code. Allowed tags: <script>, <meta>, <link>, <style>, <noscript>. <meta>, <link> and JSON-LD are server-rendered. Executable <script> tags are added to <head> in the browser on every visit, including client-side navigation.',
      type: 'text',
      rows: 8,
      fieldset: 'advanced',
    }),
  ],
})
