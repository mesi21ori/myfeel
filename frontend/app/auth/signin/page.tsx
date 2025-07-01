"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CustomButton } from "@/components/ui/custom-button"
import { CustomInput } from "@/components/ui/custom-input"
import {
  CustomCard,
  CustomCardContent,
  CustomCardDescription,
  CustomCardFooter,
  CustomCardHeader,
  CustomCardTitle,
} from "@/components/ui/custom-card"
import { CustomForm, CustomFormField } from "@/components/ui/custom-form"
import { Separator } from "@/components/ui/separator"
import { Mail, Lock } from "lucide-react"
import { signInSchema, type SignInFormData } from "@/lib/validations"
import path from "path"

export default function SignInPage() {
  const [formData, setFormData] = useState<SignInFormData>({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<Partial<SignInFormData>>({})
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleInputChange = (field: keyof SignInFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsLoading(true)
  setErrors({})

  try {
    const validatedData = signInSchema.parse(formData)

    const response = await fetch("http://localhost:5000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: validatedData.email,
        password: validatedData.password,
        remember: true,
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || "Login failed")
    }

    // ✅ Save token and user data to localStorage
    localStorage.setItem("access_token", result.access_token)
    localStorage.setItem("user", JSON.stringify(result.user))

    // Optional: show success toast or redirect
    router.push("/dashboard")
  } catch (error: any) {
    setIsLoading(false)

    if (error.errors) {
      const fieldErrors: Partial<SignInFormData> = {}
      error.errors.forEach((err: any) => {
        fieldErrors[err.path[0] as keyof SignInFormData] = err.message
      })
      setErrors(fieldErrors)
    } else {
      setErrors({ password: error.message })
    }
  } finally {
    setIsLoading(false)
  }
}


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 to-brand-100 p-4">
      <CustomCard className="w-full max-w-md">
        <CustomCardHeader className="space-y-1 pb-4">
         <div className="flex items-center justify-center mb-4">
              <div className="rounded-full border-2 border-[#819A91] p-1 overflow-hidden">
                <img
                  src="/logo.png"
                  alt="Logo"
                  className="h-10 w-10 object-contain rounded-full"
                  style={{ transform: "scale(1.8)" }}
                />
              </div>
            </div>
          <CustomCardTitle className="text-xl font-bold text-center">Welcome back</CustomCardTitle>
          <CustomCardDescription className="text-center text-sm">Sign in to your mYFeel account</CustomCardDescription>
        </CustomCardHeader>

        <CustomCardContent className="space-y-4 py-4">
          <CustomForm onSubmit={handleSubmit} className="space-y-3">
            <CustomFormField label="Email" required error={errors.email}>
              <CustomInput
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                leftIcon={<Mail className="h-4 w-4" />}
                error={errors.email}
                required
              />
            </CustomFormField>

            <CustomFormField label="Password" required error={errors.password}>
              <CustomInput
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                leftIcon={<Lock className="h-4 w-4" />}
                showPasswordToggle
                error={errors.password}
                required
              />
            </CustomFormField>

            <div className="flex items-center justify-end">
              <Link href="/auth/forgot-password" className="text-xs text-brand-300 hover:underline">
                Forgot password?
              </Link>
            </div>

            <CustomButton
              type="submit"
              variant="gradient"
              className="w-full"
              loading={isLoading}
              loadingText="Signing in..."
            >
              Sign in
            </CustomButton>
          </CustomForm>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <CustomButton variant="outline" className="w-full">
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Google
          </CustomButton>
        </CustomCardContent>

        <CustomCardFooter className="pt-4">
          <p className="text-center text-xs text-gray-600 w-full">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="text-brand-300 hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </CustomCardFooter>
      </CustomCard>
    </div>
  )
}
