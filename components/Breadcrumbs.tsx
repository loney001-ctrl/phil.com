import {stegaClean} from 'next-sanity'
import Link from 'next/link'

import type {Crumb} from '@/sanity/lib/jsonLd'

/**
 * Visible breadcrumb trail. Mirrors the BreadcrumbList JSON-LD on the same page, which Google
 * requires to match what users see.
 */
export function Breadcrumbs({items, current}: {items: Crumb[]; current: string}) {
  if (!items.length) return null
  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-sm text-gray-500">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <li>
          <Link href="/" className="hover:text-black">
            Home
          </Link>
        </li>
        {items.map((crumb) => (
          <li key={crumb.path} className="flex items-center gap-2">
            <span aria-hidden>/</span>
            <Link href={crumb.path} className="hover:text-black">
              {stegaClean(crumb.name)}
            </Link>
          </li>
        ))}
        <li className="flex items-center gap-2">
          <span aria-hidden>/</span>
          <span aria-current="page" className="text-gray-800">
            {current}
          </span>
        </li>
      </ol>
    </nav>
  )
}
