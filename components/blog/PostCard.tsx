import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { categoryOf, formatPostDate, postDateTime, type BlogPostSummary } from '@/lib/blog-format'
import PostImage from './PostImage'

interface PostCardProps {
  post: BlogPostSummary
  /** Primeira linha da página: a capa carrega com prioridade. */
  priority?: boolean
}

/** Cartão de um post na listagem, nos resultados da busca e nos "relacionados". */
export default function PostCard({ post, priority = false }: PostCardProps) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gray-300 hover:shadow-xl focus-within:ring-2 focus-within:ring-red-500 focus-within:ring-offset-2">
      <div className="relative aspect-[16/9] overflow-hidden bg-gray-900">
        <PostImage
          src={post.image}
          alt={`Capa do artigo: ${post.title}`}
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 400px"
          priority={priority}
          className="transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-bold uppercase tracking-wider text-red-600">{categoryOf(post)}</p>
        <h3 className="mt-2 text-balance text-xl font-bold leading-snug text-gray-900 transition-colors group-hover:text-red-600">
          <Link
            href={`/blog/${post.slug}`}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
          >
            {post.title}
          </Link>
        </h3>
        {post.description && (
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-gray-600">{post.description}</p>
        )}

        {/* O respiro fica fora da linha: com a descrição no limite de linhas, o texto não encosta nela */}
        <div className="mt-auto pt-6">
          <div className="flex items-center justify-between gap-4 border-t border-gray-100 pt-5 text-xs text-gray-500">
            <p>
              <time dateTime={postDateTime(post.date)}>{formatPostDate(post.date, 'short')}</time>
              <span aria-hidden="true"> · </span>
              {post.readingTime}
            </p>
            <ArrowUpRight
              aria-hidden="true"
              className="h-4 w-4 shrink-0 text-gray-400 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-red-600"
            />
          </div>
        </div>
      </div>
    </article>
  )
}
