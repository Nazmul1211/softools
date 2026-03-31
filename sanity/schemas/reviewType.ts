import { defineField, defineType } from 'sanity'
import { richContentBlocks } from './richContentBlocks'

export const reviewType = defineType({
  name: 'review',
  title: 'Product Review',
  type: 'document',
  description: 'General product review for gadgets, software, services, and more',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'e.g., "iPhone 16 Pro Review: Is It Worth the Upgrade?"',
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
      name: 'productType',
      title: 'Product Type',
      type: 'string',
      description: 'What kind of product is this?',
      options: {
        list: [
          { title: 'Gadget / Hardware', value: 'gadget' },
          { title: 'Software / App', value: 'software' },
          { title: 'Service', value: 'service' },
          { title: 'Subscription', value: 'subscription' },
          { title: 'Physical Product', value: 'physical' },
          { title: 'Course / Education', value: 'course' },
          { title: 'Other', value: 'other' },
        ],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'productName',
      title: 'Product Name',
      type: 'string',
      description: 'Name of the product being reviewed',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'productBrand',
      title: 'Brand / Company',
      type: 'string',
      description: 'e.g., Apple, Samsung, Microsoft',
    }),
    defineField({
      name: 'productImage',
      title: 'Product Image',
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
      description: 'Rate different aspects (leave empty if not applicable)',
      fields: [
        defineField({
          name: 'quality',
          title: 'Quality / Build',
          type: 'number',
          validation: (Rule) => Rule.min(0).max(5),
        }),
        defineField({
          name: 'performance',
          title: 'Performance',
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
          name: 'easeOfUse',
          title: 'Ease of Use',
          type: 'number',
          validation: (Rule) => Rule.min(0).max(5),
        }),
        defineField({
          name: 'design',
          title: 'Design / Aesthetics',
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
          name: 'customerSupport',
          title: 'Customer Support',
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
      name: 'specifications',
      title: 'Specifications',
      type: 'array',
      description: 'Technical specs or key details',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              description: 'e.g., "Screen Size", "Battery Life", "Price"',
            }),
            defineField({
              name: 'value',
              title: 'Value',
              type: 'string',
              description: 'e.g., "6.7 inches", "24 hours", "$999"',
            }),
          ],
          preview: {
            select: { label: 'label', value: 'value' },
            prepare({ label, value }) {
              return { title: `${label}: ${value}` }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'pricing',
      title: 'Pricing',
      type: 'object',
      fields: [
        defineField({
          name: 'price',
          title: 'Price',
          type: 'string',
          description: 'e.g., "$999", "Free", "$10/month"',
        }),
        defineField({
          name: 'currency',
          title: 'Currency',
          type: 'string',
          options: {
            list: ['USD', 'EUR', 'GBP', 'INR', 'Other'],
          },
          initialValue: 'USD',
        }),
        defineField({
          name: 'pricingType',
          title: 'Pricing Type',
          type: 'string',
          options: {
            list: [
              { title: 'One-time', value: 'one-time' },
              { title: 'Subscription', value: 'subscription' },
              { title: 'Free', value: 'free' },
              { title: 'Freemium', value: 'freemium' },
            ],
          },
        }),
      ],
    }),
    defineField({
      name: 'affiliateLink',
      title: 'Affiliate Link',
      type: 'url',
      description: 'Affiliate link for the product',
    }),
    defineField({
      name: 'officialWebsite',
      title: 'Official Website / Purchase Link',
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
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
      description: 'Add tags for better categorization',
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
      name: 'gallery',
      title: 'Product Gallery',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
            }),
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string',
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'relatedReviews',
      title: 'Related Reviews',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'review' }] }],
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
      productName: 'productName',
      productType: 'productType',
      media: 'productImage',
      rating: 'overallRating',
    },
    prepare({ title, productName, productType, media, rating }) {
      const typeIcons: Record<string, string> = {
        gadget: '📱',
        software: '💻',
        service: '🔧',
        subscription: '📦',
        physical: '🛍️',
        course: '📚',
        other: '📝',
      }
      return {
        title,
        subtitle: `${typeIcons[productType] || '📝'} ${productName} • ⭐ ${rating || 'N/A'}`,
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
    {
      title: 'Product Type',
      name: 'productTypeAsc',
      by: [{ field: 'productType', direction: 'asc' }],
    },
  ],
})
