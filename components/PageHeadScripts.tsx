'use client'

import {useEffect} from 'react'

export interface ClientScript {
  props: Record<string, string | boolean>
  content: string
}

const PROP_TO_ATTR: Record<string, string> = {
  className: 'class',
  crossOrigin: 'crossorigin',
  noModule: 'nomodule',
  referrerPolicy: 'referrerpolicy',
  fetchPriority: 'fetchpriority',
}

/**
 * Runs a page's own <script> tags.
 *
 * Scripts that React renders from an HTML string never execute after a client-side navigation.
 * So per-page scripts are created with document.createElement and appended to <head> on mount,
 * which executes them on every visit to the page. They are removed again when the page unmounts.
 * Note: removing a script element does not undo what it already did (globals, listeners).
 */
export function PageHeadScripts({scripts, id}: {scripts: ClientScript[]; id: string}) {
  // Re-run only when the code itself changes, not when a refresh hands over a new array instance.
  const signature = JSON.stringify(scripts)
  useEffect(() => {
    const parsed = JSON.parse(signature) as ClientScript[]
    const created: HTMLScriptElement[] = []
    for (const [index, script] of parsed.entries()) {
      const el = document.createElement('script')
      for (const [prop, value] of Object.entries(script.props)) {
        const attr = PROP_TO_ATTR[prop] ?? prop
        if (value === true) el.setAttribute(attr, '')
        else if (value !== false) el.setAttribute(attr, value)
      }
      // Dynamically inserted scripts are async by default. Keep source order unless asked otherwise.
      if (script.props.src && script.props.async !== true) el.async = false
      el.dataset.pageHeadCode = `${id}:${index}`
      if (script.content) el.text = script.content
      document.head.appendChild(el)
      created.push(el)
    }
    return () => {
      for (const el of created) el.remove()
    }
  }, [signature, id])

  return null
}
