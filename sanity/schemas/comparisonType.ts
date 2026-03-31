import { defineField, defineType } from 'sanity'
import { richContentBlocks } from './richContentBlocks'

export const comparisonType = defineType({
  name: 'comparison',
  title: 'Comparison Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'e.g., "Notion vs Obsidian: Which Note-Taking App is Better?"',
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
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      description: 'Brief summary of the comparison',
      validation: (Rule) => Rule.max(200),
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
      name: 'comparisonItems',
      title: 'Items to Compare',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'name',
              title: 'Name',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'logo',
              title: 'Logo',
              type: 'image',
              options: { hotspot: true },
            }),
            defineField({
              name: 'description',
              title: 'Short Description',
              type: 'text',
              rows: 2,
            }),
            defineField({
              name: 'website',
              title: 'Website',
              type: 'url',
            }),
            defineField({
              name: 'affiliateLink',
              title: 'Affiliate Link',
              type: 'url',
            }),
            defineField({
              name: 'pricing',
              title: 'Pricing',
              type: 'string',
              description: 'e.g., "Free / $10/mo"',
            }),
            defineField({
              name: 'overallRating',
              title: 'Overall Rating',
              type: 'number',
              validation: (Rule) => Rule.min(0).max(5),
            }),
          ],
          preview: {
            select: {
              title: 'name',
              media: 'logo',
            },
          },
        },
      ],
      validation: (Rule) => Rule.min(2).max(5),
    }),
    defineField({
      name: 'comparisonTable',
      title: 'Comparison Table',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'feature',
              title: 'Feature',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'category',
              title: 'Category',
              type: 'string',
              description: 'e.g., Pricing, Features, Ease of Use',
            }),
            defineField({
              name: 'values',
              title: 'Values',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    defineField({
                      name: 'itemIndex',
                      title: 'Item Index',
                      type: 'number',
                      description: 'Index of the comparison item (0, 1, 2...)',
                    }),
                    defineField({
                      name: 'value',
                      title: 'Value',
                      type: 'string',
                    }),
                    defineField({
                      name: 'isWinner',
                      title: 'Winner for this feature?',
                      type: 'boolean',
                      initialValue: false,
                    }),
                  ],
                },
              ],
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'winner',
      title: 'Overall Winner',
      type: 'object',
      fields: [
        defineField({
          name: 'itemIndex',
          title: 'Winner Item Index',
          type: 'number',
          description: 'Index of the winning item (0, 1, 2...)',
        }),
        defineField({
          name: 'reason',
          title: 'Why This Winner?',
          type: 'text',
          rows: 3,
        }),
      ],
    }),
    defineField({
      name: 'bestFor',
      title: 'Best For Recommendations',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'useCase',
              title: 'Use Case',
              type: 'string',
              description: 'e.g., "Best for Students", "Best for Teams"',
            }),
            defineField({
              name: 'itemIndex',
              title: 'Recommended Item Index',
              type: 'number',
            }),
            defineField({
              name: 'reason',
              title: 'Why?',
              type: 'string',
            }),
          ],
        },
      ],
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
    }),
    defineField({
      name: 'content',
      title: 'Detailed Content',
      type: 'array',
      of: richContentBlocks as any,
    }),
    defineField({
      name: 'faqs',
      title: 'FAQs',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'question',
              title: 'Question',
              type: 'string',
            }),
            defineField({
              name: 'answer',
              title: 'Answer',
              type: 'text',
              rows: 3,
            }),
          ],
        },
      ],
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
      media: 'featuredImage',
      status: 'status',
    },
    prepare({ title, media, status }) {
      return {
        title,
        subtitle: status || 'draft',
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Published Date, New',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
})
