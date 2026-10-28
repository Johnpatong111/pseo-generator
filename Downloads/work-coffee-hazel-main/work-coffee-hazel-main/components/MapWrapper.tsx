'use client'

import dynamic from 'next/dynamic'

const CoffeeMap = dynamic(() => import('./CoffeeMap'), {
  ssr: false,
  loading: () => <div className="w-full h-[400px] bg-[#211f1c] rounded-2xl animate-pulse mb-8 border border-[#302d29]" />,
})

type MapWrapperProps = {
  cafes: Array<{
    name: string
    lat: number
    lng: number
    area: string
    slug: string
    lang: string
  }>
  center: [number, number]
  zoom?: number
}

export default function MapWrapper({ cafes, center, zoom = 13 }: MapWrapperProps) {
  return <CoffeeMap cafes={cafes} center={center} zoom={zoom} />
}