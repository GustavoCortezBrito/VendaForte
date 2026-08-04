import Hero from '@/components/Hero'
import MonthlyHighlight from '@/components/MonthlyHighlight'
import About from '@/components/About'
import Services from '@/components/Services'
import EPForkliftsSection from '@/components/EPForkliftsSection'
import Stats from '@/components/Stats'
import Testimonials from '@/components/Testimonials'
import FAQ from '@/components/FAQ'
import Contact from '@/components/Contact'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Hero />
      <MonthlyHighlight />
      <About />
      <EPForkliftsSection />
      <Services />
      <Stats />
      <Testimonials />
      <FAQ />
      <Contact />
    </main>
  )
}
