import {DocumentIcon} from '@sanity/icons/Document'
import {ImageIcon} from '@sanity/icons/Image'
import {
  defineArrayMember,
  defineField,
  defineType,
  type SanityClient,
  type SlugValidationContext,
} from 'sanity'

import {MAX_PAGE_DEPTH, RESERVED_ROOT_SLUGS} from '@/sanity/lib/pagePath'

const API_VERSION = '2025-02-27'

/** Strips the `drafts.` / `versions.<id>.` prefix to get the published ID. */
function publishedId(id: string | undefined): string | undefined {
  if (!id) return id
  return id.replace(/^drafts\./, '').replace(/^versions\.[^.]+\./, '')
}

/**
 * Walks up the parent chain from `startRef`. Returns the ancestor IDs (nearest first), and flags a
 * cycle if `selfId` shows up. Reads drafts so unpublished edits are checked too.
 */
async function walkAncestors(
  client: SanityClient,
  startRef: string,
  selfId: string,
): Promise<{ids: string[]; cycle: boolean}> {
  const ids: string[] = []
  let current: string | undefined = startRef
  // Hard stop well past MAX_PAGE_DEPTH so a corrupted chain can't loop forever.
  for (let i = 0; current && i < MAX_PAGE_DEPTH + 5; i++) {
    if (current === selfId) return {ids, cycle: true}
    ids.push(current)
    const next: string | null = await client.fetch(
      `*[_id in [$id, "drafts." + $id]] | order(_updatedAt desc)[0].parent._ref`,
      {id: current},
    )
    current = next ?? undefined
  }
  return {ids, cycle: false}
}

export default defineType({
  type: 'document',
  name: 'page',
  title: 'Page',
  icon: DocumentIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      type: 'string',
      name: 'title',
      title: 'Title',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'parent',
      title: 'Parent page',
      description: `Nests this page under another page. The URL becomes /parent-slug/this-slug. Max depth: ${MAX_PAGE_DEPTH} levels. Changing the parent changes the URL — add a redirect from the old one.`,
      type: 'reference',
      to: [{type: 'page'}],
      group: 'content',
      options: {
        disableNew: true,
        filter: ({document}) => {
          const id = publishedId(document._id)
          return {
            filter: '!(_id in [$id, "drafts." + $id]) && !(_id in path("versions.**"))',
            params: {id},
          }
        },
      },
      validation: (rule) =>
        rule.custom(async (value, context) => {
          const ref = (value as {_ref?: string} | undefined)?._ref
          if (!ref) return true
          const selfId = publishedId(context.document?._id)
          if (!selfId) return true
          if (ref === selfId) return 'A page cannot be its own parent.'

          const client = context.getClient({apiVersion: API_VERSION})
          const {ids, cycle} = await walkAncestors(client, ref, selfId)
          if (cycle) return 'This parent is a child of this page. Pick a page outside its own tree.'

          // Depth of this page = ancestors + 1. Then add the deepest descendant chain below it.
          const descendantDepth: number = await client.fetch(
            `coalesce(math::max([
              select(count(*[_type == "page" && parent._ref == $id]) > 0 => 1, 0),
              select(count(*[_type == "page" && parent->parent._ref == $id]) > 0 => 2, 0),
              select(count(*[_type == "page" && parent->parent->parent._ref == $id]) > 0 => 3, 0),
              select(count(*[_type == "page" && parent->parent->parent->parent._ref == $id]) > 0 => 4, 0)
            ]), 0)`,
            {id: selfId},
          )
          const total = ids.length + 1 + descendantDepth
          if (total > MAX_PAGE_DEPTH) {
            return `This would nest pages ${total} levels deep. The limit is ${MAX_PAGE_DEPTH}.`
          }
          return true
        }),
    }),
    defineField({
      type: 'slug',
      name: 'slug',
      title: 'Slug',
      description: 'The last part of the URL. Must be unique among pages with the same parent.',
      group: 'content',
      options: {
        source: 'title',
        maxLength: 96,
        isUnique: async (slug: string, context: SlugValidationContext) => {
          const {document, getClient} = context
          const id = publishedId(document?._id)
          const parentRef =
            (document as {parent?: {_ref?: string}} | undefined)?.parent?._ref ?? null
          const client = getClient({apiVersion: API_VERSION})
          const clash: number = await client.fetch(
            `count(*[
              _type == "page" &&
              slug.current == $slug &&
              !(_id in [$id, "drafts." + $id]) &&
              !(_id in path("versions.**")) &&
              select(defined($parent) => parent._ref == $parent, !defined(parent))
            ])`,
            {slug, id, parent: parentRef},
          )
          return clash === 0
        },
      },
      validation: (rule) =>
        rule.required().custom((value, context) => {
          const current = value?.current
          if (!current) return true
          if (current.includes('/')) return 'Use the Parent page field for nesting, not slashes.'
          const hasParent = !!(context.document as {parent?: {_ref?: string}} | undefined)?.parent
            ?._ref
          if (!hasParent && (RESERVED_ROOT_SLUGS as readonly string[]).includes(current)) {
            return `"/${current}" is used by another part of the site.`
          }
          return true
        }),
    }),
    defineField({
      name: 'overview',
      description:
        'Used both for the <meta> description tag for SEO, and the personal website subheader.',
      title: 'Overview',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          lists: [],
          marks: {
            annotations: [],
            decorators: [
              {title: 'Italic', value: 'em'},
              {title: 'Strong', value: 'strong'},
            ],
          },
          styles: [],
          type: 'block',
        }),
      ],
      validation: (rule) => rule.max(155).required(),
    }),
    defineField({
      type: 'array',
      name: 'body',
      title: 'Body',
      group: 'content',
      description:
        "This is where you can write the page's content. Including custom blocks like timelines for more a more visual display of information.",
      of: [
        defineArrayMember({
          type: 'block',
          marks: {
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'Url',
                    validation: (r) =>
                      r.uri({allowRelative: true, scheme: ['http', 'https', 'mailto', 'tel']}),
                  },
                ],
              },
            ],
          },
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'H2', value: 'h2'},
            {title: 'H3', value: 'h3'},
            {title: 'H4', value: 'h4'},
          ],
        }),
        defineArrayMember({name: 'timeline', type: 'timeline'}),
        defineField({
          type: 'image',
          icon: ImageIcon,
          name: 'image',
          title: 'Image',
          options: {hotspot: true},
          preview: {select: {media: 'asset', title: 'caption'}},
          fields: [
            defineField({title: 'Caption', name: 'caption', type: 'string'}),
            defineField({
              name: 'alt',
              type: 'string',
              title: 'Alt text',
              description: 'Alternative text for screenreaders. Falls back on caption if not set',
            }),
          ],
        }),
      ],
    }),
    defineField({name: 'seo', title: 'SEO', type: 'seo', group: 'seo'}),
  ],
  preview: {
    select: {
      title: 'title',
      slug: 'slug.current',
      p1: 'parent.slug.current',
      p2: 'parent.parent.slug.current',
    },
    prepare({title, slug, p1, p2}) {
      const segments = [p2 ? '…' : undefined, p1, slug].filter(Boolean)
      return {title, subtitle: segments.length ? `/${segments.join('/')}` : 'Page'}
    },
  },
})
