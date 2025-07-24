import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "QRIS Generator HD - Professional QR Code Generator",
  description:
    "Generate high-definition QRIS (Quick Response Code Indonesian Standard) with customizable settings, dark mode support, and professional quality output.",
  keywords: ["QRIS", "QR Code", "Generator", "Indonesia", "High Definition", "PNG", "Payment"],
  authors: [{ name: "QRIS Generator Team" }],
  creator: "QRIS Generator",
  publisher: "QRIS Generator",
  robots: "index, follow",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  openGraph: {
    type: "website",
    locale: "id_ID",
    title: "QRIS Generator HD",
    description: "Generate high-definition QRIS codes with professional quality",
    siteName: "QRIS Generator HD",
  },
  twitter: {
    card: "summary_large_image",
    title: "QRIS Generator HD",
    description: "Generate high-definition QRIS codes with professional quality",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
