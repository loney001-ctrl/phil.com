import type {PathSegment} from '@sanity/client/csm'
import {
  PortableText,
  type InferStrictComponents,
  type InferValue,
  type SanityQueries,
} from 'next-sanity'
import Link from 'next/link'

import ImageBox from '@/components/ImageBox'
import {TimelineSection} from '@/components/TimelineSection'

export function CustomPortableText({
  id,
  type,
  path,
  paragraphClasses,
  value,
}: {
  id: string | null
  type: string | null
  path: PathSegment[]
  paragraphClasses?: string
  value: InferValue<SanityQueries[keyof SanityQueries]>
}) {
  const components = {
    block: {
      normal: ({children}) => {
        return <p className={paragraphClasses}>{children}</p>
      },
      h2: ({children}) => (
        <h2 className="mb-4 mt-10 text-2xl font-extrabold tracking-tight md:text-3xl">
          {children}
        </h2>
      ),
      h3: ({children}) => (
        <h3 className="mb-3 mt-8 text-xl font-bold tracking-tight md:text-2xl">{children}</h3>
      ),
      h4: ({children}) => (
        <h4 className="mb-2 mt-6 text-lg font-bold tracking-tight">{children}</h4>
      ),
      blockquote: ({children}) => (
        <blockquote className="my-6 border-l-4 border-gray-300 pl-4 font-serif text-xl italic text-gray-600">
          {children}
        </blockquote>
      ),
    },
    marks: {
      link: ({children, value: mark}) => {
        if (!mark?.href) return children

        return (
          <Link
            className="underline transition hover:opacity-50"
            href={mark.href}
            rel="noreferrer noopener"
          >
            {children}
          </Link>
        )
      },
    },
    types: {
      image: ({value: image}) => {
        return (
          <div className="my-6 space-y-2">
            <ImageBox image={image} alt={image.alt} classesWrapper="relative aspect-[16/9]" />
            {image?.caption && (
              <div className="font-sans text-sm text-gray-600">{image.caption}</div>
            )}
          </div>
        )
      },
      timeline: ({value: timeline}) => {
        const {items, _key} = timeline
        return (
          <TimelineSection
            key={_key}
            id={id}
            type={type}
            path={[...path, {_key}, 'items']}
            timelines={items}
          />
        )
      },
    },
  } satisfies InferStrictComponents<typeof value>

  return <PortableText components={components} value={value} />
}
