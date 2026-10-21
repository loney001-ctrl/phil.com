/**
 * Renders a JSON-LD script tag. Escapes `<` so content like "</script>" in a title can never
 * break out of the tag.
 */
export function JsonLd({data}: {data: unknown}) {
  const json = JSON.stringify(data).replace(/</g, '\\u003c')
  return <script type="application/ld+json" dangerouslySetInnerHTML={{__html: json}} />
}
