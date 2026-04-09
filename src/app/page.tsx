import HeroBanner from "@/components/home/HeroBanner"
import CategoryCards from "@/components/home/CategoryCards"
import FeaturedSection from "@/components/home/FeaturedSection"

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
