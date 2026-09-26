import {expect, type Page} from '@playwright/test'

export type ShowcaseCaseStudy = {href: string; slug: string; title: string}

export function visibleTitle(page: Page, title: string) {
  return page.getByTestId('page-title').filter({hasText: title, visible: true})
}

export async function readShowcaseCaseStudies(page: Page): Promise<ShowcaseCaseStudy[]> {
  await page.goto('/')
  const links = page.locator('a[href^="/case-studies/"]')
  await expect(links.first()).toBeVisible({timeout: 20000})
  const raw = await links.evaluateAll((els) =>
    els.map((el) => {
      const href = el.getAttribute('href') || ''
      const slug = href.split('/').filter(Boolean).pop() || ''
      const title = (
        el.querySelector('.font-extrabold')?.textContent ||
        el.textContent ||
        ''
      ).trim()
      return {href, slug, title}
    }),
  )
  const seen = new Set<string>()
  return raw.filter((caseStudy) => {
    if (!caseStudy.slug || seen.has(caseStudy.slug)) return false
    seen.add(caseStudy.slug)
    return true
  })
}

export function caseStudyUrlPattern(href: string) {
  return new RegExp(`${href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\?|$)`)
}
