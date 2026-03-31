import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { client, COMPARISON_BY_SLUG_QUERY, COMPARISONS_QUERY, urlFor } from '@/sanity'
import { PortableText } from '@/components/sanity'
import type { Comparison, ComparisonListItem } from '@/sanity/types'
import { Star, Check, Trophy, ArrowLeft, ExternalLink } from 'lucide-react'

export const revalidate = 3600

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getComparison(slug: string): Promise<Comparison | null> {
  return client.fetch(COMPARISON_BY_SLUG_QUERY, { slug })
}

async function getAllComparisons(): Promise<ComparisonListItem[]> {
  return client.fetch(COMPARISONS_QUERY)
}

export async function generateStaticParams() {
  const comparisons = await getAllComparisons()
  return comparisons.map((comparison) => ({
    slug: comparison.slug?.current || '',
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const comparison = await getComparison(slug)

  if (!comparison) {
    return { title: 'Comparison Not Found - Softzar' }
  }

  const seoTitle = comparison.seo?.metaTitle || comparison.title
  const seoDescription = comparison.seo?.metaDescription || comparison.excerpt

  return {
    title: `${seoTitle} - Softzar`,
    description: seoDescription,
    keywords: comparison.seo?.keywords,
    openGraph: {
      title: seoTitle,
      description: seoDescription || '',
      type: 'article',
      images: comparison.seo?.ogImage?.asset
        ? [urlFor(comparison.seo.ogImage).width(1200).height(630).url()]
        : comparison.featuredImage?.asset
          ? [urlFor(comparison.featuredImage).width(1200).height(630).url()]
          : [],
    },
  }
}

function formatDate(dateString: string | undefined) {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function RatingStars({ rating }: { rating?: number }) {
  if (!rating) return null
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating
              ? 'fill-yellow-400 text-yellow-400'
              : 'text-gray-300'
          }`}
        />
      ))}
      <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
    </div>
  )
}

export default async function ComparisonPage({ params }: PageProps) {
  const { slug } = await params
  const comparison = await getComparison(slug)

  if (!comparison) {
    notFound()
  }

  const items = comparison.comparisonItems || []
  const winnerIndex = comparison.winner?.itemIndex

  return (
    <article className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          {/* Back Link */}
          <Link
            href="/compare"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Comparisons
          </Link>

          {/* Header */}
          <header className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {comparison.title}
            </h1>
            {comparison.excerpt && (
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                {comparison.excerpt}
              </p>
            )}
            {comparison.lastUpdated && (
              <p className="text-sm text-muted-foreground mt-4">
                Last updated: {formatDate(comparison.lastUpdated)}
              </p>
            )}
          </header>

          {/* VS Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
            {items.map((item, index) => (
              <div
                key={item.name}
                className={`relative p-6 bg-card rounded-xl border-2 ${
                  winnerIndex === index
                    ? 'border-green-500 shadow-lg'
                    : 'border-border'
                }`}
              >
                {winnerIndex === index && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-green-500 text-white text-sm font-medium rounded-full flex items-center gap-1">
                    <Trophy className="h-4 w-4" />
                    Winner
                  </div>
                )}

                <div className="text-center mb-4">
                  {item.logo && (
                    <Image
                      src={urlFor(item.logo).width(64).height(64).url()}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="mx-auto mb-3 rounded-lg"
                    />
                  )}
                  <h2 className="text-xl font-bold">{item.name}</h2>
                  {item.description && (
                    <p className="text-sm text-muted-foreground mt-2">{item.description}</p>
                  )}
                </div>

                <div className="space-y-3">
                  {item.overallRating && (
                    <div className="flex justify-center">
                      <RatingStars rating={item.overallRating} />
                    </div>
                  )}
                  {item.pricing && (
                    <p className="text-center font-medium">{item.pricing}</p>
                  )}
                </div>

                <div className="mt-4 flex gap-2 justify-center">
                  {item.website && (
                    <a
                      href={item.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 text-sm bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                    >
                      Website
                    </a>
                  )}
                  {item.affiliateLink && (
                    <a
                      href={item.affiliateLink}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Try Free
                    </a>
                  )}
                </div>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        {comparison.comparisonTable && comparison.comparisonTable.length > 0 && (
          <div className="mb-12 overflow-x-auto">
            <h2 className="text-2xl font-bold mb-4">Feature Comparison</h2>
            <table className="w-full bg-card rounded-lg border">
              <thead>
                <tr className="border-b">
                  <th className="p-4 text-left font-semibold">Feature</th>
                  {items.map((item) => (
                    <th key={item.name} className="p-4 text-center font-semibold">
                      {item.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparison.comparisonTable.map((row, rowIndex) => (
                  <tr key={rowIndex} className="border-b last:border-b-0">
                    <td className="p-4 font-medium">{row.feature}</td>
                    {items.map((_, itemIndex) => {
                      const value = row.values?.find((v) => v.itemIndex === itemIndex)
                      return (
                        <td
                          key={itemIndex}
                          className={`p-4 text-center ${
                            value?.isWinner ? 'bg-green-50 dark:bg-green-950/20' : ''
                          }`}
                        >
                          {value?.isWinner && (
                            <Check className="inline h-4 w-4 text-green-600 mr-1" />
                          )}
                          {value?.value || '-'}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Best For Recommendations */}
        {comparison.bestFor && comparison.bestFor.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Who Should Choose What?</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {comparison.bestFor.map((rec, index) => (
                <div key={index} className="p-4 bg-card rounded-lg border">
                  <h3 className="font-semibold mb-2">{rec.useCase}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-primary/10 text-primary text-sm font-medium rounded">
                      {items[rec.itemIndex || 0]?.name}
                    </span>
                  </div>
                  {rec.reason && (
                    <p className="text-sm text-muted-foreground">{rec.reason}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Winner Section */}
        {comparison.winner && (
          <div className="mb-12 p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl border border-green-200 dark:border-green-900">
            <div className="flex items-center gap-3 mb-3">
              <Trophy className="h-8 w-8 text-green-600" />
              <h2 className="text-2xl font-bold">Our Pick: {items[winnerIndex || 0]?.name}</h2>
            </div>
            {comparison.winner.reason && (
              <p className="text-lg">{comparison.winner.reason}</p>
            )}
            {items[winnerIndex || 0]?.affiliateLink && (
              <a
                href={items[winnerIndex || 0].affiliateLink}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Try {items[winnerIndex || 0]?.name}
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        )}

        {/* Content */}
        {comparison.content && (
          <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
            <PortableText value={comparison.content} />
          </div>
        )}

        {/* FAQs */}
        {comparison.faqs && comparison.faqs.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {comparison.faqs.map((faq, index) => (
                <div key={index} className="p-4 bg-card rounded-lg border">
                  <h3 className="font-semibold mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        </div>
      </div>
    </article>
  )
}
