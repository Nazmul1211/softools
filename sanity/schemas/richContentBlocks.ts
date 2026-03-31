import { defineField, defineArrayMember } from 'sanity'
import {
  BlockElementIcon,
  ImageIcon,
  CodeIcon,
  InfoOutlineIcon,
  PlayIcon,
  LinkIcon,
  ThListIcon,
  BlockquoteIcon,
  DocumentTextIcon,
  StarIcon,
  WarningOutlineIcon,
  CheckmarkCircleIcon,
  CloseCircleIcon,
  BulbOutlineIcon,
  DoubleChevronRightIcon,
  RemoveIcon,
  HelpCircleIcon,
  InlineIcon,
  EllipsisVerticalIcon,
  DownloadIcon,
  EnvelopeIcon,
  TwitterIcon,
  UserIcon,
} from '@sanity/icons'

// ============================================
// DECORATORS - Inline text styling
// ============================================
const decorators = [
  { title: 'Bold', value: 'strong' },
  { title: 'Italic', value: 'em' },
  { title: 'Underline', value: 'underline' },
  { title: 'Strike Through', value: 'strike-through' },
  { title: 'Code', value: 'code' },
  { 
    title: 'Highlight', 
    value: 'highlight',
    icon: StarIcon,
  },
  {
    title: 'Superscript',
    value: 'sup',
  },
  {
    title: 'Subscript',
    value: 'sub',
  },
]

// ============================================
// ANNOTATIONS - Rich inline elements
// ============================================
const annotations = [
  {
    name: 'link',
    type: 'object',
    title: 'External Link',
    icon: LinkIcon,
    fields: [
      {
        name: 'href',
        type: 'url',
        title: 'URL',
        validation: (Rule: any) =>
          Rule.uri({ allowRelative: true, scheme: ['http', 'https', 'mailto', 'tel'] }),
      },
      {
        name: 'openInNewTab',
        type: 'boolean',
        title: 'Open in new tab',
        initialValue: false,
      },
    ],
  },
  {
    name: 'internalLink',
    type: 'object',
    title: 'Internal Link',
    icon: DocumentTextIcon,
    fields: [
      {
        name: 'reference',
        type: 'reference',
        title: 'Reference',
        to: [
          { type: 'blogPost' },
          { type: 'review' },
          { type: 'comparison' },
          { type: 'page' },
        ],
      },
    ],
  },
  {
    name: 'footnote',
    type: 'object',
    title: 'Footnote',
    icon: InlineIcon,
    fields: [
      {
        name: 'note',
        type: 'text',
        title: 'Note',
        rows: 2,
      },
    ],
  },
]

// ============================================
// BLOCK STYLES - Paragraph and heading styles
// ============================================
const styles = [
  { title: 'Normal', value: 'normal' },
  { title: 'Heading 2', value: 'h2' },
  { title: 'Heading 3', value: 'h3' },
  { title: 'Heading 4', value: 'h4' },
  { title: 'Heading 5', value: 'h5' },
  { title: 'Heading 6', value: 'h6' },
  { title: 'Quote', value: 'blockquote' },
  { title: 'Small', value: 'small' },
  { title: 'Lead (Large Text)', value: 'lead' },
]

// ============================================
// LISTS - Bullet, numbered, checklist
// ============================================
const lists = [
  { title: 'Bullet', value: 'bullet' },
  { title: 'Numbered', value: 'number' },
  { title: 'Checklist', value: 'check' },
]

// ============================================
// CUSTOM BLOCK TYPES - Rich embedded content
// ============================================

// Image with advanced options
const imageBlock = {
  type: 'image',
  icon: ImageIcon,
  options: { hotspot: true },
  fields: [
    {
      name: 'alt',
      type: 'string',
      title: 'Alt Text',
      description: 'Required for SEO and accessibility',
      validation: (Rule: any) => Rule.required().warning('Alt text is important for accessibility'),
    },
    {
      name: 'caption',
      type: 'string',
      title: 'Caption',
    },
    {
      name: 'alignment',
      type: 'string',
      title: 'Alignment',
      options: {
        list: [
          { title: 'Left', value: 'left' },
          { title: 'Center', value: 'center' },
          { title: 'Right', value: 'right' },
          { title: 'Full Width', value: 'full' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'center',
    },
    {
      name: 'size',
      type: 'string',
      title: 'Size',
      options: {
        list: [
          { title: 'Small', value: 'small' },
          { title: 'Medium', value: 'medium' },
          { title: 'Large', value: 'large' },
          { title: 'Full', value: 'full' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'large',
    },
    {
      name: 'link',
      type: 'url',
      title: 'Link (optional)',
      description: 'Make image clickable',
    },
  ],
}

// Code block with syntax highlighting
const codeBlock = {
  type: 'code',
  title: 'Code Block',
  icon: CodeIcon,
  options: {
    language: 'javascript',
    languageAlternatives: [
      { title: 'JavaScript', value: 'javascript' },
      { title: 'TypeScript', value: 'typescript' },
      { title: 'JSX/React', value: 'jsx' },
      { title: 'TSX', value: 'tsx' },
      { title: 'HTML', value: 'html' },
      { title: 'CSS', value: 'css' },
      { title: 'SCSS', value: 'scss' },
      { title: 'Python', value: 'python' },
      { title: 'Bash/Shell', value: 'bash' },
      { title: 'JSON', value: 'json' },
      { title: 'SQL', value: 'sql' },
      { title: 'PHP', value: 'php' },
      { title: 'Go', value: 'go' },
      { title: 'Rust', value: 'rust' },
      { title: 'Java', value: 'java' },
      { title: 'C#', value: 'csharp' },
      { title: 'C++', value: 'cpp' },
      { title: 'Ruby', value: 'ruby' },
      { title: 'Swift', value: 'swift' },
      { title: 'Kotlin', value: 'kotlin' },
      { title: 'YAML', value: 'yaml' },
      { title: 'XML', value: 'xml' },
      { title: 'Markdown', value: 'markdown' },
      { title: 'GraphQL', value: 'graphql' },
      { title: 'Docker', value: 'dockerfile' },
      { title: 'Plain Text', value: 'text' },
    ],
    withFilename: true,
  },
}

// Table
const tableBlock = {
  type: 'table',
  title: 'Table',
  icon: ThListIcon,
}

// Callout/Alert box
const calloutBlock = {
  type: 'object',
  name: 'callout',
  title: 'Callout Box',
  icon: InfoOutlineIcon,
  fields: [
    {
      name: 'type',
      type: 'string',
      title: 'Type',
      options: {
        list: [
          { title: '💡 Tip', value: 'tip' },
          { title: 'ℹ️ Info', value: 'info' },
          { title: '⚠️ Warning', value: 'warning' },
          { title: '✅ Success', value: 'success' },
          { title: '❌ Error/Danger', value: 'error' },
          { title: '📝 Note', value: 'note' },
        ],
        layout: 'dropdown',
      },
      initialValue: 'info',
    },
    {
      name: 'title',
      type: 'string',
      title: 'Title (optional)',
    },
    {
      name: 'content',
      type: 'text',
      title: 'Content',
      rows: 4,
    },
  ],
  preview: {
    select: {
      title: 'title',
      type: 'type',
      content: 'content',
    },
    prepare({ title, type, content }: { title?: string; type?: string; content?: string }) {
      const icons: Record<string, string> = {
        tip: '💡',
        info: 'ℹ️',
        warning: '⚠️',
        success: '✅',
        error: '❌',
        note: '📝',
      }
      return {
        title: title || `${icons[type || 'info']} ${type?.charAt(0).toUpperCase()}${type?.slice(1) || 'Info'}`,
        subtitle: content?.substring(0, 60) + (content && content.length > 60 ? '...' : ''),
      }
    },
  },
}

// YouTube embed
const youtubeBlock = {
  type: 'object',
  name: 'youtube',
  title: 'YouTube Video',
  icon: PlayIcon,
  fields: [
    {
      name: 'url',
      type: 'url',
      title: 'YouTube URL',
      description: 'Paste a YouTube video URL (e.g., https://www.youtube.com/watch?v=...)',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'caption',
      type: 'string',
      title: 'Caption (optional)',
    },
    {
      name: 'startTime',
      type: 'number',
      title: 'Start Time (seconds)',
      description: 'Optional: Start video at specific time',
    },
  ],
  preview: {
    select: {
      url: 'url',
      caption: 'caption',
    },
    prepare({ url, caption }: { url?: string; caption?: string }) {
      return {
        title: caption || '🎬 YouTube Video',
        subtitle: url,
        media: PlayIcon,
      }
    },
  },
}

// General video embed (Vimeo, etc)
const videoEmbedBlock = {
  type: 'object',
  name: 'videoEmbed',
  title: 'Video Embed',
  icon: PlayIcon,
  fields: [
    {
      name: 'url',
      type: 'url',
      title: 'Video URL',
      description: 'Supports YouTube, Vimeo, and other video platforms',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'caption',
      type: 'string',
      title: 'Caption',
    },
  ],
  preview: {
    select: { url: 'url', caption: 'caption' },
    prepare({ url, caption }: { url?: string; caption?: string }) {
      return {
        title: caption || '🎥 Video',
        subtitle: url,
      }
    },
  },
}

// Button/CTA
const ctaButtonBlock = {
  type: 'object',
  name: 'ctaButton',
  title: 'Button / CTA',
  icon: DoubleChevronRightIcon,
  fields: [
    {
      name: 'text',
      type: 'string',
      title: 'Button Text',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'url',
      type: 'url',
      title: 'Link URL',
      validation: (Rule: any) =>
        Rule.uri({ allowRelative: true, scheme: ['http', 'https', 'mailto', 'tel'] }),
    },
    {
      name: 'style',
      type: 'string',
      title: 'Style',
      options: {
        list: [
          { title: 'Primary (Filled)', value: 'primary' },
          { title: 'Secondary', value: 'secondary' },
          { title: 'Outline', value: 'outline' },
          { title: 'Ghost', value: 'ghost' },
          { title: 'Link', value: 'link' },
        ],
        layout: 'dropdown',
      },
      initialValue: 'primary',
    },
    {
      name: 'size',
      type: 'string',
      title: 'Size',
      options: {
        list: [
          { title: 'Small', value: 'small' },
          { title: 'Medium', value: 'medium' },
          { title: 'Large', value: 'large' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'medium',
    },
    {
      name: 'icon',
      type: 'string',
      title: 'Icon (optional)',
      description: 'Add an icon: arrow, download, external, email, etc.',
      options: {
        list: [
          { title: 'None', value: '' },
          { title: 'Arrow Right →', value: 'arrow' },
          { title: 'Download ⬇', value: 'download' },
          { title: 'External Link ↗', value: 'external' },
          { title: 'Email ✉', value: 'email' },
        ],
      },
    },
    {
      name: 'openInNewTab',
      type: 'boolean',
      title: 'Open in new tab',
      initialValue: false,
    },
    {
      name: 'alignment',
      type: 'string',
      title: 'Alignment',
      options: {
        list: [
          { title: 'Left', value: 'left' },
          { title: 'Center', value: 'center' },
          { title: 'Right', value: 'right' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'center',
    },
  ],
  preview: {
    select: { text: 'text', style: 'style' },
    prepare({ text, style }: { text?: string; style?: string }) {
      return {
        title: `🔘 ${text || 'Button'}`,
        subtitle: `Style: ${style || 'primary'}`,
      }
    },
  },
}

// Divider/Separator
const dividerBlock = {
  type: 'object',
  name: 'divider',
  title: 'Divider',
  icon: RemoveIcon,
  fields: [
    {
      name: 'style',
      type: 'string',
      title: 'Style',
      options: {
        list: [
          { title: '── Line ──', value: 'line' },
          { title: '• • • Dots', value: 'dots' },
          { title: '★ ★ ★ Stars', value: 'stars' },
          { title: 'Empty Space', value: 'space' },
        ],
        layout: 'dropdown',
      },
      initialValue: 'line',
    },
  ],
  preview: {
    select: { style: 'style' },
    prepare({ style }: { style?: string }) {
      const labels: Record<string, string> = {
        line: '── Line Divider ──',
        dots: '• • • Dots Divider',
        stars: '★ ★ ★ Stars Divider',
        space: '[ Empty Space ]',
      }
      return { title: labels[style || 'line'] }
    },
  },
}

// FAQ Item
const faqItemBlock = {
  type: 'object',
  name: 'faqItem',
  title: 'FAQ Item',
  icon: HelpCircleIcon,
  fields: [
    {
      name: 'question',
      type: 'string',
      title: 'Question',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'answer',
      type: 'text',
      title: 'Answer',
      rows: 4,
      validation: (Rule: any) => Rule.required(),
    },
  ],
  preview: {
    select: { question: 'question', answer: 'answer' },
    prepare({ question, answer }: { question?: string; answer?: string }) {
      return {
        title: `❓ ${question || 'FAQ'}`,
        subtitle: answer?.substring(0, 60) + (answer && answer.length > 60 ? '...' : ''),
      }
    },
  },
}

// Accordion/Collapsible Section
const accordionBlock = {
  type: 'object',
  name: 'accordion',
  title: 'Accordion Section',
  icon: EllipsisVerticalIcon,
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Section Title',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'content',
      type: 'text',
      title: 'Content',
      rows: 5,
    },
    {
      name: 'defaultOpen',
      type: 'boolean',
      title: 'Open by default',
      initialValue: false,
    },
  ],
  preview: {
    select: { title: 'title' },
    prepare({ title }: { title?: string }) {
      return { title: `📂 ${title || 'Accordion'}` }
    },
  },
}

// Quote/Testimonial block
const quoteBlock = {
  type: 'object',
  name: 'testimonial',
  title: 'Quote / Testimonial',
  icon: BlockquoteIcon,
  fields: [
    {
      name: 'quote',
      type: 'text',
      title: 'Quote',
      rows: 3,
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'author',
      type: 'string',
      title: 'Author Name',
    },
    {
      name: 'authorTitle',
      type: 'string',
      title: 'Author Title/Role',
    },
    {
      name: 'authorImage',
      type: 'image',
      title: 'Author Image',
      options: { hotspot: true },
    },
    {
      name: 'style',
      type: 'string',
      title: 'Style',
      options: {
        list: [
          { title: 'Simple', value: 'simple' },
          { title: 'Card', value: 'card' },
          { title: 'Large', value: 'large' },
        ],
      },
      initialValue: 'simple',
    },
  ],
  preview: {
    select: { quote: 'quote', author: 'author' },
    prepare({ quote, author }: { quote?: string; author?: string }) {
      return {
        title: `💬 "${quote?.substring(0, 40)}${quote && quote.length > 40 ? '...' : ''}"`,
        subtitle: author ? `— ${author}` : undefined,
      }
    },
  },
}

// File download
const fileDownloadBlock = {
  type: 'object',
  name: 'fileDownload',
  title: 'File Download',
  icon: DownloadIcon,
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Download Title',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'description',
      type: 'string',
      title: 'Description',
    },
    {
      name: 'file',
      type: 'file',
      title: 'File',
    },
    {
      name: 'externalUrl',
      type: 'url',
      title: 'Or External URL',
      description: 'Use if file is hosted externally',
    },
  ],
  preview: {
    select: { title: 'title' },
    prepare({ title }: { title?: string }) {
      return { title: `📥 ${title || 'Download'}` }
    },
  },
}

// Social embed (Twitter, Instagram, etc)
const socialEmbedBlock = {
  type: 'object',
  name: 'socialEmbed',
  title: 'Social Media Embed',
  icon: TwitterIcon,
  fields: [
    {
      name: 'platform',
      type: 'string',
      title: 'Platform',
      options: {
        list: [
          { title: 'Twitter/X', value: 'twitter' },
          { title: 'Instagram', value: 'instagram' },
          { title: 'TikTok', value: 'tiktok' },
          { title: 'LinkedIn', value: 'linkedin' },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'url',
      type: 'url',
      title: 'Post URL',
      validation: (Rule: any) => Rule.required(),
    },
  ],
  preview: {
    select: { platform: 'platform', url: 'url' },
    prepare({ platform, url }: { platform?: string; url?: string }) {
      return {
        title: `📱 ${platform?.charAt(0).toUpperCase()}${platform?.slice(1) || 'Social'} Post`,
        subtitle: url,
      }
    },
  },
}

// Author/Person card
const authorCardBlock = {
  type: 'object',
  name: 'authorCard',
  title: 'Author Card',
  icon: UserIcon,
  fields: [
    {
      name: 'author',
      type: 'reference',
      title: 'Author',
      to: [{ type: 'author' }],
    },
    {
      name: 'showBio',
      type: 'boolean',
      title: 'Show Bio',
      initialValue: true,
    },
    {
      name: 'showSocialLinks',
      type: 'boolean',
      title: 'Show Social Links',
      initialValue: true,
    },
  ],
  preview: {
    select: { name: 'author.name' },
    prepare({ name }: { name?: string }) {
      return { title: `👤 ${name || 'Author Card'}` }
    },
  },
}

// Two column layout
const twoColumnBlock = {
  type: 'object',
  name: 'twoColumn',
  title: 'Two Column Layout',
  icon: BlockElementIcon,
  fields: [
    {
      name: 'leftColumn',
      type: 'text',
      title: 'Left Column',
      rows: 5,
    },
    {
      name: 'rightColumn',
      type: 'text',
      title: 'Right Column',
      rows: 5,
    },
    {
      name: 'ratio',
      type: 'string',
      title: 'Column Ratio',
      options: {
        list: [
          { title: '50/50', value: '50-50' },
          { title: '60/40', value: '60-40' },
          { title: '40/60', value: '40-60' },
          { title: '70/30', value: '70-30' },
          { title: '30/70', value: '30-70' },
        ],
      },
      initialValue: '50-50',
    },
  ],
  preview: {
    select: { ratio: 'ratio' },
    prepare({ ratio }: { ratio?: string }) {
      return { title: `⬜⬜ Two Columns (${ratio || '50-50'})` }
    },
  },
}

// Pros and Cons list
const prosConsBlock = {
  type: 'object',
  name: 'prosCons',
  title: 'Pros & Cons',
  icon: ThListIcon,
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Title (optional)',
    },
    {
      name: 'pros',
      type: 'array',
      title: 'Pros ✅',
      of: [{ type: 'string' }],
    },
    {
      name: 'cons',
      type: 'array',
      title: 'Cons ❌',
      of: [{ type: 'string' }],
    },
  ],
  preview: {
    select: { title: 'title', pros: 'pros', cons: 'cons' },
    prepare({ title, pros, cons }: { title?: string; pros?: string[]; cons?: string[] }) {
      return {
        title: title || '✅❌ Pros & Cons',
        subtitle: `${pros?.length || 0} pros, ${cons?.length || 0} cons`,
      }
    },
  },
}

// Feature list
const featureListBlock = {
  type: 'object',
  name: 'featureList',
  title: 'Feature List',
  icon: CheckmarkCircleIcon,
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Title',
    },
    {
      name: 'features',
      type: 'array',
      title: 'Features',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'text', type: 'string', title: 'Feature' },
            {
              name: 'included',
              type: 'boolean',
              title: 'Included',
              initialValue: true,
            },
          ],
          preview: {
            select: { text: 'text', included: 'included' },
            prepare({ text, included }: { text?: string; included?: boolean }) {
              return {
                title: `${included ? '✅' : '❌'} ${text || 'Feature'}`,
              }
            },
          },
        },
      ],
    },
  ],
  preview: {
    select: { title: 'title', features: 'features' },
    prepare({ title, features }: { title?: string; features?: any[] }) {
      return {
        title: title || '✨ Feature List',
        subtitle: `${features?.length || 0} features`,
      }
    },
  },
}

// ============================================
// MAIN EXPORT - Complete rich content blocks
// ============================================
export const richContentBlocks = [
  // Text block with all formatting options
  {
    type: 'block',
    styles,
    lists,
    marks: {
      decorators,
      annotations,
    },
  },
  // Media
  imageBlock,
  youtubeBlock,
  videoEmbedBlock,
  // Code
  codeBlock,
  // Table
  tableBlock,
  // Info boxes
  calloutBlock,
  quoteBlock,
  // Interactive
  ctaButtonBlock,
  faqItemBlock,
  accordionBlock,
  // Layout
  dividerBlock,
  twoColumnBlock,
  // Lists
  prosConsBlock,
  featureListBlock,
  // Embeds
  socialEmbedBlock,
  // Downloads
  fileDownloadBlock,
  // Author
  authorCardBlock,
]

// Export individual blocks for selective use
export {
  decorators,
  annotations,
  styles,
  lists,
  imageBlock,
  codeBlock,
  tableBlock,
  calloutBlock,
  youtubeBlock,
  videoEmbedBlock,
  ctaButtonBlock,
  dividerBlock,
  faqItemBlock,
  accordionBlock,
  quoteBlock,
  fileDownloadBlock,
  socialEmbedBlock,
  authorCardBlock,
  twoColumnBlock,
  prosConsBlock,
  featureListBlock,
}
