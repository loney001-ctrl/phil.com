/**
 * Redirect matching for `proxy.ts`. Pure, so it can be tested without a request.
 */

export interface RedirectRule {
  source: string
  destination: string
  permanent: boolean
}

function normalise(path: string): string {
  const lower = path.toLowerCase()
  return lower.length > 1 ? lower.replace(/\/+$/, '') : lower
}

/**
 * Exact matches win over wildcards. Among wildcards, the longest prefix wins.
 * Matching ignores case and trailing slashes. The query string is carried over unless the
 * destination sets its own.
 */
export function matchRedirect(
  rules: RedirectRule[],
  pathname: string,
  search: string,
): {destination: string; permanent: boolean} | null {
  const path = normalise(decodeSafe(pathname))

  const exact = rules.find((r) => !r.source.endsWith('/*') && normalise(r.source) === path)
  if (exact) return {destination: withSearch(exact.destination, search), permanent: exact.permanent}

  let best: {rule: RedirectRule; splat: string; length: number} | null = null
  for (const rule of rules) {
    if (!rule.source.endsWith('/*')) continue
    const prefix = normalise(rule.source.slice(0, -2))
    if (path === prefix || path.startsWith(`${prefix}/`)) {
      const splat = path === prefix ? '' : path.slice(prefix.length + 1)
      if (!best || prefix.length > best.length) best = {rule, splat, length: prefix.length}
    }
  }
  if (!best) return null

  const destination = best.rule.destination.includes(':splat')
    ? best.rule.destination.replace(':splat', best.splat).replace(/\/+$/, '') || '/'
    : best.rule.destination
  return {destination: withSearch(destination, search), permanent: best.rule.permanent}
}

function withSearch(destination: string, search: string): string {
  if (!search || destination.includes('?')) return destination
  return `${destination}${search}`
}

function decodeSafe(value: string): string {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}
