// Types for Places
export interface Place {
  id?: number
  name: string
  category: string
  address: string
  city: string
  phone: string
  website: string
  instagram: string
  description: string
  image_url: string | null
  hours: string
  featured: boolean
  tags: string[]
}

// Types for Events
export interface Event {
  id?: number
  title: string
  category: string
  description: string
  start_date: string
  end_date: string
  start_time: string
  location: string
  image_url: string | null
  featured: boolean
}

// Types for Services
export interface Service {
  id?: number
  name: string
  category: string
  description: string
  contact_name: string
  phone: string
  email: string
  website: string
  address: string
  service_area: string
  hours: string
  image_url: string | null
  document_url?: string | null
  featured: boolean
}

// Types for Brands
export interface Brand {
  id?: number
  name: string
  category: string
  year_founded: string
  address: string
  city: string
  phone: string
  website: string
  instagram: string
  description: string
  notable_products: string
  where_to_buy: string
  image_url: string | null
  featured: boolean
  created_at?: string
  updated_at?: string
}

// Category types from the Python admin tool
export const PLACE_CATEGORIES = [
  'traditional-cuisine', 'modern-dining', 'cocktail-bars', 'cantinas',
  'live-music', 'terraces', 'restaurants-with-playgrounds',
  'private-dining-rooms', 'language-exchange-cafes', 'remote-work-cafes',
  'easy-parking-spots', 'international-markets', 'english-speaking-healthcare',
  'family-activities', 'sports-fitness', 'outdoor-activities',
  'activities-rainy-day', 'local-organic-products', 'shop'
]

export const EVENT_CATEGORIES = [
  'arts-culture', 'culinary', 'music', 'kids-family', 'sports',
  'traditional', 'wellness', 'community-social'
]

export const SERVICE_CATEGORIES = [
  'relocation', 'housing', 'legal', 'community', 'family',
  'petcare', 'wellness', 'homeservices', 'cultural', 'experiences'
]

export const BRAND_CATEGORIES = [
  'food', 'beverages', 'clothing', 'crafts', 'household', 
  'cosmetics', 'technology', 'furniture', 'accessories',
  'automotive', 'entertainment', 'other'
] 