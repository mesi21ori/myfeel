// "use client"

// import type React from "react"
// import { useState } from "react"
// import Link from "next/link"
// import { useRouter } from "next/navigation"
// import { CustomButton } from "@/components/ui/custom-button"
// import { CustomInput } from "@/components/ui/custom-input"
// import {
//   CustomCard,
//   CustomCardContent,
//   CustomCardDescription,
//   CustomCardFooter,
//   CustomCardHeader,
//   CustomCardTitle,
// } from "@/components/ui/custom-card"
// import { CustomForm, CustomFormField } from "@/components/ui/custom-form"
// import { Separator } from "@/components/ui/separator"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Mail, Lock, User } from "lucide-react"
// import { signUpSchema, type SignUpFormData } from "@/lib/validations"

// export default function SignUpPage() {
//   const [formData, setFormData] = useState<SignUpFormData>({
//     fullName: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     agreeToTerms: false,
//   })
//   const [errors, setErrors] = useState<Partial<SignUpFormData>>({})
//   const [isLoading, setIsLoading] = useState(false)
//   const router = useRouter()

//   const handleInputChange = (field: keyof SignUpFormData, value: string | boolean) => {
//     setFormData((prev) => ({ ...prev, [field]: value }))
//     // Clear error when user starts typing
//     if (errors[field]) {
//       setErrors((prev) => ({ ...prev, [field]: undefined }))
//     }
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsLoading(true)
//     setErrors({})

//     try {
//       // Validate form data
//       const validatedData = signUpSchema.parse(formData)

//       // Create FormData object for backend
//       const submitData = new FormData()
//       submitData.append("fullName", validatedData.fullName)
//       submitData.append("email", validatedData.email)
//       submitData.append("password", validatedData.password)

//       // Simulate API call
//       console.log("Form data:", {
//         fullName: submitData.get("fullName"),
//         email: submitData.get("email"),
//         password: submitData.get("password"),
//       })

//       setTimeout(() => {
//         setIsLoading(false)
//         // Redirect to email verification instead of dashboard
//         router.push(`/auth/verify-email?email=${encodeURIComponent(validatedData.email)}`)
//       }, 1000)
//     } catch (error: any) {
//       setIsLoading(false)
//       if (error.errors) {
//         const fieldErrors: Partial<SignUpFormData> = {}
//         error.errors.forEach((err: any) => {
//           if (err.path[0]) {
//             fieldErrors[err.path[0] as keyof SignUpFormData] = err.message
//           }
//         })
//         setErrors(fieldErrors)
//       }
//     }
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 to-brand-100 p-4">
//       <div className="w-full max-w-4xl mx-auto my-8">
//         <CustomCard className="w-full">
//           <CustomCardHeader className="space-y-1">
//             <div className="flex items-center justify-center mb-4">
//               <div className="rounded-full border-2 border-[#819A91] p-1 overflow-hidden">
//                 <img
//                   src="/logo.png"
//                   alt="Logo"
//                   className="h-10 w-10 object-contain rounded-full"
//                   style={{ transform: "scale(1.8)" }}
//                 />
//               </div>
//             </div>
//             <CustomCardTitle className="text-2xl font-bold text-center">Create your account</CustomCardTitle>
//             <CustomCardDescription className="text-center">
//               Join mYFeel and start your AI-powered learning journey
//             </CustomCardDescription>
//           </CustomCardHeader>
//           <CustomCardContent className="space-y-6">
//             <CustomForm onSubmit={handleSubmit}>
//               {/* Two Column Layout */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <CustomFormField label="Full Name" required error={errors.fullName}>
//                   <CustomInput
//                     type="text"
//                     placeholder="Enter your full name"
//                     value={formData.fullName}
//                     onChange={(e) => handleInputChange("fullName", e.target.value)}
//                     leftIcon={<User className="h-4 w-4" />}
//                     error={errors.fullName}
//                     required
//                   />
//                 </CustomFormField>

//                 <CustomFormField label="Email" required error={errors.email}>
//                   <CustomInput
//                     type="email"
//                     placeholder="Enter your email"
//                     value={formData.email}
//                     onChange={(e) => handleInputChange("email", e.target.value)}
//                     leftIcon={<Mail className="h-4 w-4" />}
//                     error={errors.email}
//                     required
//                   />
//                 </CustomFormField>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <CustomFormField label="Password" required error={errors.password}>
//                   <CustomInput
//                     type="password"
//                     placeholder="Create a password"
//                     value={formData.password}
//                     onChange={(e) => handleInputChange("password", e.target.value)}
//                     leftIcon={<Lock className="h-4 w-4" />}
//                     showPasswordToggle
//                     error={errors.password}
//                     required
//                   />
//                 </CustomFormField>

//                 <CustomFormField label="Confirm Password" required error={errors.confirmPassword}>
//                   <CustomInput
//                     type="password"
//                     placeholder="Confirm your password"
//                     value={formData.confirmPassword}
//                     onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
//                     leftIcon={<Lock className="h-4 w-4" />}
//                     error={errors.confirmPassword}
//                     required
//                   />
//                 </CustomFormField>
//               </div>

//               {/* Terms and Conditions Section */}
//               <div className="bg-gray-50 rounded-lg p-4 border">
//                 <div className="flex items-start space-x-3">
//                   <Checkbox
//                     id="terms"
//                     checked={formData.agreeToTerms}
//                     onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
//                     className="mt-0.5"
//                   />
//                   <div className="flex-1">
//                     <label htmlFor="terms" className="text-sm text-gray-700 leading-relaxed">
//                       I agree to the{" "}
//                       <Link href="/terms" className="text-brand-300 hover:underline font-medium">
//                         Terms of Service
//                       </Link>{" "}
//                       and{" "}
//                       <Link href="/privacy" className="text-brand-300 hover:underline font-medium">
//                         Privacy Policy
//                       </Link>
//                     </label>
//                     {errors.agreeToTerms && <p className="text-sm text-destructive mt-1">{errors.agreeToTerms}</p>}
//                   </div>
//                 </div>
//               </div>

//               {/* Action Buttons Section */}
//               <div className="space-y-4 pt-2">
//                 <CustomButton
//                   type="submit"
//                   variant="gradient"
//                   size="lg"
//                   className="w-full"
//                   loading={isLoading}
//                   loadingText="Creating account..."
//                   disabled={!formData.agreeToTerms}
//                 >
//                   Create account
//                 </CustomButton>

//                 <div className="relative">
//                   <div className="absolute inset-0 flex items-center">
//                     <Separator className="w-full" />
//                   </div>
//                   <div className="relative flex justify-center text-xs uppercase">
//                     <span className="bg-background px-3 text-muted-foreground">Or continue with</span>
//                   </div>
//                 </div>

//                 <CustomButton variant="outline" size="lg" className="w-full">
//                   <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
//                     <path
//                       d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//                       fill="#4285F4"
//                     />
//                     <path
//                       d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//                       fill="#34A853"
//                     />
//                     <path
//                       d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//                       fill="#FBBC05"
//                     />
//                     <path
//                       d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//                       fill="#EA4335"
//                     />
//                   </svg>
//                   Continue with Google
//                 </CustomButton>
//               </div>
//             </CustomForm>
//           </CustomCardContent>
//           <CustomCardFooter className="border-t bg-gray-50/50 rounded-b-lg">
//             <p className="text-center text-sm text-gray-600 w-full py-2">
//               Already have an account?{" "}
//               <Link href="/auth/signin" className="text-brand-300 hover:underline font-medium">
//                 Sign in
//               </Link>
//             </p>
//           </CustomCardFooter>
//         </CustomCard>
//       </div>
//     </div>
//   )
// }


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
import { Checkbox } from "@/components/ui/checkbox"
import { Mail, Lock, User } from "lucide-react"
import { signUpSchema, type SignUpFormData } from "@/lib/validations"

export default function SignUpPage() {
  const [formData, setFormData] = useState<SignUpFormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  })
  const [errors, setErrors] = useState<Partial<SignUpFormData>>({})
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleInputChange = (field: keyof SignUpFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    try {
      const validatedData = signUpSchema.parse(formData)

      const response = await fetch("http://localhost:5000/auth/request-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: validatedData.fullName,
          email: validatedData.email,
          password: validatedData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Signup failed")
      }

      router.push(`/auth/verify-email?email=${validatedData.email}`)
    } catch (error: any) {
      setIsLoading(false)
      if (error.errors) {
        const fieldErrors: Partial<SignUpFormData> = {}
        error.errors.forEach((err: any) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof SignUpFormData] = err.message
          }
        })
        setErrors(fieldErrors)
      } else {
        setErrors((prev) => ({ ...prev, email: error.message }))
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 to-brand-100 p-4">
      <div className="w-full max-w-4xl mx-auto my-8">
        <CustomCard className="w-full">
          <CustomCardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-4">
              <div className="rounded-full border-2 border-[#819A91] p-1 overflow-hidden">
                <img src="/logo.png" alt="Logo" className="h-10 w-10 object-contain rounded-full" />
              </div>
            </div>
            <CustomCardTitle className="text-2xl font-bold text-center">Create your account</CustomCardTitle>
            <CustomCardDescription className="text-center">
              Join mYFeel and start your AI-powered learning journey
            </CustomCardDescription>
          </CustomCardHeader>

          <CustomCardContent className="space-y-6">
            <CustomForm onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CustomFormField label="Full Name" required error={errors.fullName}>
                  <CustomInput
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    leftIcon={<User className="h-4 w-4" />}
                    error={errors.fullName}
                  />
                </CustomFormField>

                <CustomFormField label="Email" required error={errors.email}>
                  <CustomInput
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    leftIcon={<Mail className="h-4 w-4" />}
                    error={errors.email}
                  />
                </CustomFormField>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CustomFormField label="Password" required error={errors.password}>
                  <CustomInput
                    type="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    leftIcon={<Lock className="h-4 w-4" />}
                    showPasswordToggle
                    error={errors.password}
                  />
                </CustomFormField>

                <CustomFormField label="Confirm Password" required error={errors.confirmPassword}>
                  <CustomInput
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    leftIcon={<Lock className="h-4 w-4" />}
                    error={errors.confirmPassword}
                  />
                </CustomFormField>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
                    className="mt-0.5"
                  />
                  <div className="flex-1 text-sm text-gray-700">
                    <label htmlFor="terms">
                      I agree to the{" "}
                      <Link href="/terms" className="text-brand-300 hover:underline font-medium">Terms of Service</Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-brand-300 hover:underline font-medium">Privacy Policy</Link>
                    </label>
                    {errors.agreeToTerms && <p className="text-sm text-destructive mt-1">{errors.agreeToTerms}</p>}
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <CustomButton
                  type="submit"
                  variant="gradient"
                  size="lg"
                  className="w-full"
                  loading={isLoading}
                  loadingText="Creating account..."
                  disabled={!formData.agreeToTerms}
                >
                  Create account
                </CustomButton>
              </div>
            </CustomForm>
          </CustomCardContent>

          <CustomCardFooter className="border-t bg-gray-50/50 rounded-b-lg">
            <p className="text-center text-sm text-gray-600 w-full py-2">
              Already have an account?{" "}
              <Link href="/auth/signin" className="text-brand-300 hover:underline font-medium">Sign in</Link>
            </p>
          </CustomCardFooter>
        </CustomCard>
      </div>
    </div>
  )
}
