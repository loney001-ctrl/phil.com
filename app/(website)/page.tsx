import {createDataAttribute, defineQuery} from 'next-sanity'
import {draftMode} from 'next/headers'
import Link from 'next/link'
import {Suspense} from 'react'

import {AppLink} from '@/components/AppLink'
import {CustomPortableText} from '@/components/CustomPortableText'
import {Header} from '@/components/Header'
import ImageBox from '@/components/ImageBox'
import {OptimisticSortOrder} from '@/components/OptimisticSortOrder'
import {studioUrl} from '@/sanity/lib/api'
import {getDynamicFetchOptions, sanityFetch, type DynamicFetchOptions} from '@/sanity/lib/live'
import {resolveHref} from '@/sanity/lib/utils'

export default async function IndexPage() {
  const {isEnabled: isDraftMode} = await draftMode()
  if (!isDraftMode) {
    return <CachedHome perspective="published" stega={false} />
  }
  return (
    <Suspense>
      <DynamicHome />
    </Suspense>
  )
}

async function DynamicHome() {
  const {perspective, stega} = await getDynamicFetchOptions()
  return <CachedHome perspective={perspective} stega={stega} />
}

async function CachedHome({perspective, stega}: DynamicFetchOptions) {
  'use cache'
  const homePageQuery = defineQuery(`
    *[_type == "home"][0]{
      _id,
      _type,
      overview,
      showcaseProjects[]{
        _key,
        ...@->{
          _id,
          _type,
          coverImage,
          overview,
          "slug": slug.current,
          tags,
          title,
        }
      },
      "latestPosts": *[_type == "post" && !(_id in path("drafts.**")) && !noIndex]
        | order(publishedAt desc)[0...3]{
          _id,
          _type,
          mainImage,
          overview,
          publishedAt,
          "slug": slug.current,
          title,
        },
      title,
    }
  `)
  const {data} = await sanityFetch({query: homePageQuery, perspective, stega})

  if (!data) {
    return (
      <div className="text-center">
        You don&rsquo;t have a homepage yet,{' '}
        <Link href={`${studioUrl}/structure/home`} className="underline">
          create one now
        </Link>
        !
      </div>
    )
  }

  // Default to an empty object to allow previews on non-existent documents
  const {overview = [], showcaseProjects = [], latestPosts = [], title = ''} = data ?? {}

  const dataAttribute =
    data?._id && data?._type
      ? createDataAttribute({
          baseUrl: studioUrl,
          id: data._id,
          type: data._type,
        })
      : null

  return (
    <div className="space-y-20">
      {/* Header */}
      {title && (
        <Header
          id={data?._id || null}
          type={data?._type || null}
          path={['overview']}
          centered
          title={title}
          description={overview}
        />
      )}
      {/* Showcase projects */}
      <div className="mx-auto max-w-[100rem] rounded-md border">
        <OptimisticSortOrder id={data?._id} path={'showcaseProjects'}>
          {showcaseProjects &&
            showcaseProjects.length > 0 &&
            showcaseProjects.map((project) => {
              const href = resolveHref(project?._type, project?.slug)
              if (!href) {
                return null
              }
              return (
                <AppLink
                  className="flex flex-col gap-x-5 p-2 transition odd:border-b odd:border-t hover:bg-gray-50/50 xl:flex-row odd:xl:flex-row-reverse"
                  key={project._key}
                  href={href}
                  // `/projects/[slug]` reads URL data, which the shared App Shell can't
                  // carry. Runtime prefetching resolves the cached project per link so
                  // navigation stays instant. See:
                  // https://nextjs.org/docs/app/guides/runtime-prefetching
                  prefetch={true}
                  data-sanity={dataAttribute?.(['showcaseProjects', {_key: project._key}])}
                >
                  <div className="w-full xl:w-9/12">
                    <ImageBox
                      image={project.coverImage}
                      alt={`Cover image from ${project.title}`}
                      classesWrapper="relative aspect-[16/9]"
                    />
                  </div>
                  <div className="flex xl:w-1/4">
                    <div className="relative mt-2 flex w-full flex-col justify-between p-3 xl:mt-0">
                      <div>
                        {/* Title */}
                        <div className="mb-2 text-xl font-extrabold tracking-tight md:text-2xl">
                          {project.title}
                        </div>
                        {/* Overview  */}
                        {Array.isArray(project.overview) && (
                          <div className="font-serif text-gray-500">
                            <CustomPortableText
                              id={project._id}
                              type={project._type}
                              path={['overview']}
                              value={project.overview}
                            />
                          </div>
                        )}
                      </div>
                      {/* Tags */}
                      <div className="mt-4 flex flex-row gap-x-2">
                        {project.tags?.map((tag, key) => (
                          <div className="text-sm font-medium lowercase md:text-lg" key={key}>
                            #{tag}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </AppLink>
              )
            })}
        </OptimisticSortOrder>
      </div>
      {/* Latest posts */}
      {latestPosts.length > 0 && (
        <div className="mx-auto max-w-[100rem] space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-extrabold tracking-tight md:text-3xl">Latest posts</h2>
            <Link href="/blog" className="underline">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {latestPosts.map((post) => {
              const href = resolveHref(post._type, post.slug)
              if (!href) return null
              return (
                <AppLink key={post._id} href={href} prefetch={true} className="group space-y-3">
                  <ImageBox
                    image={post.mainImage}
                    alt={post.title || ''}
                    classesWrapper="relative aspect-[16/9]"
                  />
                  <div>
                    {post.publishedAt && (
                      <div className="text-sm text-gray-500">
                        {new Date(post.publishedAt).toLocaleDateString('en-AU', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </div>
                    )}
                    <div className="mt-1 text-xl font-extrabold tracking-tight group-hover:underline">
                      {post.title}
                    </div>
                    {post.overview && (
                      <p className="mt-1 font-serif text-gray-500">{post.overview}</p>
                    )}
                  </div>
                </AppLink>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
