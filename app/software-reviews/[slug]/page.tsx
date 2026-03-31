import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { client, SOFTWARE_REVIEW_BY_SLUG_QUERY, SOFTWARE_REVIEWS_QUERY, urlFor } from '@/sanity'
import { PortableText } from '@/components/sanity'
import type { SoftwareReview, SoftwareReviewListItem } from '@/sanity/types'
import { Star, Check, X, ArrowLeft, ExternalLink, Calendar } from 'lucide-react'
import { Sidebar } from '@/components/layout/Sidebar'

export const revalidate = 3600

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getSoftwareReview(slug: string): Promise<SoftwareReview | null> {
  return client.fetch(SOFTWARE_REVIEW_BY_SLUG_QUERY, { slug })
}

async function getAllSoftwareReviews(): Promise<SoftwareReviewListItem[]> {
  return client.fetch(SOFTWARE_REVIEWS_QUERY)
}

export async function generateStaticParams() {
  const reviews = await getAllSoftwareReviews()
  return reviews.map((review) => ({
    slug: review.slug?.current || '',
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const review = await getSoftwareReview(slug)

  if (!review) {
    return { title: 'Review Not Found - Softzar' }
  }

  const seoTitle = review.seo?.metaTitle || review.title
  const seoDescription = review.seo?.metaDescription || review.excerpt

  return {
    title: `${seoTitle} - Softzar Reviews`,
    description: seoDescription,
    keywords: review.seo?.keywords,
    openGraph: {
      title: seoTitle,
      description: seoDescription || '',
      type: 'article',
      images: review.seo?.ogImage?.asset
        ? [urlFor(review.seo.ogImage).width(1200).height(630).url()]
        : review.featuredImage?.asset
          ? [urlFor(review.featuredImage).width(1200).height(630).url()]
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

function RatingStars({ rating, size = 'md' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClass = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  }

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClass[size]} ${
            star <= rating
              ? 'fill-yellow-400 text-yellow-400'
              : star - 0.5 <= rating
                ? 'fill-yellow-400/50 text-yellow-400'
                : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  )
}

function RatingBar({ label, rating }: { label: string; rating?: number }) {
  if (rating === undefined) return null
  return (
    <div className="flex items-center gap-4">
      <span className="w-32 text-sm text-muted-foreground">{label}</span>
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-yellow-400 rounded-full"
          style={{ width: `${(rating / 5) * 100}%` }}
        />
      </div>
      <span className="w-8 text-sm font-medium">{rating.toFixed(1)}</span>
    </div>
  )
}

export default async function SoftwareReviewPage({ params }: PageProps) {
  const { slug } = await params
  const review = await getSoftwareReview(slug)

  if (!review) {
    notFound()
  }

  return (
    <article className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Back Link */}
          <Link
            href="/software-reviews"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Software Reviews
          </Link>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
            {/* Main Content */}
            <div className="min-w-0">

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            {review.softwareLogo && (
              <Image
                src={urlFor(review.softwareLogo).width(64).height(64).url()}
                alt={review.softwareName}
                width={64}
                height={64}
                className="rounded-lg"
              />
            )}
            <div>
              <span className="text-sm text-muted-foreground">{review.softwareName} Review</span>
              <h1 className="text-3xl md:text-4xl font-bold">{review.title}</h1>
            </div>
          </div>

          {/* Rating & Meta */}
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <RatingStars rating={review.overallRating} size="lg" />
              <span className="text-2xl font-bold">{review.overallRating.toFixed(1)}</span>
            </div>
            {review.lastUpdated && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Last updated: {formatDate(review.lastUpdated)}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            {review.officialWebsite && (
              <a
                href={review.officialWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Visit Website
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
            {review.affiliateLink && (
              <a
                href={review.affiliateLink}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Get Started
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        </header>

        {/* Featured Image */}
        {review.featuredImage?.asset && (
          <div className="relative aspect-video mb-8 rounded-xl overflow-hidden">
            <Image
              src={urlFor(review.featuredImage).width(1200).height(675).url()}
              alt={review.featuredImage.alt || review.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Quick Summary */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          {/* Pros */}
          {review.pros && review.pros.length > 0 && (
            <div className="p-6 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-900">
              <h2 className="text-lg font-semibold text-green-700 dark:text-green-400 mb-4">Pros</h2>
              <ul className="space-y-2">
                {review.pros.map((pro, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Cons */}
          {review.cons && review.cons.length > 0 && (
            <div className="p-6 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-900">
              <h2 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-4">Cons</h2>
              <ul className="space-y-2">
                {review.cons.map((con, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <X className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Detailed Ratings */}
        {review.ratings && (
          <div className="mb-8 p-6 bg-card rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Detailed Ratings</h2>
            <div className="space-y-3">
              <RatingBar label="Ease of Use" rating={review.ratings.easeOfUse} />
              <RatingBar label="Features" rating={review.ratings.features} />
              <RatingBar label="Value for Money" rating={review.ratings.valueForMoney} />
              <RatingBar label="Customer Support" rating={review.ratings.customerSupport} />
              <RatingBar label="Performance" rating={review.ratings.performance} />
            </div>
          </div>
        )}

        {/* Pricing */}
        {review.pricing && review.pricing.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Pricing Plans</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {review.pricing.map((plan, index) => (
                <div key={index} className="p-4 bg-card rounded-lg border">
                  <h3 className="font-semibold">{plan.planName}</h3>
                  <p className="text-2xl font-bold text-primary my-2">{plan.price}</p>
                  {plan.features && (
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-600" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        {review.content && (
          <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
            <PortableText value={review.content} />
          </div>
        )}

        {/* Verdict */}
        {review.verdict && (
          <div className="mb-8 p-6 bg-primary/5 rounded-lg border border-primary/20">
            <h2 className="text-xl font-semibold mb-3">Our Verdict</h2>
            <p className="text-lg">{review.verdict}</p>
          </div>
        )}

        {/* Related Reviews */}
        {review.relatedReviews && review.relatedReviews.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-semibold mb-4">Related Reviews</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {review.relatedReviews.map((related) => (
                <Link
                  key={related._id}
                  href={`/reviews/${related.slug?.current}`}
                  className="p-4 bg-card rounded-lg border hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-2">
                    {related.softwareLogo && (
                      <Image
                        src={urlFor(related.softwareLogo).width(32).height(32).url()}
                        alt={related.softwareName}
                        width={32}
                        height={32}
                        className="rounded"
                      />
                    )}
                    <span className="text-sm text-muted-foreground">{related.softwareName}</span>
                  </div>
                  <h3 className="font-medium line-clamp-2">{related.title}</h3>
                  <div className="mt-2">
                    <RatingStars rating={related.overallRating} size="sm" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
            </div>

            {/* Sidebar */}
            <Sidebar className="hidden lg:block" />
          </div>
        </div>
      </div>
    </article>
  )
}
