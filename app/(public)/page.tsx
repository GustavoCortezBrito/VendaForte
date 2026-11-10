import Hero from '@/components/Hero'
import MonthlyHighlight from '@/components/MonthlyHighlight'
import About from '@/components/About'
import Services from '@/components/Services'
import EPForkliftsSection from '@/components/EPForkliftsSection'
import Stats from '@/components/Stats'
import Testimonials from '@/components/Testimonials'
import FAQ from '@/components/FAQ'
import Contact from '@/components/Contact'
import { allProducts, productsOfType, TYPE_PAGES } from '@/lib/catalog'
import { servicesSchema } from '../additional-schemas'

const categories = TYPE_PAGES.map((type) => ({
  label: type.short,
  href: `/produtos/tipo/${type.slug}`,
  count: productsOfType(type).length,
}))

export default function Home() {
  return (
    <main className="min-h-screen bg-ink">
      {/* Serviços da empresa: descrevem a página inicial, não o site todo */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesSchema) }} />
      <Hero />
      <Stats />
      <MonthlyHighlight />
      <EPForkliftsSection total={allProducts.length} categories={categories} />
      <Services />
      <About />
      <Testimonials />
      <FAQ />
      <Contact />
    </main>
  )
}
