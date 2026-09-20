// services/orderService.ts
import { fetchAPI } from "@/lib/api";

export interface TrackOrderResponse {
  success: boolean;
  orderId: string;
  status: string;
  timeline: Array<{
    title: string;
    description: string;
    time: string;
    completed: boolean;
    current: boolean;
  }>;
}

// 1. Service untuk mengecek status resi/pesanan
export async function trackOrderAPI(orderId: string): Promise<TrackOrderResponse> {
  return fetchAPI<TrackOrderResponse>(`/orders/track/${orderId}`, {
    method: 'GET',
  });
}

// 2. Service untuk cek status pembayaran
export async function checkPaymentStatusAPI(orderId: string) {
  return fetchAPI(`/payments/status/${orderId}`, {
    method: 'GET',
  });
}