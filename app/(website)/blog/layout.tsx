import {Inter_Tight, Newsreader} from 'next/font/google'

const display = Inter_Tight({
  variable: '--font-blog-display',
  subsets: ['latin'],
  weight: ['700', '800', '900'],
})
const serif = Newsreader({
  variable: '--font-blog-serif',
  subsets: ['latin'],
  weight: ['400', '500'],
})

/**
 * Brings the homepage's brand typefaces (Inter Tight / Newsreader) and accent colors into the
 * blog index and post templates, toned down for reading rather than the homepage's full-bleed
 * treatment. Still sits inside the generic (website) Navbar/Footer chrome — unifying the
 * site-wide chrome with the new brand is a separate, later step.
 */
export default function BlogLayout({children}: LayoutProps<'/blog'>) {
  return <div className={`${display.variable} ${serif.variable} blog-page`}>{children}</div>
}
