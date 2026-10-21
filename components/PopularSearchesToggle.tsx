'use client'

import Link from 'next/link'
import {useId, useRef, useState} from 'react'

export interface PopularSearchLink {
  key: string
  label: string
  href: string
  external: boolean
  newTab: boolean
}

const VARIANTS = {
  site: {
    wrapper: 'border-t border-gray-200',
    button: 'text-gray-600 hover:text-black',
    link: 'text-gray-600 hover:text-black',
    panel: 'bg-gray-50',
    font: '',
    pad: 'px-4 md:px-16 lg:px-32',
  },
  home: {
    wrapper: 'border-t-[1.5px] border-[#0A0A0A]',
    button: 'text-[#0A0A0A] hover:text-[#1E3BC8]',
    link: 'text-[#3A3A40] hover:text-[#1E3BC8]',
    panel: 'bg-white',
    font: 'r',
    pad: 'px-5 md:px-10 lg:px-20',
  },
} as const

/**
 * "Popular Searches" footer toggle. Clicking the label opens a panel of links below the footer.
 *
 * The links are always rendered in the server HTML, so crawlers can follow them. While closed the
 * panel is `inert` (not focusable, hidden from assistive tech) and collapsed to zero height.
 */
export function PopularSearchesToggle({
  label,
  links,
  variant = 'site',
}: {
  label: string
  links: PopularSearchLink[]
  variant?: keyof typeof VARIANTS
}) {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const panelRef = useRef<HTMLElement>(null)
  const v = VARIANTS[variant]

  const toggle = () => {
    setOpen((was) => {
      const next = !was
      if (next) {
        // Wait for the expand transition to start, then bring the panel into view.
        requestAnimationFrame(() =>
          setTimeout(
            () => panelRef.current?.scrollIntoView({behavior: 'smooth', block: 'nearest'}),
            200,
          ),
        )
      }
      return next
    })
  }

  return (
    <div className={`w-full ${v.wrapper}`} data-testid="popular-searches">
      <div className={v.pad}>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={toggle}
          className={`${v.font} flex w-full items-center justify-between gap-3 py-5 text-left text-base md:text-lg ${v.button}`}
        >
          <span>{label}</span>
          <svg
            aria-hidden
            viewBox="0 0 20 20"
            className={`h-5 w-5 shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.75}
          >
            <path d="M5 8l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
      <section
        id={panelId}
        ref={panelRef}
        aria-label={label}
        inert={!open}
        className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        } ${v.panel}`}
      >
        <div className="overflow-hidden">
          <ul
            className={`grid grid-cols-1 gap-x-8 gap-y-3 py-8 sm:grid-cols-2 lg:grid-cols-4 ${v.pad}`}
          >
            {links.map((link) => {
              const className = `${v.font} text-sm md:text-base ${v.link}`
              return (
                <li key={link.key}>
                  {link.external ? (
                    <a
                      href={link.href}
                      className={className}
                      {...(link.newTab ? {target: '_blank', rel: 'noopener noreferrer'} : {})}
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      prefetch={false}
                      className={className}
                      {...(link.newTab ? {target: '_blank'} : {})}
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      </section>
    </div>
  )
}
