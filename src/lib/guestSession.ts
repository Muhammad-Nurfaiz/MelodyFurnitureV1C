// src/lib/guestSession.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const initGuestSession = async (): Promise<string | null> => {
  let sessionId = localStorage.getItem("guest_session_id");

  if (sessionId) {
    return sessionId;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/customer/session`, {
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