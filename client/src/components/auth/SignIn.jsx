// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';
// import { ClipLoader } from 'react-spinners';
// import videoCallImage from '../../assets/download (2).jpg';

// const SignIn = () => {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [rememberMe, setRememberMe] = useState(false);
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState('');
//     const [isLoggedIn, setIsLoggedIn] = useState(false);
//     const navigate = useNavigate();

//     useEffect(() => {
//         const token = localStorage.getItem('authToken');
//         setIsLoggedIn(!!token);
//     }, []);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setIsLoading(true);
//         setError('');

//         try {
//             const response = await fetch(
//                 'https://webinarbackend-bbf0buh4a8gyarbh.indonesiacentral-01.azurewebsites.net/api/v1/users/login',
//                 {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify({ email, password }),
//                 }
//             );

//             const data = await response.json();

//             if (!response.ok) {
//                 setError(data.message || 'Failed to sign in. Please try again.');
//             } else {
//                 localStorage.setItem('authToken', data.token);
//                 localStorage.setItem('email', data.email);
//                 localStorage.setItem('name', data.name);
//                 localStorage.setItem('userId', data.userId);
//                 setIsLoggedIn(true);
//                 navigate('/dashboard/attendance');
//             }
//         } catch (err) {
//             setError('Failed to connect to the server. Please try again later.');
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const handleLogout = () => {
//         localStorage.removeItem('authToken');
//         localStorage.removeItem('email');
//         localStorage.removeItem('name');
//         localStorage.removeItem('userId');
//         setIsLoggedIn(false);
//         navigate('/');
//     };

//     return (
//         <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
//             <div className="max-w-6xl w-full shadow-lg overflow-hidden flex flex-col md:flex-row">
//                 {/* Left Side - Video Call Image */}
//                 <div className="hidden md:block md:w-1/2 bg-transparent relative">
//                     <div className="absolute"></div>
//                     <img
//                         src={videoCallImage}
//                         alt="Video call illustration"
//                         className="w-full h-full object-cover mix-blend-overlay"
//                     />
//                     <div className="absolute inset-0 flex items-center justify-center p-12 text-center">
//                         <div className="text-black">
//                             <h3 className="text-3xl font-bold mb-4">Connect with anyone, anywhere</h3>
//                             <p className="text-lg opacity-90">
//                                 High-quality video calls with screen sharing, recording, and more
//                             </p>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Right Side - Form */}
//                 <div className="w-full md:w-1/2 p-8 sm:p-12">
//                     <div className="text-center mb-8">
//                         <h2 className="text-3xl font-extrabold text-gray-900">
//                             {isLoggedIn ? 'Account Details' : 'Sign in to your account'}
//                         </h2>
//                         {!isLoggedIn && (
//                             <p className="mt-2 text-sm text-gray-600">
//                                 Or{' '}
//                                 <Link to="/sign-up" className="font-medium text-blue-600 hover:text-blue-500">
//                                     start your 14-day free trial
//                                 </Link>
//                             </p>
//                         )}
//                     </div>

//                     {error && (
//                         <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
//                             {error}
//                         </div>
//                     )}

//                     {isLoggedIn ? (
//                         <div className="text-center">
//                             <p className="mb-4">You are logged in as {localStorage.getItem('email')}</p>
//                             <button
//                                 onClick={handleLogout}
//                                 className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
//                             >
//                                 Log out
//                             </button>
//                         </div>
//                     ) : (
//                         <>
//                             <form className="space-y-6" onSubmit={handleSubmit}>
//                                 <div>
//                                     <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                                         Email address
//                                     </label>
//                                     <div className="mt-1 relative rounded-md shadow-sm">
//                                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                             <EnvelopeIcon className="h-5 w-5 text-gray-400" />
//                                         </div>
//                                         <input
//                                             id="email"
//                                             name="email"
//                                             type="email"
//                                             autoComplete="email"
//                                             required
//                                             value={email}
//                                             onChange={(e) => setEmail(e.target.value)}
//                                             className="py-3 pl-10 block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                                             placeholder="you@example.com"
//                                         />
//                                     </div>
//                                 </div>

//                                 <div>
//                                     <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//                                         Password
//                                     </label>
//                                     <div className="mt-1 relative rounded-md shadow-sm">
//                                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                             <LockClosedIcon className="h-5 w-5 text-gray-400" />
//                                         </div>
//                                         <input
//                                             id="password"
//                                             name="password"
//                                             type="password"
//                                             autoComplete="current-password"
//                                             required
//                                             value={password}
//                                             onChange={(e) => setPassword(e.target.value)}
//                                             className="py-3 pl-10 block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                                             placeholder="••••••••"
//                                         />
//                                     </div>
//                                 </div>

//                                 <div className="flex items-center justify-between">
//                                     <div className="flex items-center">
//                                         <input
//                                             id="remember-me"
//                                             name="remember-me"
//                                             type="checkbox"
//                                             checked={rememberMe}
//                                             onChange={(e) => setRememberMe(e.target.checked)}
//                                             className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                                         />
//                                         <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
//                                             Remember me
//                                         </label>
//                                     </div>

//                                     <div className="text-sm">
//                                         <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
//                                             Forgot your password?
//                                         </Link>
//                                     </div>
//                                 </div>

//                                 <div>
//                                     <button
//                                         type="submit"
//                                         disabled={isLoading}
//                                         className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
//                                             isLoading ? 'opacity-70 cursor-not-allowed' : ''
//                                         }`}
//                                     >
//                                         {isLoading ? (
//                                             <>
//                                                 <ClipLoader size={20} color="#fff" className="mr-2" />
//                                                 Signing in...
//                                             </>
//                                         ) : (
//                                             'Sign in'
//                                         )}
//                                     </button>
//                                 </div>
//                             </form>

//                             <div className="mt-6 text-center text-sm text-gray-600">
//                                 Not registered?{' '}
//                                 <Link to="/sign-up" className="font-medium text-blue-600 hover:text-blue-500">
//                                     Sign up for an account
//                                 </Link>
//                             </div>
//                         </>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default SignIn;
"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline"
import { ClipLoader } from "react-spinners"
import { FaPlusCircle } from "react-icons/fa"

const SignIn = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const navigate = useNavigate()

  const storedUser = localStorage.getItem("user")
  const user = storedUser ? JSON.parse(storedUser) : null

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    setIsLoggedIn(!!token)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("https://meetix.mahitechnocrafts.in/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || "Failed to sign in. Please try again.")
      } else {
        localStorage.setItem("authToken", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))
        navigate("/meetings/details")
      }
    } catch (err) {
      setError("Failed to connect to the server. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("email")
    localStorage.removeItem("name")
    localStorage.removeItem("userId")
    setIsLoggedIn(false)
    navigate("/")
  }

  return (
    <div className="min-h-screen bg-[#191c1e] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
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

          {/* Video call mockup */}
          <div className="absolute inset-0 flex items-center justify-center p-12">
            <div className="relative">
              {/* Main video window */}
              <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="text-purple-300 text-sm font-semibold">Meetix</div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg h-24 flex items-center justify-center relative overflow-hidden">
                    <div className="w-8 h-8 bg-white/20 rounded-full"></div>
                    <div className="absolute bottom-2 left-2 text-xs text-white/80">You</div>
                  </div>
                  <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg h-24 flex items-center justify-center relative overflow-hidden">
                    <div className="w-8 h-8 bg-white/20 rounded-full"></div>
                    <div className="absolute bottom-2 left-2 text-xs text-white/80">John</div>
                  </div>
                  <div className="bg-gradient-to-br from-violet-600 to-purple-600 rounded-lg h-24 flex items-center justify-center relative overflow-hidden">
                    <div className="w-8 h-8 bg-white/20 rounded-full"></div>
                    <div className="absolute bottom-2 left-2 text-xs text-white/80">Sarah</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-600 to-violet-600 rounded-lg h-24 flex items-center justify-center relative overflow-hidden">
                    <div className="w-8 h-8 bg-white/20 rounded-full"></div>
                    <div className="absolute bottom-2 left-2 text-xs text-white/80">Mike</div>
                  </div>
                </div>

                <div className="flex justify-center space-x-4">
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors cursor-pointer">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors cursor-pointer">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors cursor-pointer">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="text-center mt-8">
                <h3 className="text-3xl font-bold mb-4 text-white">Connect with anyone, anywhere</h3>
                <p className="text-lg text-purple-200">
                  High-quality video calls with screen sharing, recording, and more
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 bg-gray-900">
          <div className="text-center mb-8">
            <h2 className="text-white ">Welcome Back!</h2>
            <h2 className="text-3xl font-semibold tracking-tight text-white">
              {isLoggedIn ? "Account Details" : "Sign in to your account"}
            </h2>
            {!isLoggedIn && (
              <p className="mt-2 text-sm text-gray-400">
                Or{" "}
                <Link to="/sign-up" className="font-medium text-purple-400 hover:text-purple-300 transition-colors">
                  start your 14-day free trial
                </Link>
              </p>
            )}
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-500/50 text-red-300 rounded-md text-white text-sm">
              {error}
            </div>
          )}

          {isLoggedIn ? (
            <div className="text-center">
              <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-purple-500/20">
                <p className="mb-4 text-gray-300">
                  You are logged in as{" "}
                  <span className="text-purple-400 font-semibold">{localStorage.getItem("email")}</span>
                </p>
                <div className="flex flex-col space-y-3">
                  <button
                    onClick={handleLogout}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-gray-900 transition-colors"
                  >
                    Log out
                  </button>
                  <Link
                    to={`https://meetix.mahitechnocrafts.in?id=${user?._id}`}
                    target="_blank"
                    className="inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105"
                  >
                    <FaPlusCircle className="mr-2 text-lg" />
                    <span>New Meeting</span>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                    Username
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <EnvelopeIcon className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      autoComplete="username"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="py-3 pl-10 block w-full bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                      placeholder="Enter your username"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockClosedIcon className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="py-3 pl-10 block w-full bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                      placeholder="Enter your password"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-600 bg-gray-800 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <Link
                      to="/forgot-password"
                      className="font-medium text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      Forgot your password?
                    </Link>
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
                        Signing in...
                      </>
                    ) : (
                      "Sign in"
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-6 text-center text-sm text-gray-400">
                Not registered?{" "}
                <Link to="/sign-up" className="font-medium text-purple-400 hover:text-purple-300 transition-colors">
                  Sign up for an account
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default SignIn

