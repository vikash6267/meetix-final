// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { EnvelopeIcon, LockClosedIcon, UserIcon, PhoneIcon } from '@heroicons/react/24/outline';
// import { FaEye, FaEyeSlash } from 'react-icons/fa';
// // import { ClipLoader } from 'react-spinners';
// import PhoneInput from 'react-phone-input-2';
// import 'react-phone-input-2/lib/style.css';
// import videoCallImage from '../../assets/download (2).jpg'; // Replace with your image path

// const SignUp = () => {
//   const [name, setName] = useState('');
//   const [phone, setPhone] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [role, setRole] = useState('participant');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [passwordVisible, setPasswordVisible] = useState(false);
//   const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [otp, setOtp] = useState(new Array(4).fill(''));
//   const [otpScreen, setOtpScreen] = useState(false);
//   const navigate = useNavigate();

//   const validatePassword = (password) => {
//     const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{6,}$/;
//     return passwordRegex.test(password);
//   };

//   const handleOtpChange = (element, index) => {
//     if (isNaN(element.value)) return false;
//     setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

//     if (element.nextSibling && element.value) {
//       element.nextSibling.focus();
//     }
//   };

//   const handleBackspace = (e, index) => {
//     if (e.keyCode === 8 && !otp[index]) {
//       if (e.target.previousSibling) {
//         e.target.previousSibling.focus();
//       }
//     }
//   };

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     // Basic validation
//     if (!name || !phone || !email || !password || !confirmPassword || !role) {
//       setError('All fields are required');
//       setLoading(false);
//       return;
//     }

//     if (!validatePassword(password)) {
//       setError('Password must be at least 6 characters with one uppercase, one number, and one special character');
//       setLoading(false);
//       return;
//     }

//     if (password !== confirmPassword) {
//       setError('Passwords do not match');
//       setLoading(false);
//       return;
//     }

//     // Send OTP request logic
//     try {
//       const response = await fetch(
//         "https://webinarbackend-bbf0buh4a8gyarbh.indonesiacentral-01.azurewebsites.net/api/v1/send-otp",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ email }),
//         }
//       );
//       const data = await response.json();
//       setLoading(false);

//       if (response.ok) {
//         setOtpScreen(true);
//         setSuccess(`We have sent an OTP to ${email}`);
//       } else {
//         setError(data.message || "Failed to send OTP.");
//       }
//     } catch (error) {
//       setError("Failed to communicate with the server.");
//       setLoading(false);
//     }
//   };

//   const verifyOtp = async () => {
//     setLoading(true);
//     const otpValue = otp.join('');

//     try {
//       const response = await fetch(
//         "https://webinarbackend-bbf0buh4a8gyarbh.indonesiacentral-01.azurewebsites.net/api/v1/verify-otp",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ otp: otpValue, email }),
//         }
//       );
//       const data = await response.json();

//       if (response.ok) {
//         setSuccess("OTP verified! Completing registration...");
//         await finalizeRegistration();
//       } else {
//         setError(data.message || "Invalid OTP. Please try again.");
//       }
//       setLoading(false);
//     } catch (error) {
//       setError("OTP verification failed.");
//       setLoading(false);
//     }
//   };

//   const finalizeRegistration = async () => {
//     setLoading(true);
//     setError('');

//     // Format phone number
//     let formattedPhone = phone;
//     if (phone.startsWith('+')) {
//       formattedPhone = `${phone.slice(0, 3)} ${phone.slice(3)}`;
//     } else {
//       formattedPhone = `+${phone.slice(0, 2)} ${phone.slice(2)}`;
//     }

//     const userData = {
//       name,
//       phone: formattedPhone,
//       email,
//       password,
//       confirmPassword,
//       role,
//     };

//     try {
//       const response = await fetch(
//         "https://webinarbackend-bbf0buh4a8gyarbh.indonesiacentral-01.azurewebsites.net/api/v1/users/signup",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(userData),
//         }
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         setError(data.message || "Failed to register. Please try again.");
//       } else {
//         setSuccess("Registration successful! Redirecting to login...");
//         setTimeout(() => navigate('/login'), 2000);
//       }
//     } catch (err) {
//       setError("Failed to register. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-6xl w-full shadow-lg overflow-hidden flex flex-col md:flex-row">
//         {/* Left Side - Video Call Image */}
//         <div className="hidden md:block md:w-1/2 bg-transparent relative">
//           <div className="absolute"></div>
//           <img
//             src={videoCallImage}
//             alt="Video call illustration"
//             className="w-full h-full object-cover mix-blend-overlay"
//           />
//           <div className="absolute inset-0 flex items-center justify-center p-12 text-center">
//             <div className="text-black">
//               <h3 className="text-3xl font-bold mb-4">Connect with anyone, anywhere</h3>
//               <p className="text-lg opacity-90">
//                 High-quality video calls with screen sharing, recording, and more
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Right Side - Sign Up Form */}
//         <div className="w-full md:w-1/2 p-8 sm:p-12">
//           <div className="text-center mb-8">
//             <h2 className="text-3xl font-extrabold text-gray-900">Create your account</h2>
//             <p className="mt-2 text-sm text-gray-600">
//               Or{' '}
//               <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
//                 sign in to your existing account
//               </Link>
//             </p>
//           </div>

//           {error && (
//             <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
//               {error}
//             </div>
//           )}

//           {success && (
//             <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md text-sm">
//               {success}
//             </div>
//           )}

//           {otpScreen ? (
//             <>
//               <div className="text-center mb-6">
//                 <h3 className="text-xl font-semibold">Verify your email</h3>
//                 <p className="mt-2 text-sm text-gray-600">
//                   We've sent a 4-digit code to {email}
//                 </p>
//               </div>

//               <div className="flex justify-center mb-6 space-x-2">
//                 {otp.map((data, index) => (
//                   <input
//                     key={index}
//                     type="text"
//                     className="w-12 h-12 p-2 text-center border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                     maxLength="1"
//                     value={data}
//                     onChange={(e) => handleOtpChange(e.target, index)}
//                     onKeyUp={(e) => handleBackspace(e, index)}
//                   />
//                 ))}
//               </div>

//               <button
//                 onClick={verifyOtp}
//                 disabled={loading}
//                 className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''
//                   }`}
//               >
//                 {loading ? (
//                   <>
//                     <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                     </svg>
//                     Verifying...
//                   </>
//                 ) : (
//                   'Verify and Register'
//                 )}
//               </button>

//               <div className="mt-4 text-center text-sm text-gray-600">
//                 Didn't receive a code?{' '}
//                 <button
//                   onClick={handleRegister}
//                   className="font-medium text-blue-600 hover:text-blue-500"
//                 >
//                   Resend OTP
//                 </button>
//               </div>
//             </>
//           ) : (
//             <form className="space-y-4" onSubmit={handleRegister}>
//               <div>
//                 <label htmlFor="name" className="block text-sm font-medium text-gray-700">
//                   Full Name
//                 </label>
//                 <div className="mt-1 relative rounded-md shadow-sm">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <UserIcon className="h-5 w-5 text-gray-400" />
//                   </div>
//                   <input
//                     id="name"
//                     name="name"
//                     type="text"
//                     autoComplete="name"
//                     required
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                     className="py-3 pl-10 block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                     placeholder="John Doe"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
//                   Phone Number
//                 </label>
//                 <div className="mt-1">
//                   <PhoneInput
//                     country={'us'}
//                     value={phone}
//                     onChange={setPhone}
//                     placeholder="Enter phone number"
//                     inputProps={{
//                       required: true,
//                       className: 'py-3 pl-12 block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500',
//                     }}
//                     containerClass=""
//                     inputStyle={{
//                       width: '100%',
//                       height: 'auto',
//                       paddingLeft: '50px',
//                     }}
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                   Email address
//                 </label>
//                 <div className="mt-1 relative rounded-md shadow-sm">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <EnvelopeIcon className="h-5 w-5 text-gray-400" />
//                   </div>
//                   <input
//                     id="email"
//                     name="email"
//                     type="email"
//                     autoComplete="email"
//                     required
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     className="py-3 pl-10 block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                     placeholder="you@example.com"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label htmlFor="role" className="block text-sm font-medium text-gray-700">
//                   Role
//                 </label>
//                 <div className="mt-1 relative rounded-md shadow-sm">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <UserIcon className="h-5 w-5 text-gray-400" />
//                   </div>
//                   <select
//                     id="role"
//                     name="role"
//                     required
//                     value={role}
//                     onChange={(e) => setRole(e.target.value)}
//                     className="py-3 pl-10 block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 appearance-none"
//                   >
//                     <option value="participant">Participant</option>
//                     <option value="host">Host</option>
//                   </select>
//                   <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
//                     <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
//                       <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
//                     </svg>
//                   </div>
//                 </div>
//               </div>

//               <div>
//                 <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//                   Password
//                 </label>
//                 <div className="mt-1 relative rounded-md shadow-sm">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <LockClosedIcon className="h-5 w-5 text-gray-400" />
//                   </div>
//                   <input
//                     id="password"
//                     name="password"
//                     type={passwordVisible ? "text" : "password"}
//                     autoComplete="new-password"
//                     required
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     className="py-3 pl-10 pr-10 block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                     placeholder="••••••••"
//                   />
//                   <div
//                     className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
//                     onClick={() => setPasswordVisible(!passwordVisible)}
//                   >
//                     {passwordVisible ? (
//                       <FaEyeSlash className="h-5 w-5 text-gray-400" />
//                     ) : (
//                       <FaEye className="h-5 w-5 text-gray-400" />
//                     )}
//                   </div>
//                 </div>
//                 <p className="mt-1 text-xs text-gray-500">
//                   Must be at least 6 characters with one uppercase, one number, and one special character
//                 </p>
//               </div>

//               <div>
//                 <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
//                   Confirm Password
//                 </label>
//                 <div className="mt-1 relative rounded-md shadow-sm">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <LockClosedIcon className="h-5 w-5 text-gray-400" />
//                   </div>
//                   <input
//                     id="confirmPassword"
//                     name="confirmPassword"
//                     type={confirmPasswordVisible ? "text" : "password"}
//                     autoComplete="new-password"
//                     required
//                     value={confirmPassword}
//                     onChange={(e) => setConfirmPassword(e.target.value)}
//                     className="py-3 pl-10 pr-10 block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                     placeholder="••••••••"
//                   />
//                   <div
//                     className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
//                     onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
//                   >
//                     {confirmPasswordVisible ? (
//                       <FaEyeSlash className="h-5 w-5 text-gray-400" />
//                     ) : (
//                       <FaEye className="h-5 w-5 text-gray-400" />
//                     )}
//                   </div>
//                 </div>
//               </div>

//               <div>
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''
//                     }`}
//                 >
//                   {loading ? (
//                     <>
//                       <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                       </svg>
//                       Sending OTP...
//                     </>
//                   ) : (
//                     'Continue'
//                   )}
//                 </button>
//               </div>
//             </form>
//           )}

//           <div className="mt-6 text-center text-sm text-gray-600">
//             Already have an account?{' '}
//             <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
//               Sign in
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignUp;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EnvelopeIcon, LockClosedIcon, UserIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
// import { ClipLoader } from 'react-spinners';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import videoCallImage from '../../assets/download (2).jpg'; // Replace with your image path

const SignUp = () => {
  const [username, setUsername] = useState('');
  // const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [role, setRole] = useState('participant');
  // const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  // const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(new Array(4).fill(''));
  const [otpScreen, setOtpScreen] = useState(false);
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{6,}$/;
    return passwordRegex.test(password);
  };

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  };

  const handleBackspace = (e, index) => {
    if (e.keyCode === 8 && !otp[index]) {
      if (e.target.previousSibling) {
        e.target.previousSibling.focus();
      }
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Basic validation
    if (!username || !email || !password) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      setError('Password must be at least 6 characters with one uppercase, one number, and one special character');
      setLoading(false);
      return;
    }

    // if (password !== confirmPassword) {
    //   setError('Passwords do not match');
    //   setLoading(false);
    //   return;
    // }

    // Send OTP request logic
    try {
      const response = await fetch(
        "https://meetix.mahitechnocrafts.in/api/v1/user/send-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        setOtpScreen(true);
        setSuccess(`We have sent an OTP to ${email}`);
      } else {
        setError(data.message || "Failed to send OTP.");
      }
    } catch (error) {
      setError("Failed to communicate with the server.");
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setLoading(true);
    const otpValue = otp.join('');

    try {
      const response = await fetch(
        "https://meetix.mahitechnocrafts.in/api/v1/user/verify-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ otp: otpValue, email }),
        }
      );
      const data = await response.json();

      if (response.ok) {
        setSuccess("OTP verified! Completing registration...");
        await finalizeRegistration();
      } else {
        setError(data.message || "Invalid OTP. Please try again.");
      }
      setLoading(false);
    } catch (error) {
      setError("OTP verification failed.");
      setLoading(false);
    }
  };

  const finalizeRegistration = async () => {
    setLoading(true);
    setError('');

    // Format phone number
    // let formattedPhone = phone;
    // if (phone.startsWith('+')) {
    //   formattedPhone = `${phone.slice(0, 3)} ${phone.slice(3)}`;
    // } else {
    //   formattedPhone = `+${phone.slice(0, 2)} ${phone.slice(2)}`;
    // }

    const userData = {
      username,
      email,
      password,
    };

    try {
      const response = await fetch(
        "https://meetix.mahitechnocrafts.in/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to register. Please try again.");
      } else {
        setSuccess("Registration successful! Redirecting to login...");
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (err) {
      setError("Failed to register. Please try again later.");
    } finally {
      setLoading(false);
    }
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
              <h3 className="text-3xl font-bold mb-4">Connect with anyone, anywhere</h3>
              <p className="text-lg opacity-90">
                High-quality video calls with screen sharing, recording, and more
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Sign Up Form */}
        <div className="w-full md:w-1/2 p-8 sm:p-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900">Create your account</h2>
            <p className="mt-2 text-sm text-gray-600">
              Or{' '}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                sign in to your existing account
              </Link>
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md text-sm">
              {success}
            </div>
          )}

          {otpScreen ? (
            <>
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold">Verify your email</h3>
                <p className="mt-2 text-sm text-gray-600">
                  We've sent a 4-digit code to {email}
                </p>
              </div>

              <div className="flex justify-center mb-6 space-x-2">
                {otp.map((data, index) => (
                  <input
                    key={index}
                    type="text"
                    className="w-12 h-12 p-2 text-center border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    maxLength="1"
                    value={data}
                    onChange={(e) => handleOtpChange(e.target, index)}
                    onKeyUp={(e) => handleBackspace(e, index)}
                  />
                ))}
              </div>

              <button
                onClick={verifyOtp}
                disabled={loading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </>
                ) : (
                  'Verify and Register'
                )}
              </button>

              <div className="mt-4 text-center text-sm text-gray-600">
                Didn't receive a code?{' '}
                <button
                  onClick={handleRegister}
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Resend OTP
                </button>
              </div>
            </>
          ) : (
            <form className="space-y-4" onSubmit={handleRegister}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="py-3 pl-10 block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              {/* <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <div className="mt-1">
                  <PhoneInput
                    country={'us'}
                    value={phone}
                    onChange={setPhone}
                    placeholder="Enter phone number"
                    inputProps={{
                      required: true,
                      className: 'py-3 pl-12 block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500',
                    }}
                    containerClass=""
                    inputStyle={{
                      width: '100%',
                      height: 'auto',
                      paddingLeft: '50px',
                    }}
                  />
                </div>
              </div> */}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="py-3 pl-10 block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="role"
                    name="role"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="py-3 pl-10 block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 appearance-none"
                  >
                    <option value="participant">Participant</option>
                    <option value="host">Host</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div> */}

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={passwordVisible ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="py-3 pl-10 pr-10 block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="••••••••"
                  />
                  <div
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                  >
                    {passwordVisible ? (
                      <FaEyeSlash className="h-5 w-5 text-gray-400" />
                    ) : (
                      <FaEye className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Must be at least 6 characters with one uppercase, one number, and one special character
                </p>
              </div>

              {/* <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={confirmPasswordVisible ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="py-3 pl-10 pr-10 block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="••••••••"
                  />
                  <div
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                    onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                  >
                    {confirmPasswordVisible ? (
                      <FaEyeSlash className="h-5 w-5 text-gray-400" />
                    ) : (
                      <FaEye className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </div> */}

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending OTP...
                    </>
                  ) : (
                    'Continue'
                  )}
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;