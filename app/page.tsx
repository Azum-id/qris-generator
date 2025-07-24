import { QRISGenerator } from "@/components/qris-generator"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "QRIS Generator HD - High Quality QR Code Generator",
  description:
    "Generate high-definition QRIS (Quick Response Code Indonesian Standard) with customizable settings, dark mode support, and professional quality output.",
  keywords: ["QRIS", "QR Code", "Generator", "Indonesia", "High Definition", "PNG"],
  authors: [{ name: "QRIS Generator" }],
  viewport: "width=device-width, initial-scale=1",
}

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 p-4">
      <div className="container mx-auto max-w-4xl">
        <QRISGenerator />
      </div>
    </main>
  )
}
