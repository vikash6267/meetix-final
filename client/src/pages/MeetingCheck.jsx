import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function MeetingCheck() {
  const { id: roomId, userId } = useParams();
  const navigate = useNavigate();
  const BASE_URL = 'https://meetix.mahitechnocrafts.in/api/v1';

  const [isJoined, setIsJoined] = useState(null); // null = loading
  const [error, setError] = useState(null);
  const [checking, setChecking] = useState(false);

  const checkMeetingStatus = async () => {
    try {
      setChecking(true);
      setError(null);

      const response = await axios.get(`${BASE_URL}/user/check/${userId}/${roomId}`);
      
      const joined = response.data.isJoined;

      if (joined) {
        window.location.href = `https://meetix.mahitechnocrafts.in/join/?room=${roomId}`;
      } else {
        setIsJoined(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to check meeting status.');
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    checkMeetingStatus();
  }, [userId, roomId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Meeting Access</h2>

        {checking || isJoined === null ? (
          <p className="text-blue-500 text-lg font-medium">Checking meeting status...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <>
            <p className="text-gray-700 text-lg mb-4">
              The host has not yet joined the meeting. Please wait and try again shortly.
            </p>
            <button
              onClick={checkMeetingStatus}
              className="mt-4 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition"
            >
              🔄 Recheck & Rejoin
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default MeetingCheck;
