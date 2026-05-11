"use client";

import { useEffect } from "react";

type Props = {
  sendTo: string;
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Fires a Google Ads conversion event once on mount.
 * Pass the full `send_to` value (e.g. "AW-18156684082/AbCd1xYz")
 * from your Google Ads conversion action.
 */
export default function ConversionTracker({ sendTo }: Props) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (typeof window.gtag !== "function") return;
    window.gtag("event", "conversion", { send_to: sendTo });
  }, [sendTo]);

  return null;
}
