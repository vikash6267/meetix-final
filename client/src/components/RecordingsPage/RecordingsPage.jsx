import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../Layouts/SideNav';
import Header from '../Layouts/SidebarHeader';

const RecordingsPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [recordings, setRecordings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const recordingsPerPage = 8;
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    fetchRecordings();
  }, []);

  const fetchRecordings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:3010/api/v1/user/recordings/${user?._id}`,
      );
      console.log(response.data.recordings);
      setRecordings(response.data.recordings);
    } catch (err) {
      // setError('Failed to fetch recordings. Please try again later.');
      console.error('Error fetching recordings:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const filteredRecordings = recordings.filter(
    (recording) =>
      recording.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      formatDate(recording.date)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  const indexOfLastRecording = currentPage * recordingsPerPage;
  const indexOfFirstRecording = indexOfLastRecording - recordingsPerPage;
  const currentRecordings = filteredRecordings.slice(
    indexOfFirstRecording,
    indexOfLastRecording,
  );
  const totalPages = Math.ceil(filteredRecordings.length / recordingsPerPage);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar with toggle functionality */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header with toggle button */}
        <Header toggleSidebar={toggleSidebar} name="Meeting Recordings" />

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-6xl mx-auto">
            {/* Keep the rest of your existing JSX structure the same */}
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold text-gray-800">
                Meeting Recordings
              </h1>
              <button
                onClick={fetchRecordings}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Refresh
              </button>
            </div>

            <div className="mb-6">
              <input
                type="text"
                placeholder="Search recordings by name or date..."
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
                <p>{error}</p>
                <button
                  onClick={fetchRecordings}
                  className="mt-2 px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
                >
                  Retry
                </button>
              </div>
            ) : currentRecordings.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <p className="text-gray-600">
                  {searchTerm
                    ? 'No recordings match your search.'
                    : 'No recordings available.'}
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
               {currentRecordings.map((recording) => (
  <div key={recording._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
    <div className="p-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-gray-800 truncate">
          {recording.fileName.replace('recording.webm', '').replace(/-/g, ' ')}
        </h3>
        <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
          {recording.size}
        </span>
      </div>

      {/* Date */}
      <p className="text-gray-500 text-sm">{formatDate(recording.date)}</p>

      {/* Room ID */}
      <p className="text-sm text-gray-400 mt-1">
        <span className="font-medium text-gray-600">Room ID:</span> {recording.roomId}
      </p>

      <div className="flex space-x-2 mt-4">
        <a
          href={recording.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-indigo-600 text-white text-center py-2 rounded-md hover:bg-indigo-700 transition-colors"
        >
          Download
        </a>
        <button className="bg-gray-200 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-300 transition-colors">
          <i className="fas fa-info-circle"></i>
        </button>
      </div>
    </div>
  </div>
))}

                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className="px-4 py-2 border rounded-md disabled:opacity-50"
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-4 py-2 border rounded-md ${currentPage === i + 1 ? 'bg-indigo-600 text-white' : ''}`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border rounded-md disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordingsPage;
