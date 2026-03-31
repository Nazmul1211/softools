import { defineField, defineType } from 'sanity'
import { richContentBlocks } from './richContentBlocks'

export const pageType = defineType({
  name: 'page',
  title: 'Page / Post (Simple URL)',
  type: 'document',
  description: 'Create pages or posts with simple URLs directly under the domain (e.g., softzar.com/your-slug). Categories are optional for tracking/segmentation only.',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
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
      description: 'URL will be: softzar.com/your-slug (no category prefix)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'contentType',
      title: 'Content Type',
      type: 'string',
      description: 'Is this a page or a post? (for internal organization)',
      options: {
        list: [
          { title: 'Page', value: 'page' },
          { title: 'Post', value: 'post' },
        ],
        layout: 'radio',
      },
      initialValue: 'post',
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      description: 'Brief summary (displayed in search results and social shares)',
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
          description: 'Important for SEO and accessibility',
        }),
      ],
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }],
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'category' }] }],
      description: 'Optional: For tracking and segmentation only. Categories won\'t appear in the URL.',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
      description: 'Optional: Add tags for additional categorization',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: richContentBlocks as any,
    }),
    defineField({
      name: 'relatedTools',
      title: 'Related Tools',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Tool slugs that are related to this page',
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
      slug: 'slug.current',
      media: 'featuredImage',
      status: 'status',
      contentType: 'contentType',
    },
    prepare({ title, slug, media, status, contentType }) {
      const typeIcon = contentType === 'page' ? '📄' : '📝'
      return {
        title: `${typeIcon} ${title}`,
        subtitle: `/${slug} • ${status || 'draft'}`,
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
