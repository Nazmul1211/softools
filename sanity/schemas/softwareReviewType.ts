import { defineField, defineType } from 'sanity'
import { richContentBlocks } from './richContentBlocks'

export const softwareReviewType = defineType({
  name: 'softwareReview',
  title: 'Software Review',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'e.g., "Notion Review 2024: Is It Worth It?"',
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'softwareName',
      title: 'Software Name',
      type: 'string',
      description: 'Name of the software being reviewed',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'softwareLogo',
      title: 'Software Logo',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      description: 'Brief summary of the review',
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'overallRating',
      title: 'Overall Rating',
      type: 'number',
      description: 'Rating out of 5 (e.g., 4.5)',
      validation: (Rule) => Rule.required().min(0).max(5),
    }),
    defineField({
      name: 'ratings',
      title: 'Detailed Ratings',
      type: 'object',
      fields: [
        defineField({
          name: 'easeOfUse',
          title: 'Ease of Use',
          type: 'number',
          validation: (Rule) => Rule.min(0).max(5),
        }),
        defineField({
          name: 'features',
          title: 'Features',
          type: 'number',
          validation: (Rule) => Rule.min(0).max(5),
        }),
        defineField({
          name: 'valueForMoney',
          title: 'Value for Money',
          type: 'number',
          validation: (Rule) => Rule.min(0).max(5),
        }),
        defineField({
          name: 'customerSupport',
          title: 'Customer Support',
          type: 'number',
          validation: (Rule) => Rule.min(0).max(5),
        }),
        defineField({
          name: 'performance',
          title: 'Performance',
          type: 'number',
          validation: (Rule) => Rule.min(0).max(5),
        }),
      ],
    }),
    defineField({
      name: 'pros',
      title: 'Pros',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'List of advantages',
    }),
    defineField({
      name: 'cons',
      title: 'Cons',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'List of disadvantages',
    }),
    defineField({
      name: 'verdict',
      title: 'Verdict',
      type: 'text',
      rows: 4,
      description: 'Final verdict/conclusion of the review',
    }),
    defineField({
      name: 'pricing',
      title: 'Pricing',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'planName',
              title: 'Plan Name',
              type: 'string',
            }),
            defineField({
              name: 'price',
              title: 'Price',
              type: 'string',
              description: 'e.g., "$10/month" or "Free"',
            }),
            defineField({
              name: 'features',
              title: 'Features',
              type: 'array',
              of: [{ type: 'string' }],
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'affiliateLink',
      title: 'Affiliate Link',
      type: 'url',
      description: 'Affiliate link for the software',
    }),
    defineField({
      name: 'officialWebsite',
      title: 'Official Website',
      type: 'url',
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'category' }] }],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'lastUpdated',
      title: 'Last Updated',
      type: 'datetime',
      description: 'When was this review last updated?',
    }),
    defineField({
      name: 'content',
      title: 'Full Review Content',
      type: 'array',
      of: richContentBlocks as any,
    }),
    defineField({
      name: 'relatedReviews',
      title: 'Related Reviews',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'softwareReview' }] }],
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Draft', value: 'draft' },
          { title: 'Published', value: 'published' },
          { title: 'Archived', value: 'archived' },
        ],
        layout: 'radio',
      },
      initialValue: 'draft',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'softwareName',
      media: 'softwareLogo',
      rating: 'overallRating',
    },
    prepare({ title, subtitle, media, rating }) {
      return {
        title,
        subtitle: `${subtitle} • ⭐ ${rating || 'N/A'}`,
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Rating, High to Low',
      name: 'ratingDesc',
      by: [{ field: 'overallRating', direction: 'desc' }],
    },
    {
      title: 'Published Date, New',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
})
