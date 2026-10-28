import { seoTexts, Locale } from '@/lib/seo-data'

interface SeoSectionProps {
  city: string
  lang: Locale
}

export function SeoSection({ city, lang }: SeoSectionProps) {
  const currentCity = city === 'all' ? 'Torrevieja' : city
  const content = seoTexts[currentCity]?.[lang] || seoTexts.Torrevieja[lang]

  return (
    <section className="mx-auto max-w-[1240px] border-t border-[#302d29] px-4 pb-16 pt-10 sm:pt-12 lg:px-8">
      <div className="rounded-2xl border border-[#302d29] bg-[#211f1c] p-6 sm:p-8 lg:p-10 shadow-xl space-y-8">
        
        {/* Nagłówek i Intro */}
        <div>
          <h2 className="text-2xl font-bold text-[#f5f0e8] sm:text-3xl lg:text-4xl leading-tight">
            {content.h1}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-[#9d978e] sm:text-base">
            {content.intro}
          </p>
        </div>

        {/* 3 Kafelki */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-[#302d29] bg-[#2a2723] p-5">
            <h3 className="text-base font-semibold text-[#f5f0e8]">
              {content.card1Title}
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-[#8c877e] sm:text-sm">
              {content.card1Text}
            </p>
          </div>

          <div className="rounded-xl border border-[#302d29] bg-[#2a2723] p-5">
            <h3 className="text-base font-semibold text-[#f5f0e8]">
              {content.card2Title}
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-[#8c877e] sm:text-sm">
              {content.card2Text}
            </p>
          </div>

          <div className="rounded-xl border border-[#302d29] bg-[#2a2723] p-5">
            <h3 className="text-base font-semibold text-[#f5f0e8]">
              {content.card3Title}
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-[#8c877e] sm:text-sm">
              {content.card3Text}
            </p>
          </div>
        </div>

        {/* Rozwinięcie tekstowe */}
        <div className="space-y-4 text-xs leading-relaxed text-[#8c877e] sm:text-sm border-t border-[#302d29] pt-6">
          <h3 className="text-base font-semibold text-[#d9d2c8] sm:text-lg">
            {content.subheading}
          </h3>
          <p className="text-[#9d978e]">{content.bodyText1}</p>
          <p className="text-[#9d978e]">{content.bodyText2}</p>
        </div>

        {/* Lista atutów */}
        <div className="rounded-xl border border-[#302d29] bg-[#1a1917] p-5 space-y-3">
          <h4 className="text-sm font-semibold text-[#f5f0e8]">
            {content.featuresTitle}
          </h4>
          <ul className="grid gap-2 sm:grid-cols-2 text-xs text-[#9d978e] sm:text-sm">
            {content.features.map((item, index) => (
              <li key={index} className="flex items-center gap-2">
                <span className="text-[#c98d54]">✓</span> {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Stopka podstrony */}
        <div className="border-t border-[#302d29] pt-4 text-[11px] text-[#6f6a63]">
          {content.footerTag} • Updated 2026
        </div>

      </div>
    </section>
  )
}