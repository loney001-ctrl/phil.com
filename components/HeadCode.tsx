import {createHash} from 'node:crypto'

import {stegaClean} from 'next-sanity'

import {PageHeadScripts, type ClientScript} from '@/components/PageHeadScripts'
import {isExecutableScript, parseHeadCode, type HeadTag} from '@/sanity/lib/headCode'

/**
 * Renders parsed tags in place. Used inside the root layout's <head> for the global head code,
 * so every tag, including executable scripts, is in the server HTML and runs once on page load.
 */
export function GlobalHeadTags({code}: {code: string | null | undefined}) {
  const {tags} = parseHeadCode(stegaClean(code))
  return <>{tags.map((tag, i) => renderTag(tag, `global-head-${i}`))}</>
}

/**
 * Per-page head code, rendered inside the page.
 *
 * - <meta>, <link>: rendered on the server. React 19 hoists them into <head>.
 * - <style>: rendered on the server with `precedence`, so React hoists it into <head>.
 * - <script type="application/ld+json"> and other data blocks: rendered on the server in place.
 *   Crawlers read JSON-LD anywhere in the document.
 * - <noscript>: rendered on the server in place.
 * - Executable <script>: added to <head> in the browser by <PageHeadScripts>, so it also runs
 *   after client-side navigation. Not present in the server HTML.
 */
export function PageHeadCode({code, id}: {code: string | null | undefined; id: string}) {
  const {tags} = parseHeadCode(stegaClean(code))
  if (!tags.length) return null

  const clientScripts: ClientScript[] = []
  const serverTags: React.ReactNode[] = []

  tags.forEach((tag, i) => {
    const key = `page-head-${id}-${i}`
    if (isExecutableScript(tag)) {
      clientScripts.push({props: tag.props, content: tag.content})
      return
    }
    if (tag.tag === 'style') {
      const href = `page-style-${hash(tag.content)}`
      serverTags.push(
        <style key={key} {...tag.props} href={href} precedence="page-head-code">
          {tag.content}
        </style>,
      )
      return
    }
    if (tag.tag === 'link' && String(tag.props.rel).toLowerCase() === 'stylesheet') {
      serverTags.push(<link key={key} {...tag.props} precedence="page-head-code" />)
      return
    }
    serverTags.push(renderTag(tag, key))
  })

  return (
    <>
      {serverTags}
      {clientScripts.length > 0 && <PageHeadScripts id={id} scripts={clientScripts} />}
    </>
  )
}

/**
 * Global body-open code, rendered straight after <body>. `display: contents` keeps the wrapper out
 * of the layout. Scripts in it run on page load because they arrive in the server HTML.
 */
export function GlobalBodyCode({code}: {code: string | null | undefined}) {
  const html = stegaClean(code)?.trim()
  if (!html) return null
  return (
    <div
      data-global-body-code=""
      style={{display: 'contents'}}
      dangerouslySetInnerHTML={{__html: html}}
    />
  )
}

function renderTag(tag: HeadTag, key: string) {
  switch (tag.tag) {
    case 'meta':
      return <meta key={key} {...tag.props} />
    case 'link':
      return <link key={key} {...tag.props} />
    case 'style':
      return <style key={key} {...tag.props} dangerouslySetInnerHTML={{__html: tag.content}} />
    case 'noscript':
      return <noscript key={key} {...tag.props} dangerouslySetInnerHTML={{__html: tag.content}} />
    case 'script':
      return <script key={key} {...tag.props} dangerouslySetInnerHTML={{__html: tag.content}} />
    default:
      return null
  }
}

function hash(value: string): string {
  return createHash('sha1').update(value).digest('hex').slice(0, 12)
}
