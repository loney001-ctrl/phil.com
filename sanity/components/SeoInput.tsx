'use client'

import {Badge, Box, Card, Flex, Stack, Text} from '@sanity/ui'
import {useEffect, useMemo, useState} from 'react'
import {useClient, useFormValue, type ObjectInputProps} from 'sanity'

import {PAGE_PATH} from '@/sanity/lib/pagePath'
import {
  analyseSeo,
  applyTitleTemplate,
  extractContent,
  type CheckStatus,
} from '@/sanity/lib/seoAnalysis'

type SeoValue = {
  focusKeyword?: string
  secondaryKeywords?: string[]
  metaTitle?: string
  metaDescription?: string
  noIndex?: boolean
}

type DocValue = {
  _id?: string
  _type?: string
  title?: string
  slug?: {current?: string}
  overview?: unknown
  body?: unknown
  description?: unknown
  parent?: {_ref?: string}
}

type SiteSeo = {siteName?: string; titleTemplate?: string; defaultDescription?: string}

const API_VERSION = '2025-02-27'

function portableTextToPlain(value: unknown): string {
  if (typeof value === 'string') return value
  if (!Array.isArray(value)) return ''
  return value
    .filter((b) => b && (b as {_type?: string})._type === 'block')
    .map((b) =>
      ((b as {children?: {text?: string}[]}).children ?? []).map((c) => c.text ?? '').join(''),
    )
    .join(' ')
}

const TONE: Record<CheckStatus, 'positive' | 'caution' | 'critical'> = {
  pass: 'positive',
  warn: 'caution',
  fail: 'critical',
}
const ICON: Record<CheckStatus, string> = {pass: '✓', warn: '!', fail: '✕'}

/**
 * Renders a SERP preview and the on-page checklist above the default SEO fields.
 */
export function SeoInput(props: ObjectInputProps) {
  const seo = (props.value ?? {}) as SeoValue
  const doc = (useFormValue([]) ?? {}) as DocValue
  const client = useClient({apiVersion: API_VERSION})

  const [site, setSite] = useState<SiteSeo>({})

  useEffect(() => {
    let cancelled = false
    client
      .fetch<SiteSeo | null>(
        `*[_id == "settings"][0].seo{siteName, titleTemplate, defaultDescription}`,
        {},
        {perspective: 'drafts'},
      )
      .then((res) => !cancelled && setSite(res ?? {}))
      .catch(() => undefined)
    return () => {
      cancelled = true
    }
  }, [client])

  const parentRef = doc.parent?._ref
  const wantsParentPath = doc._type === 'page' && !!parentRef
  // Results are stored with the input they belong to, so stale results are ignored on render
  // instead of being reset with a synchronous setState inside the effect.
  const [parentResult, setParentResult] = useState<{ref: string; path: string} | null>(null)
  useEffect(() => {
    let cancelled = false
    if (wantsParentPath && parentRef) {
      client
        .fetch<string | null>(
          `*[_id == $id][0]{"path": ${PAGE_PATH}}.path`,
          {id: parentRef},
          {perspective: 'drafts'},
        )
        .then((res) => {
          if (!cancelled) setParentResult({ref: parentRef, path: res ?? ''})
          return undefined
        })
        .catch(() => undefined)
    }
    return () => {
      cancelled = true
    }
  }, [client, wantsParentPath, parentRef])
  const parentPath = wantsParentPath && parentResult?.ref === parentRef ? parentResult.path : ''

  const keyword = seo.focusKeyword?.trim().toLowerCase()
  const baseId = doc._id?.replace(/^drafts\./, '')
  const [reuseResult, setReuseResult] = useState<{key: string; count: number} | null>(null)
  const reuseKey = keyword && baseId ? `${baseId}:${keyword}` : ''
  useEffect(() => {
    let cancelled = false
    let timer: ReturnType<typeof setTimeout> | undefined
    if (reuseKey && keyword && baseId) {
      timer = setTimeout(() => {
        client
          .fetch<number>(
            `count(*[defined(seo.focusKeyword) && lower(seo.focusKeyword) == $kw && !(_id in [$id, "drafts." + $id]) && !(_id in path("drafts.**"))])`,
            {kw: keyword, id: baseId},
          )
          .then((count) => {
            if (!cancelled) setReuseResult({key: reuseKey, count})
            return undefined
          })
          .catch(() => undefined)
      }, 600)
    }
    return () => {
      cancelled = true
      if (timer) clearTimeout(timer)
    }
  }, [client, reuseKey, keyword, baseId])
  const reuse = reuseKey && reuseResult?.key === reuseKey ? reuseResult.count : undefined

  const slug = doc.slug?.current ?? ''
  const urlPath = useMemo(() => {
    switch (doc._type) {
      case 'home':
        return '/'
      case 'post':
        return `/blog/${slug}`
      case 'caseStudy':
        return `/case-studies/${slug}`
      case 'page':
        return `/${parentPath ? `${parentPath}/` : ''}${slug}`
      default:
        return `/${slug}`
    }
  }, [doc._type, slug, parentPath])

  const renderedTitle =
    seo.metaTitle?.trim() ||
    (doc._type === 'home'
      ? site.siteName || doc.title || ''
      : applyTitleTemplate(site.titleTemplate, doc.title || ''))
  const renderedDescription =
    seo.metaDescription?.trim() ||
    portableTextToPlain(doc.overview) ||
    site.defaultDescription ||
    ''

  const analysis = useMemo(
    () =>
      analyseSeo({
        documentType: doc._type ?? 'page',
        title: doc.title,
        slug: doc._type === 'home' ? undefined : slug,
        renderedTitle,
        renderedDescription,
        focusKeyword: seo.focusKeyword,
        secondaryKeywords: seo.secondaryKeywords,
        content: extractContent(doc.body, doc.description),
        keywordReuseCount: reuse,
      }),
    [
      doc._type,
      doc.title,
      doc.body,
      doc.description,
      slug,
      renderedTitle,
      renderedDescription,
      seo.focusKeyword,
      seo.secondaryKeywords,
      reuse,
    ],
  )

  const origin = typeof window !== 'undefined' ? window.location.host : ''
  const scoreTone =
    analysis.score >= 80 ? 'positive' : analysis.score >= 50 ? 'caution' : 'critical'

  return (
    <Stack gap={4}>
      <Card padding={4} radius={2} border tone="transparent">
        <Stack gap={3}>
          <Text size={1} muted>
            {origin}
            {urlPath.replace(/\/$/, '') || '/'}
          </Text>
          <Text size={3} weight="medium" style={{color: '#1a0dab'}}>
            {truncate(renderedTitle || 'Untitled', 60)}
          </Text>
          <Text size={1} muted>
            {truncate(
              renderedDescription || 'No description. Google will pick text from the page.',
              160,
            )}
          </Text>
          {seo.noIndex && (
            <Box>
              <Badge tone="critical">noindex — this page will not appear in search</Badge>
            </Box>
          )}
        </Stack>
      </Card>

      <Card padding={4} radius={2} border>
        <Stack gap={3}>
          <Flex align="center" justify="space-between">
            <Text size={1} weight="semibold">
              On-page checks
            </Text>
            <Badge tone={scoreTone} fontSize={2}>
              {analysis.score}/100
            </Badge>
          </Flex>
          <Stack gap={2}>
            {analysis.checks.map((check) => (
              <Flex key={check.id} gap={2} align="flex-start">
                <Badge tone={TONE[check.status]} style={{minWidth: 22, textAlign: 'center'}}>
                  {ICON[check.status]}
                </Badge>
                <Stack gap={1} flex={1}>
                  <Text size={1}>{check.label}</Text>
                  {check.detail && (
                    <Text size={0} muted>
                      {check.detail}
                    </Text>
                  )}
                </Stack>
              </Flex>
            ))}
          </Stack>
          <Text size={0} muted>
            Hygiene checks only. A high score does not mean the page satisfies the query. Character
            counts approximate Google&rsquo;s pixel-width truncation.
          </Text>
        </Stack>
      </Card>

      {props.renderDefault(props)}
    </Stack>
  )
}

function truncate(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text
}
