"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Eye, EyeOff } from "lucide-react"
import { CustomButton } from "./custom-button"

const inputVariants = cva(
  "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-input",
        error: "border-destructive focus-visible:ring-destructive",
        success: "border-green-500 focus-visible:ring-green-500",
      },
      size: {
        default: "h-10",
        sm: "h-9",
        lg: "h-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof inputVariants> {
  error?: string
  success?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  showPasswordToggle?: boolean
}

const CustomInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, type, error, success, leftIcon, rightIcon, showPasswordToggle, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const [inputType, setInputType] = React.useState(type)

    React.useEffect(() => {
      if (showPasswordToggle && type === "password") {
        setInputType(showPassword ? "text" : "password")
      }
    }, [showPassword, showPasswordToggle, type])

    const inputVariant = error ? "error" : success ? "success" : variant

    return (
      <div className="space-y-2">
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">{leftIcon}</div>
          )}

          <input
            type={inputType}
            className={cn(
              inputVariants({ variant: inputVariant, size, className }),
              leftIcon && "pl-10",
              (rightIcon || showPasswordToggle) && "pr-10",
            )}
            ref={ref}
            {...props}
          />

          {showPasswordToggle && type === "password" && (
            <CustomButton
              type="button"
              variant="ghost"
              size="icon-sm"
              shape="rounded"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </CustomButton>
          )}

          {rightIcon && !showPasswordToggle && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">{rightIcon}</div>
          )}
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}
        {success && <p className="text-sm text-green-600">{success}</p>}
      </div>
    )
  },
)
CustomInput.displayName = "CustomInput"

export { CustomInput, inputVariants }
