import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { client, BLOG_POST_BY_SLUG_QUERY, BLOG_POSTS_QUERY, urlFor } from '@/sanity'
import { PortableText } from '@/components/sanity'
import type { BlogPost, BlogPostListItem } from '@/sanity/types'
import { Calendar, ArrowLeft } from 'lucide-react'
import { Sidebar } from '@/components/layout/Sidebar'

export const revalidate = 3600 // Revalidate every hour

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getBlogPost(slug: string): Promise<BlogPost | null> {
  return client.fetch(BLOG_POST_BY_SLUG_QUERY, { slug })
}

async function getAllBlogPosts(): Promise<BlogPostListItem[]> {
  return client.fetch(BLOG_POSTS_QUERY)
}

export async function generateStaticParams() {
  const posts = await getAllBlogPosts()
  return posts.map((post) => ({
    slug: post.slug?.current || '',
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post) {
    return {
      title: 'Post Not Found - Softzar',
    }
  }

  const seoTitle = post.seo?.metaTitle || post.title
  const seoDescription = post.seo?.metaDescription || post.excerpt

  return {
    title: `${seoTitle} - Softzar Blog`,
    description: seoDescription,
    keywords: post.seo?.keywords,
    openGraph: {
      title: seoTitle,
      description: seoDescription || '',
      type: 'article',
      publishedTime: post.publishedAt,
      authors: post.author?.name ? [post.author.name] : [],
      images: post.seo?.ogImage?.asset
        ? [urlFor(post.seo.ogImage).width(1200).height(630).url()]
        : post.featuredImage?.asset
          ? [urlFor(post.featuredImage).width(1200).height(630).url()]
          : [],
    },
    robots: post.seo?.noIndex ? 'noindex, nofollow' : 'index, follow',
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

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post) {
    notFound()
  }

  return (
    <article className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Back Link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
            {/* Main Content */}
            <div className="min-w-0">
              {/* Header */}
              <header className="mb-8">
          {/* Categories */}
          {post.categories && post.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.categories.map((category) => (
                <Link
                  key={category.slug?.current}
                  href={`/blog/category/${category.slug?.current}`}
                  className="text-sm font-medium px-3 py-1 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors"
                >
                  {category.title}
                </Link>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-xl text-muted-foreground mb-6">
              {post.excerpt}
            </p>
          )}

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
            {post.author && (
              <div className="flex items-center gap-2">
                {post.author.image && (
                  <Image
                    src={urlFor(post.author.image).width(40).height(40).url()}
                    alt={post.author.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                )}
                <div>
                  <span className="font-medium text-foreground">{post.author.name}</span>
                  {post.author.role && (
                    <span className="block text-sm">{post.author.role}</span>
                  )}
                </div>
              </div>
            )}
            {post.publishedAt && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <time dateTime={post.publishedAt}>
                  {formatDate(post.publishedAt)}
                </time>
              </div>
            )}
          </div>
        </header>

        {/* Featured Image */}
        {post.featuredImage?.asset && (
          <div className="relative aspect-video mb-8 rounded-xl overflow-hidden">
            <Image
              src={urlFor(post.featuredImage).width(1200).height(675).url()}
              alt={post.featuredImage.alt || post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Content */}
        {post.content && (
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <PortableText value={post.content} />
          </div>
        )}

        {/* Related Tools */}
        {post.relatedTools && post.relatedTools.length > 0 && (
          <div className="mt-12 p-6 bg-muted rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Related Tools</h2>
            <div className="flex flex-wrap gap-2">
              {post.relatedTools.map((tool) => (
                <Link
                  key={tool}
                  href={`/tools/${tool}`}
                  className="px-4 py-2 bg-background rounded-lg hover:bg-primary/10 transition-colors border"
                >
                  {tool.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Author Box */}
        {post.author && (
          <div className="mt-12 p-6 bg-card rounded-lg border">
            <div className="flex items-start gap-4">
              {post.author.image && (
                <Image
                  src={urlFor(post.author.image).width(80).height(80).url()}
                  alt={post.author.name}
                  width={80}
                  height={80}
                  className="rounded-full flex-shrink-0"
                />
              )}
              <div>
                <h3 className="font-semibold text-lg">{post.author.name}</h3>
                {post.author.role && (
                  <p className="text-muted-foreground text-sm mb-2">{post.author.role}</p>
                )}
                {post.author.bio && (
                  <p className="text-muted-foreground">{post.author.bio}</p>
                )}
                {post.author.socialLinks && (
                  <div className="flex gap-3 mt-3">
                    {post.author.socialLinks.twitter && (
                      <a
                        href={post.author.socialLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary"
                      >
                        Twitter
                      </a>
                    )}
                    {post.author.socialLinks.linkedin && (
                      <a
                        href={post.author.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary"
                      >
                        LinkedIn
                      </a>
                    )}
                    {post.author.socialLinks.github && (
                      <a
                        href={post.author.socialLinks.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary"
                      >
                        GitHub
                      </a>
                    )}
                  </div>
                )}
              </div>
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
