"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface FormFieldProps {
  label?: string
  error?: string
  required?: boolean
  children: React.ReactNode
  className?: string
}

const CustomFormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({ label, error, required, children, className }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-2", className)}>
        {label && (
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}
        {children}
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    )
  },
)
CustomFormField.displayName = "CustomFormField"

export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode
}

const CustomForm = React.forwardRef<HTMLFormElement, FormProps>(({ className, children, ...props }, ref) => {
  return (
    <form ref={ref} className={cn("space-y-4", className)} {...props}>
      {children}
    </form>
  )
})
CustomForm.displayName = "CustomForm"

export { CustomForm, CustomFormField }
