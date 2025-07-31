import React, { useRef, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { MicrophoneIcon, VideoCameraIcon } from "@heroicons/react/24/solid"; 
import { ChevronLeftIcon } from "@heroicons/react/24/outline"; 
import { actions } from "../../features/room";
import * as socketConnection from "../../socket/socket";
import Sidebar from "../../components/Layouts/Sidebar";
import ConnectButton from "../../components/ConnectButton/ConnectButton";
import ScheduleMeetingForm from '../../components/JoinRoomContent/ScheduleMeetingForm';
import ScheduledMeetingsList from '../../components/JoinRoomContent/ScheduledMeetingsList';
import "./IntroductionPage.css"

function IntroductionPage() {
  const dispatch = useDispatch();
  const localVideoRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const audioRef = useRef(null);
  const [showScheduleForm, setShowScheduleForm] = useState(false);

  const handleScheduleSubmit = async (roomId) => {
    try {
      console.log('Meeting scheduled with room ID:', roomId);
      setShowScheduleForm(false);
    } catch (error) {
      console.error('Error handling scheduled meeting:', error);
    }
  };


  useEffect(() => {
    dispatch(actions.setIsRoomHost(false));
    socketConnection.connetWithSocket();
  }, [dispatch]);

  const toggleCamera = async () => {
    if (isCameraOn) {
      stopCamera();
    } else {
      await startCamera();
    }
    setIsCameraOn(!isCameraOn);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localVideoRef.current.srcObject = stream;
      setLocalStream(stream);
    } catch (err) {
      console.error("Error starting camera:", err);
    }
  };

  const stopCamera = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }
  };

  const toggleMic = async () => {
    try {
      console.log("Mic toggle initiated");
      if (!localStream) {
        console.log("No local stream, creating a new one...");
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log("New stream created:", stream);
        setLocalStream(stream);
        if (audioRef.current) {
          audioRef.current.srcObject = stream; // Attach the stream to the audio element
          audioRef.current.play(); // Play the audio to confirm it's working
        }
        const audioTrack = stream.getAudioTracks()[0];
        console.log("Audio track from new stream:", audioTrack);
        audioTrack.enabled = true;
        setIsMicOn(true);
      } else {
        console.log("Local Stream:", localStream);
        let audioTrack = localStream.getAudioTracks().find((track) => track.kind === "audio");
        console.log("Existing audio track:", audioTrack);
        if (!audioTrack) {
          console.log("No audio track found, adding a new one...");
          const newStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          audioTrack = newStream.getAudioTracks()[0];
          console.log("New audio track created:", audioTrack);
          localStream.addTrack(audioTrack);
          if (audioRef.current) {
            audioRef.current.srcObject = localStream; // Update the audio element with the new stream
          }
        }
        // Toggle the audio track
        audioTrack.enabled = !isMicOn;
        console.log("Toggling mic:", audioTrack.enabled);
        setIsMicOn(!isMicOn);
      }
    } catch (err) {
      console.error("Error toggling microphone:", err);
    }
  };
   
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="flex w-full h-screen bg-gradient-to-bl from-[#481046] to-[#000000] text-white overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-5 gap-5 md:items-start md:justify-start md:pr-16 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center text-xl font-bold mb-5">
          <ChevronLeftIcon className="w-6 h-6 mr-2" />
          <h1>Webinar Title</h1>
        </div>

        {/* Preview Screen */}
        <div className="flex flex-col items-center gap-5 lg:flex-row lg:justify-between lg:items-start lg:space-x-10">
          {/* Video Preview */}
          <div className="bg-gray-700 rounded-lg p-5 flex flex-col items-center shadow-lg w-full lg:max-w-lg">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              className="w-full h-64 rounded-lg bg-black mb-4"
            />
            <audio ref={audioRef} autoPlay></audio>
            <div className="flex gap-4">
              <button
                className={`${
                  isCameraOn ? 'bg-green-500' : 'bg-gray-600'
                } rounded-full p-3 transition hover:bg-blue-500 flex items-center justify-center relative`}
                onClick={toggleCamera}
              >
                <VideoCameraIcon className="w-6 h-6 text-white" />
                {!isCameraOn && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-1 bg-white transform rotate-45 absolute"></div>
                  </div>
                )}
              </button>
              <button
                className={`${
                  isMicOn ? 'bg-green-500' : 'bg-gray-600'
                } rounded-full p-3 transition hover:bg-blue-500 flex items-center justify-center relative`}
                onClick={toggleMic}
              >
                <MicrophoneIcon className="w-6 h-6 text-white" />
                {!isMicOn && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-1 bg-white transform rotate-45 absolute"></div>
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Right Content */}
          <div className="flex flex-col items-center justify-center text-center gap-3 w-full lg:w-auto">
            <p className="text-lg text-gray-300">No one else in the meeting</p>
            <div className="w-full sm:w-48 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md">
              <ConnectButton isJoinBtn>Join the Webinar</ConnectButton>
            </div>
            <div className="w-full sm:w-48 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg shadow-md">
              <ConnectButton>Host a Webinar</ConnectButton>
            </div>
            {showScheduleForm ? (
              <ScheduleMeetingForm
                onCancel={() => setShowScheduleForm(false)}
                onCreate={handleScheduleSubmit}
              />
            ) : (
              <div
                className="w-full sm:w-48 bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg shadow-md cursor-pointer mt-3"
                onClick={() => setShowScheduleForm(true)}
              >
                Schedule Meeting
              </div>
            )}
          </div>
        </div>
        <div className="w-full mt-10">
          <ScheduledMeetingsList />
        </div>
      </div>
    </div>
  );
}

export default IntroductionPage;
