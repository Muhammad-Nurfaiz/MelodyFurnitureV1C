export interface Thumbnail {
  id: string;
  url: string;
  alt_text?: string;
}

export interface CategoryOrSeries {
  id: string;
  name: string;
  slug: string;
}

export interface ProductSpecification {
  dimensions?: string;
  weight?: number;
  packing_weight?: number;
  load_capacity?: string;
  assembly_required?: boolean;
}

export interface ProductMedia {
  id: string;
  media_type: "image" | "video";
  url: string;
  thumbnail_url?: string;
  alt_text?: string;
  is_main: boolean;
  sort_order: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  product_detail?: string;
  original_price: number;
  discount_price: number;
  discount_percentage: number | null;
  is_sale: boolean;
  price: number;
  formatted_price: string;
  average_rating: number;
  total_stock?: number;
  total_sold: number;
  video_tutorial_url?: string | null;
  origin_city?: string;
  thumbnail?: Thumbnail | null;
  category: CategoryOrSeries;
  series: CategoryOrSeries | string | null;
  specification?: ProductSpecification;
  media?: ProductMedia[];
}

export interface HeroSlide {
  id: string;
  image: string;
  eyebrow: string | null;
  title: string;
  description: string;
  button_text: string;
  button_url: string;
  sort_order: number;
}

export interface CategoryOrSeriesItem {
  id: string;
  name: string;
  slug: string;
}

export interface CatalogData {
  categories: CategoryOrSeriesItem[];
  seriesList: CategoryOrSeriesItem[];
  products: Product[];
}