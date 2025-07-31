import React, { useState, useEffect } from 'react';
import Sidebar from '../Layouts/SideNav';
import Header from '../Layouts/SidebarHeader';
import axios from 'axios';

const AttendancePage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const calculateTimeDifference = (joinTime, leaveTime) => {
    const join = new Date(joinTime);
    const leave = leaveTime ? new Date(leaveTime) : new Date();
    const diff = Math.abs(leave - join);
    
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const fetchAttendance = async (e) => {
    e.preventDefault();
    if (!roomId) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`https://meetix.mahitechnocrafts.inattendees/${roomId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch attendance data');
      }
      
      const data = await response.json();
      setAttendanceData(data);
    } catch (err) {
      setError('Failed to fetch attendance data. Please check the room ID.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} name="Track Attendance" />
        
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={fetchAttendance} className="mb-8">
              <div className="flex gap-4">
                <input
                  type="text"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  placeholder="Enter Room ID"
                  className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:bg-gray-400 transition-colors"
                >
                  {loading ? 'Loading...' : 'Fetch Attendance'}
                </button>
              </div>
            </form>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            {attendanceData.length > 0 ? (
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <h2 className="text-2xl font-semibold mb-4">
                    Attendance for Room: {roomId}
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Peer ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Time</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leave Time</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Time</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Host</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {attendanceData.map((attendee) => (
                          <tr key={attendee._id}>
                            <td className="px-6 py-4 whitespace-nowrap">{attendee.peerName}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{attendee.peerId}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {new Date(attendee.joinTime).toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {attendee.leaveTime 
                                ? new Date(attendee.leaveTime).toLocaleString()
                                : 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {calculateTimeDifference(attendee.joinTime, attendee.leaveTime)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {attendee.isHost ? (
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  Host
                                </span>
                              ) : (
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                  Participant
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              !loading && !error && (
                <div className="text-center bg-white p-8 rounded-lg shadow-lg">
                  <p className="text-gray-600">Enter a Room ID to view attendance records</p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;