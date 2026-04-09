import type { Metadata } from 'next'
import HeroBanner from "@/components/home/HeroBanner"
import CategoryCards from "@/components/home/CategoryCards"
import FeaturedSection from "@/components/home/FeaturedSection"

export const metadata: Metadata = {
  title: 'Guia & Server List',
  description: 'O guia completo de Soulmask em português — itens, máscaras, guias e patch notes.',
  alternates: {
    canonical: '/',
  },
}

export default function Home() {
  return (
    <>
      <HeroBanner />
      <div className="py-12 space-y-12">
        <CategoryCards />
        <FeaturedSection />
      </div>
    </>
  )
}
