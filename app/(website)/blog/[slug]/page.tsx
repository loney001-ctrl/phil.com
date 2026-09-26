import type {Metadata, ResolvingMetadata} from 'next'
import {createDataAttribute, defineQuery} from 'next-sanity'
import {notFound} from 'next/navigation'

import {CustomPortableText} from '@/components/CustomPortableText'
import {Header} from '@/components/Header'
import ImageBox from '@/components/ImageBox'
import {studioUrl} from '@/sanity/lib/api'
import {
  getDynamicFetchOptions,
  sanityFetch,
  sanityFetchMetadata,
  sanityFetchStaticParams,
  type DynamicFetchOptions,
} from '@/sanity/lib/live'
import {slugsByTypeQuery, type SlugsByTypeQueryParams} from '@/sanity/lib/queries'
import {urlForImage, urlForOpenGraphImage} from '@/sanity/lib/utils'

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
      canonicalUrl,
      noIndex,
      publishedAt,
      "authorName": author->name,
    }
  `)
  const {data} = await sanityFetchMetadata({query: postMetadataQuery, params: {slug}, perspective})

  const ogImage = urlForOpenGraphImage(data?.mainImage)
  return {
    title: data?.title,
    description: data?.overview || (await parent).description,
    alternates: data?.canonicalUrl ? {canonical: data.canonicalUrl} : undefined,
    robots: data?.noIndex ? {index: false, follow: true} : undefined,
    authors: data?.authorName ? [{name: data.authorName}] : undefined,
    openGraph: {
      type: 'article',
      publishedTime: data?.publishedAt,
      images: ogImage ? [ogImage, ...((await parent).openGraph?.images || [])] : [],
    },
  }
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

  return (
    <article className="space-y-8" data-testid="post-content">
      <Header id={data._id} type={data._type} path={['overview']} centered title={title} />

      <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm text-gray-500">
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
            <span aria-hidden>·</span>
            <span className="flex items-center gap-2">
              {authorImageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={authorImageUrl}
                  alt={author.name}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
              )}
              {author.name}
              {author.role ? `, ${author.role}` : ''}
            </span>
          </>
        )}
        {categories && categories.length > 0 && (
          <>
            <span aria-hidden>·</span>
            <span>{categories.map((c) => c.title).join(', ')}</span>
          </>
        )}
      </div>

      {mainImage && (
        <ImageBox
          data-sanity={dataAttribute?.('mainImage')}
          image={mainImage}
          alt={title || ''}
          classesWrapper="relative mx-auto aspect-[16/9] max-w-4xl"
        />
      )}

      {overview && (
        <p className="mx-auto max-w-3xl text-center font-serif text-xl text-gray-600 md:text-2xl">
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
