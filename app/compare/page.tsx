import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { client, COMPARISONS_QUERY, urlFor } from '@/sanity'
import type { ComparisonListItem } from '@/sanity/types'
import { ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Software Comparisons - Softzar',
  description: 'Compare software side by side. Find the best tool for your needs with our detailed comparison guides.',
}

export const revalidate = 3600

async function getComparisons(): Promise<ComparisonListItem[]> {
  return client.fetch(COMPARISONS_QUERY)
}

function formatDate(dateString: string | undefined) {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default async function ComparisonsPage() {
  const comparisons = await getComparisons()

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Software Comparisons</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Compare software side by side. We analyze features, pricing, and performance to help you make the right choice.
          </p>
        </div>

        {/* Comparisons Grid */}
        {comparisons.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">No comparisons yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {comparisons.map((comparison) => (
              <article
                key={comparison._id}
                className="group bg-card rounded-lg border shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <Link href={`/compare/${comparison.slug?.current}`}>
                  {/* VS Header */}
                  <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
                    <div className="flex items-center justify-center gap-4">
                      {comparison.comparisonItems?.slice(0, 2).map((item, index) => (
                        <>
                          {index === 1 && (
                            <span className="text-xl font-bold text-muted-foreground">VS</span>
                          )}
                          <div key={item.name} className="text-center">
                            {item.logo && (
                              <Image
                                src={urlFor(item.logo).width(48).height(48).url()}
                                alt={item.name}
                                width={48}
                                height={48}
                                className="mx-auto mb-2 rounded"
                              />
                            )}
                            <span className="text-sm font-medium">{item.name}</span>
                          </div>
                        </>
                      ))}
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Title */}
                    <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {comparison.title}
                    </h2>

                    {/* Excerpt */}
                    {comparison.excerpt && (
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {comparison.excerpt}
                      </p>
                    )}

                    {/* Winner Badge */}
                    {comparison.winner && comparison.comparisonItems && (
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-sm text-muted-foreground">Winner:</span>
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-medium rounded">
                          {comparison.comparisonItems[comparison.winner.itemIndex || 0]?.name}
                        </span>
                      </div>
                    )}

                    {/* Read More */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {formatDate(comparison.lastUpdated || comparison.publishedAt)}
                      </span>
                      <span className="inline-flex items-center gap-1 text-primary text-sm font-medium group-hover:gap-2 transition-all">
                        Read comparison
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
