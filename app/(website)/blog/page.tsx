import type {Metadata} from 'next'
import {createDataAttribute, defineQuery} from 'next-sanity'
import {draftMode} from 'next/headers'
import {Suspense} from 'react'

import {AppLink} from '@/components/AppLink'
import ImageBox from '@/components/ImageBox'
import {studioUrl} from '@/sanity/lib/api'
import {getDynamicFetchOptions, sanityFetch, type DynamicFetchOptions} from '@/sanity/lib/live'
import {resolveHref} from '@/sanity/lib/utils'

const PRIMARY = '#1E3BC8'
const ACCENT = '#B8FF00'

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
    <div className="space-y-12 py-2 md:py-6">
      <div>
        <p className="a text-sm font-extrabold tracking-[0.12em]" style={{color: PRIMARY}}>
          BLOG
        </p>
        <h1
          className="a mt-2 text-4xl font-black leading-[0.95] tracking-[-0.03em] md:text-6xl"
          data-testid="page-title"
        >
          Notes on mechanisms, not tactics.
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
        {posts.length === 0 && (
          <p className="r col-span-full text-lg text-[#6B6B72]">No posts published yet.</p>
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
              className="group flex flex-col gap-4"
              data-sanity={dataAttribute?.('title')}
            >
              <ImageBox
                image={post.mainImage}
                alt={post.title || ''}
                classesWrapper="relative aspect-[16/9] overflow-hidden rounded-3xl"
              />
              <div className="flex flex-col gap-2">
                {post.categories && post.categories.length > 0 && (
                  <span
                    className="a self-start rounded-full px-3 py-1 text-xs font-extrabold tracking-[0.06em] text-[#0A0A0A]"
                    style={{background: ACCENT}}
                  >
                    {post.categories[0].title?.toUpperCase()}
                  </span>
                )}
                <h2 className="a text-xl font-extrabold leading-tight tracking-[-0.01em] group-hover:underline md:text-2xl">
                  {post.title}
                </h2>
                {post.overview && <p className="r text-lg text-[#6B6B72]">{post.overview}</p>}
                {post.publishedAt && (
                  <div className="r text-sm text-[#9A9AA2]">
                    {new Date(post.publishedAt).toLocaleDateString('en-AU', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                    {post.author?.name ? ` · ${post.author.name}` : ''}
                  </div>
                )}
              </div>
            </AppLink>
          )
        })}
      </div>
    </div>
  )
}
