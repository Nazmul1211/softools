import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { client, SOFTWARE_REVIEWS_QUERY, urlFor } from '@/sanity'
import type { SoftwareReviewListItem } from '@/sanity/types'
import { Star } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Software Reviews - Softzar',
  description: 'Honest, in-depth software reviews to help you make informed decisions. Find the best tools for your needs.',
}

export const revalidate = 3600 // Revalidate every hour

async function getSoftwareReviews(): Promise<SoftwareReviewListItem[]> {
  return client.fetch(SOFTWARE_REVIEWS_QUERY)
}

function formatDate(dateString: string | undefined) {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating
              ? 'fill-yellow-400 text-yellow-400'
              : star - 0.5 <= rating
                ? 'fill-yellow-400/50 text-yellow-400'
                : 'text-gray-300'
          }`}
        />
      ))}
      <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
    </div>
  )
}

export default async function SoftwareReviewsPage() {
  const reviews = await getSoftwareReviews()

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Software Reviews</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Honest, in-depth reviews of the best software and tools. We test and rate each product to help you make informed decisions.
          </p>
        </div>

        {/* Reviews Grid */}
        {reviews.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">No reviews yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review) => (
              <article
                key={review._id}
                className="group bg-card rounded-lg border shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <Link href={`/software-reviews/${review.slug?.current}`}>
                  {/* Featured Image */}
                  {review.featuredImage?.asset && (
                    <div className="relative aspect-video overflow-hidden">
                      <Image
                        src={urlFor(review.featuredImage).width(600).height(340).url()}
                        alt={review.featuredImage.alt || review.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  <div className="p-6">
                    {/* Software Logo & Name */}
                    <div className="flex items-center gap-3 mb-3">
                      {review.softwareLogo && (
                        <Image
                          src={urlFor(review.softwareLogo).width(40).height(40).url()}
                          alt={review.softwareName}
                          width={40}
                          height={40}
                          className="rounded"
                        />
                      )}
                      <span className="text-sm font-medium text-muted-foreground">
                        {review.softwareName}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {review.title}
                    </h2>

                    {/* Rating */}
                    <div className="mb-3">
                      <RatingStars rating={review.overallRating} />
                    </div>

                    {/* Excerpt */}
                    {review.excerpt && (
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {review.excerpt}
                      </p>
                    )}

                    {/* Meta */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      {review.author && (
                        <span>By {review.author.name}</span>
                      )}
                      {review.lastUpdated && (
                        <span>Updated {formatDate(review.lastUpdated)}</span>
                      )}
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
