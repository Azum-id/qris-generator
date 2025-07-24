"use client"

import { useState, useCallback, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Upload, Settings, Zap, Moon, Sun, AlertCircle, Loader2 } from "lucide-react"
import { useTheme } from "next-themes"
import { QRCodeGenerator } from "@/components/qr-code-generator"
import { FileUpload } from "@/components/file-upload"
import { ErrorBoundary } from "@/components/error-boundary"
import { ToastProvider } from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"

interface QRSettings {
  size: number
  foregroundColor: string
  backgroundColor: string
  errorCorrectionLevel: "L" | "M" | "Q" | "H"
  margin: number
}

const defaultSettings: QRSettings = {
  size: 1024,
  foregroundColor: "#000000",
  backgroundColor: "#ffffff",
  errorCorrectionLevel: "M",
  margin: 4,
}

const sizeOptions = [
  { value: 512, label: "512×512 (Web)", description: "Standard web use" },
  { value: 1024, label: "1024×1024 (Print)", description: "Print quality" },
  { value: 2048, label: "2048×2048 (Banner)", description: "Large format" },
  { value: 4096, label: "4096×4096 (Ultra HD)", description: "Maximum quality" },
]

const errorLevels = [
  { value: "L", label: "Low (7%)", description: "Fastest processing" },
  { value: "M", label: "Medium (15%)", description: "Balanced (Recommended)" },
  { value: "Q", label: "Quartile (25%)", description: "Good error recovery" },
  { value: "H", label: "High (30%)", description: "Maximum error recovery" },
]

export function QRISGenerator() {
  const [qrData, setQrData] = useState("")
  const [settings, setSettings] = useState<QRSettings>(defaultSettings)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedQR, setGeneratedQR] = useState<string | null>(null)
  const [errors, setErrors] = useState<string[]>([])
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateQRISData = useCallback((data: string): string[] => {
    const errors: string[] = []

    if (!data.trim()) {
      errors.push("QRIS data cannot be empty")
      return errors
    }

    if (data.length < 10) {
      errors.push("QRIS data seems too short")
    }

    if (data.length > 2000) {
      errors.push("QRIS data exceeds maximum length")
    }

    // Basic QRIS format validation
    if (!data.startsWith("00020101")) {
      errors.push("Invalid QRIS format - should start with version identifier")
    }

    return errors
  }, [])

  const handleDataChange = useCallback(
    (value: string) => {
      setQrData(value)
      const validationErrors = validateQRISData(value)
      setErrors(validationErrors)
    },
    [validateQRISData],
  )

  const handleFileUpload = useCallback(
    async (file: File) => {
      try {
        setIsGenerating(true)

        // Import QR scanner dynamically to avoid SSR issues
        const QrScanner = (await import("qr-scanner")).default

        const result = await QrScanner.scanImage(file, {
          returnDetailedScanResult: true,
        })

        if (result?.data) {
          handleDataChange(result.data)
          toast({
            title: "QR Code Scanned Successfully",
            description: "QRIS data has been extracted and loaded.",
          })
        } else {
          throw new Error("No QR code detected in image")
        }
      } catch (error) {
        console.error("QR scan error:", error)
        toast({
          title: "Scan Failed",
          description: "Could not detect QR code in the image. Please try a clearer image or enter data manually.",
          variant: "destructive",
        })
      } finally {
        setIsGenerating(false)
      }
    },
    [handleDataChange, toast],
  )

  const generateQRCode = useCallback(async () => {
    const validationErrors = validateQRISData(qrData)

    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      toast({
        title: "Validation Error",
        description: validationErrors[0],
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    setErrors([])

    try {
      // Import QRious dynamically
      const QRious = (await import("qrious")).default

      const canvas = document.createElement("canvas")

      const qr = new QRious({
        element: canvas,
        value: qrData,
        size: settings.size,
        foreground: settings.foregroundColor,
        background: settings.backgroundColor,
        level: settings.errorCorrectionLevel,
        padding: settings.margin,
      })

      const dataURL = canvas.toDataURL("image/png", 1.0)
      setGeneratedQR(dataURL)

      toast({
        title: "QR Code Generated",
        description: `Successfully generated ${settings.size}×${settings.size} QRIS code.`,
      })
    } catch (error) {
      console.error("QR generation error:", error)
      toast({
        title: "Generation Failed",
        description: "Failed to generate QR code. Please check your input data.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }, [qrData, settings, validateQRISData, toast])

  const downloadQRCode = useCallback(() => {
    if (!generatedQR) return

    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-")
    const filename = `QRIS_HD_${settings.size}x${settings.size}_${timestamp}.png`

    const link = document.createElement("a")
    link.download = filename
    link.href = generatedQR
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Download Started",
      description: `Downloading ${filename}`,
    })
  }, [generatedQR, settings.size, toast])

  const loadSampleData = useCallback(() => {
    const sampleData =
      "00020101021226670016COM.NOBUBANK.WWW01189360050300000898240214031234567890303UME51440014ID.CO.QRIS.WWW0215ID20200000000010303UME5204481253033605502011954041000550201006009Jakarta6105123456304B8A4"
    handleDataChange(sampleData)
    toast({
      title: "Sample Data Loaded",
      description: "Sample QRIS data has been loaded for testing.",
    })
  }, [handleDataChange, toast])

  return (
    <ErrorBoundary>
      <ToastProvider>
        <div className="space-y-6">
          {/* Header */}
          <Card className="border-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl">
            <CardHeader className="text-center space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Zap className="h-8 w-8 text-blue-600" />
                  <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    QRIS Generator HD
                  </CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="rounded-full"
                >
                  {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>
              </div>
              <p className="text-muted-foreground">
                Generate high-definition QRIS codes with professional quality and customizable settings
              </p>
            </CardHeader>
          </Card>

          {/* Input Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="h-5 w-5" />
                  <span>Input Data</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="qr-data">QRIS Data</Label>
                  <Textarea
                    id="qr-data"
                    placeholder="Paste your QRIS data here..."
                    value={qrData}
                    onChange={(e) => handleDataChange(e.target.value)}
                    rows={4}
                    className="font-mono text-sm"
                  />
                  {errors.length > 0 && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{errors.join(", ")}</AlertDescription>
                    </Alert>
                  )}
                </div>

                <Separator />

                <FileUpload onFileUpload={handleFileUpload} isUploading={isGenerating} />

                <div className="flex space-x-2">
                  <Button onClick={loadSampleData} variant="outline" size="sm" className="flex-1 bg-transparent">
                    Load Sample
                  </Button>
                  <Button onClick={() => setQrData("")} variant="outline" size="sm" className="flex-1">
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Settings Section */}
            <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Size</Label>
                    <Select
                      value={settings.size.toString()}
                      onValueChange={(value) => setSettings((prev) => ({ ...prev, size: Number.parseInt(value) }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {sizeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value.toString()}>
                            <div>
                              <div className="font-medium">{option.label}</div>
                              <div className="text-sm text-muted-foreground">{option.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Error Correction</Label>
                    <Select
                      value={settings.errorCorrectionLevel}
                      onValueChange={(value: "L" | "M" | "Q" | "H") =>
                        setSettings((prev) => ({ ...prev, errorCorrectionLevel: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {errorLevels.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            <div>
                              <div className="font-medium">{level.label}</div>
                              <div className="text-sm text-muted-foreground">{level.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Foreground Color</Label>
                    <div className="flex space-x-2">
                      <Input
                        type="color"
                        value={settings.foregroundColor}
                        onChange={(e) => setSettings((prev) => ({ ...prev, foregroundColor: e.target.value }))}
                        className="w-16 h-10 p-1 border-2"
                      />
                      <Input
                        type="text"
                        value={settings.foregroundColor}
                        onChange={(e) => setSettings((prev) => ({ ...prev, foregroundColor: e.target.value }))}
                        className="flex-1 font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Background Color</Label>
                    <div className="flex space-x-2">
                      <Input
                        type="color"
                        value={settings.backgroundColor}
                        onChange={(e) => setSettings((prev) => ({ ...prev, backgroundColor: e.target.value }))}
                        className="w-16 h-10 p-1 border-2"
                      />
                      <Input
                        type="text"
                        value={settings.backgroundColor}
                        onChange={(e) => setSettings((prev) => ({ ...prev, backgroundColor: e.target.value }))}
                        className="flex-1 font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Margin (modules)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="20"
                    value={settings.margin}
                    onChange={(e) => setSettings((prev) => ({ ...prev, margin: Number.parseInt(e.target.value) || 0 }))}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Generate Button */}
          <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl">
            <CardContent className="pt-6">
              <Button
                onClick={generateQRCode}
                disabled={!qrData.trim() || errors.length > 0 || isGenerating}
                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-5 w-5" />
                    Generate HD QR Code
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* QR Code Display */}
          {generatedQR && (
            <QRCodeGenerator qrCodeDataURL={generatedQR} settings={settings} onDownload={downloadQRCode} />
          )}
        </div>
      </ToastProvider>
    </ErrorBoundary>
  )
}
