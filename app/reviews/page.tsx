import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { client, REVIEWS_QUERY, urlFor } from '@/sanity'
import type { ReviewListItem } from '@/sanity/types'
import { Star } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Product Reviews - Softzar',
  description: 'Honest, in-depth product reviews covering gadgets, software, services, and more. Find the best products for your needs.',
}

export const revalidate = 3600 // Revalidate every hour

async function getReviews(): Promise<ReviewListItem[]> {
  return client.fetch(REVIEWS_QUERY)
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

const productTypeLabels: Record<string, { label: string; icon: string }> = {
  gadget: { label: 'Gadget / Hardware', icon: '📱' },
  software: { label: 'Software / App', icon: '💻' },
  service: { label: 'Service', icon: '🔧' },
  subscription: { label: 'Subscription', icon: '📦' },
  physical: { label: 'Physical Product', icon: '🛍️' },
  course: { label: 'Course / Education', icon: '📚' },
  other: { label: 'Other', icon: '📝' },
}

export default async function ReviewsPage() {
  const reviews = await getReviews()

  // Group reviews by product type
  const reviewsByType = reviews.reduce((acc, review) => {
    const type = review.productType || 'other'
    if (!acc[type]) acc[type] = []
    acc[type].push(review)
    return acc
  }, {} as Record<string, ReviewListItem[]>)

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Product Reviews</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Honest, in-depth reviews of gadgets, software, services, and more. We test and rate each product to help you make informed decisions.
          </p>
        </div>

        {/* Reviews Grid */}
        {reviews.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">No reviews yet. Check back soon!</p>
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(reviewsByType).map(([type, typeReviews]) => (
              <section key={type}>
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-2xl">{productTypeLabels[type]?.icon || '📝'}</span>
                  <h2 className="text-2xl font-bold">{productTypeLabels[type]?.label || 'Other'}</h2>
                  <span className="text-muted-foreground ml-2">({typeReviews.length})</span>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {typeReviews.map((review) => (
                    <article
                      key={review._id}
                      className="group bg-card rounded-lg border shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <Link href={`/reviews/${review.slug?.current}`}>
                        {/* Featured or Product Image */}
                        {(review.featuredImage?.asset || review.productImage?.asset) && (
                          <div className="relative aspect-video overflow-hidden">
                            <Image
                              src={urlFor(review.featuredImage || review.productImage!).width(600).height(340).url()}
                              alt={(review.featuredImage?.alt || review.productImage?.alt) || review.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}

                        <div className="p-6">
                          {/* Product Brand & Name */}
                          <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
                            {review.productBrand && (
                              <>
                                <span className="font-medium">{review.productBrand}</span>
                                <span>•</span>
                              </>
                            )}
                            <span>{review.productName}</span>
                          </div>

                          {/* Title */}
                          <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                            {review.title}
                          </h3>

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

                          {/* Tags */}
                          {review.tags && review.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {review.tags.slice(0, 3).map((tag, i) => (
                                <span
                                  key={i}
                                  className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Meta */}
                          <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t">
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
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
