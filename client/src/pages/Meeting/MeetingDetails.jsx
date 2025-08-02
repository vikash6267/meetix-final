"use client"

import { useState, useEffect } from "react"
import Sidebar from "../../components/Layouts/SideNav"
import Header from "../../components/Layouts/SidebarHeader"
import { getUserMeetings, getRoomDetails } from "../../services/operations/user"
import moment from "moment"

const MeetingDetails = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [meetings, setMeetings] = useState([])
  const [filteredMeetings, setFilteredMeetings] = useState([])
  const [selectedRoomId, setSelectedRoomId] = useState(null)
  const [roomDetails, setRoomDetails] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("joinedAt")
  const [sortOrder, setSortOrder] = useState("desc")
  const [dateFilter, setDateFilter] = useState("all")
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("messages")
  const [showModal, setShowModal] = useState(false)

  const storedUser = localStorage.getItem("user")
  const user = storedUser ? JSON.parse(storedUser) : null

  const [page, setPage] = useState(1)
const [hasMore, setHasMore] = useState(true)

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

useEffect(() => {
  if (!user?._id) return;

  const fetchMeetings = async () => {
    setLoading(true);
    const res = await getUserMeetings(user._id, user.token, page);  // ✅ page pass
    if (res?.meetings?.length) {
      setMeetings((prev) => [...prev, ...res.meetings]);
      setHasMore(page < res.totalPages);  // ✅ check if more pages are available
    } else {
      setHasMore(false);
    }
    setLoading(false);
  };

  fetchMeetings();
}, [page]);
  // Filter and sort meetings
  useEffect(() => {
    let filtered = [...meetings]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((meeting) => meeting.roomId.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    // Date filter
    const now = moment()
    if (dateFilter !== "all") {
      filtered = filtered.filter((meeting) => {
        const meetingDate = moment(meeting.joinedAt)
        switch (dateFilter) {
          case "today":
            return meetingDate.isSame(now, "day")
          case "week":
            return meetingDate.isAfter(now.clone().subtract(7, "days"))
          case "month":
            return meetingDate.isAfter(now.clone().subtract(30, "days"))
          default:
            return true
        }
      })
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue, bValue
      switch (sortBy) {
        case "joinedAt":
          aValue = new Date(a.joinedAt)
          bValue = new Date(b.joinedAt)
          break
        case "roomId":
          aValue = a.roomId
          bValue = b.roomId
          break
        case "messageCount":
          aValue = a.messageCount
          bValue = b.messageCount
          break
        case "attendeeCount":
          aValue = a.attendeeCount
          bValue = b.attendeeCount
          break
        default:
          aValue = a.joinedAt
          bValue = b.joinedAt
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    setFilteredMeetings(filtered)
  }, [meetings, searchTerm, sortBy, sortOrder, dateFilter])

  const handleRowClick = async (roomId) => {
    setLoading(true)
    setSelectedRoomId(roomId)
    setShowModal(true)
    const data = await getRoomDetails(roomId)
    setRoomDetails(data)
    setLoading(false)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedRoomId(null)
    setRoomDetails(null)
    setActiveTab("messages")
  }

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("desc")
    }
  }

  const getSortIcon = (field) => {
    if (sortBy !== field) return "↕️"
    return sortOrder === "asc" ? "↑" : "↓"
  }

  // Get unique attendees by name
  const getUniqueAttendees = (attendees) => {
    const uniqueMap = new Map()
    attendees.forEach((attendee) => {
      if (!uniqueMap.has(attendee.peerName)) {
        uniqueMap.set(attendee.peerName, attendee)
      }
    })
    return Array.from(uniqueMap.values())
  }

  // Format message recipient
  const formatRecipient = (to_peer_name) => {
    return to_peer_name === "all" ? "Everyone" : to_peer_name
  }

  // Get user avatar color
  const getAvatarColor = (name) => {
    const colors = [
      "bg-gradient-to-br from-blue-500 to-blue-600",
      "bg-gradient-to-br from-green-500 to-green-600",
      "bg-gradient-to-br from-purple-500 to-purple-600",
      "bg-gradient-to-br from-orange-500 to-orange-600",
      "bg-gradient-to-br from-pink-500 to-pink-600",
      "bg-gradient-to-br from-indigo-500 to-indigo-600",
    ]
    const index = name.charCodeAt(0) % colors.length
    return colors[index]
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} name="Meeting  History" />

        <div className="flex-1 overflow-auto p-6 space-y-6">
          {/* Search and Filter Controls */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-600 rounded-lg">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Search & Filter</h2>
            </div>

            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by Room ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm font-medium"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                </select>

                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split("-")
                    setSortBy(field)
                    setSortOrder(order)
                  }}
                  className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm font-medium"
                >
                  <option value="joinedAt-desc">Latest First</option>
                  <option value="joinedAt-asc">Oldest First</option>
                  <option value="roomId-asc">Room ID A-Z</option>
                  <option value="roomId-desc">Room ID Z-A</option>
                  <option value="messageCount-desc">Most Messages</option>
                  <option value="attendeeCount-desc">Most Attendees</option>
                </select>
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-600">
              Showing {filteredMeetings.length} of {meetings.length} meetings
            </div>
          </div>

          {/* Meetings Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Meeting Sessions</h3>
              <p className="text-sm text-gray-600 mt-1">Click on any row to view detailed information</p>
            </div>

            {loading && meetings.length === 0 ? (
              <div className="flex justify-center items-center py-12">
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
                  <span className="text-gray-600 text-sm">Loading meetings...</span>
                </div>
              </div>
            ) : filteredMeetings.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <div className="text-gray-500 text-sm">No meetings found</div>
                <div className="text-gray-400 text-xs mt-1">Try adjusting your search or filter criteria</div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        #
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort("roomId")}
                      >
                        <div className="flex items-center gap-1">
                          Room ID
                          <span className="text-gray-400">{getSortIcon("roomId")}</span>
                        </div>
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort("joinedAt")}
                      >
                        <div className="flex items-center gap-1">
                          Date & Time
                          <span className="text-gray-400">{getSortIcon("joinedAt")}</span>
                        </div>
                      </th>
                      <th
                        className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort("messageCount")}
                      >
                        <div className="flex items-center justify-center gap-1">
                          Messages
                          <span className="text-gray-400">{getSortIcon("messageCount")}</span>
                        </div>
                      </th>
                      <th
                        className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort("attendeeCount")}
                      >
                        <div className="flex items-center justify-center gap-1">
                          Attendees
                          <span className="text-gray-400">{getSortIcon("attendeeCount")}</span>
                        </div>
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Recordings
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredMeetings.map((meeting, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => handleRowClick(meeting.roomId)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 font-mono">{meeting.roomId}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{moment(meeting.joinedAt).format("MMM DD, YYYY")}</div>
                          <div className="text-xs text-gray-500">{moment(meeting.joinedAt).format("HH:mm")}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {meeting.messageCount}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {meeting.attendeeCount}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            {meeting.recordingCount}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <button className="text-blue-600 hover:text-blue-900 text-sm font-medium">
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          {hasMore && (
  <div className="p-4 flex justify-center">
    <button
      onClick={() => setPage((prev) => prev + 1)}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
      disabled={loading}
    >
      {loading ? "Loading..." : "Load More"}
    </button>
  </div>
)}

        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gray-900 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-lg">
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
                  <h2 className="text-lg font-semibold text-white">Meeting Details</h2>
                  <p className="text-gray-300 text-sm">Room ID: {selectedRoomId}</p>
                </div>
              </div>
              <button onClick={closeModal} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
                    <span className="text-gray-600 text-sm">Loading details...</span>
                  </div>
                </div>
              ) : (
                <div className="p-6">
                  {/* Tab Navigation */}
                  <div className="border-b border-gray-200 mb-6">
                    <nav className="-mb-px flex space-x-8">
                      {[
                        { key: "messages", label: "Messages", icon: "💬" },
                        { key: "recordings", label: "Recordings", icon: "🎥" },
                        { key: "attendees", label: "Attendees", icon: "👥" },
                        { key: "session", label: "Session Info", icon: "📊" },
                      ].map((tab) => (
                        <button
                          key={tab.key}
                          onClick={() => setActiveTab(tab.key)}
                          className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                            activeTab === tab.key
                              ? "border-blue-500 text-blue-600"
                              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                          }`}
                        >
                          <span>{tab.icon}</span>
                          {tab.label}
                        </button>
                      ))}
                    </nav>
                  </div>

                  {/* Tab Content */}
                  <div>
                    {activeTab === "messages" && roomDetails && (
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-900">Chat Messages</h3>
                          <span className="text-sm text-gray-500">{roomDetails.messages.length} messages</span>
                        </div>
                        {roomDetails.messages.length > 0 ? (
                          <div className="space-y-4 max-h-96 overflow-y-auto">
                            {roomDetails.messages.map((msg, i) => (
                              <div key={i} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <div className="flex items-start space-x-3">
                                  <div
                                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${getAvatarColor(msg?.peer_name)}`}
                                  >
                                    <span className="text-xs font-medium text-white">
                                      {msg.peer_name.charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-2">
                                      <div className="flex items-center gap-2">
                                        <span className="font-medium text-gray-900 text-sm">{msg.peer_name}</span>
                                        <span className="text-gray-400 text-xs">→</span>
                                        <span className="text-sm text-gray-600 bg-gray-200 px-2 py-0.5 rounded">
                                          {formatRecipient(msg.to_peer_name)}
                                        </span>
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {moment(msg.timestamp).format("HH:mm")}
                                      </div>
                                    </div>
                                    <div className="text-sm text-gray-800 bg-white rounded p-2 border-l-2 border-blue-400">
                                      {msg.peer_msg}
                                    </div>
                                    <div className="text-xs text-gray-400 mt-1">
                                      {moment(msg.timestamp).format("MMM DD, YYYY")}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-500 text-sm">No messages found</div>
                        )}
                      </div>
                    )}

                    {activeTab === "recordings" && roomDetails && (
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-900">Session Recordings</h3>
                          <span className="text-sm text-gray-500">{roomDetails.recordings.length} recordings</span>
                        </div>
                        {roomDetails.recordings.length > 0 ? (
                          <div className="space-y-3">
                            {roomDetails.recordings.map((rec, i) => (
                              <div key={i} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                      <svg
                                        className="w-5 h-5 text-purple-600"
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
                                    </div>
                                    <div>
                                      <div className="font-medium text-gray-900 text-sm">{rec.fileName}</div>
                                      <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                                        <span className="bg-gray-200 px-2 py-0.5 rounded">{rec.device}</span>
                                        <span className="bg-blue-200 px-2 py-0.5 rounded">
                                          {rec.duration || "Duration N/A"}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <a
                                    href={rec.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                      />
                                    </svg>
                                    Download
                                  </a>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-500 text-sm">No recordings found</div>
                        )}
                      </div>
                    )}

                    {activeTab === "attendees" && roomDetails && (
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-900">Meeting Attendees</h3>
                          <span className="text-sm text-gray-500">
                            {getUniqueAttendees(roomDetails.attendees).length} unique attendees
                          </span>
                        </div>
                        <div className="space-y-3">
                          {getUniqueAttendees(roomDetails.attendees).map((attendee, i) => (
                            <div key={i} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center ${getAvatarColor(attendee?.peerName)}`}
                                  >
                                    <span className="text-sm font-medium text-white">
                                      {attendee?.peerName?.charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                  <div>
                                    <div className="font-medium text-gray-900 text-sm">{attendee.peerName}</div>
                                    <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                                      <span className="flex items-center gap-1">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                          />
                                        </svg>
                                        Joined: {moment(attendee.joinTime).format("HH:mm")} <br />
                                        Ended: {moment(attendee.leaveTime).format("HH:mm")}
                                      </span>
                                      <span>•</span>
                                      <span>{moment(attendee.joinTime).format("MMM DD")}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  {attendee.isHost && (
                                    <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
                                      Host
                                    </span>
                                  )}
                                  <span className="inline-flex items-center px-2 py-1 bg-gray-200 text-gray-700 text-xs font-medium rounded">
                                    {attendee.isHost ? "Host" : "Participant"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTab === "session" && roomDetails && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Information</h3>
                        {roomDetails.session ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                                  Session Name
                                </div>
                                <div className="text-sm font-medium text-gray-900">
                                  {roomDetails.session.sessionName}
                                </div>
                              </div>

                              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                                  Host
                                </div>
                                <div className="text-sm font-medium text-gray-900">{roomDetails.session.hostName}</div>
                                <div className="text-xs text-gray-600 mt-1">{roomDetails.session.hostEmail}</div>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                                  Start Time
                                </div>
                                <div className="text-sm font-medium text-gray-900">
                                  {moment(roomDetails.session.startTime).format("MMM DD, YYYY")}
                                </div>
                                <div className="text-xs text-gray-600 mt-1">
                                  {moment(roomDetails.session.startTime).format("HH:mm")}
                                </div>
                              </div>

                              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                                  Session ID
                                </div>
                                <div className="text-sm font-medium text-gray-900 font-mono bg-gray-200 px-2 py-1 rounded">
                                  {roomDetails.session.sessionId}
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-500 text-sm">No session information found</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MeetingDetails
