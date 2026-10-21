import {ArrowRightIcon} from '@sanity/icons/ArrowRight'
import {defineField, defineType} from 'sanity'

/**
 * A server-side redirect, applied by `proxy.ts` before any route renders.
 * The RankMath "Redirections" equivalent. Use it when a URL changes, including when a page gets a
 * new parent (its path changes).
 */
export default defineType({
  name: 'redirect',
  title: 'Redirect',
  type: 'document',
  icon: ArrowRightIcon,
  fields: [
    defineField({
      name: 'source',
      title: 'From',
      description:
        'Path to match, e.g. /old-page. End with /* to match a whole folder: /old/* sends /old/a to the destination with :splat replaced by "a".',
      type: 'string',
      validation: (rule) =>
        rule.required().custom((value) => {
          if (!value) return true
          if (!value.startsWith('/')) return 'Must start with /'
          if (/^\/(studio|api|_next)(\/|$)/.test(value))
            return 'Studio, API and Next.js paths cannot be redirected.'
          if (value.includes('*') && !value.endsWith('/*'))
            return 'Wildcards are only allowed as a trailing /*'
          if (/\s/.test(value)) return 'No spaces.'
          return true
        }),
    }),
    defineField({
      name: 'destination',
      title: 'To',
      description: 'A path (/new-page) or a full URL. Use :splat to carry over a wildcard match.',
      type: 'string',
      validation: (rule) =>
        rule.required().custom((value, context) => {
          if (!value) return true
          if (!value.startsWith('/') && !/^https?:\/\//.test(value))
            return 'Use a path starting with / or a full URL.'
          const source = (context.document as {source?: string} | undefined)?.source
          if (source && source.replace(/\/$/, '') === value.replace(/\/$/, ''))
            return 'From and To are the same.'
          return true
        }),
    }),
    defineField({
      name: 'permanent',
      title: 'Permanent (308)',
      description: 'On: permanent (308, treated like 301). Off: temporary (307, treated like 302).',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'enabled',
      title: 'Enabled',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      source: 'source',
      destination: 'destination',
      permanent: 'permanent',
      enabled: 'enabled',
    },
    prepare({source, destination, permanent, enabled}) {
      return {
        title: `${source ?? '?'} → ${destination ?? '?'}`,
        subtitle: `${permanent === false ? '307 temporary' : '308 permanent'}${enabled === false ? ' · disabled' : ''}`,
      }
    },
  },
})
