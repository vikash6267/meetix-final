import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ParticipantsSection from '../../components/ParticipantsSection/ParticipantsSection';
import VideoSection from '../../components/VideoSection/VideoSection';
import ChatSection from '../../components/ChatSection/ChatSection';
import RoomLabel from '../../components/RoomLabel/RoomLabel';
import { getLocalPreviewAndInitConnection } from '../../utils/webRTCHandler';
import Spinner from '../../components/Spinner/Spinner';
import ShareMeetingLink from '../../components/ShareMeetingLink/ShareMeetingLink';
import {
  FaComment,
  FaUserFriends,
  FaShareAlt,
  FaEllipsisH,
} from 'react-icons/fa'; // Added participants icon
import './RoomPage.css';

function RoomPage() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { roomId, username, isRoomHost, isLoad, isConnectWithAudio } =
    useSelector((state) => state.room);
    console.log("Room: ", roomId);

  useEffect(() => {
    if (!isRoomHost && !roomId) {
      const siteUrl = window.location.origin;
      window.location.href = siteUrl;
    } else {
      getLocalPreviewAndInitConnection(
        isRoomHost,
        username,
        roomId,
        isConnectWithAudio,
      );
    }
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const toggleChat = () => {
    if (!isChatOpen) {
      setIsParticipantsOpen(false); // Close participants if opening chat
      setIsShareModalOpen(false); // Close share modal if opening chat
    }
    setIsChatOpen(!isChatOpen);
  };

  const toggleParticipants = () => {
    if (!isParticipantsOpen) {
      setIsChatOpen(false); // Close chat if opening participants
      setIsShareModalOpen(false); // Close share modal if opening participants
    }
    setIsParticipantsOpen(!isParticipantsOpen);
  };

  const toggleShareModal = () => {
    if (!isShareModalOpen) {
      setIsChatOpen(false); // Close chat if opening share modal
      setIsParticipantsOpen(false); // Close participants if opening share modal
    }
    setIsShareModalOpen(!isShareModalOpen);
  };

  const closeParticipantsSection = () => {
    setIsParticipantsOpen(false);
  };

  return (
    <div className="room_container h-screen flex relative overflow-hidden bg-[#2f3034]">
      {/* Main video area that adjusts when panels open */}
      <div
        className={`flex-1 relative transition-all duration-300 ${isChatOpen || isParticipantsOpen ? 'mr-[20%]' : 'mr-0'}`}
      >
        <VideoSection />
        {isLoad && <Spinner />}
      </div>

      {/* Right panels - appears in margin without causing scroll */}
      <div
        className={`fixed right-0 top-2 h-[85.5vh] w-[20%] bg-[#2f3034] transition-transform duration-300 overflow-hidden ease-in-out ${
          isChatOpen || isParticipantsOpen
            ? 'translate-x-0'
            : 'translate-x-full'
        }`}
      >
        {isChatOpen && (
          <div className="h-full">
            <ChatSection closeChat={toggleChat} />
          </div>
        )}
        {isParticipantsOpen && (
          <div className="h-full">
            <ParticipantsSection closeSection={closeParticipantsSection} />
          </div>
        )}
      </div>

      <div className="absolute bottom-[3vh] left-0 z-20 hidden md:flex items-center gap-1">
        <div className="px-1 py-1 rounded-lg text-white text-xs">
          {formatTime(currentTime)}
        </div>
        <span className="font-medium">|</span>
        <div className="px-0 py-1 rounded-lg text-white text-xs flex items-center">
          <span className="ml-0 font-mono">{roomId}</span>
        </div>
      </div>

      {/* Bottom control buttons (unchanged) */}
      <div className="absolute bottom-[3vh] right-[5%] gap-4 z-20 hidden md:flex">
        {isRoomHost && (
          <div
            className="bg-[#3c4043] p-2 rounded-full shadow-lg cursor-pointer hover:bg-gray-200 transition-all duration-300"
            onClick={toggleShareModal}
          >
            <FaShareAlt size={24} color="#FFFFFF" />
          </div>
        )}
        <div
          className="bg-[#3c4043] p-2 rounded-full shadow-lg cursor-pointer hover:bg-gray-200 transition-all duration-300"
          onClick={toggleParticipants}
        >
          <FaUserFriends size={24} color="#FFFFFF" />
        </div>
        <div
          className="bg-[#3c4043] p-2 rounded-full shadow-lg cursor-pointer hover:bg-gray-200 transition-all duration-300"
          onClick={toggleChat}
        >
          <FaComment size={24} color="#FFFFFF" />
        </div>
      </div>

      {/* Modal (unchanged) */}
      {isShareModalOpen && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 text-white p-6 rounded-lg shadow-lg z-30 w-[90%] max-w-[500px]">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-lg">To join the meeting, copy this ID:</h2>
            <button
              className="text-gray-300 hover:text-white text-2xl"
              onClick={toggleShareModal}
            >
              &times;
            </button>
          </div>
          <div className="bg-[#3c4043] p-3 rounded mb-4">
            <p className="font-mono break-all">{roomId}</p>
          </div>
          <ShareMeetingLink roomId={roomId} />
        </div>
      )}
    </div>
  );
}

export default RoomPage;
