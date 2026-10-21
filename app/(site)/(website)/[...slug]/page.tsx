import type {Metadata, ResolvingMetadata} from 'next'
import {stegaClean} from 'next-sanity'
import {notFound} from 'next/navigation'

import {Breadcrumbs} from '@/components/Breadcrumbs'
import {CustomPortableText} from '@/components/CustomPortableText'
import {PageHeadCode} from '@/components/HeadCode'
import {Header} from '@/components/Header'
import {JsonLd} from '@/components/JsonLd'
import {breadcrumbNode, graph, pageNode, type Crumb} from '@/sanity/lib/jsonLd'
import {
  getDynamicFetchOptions,
  sanityFetch,
  sanityFetchMetadata,
  sanityFetchStaticParams,
  type DynamicFetchOptions,
} from '@/sanity/lib/live'
import {pageByPathQuery, pageMetadataByPathQuery, pagePathsQuery} from '@/sanity/lib/queries'
import {buildMetadata, getGlobalSeo} from '@/sanity/lib/seo'
import {urlForOpenGraphImage} from '@/sanity/lib/utils'

/**
 * Every `page` document, at its full nested path: /about, /services/seo, /services/seo/local.
 * `/blog/*` and `/case-studies/*` are static segments, so Next.js matches them before this.
 */
export async function generateStaticParams() {
  const {data} = await sanityFetchStaticParams({query: pagePathsQuery})
  if (data.length > 0) {
    return data
  }
  // Cache Components requires `generateStaticParams` to return at least one param — an empty
  // array fails the build (https://nextjs.org/docs/messages/empty-generate-static-params).
  // With no page documents in the dataset yet, prerender a placeholder that resolves to the 404.
  return [{slug: ['__placeholder__']}]
}

function toPathParams(segments: string[]) {
  const clean = segments.map((s) => decodeURIComponent(s))
  return {path: clean.join('/'), last: clean.at(-1) ?? ''}
}

export async function generateMetadata(
  {params}: PageProps<'/[...slug]'>,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const [{slug}, {perspective}] = await Promise.all([params, getDynamicFetchOptions()])
  const {path, last} = toPathParams(slug)
  const [{data}, global] = await Promise.all([
    sanityFetchMetadata({query: pageMetadataByPathQuery, params: {path, last}, perspective}),
    getGlobalSeo(perspective),
  ])
  if (!data) return {}

  return buildMetadata({
    seo: data.seo,
    title: data.title,
    description: data.overview || (await parent).description,
    path: `/${data.path}`,
    global,
  })
}

export default async function SlugPage({params}: PageProps<'/[...slug]'>) {
  const [{slug}, {perspective, stega}] = await Promise.all([params, getDynamicFetchOptions()])
  const {path, last} = toPathParams(slug)
  return <CachedSlugPage path={path} last={last} perspective={perspective} stega={stega} />
}

async function CachedSlugPage({
  path,
  last,
  perspective,
  stega,
}: {path: string; last: string} & DynamicFetchOptions) {
  'use cache'
  const [{data}, global] = await Promise.all([
    sanityFetch({query: pageByPathQuery, params: {path, last}, perspective, stega}),
    getGlobalSeo(perspective),
  ])

  if (!data?._id) notFound()

  const {body, overview, title} = data
  const urlPath = `/${stegaClean(data.path)}`
  const crumbs: Crumb[] = (data.ancestors ?? [])
    .filter((a) => !!a?.path)
    .map((a) => ({name: stegaClean(a.title) || 'Untitled', path: `/${stegaClean(a.path)}`}))
  const cleanTitle = stegaClean(title) || 'Untitled'
  const currentCrumb = stegaClean(data.seo?.breadcrumbTitle) || cleanTitle

  const jsonLd = graph([
    breadcrumbNode([...crumbs, {name: currentCrumb, path: urlPath}], urlPath),
    ...pageNode({
      seo: data.seo,
      defaultType: 'WebPage',
      path: urlPath,
      title: cleanTitle,
      description:
        data.seo?.metaDescription ||
        (Array.isArray(overview)
          ? overview.map((b) => b.children?.map((c) => c.text).join('') ?? '').join(' ')
          : undefined),
      image: urlForOpenGraphImage(data.seo?.ogImage ?? global?.ogImage),
      dateModified: data._updatedAt,
      hasBreadcrumb: true,
    }),
  ])

  return (
    <>
      <JsonLd data={jsonLd} />
      <PageHeadCode code={data.seo?.headCode} id={data._id} />

      <Breadcrumbs items={crumbs} current={currentCrumb} />

      {/* Header */}
      <Header
        id={data._id}
        type={data._type}
        path={['overview']}
        title={title || 'Untitled'}
        description={overview}
      />

      {/* Body */}
      {Array.isArray(body) && (
        <CustomPortableText
          id={data._id}
          type={data._type}
          path={['body']}
          paragraphClasses="font-serif max-w-3xl text-gray-600 text-xl"
          value={body}
        />
      )}
    </>
  )
}
