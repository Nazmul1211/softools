import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { client, REVIEW_BY_SLUG_QUERY, REVIEWS_QUERY, urlFor } from '@/sanity'
import { PortableText } from '@/components/sanity'
import type { Review, ReviewListItem } from '@/sanity/types'
import { Star, Check, X, ArrowLeft, ExternalLink, Calendar, Tag } from 'lucide-react'
import { Sidebar } from '@/components/layout/Sidebar'

export const revalidate = 3600

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getReview(slug: string): Promise<Review | null> {
  return client.fetch(REVIEW_BY_SLUG_QUERY, { slug })
}

async function getAllReviews(): Promise<ReviewListItem[]> {
  return client.fetch(REVIEWS_QUERY)
}

export async function generateStaticParams() {
  const reviews = await getAllReviews()
  return reviews.map((review) => ({
    slug: review.slug?.current || '',
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const review = await getReview(slug)

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
        ? [{ url: urlFor(review.seo.ogImage).width(1200).height(630).url() }]
        : review.featuredImage?.asset
          ? [{ url: urlFor(review.featuredImage).width(1200).height(630).url() }]
          : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDescription || '',
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
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  }

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClasses[size]} ${
            star <= rating
              ? 'fill-yellow-400 text-yellow-400'
              : star - 0.5 <= rating
                ? 'fill-yellow-400/50 text-yellow-400'
                : 'text-gray-300'
          }`}
        />
      ))}
      <span className={`ml-2 font-bold ${size === 'lg' ? 'text-xl' : size === 'md' ? 'text-lg' : 'text-base'}`}>
        {rating.toFixed(1)}
      </span>
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

export default async function ReviewPage({ params }: PageProps) {
  const { slug } = await params
  const review = await getReview(slug)

  if (!review) {
    notFound()
  }

  const productTypeInfo = productTypeLabels[review.productType] || productTypeLabels.other

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <Link
            href="/reviews"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Reviews
          </Link>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
            {/* Main Content */}
            <div className="min-w-0">

        {/* Header */}
        <header className="mb-8">
          {/* Product Type Badge */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">{productTypeInfo.icon}</span>
            <span className="text-sm font-medium text-muted-foreground">{productTypeInfo.label}</span>
          </div>

          <h1 className="text-4xl font-bold mb-4">{review.title}</h1>

          {/* Product Info */}
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-4">
            {review.productBrand && (
              <span className="font-semibold text-foreground">{review.productBrand}</span>
            )}
            <span className="font-medium">{review.productName}</span>
            {review.pricing?.price && (
              <>
                <span>•</span>
                <span className="font-semibold text-primary">{review.pricing.price}</span>
              </>
            )}
          </div>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {review.author && (
              <div className="flex items-center gap-2">
                {review.author.image && (
                  <Image
                    src={urlFor(review.author.image).width(32).height(32).url()}
                    alt={review.author.name}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                )}
                <span>By {review.author.name}</span>
              </div>
            )}
            {review.publishedAt && (
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(review.publishedAt)}</span>
              </div>
            )}
            {review.lastUpdated && (
              <span className="text-xs">Updated {formatDate(review.lastUpdated)}</span>
            )}
          </div>
        </header>

        {/* Featured Image */}
        {(review.featuredImage?.asset || review.productImage?.asset) && (
          <div className="relative aspect-video rounded-lg overflow-hidden mb-8">
            <Image
              src={urlFor(review.featuredImage || review.productImage!).width(1200).height(675).url()}
              alt={(review.featuredImage?.alt || review.productImage?.alt) || review.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Rating Section */}
        <div className="bg-card rounded-lg border p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Overall Rating</h2>
              <RatingStars rating={review.overallRating} size="lg" />
            </div>
          </div>

          {/* Detailed Ratings */}
          {review.ratings && Object.keys(review.ratings).length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t">
              {Object.entries(review.ratings).map(([key, value]) => {
                if (value === undefined || value === null) return null
                const label = key
                  .replace(/([A-Z])/g, ' $1')
                  .replace(/^./, (str) => str.toUpperCase())
                  .trim()
                return (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{label}</span>
                    <RatingStars rating={value} size="sm" />
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Pros & Cons */}
        {(review.pros || review.cons) && (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Pros */}
            {review.pros && review.pros.length > 0 && (
              <div className="bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-900 p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-600" />
                  Pros
                </h3>
                <ul className="space-y-2">
                  {review.pros.map((pro, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Cons */}
            {review.cons && review.cons.length > 0 && (
              <div className="bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-900 p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <X className="h-5 w-5 text-red-600" />
                  Cons
                </h3>
                <ul className="space-y-2">
                  {review.cons.map((con, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <X className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Specifications */}
        {review.specifications && review.specifications.length > 0 && (
          <div className="bg-card rounded-lg border p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Specifications</h2>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {review.specifications.map((spec, index) => (
                <div key={index} className="flex flex-col">
                  <dt className="text-sm font-medium text-muted-foreground">{spec.label}</dt>
                  <dd className="text-sm font-semibold mt-1">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {/* Main Content */}
        {review.content && (
          <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
            <PortableText value={review.content} />
          </div>
        )}

        {/* Verdict */}
        {review.verdict && (
          <div className="bg-primary/5 border-l-4 border-primary rounded-r-lg p-6 mb-8">
            <h2 className="text-xl font-bold mb-3">Verdict</h2>
            <p className="text-muted-foreground whitespace-pre-line">{review.verdict}</p>
          </div>
        )}

        {/* Gallery */}
        {review.gallery && review.gallery.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Product Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {review.gallery.map((image, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                  <Image
                    src={urlFor(image).width(400).height(400).url()}
                    alt={image.alt || `Gallery image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  {image.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-2">
                      {image.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          {review.affiliateLink && (
            <a
              href={review.affiliateLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Buy Now
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
          {review.officialWebsite && (
            <a
              href={review.officialWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-primary text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary/10 transition-colors"
            >
              Official Website
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>

        {/* Tags */}
        {review.tags && review.tags.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap mb-8">
            <Tag className="h-4 w-4 text-muted-foreground" />
            {review.tags.map((tag, index) => (
              <span
                key={index}
                className="text-sm px-3 py-1 rounded-full bg-primary/10 text-primary"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Related Reviews */}
        {review.relatedReviews && review.relatedReviews.length > 0 && (
          <div className="border-t pt-8">
            <h2 className="text-2xl font-bold mb-6">Related Reviews</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {review.relatedReviews.map((related) => (
                <Link
                  key={related._id}
                  href={`/reviews/${related.slug?.current}`}
                  className="group bg-card rounded-lg border p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex gap-4">
                    {related.productImage && (
                      <div className="relative w-20 h-20 flex-shrink-0">
                        <Image
                          src={urlFor(related.productImage).width(80).height(80).url()}
                          alt={related.title}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-2 mb-2">
                        {related.title}
                      </h3>
                      <RatingStars rating={related.overallRating} size="sm" />
                    </div>
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
    </div>
  )
}
