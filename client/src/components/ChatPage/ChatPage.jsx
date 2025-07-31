// import React, { useState } from 'react';
// import Sidebar from '../Layouts/SideNav';
// import Header from '../Layouts/SidebarHeader';

// const ChatPage = () => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [roomId, setRoomId] = useState('');
//   const [chatData, setChatData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

//   const formatTime = (timestamp) => {
//     const date = new Date(timestamp);
//     return date.toLocaleTimeString('en-US', {
//       hour: '2-digit',
//       minute: '2-digit',
//       hour12: true
//     });
//   };

//   const fetchChat = async (e) => {
//     e.preventDefault();
//     if (!roomId) return;
    
//     setLoading(true);
//     setError('');
    
//     try {
//       const response = await fetch(`https://meetix.mahitechnocrafts.inchat/${roomId}`);
//       if (!response.ok) throw new Error('Failed to fetch chat data');
      
//       const data = await response.json();
//       // Sort messages by timestamp in ascending order
//       const sortedData = data.sort((a, b) => 
//         new Date(a.timestamp) - new Date(b.timestamp)
//       );
//       setChatData(sortedData);
//     } catch (err) {
//       setError('Failed to fetch chat history. Please check the room ID.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex h-screen bg-gray-100">
//       <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
//       <div className="flex-1 flex flex-col overflow-hidden">
//         <Header toggleSidebar={toggleSidebar} name="Chat History" />
        
//         <div className="flex-1 overflow-auto p-8">
//           <div className="max-w-3xl mx-auto">
//             <form onSubmit={fetchChat} className="mb-8">
//               <div className="flex gap-4">
//                 <input
//                   type="text"
//                   value={roomId}
//                   onChange={(e) => setRoomId(e.target.value)}
//                   placeholder="Enter Room ID"
//                   className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
//                 />
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:bg-gray-400 transition-colors"
//                 >
//                   {loading ? 'Loading...' : 'View Chat'}
//                 </button>
//               </div>
//             </form>

//             {error && <p className="text-red-500 mb-4">{error}</p>}

//             {chatData.length > 0 ? (
//               <div className="bg-white rounded-lg shadow-lg p-6">
//                 <h2 className="text-2xl font-semibold mb-6">
//                   Chat History for Room: {roomId}
//                 </h2>
//                 <div className="space-y-4">
//                   {chatData.map((message) => (
//                     <div 
//                       key={message._id}
//                       className="p-4 bg-gray-50 rounded-lg"
//                     >
//                       <div className="flex justify-between items-start mb-2">
//                         <span className="font-medium text-gray-700">
//                           {message.senderName}
//                         </span>
//                         <span className="text-sm text-gray-500">
//                           {formatTime(message.timestamp)}
//                         </span>
//                       </div>
//                       <p className="text-gray-800">{message.message}</p>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             ) : (
//               !loading && !error && (
//                 <div className="text-center bg-white p-8 rounded-lg shadow-lg">
//                   <p className="text-gray-600">Enter a Room ID to view chat history</p>
//                 </div>
//               )
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatPage;






"use client"

import { useEffect, useState } from "react"
import { MessageCircle, Users, Clock, User, Hash, ArrowRight, Eye, X } from "lucide-react"
import Sidebar from "../Layouts/SideNav"
import Header from "../Layouts/SidebarHeader"
import { getActivityMeetings } from "../../services/operations/user"

const ChatPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [chatData, setChatData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const storedUser = localStorage.getItem("user")
  const user = storedUser ? JSON.parse(storedUser) : null

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now - date) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    }
  }

  const fetchChat = async () => {
    if (!user) return

    setLoading(true)
    setError("")

    try {
      const response = await getActivityMeetings(user?._id)
      console.log(response.roomActivity)

      const data = response.roomActivity || []
      setChatData(data)
    } catch (err) {
      setError("Failed to fetch chat history. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchChat()
  }, [])

  const openRoomModal = (roomData) => {
    setSelectedRoom(roomData)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedRoom(null)
  }

  const renderMessagesModal = () => {
    if (!selectedRoom) return null

    const { roomId, messages } = selectedRoom
    const sortedMessages = messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
          {/* Modal Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Hash className="w-6 h-6" />
                <div>
                  <h2 className="text-xl font-bold">{roomId}</h2>
                  <p className="text-blue-100 text-sm">Chat Room Messages</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <MessageCircle className="w-5 h-5" />
                  <span className="font-semibold">{messages.length}</span>
                  <span className="text-blue-100">messages</span>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {sortedMessages.map((message) => (
              <div
                key={message._id}
                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {message.peer_name.charAt(0).toUpperCase()}
                  </div>
                </div>

                {/* Message Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-semibold text-gray-900">{message.peer_name}</span>
                    <div className="flex items-center space-x-1 text-gray-500">
                      <ArrowRight className="w-3 h-3" />
                      {message.to_peer_name === "all" ? (
                        <div className="flex items-center space-x-1">
                          <Users className="w-3 h-3" />
                          <span className="text-xs font-medium text-green-600">Everyone</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1">
                          <User className="w-3 h-3" />
                          <span className="text-xs font-medium text-blue-600">{message.to_peer_name}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-1 text-gray-400">
                      <Clock className="w-3 h-3" />
                      <span className="text-xs">{formatTime(message.timestamp)}</span>
                    </div>
                  </div>

                  <div className="bg-gray-100 rounded-lg p-3 text-gray-800">{message.peer_msg}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} name="Chat History" />

        <div className="flex-1 overflow-auto p-6">
          {loading && (
            <div className="flex items-center justify-center h-64">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="text-gray-600">Loading chat history...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2 text-red-700">
                <MessageCircle className="w-5 h-5" />
                <span className="font-medium">Error</span>
              </div>
              <p className="text-red-600 mt-1">{error}</p>
            </div>
          )}

          {!loading && !error && chatData.length === 0 && (
            <div className="text-center py-12">
              <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-600 mb-2">No Chat History</h3>
              <p className="text-gray-500">No chat rooms found for your account.</p>
            </div>
          )}

          {!loading && !error && chatData.length > 0 && (
            <div>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Chat Rooms</h1>
                <p className="text-gray-600">Click on any room to view messages</p>
              </div>

              {/* Rooms Table */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4">
                  <h2 className="text-lg font-semibold flex items-center space-x-2">
                    <Hash className="w-5 h-5" />
                    <span>All Chat Rooms ({chatData.length})</span>
                  </h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Room ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Messages
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Last Activity
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {chatData.map((room, index) => {
                        const lastMessage = room.messages.sort(
                          (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
                        )[0]
                        return (
                          <tr
                            key={room._id}
                            className="hover:bg-gray-50 cursor-pointer transition-colors"
                            onClick={() => openRoomModal(room)}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                  {room.roomId.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{room.roomId}</div>
                                  <div className="text-sm text-gray-500">Room #{index + 1}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-2">
                                <MessageCircle className="w-4 h-4 text-blue-500" />
                                <span className="text-sm font-semibold text-gray-900">{room.messages.length}</span>
                                <span className="text-sm text-gray-500">messages</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-2">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-600">
                                  {lastMessage ? formatTime(lastMessage.timestamp) : "No messages"}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  openRoomModal(room)
                                }}
                                className="inline-flex items-center space-x-2 px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                                <span>View</span>
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && renderMessagesModal()}
    </div>
  )
}

export default ChatPage
