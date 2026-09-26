import {DocumentIcon} from '@sanity/icons/Document'
import {ImageIcon} from '@sanity/icons/Image'
import {defineArrayMember, defineField, defineType} from 'sanity'

export default defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{type: 'author'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'category'}]}],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'mainImage',
      title: 'Cover image',
      description:
        'Used as the post header image and social share image unless an OG image is set below.',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alt text',
          description: 'Important for accessibility and image SEO.',
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'overview',
      title: 'Excerpt',
      description:
        'Used for the <meta> description tag, the post card summary, and social previews. Aim for a complete sentence under 155 characters.',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.max(155).required(),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
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
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'H2', value: 'h2'},
            {title: 'H3', value: 'h3'},
            {title: 'H4', value: 'h4'},
            {title: 'Quote', value: 'blockquote'},
          ],
        }),
        defineField({
          type: 'image',
          icon: ImageIcon,
          name: 'image',
          title: 'Image',
          options: {hotspot: true},
          preview: {
            select: {media: 'asset', title: 'caption'},
          },
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
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      description: 'Featured posts can be surfaced first on the homepage/blog index.',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'canonicalUrl',
      title: 'Canonical URL',
      description:
        'Only set this if this post is a cross-post/syndication and the canonical lives elsewhere.',
      type: 'url',
    }),
    defineField({
      name: 'noIndex',
      title: 'Hide from search engines',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'mainImage',
      publishedAt: 'publishedAt',
    },
    prepare({title, media, publishedAt}) {
      return {
        title,
        media,
        subtitle: publishedAt ? new Date(publishedAt).toLocaleDateString() : 'Not published',
      }
    },
  },
})
