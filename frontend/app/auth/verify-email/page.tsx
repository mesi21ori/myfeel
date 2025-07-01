"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  CustomCard, CustomCardContent, CustomCardDescription,
  CustomCardHeader, CustomCardTitle
} from "@/components/ui/custom-card"
import { CustomForm, CustomFormField } from "@/components/ui/custom-form"
import { CustomInput } from "@/components/ui/custom-input"
import { CustomButton } from "@/components/ui/custom-button"
import { Mail, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react"

export default function EmailVerificationPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const email = searchParams.get("email") || ""
  const [verificationCode, setVerificationCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [timeLeft, setTimeLeft] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const [isResending, setIsResending] = useState(false)

  useEffect(() => {
    if (timeLeft > 0 && !canResend) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0) {
      setCanResend(true)
    }
  }, [timeLeft, canResend])

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("http://localhost:5000/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          code: verificationCode,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "Verification failed")
      }

      setSuccess(true)
      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendEmail = async () => {
    setIsResending(true)
    setError("")

    try {
      await fetch("http://localhost:5000/auth/request-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password: "placeholder", // optional based on backend changes
          fullName: "Resend Request",
        }),
      })

      setTimeLeft(60)
      setCanResend(false)
    } catch {
      setError("Failed to resend verification email.")
    } finally {
      setIsResending(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-brand-50 to-brand-100">
        <CustomCard className="text-center w-full max-w-md">
          <CustomCardContent className="py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Email Verified!</h2>
            <p className="text-gray-600 mb-4">Redirecting to dashboard...</p>
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-300 mx-auto"></div>
          </CustomCardContent>
        </CustomCard>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-brand-50 to-brand-100">
      <CustomCard className="w-full max-w-md">
        <CustomCardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <img src="/logo.png" className="h-10 w-10 object-contain" alt="logo" />
          </div>
          <CustomCardTitle className="text-center text-2xl font-bold">Verify your email</CustomCardTitle>
          <CustomCardDescription className="text-center">Code sent to:</CustomCardDescription>
          <p className="text-center font-medium text-brand-300">{email}</p>
        </CustomCardHeader>

        <CustomCardContent className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex space-x-3">
            <Mail className="h-5 w-5 text-blue-500 mt-0.5" />
            <p className="text-sm text-blue-800">
              Enter the 6-digit code sent to your email.
            </p>
          </div>

          <CustomForm onSubmit={handleVerificationSubmit}>
            <CustomFormField label="Verification Code" required error={error}>
              <CustomInput
                type="text"
                placeholder="Enter 6-digit code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                maxLength={6}
                className="text-center text-lg tracking-widest"
                required
              />
            </CustomFormField>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start space-x-2">
                <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <CustomButton
              type="submit"
              variant="gradient"
              size="lg"
              className="w-full"
              loading={isLoading}
              loadingText="Verifying..."
              disabled={verificationCode.length !== 6}
            >
              Verify Email
            </CustomButton>
          </CustomForm>

          <div className="text-center space-y-3">
            <p className="text-sm text-gray-600">Didn't receive the code?</p>
            <CustomButton
              variant="outline"
              size="sm"
              onClick={handleResendEmail}
              disabled={!canResend}
              loading={isResending}
              loadingText="Sending..."
              className="w-full"
            >
              {canResend ? "Resend Code" : `Resend in ${timeLeft}s`}
            </CustomButton>
          </div>

          <div className="text-center pt-4 border-t">
            <Link href="/auth/signin" className="inline-flex items-center text-sm text-brand-300 hover:underline font-medium">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Sign In
            </Link>
          </div>
        </CustomCardContent>
      </CustomCard>
    </div>
  )
}
