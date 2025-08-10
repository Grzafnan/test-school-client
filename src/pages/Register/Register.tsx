"use client"

import type React from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "../../components/ui/Button"
import { Input } from "../../components/ui/Input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/Card"
import {
    AiOutlineEye,
    AiOutlineEyeInvisible,
    AiOutlineMail,
    AiOutlineLock,
    AiOutlineUser,
    AiOutlinePhone,
    AiOutlineCheckCircle,
    AiOutlineExclamationCircle,
    AiOutlineUserAdd,
    AiOutlineCheck,
} from "react-icons/ai"

interface FormData {
    firstName: string
    lastName: string
    email: string
    phone: string
    password: string
    confirmPassword: string
    agreeToTerms: boolean
}

interface FormErrors {
    firstName?: string
    lastName?: string
    email?: string
    phone?: string
    password?: string
    confirmPassword?: string
    agreeToTerms?: string
}

interface PasswordStrength {
    score: number
    feedback: string[]
    color: string
}

const Register = () => {
    const [formData, setFormData] = useState<FormData>({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        agreeToTerms: false,
    })
    const [errors, setErrors] = useState<FormErrors>({})
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [focusedField, setFocusedField] = useState<string | null>(null)
    const [currentStep, setCurrentStep] = useState(1)

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    const validatePhone = (phone: string) => {
        const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
        return phoneRegex.test(phone.replace(/\s/g, ""))
    }

    const validateName = (name: string) => {
        return name.trim().length >= 2
    }

    const getPasswordStrength = (password: string): PasswordStrength => {
        let score = 0
        const feedback: string[] = []

        if (password.length >= 8) {
            score += 1
        } else {
            feedback.push("At least 8 characters")
        }

        if (/[a-z]/.test(password)) {
            score += 1
        } else {
            feedback.push("One lowercase letter")
        }

        if (/[A-Z]/.test(password)) {
            score += 1
        } else {
            feedback.push("One uppercase letter")
        }

        if (/\d/.test(password)) {
            score += 1
        } else {
            feedback.push("One number")
        }

        if (/[^a-zA-Z\d]/.test(password)) {
            score += 1
        } else {
            feedback.push("One special character")
        }

        const colors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-blue-500", "bg-green-500"]
        const color = colors[Math.min(score, 4)]

        return { score, feedback, color }
    }

    const validateForm = (step: number): boolean => {
        const newErrors: FormErrors = {}

        if (step === 1) {
            if (!validateName(formData.firstName)) {
                newErrors.firstName = "First name must be at least 2 characters"
            }
            if (!validateName(formData.lastName)) {
                newErrors.lastName = "Last name must be at least 2 characters"
            }
            if (!formData.email) {
                newErrors.email = "Email is required"
            } else if (!validateEmail(formData.email)) {
                newErrors.email = "Please enter a valid email"
            }
            if (!formData.phone) {
                newErrors.phone = "Phone number is required"
            } else if (!validatePhone(formData.phone)) {
                newErrors.phone = "Please enter a valid phone number"
            }
        }

        if (step === 2) {
            const passwordStrength = getPasswordStrength(formData.password)
            if (!formData.password) {
                newErrors.password = "Password is required"
            } else if (passwordStrength.score < 3) {
                newErrors.password = "Password is too weak"
            }

            if (!formData.confirmPassword) {
                newErrors.confirmPassword = "Please confirm your password"
            } else if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = "Passwords do not match"
            }

            if (!formData.agreeToTerms) {
                newErrors.agreeToTerms = "You must agree to the terms and conditions"
            }
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleInputChange = (field: keyof FormData, value: string | boolean) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }))
        }
    }

    const handleNextStep = () => {
        if (validateForm(1)) {
            setCurrentStep(2)
        }
    }

    const handlePrevStep = () => {
        setCurrentStep(1)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm(2)) return

        setIsLoading(true)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000))

        setIsLoading(false)
        setIsSuccess(true)

        // Reset success state after 5 seconds
        setTimeout(() => {
            setIsSuccess(false)
            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                password: "",
                confirmPassword: "",
                agreeToTerms: false,
            })
            setCurrentStep(1)
        }, 5000)
    }

    const getFieldStatus = (field: keyof FormData) => {
        if (field === "agreeToTerms") return formData[field] ? "success" : "default"
        if (!formData[field]) return "default"
        if (errors[field]) return "error"

        if (field === "email" && validateEmail(formData.email)) return "success"
        if (field === "phone" && validatePhone(formData.phone)) return "success"
        if ((field === "firstName" || field === "lastName") && validateName(formData[field] as string)) return "success"
        if (field === "password" && getPasswordStrength(formData.password).score >= 3) return "success"
        if (field === "confirmPassword" && formData.password === formData.confirmPassword) return "success"

        return "default"
    }

    if (isSuccess) {
        return (
            <Card className="w-full max-w-md mx-auto transform transition-all duration-500 scale-105">
                <CardContent className="pt-6">
                    <div className="text-center space-y-4">
                        <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                            <AiOutlineCheckCircle className="w-10 h-10 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-green-600">Registration Successful!</h2>
                        <p className="text-gray-600">Welcome {formData.firstName}! Your account has been created successfully.</p>
                        <p className="text-sm text-gray-500">Please check your email for verification instructions.</p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    const passwordStrength = getPasswordStrength(formData.password)

    return (
       <div className="h-screen flex items-center justify-center">
         <Card className="w-full max-w-md mx-auto transform transition-all duration-300 hover:shadow-xl">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center">Create Your Account</CardTitle>
                <CardDescription className="text-center">
                    Step {currentStep} of 2 - {currentStep === 1 ? "Personal Information" : "Security & Terms"}
                </CardDescription>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                    <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(currentStep / 2) * 100}%` }}
                    />
                </div>
            </CardHeader>

            <form
                onSubmit={
                    currentStep === 1
                        ? (e) => {
                            e.preventDefault()
                            handleNextStep()
                        }
                        : handleSubmit
                }
            >
                <CardContent className="space-y-4">
                    {currentStep === 1 && (
                        <div className="space-y-4 animate-in slide-in-from-right-2 duration-300">
                            <div className="space-y-2">
                                <label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                                    First Name
                                </label>
                                <div className="relative">
                                    <AiOutlineUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <Input
                                        id="firstName"
                                        type="text"
                                        placeholder="Enter your first name"
                                        value={formData.firstName}
                                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                                        onFocus={() => setFocusedField("firstName")}
                                        onBlur={() => setFocusedField(null)}
                                        className={`pl-10 transition-all duration-200 ${getFieldStatus("firstName") === "error"
                                                ? "border-red-500 focus:border-red-500"
                                                : getFieldStatus("firstName") === "success"
                                                    ? "border-green-500 focus:border-green-500"
                                                    : "focus:border-blue-500"
                                            } ${focusedField === "firstName" ? "transform scale-[1.02]" : ""}`}
                                    />
                                    {getFieldStatus("firstName") === "success" && (
                                        <AiOutlineCheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 w-4 h-4" />
                                    )}
                                    {getFieldStatus("firstName") === "error" && (
                                        <AiOutlineExclamationCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 w-4 h-4" />
                                    )}
                                </div>
                                {errors.firstName && (
                                    <p className="text-sm text-red-500 animate-in slide-in-from-left-1 duration-200">
                                        {errors.firstName}
                                    </p>
                                )}
                            </div>

                            {/* Last Name */}
                            <div className="space-y-2">
                                <label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                                    Last Name
                                </label>
                                <div className="relative">
                                    <AiOutlineUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <Input
                                        id="lastName"
                                        type="text"
                                        placeholder="Enter your last name"
                                        value={formData.lastName}
                                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                                        onFocus={() => setFocusedField("lastName")}
                                        onBlur={() => setFocusedField(null)}
                                        className={`pl-10 transition-all duration-200 ${getFieldStatus("lastName") === "error"
                                                ? "border-red-500 focus:border-red-500"
                                                : getFieldStatus("lastName") === "success"
                                                    ? "border-green-500 focus:border-green-500"
                                                    : "focus:border-blue-500"
                                            } ${focusedField === "lastName" ? "transform scale-[1.02]" : ""}`}
                                    />
                                    {getFieldStatus("lastName") === "success" && (
                                        <AiOutlineCheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 w-4 h-4" />
                                    )}
                                    {getFieldStatus("lastName") === "error" && (
                                        <AiOutlineExclamationCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 w-4 h-4" />
                                    )}
                                </div>
                                {errors.lastName && (
                                    <p className="text-sm text-red-500 animate-in slide-in-from-left-1 duration-200">{errors.lastName}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                                    Email Address
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

                            {/* Phone */}
                            <div className="space-y-2">
                                <label htmlFor="phone" className="text-sm font-medium text-gray-700">
                                    Phone Number
                                </label>
                                <div className="relative">
                                    <AiOutlinePhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="Enter your phone number"
                                        value={formData.phone}
                                        onChange={(e) => handleInputChange("phone", e.target.value)}
                                        onFocus={() => setFocusedField("phone")}
                                        onBlur={() => setFocusedField(null)}
                                        className={`pl-10 transition-all duration-200 ${getFieldStatus("phone") === "error"
                                                ? "border-red-500 focus:border-red-500"
                                                : getFieldStatus("phone") === "success"
                                                    ? "border-green-500 focus:border-green-500"
                                                    : "focus:border-blue-500"
                                            } ${focusedField === "phone" ? "transform scale-[1.02]" : ""}`}
                                    />
                                    {getFieldStatus("phone") === "success" && (
                                        <AiOutlineCheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 w-4 h-4" />
                                    )}
                                    {getFieldStatus("phone") === "error" && (
                                        <AiOutlineExclamationCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 w-4 h-4" />
                                    )}
                                </div>
                                {errors.phone && (
                                    <p className="text-sm text-red-500 animate-in slide-in-from-left-1 duration-200">{errors.phone}</p>
                                )}
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="space-y-4 animate-in slide-in-from-left-2 duration-300">
                            {/* Password */}
                            <div className="space-y-2">
                                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <div className="relative">
                                    <AiOutlineLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Create a strong password"
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
                                        {showPassword ? (
                                            <AiOutlineEyeInvisible className="w-4 h-4" />
                                        ) : (
                                            <AiOutlineEye className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>

                                {/* Password Strength Indicator */}
                                {formData.password && (
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-2">
                                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                                                    style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                                                />
                                            </div>
                                            <span className="text-xs text-gray-500">
                                                {passwordStrength.score < 2 ? "Weak" : passwordStrength.score < 4 ? "Medium" : "Strong"}
                                            </span>
                                        </div>
                                        {passwordStrength.feedback.length > 0 && (
                                            <div className="text-xs text-gray-500">
                                                <p>Password needs:</p>
                                                <ul className="list-disc list-inside space-y-1">
                                                    {passwordStrength.feedback.map((item, index) => (
                                                        <li key={index}>{item}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {errors.password && (
                                    <p className="text-sm text-red-500 animate-in slide-in-from-left-1 duration-200">{errors.password}</p>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-2">
                                <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <AiOutlineLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <Input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirm your password"
                                        value={formData.confirmPassword}
                                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                                        onFocus={() => setFocusedField("confirmPassword")}
                                        onBlur={() => setFocusedField(null)}
                                        className={`pl-10 pr-10 transition-all duration-200 ${getFieldStatus("confirmPassword") === "error"
                                                ? "border-red-500 focus:border-red-500"
                                                : getFieldStatus("confirmPassword") === "success"
                                                    ? "border-green-500 focus:border-green-500"
                                                    : "focus:border-blue-500"
                                            } ${focusedField === "confirmPassword" ? "transform scale-[1.02]" : ""}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showConfirmPassword ? (
                                            <AiOutlineEyeInvisible className="w-4 h-4" />
                                        ) : (
                                            <AiOutlineEye className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <p className="text-sm text-red-500 animate-in slide-in-from-left-1 duration-200">
                                        {errors.confirmPassword}
                                    </p>
                                )}
                            </div>

                            {/* Terms and Conditions */}
                            <div className="space-y-2">
                                <div className="flex items-start space-x-3 gap-1" style={{marginTop: "0.5rem"}}>
                                    <button
                                        type="button"
                                        onClick={() => handleInputChange("agreeToTerms", !formData.agreeToTerms)}
                                        className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${formData.agreeToTerms
                                                ? "bg-blue-600 border-blue-600 text-white"
                                                : "border-gray-300 hover:border-blue-400"
                                            }`}
                                    >
                                        {formData.agreeToTerms && <AiOutlineCheck className="w-3 h-3" />}
                                    </button>
                                    <label
                                        className="text-sm text-gray-700 cursor-pointer"
                                        onClick={() => handleInputChange("agreeToTerms", !formData.agreeToTerms)}
                                    >
                                        I agree to the{" "}
                                        <a href="#" className="text-blue-600 hover:text-blue-800 underline">
                                            Terms of Service
                                        </a>{" "}
                                        and{" "}
                                        <a href="#" className="text-blue-600 hover:text-blue-800 underline">
                                            Privacy Policy
                                        </a>
                                    </label>
                                </div>
                                {errors.agreeToTerms && (
                                    <p className="text-sm text-red-500 animate-in slide-in-from-left-1 duration-200">
                                        {errors.agreeToTerms}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </CardContent>

                <CardFooter className="flex flex-col space-y-4">
                    {currentStep === 1 ? (
                        <Button type="submit" className="w-full group transition-all duration-200 hover:scale-[1.02]">
                            <div className="flex items-center space-x-2">
                                <span>Continue</span>
                                <AiOutlineUserAdd className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Button>
                    ) : (
                        <div className="w-full space-y-3">
                            <Button
                                type="submit"
                                className="w-full group transition-all duration-200 hover:scale-[1.02]"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className="flex items-center space-x-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        <span>Creating Account...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-2">
                                        <span>Create Account</span>
                                        <AiOutlineCheckCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                    </div>
                                )}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handlePrevStep}
                                className="w-full transition-all duration-200 hover:scale-[1.02] bg-transparent"
                            >
                                Back to Personal Info
                            </Button>
                        </div>
                    )}

                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            Already have an account?{" "}
                            <Link to="/login" className="text-blue-600 hover:text-blue-800 transition-colors hover:underline">
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </CardFooter>
            </form>
        </Card>
       </div>
    )
}


export default Register;