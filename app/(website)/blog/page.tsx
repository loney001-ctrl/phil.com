import type {Metadata} from 'next'
import {createDataAttribute, defineQuery} from 'next-sanity'
import {draftMode} from 'next/headers'
import {Suspense} from 'react'

import {AppLink} from '@/components/AppLink'
import {Header} from '@/components/Header'
import ImageBox from '@/components/ImageBox'
import {studioUrl} from '@/sanity/lib/api'
import {getDynamicFetchOptions, sanityFetch, type DynamicFetchOptions} from '@/sanity/lib/live'
import {resolveHref} from '@/sanity/lib/utils'

export const metadata: Metadata = {
  title: 'Blog',
}

export default async function BlogIndexPage() {
  const {isEnabled: isDraftMode} = await draftMode()
  if (!isDraftMode) {
    return <CachedBlogIndex perspective="published" stega={false} />
  }
  return (
    <Suspense>
      <DynamicBlogIndex />
    </Suspense>
  )
}

async function DynamicBlogIndex() {
  const {perspective, stega} = await getDynamicFetchOptions()
  return <CachedBlogIndex perspective={perspective} stega={stega} />
}

async function CachedBlogIndex({perspective, stega}: DynamicFetchOptions) {
  'use cache'
  const blogIndexQuery = defineQuery(`
    *[_type == "post" && !(_id in path("drafts.**")) && !noIndex] | order(publishedAt desc) {
      _id,
      _type,
      "slug": slug.current,
      title,
      overview,
      mainImage,
      publishedAt,
      "author": author->{name, "slug": slug.current},
      "categories": categories[]->{title, "slug": slug.current},
    }
  `)
  const {data: posts} = await sanityFetch({query: blogIndexQuery, perspective, stega})

  return (
    <div className="space-y-12">
      <Header id={null} type={null} path={[]} centered title="Blog" />
      <div className="mx-auto grid max-w-[100rem] grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.length === 0 && (
          <p className="col-span-full text-center text-gray-500">No posts published yet.</p>
        )}
        {posts.map((post) => {
          const href = resolveHref('post', post.slug)
          if (!href) return null
          const dataAttribute = createDataAttribute({
            baseUrl: studioUrl,
            id: post._id,
            type: post._type,
          })
          return (
            <AppLink
              key={post._id}
              href={href}
              prefetch={true}
              className="group flex flex-col gap-3"
              data-sanity={dataAttribute?.('title')}
            >
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
                    {post.author?.name ? ` · ${post.author.name}` : ''}
                  </div>
                )}
                <h2 className="mt-1 text-xl font-extrabold tracking-tight group-hover:underline md:text-2xl">
                  {post.title}
                </h2>
                {post.overview && <p className="mt-2 font-serif text-gray-600">{post.overview}</p>}
              </div>
            </AppLink>
          )
        })}
      </div>
    </div>
  )
}
