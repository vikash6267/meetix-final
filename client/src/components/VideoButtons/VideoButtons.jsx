import React, { useState, useRef } from 'react';
import {
  BiSolidMicrophone,
  BiSolidMicrophoneOff,
  BiVideoRecording,
  BiStopCircle,
  BiExit,
} from 'react-icons/bi';
import { FaEllipsisH } from 'react-icons/fa';
import { FaVideo, FaVideoSlash, FaPhone } from 'react-icons/fa6';
import { MdOutlineScreenShare, MdOutlineStopScreenShare } from 'react-icons/md';
import { BsRecordCircle, BsStopCircle } from 'react-icons/bs';

import { useSelector } from 'react-redux';
import VideoButton from '../VideoButton/VideoButton';
import LocalScreen from '../LocalScreen/LocalScreen';
import { toggleScreenShare } from '../../utils/webRTCHandler';
import axios from 'axios';
import '../../pages/RoomPage/RoompageNew.css';

function VideoButtons() {
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const [screenSharingStream, setScreenSharingStream] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const recordedChunksRef = useRef([]);
  const mediaRecorderRef = useRef(null);
  const { localStream, isConnectWithAudio, isRoomHost } = useSelector(
    (state) => state.room,
  );

  const handleMute = () => {
    setIsMuted((prev) => !prev);
    localStream.getAudioTracks()[0].enabled = isMuted;
  };

  const handleCamera = () => {
    setIsCameraOn((prev) => !prev);
    localStream.getVideoTracks()[0].enabled = isCameraOn;
  };

  const handleShare = async () => {
    if (!screenSharingStream) {
      let stream = null;

      try {
        stream = await navigator.mediaDevices.getDisplayMedia({
          audio: false,
          video: true,
        });
      } catch (error) {
        console.error(error);
      }

      if (stream) {
        setScreenSharingStream(stream);
        setIsShared(true);
        toggleScreenShare(isShared, stream);
      }
    } else {
      toggleScreenShare(isShared);
      setIsShared(false);
      screenSharingStream.getTracks().forEach((track) => {
        track.stop();
      });
      setScreenSharingStream(null);
    }
  };

  const handleStartRecording = async () => {
    let combinedStream = localStream;

    if (!localStream.getAudioTracks().length) {
      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      combinedStream = new MediaStream([
        ...localStream.getVideoTracks(),
        ...audioStream.getAudioTracks(),
      ]);
    }

    // console.log('Audio Tracks:', combinedStream.getAudioTracks());
    // console.log('Video Tracks:', combinedStream.getVideoTracks());
    // console.log('Is MIME type supported:', MediaRecorder.isTypeSupported('video/webm; codecs=vp8,opus'));

    mediaRecorderRef.current = new MediaRecorder(combinedStream, {
      mimeType: 'video/webm; codecs=vp8,opus',
    });

    mediaRecorderRef.current.ondataavailable = (event) => {
      // console.log('ondataavailable called:', event.data);
      if (event.data.size > 0) {
        // console.log('Chunk size:', event.data.size);
        recordedChunksRef.current.push(event.data);
        setRecordedChunks((prev) => [...prev, event.data]);
      } else {
        console.warn('Empty chunk received.');
      }
    };

    mediaRecorderRef.current.start();
    // console.log('Recording started.');
    setIsRecording(true);
  };

  const handleStopRecording = async () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();

      mediaRecorderRef.current.onstop = async () => {
        // console.log('Recorded Chunks (from ref):', recordedChunksRef.current);

        if (!recordedChunksRef.current.length) {
          alert('Recording failed: No data captured.');
          console.error('No recorded chunks available.');
          return;
        }

        const blob = new Blob(recordedChunksRef.current, {
          type: 'video/webm',
        });
        // console.log('Blob created:', blob);
        // console.log('Blob size:', blob.size);

        if (blob.size === 0) {
          alert('Recording failed: Blob size is 0');
          console.error('Blob size is 0, recording might have failed.');
          return;
        }

        const formData = new FormData();
        formData.append('file', blob, 'recording.webm');

        try {
          const response = await axios.post(
            'https://webinar-backend-sa37.onrender.com/api/v1/save/upload',
            formData,
            {
              headers: { 'Content-Type': 'multipart/form-data' },
            },
          );
          // console.log('Upload successful:', response.data);
          alert('Recording saved successfully');
        } catch (error) {
          console.error('Error uploading recording:', error);
        }

        setIsRecording(false);
        setRecordedChunks([]);
        recordedChunksRef.current = [];
      };
    }
  };

  const leaveRoom = () => {
    const siteUrl = window.location.origin;
    window.location.href = siteUrl;
  };

  return (
    <div className="video_buttons_container bottom-2 gap-0">
      <VideoButton handleClick={handleMute}>
        {isMuted ? (
          <BiSolidMicrophoneOff className="video_button_image w-11 h-11" />
        ) : (
          <BiSolidMicrophone className="video_button_image w-11 h-11" />
        )}
      </VideoButton>

      {!isConnectWithAudio && (
        <VideoButton handleClick={handleCamera}>
          {isCameraOn ? (
            <FaVideoSlash className="video_button_image w-11 h-11" />
          ) : (
            <FaVideo className="video_button_image w-11 h-11" />
          )}
        </VideoButton>
      )}

      {!isConnectWithAudio && (
        <div className="hidden md:block">
          <VideoButton handleClick={handleShare}>
            {isShared ? (
              <MdOutlineStopScreenShare className="video_button_image w-11 h-11" />
            ) : (
              <MdOutlineScreenShare className="video_button_image w-11 h-11" />
            )}
          </VideoButton>

          {isShared && <LocalScreen stream={screenSharingStream} />}
        </div>
      )}
      {isRoomHost && (
        <VideoButton
          handleClick={isRecording ? handleStopRecording : handleStartRecording}
        >
          {isRecording ? (
            <BsStopCircle
              className="video_button_image recording w-9 h-9"
              style={{ color: 'red' }}
            />
          ) : (
            <BsRecordCircle className="video_button_image ready w-9 h-9" />
          )}
        </VideoButton>
      )}
      
      <VideoButton handleClick={leaveRoom}>
        <FaPhone className="video_button_image end w-11 h-11" />
      </VideoButton>
      <div className="md:hidden">
        <VideoButton handleClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <FaEllipsisH className="video_button_image w-11 h-11" />
        </VideoButton>
      </div>

      {/* Mobile menu modal */}
      {isMobileMenuOpen && (
        <div className="fixed bottom-20 right-4 bg-[#3c4043] p-4 rounded-lg shadow-lg z-30 flex flex-col gap-3 md:hidden">
          {/* Screen share button */}
          {!isConnectWithAudio && (
            <div className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-gray-600">
              <VideoButton
                handleClick={() => {
                  handleShare();
                  setIsMobileMenuOpen(false);
                }}
              >
                {isShared ? (
                  <MdOutlineStopScreenShare className="w-5 h-5 text-white" />
                ) : (
                  <MdOutlineScreenShare className="w-5 h-5 text-white" />
                )}
              </VideoButton>
              <span className="text-white">Screen Share</span>
            </div>
          )}
          {/* Recording button */}
          <div className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-gray-600">
            <VideoButton
              handleClick={() => {
                isRecording ? handleStopRecording() : handleStartRecording();
                setIsMobileMenuOpen(false);
              }}
            >
              {isRecording ? (
                <BsStopCircle className="w-5 h-5 text-red-500" />
              ) : (
                <BsRecordCircle className="w-5 h-5 text-white" />
              )}
            </VideoButton>
            <span className="text-white">
              {isRecording ? 'Stop Recording' : 'Record'}
            </span>
          </div>
        </div>
        
      )}
      
    </div>
  );
}

export default VideoButtons;
