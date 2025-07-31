import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { FaShareAlt } from 'react-icons/fa'; // Share icon from react-icons
import ShareMeetingLink from "../ShareMeetingLink/ShareMeetingLink";

function RoomLabel() {
  const { roomId, isRoomHost } = useSelector((state) => state.room);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false); // State to toggle share modal

  const copyToClipboard = () => {
    navigator.clipboard.writeText(roomId);
    // Optionally, you can show a toast notification here for success
    alert('Room ID copied to clipboard!');
  };

  const handleShareClick = () => {
    setIsShareModalOpen(true); // Open the ShareMeetingLink component
  };

  return (
    <div className="flex items-center justify-between w-full text-white p-4 bg-opacity-70 bg-gray-900">
      {/* Share Icon */}
      {isRoomHost && !isShareModalOpen && (
        <div className="bg-gray-700 p-3 rounded-full cursor-pointer hover:bg-gray-600" onClick={handleShareClick}>
          <FaShareAlt size={24} />
        </div>
      )}

      {/* Show ShareMeetingLink when clicked */}
      {isShareModalOpen && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 bg-opacity-90 bg-gray-900 flex flex-col items-center rounded-lg">
          <ShareMeetingLink roomId={roomId} copyToClipboard={copyToClipboard} />
          <button className="mt-4 bg-red-500 text-white p-2 rounded-full" onClick={() => setIsShareModalOpen(false)}>
            Close
          </button>
        </div>
      )}
    </div>
  );
}

export default RoomLabel;
