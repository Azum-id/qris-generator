"use client"

import type React from "react"

import { createContext, useContext } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { type Toast, useToast } from "@/hooks/use-toast"

const ToastContext = createContext<{
  toast: ReturnType<typeof useToast>["toast"]
  dismiss: ReturnType<typeof useToast>["dismiss"]
  toasts: Toast[]
} | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { toast, dismiss, toasts } = useToast()

  return (
    <ToastContext.Provider value={{ toast, dismiss, toasts }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <Alert key={toast.id} variant={toast.variant} className="w-80 shadow-lg animate-in slide-in-from-right-full">
            <AlertDescription className="flex items-center justify-between">
              <div>
                <div className="font-medium">{toast.title}</div>
                {toast.description && <div className="text-sm text-muted-foreground mt-1">{toast.description}</div>}
              </div>
              <Button variant="ghost" size="icon" className="h-6 w-6 ml-2" onClick={() => dismiss(toast.id)}>
                <X className="h-4 w-4" />
              </Button>
            </AlertDescription>
          </Alert>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToastContext = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToastContext must be used within ToastProvider")
  }
  return context
}
