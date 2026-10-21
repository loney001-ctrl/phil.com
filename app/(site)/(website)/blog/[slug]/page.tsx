import type {Metadata, ResolvingMetadata} from 'next'
import {createDataAttribute, defineQuery, stegaClean} from 'next-sanity'
import {notFound} from 'next/navigation'

import {CustomPortableText} from '@/components/CustomPortableText'
import {PageHeadCode} from '@/components/HeadCode'
import ImageBox from '@/components/ImageBox'
import {JsonLd} from '@/components/JsonLd'
import {studioUrl} from '@/sanity/lib/api'
import {breadcrumbNode, graph, pageNode} from '@/sanity/lib/jsonLd'
import {
  getDynamicFetchOptions,
  sanityFetch,
  sanityFetchMetadata,
  sanityFetchStaticParams,
  type DynamicFetchOptions,
} from '@/sanity/lib/live'
import {slugsByTypeQuery, type SlugsByTypeQueryParams} from '@/sanity/lib/queries'
import {buildMetadata, getGlobalSeo} from '@/sanity/lib/seo'
import {resolveHref, urlForImage} from '@/sanity/lib/utils'

const PRIMARY = '#1E3BC8'
const ACCENT = '#B8FF00'

export async function generateStaticParams() {
  const {data} = await sanityFetchStaticParams({
    query: slugsByTypeQuery,
    params: {type: 'post'} satisfies SlugsByTypeQueryParams,
  })
  if (data.length > 0) {
    return data
  }
  // Cache Components requires `generateStaticParams` to return at least one param — an empty
  // array fails the build. With no post documents yet, prerender a placeholder slug that
  // resolves to the 404 page instead.
  return [{slug: '__placeholder__'}]
}

export async function generateMetadata(
  {params}: PageProps<'/blog/[slug]'>,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const [{slug}, {perspective}] = await Promise.all([params, getDynamicFetchOptions()])
  const postMetadataQuery = defineQuery(`
    *[_type == "post" && slug.current == $slug][0] {
      title,
      overview,
      mainImage,
      publishedAt,
      _updatedAt,
      "slug": slug.current,
      "authorName": author->name,
      seo,
    }
  `)
  const [{data}, global] = await Promise.all([
    sanityFetchMetadata({query: postMetadataQuery, params: {slug}, perspective}),
    getGlobalSeo(perspective),
  ])
  if (!data) return {}

  return buildMetadata({
    seo: data.seo,
    title: data.title,
    description: data.overview || (await parent).description,
    image: data.mainImage,
    path: resolveHref('post', data.slug) || `/blog/${slug}`,
    global,
    openGraphType: 'article',
    publishedTime: data.publishedAt,
    modifiedTime: data._updatedAt,
    authors: data.authorName ? [data.authorName] : undefined,
  })
}

export default async function BlogSlugPage({params}: PageProps<'/blog/[slug]'>) {
  const [{slug}, {perspective, stega}] = await Promise.all([params, getDynamicFetchOptions()])
  return <CachedBlogSlugPage slug={slug} perspective={perspective} stega={stega} />
}

async function CachedBlogSlugPage({
  slug,
  perspective,
  stega,
}: Awaited<PageProps<'/blog/[slug]'>['params']> & DynamicFetchOptions) {
  'use cache'
  const postQuery = defineQuery(`
    *[_type == "post" && slug.current == $slug][0] {
      _id,
      _type,
      title,
      overview,
      body,
      mainImage,
      publishedAt,
      _updatedAt,
      seo,
      "slug": slug.current,
      "author": author->{name, role, image, "slug": slug.current},
      "categories": categories[]->{title, "slug": slug.current},
    }
  `)
  const {data} = await sanityFetch({query: postQuery, params: {slug}, perspective, stega})

  if (!data?._id) notFound()

  const {author, body, categories, mainImage, overview, publishedAt, title} = data

  const dataAttribute =
    data?._id && data._type
      ? createDataAttribute({baseUrl: studioUrl, id: data._id, type: data._type})
      : null

  const authorImageUrl = author?.image
    ? urlForImage(author.image)?.width(96).height(96).fit('crop').url()
    : undefined

  const postPath = resolveHref('post', stegaClean(data.slug)) || '/blog'
  const schemaImageUrl = mainImage
    ? urlForImage(mainImage)?.width(1200).height(630).fit('crop').url()
    : undefined
  const jsonLd = graph([
    breadcrumbNode(
      [
        {name: 'Blog', path: '/blog'},
        {
          name: stegaClean(data.seo?.breadcrumbTitle) || stegaClean(title) || 'Post',
          path: postPath,
        },
      ],
      postPath,
    ),
    ...pageNode({
      seo: data.seo,
      defaultType: 'BlogPosting',
      path: postPath,
      title: stegaClean(title) || '',
      description: data.seo?.metaDescription || overview,
      image: schemaImageUrl,
      datePublished: publishedAt,
      dateModified: data._updatedAt,
      authorName: author?.name,
      hasBreadcrumb: true,
    }),
  ])

  return (
    <article className="space-y-10 py-2 md:py-6" data-testid="post-content">
      <JsonLd data={jsonLd} />
      <PageHeadCode code={data.seo?.headCode} id={data._id} />

      <div className="mx-auto max-w-3xl">
        {categories && categories.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {categories.map((category) => (
              <span
                key={category.slug || category.title}
                className="a rounded-full px-3 py-1 text-xs font-extrabold tracking-[0.06em] text-[#0A0A0A]"
                style={{background: ACCENT}}
              >
                {category.title?.toUpperCase()}
              </span>
            ))}
          </div>
        )}

        <h1
          className="a text-4xl font-black leading-[0.95] tracking-[-0.03em] md:text-6xl"
          data-testid="page-title"
          data-sanity={dataAttribute?.('title')}
        >
          {title}
        </h1>

        <div className="r mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-base text-[#6B6B72]">
          {publishedAt && (
            <time dateTime={publishedAt}>
              {new Date(publishedAt).toLocaleDateString('en-AU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </time>
          )}
          {author?.name && (
            <>
              <span aria-hidden style={{color: PRIMARY}}>
                ·
              </span>
              <span className="flex items-center gap-2">
                {authorImageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={authorImageUrl}
                    alt={author.name}
                    width={28}
                    height={28}
                    className="rounded-full"
                  />
                )}
                {author.name}
                {author.role ? `, ${author.role}` : ''}
              </span>
            </>
          )}
        </div>
      </div>

      {mainImage && (
        <ImageBox
          data-sanity={dataAttribute?.('mainImage')}
          image={mainImage}
          alt={title || ''}
          classesWrapper="relative mx-auto aspect-[16/9] max-w-4xl overflow-hidden rounded-3xl"
        />
      )}

      {overview && (
        <p className="r mx-auto max-w-3xl text-xl leading-relaxed text-[#3A3A40] md:text-2xl">
          {overview}
        </p>
      )}

      {Array.isArray(body) && (
        <div className="mx-auto max-w-3xl">
          <CustomPortableText
            id={data._id}
            type={data._type}
            path={['body']}
            paragraphClasses="font-serif text-lg text-gray-800 leading-relaxed"
            value={body}
          />
        </div>
      )}
    </article>
  )
}
