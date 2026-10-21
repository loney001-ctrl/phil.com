/**
 * On-page SEO checks for the Studio SEO panel. A RankMath-style checklist.
 *
 * Pure functions with no Studio imports, so they can be unit-tested and reused. Each check is
 * a heuristic, not a ranking factor. The panel says so. The score only measures how many
 * hygiene checks pass.
 */

export type CheckStatus = 'pass' | 'warn' | 'fail'

export interface SeoCheck {
  id: string
  label: string
  status: CheckStatus
  detail?: string
  weight: number
}

export interface SeoAnalysisInput {
  documentType: string
  title?: string
  slug?: string
  /** Final <title> as rendered, after template. */
  renderedTitle: string
  /** Final meta description as rendered, after fallbacks. */
  renderedDescription: string
  focusKeyword?: string
  secondaryKeywords?: string[]
  content: ExtractedContent
  /** Count of other published documents that use the same focus keyword. */
  keywordReuseCount?: number
}

export interface ExtractedContent {
  text: string
  words: string[]
  headings: string[]
  imageAlts: string[]
  imageCount: number
  links: string[]
}

type PortableTextSpan = {_type?: string; text?: string; marks?: string[]}
type PortableTextMarkDef = {_key?: string; _type?: string; href?: string}
type PortableTextBlock = {
  _type?: string
  style?: string
  children?: PortableTextSpan[]
  markDefs?: PortableTextMarkDef[]
  alt?: string
  caption?: string
}

const WORD_RE = /[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu

export function tokenize(text: string): string[] {
  return (text.toLowerCase().match(WORD_RE) ?? []).map((w) => w.replace(/[’']/g, "'"))
}

/**
 * Pulls text, headings, image alts and link hrefs out of one or more Portable Text arrays.
 * Non-block members (images, timelines) contribute alts/captions only.
 */
export function extractContent(...fields: unknown[]): ExtractedContent {
  const paragraphs: string[] = []
  const headings: string[] = []
  const imageAlts: string[] = []
  const links: string[] = []
  let imageCount = 0

  for (const field of fields) {
    if (typeof field === 'string') {
      paragraphs.push(field)
      continue
    }
    if (!Array.isArray(field)) continue
    for (const raw of field as PortableTextBlock[]) {
      if (!raw || typeof raw !== 'object') continue
      if (raw._type === 'block') {
        const text = (raw.children ?? []).map((c) => c.text ?? '').join('')
        if (raw.style && /^h[1-6]$/.test(raw.style)) headings.push(text)
        else paragraphs.push(text)
        for (const def of raw.markDefs ?? []) {
          if (def._type === 'link' && def.href) links.push(def.href)
        }
      } else if (raw._type === 'image') {
        imageCount += 1
        if (raw.alt) imageAlts.push(raw.alt)
        else if (raw.caption) imageAlts.push(raw.caption)
      }
    }
  }

  const text = [...headings, ...paragraphs].join('\n')
  return {text, words: tokenize(paragraphs.join(' ')), headings, imageAlts, imageCount, links}
}

/** Case-insensitive whole-phrase match on token boundaries. */
export function containsPhrase(haystack: string, phrase: string): boolean {
  const needle = tokenize(phrase)
  if (needle.length === 0) return false
  const tokens = tokenize(haystack)
  return countPhrase(tokens, needle) > 0
}

export function countPhrase(tokens: string[], needle: string[]): number {
  if (needle.length === 0) return 0
  let count = 0
  outer: for (let i = 0; i <= tokens.length - needle.length; i++) {
    for (let j = 0; j < needle.length; j++) {
      if (tokens[i + j] !== needle[j]) continue outer
    }
    count += 1
  }
  return count
}

function slugify(phrase: string): string {
  return tokenize(phrase).join('-')
}

const MIN_WORDS: Record<string, number> = {post: 600, caseStudy: 400, page: 300, home: 300}

export function analyseSeo(input: SeoAnalysisInput): {score: number; checks: SeoCheck[]} {
  const checks: SeoCheck[] = []
  const add = (check: SeoCheck) => checks.push(check)

  const kw = input.focusKeyword?.trim()
  const words = input.content.words
  const wordCount = words.length

  // Length checks run with or without a keyword.
  const titleLen = input.renderedTitle.length
  add({
    id: 'title-length',
    label: 'Title length',
    weight: 2,
    status: titleLen === 0 ? 'fail' : titleLen >= 30 && titleLen <= 60 ? 'pass' : 'warn',
    detail: `${titleLen} characters. Aim for 30–60.`,
  })

  const descLen = input.renderedDescription.length
  add({
    id: 'description-length',
    label: 'Meta description length',
    weight: 2,
    status: descLen === 0 ? 'fail' : descLen >= 120 && descLen <= 160 ? 'pass' : 'warn',
    detail: `${descLen} characters. Aim for 120–160.`,
  })

  const minWords = MIN_WORDS[input.documentType] ?? 300
  add({
    id: 'content-length',
    label: 'Content length',
    weight: 2,
    status: wordCount >= minWords ? 'pass' : wordCount >= minWords / 2 ? 'warn' : 'fail',
    detail: `${wordCount} words. Guide for this type: ${minWords}+. Length follows intent, not a target.`,
  })

  if (input.slug) {
    add({
      id: 'url-length',
      label: 'URL slug length',
      weight: 1,
      status: input.slug.length <= 60 ? 'pass' : 'warn',
      detail: `${input.slug.length} characters.`,
    })
  }

  add({
    id: 'subheadings',
    label: 'Content uses subheadings',
    weight: 1,
    status: input.content.headings.length > 0 || wordCount < 300 ? 'pass' : 'warn',
    detail:
      input.content.headings.length > 0
        ? `${input.content.headings.length} subheadings.`
        : 'No H2–H4 headings in the body.',
  })

  if (input.content.imageCount > 0) {
    const missing = input.content.imageCount - input.content.imageAlts.length
    add({
      id: 'image-alts',
      label: 'Images have alt text',
      weight: 1,
      status: missing === 0 ? 'pass' : 'warn',
      detail: missing === 0 ? 'All images have alt text.' : `${missing} image(s) without alt text.`,
    })
  }

  const internal = input.content.links.filter(
    (href) => href.startsWith('/') || href.startsWith('#'),
  )
  const external = input.content.links.filter((href) => /^https?:\/\//.test(href))
  add({
    id: 'links',
    label: 'Content links out',
    weight: 1,
    status: input.content.links.length > 0 || wordCount < 300 ? 'pass' : 'warn',
    detail: `${internal.length} internal, ${external.length} external.`,
  })

  if (!kw) {
    add({
      id: 'focus-keyword',
      label: 'Focus keyword set',
      weight: 3,
      status: 'fail',
      detail: 'Set a focus keyword to run the keyword checks.',
    })
    return {score: score(checks), checks}
  }

  const needle = tokenize(kw)
  add({id: 'focus-keyword', label: 'Focus keyword set', weight: 3, status: 'pass', detail: kw})

  const titleTokens = tokenize(input.renderedTitle)
  const inTitle = countPhrase(titleTokens, needle) > 0
  add({
    id: 'kw-title',
    label: 'Keyword in SEO title',
    weight: 3,
    status: inTitle ? 'pass' : 'fail',
  })
  if (inTitle) {
    const firstIndex = titleTokens.findIndex((_, i) =>
      needle.every((n, j) => titleTokens[i + j] === n),
    )
    add({
      id: 'kw-title-start',
      label: 'Keyword near the start of the title',
      weight: 1,
      status: firstIndex <= Math.max(1, Math.floor(titleTokens.length / 2) - 1) ? 'pass' : 'warn',
    })
  }

  add({
    id: 'kw-description',
    label: 'Keyword in meta description',
    weight: 2,
    status: containsPhrase(input.renderedDescription, kw) ? 'pass' : 'fail',
  })

  if (input.slug) {
    const kwSlug = slugify(kw)
    const slugTokens = input.slug.toLowerCase()
    const allTokensInSlug = needle.every((t) => slugTokens.includes(t))
    add({
      id: 'kw-url',
      label: 'Keyword in URL',
      weight: 2,
      status: slugTokens.includes(kwSlug) ? 'pass' : allTokensInSlug ? 'warn' : 'fail',
    })
  }

  const introTokens = words.slice(0, Math.max(50, Math.ceil(wordCount * 0.1)))
  add({
    id: 'kw-intro',
    label: 'Keyword in the introduction',
    weight: 2,
    status: countPhrase(introTokens, needle) > 0 ? 'pass' : 'fail',
    detail: 'Checks the first 10% of the content (min. 50 words).',
  })

  const occurrences = countPhrase(words, needle)
  const density = wordCount > 0 ? (occurrences * needle.length * 100) / wordCount : 0
  add({
    id: 'kw-density',
    label: 'Keyword density',
    weight: 1,
    status: occurrences === 0 ? 'fail' : density >= 0.5 && density <= 2.5 ? 'pass' : 'warn',
    detail: `${occurrences} uses, ${density.toFixed(2)}%. Density is a stuffing guard, not a target.`,
  })

  add({
    id: 'kw-subheading',
    label: 'Keyword in a subheading',
    weight: 1,
    status: input.content.headings.some((h) => containsPhrase(h, kw)) ? 'pass' : 'warn',
  })

  if (input.content.imageCount > 0) {
    add({
      id: 'kw-image-alt',
      label: 'Keyword in an image alt',
      weight: 1,
      status: input.content.imageAlts.some((alt) => containsPhrase(alt, kw)) ? 'pass' : 'warn',
    })
  }

  for (const secondary of input.secondaryKeywords ?? []) {
    if (!secondary?.trim()) continue
    add({
      id: `kw2-${slugify(secondary)}`,
      label: `Secondary keyword "${secondary}" in content`,
      weight: 1,
      status: containsPhrase(input.content.text, secondary) ? 'pass' : 'warn',
    })
  }

  if (typeof input.keywordReuseCount === 'number') {
    add({
      id: 'kw-unique',
      label: 'Focus keyword not used on another page',
      weight: 2,
      status: input.keywordReuseCount === 0 ? 'pass' : 'warn',
      detail:
        input.keywordReuseCount === 0
          ? undefined
          : `${input.keywordReuseCount} other document(s) target the same keyword. Check for cannibalisation.`,
    })
  }

  return {score: score(checks), checks}
}

function score(checks: SeoCheck[]): number {
  const total = checks.reduce((sum, c) => sum + c.weight, 0)
  if (total === 0) return 0
  const earned = checks.reduce(
    (sum, c) => sum + (c.status === 'pass' ? c.weight : c.status === 'warn' ? c.weight / 2 : 0),
    0,
  )
  return Math.round((earned / total) * 100)
}

/** Applies a "%s | Site" title template. */
export function applyTitleTemplate(template: string | undefined, title: string): string {
  if (!template || !template.includes('%s')) return title
  return template.replace('%s', title)
}
