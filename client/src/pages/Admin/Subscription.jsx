'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Layouts/SideNav';
import Header from '../../components/Layouts/SidebarHeader';
import { BASE_URL } from '../../services/apis';

const SubscriptionDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [subscriptions, setSubscriptions] = useState([]);
  const [filteredSubscriptions, setFilteredSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('type');
  const [formLoading, setFormLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    type: '',
    description: '',
    rate: '',
    totalAmount: '',
    limit: '',
    isActive: true,
    startDate: '',
    whopPlanId: '',
    endDate: '',
  });

  const [formErrors, setFormErrors] = useState({});

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const openSubscriptionModal = (subscription) => {
    setSelectedSubscription(subscription);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSubscription(null);
  };

  const openAddModal = () => {
    setIsEditing(false);
    setFormData({
      type: '',
      description: '',
      rate: '',
      totalAmount: '',
      limit: '',
      isActive: true,
      startDate: '',
      whopPlanId: '',
      endDate: '',
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  const openEditModal = (subscription) => {
    setIsEditing(true);
    setFormData({
      type: subscription.type,
      description: subscription.description,
      whopPlanId: subscription?.whopPlanId || '',
      rate: subscription.rate.toString(),
      totalAmount: subscription.totalAmount.toString(),
      limit: subscription.limit.toString(),
      isActive: subscription.isActive,
      startDate: subscription.startDate.split('T')[0],
      endDate: subscription.endDate.split('T')[0],
    });
    setFormErrors({});
    setSelectedSubscription(subscription);
    setIsFormModalOpen(true);
  };

  const closeFormModal = () => {
    setIsFormModalOpen(false);
    setIsEditing(false);
    setSelectedSubscription(null);
    setFormData({
      type: '',
      description: '',
      rate: '',
      totalAmount: '',
      limit: '',
      whopPlanId: '',
      isActive: true,
      startDate: '',
      endDate: '',
    });
    setFormErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.type.trim()) errors.type = 'Plan type is required';
    if (!formData.description.trim())
      errors.description = 'Description is required';
    if (!formData.whopPlanId.trim()) errors.description = 'Whop Id is required';
    // if (!formData.rate || Number.parseFloat(formData.rate) < 0) errors.rate = "Valid rate is required"
    if (!formData.totalAmount || Number.parseFloat(formData.totalAmount) < 0)
      errors.totalAmount = 'Valid total amount is required';
    if (!formData.limit || Number.parseInt(formData.limit) < 0)
      errors.limit = 'Valid limit is required';
    // if (!formData.startDate) errors.startDate = "Start date is required"
    // if (!formData.endDate) errors.endDate = "End date is required"

    // if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
    //   errors.endDate = "End date must be after start date"
    // }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setFormLoading(true);

    try {
      const submitData = {
        ...formData,
        rate: Number.parseFloat(formData.totalAmount),
        totalAmount: Number.parseFloat(formData.totalAmount),
        limit: Number.parseInt(formData.limit),
      };

      if (isEditing) {
        await axios.post(
          `${BASE_URL}/subscription/edit/${selectedSubscription._id}`,
          submitData,
        );
        // Update local state
        setSubscriptions((prev) =>
          prev.map((sub) =>
            sub._id === selectedSubscription._id
              ? { ...sub, ...submitData }
              : sub,
          ),
        );
      } else {
        const response = await axios.post(
          `${BASE_URL}/subscription/maincreate`,
          submitData,
        );
        // Add to local state
        setSubscriptions((prev) => [...prev, response.data.subscription]);
      }

      closeFormModal();
      // Show success message (you can implement toast notifications)
      alert(
        isEditing
          ? 'Subscription updated successfully!'
          : 'Subscription created successfully!',
      );
    } catch (error) {
      console.error('Failed to save subscription:', error);
      alert('Failed to save subscription. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (subscriptionId) => {
    if (
      !confirm(
        'Are you sure you want to delete this subscription? This action cannot be undone.',
      )
    ) {
      return;
    }

    try {
      await axios.delete(`${BASE_URL}/subscription/${subscriptionId}`);
      setSubscriptions((prev) =>
        prev.filter((sub) => sub._id !== subscriptionId),
      );
      closeModal();
      alert('Subscription deleted successfully!');
    } catch (error) {
      console.error('Failed to delete subscription:', error);
      alert('Failed to delete subscription. Please try again.');
    }
  };

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/subscription/all`);
        console.log(res.data.subscriptions);
        setSubscriptions(res.data.subscriptions);
        setFilteredSubscriptions(res.data.subscriptions);
      } catch (error) {
        console.error('Failed to fetch subscriptions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  // Filter and Search Logic
  useEffect(() => {
    let filtered = subscriptions;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (sub) =>
          sub.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sub.description.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Type filter
    if (filterType !== 'all') {
      if (filterType === 'active') {
        filtered = filtered.filter((sub) => sub.isActive);
      } else if (filterType === 'inactive') {
        filtered = filtered.filter((sub) => !sub.isActive);
      } else {
        filtered = filtered.filter(
          (sub) => sub.type.toLowerCase() === filterType.toLowerCase(),
        );
      }
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'type':
          return a.type.localeCompare(b.type);
        case 'price':
          return b.rate - a.rate;
        case 'users':
          return b.usersEnroled.length - a.usersEnroled.length;
        case 'date':
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

    setFilteredSubscriptions(filtered);
  }, [subscriptions, searchTerm, filterType, sortBy]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getSubscriptionColor = (type) => {
    switch (type.toLowerCase()) {
      case 'free':
        return 'from-green-400 to-green-600';
      case 'pro':
        return 'from-blue-400 to-blue-600';
      case 'business':
        return 'from-purple-400 to-purple-600';
      default:
        return 'from-gray-400 to-gray-600';
    }
  };

  const getStatusColor = (isActive) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const totalUsers = subscriptions.reduce(
    (sum, sub) => sum + sub.usersEnroled.length,
    0,
  );
  const activeSubscriptions = subscriptions.filter(
    (sub) => sub.isActive,
  ).length;
  const totalRevenue = subscriptions.reduce(
    (sum, sub) =>
      sum + sub.usersEnroled.length * Number.parseFloat(sub.rate || 0),
    0,
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header toggleSidebar={toggleSidebar} name="Subscription Management" />

        {/* Dashboard Content */}
        <div className="flex-1 overflow-auto p-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 mr-4">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">
                    {subscriptions.length}
                  </p>
                  <p className="text-sm text-gray-500">Total Plans</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 mr-4">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">
                    {totalUsers}
                  </p>
                  <p className="text-sm text-gray-500">Total Users</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 mr-4">
                  <svg
                    className="w-6 h-6 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">
                    {activeSubscriptions}
                  </p>
                  <p className="text-sm text-gray-500">Active Plans</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100 mr-4">
                  <svg
                    className="w-6 h-6 text-yellow-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">
                    ${totalRevenue.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">Total Revenue</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <svg
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search subscriptions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Add New Button */}
              <button
                onClick={openAddModal}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add New Plan
              </button>

              {/* Filter Buttons */}
              <div className="flex flex-wrap gap-2">
                {['all', 'free', 'pro', 'business', 'active', 'inactive'].map(
                  (filter) => (
                    <button
                      key={filter}
                      onClick={() => setFilterType(filter)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        filterType === filter
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </button>
                  ),
                )}
              </div>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="type">Sort by Type</option>
                <option value="price">Sort by Price</option>
                <option value="users">Sort by Users</option>
                <option value="date">Sort by Date</option>
              </select>
            </div>
          </div>

          {/* Subscription Cards */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSubscriptions.map((subscription) => (
                <div
                  key={subscription._id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden group"
                >
                  {/* Card Header */}
                  <div
                    className={`h-2 bg-gradient-to-r ${getSubscriptionColor(subscription.type)}`}
                  ></div>

                  <div className="p-6">
                    {/* Plan Type and Status */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-4">
                      {/* Title and status */}
                      <div className="flex flex-col gap-1 max-w-full sm:max-w-[60%]">
                        <h3 className="text-xl font-bold text-gray-800 break-words">
                          {subscription.type}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium w-max ${getStatusColor(subscription.isActive)}`}
                        >
                          {subscription.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditModal(subscription);
                          }}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          title="Edit"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openSubscriptionModal(subscription);
                          }}
                          className="p-1 text-gray-600 hover:bg-gray-50 rounded"
                          title="View Details"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="mb-4">
                      <span className="text-3xl font-bold text-gray-800">
                        ${subscription.rate}
                      </span>
                      <span className="text-gray-500 ml-1">/month</span>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {subscription.description}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">
                          {subscription.usersEnroled.length}
                        </p>
                        <p className="text-xs text-gray-500">Enrolled Users</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">
                          $
                          {(
                            subscription.usersEnroled.length *
                            Number.parseFloat(subscription.rate || 0)
                          ).toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500">Revenue</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">
                          {subscription.limit}
                        </p>
                        <p className="text-xs text-gray-500">Limit/Per Meet</p>
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="text-xs text-gray-500 space-y-1">
                      <p>
                        <span className="font-medium">Created:</span>{' '}
                        {formatDate(subscription.createdAt)}
                      </p>
                      <p>
                        <span className="font-medium">Period:</span>{' '}
                        {formatDate(subscription.startDate)} -{' '}
                        {formatDate(subscription.endDate)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredSubscriptions.length === 0 && !loading && (
            <div className="text-center py-12">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-gray-500 text-lg">No subscriptions found</p>
              <p className="text-gray-400 text-sm">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Form Modal */}
      {isFormModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">
                  {isEditing
                    ? 'Edit Subscription Plan'
                    : 'Add New Subscription Plan'}
                </h2>
                <button
                  onClick={closeFormModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Plan Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plan Type *
                  </label>
                  <input
                    type="text"
                    name="type"
                    value={formData.type}
                    maxLength={25}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.type ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., Free, Pro, Business"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.type.length}/25 characters
                  </p>
                  {formErrors.type && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.type}
                    </p>
                  )}
                </div>

                {/* Total Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Amount ($) *
                  </label>
                  <input
                    type="number"
                    name="totalAmount"
                    value={formData.totalAmount}
                    onChange={handleInputChange}
                    max="99999999"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.totalAmount
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                    placeholder="0.00"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {String(formData.totalAmount).length}/8 digits
                  </p>
                  {formErrors.totalAmount && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.totalAmount}
                    </p>
                  )}
                </div>

                {/* Limit */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Limit (Per Meeting) *
                  </label>
                  <input
                    type="number"
                    name="limit"
                    value={formData.limit}
                    onChange={handleInputChange}
                    max="999999"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.limit ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {String(formData.limit).length}/6 digits
                  </p>
                  {formErrors.limit && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.limit}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Whop ID*
                  </label>
                  <input
                    name="whopPlanId"
                    value={formData.whopPlanId}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.whopPlanId
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                    placeholder="0"
                  />
                  {formErrors.whopPlanId && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.whopPlanId}
                    </p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formErrors.description
                      ? 'border-red-500'
                      : 'border-gray-300'
                  }`}
                  placeholder="Describe the features and benefits of this plan..."
                />
                {formErrors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.description}
                  </p>
                )}
              </div>

              {/* Active Status */}
              <div className="mt-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Active Plan
                  </span>
                </label>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeFormModal}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {formLoading && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  )}
                  {isEditing ? 'Update Plan' : 'Create Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {isModalOpen && selectedSubscription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className={`w-4 h-4 rounded-full bg-gradient-to-r ${getSubscriptionColor(selectedSubscription.type)} mr-3`}
                  ></div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {selectedSubscription.type} Plan Details
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      closeModal();
                      openEditModal(selectedSubscription);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(selectedSubscription._id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm flex items-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Delete
                  </button>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Plan Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6">
                  <h3 className="font-semibold text-blue-800 mb-2">
                    Plan Details
                  </h3>
                  <p className="text-3xl font-bold text-blue-900 mb-1">
                    ${selectedSubscription.rate}
                  </p>
                  <p className="text-blue-700 text-sm">per month</p>
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${getStatusColor(selectedSubscription.isActive)}`}
                  >
                    {selectedSubscription.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6">
                  <h3 className="font-semibold text-green-800 mb-2">
                    Enrolled Users
                  </h3>
                  <p className="text-3xl font-bold text-green-900 mb-1">
                    {selectedSubscription.usersEnroled.length}
                  </p>
                  <p className="text-green-700 text-sm">total subscribers</p>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6">
                  <h3 className="font-semibold text-purple-800 mb-2">
                    Total Revenue
                  </h3>
                  <p className="text-3xl font-bold text-purple-900 mb-1">
                    $
                    {(
                      selectedSubscription.usersEnroled.length *
                      Number.parseFloat(selectedSubscription.rate || 0)
                    ).toFixed(2)}
                  </p>
                  <p className="text-purple-700 text-sm">from this plan</p>
                </div>
              </div>

              {/* Plan Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-800 mb-4">
                    Plan Information
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-600">
                        Plan ID:
                      </span>
                      <p className="text-gray-800 font-mono text-sm">
                        {selectedSubscription._id}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">
                        Description:
                      </span>
                      <p className="text-gray-800">
                        {selectedSubscription.description}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">
                        Total Amount:
                      </span>
                      <p className="text-gray-800">
                        ${selectedSubscription.totalAmount}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">
                        Meeting Limit:
                      </span>
                      <p className="text-gray-800">
                        {selectedSubscription.limit} per meeting
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-800 mb-4">Timeline</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-600">
                        Created:
                      </span>
                      <p className="text-gray-800">
                        {formatDateTime(selectedSubscription.createdAt)}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">
                        Start Date:
                      </span>
                      <p className="text-gray-800">
                        {formatDateTime(selectedSubscription.startDate)}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">
                        End Date:
                      </span>
                      <p className="text-gray-800">
                        {formatDateTime(selectedSubscription.endDate)}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">
                        Last Updated:
                      </span>
                      <p className="text-gray-800">
                        {formatDateTime(selectedSubscription.updatedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enrolled Users */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-4">
                  Enrolled Users ({selectedSubscription.usersEnroled.length})
                </h4>
                {selectedSubscription.usersEnroled.length > 0 ? (
                  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              User ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Enrollment Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Expiration Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Amount Paid
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Transaction ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {selectedSubscription.usersEnroled.map(
                            (user, index) => {
                              const isExpired =
                                new Date(user.expirationDate) < new Date();
                              return (
                                <tr key={index} className="hover:bg-gray-50">
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                                    {user?.user?.username || 'N/A'}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {formatDateTime(user.enrollmentDate)}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {formatDateTime(user.expirationDate)}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    ${user.payable}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                                    {user.transaction_id}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span
                                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                        isExpired
                                          ? 'bg-red-100 text-red-800'
                                          : 'bg-green-100 text-green-800'
                                      }`}
                                    >
                                      {isExpired ? 'Expired' : 'Active'}
                                    </span>
                                  </td>
                                </tr>
                              );
                            },
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-xl">
                    <svg
                      className="w-12 h-12 mx-auto mb-4 text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                      />
                    </svg>
                    <p className="text-gray-500">No users enrolled yet</p>
                    <p className="text-gray-400 text-sm">
                      Users will appear here when they subscribe to this plan
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionDashboard;
