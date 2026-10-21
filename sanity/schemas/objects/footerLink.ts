import {LinkIcon} from '@sanity/icons/Link'
import {defineField, defineType} from 'sanity'

/**
 * A footer link that points either at a document on this site or at any URL.
 * Used by Settings → Footer → Popular searches.
 */
export default defineType({
  name: 'footerLink',
  title: 'Link',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      description: 'Link text. Leave empty to use the linked document title.',
      type: 'string',
      validation: (rule) =>
        rule.custom((label, context) => {
          const parent = context.parent as {linkType?: string} | undefined
          if (!label && parent?.linkType === 'external') return 'External links need a label.'
          return true
        }),
    }),
    defineField({
      name: 'linkType',
      title: 'Link type',
      type: 'string',
      initialValue: 'internal',
      options: {
        list: [
          {title: 'Page on this site', value: 'internal'},
          {title: 'URL or path', value: 'external'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'internal',
      title: 'Document',
      type: 'reference',
      to: [{type: 'page'}, {type: 'post'}, {type: 'caseStudy'}, {type: 'home'}],
      hidden: ({parent}) => parent?.linkType !== 'internal',
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as {linkType?: string} | undefined
          if (parent?.linkType === 'internal' && !value) return 'Pick a document.'
          return true
        }),
    }),
    defineField({
      name: 'url',
      title: 'URL or path',
      description: 'A full URL (https://…) or a site path (/search?q=…).',
      type: 'url',
      hidden: ({parent}) => parent?.linkType !== 'external',
      validation: (rule) =>
        rule
          .uri({scheme: ['http', 'https', 'mailto', 'tel'], allowRelative: true})
          .custom((value, context) => {
            const parent = context.parent as {linkType?: string} | undefined
            if (parent?.linkType === 'external' && !value) return 'Add a URL or path.'
            return true
          }),
    }),
    defineField({
      name: 'newTab',
      title: 'Open in a new tab',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      label: 'label',
      linkType: 'linkType',
      url: 'url',
      refTitle: 'internal.title',
      refSlug: 'internal.slug.current',
    },
    prepare({label, linkType, url, refTitle, refSlug}) {
      return {
        title: label || refTitle || url || 'Untitled link',
        subtitle: linkType === 'external' ? url : refSlug ? `/${refSlug}` : 'Internal',
      }
    },
  },
})
