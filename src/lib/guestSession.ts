// src/lib/guestSession.ts
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://127.0.0.1:8000/api";

export const initGuestSession = async (): Promise<string | null> => {
  let sessionId = localStorage.getItem("guest_session_id");

  if (sessionId) {
    return sessionId;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/customer/session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (response.ok) {
      const resData = await response.json();
      
      // Ambil token resmi yang dibuat oleh Laravel
      sessionId = resData?.data?.guest_token || resData?.data?.guest_session_id;

      if (sessionId) {
        localStorage.setItem("guest_session_id", sessionId);
        return sessionId;
      }
    }
  } catch (error) {
    console.error("Gagal mendapatkan guest session dari Laravel:", error);
  }

  return null;
};

export const refreshGuestSession = async (): Promise<string | null> => {
  if (typeof window === "undefined") {
    return null;
  }

  localStorage.removeItem("guest_session_id");

  return initGuestSession();
};

export const requestWithGuestSession = async (
  input: RequestInfo | URL,
  init: RequestInit = {}
): Promise<Response> => {
  const makeRequest = async (token: string | null) => {
    const headers = new Headers(init.headers);

    headers.set("Content-Type", "application/json");
    headers.set("Accept", "application/json");

    if (token) {
      headers.set("X-Guest-Session-Id", token);
    }

    return fetch(input, {
      ...init,
      headers,
    });
  };

  let token = await initGuestSession();

  let response = await makeRequest(token);

  if (response.status !== 401) {
    return response;
  }

  // Session kemungkinan sudah tidak valid.
  // Buat session baru lalu coba request sekali lagi.
  token = await refreshGuestSession();

  if (!token) {
    return response;
  }

  response = await makeRequest(token);

  return response;
};
