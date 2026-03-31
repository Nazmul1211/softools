import { createImageUrlBuilder } from '@sanity/image-url'
import type { SanityImage } from '../types'
import { client } from './client'

const builder = createImageUrlBuilder(client)

export function urlFor(source: SanityImage) {
  return builder.image(source)
}

// Helper to get optimized image URL
export function getImageUrl(
  source: SanityImage,
  options?: {
    width?: number
    height?: number
    quality?: number
    format?: 'webp' | 'jpg' | 'png'
  }
) {
  if (!source) return null

  let imageBuilder = builder.image(source)

  if (options?.width) {
    imageBuilder = imageBuilder.width(options.width)
  }
  if (options?.height) {
    imageBuilder = imageBuilder.height(options.height)
  }
  if (options?.quality) {
    imageBuilder = imageBuilder.quality(options.quality)
  }
  if (options?.format) {
    imageBuilder = imageBuilder.format(options.format)
  }

  return imageBuilder.auto('format').url()
}
