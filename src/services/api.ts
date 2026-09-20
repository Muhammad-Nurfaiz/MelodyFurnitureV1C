import { HeroSlide, CategoryOrSeriesItem, Product, CatalogData } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api";

export async function fetchWithAuth<T>(endpoint: string, token: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed fetching ${endpoint}: ${res.statusText}`);
  }

  const json = await res.json();

  // JIKA response merupakan Laravel Paginated Response (memiliki meta/links), kembalikan seluruh JSON utuh
  if (json && (json.meta !== undefined || json.links !== undefined)) {
    return json as T;
  }

  // Untuk response endpoint standar yang dibungkus { data: ... }
  return json.data !== undefined ? json.data : json;
}

export async function getCustomerToken(): Promise<string> {
  let token = typeof window !== "undefined" ? localStorage.getItem("guest_session_id") : null;
  
  if (!token) {
    const sessionRes = await fetch(`${API_BASE_URL}/customer/session`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
    });
    
    if (sessionRes.ok) {
      const sessionData = await sessionRes.json();
      token = sessionData.data?.guest_token || sessionData.guest_token || "";
      if (token && typeof window !== "undefined") {
        localStorage.setItem("guest_session_id", token);
      }
    }
  }

  return token || "";
}

export async function getProductDetail(slug: string): Promise<Product> {
  const res = await fetch(`${API_BASE_URL}/products/${slug}`, {
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    throw new Error("Gagal mengambil data produk");
  }

  const json = await res.json();
  return json.data;
}

export async function getProductRecommendations(slug: string): Promise<Product[]> {
  const res = await fetch(`${API_BASE_URL}/products/${slug}/recommendations`, {
    headers: { Accept: "application/json" },
  });

  if (!res.ok) return [];

  const json = await res.json();
  return json.data || [];
}

export async function getHomePageData() {
  const token = await getCustomerToken();

  const [heroesData, categoriesData, seriesData, productsData, promosData] = await Promise.allSettled([
    fetchWithAuth<HeroSlide[]>("/home/heroes", token),
    fetchWithAuth<CategoryOrSeriesItem[]>("/categories", token),
    fetchWithAuth<CategoryOrSeriesItem[]>("/series", token),
    fetchWithAuth<Product[]>("/products", token),
    fetchWithAuth<any[]>("/home/promos", token),
  ]);

  return {
    heroSlides: heroesData.status === "fulfilled" ? heroesData.value : [],
    categories: categoriesData.status === "fulfilled" ? categoriesData.value : [],
    seriesList: seriesData.status === "fulfilled" ? seriesData.value : [],
    products: productsData.status === "fulfilled" ? (Array.isArray(productsData.value) ? productsData.value : (productsData.value as any)?.data || []) : [],
    promos: promosData.status === "fulfilled" ? promosData.value : [],
  };
}

// 1. Fetch metadata kategori & series (Data ringkas & jarang berubah)
export async function getCatalogMeta(): Promise<{
  categories: CategoryOrSeriesItem[];
  seriesList: CategoryOrSeriesItem[];
}> {
  const token = await getCustomerToken();
  const [categoriesData, seriesData] = await Promise.allSettled([
    fetchWithAuth<CategoryOrSeriesItem[]>("/categories", token),
    fetchWithAuth<CategoryOrSeriesItem[]>("/series", token),
  ]);

  return {
    categories: categoriesData.status === "fulfilled" ? categoriesData.value : [],
    seriesList: seriesData.status === "fulfilled" ? seriesData.value : [],
  };
}

export interface CursorPaginatedResponse<T> {
  data: T[];
  meta?: {
    path?: string;
    per_page?: number;
    next_cursor?: string | null;
    next_page_url?: string | null;
    prev_cursor?: string | null;
    prev_page_url?: string | null;
  };
  links?: {
    first?: string | null;
    last?: string | null;
    prev?: string | null;
    next?: string | null;
  };
}

export async function getProducts(params?: {
  category?: string;
  series?: string;
  search?: string;
  sale?: boolean;
  cursor?: string | null;
}): Promise<CursorPaginatedResponse<Product>> {
  const token = await getCustomerToken();
  const query = new URLSearchParams();

  // UBAH NAMA QUERY KEY SESUAI EKSPEKTASI BACKEND:
  if (params?.category) query.append("category", params.category); // Ubah 'category' -> 'category_slug'
  if (params?.series) query.append("series", params.series);       // Sesuaikan jika series juga menggunakan slug (e.g. series_slug)
  if (params?.search) query.append("search", params.search);
  if (params?.sale) query.append("sale", "true");                   // Ubah 'sale' -> 'is_sale'
  if (params?.cursor) query.append("cursor", params.cursor);

  const endpoint = `/products?${query.toString()}`;
  return fetchWithAuth<CursorPaginatedResponse<Product>>(endpoint, token);
}