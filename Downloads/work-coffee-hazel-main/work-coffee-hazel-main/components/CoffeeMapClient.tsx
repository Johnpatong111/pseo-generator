'use client'

import dynamic from 'next/dynamic'

const CoffeeMap = dynamic(() => import('@/components/CoffeeMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-[#211f1c] rounded-2xl animate-pulse mb-8 border border-[#302d29] flex items-center justify-center text-[#8c877e]">
      Ładowanie mapy...
    </div>
  ),
})

export default CoffeeMap