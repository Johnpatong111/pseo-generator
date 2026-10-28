'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import Link from 'next/link'

// Naprawa domyślnych ikonek markerów Leafleta w środowisku Next.js
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

L.Marker.prototype.options.icon = L.icon({
  iconUrl: typeof icon === 'string' ? icon : (icon as any).src,
  shadowUrl: typeof iconShadow === 'string' ? iconShadow : (iconShadow as any).src,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

type Cafe = {
  name: string
  lat: number
  lng: number
  area: string
  slug: string
  lang: string
}

type CoffeeMapProps = {
  cafes: Cafe[]
  center: [number, number]
  zoom?: number
}

export default function CoffeeMap({ cafes, center, zoom = 13 }: CoffeeMapProps) {
  return (
    <div className="w-full h-[400px] rounded-2xl overflow-hidden border border-[#302d29] shadow-lg z-0">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {cafes.map((cafe, index) => (
          <Marker key={index} position={[cafe.lat, cafe.lng]}>
            <Popup>
              <div className="text-[#171614] p-1">
                <h3 className="font-bold text-base mb-1">{cafe.name}</h3>
                <p className="text-xs text-gray-600 mb-2">{cafe.area}</p>
                <Link
                  href={`/${cafe.lang}/cafe/${cafe.slug}`}
                  className="inline-block bg-[#171614] text-[#f5f0e8] text-xs px-3 py-1 rounded-md font-medium"
                >
                  Zobacz kawiarnię
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}