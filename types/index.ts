export type UserRole = 'admin' | 'editor' | 'viewer'

export interface Profile {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  role: UserRole
  created_at: string
  updated_at: string
}

export interface SiteSetting {
  id: string
  key: string
  value?: string
  value_json?: unknown
  updated_at: string
}

export interface MediaItem {
  id: string
  filename: string
  original_name?: string
  url: string
  thumbnail_url?: string
  size?: number
  mime_type?: string
  alt_text?: string
  caption?: string
  folder: string
  created_at: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description?: string
  short_description?: string
  price?: number
  price_label?: string
  image_url?: string
  gallery?: string[]
  category?: string
  tags?: string[]
  features?: { label: string; value: string }[]
  is_featured: boolean
  is_available: boolean
  sort_order: number
  seo_title?: string
  seo_description?: string
  created_at: string
  updated_at: string
}

export interface PortfolioItem {
  id: string
  title: string
  slug: string
  description?: string
  image_url: string
  gallery?: string[]
  category?: string
  tags?: string[]
  is_featured: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Testimonial {
  id: string
  customer_name: string
  customer_title?: string
  customer_photo?: string
  content: string
  rating: number
  is_featured: boolean
  is_published: boolean
  sort_order: number
  created_at: string
}

export interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  is_published: boolean
  sort_order: number
  created_at: string
}

export interface BlogCategory {
  id: string
  name: string
  slug: string
  description?: string
  created_at: string
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt?: string
  content?: string
  featured_image?: string
  category_id?: string
  category?: BlogCategory
  author_id?: string
  author?: Profile
  status: 'draft' | 'published'
  is_featured: boolean
  published_at?: string
  seo_title?: string
  seo_description?: string
  og_image?: string
  created_at: string
  updated_at: string
}

export interface ContactSubmission {
  id: string
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
  is_read: boolean
  notes?: string
  created_at: string
}

export interface HomepageSection {
  id: string
  section_key: string
  title?: string
  subtitle?: string
  content?: string
  button_text?: string
  button_url?: string
  button_secondary_text?: string
  button_secondary_url?: string
  image_url?: string
  background_url?: string
  items?: unknown[]
  enabled: boolean
  sort_order: number
  updated_at: string
}

export interface NavigationMenu {
  id: string
  name: string
  slug: string
  items: NavItem[]
  updated_at: string
}

export interface NavItem {
  id: string
  label: string
  url: string
  order: number
  children?: NavItem[]
}

export interface SeoSettings {
  id: string
  page_path: string
  title?: string
  description?: string
  og_title?: string
  og_description?: string
  og_image?: string
  robots?: string
  canonical_url?: string
  updated_at: string
}
