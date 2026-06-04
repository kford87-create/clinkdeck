import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Header from "./components/Header";

const GOOGLE_ADS_TAG_ID = "AW-18156684082";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Clinkdeck — Google Chrome, Cloud & Marketplace products",
  description:
    "Your single storefront for Google Chrome, Google Cloud, and Google Workspace Marketplace products. Clinkdeck is in the process of becoming an authorized Google reseller.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <footer className="sf-footer">
          <div className="wrap">
            <div className="foot">
              <div>
                <div className="brand">
                  <span className="logo" /> Clinkdeck
                </div>
                <p style={{ maxWidth: 260 }}>
                  Your storefront for Google Chrome, Cloud, and Marketplace products.
                  Authorized-reseller verification in progress.
                </p>
              </div>
              <div>
                <h5>Products</h5>
                <a href="/#chrome">Chrome</a>
                <a href="/#cloud">Cloud</a>
                <a href="/#marketplace">Marketplace</a>
              </div>
              <div>
                <h5>Company</h5>
                <a href="mailto:hello@clinkdeck.com">Contact</a>
                <a href="mailto:hello@clinkdeck.com?subject=Support">Support</a>
                <a href="/#faq">FAQ</a>
              </div>
              <div>
                <h5>Legal</h5>
                <a href="/privacy">Privacy</a>
                <a href="/terms">Terms</a>
              </div>
            </div>
            <div className="legal">
              <span>
                © 2026 Clinkdeck. Clinkdeck is not yet an authorized Google reseller —
                authorization is in progress. Google, Chrome, Google Cloud and related marks are
                trademarks of Google LLC.
              </span>
              <span>hello@clinkdeck.com</span>
            </div>
          </div>
        </footer>
        <Analytics />
        {process.env.NODE_ENV === "production" && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_TAG_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-ads-gtag" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GOOGLE_ADS_TAG_ID}');
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
