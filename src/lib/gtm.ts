export function trackEvent(event: string, params?: Record<string, string>) {
  if (typeof window !== "undefined") {
    window.dataLayer?.push({ event, ...params });
  }
}

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}
