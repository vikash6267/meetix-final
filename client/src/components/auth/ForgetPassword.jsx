"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline"
import { ClipLoader } from "react-spinners"

const ForgotPassword = () => {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState(new Array(4).fill(""))
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email)
  }

  const sendOtp = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("https://meetix.mahitechnocrafts.in/api/v1/user/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await response.json()
      if (response.ok) {
        setSuccess("OTP sent successfully. Check your email!")
        setError("")
        setStep(2)
      } else {
        throw new Error(data.message || "Failed to send OTP")
      }
    } catch (err) {
      setError(err.message)
      setSuccess("")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailSubmit = (e) => {
    e.preventDefault()
    if (!validateEmail(email)) {
      setError("Please enter a valid email address")
      return
    }
    sendOtp()
  }

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))])
    if (element.nextSibling && element.value) {
      element.nextSibling.focus()
    }
  }

  const handleBackspace = (e, index) => {
    if (e.keyCode === 8 && !otp[index]) {
      if (e.target.previousSibling) {
        e.target.previousSibling.focus()
      }
    }
  }

  const verifyOtp = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("https://meetix.mahitechnocrafts.in/api/v1/user/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otp.join("") }),
      })
      const data = await response.json()
      if (response.ok) {
        setSuccess("OTP verified successfully!")
        setError("")
        setStep(3)
      } else {
        throw new Error(data.message || "Failed to verify OTP")
      }
    } catch (err) {
      setError(err.message)
      setSuccess("")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpSubmit = (e) => {
    e.preventDefault()
    if (otp.includes("")) {
      setError("Please enter the complete OTP")
      return
    }
    verifyOtp()
  }

  const resetPassword = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("https://meetix.mahitechnocrafts.in/api/v1/user/reset-password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password: newPassword,
          confirmPassword,
        }),
      })
      const data = await response.json()
      if (response.ok) {
        setSuccess("Password reset successfully!")
        setTimeout(() => {
          navigate("/login")
        }, 2000)
        setError("")
      } else {
        throw new Error(data.message || "Failed to reset password")
      }
    } catch (err) {
      setError(err.message)
      setSuccess("")
    } finally {
      setIsLoading(false)
    }
  }

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{6,}$/
    return passwordRegex.test(password)
  }

  const handlePasswordReset = (e) => {
    e.preventDefault()
    setError("")
    if (!validatePassword(newPassword)) {
      setError(
        "Password must be at least 6 characters long, with at least one uppercase letter, one digit, and one special character.",
      )
      return
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }
    resetPassword()
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full bg-gray-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-purple-800/30">
        {/* Left Side - Video Call Illustration */}
        <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>

          {/* Abstract geometric pattern */}
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute top-32 right-16 w-24 h-24 bg-indigo-500/20 rounded-full blur-lg animate-pulse delay-1000"></div>
            <div className="absolute bottom-20 left-20 w-40 h-40 bg-violet-500/20 rounded-full blur-2xl animate-pulse delay-500"></div>
            <div className="absolute bottom-32 right-10 w-28 h-28 bg-purple-400/20 rounded-full blur-xl animate-pulse delay-700"></div>
          </div>

          {/* Password reset illustration */}
          <div className="absolute inset-0 flex items-center justify-center p-12">
            <div className="relative">
              {/* Security shield mockup */}
              <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30 shadow-2xl text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-purple-200">Secure Reset Process</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse delay-300"></div>
                    <span className="text-sm text-purple-200">Email Verification</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse delay-500"></div>
                    <span className="text-sm text-purple-200">Encrypted Protection</span>
                  </div>
                </div>
              </div>

              <div className="text-center mt-8">
                <h3 className="text-3xl font-bold mb-4 text-white">Secure Password Recovery</h3>
                <p className="text-lg text-purple-200">
                  Your account security is our priority. Follow the steps to safely reset your password.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Forgot Password Form */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 bg-gray-900">
          <div className="text-center mb-8">
            <div className="mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                {step === 1 && (
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                )}
                {step === 2 && (
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 8a6 6 0 01-7.743 5.743L10 14l-4 4-4-4 4-4 .257-.257A6 6 0 1118 8zm-6-2a1 1 0 10-2 0 1 1 0 002 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {step === 3 && (
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </div>
            <h2 className="text-3xl font-extrabold text-white">
              {step === 1 && "Forgot Password"}
              {step === 2 && "Enter OTP"}
              {step === 3 && "Reset Password"}
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              {step === 1 && "Enter your email to receive a verification code"}
              {step === 2 && "Check your email for the 4-digit code"}
              {step === 3 && "Create a new password for your account"}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-500/50 text-red-300 rounded-md text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-900/50 border border-green-500/50 text-green-300 rounded-md text-sm">
              {success}
            </div>
          )}

          {step === 1 && (
            <form className="space-y-6" onSubmit={handleEmailSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email address
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <EnvelopeIcon className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="py-3 pl-10 block w-full bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-gray-900 transition-all duration-200 transform hover:scale-105 ${
                    isLoading ? "opacity-70 cursor-not-allowed transform-none" : ""
                  }`}
                >
                  {isLoading ? (
                    <>
                      <ClipLoader size={20} color="#fff" className="mr-2" />
                      Sending OTP...
                    </>
                  ) : (
                    "Send OTP"
                  )}
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form className="space-y-6" onSubmit={handleOtpSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-4">4-digit Verification Code</label>
                <div className="flex justify-center space-x-2">
                  {otp.map((data, index) => (
                    <input
                      key={index}
                      type="text"
                      className="w-12 h-12 p-2 text-center bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                      maxLength="1"
                      value={data}
                      onChange={(e) => handleOtpChange(e.target, index)}
                      onKeyUp={(e) => handleBackspace(e, index)}
                    />
                  ))}
                </div>
                <p className="mt-2 text-center text-sm text-gray-400">
                  Code sent to <span className="text-purple-400 font-semibold">{email}</span>
                </p>
              </div>
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-gray-900 transition-all duration-200 transform hover:scale-105 ${
                    isLoading ? "opacity-70 cursor-not-allowed transform-none" : ""
                  }`}
                >
                  {isLoading ? (
                    <>
                      <ClipLoader size={20} color="#fff" className="mr-2" />
                      Verifying...
                    </>
                  ) : (
                    "Verify OTP"
                  )}
                </button>
              </div>
              <div className="text-center text-sm text-gray-400">
                Didn't receive a code?{" "}
                <button
                  type="button"
                  onClick={sendOtp}
                  className="font-medium text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Resend OTP
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <form className="space-y-6" onSubmit={handlePasswordReset}>
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-2">
                  New Password
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="py-3 pl-10 block w-full bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                    placeholder="Enter new password"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm New Password
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="py-3 pl-10 block w-full bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                    placeholder="Confirm new password"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-400">
                  Must be at least 6 characters with one uppercase, one number, and one special character
                </p>
              </div>
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-gray-900 transition-all duration-200 transform hover:scale-105 ${
                    isLoading ? "opacity-70 cursor-not-allowed transform-none" : ""
                  }`}
                >
                  {isLoading ? (
                    <>
                      <ClipLoader size={20} color="#fff" className="mr-2" />
                      Resetting...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 text-center text-sm text-gray-400">
            Remember your password?{" "}
            <Link to="/login" className="font-medium text-purple-400 hover:text-purple-300 transition-colors">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
