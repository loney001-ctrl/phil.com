import {CogIcon} from '@sanity/icons/Cog'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const DEFAULT_ROBOTS_TXT = `User-agent: *
Allow: /
Disallow: /studio
Disallow: /api/
`

export default defineType({
  name: 'settings',
  title: 'Settings',
  type: 'document',
  icon: CogIcon,
  groups: [
    {name: 'general', title: 'General', default: true},
    {name: 'footer', title: 'Footer'},
    {name: 'seo', title: 'SEO'},
    {name: 'robots', title: 'Robots.txt'},
    {name: 'code', title: 'Code'},
  ],
  fields: [
    // ── General ──────────────────────────────────────────────────────────────────────────────
    defineField({
      name: 'menuItems',
      title: 'Menu Item list',
      description: 'Links displayed on the header of your site.',
      type: 'array',
      group: 'general',
      of: [
        {
          title: 'Reference',
          type: 'reference',
          to: [{type: 'home'}, {type: 'page'}, {type: 'post'}, {type: 'caseStudy'}],
        },
      ],
    }),

    // ── Footer ───────────────────────────────────────────────────────────────────────────────
    defineField({
      name: 'footer',
      description: 'This is a block of text that will be displayed at the bottom of the page.',
      title: 'Footer Info',
      type: 'array',
      group: 'footer',
      of: [
        defineArrayMember({
          type: 'block',
          marks: {
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [{name: 'href', type: 'url', title: 'Url'}],
              },
            ],
          },
        }),
      ],
    }),
    defineField({
      name: 'popularSearches',
      title: 'Popular searches',
      description:
        'A toggle under the footer. Visitors click the label to reveal the links. The links are always in the HTML, so crawlers can follow them.',
      type: 'object',
      group: 'footer',
      fields: [
        defineField({
          name: 'label',
          title: 'Toggle label',
          type: 'string',
          initialValue: 'Popular Searches',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'links',
          title: 'Links',
          type: 'array',
          of: [defineArrayMember({type: 'footerLink'})],
          validation: (rule) =>
            rule
              .max(60)
              .warning('Large link blocks in footers read as low-value. Keep it focused.'),
        }),
      ],
    }),

    // ── SEO ──────────────────────────────────────────────────────────────────────────────────
    defineField({
      name: 'seo',
      title: 'Global SEO',
      type: 'object',
      group: 'seo',
      options: {collapsible: false},
      fields: [
        defineField({
          name: 'siteName',
          title: 'Site name',
          description: 'Used for og:site_name, WebSite schema, and the homepage title fallback.',
          type: 'string',
          initialValue: 'Phil Loney',
        }),
        defineField({
          name: 'titleTemplate',
          title: 'Title template',
          description:
            '%s is replaced by the page title. Ignored when a page sets its own SEO title.',
          type: 'string',
          initialValue: '%s | Phil Loney',
          validation: (rule) =>
            rule.custom((value) => (!value || value.includes('%s') ? true : 'Must contain %s')),
        }),
        defineField({
          name: 'defaultDescription',
          title: 'Default meta description',
          description: 'Used when a page has no meta description and no overview.',
          type: 'text',
          rows: 2,
          validation: (rule) => rule.max(160).warning(),
        }),
        defineField({
          name: 'twitterHandle',
          title: 'X handle',
          description: 'Without the @.',
          type: 'string',
        }),
        defineField({
          name: 'discourageSearchEngines',
          title: 'Discourage search engines (staging)',
          description:
            'Adds noindex, nofollow to every page and empties the sitemap. Same as the WordPress setting. Turn this OFF before launch.',
          type: 'boolean',
          initialValue: false,
        }),
        defineField({
          name: 'entity',
          title: 'Site entity (Knowledge Graph)',
          description:
            'Who this site represents. Output as Person or Organization schema on every page.',
          type: 'object',
          fields: [
            defineField({
              name: 'type',
              title: 'Type',
              type: 'string',
              initialValue: 'Person',
              options: {
                list: ['Person', 'Organization'],
                layout: 'radio',
                direction: 'horizontal',
              },
            }),
            defineField({name: 'name', title: 'Name', type: 'string', initialValue: 'Phil Loney'}),
            defineField({
              name: 'jobTitle',
              title: 'Job title',
              type: 'string',
              hidden: ({parent}) => parent?.type !== 'Person',
            }),
            defineField({
              name: 'image',
              title: 'Photo or logo',
              type: 'image',
            }),
            defineField({
              name: 'sameAs',
              title: 'Profiles (sameAs)',
              description: 'LinkedIn, X, GitHub and other profile URLs.',
              type: 'array',
              of: [{type: 'url'}],
            }),
          ],
        }),
        defineField({
          name: 'verification',
          title: 'Site verification',
          description: 'Paste only the content value, not the whole <meta> tag.',
          type: 'object',
          options: {collapsible: true, collapsed: true},
          fields: [
            defineField({name: 'google', title: 'Google Search Console', type: 'string'}),
            defineField({name: 'bing', title: 'Bing Webmaster Tools', type: 'string'}),
            defineField({name: 'yandex', title: 'Yandex', type: 'string'}),
            defineField({name: 'pinterest', title: 'Pinterest', type: 'string'}),
            defineField({name: 'facebook', title: 'Facebook domain verification', type: 'string'}),
          ],
        }),
      ],
    }),
    defineField({
      name: 'ogImage',
      title: 'Default social image',
      type: 'image',
      group: 'seo',
      description: 'Used when a page has no social or cover image. 1200 × 630.',
      options: {hotspot: true},
    }),

    // ── Robots.txt ───────────────────────────────────────────────────────────────────────────
    defineField({
      name: 'robotsTxt',
      title: 'robots.txt',
      description:
        'The full robots.txt file. Pages with "Disallow in robots.txt" ticked are added to every user-agent group automatically, and the Sitemap line is added if missing. Leave empty for the default.',
      type: 'text',
      rows: 14,
      group: 'robots',
      initialValue: DEFAULT_ROBOTS_TXT,
      validation: (rule) =>
        rule.custom((value) => {
          if (!value) return true
          const bad = value
            .split('\n')
            .map((line, i) => ({line: line.replace(/#.*/, '').trim(), i}))
            .filter(({line}) => line && !/^[A-Za-z-]+\s*:/.test(line))
          return bad.length
            ? `Line ${bad[0].i + 1} is not a "Field: value" directive or a # comment.`
            : true
        }),
    }),

    // ── Code ─────────────────────────────────────────────────────────────────────────────────
    defineField({
      name: 'headCode',
      title: 'Global head code',
      description:
        'Raw HTML added to <head> on every site page (never in the Studio). Allowed: <script>, <meta>, <link>, <style>, <noscript>. Server-rendered. Use for GTM, analytics, verification tags.',
      type: 'text',
      rows: 12,
      group: 'code',
    }),
    defineField({
      name: 'bodyCode',
      title: 'Global body-open code',
      description:
        'Raw HTML added straight after <body> on every site page. Use for the GTM <noscript> iframe.',
      type: 'text',
      rows: 6,
      group: 'code',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Settings', subtitle: 'Menu, footer, SEO, robots.txt and code'}
    },
  },
})
