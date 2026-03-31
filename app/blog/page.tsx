import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { client, BLOG_POSTS_QUERY, urlFor } from '@/sanity'
import type { BlogPostListItem } from '@/sanity/types'

export const metadata: Metadata = {
  title: 'Blog - Softzar',
  description: 'Read our latest articles about tools, calculators, software reviews, and productivity tips.',
}

export const revalidate = 3600 // Revalidate every hour

async function getBlogPosts(): Promise<BlogPostListItem[]> {
  return client.fetch(BLOG_POSTS_QUERY)
}

function formatDate(dateString: string | undefined) {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default async function BlogPage() {
  const posts = await getBlogPosts()

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Blog</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover tips, tutorials, and insights about calculators, tools, and software to boost your productivity.
          </p>
        </div>

        {/* Blog Posts Grid */}
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">No blog posts yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article
                key={post._id}
                className="group bg-card rounded-lg border shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <Link href={`/blog/${post.slug?.current}`}>
                  {/* Featured Image */}
                  <div className="relative aspect-video overflow-hidden bg-muted">
                    {post.featuredImage?.asset ? (
                      <Image
                        src={urlFor(post.featuredImage).width(600).height(340).url()}
                        alt={post.featuredImage.alt || post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                        <svg className="w-16 h-16 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    {/* Categories */}
                    {post.categories && post.categories.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.categories.slice(0, 2).map((category) => (
                          <span
                            key={category.slug?.current}
                            className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded"
                          >
                            {category.title}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Title */}
                    <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h2>

                    {/* Excerpt */}
                    {post.excerpt && (
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}

                    {/* Meta */}
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      {post.author && (
                        <div className="flex items-center gap-2">
                          {post.author.image && (
                            <Image
                              src={urlFor(post.author.image).width(24).height(24).url()}
                              alt={post.author.name}
                              width={24}
                              height={24}
                              className="rounded-full"
                            />
                          )}
                          <span>{post.author.name}</span>
                        </div>
                      )}
                      {post.publishedAt && (
                        <>
                          <span>•</span>
                          <time dateTime={post.publishedAt}>
                            {formatDate(post.publishedAt)}
                          </time>
                        </>
                      )}
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
