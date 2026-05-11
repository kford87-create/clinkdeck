"use client";

import { useEffect, useState } from "react";

type ShareButtonProps = {
  listingUrl: string;
  listingTitle: string;
  creatorName: string;
};

/**
 * Prefers the platform's native share sheet (navigator.share) on mobile.
 * Falls back to inline Copy / X / LinkedIn buttons on desktop browsers
 * that don't expose Web Share. Both paths share the same canonical URL,
 * which on a real listing also drives the OG image preview.
 */
export default function ShareButton({
  listingUrl,
  listingTitle,
  creatorName,
}: ShareButtonProps) {
  const [canNativeShare, setCanNativeShare] = useState(false);
  const [copied, setCopied] = useState(false);

  // navigator.share is only available in secure contexts on mobile-class browsers,
  // so detect on mount rather than render-time to keep SSR output stable.
  useEffect(() => {
    setCanNativeShare(typeof navigator !== "undefined" && !!navigator.share);
  }, []);

  const tweetText = `${listingTitle} by ${creatorName}`;
  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(listingUrl)}`;
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(listingUrl)}`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(listingUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // best-effort; some browsers reject in non-secure contexts.
    }
  }

  async function handleNativeShare() {
    try {
      await navigator.share({
        title: listingTitle,
        text: tweetText,
        url: listingUrl,
      });
    } catch {
      // User cancelled or share unsupported — silent fail is intended UX.
    }
  }

  if (canNativeShare) {
    return (
      <button
        type="button"
        onClick={handleNativeShare}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-sm font-medium"
      >
        <ShareIcon />
        Share
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-xs font-medium"
      >
        <LinkIcon />
        {copied ? "Copied" : "Copy link"}
      </button>
      <a
        href={tweetUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-xs font-medium"
      >
        <XIcon />
        Post on X
      </a>
      <a
        href={linkedInUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-xs font-medium"
      >
        <LinkedInIcon />
        LinkedIn
      </a>
    </div>
  );
}

function ShareIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="3.5" r="1.6" />
      <circle cx="4" cy="8" r="1.6" />
      <circle cx="12" cy="12.5" r="1.6" />
      <path d="M5.4 7l5.2-2.8M5.4 9l5.2 2.8" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="M6.5 9.5l3-3M5 8.5L3.5 10a2.121 2.121 0 0 0 3 3L8 11.5M11 7.5L12.5 6a2.121 2.121 0 0 0-3-3L8 4.5" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor">
      <path d="M9.4 6.8L14.5 1h-1.2L8.9 6 5.4 1H1.5l5.4 7.7-5.4 6.3h1.2l4.7-5.4 3.7 5.4h3.9L9.4 6.8zm-1.6 1.9l-.5-.7L3 1.9h1.8l3.5 5 .5.7 4.4 6.4h-1.8L7.8 8.7z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor">
      <path d="M3.5 1.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zM2 6h3v8H2V6zm5 0h2.9v1.1h0a3.2 3.2 0 0 1 2.9-1.6c3.1 0 3.7 2 3.7 4.6V14h-3v-3.4c0-.8 0-1.9-1.2-1.9s-1.3.9-1.3 1.8V14H7V6z" />
    </svg>
  );
}
