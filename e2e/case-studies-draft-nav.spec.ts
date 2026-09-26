import {expect, test} from '@playwright/test'
import {createClient} from '@sanity/client'
import {createPreviewSecret} from '@sanity/preview-url-secret/create-secret'

import {caseStudyUrlPattern, readShowcaseCaseStudies, visibleTitle} from './showcase'

test.describe('draft-mode case study navigation', () => {
  test.skip(
    !process.env.SANITY_API_WRITE_TOKEN ||
      !process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
      !process.env.NEXT_PUBLIC_SANITY_DATASET,
    'Requires Sanity write token and project env to enable draft mode',
  )

  test('opening every case study in draft mode shows that case study', async ({page, baseURL}) => {
    const caseStudies = await readShowcaseCaseStudies(page)
    expect(caseStudies.length, 'homepage showcase needs a case study link').toBeGreaterThanOrEqual(
      1,
    )

    const client = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
      token: process.env.SANITY_API_WRITE_TOKEN,
      apiVersion: '2025-02-19',
      useCdn: false,
    })
    const {secret} = await createPreviewSecret(client, 'draft-nav-e2e', '/studio')
    const enableUrl = new URL('/api/draft-mode/enable', baseURL)
    enableUrl.searchParams.set('sanity-preview-secret', secret)
    // Enable draft on the home page and then navigate into case studies client-side. Starting
    // from "/" (not a case study) is what exposes the sticky-navigation bug: the showcase
    // links prefetch a sibling case study, and every subsequent /case-studies/[slug]
    // navigation would otherwise reuse that one prefetched RSC.
    enableUrl.searchParams.set('sanity-preview-pathname', '/')
    enableUrl.searchParams.set('sanity-preview-perspective', 'drafts')

    await page.goto(enableUrl.toString(), {waitUntil: 'domcontentloaded'})
    await expect(page.getByText('Draft Mode Enabled')).toBeVisible({timeout: 20000})

    // Let the showcase links prefetch before navigating; the bug is that a prefetched
    // sibling's RSC gets reused for the whole /case-studies/[slug] segment.
    const homeLink = page.getByTestId('nav-link-home')
    for (const caseStudy of caseStudies) {
      const card = page.locator(`a[href="${caseStudy.href}"]`).first()
      await expect(card).toBeVisible({timeout: 20000})
    }
    await page.waitForTimeout(1500)

    for (const caseStudy of caseStudies) {
      if (new URL(page.url()).pathname !== '/') {
        await homeLink.click()
        await page.waitForURL((url) => new URL(url).pathname === '/', {timeout: 10000})
        await page.waitForTimeout(500)
      }
      // Click the showcase card directly from "/" (a client-side navigation).
      await page.locator(`a[href="${caseStudy.href}"]`).first().click()
      await expect(page).toHaveURL(caseStudyUrlPattern(caseStudy.href))
      await expect(visibleTitle(page, caseStudy.title)).toBeVisible({timeout: 10000})
      for (const other of caseStudies) {
        if (other.slug === caseStudy.slug) continue
        await expect(visibleTitle(page, other.title)).toHaveCount(0)
      }
    }
  })
})
