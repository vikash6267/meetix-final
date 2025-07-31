import React, { useState } from 'react';
import Sidebar from '../Layouts/SideNav';
import Header from '../Layouts/SidebarHeader';

const SessionPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const fetchSessions = async (e) => {
    e.preventDefault();
    if (!sessionId) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`https://meetix.mahitechnocrafts.insession/${sessionId}`);
      if (!response.ok) throw new Error('Session not found');
      
      const data = await response.json();
      // Sort sessions by startTime in descending order
      const sortedData = data.sort((a, b) => 
        new Date(b.startTime) - new Date(a.startTime)
      );
      setSessions(sortedData);
    } catch (err) {
      setError('Failed to fetch sessions. Please check the session ID.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} name="Meeting  History" />
        
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={fetchSessions} className="mb-8">
              <div className="flex gap-4">
                <input
                  type="text"
                  value={sessionId}
                  onChange={(e) => setSessionId(e.target.value)}
                  placeholder="Enter Session ID"
                  className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:bg-gray-400 transition-colors"
                >
                  {loading ? 'Loading...' : 'View Sessions'}
                </button>
              </div>
            </form>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            {sessions.length > 0 ? (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-semibold mb-6">
                  Meeting  History: {sessionId}
                </h2>
                <div className="space-y-4">
                  {sessions.map((session) => (
                    <div 
                      key={session._id}
                      className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium text-gray-800">
                            Hosted by: {session.hostName}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Session: {session.sessionName}
                          </p>
                        </div>
                        <span className="text-sm text-gray-500">
                          {formatDateTime(session.startTime)}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="mr-2">Started at:</span>
                        {new Date(session.startTime).toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              !loading && !error && (
                <div className="text-center bg-white p-8 rounded-lg shadow-lg">
                  <p className="text-gray-600">Enter a Session ID to view session history</p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionPage;