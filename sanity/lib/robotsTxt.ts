/**
 * Builds the served robots.txt from Settings → Robots.txt plus per-page "Disallow in robots.txt".
 *
 * Under RFC 9309 a crawler obeys only the most specific group that matches it. Googlebot ignores
 * the `User-agent: *` group when a `User-agent: Googlebot` group exists. So per-page Disallow lines
 * are added to EVERY group, not only to `*`.
 */

export const FALLBACK_ROBOTS_TXT = `User-agent: *
Allow: /
Disallow: /studio
Disallow: /api/
`

export function buildRobotsTxt({
  base,
  disallowPaths,
  sitemapUrl,
}: {
  base: string | null | undefined
  disallowPaths: string[]
  sitemapUrl: string
}): string {
  const source = (base?.trim() ? base : FALLBACK_ROBOTS_TXT).replace(/\r\n?/g, '\n')
  const lines = source.split('\n').map((l) => l.replace(/\s+$/, ''))

  const extra = [...new Set(disallowPaths.map(normalisePath).filter(Boolean))].toSorted()

  const out: string[] = []
  let inGroup = false
  let groupHasRules = false
  let sawAnyGroup = false
  let existingInGroup = new Set<string>()

  const flushGroup = () => {
    if (inGroup && extra.length) {
      const additions = extra.filter((p) => !existingInGroup.has(p))
      if (additions.length) {
        // Insert before any trailing blank lines so the group stays visually together.
        let insertAt = out.length
        while (insertAt > 0 && out[insertAt - 1] === '') insertAt--
        out.splice(
          insertAt,
          0,
          '# Added by page SEO settings',
          ...additions.map((p) => `Disallow: ${p}`),
        )
      }
    }
    inGroup = false
    groupHasRules = false
    existingInGroup = new Set()
  }

  for (const line of lines) {
    const directive = parseDirective(line)
    if (directive?.field === 'user-agent') {
      // Consecutive user-agent lines share one group. A user-agent after rules starts a new group.
      if (inGroup && groupHasRules) flushGroup()
      inGroup = true
      sawAnyGroup = true
    } else if (
      directive &&
      (directive.field === 'allow' ||
        directive.field === 'disallow' ||
        directive.field === 'crawl-delay')
    ) {
      groupHasRules = true
      if (directive.field === 'disallow') existingInGroup.add(normalisePath(directive.value))
    } else if (directive?.field === 'sitemap') {
      // Sitemap is not part of any group.
      flushGroup()
    }
    out.push(line)
  }
  flushGroup()

  if (!sawAnyGroup && extra.length) {
    out.push(
      '',
      'User-agent: *',
      '# Added by page SEO settings',
      ...extra.map((p) => `Disallow: ${p}`),
    )
  }

  const hasSitemap = lines.some((l) => parseDirective(l)?.field === 'sitemap')
  if (!hasSitemap) {
    while (out.length && out[out.length - 1] === '') out.pop()
    out.push('', `Sitemap: ${sitemapUrl}`)
  }

  return `${out
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()}\n`
}

function parseDirective(line: string): {field: string; value: string} | null {
  const stripped = line.replace(/#.*/, '').trim()
  const match = /^([A-Za-z-]+)\s*:\s*(.*)$/.exec(stripped)
  if (!match) return null
  return {field: match[1].toLowerCase(), value: match[2].trim()}
}

function normalisePath(path: string): string {
  const trimmed = path.trim()
  if (!trimmed) return ''
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`
}
