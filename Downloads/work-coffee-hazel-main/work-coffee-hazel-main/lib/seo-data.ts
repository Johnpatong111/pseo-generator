export type Locale = 'pl' | 'en' | 'es'

export interface CitySeoContent {
  h1: string
  intro: string
  card1Title: string
  card1Text: string
  card2Title: string
  card2Text: string
  card3Title: string
  card3Text: string
  subheading: string
  bodyText1: string
  bodyText2: string
  featuresTitle: string
  features: string[]
  footerTag: string
}

export const seoTexts: Record<string, Record<Locale, CitySeoContent>> = {
  Torrevieja: {
    pl: {
      h1: 'Kawiarnie w Torrevieja – przewodnik po najlepszej kawie, śniadaniach i atmosferze',
      intro: 'Odkryj najlepsze kawiarnie w Torrevieja, w których wysoka jakość parzenia łączy się z wyjątkowym śródziemnomorskim klimatem. Niezależnie od tego, czy Twoim celem jest poranne espresso przy plaży Los Locos, śniadanie na bazie świeżych lokalnych produktów, czy przytulne miejsce z szybkim internetem do pracy, nasz przewodnik ułatwi Ci wybór idealnego lokalu.',
      card1Title: '☕ Kawa Specialty i Espresso Bar',
      card1Text: 'Lokalne kawiarnie w Torrevieja stawiają na wyselekcjonowane ziarna Arabica 100%, alternatywne metody parzenia (Drip, Aeropress, Chemex) oraz profesjonalną obsługę baristyczną.',
      card2Title: '🥐 Śniadania, Brunch i Desery',
      card2Text: 'Tradycyjne hiszpańskie tostadas z pomidorami i oliwą, domowe ciasta, obfite zestawy brunchowe, a także opcje bezglutenowe oraz mleka roślinne.',
      card3Title: '📍 Wyjątkowe Lokalizacje',
      card3Text: 'Spotkasz tu zarówno klimatyczne kawiarnie w centrum Torrevieja przy Plaza de la Constitución, jak i lokale usytuowane tuż przy nadmorskiej promenadzie w La Mata.',
      subheading: 'Dlaczego warto odwiedzić kawiarnie w Torrevieja?',
      bodyText1: 'Kultura kawowa na Costa Blanca rozwija się w bardzo szybkim tempie. Dzisiejsze kawiarnie w Torrevieja to nie tylko miejsca na szybkie wypicie kawy, ale pełnowartościowe przestrzenie spotkań towarzyskich i elastycznej pracy. Starannie zaprojektowane wnętrza, muzyka w tle i wyśmienity zapach świeżo palonych ziaren sprawiają, że każdy poranek staje się wyjątkowy.',
      bodyText2: 'Szukając idealnego miejsca, warto zwrócić uwagę na bogatą ofertę śniadaniową oraz dostępność udogodnień dla osób spędzających czas z laptopem. Stabilne łącze Wi-Fi i wygodne stoliki to standard w większości polecanych przez nas punktów.',
      featuresTitle: 'Co wyróżnia najlepsze kawiarnie w Torrevieja?',
      features: [
        'Świeżo palona kawa specialty z lokalnych i międzynarodowych palarni',
        'Szeroki wybór śniadań: od klasycznych tostów po nowoczesny brunch',
        'Lokalizacja blisko morza (Playa del Cura, La Mata, Los Locos)',
        'Miejsca przyjazne osobom pracującym zdalnie (szybkie Wi-Fi, gniazdka)',
      ],
      footerTag: 'good-mood-coffee.com — Kompleksowy przewodnik: Kawiarnie w Torrevieja',
    },
    en: {
      h1: 'Cafes in Torrevieja – The Ultimate Guide to Specialty Coffee & Breakfast',
      intro: 'Explore top-rated cafes in Torrevieja offering exceptional coffee quality, delicious brunch options, and a relaxing Mediterranean atmosphere. Whether you want a quick espresso near Los Locos beach, freshly baked sourdough pastries, or a comfortable workspace with fast Wi-Fi, our guide connects you with the finest venues.',
      card1Title: '☕ Specialty Coffee & Brews',
      card1Text: 'Venues brewing 100% Arabica single-origin beans, V60 pour-overs, cold brews, and perfectly balanced espresso drinks prepared by skilled baristas.',
      card2Title: '🥐 Fresh Bakery & Daily Brunch',
      card2Text: 'Artisan toasts, avocado bowls, French pastries, homemade cakes, vegan options, and alternative plant-based milks.',
      card3Title: '📍 Prime Beachside Locations',
      card3Text: 'From vibrant cafes in Torrevieja city center near Plaza de la Constitución to peaceful oceanfront spots in La Mata.',
      subheading: 'Enjoying the Coffee Scene in Torrevieja',
      bodyText1: 'The coffee movement along the Costa Blanca is growing rapidly. Modern cafes in Torrevieja combine traditional Spanish hospitality with international specialty coffee standards. They provide welcoming spaces where locals, tourists, and digital nomads can relax and recharge.',
      bodyText2: 'Whether you are planning a casual meeting with friends or looking for a quiet corner to get some remote work done on your laptop, these spots offer great ambiance, comfortable seating, and fast internet connections.',
      featuresTitle: 'Highlights of the Best Cafes in Torrevieja:',
      features: [
        'High-grade single-origin Arabica coffee beans',
        'Delicious breakfast and brunch served all day',
        'Scenic views near popular promenades and beaches',
        'Laptop-friendly spaces equipped with Wi-Fi and power outlets',
      ],
      footerTag: 'good-mood-coffee.com — Verified Guide: Cafes in Torrevieja',
    },
    es: {
      h1: 'Cafeterias en Torrevieja – Guía del buen café, desayunos y ambiente',
      intro: 'Descubre las mejores cafeterias en Torrevieja para disfrutar del café de especialidad, desayunos completos y momentos inolvidables junto al mar. Tanto si buscas un espresso perfecto cerca de la Playa del Cura como un espacio tranquilo con Wi-Fi para trabajar con tu portátil, te mostramos los locales más destacados.',
      card1Title: '☕ Café de Especialidad',
      card1Text: 'Cafeterías comprometidas con granos seleccionados de arábica, métodos de filtrado artesanal y extracciones impecables.',
      card2Title: '🥐 Desayunos y Repostería',
      card2Text: 'Tostadas tradicionales con tomate y aceite de oliva, repostería casera, tazas de fruta fresca y opciones vegetarianas.',
      card3Title: '📍 Ubicaciones Destacadas',
      card3Text: 'Encuentra locales en el centro histórico, junto a la Plaza de la Constitución o en el paseo marítimo de La Mata.',
      subheading: 'La experiencia del café en la Costa Blanca',
      bodyText1: 'La cultura cafetera está más viva que nunca. Las cafeterias en Torrevieja ofrecen la combinación perfecta entre el clima mediterráneo, instalaciones modernas y una oferta gastronómica de calidad superior para comenzar el día con energía.',
      bodyText2: 'Además de cuidar cada detalle en la preparación del café, muchos locales están adaptados para quienes necesitan hacer una pausa productiva, contando con mesas cómodas, enchufes y conexión a internet de alta velocidad.',
      featuresTitle: '¿Qué ofrecen las mejores cafeterias en Torrevieja?',
      features: [
        'Café recién tostado de tostaderos de especialidad',
        'Variedad de desayunos continentales y mediterráneos',
        'Excelentes terrazas soleadas cerca de las playas',
        'Espacios adaptados para el trabajo remoto con Wi-Fi',
      ],
      footerTag: 'good-mood-coffee.com — Guía de cafeterias en Torrevieja',
    },
  },
  Alicante: {
    pl: {
      h1: 'Kawiarnie w Alicante – Najlepsze miejsca na kawę specialty, brunch i spotkania',
      intro: 'Alicante to jedno z najważniejszych miast na kawowej mapie Hiszpanii. Znajdziesz tu zarówno rzemieślnicze palarnie, jak i stylowe kawiarnie w Alicante usytuowane w historycznym Casco Antiguo oraz w rejonie Mercado Central. Sprawdź, gdzie warto udać się na wyśmienite flat white, pożywne śniadanie czy spędzić czas przy laptopie.',
      card1Title: '☕ Palarnie i Specialty Coffee',
      card1Text: 'Rzemieślnicze kawiarnie w Alicante serwujące kawy z segmentu specialty, parzone przez doświadczonych baristów z użyciem najnowszych technologii.',
      card2Title: '🥑 Wyśmienity Brunch i Śniadania',
      card2Text: 'Autorskie śniadania: tosty z awokado, jajka po benedyktyńsku, świeże soki, puszyste naleśniki i opcje dla wegan.',
      card3Title: '📍 Stare Miasto i Centrum',
      card3Text: 'Unikalne lokale w ukrytych uliczkach zabytkowej dzielnicy El Barrio oraz przy reprezentacyjnej Explanada de España.',
      subheading: 'Odkryj wyjątkowe kawiarnie w Alicante',
      bodyText1: 'Różnorodność, jaką oferują kawiarnie w Alicante, zadowoli nawet najbardziej wymagających kawoszy. Od małych, kameralnych punktów ukrytych w historycznych uliczkach po nowoczesne, przestronne lokale z industrialnym wystrojem.',
      bodyText2: 'Dzięki doskonałej infrastrukturze i przyjaznej atmosferze, tutejsze miejsca są chętnie wybierane zarówno przez mieszkańców, jak i społeczność cyfrowych nomadów szukających komfortowych warunków do pracy z szybkim Wi-Fi.',
      featuresTitle: 'Dlaczego warto wybrać kawiarnie w Alicante?',
      features: [
        'Światowej klasy kawa specialty z najlepszych plantacji',
        'Bogate menu brunchowe serwowane przez cały dzień',
        'Wyjątkowy klimat zabytkowego centrum miasta',
        'Komfortowe warunki do pracy zdalnej i spotkań biznesowych',
      ],
      footerTag: 'good-mood-coffee.com — Najlepsze Kawiarnie w Alicante',
    },
    en: {
      h1: 'Cafes in Alicante – Specialty Coffee Shops, Brunch & Atmosphere',
      intro: 'Discover the vibrant world of cafes in Alicante. From artisan roasteries in the historic Casco Antiguo to sleek coffee bars near Mercado Central, Alicante offers an outstanding coffee scene. Explore top spots for specialty espresso, healthy breakfasts, and laptop-friendly environments.',
      card1Title: '☕ Specialty Roasters & Brews',
      card1Text: 'Top-tier cafes in Alicante brewing single-origin coffee, V60 pour-overs, iced lattes, and precise espresso extractions.',
      card2Title: '🥑 Artisan Brunch & Bakery',
      card2Text: 'Avocado toasts, poached eggs, fresh sourdough bread, organic bowls, and vegan pastry options.',
      card3Title: '📍 Old Town & Central Hubs',
      card3Text: 'Atmospheric venues tucked away in charming streets, close to Explanada de España and the Mediterranean coast.',
      subheading: 'The Growing Coffee Culture in Alicante',
      bodyText1: 'Alicante has established itself as a major specialty coffee hub in Spain. The local cafes in Alicante seamlessly blend traditional Mediterranean lifestyle with modern international culinary trends.',
      bodyText2: 'If you need a inspiring place to work remotely or simply want to catch up with friends over a perfectly brewed flat white, you will find plenty of great options equipped with reliable Wi-Fi and power outlets.',
      featuresTitle: 'Why Visit the Best Cafes in Alicante?',
      features: [
        'Top-rated single-origin specialty coffee beans',
        'All-day breakfast and healthy brunch choices',
        'Stunning urban and historic locations',
        'Excellent facilities for laptop users and remote workers',
      ],
      footerTag: 'good-mood-coffee.com — Verified Guide: Cafes in Alicante',
    },
    es: {
      h1: 'Cafeterias en Alicante – Guía de café de especialidad y desayunos',
      intro: 'Explora las mejores cafeterias en Alicante y sumérgete en la cultura del buen café. Desde tostaderos artesanales en el Casco Antiguo hasta locales modernos cerca del Mercado Central, Alicante cuenta con espacios únicos para disfrutar de un gran café, desayunar o trabajar con tu portátil.',
      card1Title: '☕ Tostaderos y Café Especial',
      card1Text: 'Cafeterías que priman la calidad del grano de origen, extracciones cuidadas y el talento de baristas profesionales.',
      card2Title: '🥑 Brunch y Desayunos Saludables',
      card2Text: 'Tostadas de masa madre, huevos escalfados, repostería artesana, zumos naturales y opciones veganas.',
      card3Title: '📍 Casco Antiguo y Centro',
      card3Text: 'Locales con encanto ubicados en las calles históricas del Barrio Santa Cruz y zonas comerciales del centro.',
      subheading: 'La escena cafetera de Alicante',
      bodyText1: 'Las cafeterias en Alicante se han convertido en referentes de innovación y calidad. Su ambiente acogedor y su apuesta por el café de especialidad atraen tanto a residentes como a visitantes de todo el mundo.',
      bodyText2: 'Muchos de estos espacios están pensados para responder a las necesidades de los trabajadores remotos, ofreciendo mesas amplias, enchufes y conexión a internet rápida en un entorno tranquilo.',
      featuresTitle: 'Lo mejor de las cafeterias en Alicante:',
      features: [
        'Café de especialidad de orígenes seleccionados',
        'Menú de brunch completo y variado',
        'Ubicaciones privilegiadas en el corazón de la ciudad',
        'Espacios adaptados con Wi-Fi rápido para portátiles',
      ],
      footerTag: 'good-mood-coffee.com — Guía de cafeterias en Alicante',
    },
  },
  'Orihuela Costa': {
    pl: {
      h1: 'Kawiarnie w Orihuela Costa – Gdzie na dobrą kawę i śniadanie przy plaży',
      intro: 'Szukasz kameralnej kawiarni z dobrą kawą na Orihuela Costa? Przygotowaliśmy zestawienie najlepszych miejsc w okolicach La Zenia, Playa Flamenca, Villamartín i Cabo Roig. Odkryj lokale słynące ze świeżej kawy, pysznych tostów i słonecznych tarasów.',
      card1Title: '☕ Dobra Kawa i Napoje',
      card1Text: 'Aromatyczne espresso, kremowe cappuccino, mrożone kawy mrożone oraz bogaty wybór herbat i świeżych soków.',
      card2Title: '🥐 Śniadania na Tarasie',
      card2Text: 'Świeże rogaliki, tradycyjne hiszpańskie tosty, domowe wypieki i desery serwowane w słonecznej atmosferze.',
      card3Title: '🌊 Blisko Plaży i Promenad',
      card3Text: 'Spokojne kawiarnie w Orihuela Costa położone blisko urokliwych plaż, ścieżek spacerowych i centrów handlowych.',
      subheading: 'Relaks i kawa na Orihuela Costa',
      bodyText1: 'Kawiarnie w Orihuela Costa to idealny wybór na niespieszny poranek z filiżanką ulubionego napoju. Nadmorski klimat sprzyja odpoczynkowi, a tutejsze lokale stawiają na gościnność i wysoką jakość serwowanych produktów.',
      bodyText2: 'Niezależnie od tego, czy planujesz krótki odpoczynek po spacerze na plaży, czy potrzebujesz cichego miejsca na godzinę z laptopem, tutejsze kawiarnie zapewniają komfort, miłą obsługę i dostęp do internetu.',
      featuresTitle: 'Atuty kawiarni na Orihuela Costa:',
      features: [
        'Wysoka jakość serwowanej kawy i zimnych napojów',
        'Słoneczne tarasy i ogródki otwarte przez cały rok',
        'Dogodne lokalizacje (La Zenia, Playa Flamenca, Cabo Roig)',
        'Przyjazne otoczenie do relaksu oraz elastycznej pracy',
      ],
      footerTag: 'good-mood-coffee.com — Najlepsze Kawiarnie w Orihuela Costa',
    },
    en: {
      h1: 'Cafes in Orihuela Costa – Best Coffee Spots, Breakfast & Terraces',
      intro: 'Find the top-rated cafes in Orihuela Costa around La Zenia, Playa Flamenca, Villamartín, and Cabo Roig. Our guide highlights welcoming spaces offering great coffee, fresh bakery products, and sunny outdoor seating perfect for starting your day.',
      card1Title: '☕ Quality Coffee & Refreshments',
      card1Text: 'Freshly brewed espresso, iced lattes, matcha drinks, and freshly squeezed fruit juices.',
      card2Title: '🥐 Breakfast & Terrace Dining',
      card2Text: 'Sourdough toasts, croissants, cakes, and healthy breakfast bowls served on sunny patios.',
      card3Title: '🌊 Seaside & Convenient Spots',
      card3Text: 'Cafes in Orihuela Costa located close to popular beaches, residential areas, and shopping promenades.',
      subheading: 'Enjoying Coffee on the Coast',
      bodyText1: 'The cafes in Orihuela Costa offer a relaxed coastal vibe where you can enjoy your morning coffee with pleasant sea breezes. The venues take pride in serving high-quality coffee alongside delicious local baked goods.',
      bodyText2: 'These cafes also cater to visitors who need a temporary workspace, providing comfortable seating, Wi-Fi access, and a calm setting for laptop work.',
      featuresTitle: 'Highlights of Cafes in Orihuela Costa:',
      features: [
        'Great selection of hot and cold coffee drinks',
        'Sunny outdoor patios available year-round',
        'Prime locations near La Zenia Boulevard and coastal paths',
        'Relaxed atmosphere suitable for meetings or remote tasks',
      ],
      footerTag: 'good-mood-coffee.com — Verified Guide: Cafes in Orihuela Costa',
    },
    es: {
      h1: 'Cafeterias en Orihuela Costa – Buen café, desayunos y terrazas soleadas',
      intro: 'Descubre las mejores cafeterias en Orihuela Costa en zonas como La Zenia, Playa Flamenca, Villamartín y Cabo Roig. Te mostramos los lugares ideales para tomar un buen café, disfrutar de un desayuno completo y relajarte en sus terrazas.',
      card1Title: '☕ Buen Café y Bebidas',
      card1Text: 'Variedad de cafés bien preparados, bebidas frías, infusiones de selección y zumos naturales.',
      card2Title: '🥐 Desayunos en la Terraza',
      card2Text: 'Tostadas variadas, repostería casera, tazas de fruta y opciones mediterráneas al sol.',
      card3Title: '🌊 Junto al Mar y Paseos',
      card3Text: 'Ubicaciones estratégicas cerca de las mejores playas y centros comerciales de Orihuela Costa.',
      subheading: 'Disfruta del café en la costa',
      bodyText1: 'Las cafeterias en Orihuela Costa destacan por su ambiente tranquilo y servicial. Son el lugar perfecto para comenzar la jornada con energía o hacer una pausa agradable durante el día.',
      bodyText2: 'Si buscas un espacio cómodo para conectarte con tu portátil, estos locales ofrecen un entorno idóneo con buena conexión Wi-Fi y atención personalizada.',
      featuresTitle: 'Ventajas de las cafeterias en Orihuela Costa:',
      features: [
        'Café de excelente calidad y preparación cuidada',
        'Terrazas al aire libre para disfrutar del sol mediterráneo',
        'Cerca de La Zenia, Playa Flamenca y zonas residenciales',
        'Espacios tranquilos adaptados con Wi-Fi para trabajar',
      ],
      footerTag: 'good-mood-coffee.com — Guía de cafeterias en Orihuela Costa',
    },
  },
}
export const heroTexts = {
  Torrevieja: {
    pl: {
      eyebrow: 'Kawiarnie w Torrevieja',
      title: 'Kawiarnie w Torrevieja — kawa specialty & dobry klimat',
      intro: 'Odkryj najlepsze kawiarnie w Torrevieja na spotkanie, relaks i pracę zdalną. Świeża kawa, pyszne śniadania i świetna atmosfera na Costa Blanca.',
    },
    en: {
      eyebrow: 'Cafes in Torrevieja',
      title: 'Cafes in Torrevieja — specialty coffee & great vibes',
      intro: 'Discover the best cafes in Torrevieja for meetings, relaxing, and remote work. Fine coffee, delicious breakfast, and welcoming spaces on the Costa Blanca.',
    },
    es: {
      eyebrow: 'Cafeterias en Torrevieja',
      title: 'Cafeterias en Torrevieja — café de especialidad y buen ambiente',
      intro: 'Descubre las mejores cafeterias en Torrevieja para reunirte, descansar y trabajar. Buen café, desayunos completos y ambiente agradable en la Costa Blanca.',
    },
  },
  Alicante: {
    pl: {
      eyebrow: 'Kawiarnie w Alicante',
      title: 'Kawiarnie w Alicante — palarnie, specialty & brunch',
      intro: 'Poznaj najlepsze kawiarnie w Alicante. Rzemieślnicze ziarna, autorskie śniadania i klimatyczne miejsca na spotkania oraz pracę z laptopem.',
    },
    en: {
      eyebrow: 'Cafes in Alicante',
      title: 'Cafes in Alicante — specialty coffee & brunch spots',
      intro: 'Explore top-rated cafes in Alicante. Single-origin beans, artisan breakfasts, and inspiring spaces in the heart of the city.',
    },
    es: {
      eyebrow: 'Cafeterias en Alicante',
      title: 'Cafeterias en Alicante — café de especialidad y brunch',
      intro: 'Explora las mejores cafeterias en Alicante. Tostaderos urbanos, desayunos de calidad y espacios con encanto en el centro histórico.',
    },
  },
  'Orihuela Costa': {
    pl: {
      eyebrow: 'Kawiarnie w Orihuela Costa',
      title: 'Kawiarnie w Orihuela Costa — kawa i śniadanie nad morzem',
      intro: 'Znajdź idealną kawiarnię na Orihuela Costa (La Zenia, Playa Flamenca). Wyśmienita kawa, słoneczne tarasy i przyjazne otoczenie do relaksu.',
    },
    en: {
      eyebrow: 'Cafes in Orihuela Costa',
      title: 'Cafes in Orihuela Costa — coffee & seaside terraces',
      intro: 'Find the best cafes in Orihuela Costa. Great coffee, sunny outdoor patios, and relaxing venues near the beach.',
    },
    es: {
      eyebrow: 'Cafeterias en Orihuela Costa',
      title: 'Cafeterias en Orihuela Costa — buen café y terrazas soleadas',
      intro: 'Encuentra las mejores cafeterias en Orihuela Costa. Excelente café, desayunos al sol y espacios tranquilos cerca del mar.',
    },
  },
}