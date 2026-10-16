import type { BlogPostSummary } from '@/lib/blog-format'
import { guidesByProduct } from '@/lib/blog-products'
import BlogCta from './BlogCta'
import BlogExplorer from './BlogExplorer'
import BlogHeader from './BlogHeader'
import BlogSearch from './BlogSearch'

/**
 * Listagem do blog: abertura com a busca, filtros e artigos que trocam no lugar
 * (ver `BlogExplorer`) e o fechamento. Todas as rotas da listagem usam este
 * mesmo componente; o que muda entre elas é só o endereço, que o explorador lê.
 * A abertura é igual em todas, então trocar de categoria não a faz piscar.
 */
export default function BlogListing({ posts }: { posts: BlogPostSummary[] }) {
  // O índice da busca leva só o que ela usa
  const searchIndex = posts.map(({ slug, title, description, category, tags, date }) => ({
    slug,
    title,
    description,
    category,
    tags,
    date,
  }))

  return (
    <div className="bg-white">
      <BlogHeader
        borderless
        eyebrow="Blog Venda Forte"
        title={
          <>
            Conteúdo técnico para quem <span className="whitespace-nowrap text-red-600">compra e opera</span> empilhadeiras
          </>
        }
        intro="Fichas técnicas explicadas, comparativos e guias de decisão sobre a linha EP Equipment de lítio, escritos pela equipe da Venda Forte."
      >
        <div className="mx-auto mt-9 max-w-2xl">
          <BlogSearch index={searchIndex} />
        </div>
      </BlogHeader>

      <BlogExplorer posts={posts} guides={guidesByProduct(posts)} />

      <BlogCta />
    </div>
  )
}
