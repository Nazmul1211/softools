import { seoType } from './seoType'
import { authorType } from './authorType'
import { categoryType } from './categoryType'
import { blogPostType } from './blogPostType'
import { reviewType } from './reviewType'
import { softwareReviewType } from './softwareReviewType'
import { comparisonType } from './comparisonType'
import { pageType } from './pageType'

export const schemaTypes = [
  // Object types (reusable)
  seoType,
  
  // Document types
  authorType,
  categoryType,
  blogPostType,
  reviewType,           // General product reviews (/reviews)
  softwareReviewType,   // Software-specific reviews (/software-reviews)
  comparisonType,
  pageType,
]
