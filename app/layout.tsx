import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Clinkdeck — where AI builders showcase their talent",
  description:
    "A showcase platform for AI builders. Every build comes with an animated visual that shows what it does in ten seconds.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
        <Header />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 mt-auto">
          <div className="max-w-6xl mx-auto px-6 py-4 text-xs text-zinc-500 flex flex-col sm:flex-row sm:justify-between gap-2">
            <div className="flex gap-4">
              <span>Clinkdeck</span>
              <a href="/privacy" className="hover:text-zinc-900 dark:hover:text-zinc-200">
                Privacy
              </a>
              <a href="/terms" className="hover:text-zinc-900 dark:hover:text-zinc-200">
                Terms
              </a>
            </div>
            <span>A showcase, not a marketplace. No payments handled here.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
