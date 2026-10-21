import 'server-only'
import {NodeType, parse, type HTMLElement} from 'node-html-parser'

/**
 * Splits a raw HTML snippet from Settings or a page into tags React can render.
 *
 * React cannot inject an HTML string into <head>. So the snippet is parsed into individual
 * elements, and each one is rendered as a real React element with its attributes and content.
 */

export type HeadTagName = 'script' | 'meta' | 'link' | 'style' | 'noscript'

export interface HeadTag {
  tag: HeadTagName
  /** React-ready props (className, crossOrigin, etc.). Event-handler attributes are dropped. */
  props: Record<string, string | boolean>
  /** Raw inner content for script, style and noscript. */
  content: string
}

export interface ParsedHeadCode {
  tags: HeadTag[]
  /** Tag names that were found but are not allowed in <head>. Logged at build time. */
  skipped: string[]
}

const ALLOWED = new Set<HeadTagName>(['script', 'meta', 'link', 'style', 'noscript'])

const BOOLEAN_ATTRS = new Set(['async', 'defer', 'nomodule', 'disabled', 'blocking'])

const ATTR_TO_PROP: Record<string, string> = {
  'class': 'className',
  'charset': 'charSet',
  'crossorigin': 'crossOrigin',
  'http-equiv': 'httpEquiv',
  'nomodule': 'noModule',
  'referrerpolicy': 'referrerPolicy',
  'fetchpriority': 'fetchPriority',
  'hreflang': 'hrefLang',
  'imagesizes': 'imageSizes',
  'imagesrcset': 'imageSrcSet',
  'itemprop': 'itemProp',
}

export function parseHeadCode(html: string | null | undefined): ParsedHeadCode {
  const tags: HeadTag[] = []
  const skipped: string[] = []
  if (!html?.trim()) return {tags, skipped}

  const root = parse(html, {
    comment: false,
    lowerCaseTagName: true,
    blockTextElements: {script: true, style: true, noscript: true},
  })

  for (const node of root.childNodes) {
    if (node.nodeType !== NodeType.ELEMENT_NODE) {
      // Text between tags (whitespace, stray text) is ignored. Non-whitespace text is a mistake.
      if (node.rawText.trim()) skipped.push('#text')
      continue
    }
    const el = node as HTMLElement
    const tag = el.rawTagName?.toLowerCase() as HeadTagName
    if (!ALLOWED.has(tag)) {
      skipped.push(tag || 'unknown')
      continue
    }
    tags.push({
      tag,
      props: toReactProps(el.attributes),
      content: tag === 'meta' || tag === 'link' ? '' : el.innerHTML,
    })
  }

  if (skipped.length) {
    console.warn(
      `[head code] Skipped tags not allowed in <head>: ${[...new Set(skipped)].join(', ')}`,
    )
  }
  return {tags, skipped}
}

function toReactProps(attributes: Record<string, string>): Record<string, string | boolean> {
  const props: Record<string, string | boolean> = {}
  for (const [rawName, value] of Object.entries(attributes)) {
    const name = rawName.toLowerCase()
    // Inline event handlers (onload="…") can't be passed to React as strings. Drop them.
    if (name.startsWith('on')) {
      console.warn(`[head code] Dropped inline event handler attribute "${rawName}".`)
      continue
    }
    if (name === 'style') continue
    const prop = ATTR_TO_PROP[name] ?? name
    props[prop] = BOOLEAN_ATTRS.has(name) ? true : value
  }
  return props
}

/** Executable scripts are anything except data blocks such as JSON-LD or templates. */
export function isExecutableScript(tag: HeadTag): boolean {
  if (tag.tag !== 'script') return false
  const type = String(tag.props.type ?? '')
    .trim()
    .toLowerCase()
  return (
    type === '' ||
    type === 'module' ||
    type === 'text/javascript' ||
    type === 'application/javascript'
  )
}
