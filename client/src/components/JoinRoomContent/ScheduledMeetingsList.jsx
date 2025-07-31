import React, { useState, useEffect } from 'react';
import { FiCalendar, FiClock, FiUsers, FiInfo } from 'react-icons/fi';

function ScheduledMeetingsList() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchScheduledMeetings = async () => {
      try {
        const response = await fetch(
          'http://localhost:5000/scheduled-meetings',
        );
        if (!response.ok) {
          throw new Error('Failed to fetch meetings');
        }
        const data = await response.json();
        setMeetings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchScheduledMeetings();
  }, []);

  if (loading)
    return <div className="text-center py-4">Loading meetings...</div>;
  if (error)
    return <div className="text-red-500 text-center py-4">Error: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto py-6">
      <h2 className="text-2xl font-bold mb-6 text-white">Scheduled Meetings</h2>

      {meetings.length === 0 ? (
        <div className="text-gray-400 text-center py-8">
          No meetings scheduled yet
        </div>
      ) : (
        <div className="grid gap-4">
          {meetings.map((meeting) => (
            <div
              key={meeting.meetingId}
              className="bg-gray-800 rounded-lg p-4 shadow-lg hover:bg-gray-700 transition"
            >
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-semibold text-white">
                  {meeting.title}
                </h3>
                <span className="bg-purple-600 text-xs text-white px-2 py-1 rounded">
                  Room: {meeting.roomId}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-gray-300">
                <div className="flex items-center">
                  <FiCalendar className="mr-2" />
                  <span>{new Date(meeting.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <FiClock className="mr-2" />
                  <span>{meeting.time}</span>
                </div>
                <div className="flex items-center">
                  <FiUsers className="mr-2" />
                  <span>
                    {meeting.participants || 'No participants specified'}
                  </span>
                </div>
              </div>

              {meeting.description && (
                <div className="mt-3 flex items-start">
                  <FiInfo className="mr-2 mt-1 flex-shrink-0" />
                  <p className="text-gray-400">{meeting.description}</p>
                </div>
              )}

              <div className="mt-4 pt-3 border-t border-gray-700 flex justify-end">
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
                  onClick={() => {
                    // Add your join meeting logic here
                    console.log('Joining meeting:', meeting.roomId);
                  }}
                >
                  Join Meeting
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ScheduledMeetingsList;
