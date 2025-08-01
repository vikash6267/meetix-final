'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

import {
  Calendar,
  Clock,
  DollarSign,
  RefreshCw,
  CheckCircle,
  XCircle,
  Zap,
  Star,
  TrendingUp,
  CreditCard,
} from 'lucide-react';
import Sidebar from '../Layouts/SideNav';
import Header from '../Layouts/SidebarHeader';
import AllSubscriptions from '../common/AllSubscription';

const SubscriptionPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        setLoading(true);
        const { data } = await axios.post(
          'https://meetix.mahitechnocrafts.in/api/v1/subscription/my-subscriptions',
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setSubscriptions(data?.subscriptions || []);
        setError(null);
      } catch (error) {
        console.error(error?.response?.data || error?.message || error);
        setError(
          error?.response?.data?.message || 'Failed to fetch subscriptions.',
        );
        setSubscriptions([]);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchSubscriptions();
    } else {
      setLoading(false);
      setError('No authentication token found');
    }
  }, [token]);

  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  const handleSubscribe = async (plan) => {
    if (!user?.email) {
      toast.error('User email not found. Please log in again.');
      return;
    }

    setLoading(true);

    try {
      console.log('📦 Creating subscription for plan:', plan);

      const response = await axios.post(
        'https://meetix.mahitechnocrafts.in/api/v1/subscription/create',
        {
          subscriptionId: plan._id,
          redirectUrl: `https://www.mahitechnocrafts.in/payment-success?subscriptionId=${plan._id}`,
          metadata: {
            email: user.email,
            userId: user.id || user._id,
            planType: plan.type,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      console.log('✅ Subscription creation response:', response.data);

      if (response.data.redirectUrl) {
        window.location.href = response.data.redirectUrl; // 🔁 Redirect to Whop
      } else {
        toast.error('❌ Failed to start checkout - no redirect URL received');
      }
    } catch (error) {
      console.error('❌ Subscription error:', error);
      toast.error(error.response?.data?.message || 'Failed to start checkout');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (isActive) => (
    <span
      className={`
      inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
      ${
        isActive
          ? 'bg-gradient-to-r from-green-400 to-emerald-400 text-white shadow-lg'
          : 'bg-gradient-to-r from-red-400 to-pink-400 text-white shadow-lg'
      }
    `}
    >
      {isActive ? (
        <>
          <CheckCircle size={12} className="mr-1" />
          Active
        </>
      ) : (
        <>
          <XCircle size={12} className="mr-1" />
          Expired
        </>
      )}
    </span>
  );

  const getPlanIcon = (planType) => {
    if (planType.toLowerCase().includes('enterprise'))
      return <Star className="text-yellow-400" size={24} />;
    if (planType.toLowerCase().includes('premium'))
      return <Zap className="text-purple-400" size={24} />;
    return <TrendingUp className="text-blue-400" size={24} />;
  };

  const getPlanGradient = (planType) => {
    if (planType.toLowerCase().includes('enterprise'))
      return 'from-yellow-400 via-orange-400 to-red-400';
    if (planType.toLowerCase().includes('premium'))
      return 'from-purple-400 via-pink-400 to-red-400';
    return 'from-blue-400 via-cyan-400 to-teal-400';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const daysBetween = (from, to) => {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    return Math.ceil(
      (toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24),
    );
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} name="My Subscriptions" />

        <div className="flex-1 overflow-auto p-6 md:p-10">
          <div className="max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mr-4">
                  <CreditCard className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
                    My Subscriptions
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Manage your active plans and subscriptions
                  </p>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6 rounded-2xl text-white shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100">Active Plans</p>
                      <p className="text-3xl font-bold">
                        {loading
                          ? '...'
                          : subscriptions.filter((s) => s.isActive).length}
                      </p>
                    </div>
                    <CheckCircle size={32} className="text-blue-200" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 rounded-2xl text-white shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100">Monthly Spend</p>
                      <p className="text-3xl font-bold">
                        {loading
                          ? '...'
                          : `$${subscriptions
                              .filter((s) => s.isActive)
                              .reduce((sum, s) => sum + (s.payable || 0), 0)
                              .toFixed(2)}`}
                      </p>
                    </div>
                    <DollarSign size={32} className="text-green-200" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-2xl text-white shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100">Total Plans</p>
                      <p className="text-3xl font-bold">
                        {loading ? '...' : subscriptions.length}
                      </p>
                    </div>
                    <Star size={32} className="text-purple-200" />
                  </div>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600 text-lg">
                    Loading your subscriptions...
                  </p>
                </div>
              </div>
            ) : error ? (
              <div className="bg-gradient-to-r from-red-50 to-pink-50 p-12 rounded-3xl shadow-xl text-center border border-red-100">
                <div className="w-24 h-24 bg-gradient-to-r from-red-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-6">
                  <XCircle className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-red-800 mb-4">
                  Error Loading Subscriptions
                </h3>
                <p className="text-red-600 mb-8">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white py-3 px-8 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center font-semibold mx-auto"
                >
                  <RefreshCw size={18} className="mr-2" />
                  Try Again
                </button>
              </div>
            ) : subscriptions.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl shadow-xl text-center border border-gray-100">
                <div className="w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CreditCard className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  No subscriptions found
                </h3>
                <p className="text-gray-600 mb-8">
                  Start your journey by choosing a plan that fits your needs
                </p>
                <AllSubscriptions />
              </div>
            ) : (
              <div className="space-y-8">
                {subscriptions.map((sub, index) => {
                  const enrollDate = sub.enrollmentDate;
                  const expireDate = sub.expirationDate;
                  const now = new Date();
                  const daysSinceEnroll = daysBetween(
                    enrollDate,
                    now.toISOString().split('T')[0],
                  );
                  const daysToExpire = daysBetween(
                    now.toISOString().split('T')[0],
                    expireDate,
                  );
                  const isExpired = new Date() > new Date(expireDate);

                  return (
                    <div
                      key={sub._id || index}
                      className={`
                        relative bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl 
                        transition-all duration-300 border border-gray-100
                        transform hover:-translate-y-1
                        ${sub.isActive ? 'ring-2 ring-purple-200' : ''}
                      `}
                    >
                      {/* Gradient Border */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-r ${getPlanGradient(
                          sub.service.type,
                        )} rounded-3xl opacity-5`}
                      />

                      {/* Header */}
                      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-6">
                        <div className="flex items-center mb-4 lg:mb-0">
                          <div
                            className={`p-4 bg-gradient-to-r ${getPlanGradient(
                              sub.service.type,
                            )} rounded-2xl mr-4 shadow-lg`}
                          >
                            {getPlanIcon(sub.service.type)}
                          </div>
                          <div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-2">
                              {sub.service.type || 'Unknown Plan'}
                            </h2>
                            {getStatusBadge(sub.isActive)}
                          </div>
                        </div>

                        <div className="text-right">
                          <div
                            className={`inline-flex items-center px-6 py-3 rounded-2xl bg-gradient-to-r ${getPlanGradient(
                              sub.service.type,
                            )} text-white shadow-lg`}
                          >
                            <DollarSign size={20} className="mr-1" />
                            <span className="text-2xl font-bold">
                              {sub.payable}
                            </span>
                            <span className="text-sm opacity-80 ml-1">
                              /month
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl border border-blue-100">
                          <div className="flex items-center mb-3">
                            <Calendar
                              className="text-blue-500 mr-3"
                              size={20}
                            />
                            <p className="font-semibold text-blue-800">
                              Subscribed On
                            </p>
                          </div>
                          <p className="text-lg font-bold text-gray-800">
                            {formatDate(enrollDate)}
                          </p>
                          <p className="text-sm text-blue-600 mt-1">
                            {daysSinceEnroll} days ago
                          </p>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100">
                          <div className="flex items-center mb-3">
                            <Clock className="text-green-500 mr-3" size={20} />
                            <p className="font-semibold text-green-800">
                              Days Active
                            </p>
                          </div>
                          <p className="text-lg font-bold text-gray-800">
                            {daysSinceEnroll} days
                          </p>
                          <p className="text-sm text-green-600 mt-1">
                            Since enrollment
                          </p>
                        </div>

                        <div
                          className={`bg-gradient-to-br ${
                            isExpired
                              ? 'from-red-50 to-pink-50'
                              : 'from-purple-50 to-indigo-50'
                          } p-6 rounded-2xl border ${
                            isExpired ? 'border-red-100' : 'border-purple-100'
                          }`}
                        >
                          <div className="flex items-center mb-3">
                            <Calendar
                              className={`${
                                isExpired ? 'text-red-500' : 'text-purple-500'
                              } mr-3`}
                              size={20}
                            />
                            <p
                              className={`font-semibold ${
                                isExpired ? 'text-red-800' : 'text-purple-800'
                              }`}
                            >
                              Expires On
                            </p>
                          </div>
                          <p className="text-lg font-bold text-gray-800">
                            {formatDate(expireDate)}
                          </p>
                          <p
                            className={`text-sm mt-1 ${
                              isExpired ? 'text-red-600' : 'text-purple-600'
                            }`}
                          >
                            {isExpired
                              ? `${Math.abs(daysToExpire)} days ago`
                              : `in ${daysToExpire} days`}
                          </p>
                        </div>
                      </div>

                      {/* Action Button */}
                      {isExpired && (
                        <div className="flex justify-center">
                          <button
                            onClick={(e) => handleSubscribe(sub)}
                            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 px-8 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center font-semibold"
                          >
                            <RefreshCw size={18} className="mr-2" />
                            Renew Plan
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
