import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://frown-diameter-charging.ngrok-free.dev/api";
const STORAGE_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, "");

export const getImageUrl = (path?: string | null): string => {
  if (!path) return "/assets/img/placeholder.webp";
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${STORAGE_BASE_URL}${cleanPath}`;
};

export const formatRupiah = (val: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(val);
};