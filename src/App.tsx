import { useCallback, useState } from 'react'
import { Navbar } from '@/components/sections/Navbar'
import { Hero, type QuickSearch } from '@/components/sections/Hero'
import { TrustStrip } from '@/components/sections/TrustStrip'
import { Inventory } from '@/components/sections/Inventory'
import { Financing } from '@/components/sections/Financing'
import { TradeIn } from '@/components/sections/TradeIn'
import { HowItWorks } from '@/components/sections/HowItWorks'
import { Service } from '@/components/sections/Service'
import { Reviews } from '@/components/sections/Reviews'
import { FinalCTA } from '@/components/sections/FinalCTA'
import { Footer } from '@/components/sections/Footer'
import { defaultFilters, type InventoryFilters } from '@/data/inventory'

export default function App() {
  const [filters, setFilters] = useState<InventoryFilters>(defaultFilters)

  const handleQuickSearch = useCallback((q: QuickSearch) => {
    setFilters({ ...defaultFilters, ...q })
    document.getElementById('inventory')?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return (
    <>
      <a
        href="#inventory"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold"
      >
        Skip to inventory
      </a>
      <Navbar />
      <main>
        <Hero onQuickSearch={handleQuickSearch} />
        <TrustStrip />
        <Inventory filters={filters} setFilters={setFilters} />
        <Financing />
        <TradeIn />
        <HowItWorks />
        <Service />
        <Reviews />
        <FinalCTA />
      </main>
      <Footer />
    </>
  )
}
