"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import Sidebar from "../../components/Layouts/SideNav"
import Header from "../../components/Layouts/SidebarHeader"
import { BASE_URL } from "../../services/apis"
import RoleChangePopup from "./RoleChangePopup"

const EnhancedUserDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [viewMode, setViewMode] = useState("grid") // grid or list

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const openUserModal = (user) => {
    setSelectedUser(user)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedUser(null)
  }

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/subscription/users`)
        console.log(res.data.data)
        setUsers(res.data.data)
        setFilteredUsers(res.data.data)
      } catch (error) {
        console.error("Failed to fetch users:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  // Filter, Search, and Sort Logic
  useEffect(() => {
    let filtered = users
console.log(users)
console.log(filterType)
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user._id?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Type filter
    if (filterType !== "all") {
      switch (filterType) {
        case "admin":
       filtered = filtered.filter((user) => user.isAdmin == "true")

        case "regular":
          filtered = filtered.filter((user) => user.isAdmin !== "true")
          break
        case "active-subscription":
          filtered = filtered.filter((user) => user.subscriptions?.some((sub) => sub.isActive))
          break
        case "no-subscription":
          filtered = filtered.filter((user) => !user.subscriptions || user.subscriptions.length === 0)
          break
        case "has-meetings":
          filtered = filtered.filter((user) => user.meetings && user.meetings.length > 0)
          break
        case "no-meetings":
          filtered = filtered.filter((user) => !user.meetings || user.meetings.length === 0)
          break
        case "recent":
          const oneWeekAgo = new Date()
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
          filtered = filtered.filter((user) => new Date(user.createdAt) > oneWeekAgo)
          break
      }
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return (a.username || "").localeCompare(b.username || "")
        case "email":
          return (a.email || "").localeCompare(b.email || "")
        case "date":
          return new Date(b.createdAt) - new Date(a.createdAt)
        case "meetings":
          return (b.meetings?.length || 0) - (a.meetings?.length || 0)
        case "subscriptions":
          return (b.subscriptions?.length || 0) - (a.subscriptions?.length || 0)
        default:
          return 0
      }
    })

    setFilteredUsers(filtered)
  }, [users, searchTerm, filterType, sortBy])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getUserInitials = (username) => {
    if (!username) return "U"
    return username
      .split(" ")
      .map((name) => name.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getRandomGradient = (index) => {
    const gradients = [
      "from-blue-400 to-blue-600",
      "from-purple-400 to-purple-600",
      "from-pink-400 to-pink-600",
      "from-green-400 to-green-600",
      "from-yellow-400 to-yellow-600",
      "from-red-400 to-red-600",
      "from-indigo-400 to-indigo-600",
      "from-teal-400 to-teal-600",
    ]
    return gradients[index % gradients.length]
  }

  // Statistics
  const totalUsers = users.length
  const adminUsers = users.filter((user) => user.isAdmin === "true").length
  const usersWithSubscriptions = users.filter((user) => user.subscriptions?.length > 0).length
  const usersWithMeetings = users.filter((user) => user.meetings?.length > 0).length
  const recentUsers = users.filter((user) => {
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    return new Date(user.createdAt) > oneWeekAgo
  }).length

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header toggleSidebar={toggleSidebar} name="User Management" />

        {/* Dashboard Content */}
        <div className="flex-1 overflow-auto p-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="p-2 rounded-xl bg-gradient-to-r from-blue-400 to-blue-600 mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-800">{totalUsers}</p>
                  <p className="text-xs text-gray-500">Total Users</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="p-2 rounded-xl bg-gradient-to-r from-red-400 to-red-600 mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-800">{adminUsers}</p>
                  <p className="text-xs text-gray-500">Admins</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="p-2 rounded-xl bg-gradient-to-r from-green-400 to-green-600 mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-800">{usersWithSubscriptions}</p>
                  <p className="text-xs text-gray-500">Subscribed</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="p-2 rounded-xl bg-gradient-to-r from-purple-400 to-purple-600 mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-800">{usersWithMeetings}</p>
                  <p className="text-xs text-gray-500">Active</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="p-2 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-600 mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-800">{recentUsers}</p>
                  <p className="text-xs text-gray-500">New (7d)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search, Filters, and Controls */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border border-gray-100">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <svg
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
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
                    placeholder="Search users by name, email, or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Filter Buttons */}
              <div className="flex flex-wrap gap-2">
                {[
                  { key: "all", label: "All Users", icon: "👥" },
                  { key: "admin", label: "Admins", icon: "👑" },
                  { key: "regular", label: "Regular", icon: "👤" },
                  { key: "active-subscription", label: "Subscribed", icon: "💳" },
                  { key: "no-subscription", label: "Free", icon: "🆓" },
                  { key: "has-meetings", label: "Active", icon: "📹" },
                  { key: "no-meetings", label: "Inactive", icon: "😴" },
                  { key: "recent", label: "New", icon: "✨" },
                ].map((filter) => (
                  <button
                    key={filter.key}
                    onClick={() => setFilterType(filter.key)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                      filterType === filter.key
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <span>{filter.icon}</span>
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort and View Controls */}
            {/* <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="name">Sort by Name</option>
                  <option value="email">Sort by Email</option>
                  <option value="date">Sort by Join Date</option>
                  <option value="meetings">Sort by Meetings</option>
                  <option value="subscriptions">Sort by Subscriptions</option>
                </select>

                <div className="text-sm text-gray-500">
                  Showing {filteredUsers.length} of {totalUsers} users
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "grid" ? "bg-blue-100 text-blue-600" : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "list" ? "bg-blue-100 text-blue-600" : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 10h16M4 14h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>
            </div> */}
          </div>

          {/* User Display */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
                <div className="absolute inset-0 rounded-full border-2 border-gray-200"></div>
              </div>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredUsers.map((user, index) => (
                <div
                  key={user._id}
                  onClick={() => openUserModal(user)}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 border border-gray-100 overflow-hidden group"
                >
                  {/* Card Header with Gradient */}
                  <div className={`h-20 bg-gradient-to-r ${getRandomGradient(index)} relative`}>
                    <div className="absolute inset-0 bg-black bg-opacity-10"></div>
                    {user.isAdmin === "true" && (
                      <div className="absolute top-3 right-3">
                        <span className="bg-white bg-opacity-20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full font-medium">
                          👑 Admin
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-6 -mt-8 relative">
                    {/* User Avatar */}
                    <div
                      className={`w-16 h-16 bg-gradient-to-r ${getRandomGradient(index)} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg border-4 border-white`}
                    >
                      <span className="text-white text-xl font-bold">{getUserInitials(user.username)}</span>
                    </div>

                    {/* User Info */}
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-bold text-gray-800 mb-1 truncate group-hover:text-blue-600 transition-colors">
                        {user.username || "Unknown User"}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2 truncate">{user.email}</p>
                      <p className="text-xs text-gray-400">Joined {formatDate(user.createdAt)}</p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
                        <p className="text-xl font-bold text-blue-600">{user.meetings?.length || 0}</p>
                        <p className="text-xs text-blue-700">Meetings</p>
                      </div>
                      <div className="text-center p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-xl">
                        <p className="text-xl font-bold text-green-600">{user.subscriptions?.length || 0}</p>
                        <p className="text-xs text-green-700">Plans</p>
                      </div>
                    </div>

                    {/* Activity Indicator */}
                    <div className="mt-4 flex items-center justify-center">
                      {user.subscriptions?.some((sub) => sub.isActive) ? (
                        <span className="flex items-center text-xs text-green-600">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                          Active Subscription
                        </span>
                      ) : user.meetings?.length > 0 ? (
                        <span className="flex items-center text-xs text-blue-600">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                          Has Meetings
                        </span>
                      ) : (
                        <span className="flex items-center text-xs text-gray-400">
                          <div className="w-2 h-2 bg-gray-300 rounded-full mr-2"></div>
                          New User
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Meetings
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Subscriptions
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredUsers.map((user, index) => (
                      <tr
                        key={user._id}
                        onClick={() => openUserModal(user)}
                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div
                              className={`w-10 h-10 bg-gradient-to-r ${getRandomGradient(index)} rounded-xl flex items-center justify-center mr-3`}
                            >
                              <span className="text-white text-sm font-bold">{getUserInitials(user.username)}</span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{user.username || "Unknown"}</div>
                              <div className="text-xs text-gray-500">{user._id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {user.isAdmin === "true" ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              👑 Admin
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              👤 User
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-semibold text-blue-600">{user.meetings?.length || 0}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-semibold text-green-600">
                            {user.subscriptions?.length || 0}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {user.subscriptions?.some((sub) => sub.isActive) ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              🟢 Active
                            </span>
                          ) : user.meetings?.length > 0 ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              🔵 Has Activity
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              ⚪ New
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {filteredUsers.length === 0 && !loading && (
            <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No users found</h3>
                <p className="text-gray-500 mb-4">
                  Try adjusting your search or filter criteria to find what you're looking for.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("")
                    setFilterType("all")
                  }}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Modal */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-6 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl flex items-center justify-center mr-4">
                    <span className="text-white text-xl font-bold">{getUserInitials(selectedUser.username)}</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedUser.username}</h2>
                    <p className="text-blue-100">{selectedUser.email}</p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-xl transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-8">
              {/* User Profile Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6">
                  <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Account Info
                  </h3>
                  <div className="space-y-2">
                    <p className="text-sm text-blue-700">
                      <span className="font-medium">User ID:</span>
                      <br />
                      <span className="font-mono text-xs">{selectedUser._id}</span>
                    </p>
                    <p className="text-sm text-blue-700">
                      <span className="font-medium">Role:</span> {selectedUser.isAdmin === "true" ? "Admin" : "User"}
                    </p>
                    <p className="text-sm text-blue-700">
                      <span className="font-medium">Joined:</span> {formatDate(selectedUser.createdAt)}
                    </p>
                  </div>

 <RoleChangePopup selectedUser={selectedUser} setSelectedUser={setSelectedUser} />


                </div>

                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-6">
                  <h3 className="font-semibold text-green-800 mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    Meeting Activity
                  </h3>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-800 mb-1">{selectedUser.meetings?.length || 0}</p>
                    <p className="text-sm text-green-700">Total Meetings</p>
                    {selectedUser.meetings?.length > 0 && (
                      <p className="text-xs text-green-600 mt-2">
                        Latest: {formatDate(selectedUser.meetings[selectedUser.meetings.length - 1]?.joinedAt)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl p-6">
                  <h3 className="font-semibold text-purple-800 mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Subscriptions
                  </h3>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-purple-800 mb-1">{selectedUser.subscriptions?.length || 0}</p>
                    <p className="text-sm text-purple-700">Active Plans</p>
                    <p className="text-xs text-purple-600 mt-2">
                      {selectedUser.subscriptions?.some((sub) => sub.isActive) ? "Has Active Plan" : "No Active Plans"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Subscriptions Details */}
              <div className="mb-8">
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center text-lg">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Subscription Details
                </h4>
                {selectedUser.subscriptions?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedUser.subscriptions.map((sub, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h5 className="font-bold text-lg text-gray-800">{sub.service?.type || "Unknown Plan"}</h5>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              sub.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}
                          >
                            {sub.isActive ? "🟢 Active" : "🔴 Inactive"}
                          </span>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600">
                          <p>
                            <span className="font-medium">Amount:</span> ${sub.service?.rate || sub.payable || "N/A"}
                          </p>
                          <p>
                            <span className="font-medium">Start:</span>{" "}
                            {sub.service?.startDate ? formatDateTime(sub.service.startDate) : "N/A"}
                          </p>
                          <p>
                            <span className="font-medium">End:</span>{" "}
                            {sub.service?.endDate ? formatDateTime(sub.service.endDate) : "N/A"}
                          </p>
                          {sub.service?.description && (
                            <p className="text-gray-500 italic mt-3">{sub.service.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-2xl">
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
                    <p className="text-gray-400 text-sm">This user hasn't subscribed to any plans yet</p>
                  </div>
                )}
              </div>

              {/* Meeting History Summary */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center text-lg">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  Meeting Activity Summary
                </h4>
                {selectedUser.meetings?.length > 0 ? (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-100 rounded-2xl p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                      <div>
                        <p className="text-3xl font-bold text-blue-600">{selectedUser.meetings.length}</p>
                        <p className="text-sm text-blue-700">Total Meetings</p>
                      </div>
                      <div>
                        <p className="text-3xl font-bold text-indigo-600">
                          {new Set(selectedUser.meetings.map((m) => m.roomId)).size}
                        </p>
                        <p className="text-sm text-indigo-700">Unique Rooms</p>
                      </div>
                      <div>
                        <p className="text-3xl font-bold text-purple-600">
                          {selectedUser.meetings.length > 0
                            ? formatDate(selectedUser.meetings[selectedUser.meetings.length - 1]?.joinedAt)
                            : "N/A"}
                        </p>
                        <p className="text-sm text-purple-700">Last Activity</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-2xl">
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
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-gray-500 text-lg">No meeting activity</p>
                    <p className="text-gray-400 text-sm">This user hasn't joined any meetings yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EnhancedUserDashboard
