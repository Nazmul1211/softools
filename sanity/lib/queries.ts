import { groq } from 'next-sanity'

// ============================================
// BLOG POST QUERIES
// ============================================

export const BLOG_POSTS_QUERY = groq`
  *[_type == "blogPost" && status == "published"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    featuredImage {
      asset->,
      alt
    },
    author->{
      name,
      slug,
      image
    },
    categories[]->{
      title,
      slug
    },
    publishedAt,
    _createdAt,
    _updatedAt
  }
`

export const BLOG_POSTS_PAGINATED_QUERY = groq`
  *[_type == "blogPost" && status == "published"] | order(publishedAt desc) [$start...$end] {
    _id,
    title,
    slug,
    excerpt,
    featuredImage {
      asset->,
      alt
    },
    author->{
      name,
      slug,
      image
    },
    categories[]->{
      title,
      slug
    },
    publishedAt
  }
`

export const BLOG_POST_BY_SLUG_QUERY = groq`
  *[_type == "blogPost" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    featuredImage {
      asset->,
      alt
    },
    author->{
      _id,
      name,
      slug,
      image,
      bio,
      role,
      socialLinks
    },
    categories[]->{
      title,
      slug
    },
    publishedAt,
    content,
    relatedTools,
    seo,
    _createdAt,
    _updatedAt
  }
`

export const BLOG_POSTS_BY_CATEGORY_QUERY = groq`
  *[_type == "blogPost" && status == "published" && references(*[_type == "category" && slug.current == $categorySlug]._id)] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    featuredImage {
      asset->,
      alt
    },
    author->{
      name,
      slug,
      image
    },
    categories[]->{
      title,
      slug
    },
    publishedAt
  }
`

// ============================================
// REVIEW QUERIES (General Product Reviews)
// ============================================

export const REVIEWS_QUERY = groq`
  *[_type == "review" && status == "published"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    productType,
    productName,
    productBrand,
    productImage {
      asset->,
      alt
    },
    featuredImage {
      asset->,
      alt
    },
    excerpt,
    overallRating,
    author->{
      name,
      slug,
      image
    },
    categories[]->{
      title,
      slug
    },
    tags,
    publishedAt,
    lastUpdated
  }
`

export const REVIEW_BY_SLUG_QUERY = groq`
  *[_type == "review" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    productType,
    productName,
    productBrand,
    productImage {
      asset->,
      alt
    },
    featuredImage {
      asset->,
      alt
    },
    excerpt,
    overallRating,
    ratings,
    pros,
    cons,
    verdict,
    specifications,
    pricing,
    affiliateLink,
    officialWebsite,
    gallery,
    author->{
      _id,
      name,
      slug,
      image,
      bio,
      role,
      socialLinks
    },
    categories[]->{
      title,
      slug
    },
    tags,
    publishedAt,
    lastUpdated,
    content,
    relatedReviews[]->{
      _id,
      title,
      slug,
      productName,
      productImage,
      overallRating
    },
    seo,
    _createdAt,
    _updatedAt
  }
`

// ============================================
// SOFTWARE REVIEW QUERIES
// ============================================

export const SOFTWARE_REVIEWS_QUERY = groq`
  *[_type == "softwareReview" && status == "published"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    softwareName,
    softwareLogo,
    featuredImage {
      asset->,
      alt
    },
    excerpt,
    overallRating,
    author->{
      name,
      slug,
      image
    },
    categories[]->{
      title,
      slug
    },
    publishedAt,
    lastUpdated
  }
`

export const SOFTWARE_REVIEW_BY_SLUG_QUERY = groq`
  *[_type == "softwareReview" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    softwareName,
    softwareLogo,
    featuredImage {
      asset->,
      alt
    },
    excerpt,
    overallRating,
    ratings,
    pros,
    cons,
    verdict,
    pricing,
    affiliateLink,
    officialWebsite,
    author->{
      _id,
      name,
      slug,
      image,
      bio,
      role,
      socialLinks
    },
    categories[]->{
      title,
      slug
    },
    publishedAt,
    lastUpdated,
    content,
    relatedReviews[]->{
      _id,
      title,
      slug,
      softwareName,
      softwareLogo,
      overallRating
    },
    seo,
    _createdAt,
    _updatedAt
  }
`

// ============================================
// COMPARISON QUERIES
// ============================================

export const COMPARISONS_QUERY = groq`
  *[_type == "comparison" && status == "published"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    featuredImage {
      asset->,
      alt
    },
    comparisonItems[] {
      name,
      logo,
      overallRating
    },
    winner,
    author->{
      name,
      slug,
      image
    },
    categories[]->{
      title,
      slug
    },
    publishedAt,
    lastUpdated
  }
`

export const COMPARISON_BY_SLUG_QUERY = groq`
  *[_type == "comparison" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    featuredImage {
      asset->,
      alt
    },
    comparisonItems,
    comparisonTable,
    winner,
    bestFor,
    author->{
      _id,
      name,
      slug,
      image,
      bio,
      role,
      socialLinks
    },
    categories[]->{
      title,
      slug
    },
    publishedAt,
    lastUpdated,
    content,
    faqs,
    seo,
    _createdAt,
    _updatedAt
  }
`

// ============================================
// CATEGORY QUERIES
// ============================================

export const CATEGORIES_QUERY = groq`
  *[_type == "category"] | order(title asc) {
    _id,
    title,
    slug,
    description,
    icon,
    color,
    "postCount": count(*[_type == "blogPost" && status == "published" && references(^._id)])
  }
`

export const CATEGORY_BY_SLUG_QUERY = groq`
  *[_type == "category" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    description,
    icon,
    color,
    parentCategory->{
      title,
      slug
    }
  }
`

// ============================================
// AUTHOR QUERIES
// ============================================

export const AUTHORS_QUERY = groq`
  *[_type == "author"] | order(name asc) {
    _id,
    name,
    slug,
    image,
    bio,
    role
  }
`

export const AUTHOR_BY_SLUG_QUERY = groq`
  *[_type == "author" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    image,
    bio,
    role,
    email,
    socialLinks,
    "posts": *[_type == "blogPost" && author._ref == ^._id && status == "published"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      featuredImage,
      publishedAt
    },
    "reviews": *[_type == "review" && author._ref == ^._id && status == "published"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      productName,
      overallRating,
      publishedAt
    },
    "softwareReviews": *[_type == "softwareReview" && author._ref == ^._id && status == "published"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      softwareName,
      overallRating,
      publishedAt
    }
  }
`

// ============================================
// SITEMAP QUERIES
// ============================================

export const SITEMAP_BLOG_POSTS_QUERY = groq`
  *[_type == "blogPost" && status == "published"] {
    "slug": slug.current,
    _updatedAt
  }
`

export const SITEMAP_REVIEWS_QUERY = groq`
  *[_type == "review" && status == "published"] {
    "slug": slug.current,
    _updatedAt
  }
`

export const SITEMAP_SOFTWARE_REVIEWS_QUERY = groq`
  *[_type == "softwareReview" && status == "published"] {
    "slug": slug.current,
    _updatedAt
  }
`

export const SITEMAP_COMPARISONS_QUERY = groq`
  *[_type == "comparison" && status == "published"] {
    "slug": slug.current,
    _updatedAt
  }
`

// ============================================
// COUNT QUERIES
// ============================================

export const BLOG_POSTS_COUNT_QUERY = groq`
  count(*[_type == "blogPost" && status == "published"])
`

export const REVIEWS_COUNT_QUERY = groq`
  count(*[_type == "review" && status == "published"])
`

export const SOFTWARE_REVIEWS_COUNT_QUERY = groq`
  count(*[_type == "softwareReview" && status == "published"])
`

export const COMPARISONS_COUNT_QUERY = groq`
  count(*[_type == "comparison" && status == "published"])
`

// ============================================
// PAGE QUERIES (Simple URL pages)
// ============================================

export const PAGES_QUERY = groq`
  *[_type == "page" && status == "published"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    contentType,
    excerpt,
    featuredImage {
      asset->,
      alt
    },
    author->{
      name,
      slug,
      image
    },
    categories[]->{
      title,
      slug
    },
    tags,
    publishedAt,
    _createdAt,
    _updatedAt
  }
`

export const PAGE_BY_SLUG_QUERY = groq`
  *[_type == "page" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    contentType,
    excerpt,
    featuredImage {
      asset->,
      alt
    },
    author->{
      _id,
      name,
      slug,
      image,
      bio,
      role,
      socialLinks
    },
    categories[]->{
      title,
      slug
    },
    tags,
    publishedAt,
    content,
    relatedTools,
    seo,
    _createdAt,
    _updatedAt
  }
`

export const SITEMAP_PAGES_QUERY = groq`
  *[_type == "page" && status == "published"] {
    "slug": slug.current,
    _updatedAt
  }
`
