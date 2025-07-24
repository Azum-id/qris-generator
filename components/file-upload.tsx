"use client"

import type React from "react"

import { useCallback, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, FileImage, Loader2 } from "lucide-react"

interface FileUploadProps {
  onFileUpload: (file: File) => void
  isUploading: boolean
}

export function FileUpload({ onFileUpload, isUploading }: FileUploadProps) {
  const [dragOver, setDragOver] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)

      const files = e.dataTransfer.files
      if (files.length > 0) {
        const file = files[0]
        if (file.type.startsWith("image/")) {
          onFileUpload(file)
        }
      }
    },
    [onFileUpload],
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (files && files.length > 0) {
        onFileUpload(files[0])
      }
    },
    [onFileUpload],
  )

  return (
    <Card
      className={`border-2 border-dashed transition-colors ${
        dragOver ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20" : "border-gray-300 dark:border-gray-600"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <CardContent className="p-6 text-center space-y-4">
        {isUploading ? (
          <div className="space-y-3">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" />
            <p className="text-sm text-muted-foreground">Scanning QR code...</p>
          </div>
        ) : (
          <>
            <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
              <Upload className="h-6 w-6 text-blue-600" />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Upload QR Code Image</p>
              <p className="text-xs text-muted-foreground">Drag and drop an image file here, or click to browse</p>
            </div>
            <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" id="file-upload" />
            <Button
              variant="outline"
              size="sm"
              onClick={() => document.getElementById("file-upload")?.click()}
              className="flex items-center space-x-2"
            >
              <FileImage className="h-4 w-4" />
              <span>Choose File</span>
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
