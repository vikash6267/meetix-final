import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { ClipLoader } from 'react-spinners';
import videoCallImage from '../../assets/download (2).jpg'; // Replace with your image path

const ForgotPassword = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(new Array(4).fill(''));
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const validateEmail = (email) => {
        return /\S+@\S+\.\S+/.test(email);
    };

    const sendOtp = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(
                'http://localhost:3010/api/v1/user/send-otp',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email }),
                }
            );
            const data = await response.json();
            if (response.ok) {
                setSuccess('OTP sent successfully. Check your email!');
                setError('');
                setStep(2);
            } else {
                throw new Error(data.message || 'Failed to send OTP');
            }
        } catch (err) {
            setError(err.message);
            setSuccess('');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmailSubmit = (e) => {
        e.preventDefault();
        if (!validateEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }
        sendOtp();
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

    const verifyOtp = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(
                'http://localhost:3010/api/v1/user/verify-otp',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, otp: otp.join('') }),
                }
            );
            const data = await response.json();
            if (response.ok) {
                setSuccess('OTP verified successfully!');
                setError('');
                setStep(3);
            } else {
                throw new Error(data.message || 'Failed to verify OTP');
            }
        } catch (err) {
            setError(err.message);
            setSuccess('');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOtpSubmit = (e) => {
        e.preventDefault();
        if (otp.includes('')) {
            setError('Please enter the complete OTP');
            return;
        }
        verifyOtp();
    };

    const resetPassword = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(
                'http://localhost:3010/api/v1/user/reset-password',
                {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email,
                        password: newPassword,
                        confirmPassword,
                    }),
                }
            );
            const data = await response.json();
            if (response.ok) {
                setSuccess('Password reset successfully!');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
                setError('');
            } else {
                throw new Error(data.message || 'Failed to reset password');
            }
        } catch (err) {
            setError(err.message);
            setSuccess('');
        } finally {
            setIsLoading(false);
        }
    };

    const validatePassword = (password) => {
        const passwordRegex =
            /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{6,}$/;
        return passwordRegex.test(password);
    };

    const handlePasswordReset = (e) => {
        e.preventDefault();
        setError('');
        if (!validatePassword(newPassword)) {
            setError(
                'Password must be at least 6 characters long, with at least one uppercase letter, one digit, and one special character.'
            );
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        resetPassword();
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

                {/* Right Side - Forgot Password Form */}
                <div className="w-full md:w-1/2 p-8 sm:p-12">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-extrabold text-gray-900">
                            {step === 1 && 'Forgot Password'}
                            {step === 2 && 'Enter OTP'}
                            {step === 3 && 'Reset Password'}
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            {step === 1 && 'Enter your email to receive a verification code'}
                            {step === 2 && 'Check your email for the 6-digit code'}
                            {step === 3 && 'Create a new password for your account'}
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

                    {step === 1 && (
                        <form className="space-y-6" onSubmit={handleEmailSubmit}>
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
                                            Sending OTP...
                                        </>
                                    ) : (
                                        'Send OTP'
                                    )}
                                </button>
                            </div>
                        </form>
                    )}

                    {step === 2 && (
                        <form className="space-y-6" onSubmit={handleOtpSubmit}>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    6-digit Verification Code
                                </label>
                                <div className="mt-1 flex justify-center space-x-2">
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
                                            Verifying...
                                        </>
                                    ) : (
                                        'Verify OTP'
                                    )}
                                </button>
                            </div>
                        </form>
                    )}

                    {step === 3 && (
                        <form className="space-y-6" onSubmit={handlePasswordReset}>
                            <div>
                                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                                    New Password
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <LockClosedIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="newPassword"
                                        name="newPassword"
                                        type="password"
                                        required
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="py-3 pl-10 block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                    Confirm New Password
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <LockClosedIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="py-3 pl-10 block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="••••••••"
                                    />
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
                                            Resetting...
                                        </>
                                    ) : (
                                        'Reset Password'
                                    )}
                                </button>
                            </div>
                        </form>
                    )}

                    <div className="mt-6 text-center text-sm text-gray-600">
                        Remember your password?{' '}
                        <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;