"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Eye, Share2 } from "lucide-react"
import Image from "next/image"

interface QRSettings {
  size: number
  foregroundColor: string
  backgroundColor: string
  errorCorrectionLevel: "L" | "M" | "Q" | "H"
  margin: number
}

interface QRCodeGeneratorProps {
  qrCodeDataURL: string
  settings: QRSettings
  onDownload: () => void
}

export function QRCodeGenerator({ qrCodeDataURL, settings, onDownload }: QRCodeGeneratorProps) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        // Convert data URL to blob for sharing
        const response = await fetch(qrCodeDataURL)
        const blob = await response.blob()
        const file = new File([blob], "qris-code.png", { type: "image/png" })

        await navigator.share({
          title: "QRIS Code",
          text: "Generated QRIS QR Code",
          files: [file],
        })
      } catch (error) {
        console.error("Error sharing:", error)
      }
    }
  }

  const formatFileSize = (dataURL: string) => {
    const base64 = dataURL.split(",")[1]
    const bytes = (base64.length * 3) / 4
    return bytes > 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(1)} MB` : `${(bytes / 1024).toFixed(0)} KB`
  }

  return (
    <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Eye className="h-5 w-5" />
            <span>Generated QR Code</span>
          </div>
          <div className="flex space-x-2">
            <Badge variant="secondary">
              {settings.size}×{settings.size}
            </Badge>
            <Badge variant="outline">{formatFileSize(qrCodeDataURL)}</Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center">
          <div className="relative p-4 bg-white rounded-xl shadow-lg dark:bg-gray-100">
            <Image
              src={qrCodeDataURL || "/placeholder.svg"}
              alt="Generated QRIS QR Code"
              width={Math.min(400, settings.size)}
              height={Math.min(400, settings.size)}
              className="rounded-lg"
              style={{
                maxWidth: "100%",
                height: "auto",
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-muted-foreground">Quality Settings</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Size:</span>
                <span className="ml-2 font-mono">{settings.size}px</span>
              </div>
              <div>
                <span className="text-muted-foreground">Error Level:</span>
                <span className="ml-2 font-mono">{settings.errorCorrectionLevel}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Margin:</span>
                <span className="ml-2 font-mono">{settings.margin}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Format:</span>
                <span className="ml-2 font-mono">PNG</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-sm text-muted-foreground">Color Scheme</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center space-x-2">
                <div
                  className="w-4 h-4 rounded border border-gray-300"
                  style={{ backgroundColor: settings.foregroundColor }}
                />
                <span className="font-mono text-xs">{settings.foregroundColor}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div
                  className="w-4 h-4 rounded border border-gray-300"
                  style={{ backgroundColor: settings.backgroundColor }}
                />
                <span className="font-mono text-xs">{settings.backgroundColor}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          <Button
            onClick={onDownload}
            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          >
            <Download className="mr-2 h-4 w-4" />
            Download PNG
          </Button>

          {navigator.share && (
            <Button onClick={handleShare} variant="outline" className="flex-1 bg-transparent">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
