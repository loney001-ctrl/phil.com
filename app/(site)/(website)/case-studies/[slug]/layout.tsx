export default function CaseStudySlugLayout({children}: LayoutProps<'/case-studies/[slug]'>) {
  return (
    <div>
      <div className="mb-20 space-y-6">{children}</div>
      <div className="absolute left-0 w-screen border-t" />
    </div>
  )
}
