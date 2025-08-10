import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/Card"
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineMail,
  AiOutlineLock,
  AiOutlineArrowRight,
  AiOutlineCheckCircle,
  AiOutlineExclamationCircle,
} from "react-icons/ai"
import { Button } from "../../components/ui/Button"
import { Input } from "../../components/ui/Input"
import { Link } from "react-router-dom"

interface FormData {
  email: string
  password: string
  confirmPassword?: string
}

interface FormErrors {
  email?: string
  password?: string
  confirmPassword?: string
}

const Login = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password: string) => {
    return password.length >= 6
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (!validatePassword(formData.password)) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsLoading(false)
    setIsSuccess(true)

    // Reset success state after 3 seconds
    setTimeout(() => {
      setIsSuccess(false)
      setFormData({ email: "", password: "", confirmPassword: "" })
    }, 3000)
  };

  // Real-time validation feedback
  const getFieldStatus = (field: keyof FormData) => {
    if (!formData[field]) return "default"
    if (errors[field]) return "error"

    if (field === "email" && validateEmail(formData.email)) return "success"
    if (field === "password" && validatePassword(formData.password)) return "success"
    if (field === "confirmPassword" && formData.password === formData.confirmPassword) return "success"

    return "default"
  }

  if (isSuccess) {
    return (
      <Card className="w-full max-w-md mx-auto transform transition-all duration-500 scale-105">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <AiOutlineCheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-green-600">Success!</h2>
            <p className="text-gray-600">Welcome back!</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <Card className="w-full max-w-md flex flex-col justify-center items-center transform transition-all duration-300 hover:shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="relative">
                <AiOutlineMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  className={`pl-10 transition-all duration-200 ${getFieldStatus("email") === "error"
                    ? "border-red-500 focus:border-red-500"
                    : getFieldStatus("email") === "success"
                      ? "border-green-500 focus:border-green-500"
                      : "focus:border-blue-500"
                    } ${focusedField === "email" ? "transform scale-[1.02]" : ""}`}
                />
                {getFieldStatus("email") === "success" && (
                  <AiOutlineCheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 w-4 h-4" />
                )}
                {getFieldStatus("email") === "error" && (
                  <AiOutlineExclamationCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 w-4 h-4" />
                )}
              </div>
              {errors.email && (
                <p className="text-sm text-red-500 animate-in slide-in-from-left-1 duration-200">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <AiOutlineLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  className={`pl-10 pr-10 transition-all duration-200 ${getFieldStatus("password") === "error"
                    ? "border-red-500 focus:border-red-500"
                    : getFieldStatus("password") === "success"
                      ? "border-green-500 focus:border-green-500"
                      : "focus:border-blue-500"
                    } ${focusedField === "password" ? "transform scale-[1.02]" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <AiOutlineEyeInvisible className="w-4 h-4" /> : <AiOutlineEye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500 animate-in slide-in-from-left-1 duration-200">{errors.password}</p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full group transition-all duration-200 hover:scale-[1.02]"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>Sign In</span>
                  <AiOutlineArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </Button>
            <div className="text-center">
              <Link
                to={`/register`}
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors hover:underline"
              >
                Don't have an account? Sign up
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
export default Login;