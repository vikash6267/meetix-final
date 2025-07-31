import React from 'react';
import {
  FaComment,
  FaUserFriends,
  FaShareAlt,
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
  FaPhone,
  FaEllipsisH,
  FaClosedCaptioning,
} from 'react-icons/fa';

const ControlButtons = ({
  isMuted,
  isVideoOff,
  isChatOpen,
  isParticipantsOpen,
  participantCount,
  isRoomHost,
  toggleMute,
  toggleVideo,
  handleLeaveCall,
  toggleChat,
  toggleParticipants,
  toggleShareModal,
}) => {
  return (
    <div className="flex items-center space-x-2 sm:space-x-4">
      {/* Mic Control */}
      <button
        onClick={toggleMute}
        className={`p-2 sm:p-3 rounded-full ${isMuted ? 'bg-[#3c4043] text-[#f28b82]' : 'bg-[#3c4043] hover:bg-[#4e5154] text-[#e8eaed]'}`}
        title={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted ? <FaMicrophoneSlash size={18} /> : <FaMicrophone size={18} />}
      </button>

      {/* Camera Control */}
      <button
        onClick={toggleVideo}
        className={`p-2 sm:p-3 rounded-full ${isVideoOff ? 'bg-[#3c4043] text-[#f28b82]' : 'bg-[#3c4043] hover:bg-[#4e5154] text-[#e8eaed]'}`}
        title={isVideoOff ? 'Turn on camera' : 'Turn off camera'}
      >
        {isVideoOff ? <FaVideoSlash size={18} /> : <FaVideo size={18} />}
      </button>

      {/* Leave Call */}
      <button
        onClick={handleLeaveCall}
        className="p-2 sm:p-3 rounded-full bg-[#ea4335] hover:bg-[#f28b82] text-white"
        title="Leave call"
      >
        <FaPhone size={18} />
      </button>

      {/* Participants Button */}
      <button
        onClick={toggleParticipants}
        className={`p-2 sm:p-3 rounded-full ${isParticipantsOpen ? 'bg-[#3c4043] text-[#8ab4f8]' : 'bg-[#3c4043] hover:bg-[#4e5154] text-[#e8eaed]'}`}
        title="Participants"
      >
        <FaUserFriends size={18} />
        <span className="ml-1 text-xs hidden sm:inline">
          {participantCount}
        </span>
      </button>

      {/* Chat Button */}
      <button
        onClick={toggleChat}
        className={`p-2 sm:p-3 rounded-full ${isChatOpen ? 'bg-[#3c4043] text-[#8ab4f8]' : 'bg-[#3c4043] hover:bg-[#4e5154] text-[#e8eaed]'}`}
        title="Chat"
      >
        <FaComment size={18} />
      </button>

      {/* Captions */}
      <button
        className="p-2 sm:p-3 rounded-full bg-[#3c4043] hover:bg-[#4e5154] text-[#e8eaed] hidden sm:block"
        title="Turn on captions"
      >
        <FaClosedCaptioning size={18} />
      </button>

      {/* More Options */}
      <button
        className="p-2 sm:p-3 rounded-full bg-[#3c4043] hover:bg-[#4e5154] text-[#e8eaed]"
        title="More options"
      >
        <FaEllipsisH size={18} />
      </button>

      {/* Share Button */}
      {isRoomHost && (
        <button
          onClick={toggleShareModal}
          className="p-2 sm:p-3 rounded-full bg-[#3c4043] hover:bg-[#4e5154] text-[#e8eaed]"
          title="Share"
        >
          <FaShareAlt size={18} />
        </button>
      )}
    </div>
  );
};

export default ControlButtons;
