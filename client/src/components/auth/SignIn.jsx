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

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { ClipLoader } from 'react-spinners';
import videoCallImage from '../../assets/download (2).jpg';
import { FaPlusCircle } from 'react-icons/fa';

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3010/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Failed to sign in. Please try again.');
      } else {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // localStorage.setItem('name', data.name);
        // localStorage.setItem('userId', data.userId);
        // setIsLoggedIn(true);
        navigate('/meetings/details');
      }
    } catch (err) {
      setError('Failed to connect to the server. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('email');
    localStorage.removeItem('name');
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full shadow-lg overflow-hidden flex flex-col md:flex-row">
        {/* Left Side - Video Call Image */}
        <div className="hidden md:block md:w-1/2 bg-transparent relative">
          <div className="absolute"></div>
          <img
            src={videoCallImage}
            alt="Video call illustration"
            className="w-full h-full object-cover mix-blend-overlay"
          />
          <div className="absolute inset-0 flex items-center justify-center p-12 text-center">
            <div className="text-black">
              <h3 className="text-3xl font-bold mb-4">
                Connect with anyone, anywhere
              </h3>
              <p className="text-lg opacity-90">
                High-quality video calls with screen sharing, recording, and
                more
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8 sm:p-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900">
              {isLoggedIn ? 'Account Details' : 'Sign in to your account'}
            </h2>
            {!isLoggedIn && (
              <p className="mt-2 text-sm text-gray-600">
                Or{' '}
                <Link
                  to="/sign-up"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  start your 14-day free trial
                </Link>
              </p>
            )}
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          {isLoggedIn ? (
            <div className="text-center">
              <p className="mb-4">
                You are logged in as {localStorage.getItem('email')}
              </p>
              <button
                onClick={handleLogout}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Log out
              </button>

              <button>
                <Link
                  to={`http://localhost:3010?id=${user?._id}`}
                  target="_blank"
                  className="inline-flex mt-6 items-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-200"
                >
                  <FaPlusCircle className="mr-2 text-lg" />
                  <span>New Meeting</span>
                </Link>
              </button>
            </div>
          ) : (
            <>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Username
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="text"
                      autoComplete="email"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="py-3 pl-10 block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="username"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockClosedIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="py-3 pl-10 block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="••••••••"
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
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="remember-me"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <Link
                      to="/forgot-password"
                      className="font-medium text-blue-600 hover:text-blue-500"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                      isLoading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <ClipLoader size={20} color="#fff" className="mr-2" />
                        Signing in...
                      </>
                    ) : (
                      'Sign in'
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-6 text-center text-sm text-gray-600">
                Not registered?{' '}
                <Link
                  to="/sign-up"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Sign up for an account
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignIn;
