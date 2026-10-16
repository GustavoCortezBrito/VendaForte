import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { categoryOf, formatPostDate, postDateTime, type BlogPostSummary } from '@/lib/blog-format'
import PostImage from './PostImage'

/** O post mais recente, em destaque no topo da primeira página. */
export default function FeaturedPost({ post }: { post: BlogPostSummary }) {
  return (
    <article className="group relative grid overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-lg transition-shadow duration-300 hover:shadow-2xl lg:grid-cols-12">
      <div className="relative aspect-[16/10] bg-gray-900 lg:col-span-7 lg:aspect-auto lg:min-h-[420px]">
        <PostImage
          src={post.image}
          alt={`Capa do artigo: ${post.title}`}
          sizes="(max-width: 1024px) 100vw, 58vw"
          priority
          className="transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-col justify-center p-8 lg:col-span-5 lg:p-12">
        <p className="text-xs font-bold uppercase tracking-wider text-red-600">
          Mais recente <span aria-hidden="true">·</span> {categoryOf(post)}
        </p>
        <h3 className="mt-3 text-balance text-3xl font-extrabold leading-tight tracking-tight text-gray-900 transition-colors group-hover:text-red-600 lg:text-4xl">
          <Link
            href={`/blog/${post.slug}`}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
          >
            {post.title}
          </Link>
        </h3>
        {post.description && <p className="mt-4 line-clamp-4 leading-relaxed text-gray-600">{post.description}</p>}
        <p className="mt-6 text-sm text-gray-500">
          <time dateTime={postDateTime(post.date)}>{formatPostDate(post.date)}</time>
          <span aria-hidden="true"> · </span>
          {post.readingTime}
        </p>
        <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-red-600">
          Ler o artigo
          <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </article>
  )
}
