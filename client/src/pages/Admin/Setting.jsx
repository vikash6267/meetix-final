"use client"
import { useState, useEffect } from "react"
import axios from "axios"
import {
  Eye,
  EyeOff,
  User,
  Phone,
  Building,
  Mail,
  Lock,
  Save,
  Key,
  CheckCircle,
  XCircle
} from "lucide-react"
import Sidebar from "../../components/Layouts/SideNav"
import Header from "../../components/Layouts/SidebarHeader"



const Setting = () => {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [profileLoading, setProfileLoading] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false)
  const [userInfo, setUserInfo] = useState({
    username: "",
    phone: "",
    company: ""
  })

  // Parse user data from localStorage
  const [user, setUser] = useState(null)

 
  const storedUser = localStorage.getItem("user");
      const parsedUser = JSON.parse(storedUser);

useEffect(() => {

  if (storedUser) {
    try {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser) {
      

        // Call API to get the latest profile
        fetch(`https://meetix.mahitechnocrafts.in/api/v1/user/myprofile/${parsedUser._id}`)
          .then((res) => res.json())
          .then((data) => {
            setUserInfo({
              username: data.username || "",
              phone: data.phone || "",
              company: data.company || ""
            });
          })
          .catch((error) => {
            console.error("Error fetching profile from API:", error);
            // fallback to local data
            // setUserInfo({
            //   username: parsedUser.username || "",
            //   phone: parsedUser.phone || "",
            //   company: parsedUser.company || ""
            // });
          });
      } else {
        setUserInfo({ username: "", phone: "", company: "" });
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      setUserInfo({ username: "", phone: "", company: "" });
    }
  } else {
    setUserInfo({ username: "", phone: "", company: "" });
  }
}, []);


  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const handleInputChange = (field, value) => {
    setUserInfo(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleProfileUpdate = async e => {
    e.preventDefault()
    setMessage({ type: "", text: "" })
    setProfileLoading(true)
console.log(storedUser)
    try {
      const parsedUser = JSON.parse(storedUser);
      const res = await axios.put(
        `https://meetix.mahitechnocrafts.in/api/v1/user/update-profile`,
        {
          userId: parsedUser?._id || parsedUser?.id,
          ...userInfo
        }
      )

      // Update localStorage with new user info
      const updatedUser = { ...user, ...userInfo }
    
      setUser(updatedUser)

      setMessage({
        type: "success",
        text: res.data.message || "Profile updated successfully!"
      })
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Error updating profile."
      })
    } finally {
      setProfileLoading(false)
    }
  }

  const handleChangePassword = async e => {
    e.preventDefault()
    setMessage({ type: "", text: "" })

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return setMessage({ type: "error", text: "All fields are required." })
    }

    if (newPassword !== confirmNewPassword) {
      return setMessage({ type: "error", text: "New passwords don't match." })
    }

    if (newPassword.length < 6) {
      return setMessage({
        type: "error",
        text: "New password must be at least 6 characters long."
      })
    }

    try {
      setLoading(true)
      const userId = user?._id || user?.id

      if (!userId) {
        return setMessage({
          type: "error",
          text: "User ID not found. Please log in again."
        })
      }

      const response = await axios.post(
        "https://meetix.mahitechnocrafts.in/user/api/v1/change-password",
        {
          userId,
          currentPassword,
          newPassword
        }
      )

      setMessage({
        type: "success",
        text: response.data.message || "Password changed successfully!"
      })

      // Clear form fields on success
      setCurrentPassword("")
      setNewPassword("")
      setConfirmNewPassword("")
    } catch (error) {
      console.log(error)
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Something went wrong. Please try again later."
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} name="Account Settings" />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Alert Messages */}
            {message.text && (
              <div
                className={`flex items-center gap-3 p-4 rounded-lg border ${
                  message.type === "error"
                    ? "bg-red-50 border-red-200 text-red-800"
                    : "bg-green-50 border-green-200 text-green-800"
                }`}
              >
                {message.type === "error" ? (
                  <XCircle className="h-5 w-5 flex-shrink-0" />
                ) : (
                  <CheckCircle className="h-5 w-5 flex-shrink-0" />
                )}
                <span className="font-medium">{message.text}</span>
              </div>
            )}

            {/* Profile Information Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      Profile Information
                    </h2>
                    <p className="text-blue-100 text-sm">
                      Update your personal information and contact details
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div className="space-y-2">
                      <label
                        htmlFor="username"
                        className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                      >
                        <User className="h-4 w-4 text-gray-500" />
                        Full Name
                      </label>
                      <input
                        id="username"
                        type="text"
                        value={userInfo.username}
                        onChange={e =>
                          handleInputChange("username", e.target.value)
                        }
                        placeholder="Enter your full name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                      />
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-2">
                      <label
                        htmlFor="phone"
                        className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                      >
                        <Phone className="h-4 w-4 text-gray-500" />
                        Phone Number
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        value={userInfo.phone}
                        onChange={e =>
                          handleInputChange("phone", e.target.value)
                        }
                        placeholder="Enter your phone number"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                      />
                    </div>

                    {/* Company Name */}
                    <div className="space-y-2">
                      <label
                        htmlFor="company"
                        className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                      >
                        <Building className="h-4 w-4 text-gray-500" />
                        Company Name
                      </label>
                      <input
                        id="company"
                        type="text"
                        value={userInfo.company}
                        onChange={e =>
                          handleInputChange("company", e.target.value)
                        }
                        placeholder="Enter your company name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                      />
                    </div>

                    {/* Email Address */}
                    <div className="space-y-2">
                      <label
                        htmlFor="email"
                        className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                      >
                        <Mail className="h-4 w-4 text-gray-500" />
                        Email Address
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                          Read Only
                        </span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={parsedUser?.email || ""}
                        disabled
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Lock className="h-3 w-3" />
                        To change your email address, please contact our support
                        team.
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-gray-100">
                    <button
                      type="submit"
                      disabled={profileLoading}
                      className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                        profileLoading
                          ? "bg-blue-400 cursor-not-allowed text-white"
                          : "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg"
                      }`}
                    >
                      {profileLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Password Change Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Key className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      Change Password
                    </h2>
                    <p className="text-purple-100 text-sm">
                      Update your password to keep your account secure
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <form onSubmit={handleChangePassword} className="space-y-6">
                  {/* Current Password */}
                  <div className="space-y-2">
                    <label
                      htmlFor="currentPassword"
                      className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                    >
                      <Lock className="h-4 w-4 text-gray-500" />
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        id="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={e => setCurrentPassword(e.target.value)}
                        placeholder="Enter your current password"
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white"
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div className="space-y-2">
                    <label
                      htmlFor="newPassword"
                      className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                    >
                      <Lock className="h-4 w-4 text-gray-500" />
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        placeholder="Enter your new password"
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white"
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm New Password */}
                  <div className="space-y-2">
                    <label
                      htmlFor="confirmNewPassword"
                      className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                    >
                      <Lock className="h-4 w-4 text-gray-500" />
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        id="confirmNewPassword"
                        type={showConfirmNewPassword ? "text" : "password"}
                        value={confirmNewPassword}
                        onChange={e => setConfirmNewPassword(e.target.value)}
                        placeholder="Confirm your new password"
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white"
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        onClick={() =>
                          setShowConfirmNewPassword(!showConfirmNewPassword)
                        }
                      >
                        {showConfirmNewPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Password Requirements */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Password Requirements:
                    </h4>
                    <ul className="text-sm text-blue-800 space-y-1 ml-6">
                      <li className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
                        At least 6 characters long
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
                        Must be different from your current password
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
                        Should contain a mix of letters and numbers
                      </li>
                    </ul>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-gray-100">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                        loading
                          ? "bg-purple-400 cursor-not-allowed text-white"
                          : "bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg"
                      }`}
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          Updating...
                        </>
                      ) : (
                        <>
                          <Key className="h-4 w-4" />
                          Change Password
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Setting
