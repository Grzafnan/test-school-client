import type React from "react"
import { useEffect, useState } from "react"
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
import { Input } from "../../components/ui/Input"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useGetCurrentUserQuery, useLoginMutation } from "../../redux/api/authApi/authApi"
import { useAppDispatch } from "../../redux/hooks"
import { setCredentials, setError, setProfile, setUserLoading } from "../../redux/api/authApi/authSlice";
import { toast } from 'sonner';
import Cookies from 'js-cookie';

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
  const dispatch = useAppDispatch();
  const accessToken = Cookies.get("accessToken");
  const refreshToken = Cookies.get("refreshToken");

  const [login, { isLoading, isSuccess }] = useLoginMutation();
  const { data: currentUser, isLoading: isLoadingUser, isSuccess: isSuccessUser, refetch } = useGetCurrentUserQuery(undefined, { skip: !(accessToken && refreshToken) });

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/assessment";
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [focusedField, setFocusedField] = useState<string | null>(null)

  useEffect(()=>{
      if(accessToken && refreshToken) {
        refetch();
        navigate(from, { replace: true });
      }
  },[dispatch, accessToken, refreshToken, from, navigate, refetch])


  useEffect(()=>{
    if(isSuccess && isSuccessUser && currentUser?.data){
      console.log({currentUser});
      dispatch(setProfile(currentUser.data));
      dispatch(setUserLoading(false));
      toast.success("User login successfully");
      if(currentUser.data.role === "user") {
        navigate("/assessment");
      }
      if(currentUser.data.role === "admin" || currentUser.data.role === "supervisor") {
        navigate("/dashboard");
      }
    }
  },[isSuccess , isSuccessUser, navigate, dispatch, currentUser,isLoading, isLoadingUser])

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
  e.preventDefault();
  if (!validateForm()) return;
  try {
    const res = await login({ email: formData.email, password: formData.password }).unwrap();

  if (res.success) {
    // dispatch(setUserLoading(true));
    dispatch(setCredentials({ accessToken: res.data.accessToken, refreshToken: res.data.refreshToken }));
}
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      dispatch(setError(error.data?.message || "Login failed"));
      setErrors({ email: " ", password: "Invalid email or password" }); // example error display
    }
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
            <button
              type="submit"
              className="w-full group transition-all duration-200 hover:scale-[1.02]"
              disabled={isLoading}
            >
              {isLoading || isLoadingUser ? (
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
            </button>
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