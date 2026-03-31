import { PortableText as PortableTextReact, PortableTextComponents } from '@portabletext/react'
import type { PortableTextBlock } from 'sanity'
import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/sanity'

// Helper to extract YouTube video ID
function getYouTubeId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return match && match[2].length === 11 ? match[2] : null
}

// Helper to extract Vimeo video ID
function getVimeoId(url: string): string | null {
  const regExp = /vimeo\.com\/(?:.*\/)?(\d+)/
  const match = url.match(regExp)
  return match ? match[1] : null
}

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset?._ref) {
        return null
      }
      const alignmentClasses: Record<string, string> = {
        left: 'float-left mr-6 mb-4 max-w-md',
        center: 'mx-auto max-w-2xl',
        right: 'float-right ml-6 mb-4 max-w-md',
        full: 'w-full',
      }
      const alignment = value.alignment || 'center'
      
      return (
        <figure className={`my-8 ${alignmentClasses[alignment]}`}>
          <Image
            src={urlFor(value).width(800).url()}
            alt={value.alt || 'Blog image'}
            width={800}
            height={450}
            className="rounded-lg w-full h-auto max-h-[500px] object-contain"
          />
          {value.caption && (
            <figcaption className="text-center text-sm text-muted-foreground mt-2">
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },
    code: ({ value }) => {
      return (
        <div className="my-6">
          {value.filename && (
            <div className="bg-slate-800 text-slate-300 text-sm px-4 py-2 rounded-t-lg border-b border-slate-700">
              {value.filename}
            </div>
          )}
          <pre className={`p-4 bg-slate-900 text-slate-100 overflow-x-auto ${value.filename ? 'rounded-b-lg' : 'rounded-lg'}`}>
            <code className={`language-${value.language || 'plaintext'} text-sm`}>
              {value.code}
            </code>
          </pre>
        </div>
      )
    },
    table: ({ value }) => {
      if (!value?.rows?.length) return null
      
      return (
        <div className="my-6 overflow-x-auto">
          <table className="w-full border-collapse border border-border rounded-lg">
            <tbody>
              {value.rows.map((row: { cells: string[]; _key: string }, rowIndex: number) => (
                <tr key={row._key} className={rowIndex === 0 ? 'bg-muted font-semibold' : 'even:bg-muted/50'}>
                  {row.cells.map((cell: string, cellIndex: number) => {
                    const CellTag = rowIndex === 0 ? 'th' : 'td'
                    return (
                      <CellTag
                        key={cellIndex}
                        className="border border-border px-4 py-2 text-left"
                      >
                        {cell}
                      </CellTag>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    },
    callout: ({ value }) => {
      const typeStyles: Record<string, { bg: string; border: string; icon: string }> = {
        info: { bg: 'bg-blue-50 dark:bg-blue-950/30', border: 'border-blue-500', icon: 'ℹ️' },
        warning: { bg: 'bg-yellow-50 dark:bg-yellow-950/30', border: 'border-yellow-500', icon: '⚠️' },
        success: { bg: 'bg-green-50 dark:bg-green-950/30', border: 'border-green-500', icon: '✅' },
        error: { bg: 'bg-red-50 dark:bg-red-950/30', border: 'border-red-500', icon: '❌' },
        tip: { bg: 'bg-purple-50 dark:bg-purple-950/30', border: 'border-purple-500', icon: '💡' },
      }
      const style = typeStyles[value.type || 'info']
      
      return (
        <div className={`my-6 p-4 rounded-lg border-l-4 ${style.bg} ${style.border}`}>
          {value.title && (
            <div className="font-semibold mb-2 flex items-center gap-2">
              <span>{style.icon}</span>
              {value.title}
            </div>
          )}
          <p className="text-sm leading-relaxed">{value.content}</p>
        </div>
      )
    },
    youtube: ({ value }) => {
      const videoId = value.url ? getYouTubeId(value.url) : null
      if (!videoId) return null
      
      return (
        <figure className="my-8">
          <div className="relative aspect-video rounded-lg overflow-hidden">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
          {value.caption && (
            <figcaption className="text-center text-sm text-muted-foreground mt-2">
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },
    ctaButton: ({ value }) => {
      const styleClasses: Record<string, string> = {
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        outline: 'border border-primary text-primary hover:bg-primary/10',
      }
      
      return (
        <div className="my-6 flex justify-center">
          <a
            href={value.url}
            target={value.openInNewTab ? '_blank' : undefined}
            rel={value.openInNewTab ? 'noopener noreferrer' : undefined}
            className={`inline-flex items-center justify-center rounded-lg px-6 py-3 font-medium transition-colors ${styleClasses[value.style || 'primary']}`}
          >
            {value.text}
          </a>
        </div>
      )
    },
    divider: ({ value }) => {
      if (value.style === 'dots') {
        return <div className="my-8 text-center text-2xl text-muted-foreground">• • •</div>
      }
      if (value.style === 'stars') {
        return <div className="my-8 text-center text-2xl text-muted-foreground">★ ★ ★</div>
      }
      if (value.style === 'space') {
        return <div className="my-12" />
      }
      return <hr className="my-8 border-t border-border" />
    },
    faqItem: ({ value }) => {
      return (
        <details className="my-4 group border border-border rounded-lg">
          <summary className="cursor-pointer list-none p-4 font-medium flex items-center justify-between">
            <span>{value.question}</span>
            <span className="text-muted-foreground group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div className="px-4 pb-4 text-muted-foreground">
            {value.answer}
          </div>
        </details>
      )
    },
    // Video embed (Vimeo, etc.)
    videoEmbed: ({ value }) => {
      if (!value?.url) return null
      const vimeoId = getVimeoId(value.url)
      
      return (
        <figure className="my-8">
          <div className="relative aspect-video rounded-lg overflow-hidden">
            {vimeoId ? (
              <iframe
                src={`https://player.vimeo.com/video/${vimeoId}`}
                title="Video"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            ) : (
              <iframe
                src={value.url}
                title="Video"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            )}
          </div>
          {value.caption && (
            <figcaption className="text-center text-sm text-muted-foreground mt-2">
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },
    // Accordion/Collapsible Section
    accordion: ({ value }) => {
      return (
        <details className={`my-4 group border border-border rounded-lg ${value.defaultOpen ? 'open' : ''}`} open={value.defaultOpen}>
          <summary className="cursor-pointer list-none p-4 font-semibold flex items-center justify-between bg-muted/30 rounded-t-lg">
            <span>{value.title}</span>
            <span className="text-muted-foreground group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div className="p-4 border-t border-border">
            {value.content}
          </div>
        </details>
      )
    },
    // Quote/Testimonial
    testimonial: ({ value }) => {
      const styleClasses: Record<string, string> = {
        simple: 'border-l-4 border-primary pl-6 py-2',
        card: 'bg-muted/30 p-6 rounded-xl shadow-sm',
        large: 'text-xl italic text-center py-8 px-12 bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl',
      }
      
      return (
        <figure className={`my-8 ${styleClasses[value.style || 'simple']}`}>
          <blockquote className={value.style === 'large' ? 'mb-4' : ''}>
            <p className={`${value.style === 'large' ? 'text-2xl' : 'text-lg'} italic leading-relaxed`}>
              "{value.quote}"
            </p>
          </blockquote>
          {(value.author || value.authorTitle) && (
            <figcaption className={`flex items-center gap-3 mt-4 ${value.style === 'large' ? 'justify-center' : ''}`}>
              {value.authorImage?.asset && (
                <Image
                  src={urlFor(value.authorImage).width(48).height(48).url()}
                  alt={value.author || 'Author'}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
              )}
              <div>
                {value.author && <cite className="font-medium not-italic">{value.author}</cite>}
                {value.authorTitle && <p className="text-sm text-muted-foreground">{value.authorTitle}</p>}
              </div>
            </figcaption>
          )}
        </figure>
      )
    },
    // File Download
    fileDownload: ({ value }) => {
      const downloadUrl = value.file?.asset?.url || value.externalUrl
      if (!downloadUrl) return null
      
      return (
        <div className="my-6 flex items-center gap-4 p-4 bg-muted/30 rounded-lg border border-border">
          <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <span className="text-2xl">📥</span>
          </div>
          <div className="flex-grow">
            <h4 className="font-medium">{value.title}</h4>
            {value.description && <p className="text-sm text-muted-foreground">{value.description}</p>}
          </div>
          <a
            href={downloadUrl}
            download
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Download
          </a>
        </div>
      )
    },
    // Social Media Embed
    socialEmbed: ({ value }) => {
      const platformIcons: Record<string, string> = {
        twitter: '𝕏',
        instagram: '📷',
        tiktok: '🎵',
        linkedin: '💼',
      }
      
      return (
        <div className="my-8">
          <a
            href={value.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{platformIcons[value.platform] || '🔗'}</span>
              <div>
                <p className="font-medium capitalize">{value.platform} Post</p>
                <p className="text-sm text-muted-foreground truncate">{value.url}</p>
              </div>
            </div>
          </a>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Click to view on {value.platform}
          </p>
        </div>
      )
    },
    // Author Card
    authorCard: ({ value }) => {
      if (!value?.author) return null
      
      return (
        <div className="my-8 p-6 bg-muted/30 rounded-xl border border-border">
          <div className="flex items-start gap-4">
            {value.author.image?.asset && (
              <Image
                src={urlFor(value.author.image).width(80).height(80).url()}
                alt={value.author.name || 'Author'}
                width={80}
                height={80}
                className="rounded-full"
              />
            )}
            <div className="flex-grow">
              <h4 className="font-semibold text-lg">{value.author.name}</h4>
              {value.author.role && <p className="text-sm text-muted-foreground">{value.author.role}</p>}
              {value.showBio && value.author.bio && (
                <p className="mt-2 text-sm leading-relaxed">{value.author.bio}</p>
              )}
              {value.showSocialLinks && value.author.social && (
                <div className="mt-3 flex gap-3">
                  {value.author.social.twitter && (
                    <a href={value.author.social.twitter} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">Twitter</a>
                  )}
                  {value.author.social.linkedin && (
                    <a href={value.author.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">LinkedIn</a>
                  )}
                  {value.author.social.website && (
                    <a href={value.author.social.website} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">Website</a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )
    },
    // Two Column Layout
    twoColumn: ({ value }) => {
      const ratioClasses: Record<string, { left: string; right: string }> = {
        '50-50': { left: 'md:w-1/2', right: 'md:w-1/2' },
        '60-40': { left: 'md:w-3/5', right: 'md:w-2/5' },
        '40-60': { left: 'md:w-2/5', right: 'md:w-3/5' },
        '70-30': { left: 'md:w-[70%]', right: 'md:w-[30%]' },
        '30-70': { left: 'md:w-[30%]', right: 'md:w-[70%]' },
      }
      const classes = ratioClasses[value.ratio || '50-50']
      
      return (
        <div className="my-8 flex flex-col md:flex-row gap-6">
          <div className={`${classes.left} whitespace-pre-wrap`}>{value.leftColumn}</div>
          <div className={`${classes.right} whitespace-pre-wrap`}>{value.rightColumn}</div>
        </div>
      )
    },
    // Pros & Cons
    prosCons: ({ value }) => {
      return (
        <div className="my-8">
          {value.title && <h4 className="font-semibold text-lg mb-4">{value.title}</h4>}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-900">
              <h5 className="font-semibold text-green-700 dark:text-green-400 mb-3 flex items-center gap-2">
                <span>✅</span> Pros
              </h5>
              <ul className="space-y-2">
                {value.pros?.map((pro: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-green-600 mt-0.5">•</span>
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-900">
              <h5 className="font-semibold text-red-700 dark:text-red-400 mb-3 flex items-center gap-2">
                <span>❌</span> Cons
              </h5>
              <ul className="space-y-2">
                {value.cons?.map((con: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-red-600 mt-0.5">•</span>
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )
    },
    // Feature List
    featureList: ({ value }) => {
      return (
        <div className="my-8 p-6 bg-muted/30 rounded-xl border border-border">
          {value.title && <h4 className="font-semibold text-lg mb-4">{value.title}</h4>}
          <ul className="space-y-3">
            {value.features?.map((feature: { text: string; included: boolean }, i: number) => (
              <li key={i} className="flex items-center gap-3">
                <span className={feature.included ? 'text-green-500' : 'text-red-500'}>
                  {feature.included ? '✅' : '❌'}
                </span>
                <span className={feature.included ? '' : 'text-muted-foreground line-through'}>
                  {feature.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )
    },
  },
  block: {
    h2: ({ children }) => (
      <h2 className="text-2xl font-bold mt-8 mb-4 scroll-mt-20" id={typeof children === 'string' ? children.toString().toLowerCase().replace(/\s+/g, '-') : undefined}>
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-semibold mt-6 mb-3">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-lg font-semibold mt-4 mb-2">
        {children}
      </h4>
    ),
    h5: ({ children }) => (
      <h5 className="text-base font-semibold mt-3 mb-2">
        {children}
      </h5>
    ),
    normal: ({ children }) => (
      <p className="mb-4 leading-relaxed">
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-primary pl-4 my-4 italic text-muted-foreground">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    underline: ({ children }) => <u className="underline">{children}</u>,
    'strike-through': ({ children }) => <s className="line-through">{children}</s>,
    code: ({ children }) => (
      <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
        {children}
      </code>
    ),
    highlight: ({ children }) => (
      <mark className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">
        {children}
      </mark>
    ),
    sup: ({ children }) => <sup className="text-xs">{children}</sup>,
    sub: ({ children }) => <sub className="text-xs">{children}</sub>,
    footnote: ({ value, children }) => (
      <span className="relative group">
        {children}
        <sup className="text-primary cursor-help">[*]</sup>
        <span className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-popover text-popover-foreground text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none w-64 z-10">
          {value?.note}
        </span>
      </span>
    ),
    link: ({ value, children }) => {
      const target = value?.openInNewTab ? '_blank' : undefined
      const rel = value?.openInNewTab ? 'noopener noreferrer' : undefined
      
      // Check if it's an internal link
      if (value?.href?.startsWith('/')) {
        return (
          <Link href={value.href} className="text-primary hover:underline">
            {children}
          </Link>
        )
      }
      
      return (
        <a
          href={value?.href}
          target={target}
          rel={rel}
          className="text-primary hover:underline"
        >
          {children}
        </a>
      )
    },
    internalLink: ({ value, children }) => {
      // For internal links to other documents
      const href = value?.reference?.slug?.current
        ? `/${value.reference._type === 'blogPost' ? 'blog' : value.reference._type === 'review' ? 'reviews' : 'compare'}/${value.reference.slug.current}`
        : '#'
      
      return (
        <Link href={href} className="text-primary hover:underline">
          {children}
        </Link>
      )
    },
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-inside mb-4 space-y-1">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-inside mb-4 space-y-1">
        {children}
      </ol>
    ),
    check: ({ children }) => (
      <ul className="mb-4 space-y-1">
        {children}
      </ul>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="ml-4">{children}</li>,
    number: ({ children }) => <li className="ml-4">{children}</li>,
    check: ({ children }) => (
      <li className="ml-4 flex items-start gap-2">
        <span className="text-green-500">✓</span>
        <span>{children}</span>
      </li>
    ),
  },
}

interface PortableTextProps {
  value: PortableTextBlock[]
  className?: string
}

export function PortableText({ value, className }: PortableTextProps) {
  return (
    <div className={className}>
      <PortableTextReact value={value} components={components} />
    </div>
  )
}
