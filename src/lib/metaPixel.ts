declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

export function trackMetaEvent(
  eventName: string,
  params?: Record<string, unknown>
) {
  if (
    typeof window === "undefined" ||
    typeof window.fbq !== "function"
  ) {
    return;
  }

  window.fbq("track", eventName, params);
}