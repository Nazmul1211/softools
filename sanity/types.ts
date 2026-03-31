import type { PortableTextBlock } from 'sanity'

// ============================================
// BASE TYPES
// ============================================

export interface SanityDocument {
  _id: string
  _type: string
  _createdAt: string
  _updatedAt: string
}

export interface SanitySlug {
  _type: 'slug'
  current: string
}

export interface SanityImageAsset {
  _ref?: string
  _id?: string
  _type?: 'sanity.imageAsset' | 'reference'
  url?: string
  metadata?: {
    dimensions?: {
      width: number
      height: number
      aspectRatio: number
    }
    lqip?: string
  }
}

export interface SanityImage {
  _type?: 'image'
  asset?: SanityImageAsset
  hotspot?: {
    x: number
    y: number
    height: number
    width: number
  }
  crop?: {
    top: number
    bottom: number
    left: number
    right: number
  }
  alt?: string
  caption?: string
}

// ============================================
// SEO TYPE
// ============================================

export interface SEO {
  metaTitle?: string
  metaDescription?: string
  keywords?: string[]
  ogImage?: SanityImage
  noIndex?: boolean
}

// ============================================
// AUTHOR TYPE
// ============================================

export interface Author extends SanityDocument {
  _type: 'author'
  name: string
  slug: SanitySlug
  image?: SanityImage
  bio?: string
  role?: string
  email?: string
  socialLinks?: {
    twitter?: string
    linkedin?: string
    github?: string
    website?: string
  }
}

// ============================================
// CATEGORY TYPE
// ============================================

export interface Category extends SanityDocument {
  _type: 'category'
  title: string
  slug: SanitySlug
  description?: string
  icon?: string
  color?: string
  parentCategory?: Category
  postCount?: number
}

// ============================================
// BLOG POST TYPE
// ============================================

export interface BlogPost extends SanityDocument {
  _type: 'blogPost'
  title: string
  slug: SanitySlug
  excerpt?: string
  featuredImage?: SanityImage
  author?: Author
  categories?: Category[]
  publishedAt?: string
  content?: PortableTextBlock[]
  relatedTools?: string[]
  seo?: SEO
  status?: 'draft' | 'published' | 'archived'
}

// ============================================
// REVIEW TYPE (General Product Reviews)
// ============================================

export interface GeneralReviewRatings {
  quality?: number
  performance?: number
  valueForMoney?: number
  easeOfUse?: number
  design?: number
  features?: number
  customerSupport?: number
}

export interface Specification {
  label?: string
  value?: string
}

export interface ProductPricing {
  price?: string
  currency?: string
  pricingType?: 'one-time' | 'subscription' | 'free' | 'freemium'
}

export interface GalleryImage extends SanityImage {
  caption?: string
}

export interface Review extends SanityDocument {
  _type: 'review'
  title: string
  slug: SanitySlug
  productType: 'gadget' | 'software' | 'service' | 'subscription' | 'physical' | 'course' | 'other'
  productName: string
  productBrand?: string
  productImage?: SanityImage
  featuredImage?: SanityImage
  excerpt?: string
  overallRating: number
  ratings?: GeneralReviewRatings
  pros?: string[]
  cons?: string[]
  verdict?: string
  specifications?: Specification[]
  pricing?: ProductPricing
  affiliateLink?: string
  officialWebsite?: string
  gallery?: GalleryImage[]
  author?: Author
  categories?: Category[]
  tags?: string[]
  publishedAt?: string
  lastUpdated?: string
  content?: PortableTextBlock[]
  relatedReviews?: Review[]
  seo?: SEO
  status?: 'draft' | 'published' | 'archived'
}

// ============================================
// SOFTWARE REVIEW TYPE
// ============================================

export interface SoftwareReviewRatings {
  easeOfUse?: number
  features?: number
  valueForMoney?: number
  customerSupport?: number
  performance?: number
}

export interface SoftwareReviewPricing {
  planName?: string
  price?: string
  features?: string[]
}

export interface SoftwareReview extends SanityDocument {
  _type: 'softwareReview'
  title: string
  slug: SanitySlug
  softwareName: string
  softwareLogo?: SanityImage
  featuredImage?: SanityImage
  excerpt?: string
  overallRating: number
  ratings?: SoftwareReviewRatings
  pros?: string[]
  cons?: string[]
  verdict?: string
  pricing?: SoftwareReviewPricing[]
  affiliateLink?: string
  officialWebsite?: string
  author?: Author
  categories?: Category[]
  publishedAt?: string
  lastUpdated?: string
  content?: PortableTextBlock[]
  relatedReviews?: SoftwareReview[]
  seo?: SEO
  status?: 'draft' | 'published' | 'archived'
}

// ============================================
// COMPARISON TYPE
// ============================================

export interface ComparisonItem {
  name: string
  logo?: SanityImage
  description?: string
  website?: string
  affiliateLink?: string
  pricing?: string
  overallRating?: number
}

export interface ComparisonTableValue {
  itemIndex?: number
  value?: string
  isWinner?: boolean
}

export interface ComparisonTableRow {
  feature: string
  category?: string
  values?: ComparisonTableValue[]
}

export interface ComparisonWinner {
  itemIndex?: number
  reason?: string
}

export interface ComparisonBestFor {
  useCase?: string
  itemIndex?: number
  reason?: string
}

export interface ComparisonFAQ {
  question?: string
  answer?: string
}

export interface Comparison extends SanityDocument {
  _type: 'comparison'
  title: string
  slug: SanitySlug
  excerpt?: string
  featuredImage?: SanityImage
  comparisonItems?: ComparisonItem[]
  comparisonTable?: ComparisonTableRow[]
  winner?: ComparisonWinner
  bestFor?: ComparisonBestFor[]
  author?: Author
  categories?: Category[]
  publishedAt?: string
  lastUpdated?: string
  content?: PortableTextBlock[]
  faqs?: ComparisonFAQ[]
  seo?: SEO
  status?: 'draft' | 'published' | 'archived'
}

// ============================================
// PAGE TYPE (Simple URL pages)
// ============================================

export interface Page extends SanityDocument {
  _type: 'page'
  title: string
  slug: SanitySlug
  contentType?: 'page' | 'post'
  excerpt?: string
  featuredImage?: SanityImage
  author?: Author
  categories?: Category[]
  tags?: string[]
  publishedAt?: string
  content?: PortableTextBlock[]
  relatedTools?: string[]
  seo?: SEO
  status?: 'draft' | 'published' | 'archived'
}

// ============================================
// QUERY RESULT TYPES
// ============================================

export type BlogPostListItem = Pick<
  BlogPost,
  | '_id'
  | 'title'
  | 'slug'
  | 'excerpt'
  | 'featuredImage'
  | 'author'
  | 'categories'
  | 'publishedAt'
  | '_createdAt'
  | '_updatedAt'
>

export type ReviewListItem = Pick<
  Review,
  | '_id'
  | 'title'
  | 'slug'
  | 'productType'
  | 'productName'
  | 'productBrand'
  | 'productImage'
  | 'featuredImage'
  | 'excerpt'
  | 'overallRating'
  | 'author'
  | 'categories'
  | 'tags'
  | 'publishedAt'
  | 'lastUpdated'
>

export type SoftwareReviewListItem = Pick<
  SoftwareReview,
  | '_id'
  | 'title'
  | 'slug'
  | 'softwareName'
  | 'softwareLogo'
  | 'featuredImage'
  | 'excerpt'
  | 'overallRating'
  | 'author'
  | 'categories'
  | 'publishedAt'
  | 'lastUpdated'
>

export type ComparisonListItem = Pick<
  Comparison,
  | '_id'
  | 'title'
  | 'slug'
  | 'excerpt'
  | 'featuredImage'
  | 'comparisonItems'
  | 'winner'
  | 'author'
  | 'categories'
  | 'publishedAt'
  | 'lastUpdated'
>

export type PageListItem = Pick<
  Page,
  | '_id'
  | 'title'
  | 'slug'
  | 'excerpt'
  | 'featuredImage'
  | 'author'
  | 'publishedAt'
  | '_createdAt'
  | '_updatedAt'
>
