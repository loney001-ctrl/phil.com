import {defineQuery} from 'next-sanity'

import {sanityFetchMetadata} from '@/sanity/lib/live'

export const HOME_FALLBACK = {
  title: 'Phil Loney — Marketing strategist & systems thinker',
  description:
    'I find the commercial signal other marketers miss, turn it into a system you can test, then build the AI infrastructure to run that system at scale. Melbourne.',
}

const homeSeoQuery = defineQuery(`*[_type == "home"][0]{
  _id,
  _updatedAt,
  title,
  "overview": pt::text(overview),
  seo,
}`)

/** Published Home document, for the hardcoded homepage's metadata, schema and head code. */
export async function getHomeData() {
  const {data} = await sanityFetchMetadata({query: homeSeoQuery, perspective: 'published'})
  return data
}
