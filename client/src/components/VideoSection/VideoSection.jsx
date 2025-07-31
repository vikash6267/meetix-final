// import React, { useEffect, useRef, useState } from 'react';
// import { useSelector } from 'react-redux';
// import VideoButtons from '../VideoButtons/VideoButtons';

// function StreamVideo({ stream, showCountBadge, extraCount }) {
//   const videoRef = useRef();
//   const [isFullScreen, setIsFullScreen] = useState(false);

//   useEffect(() => {
//     const video = videoRef.current;
//     video.srcObject = stream;
//     video.onloadedmetadata = () => {
//       video.play();
//     };
//   }, [stream]);

//   const toggleFullScreen = () => {
//     setIsFullScreen((prev) => !prev);
//   };

//   return (
//     <div className="video_track_container relative">
//       <video
//         onClick={toggleFullScreen}
//         className={isFullScreen ? 'full_screen' : ''}
//         ref={videoRef}
//         autoPlay
//         width="100%"
//         height="100%"
//       >
//         <track kind="captions" srcLang="en" label="English" />
//       </video>
//       {showCountBadge && (
//         <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white rounded-full px-3 py-1 text-sm">
//           +{extraCount} more
//         </div>
//       )}
//     </div>
//   );
// }

// function VideoSection() {
//   const { streams, localStream } = useSelector((state) => state.room);
//   const [visibleStreams, setVisibleStreams] = useState([]);
//   const [extraStreamsCount, setExtraStreamsCount] = useState(0);

//   useEffect(() => {
//     // Combine local stream with other streams
//     const allStreams = localStream
//       ? [{ stream: localStream, id: 'local' }, ...streams]
//       : [...streams];

//     // Calculate how many streams to show (max 4)
//     const maxVisible = 4;
//     const visible = allStreams.slice(0, maxVisible);
//     const extraCount = Math.max(0, allStreams.length - maxVisible);

//     setVisibleStreams(visible);
//     setExtraStreamsCount(extraCount);
//   }, [streams, localStream]);

//   return (
//     <div className="video_section_container">
//       <div className="videos_portal_styles">
//         <div className="videos_grid_container">
//           {visibleStreams.map(({ stream, connectedUserSocketId, id }, index) => (
//             <StreamVideo
//               stream={stream}
//               key={id || connectedUserSocketId}
//               showCountBadge={index === visibleStreams.length - 1 && extraStreamsCount > 0}
//               extraCount={extraStreamsCount}
//             />
//           ))}
//         </div>
//       </div>
//       <VideoButtons />
//     </div>
//   );
// }

// export default VideoSection;

import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import VideoButtons from '../VideoButtons/VideoButtons';
import './Video.css';

function StreamVideo({ stream, showCountBadge, extraCount, isLocal }) {
  const videoRef = useRef();

  useEffect(() => {
    const video = videoRef.current;
    video.srcObject = stream;
    video.onloadedmetadata = () => {
      video.play();
    };
    if (isLocal) {
      video.muted = true; // Mute local stream by default
    }
  }, [stream, isLocal]);

  return (
    <div className={`video-container ${isLocal ? 'local-video' : ''}`}>
      <video ref={videoRef} autoPlay playsInline className="video-element" />
      {showCountBadge && (
        <div className="extra-count-badge">+{extraCount} more</div>
      )}
    </div>
  );
}

function VideoSection({
  handleMute,
  handleCamera,
  handleShare,
  handleStartRecording,
  handleStopRecording,
  leaveRoom,
  isMuted,
  isCameraOn,
  isConnectWithAudio,
  isShared,
  isRecording,
  screenSharingStream,
}) {
  const { streams, localStream } = useSelector((state) => state.room);
  const [visibleStreams, setVisibleStreams] = useState([]);
  const [extraStreamsCount, setExtraStreamsCount] = useState(0);
  const [gridClass, setGridClass] = useState('grid-1');
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
    };

    handleResize(); // Check on initial render
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Combine local stream with other streams
    const allStreams = localStream
      ? [{ stream: localStream, id: 'local', isLocal: true }, ...streams]
      : [...streams.map((s) => ({ ...s, isLocal: false }))];

    const participantCount = allStreams.length;

    // Determine grid layout based on participant count and screen size
    let maxVisible = participantCount;
    let gridLayout = 'grid-1';

    if (isMobileView) {
      // Mobile view - single participant at a time or 2 in landscape
      gridLayout = 'grid-horizontal-2'; // Use a special horizontal grid class
      maxVisible = Math.min(2, participantCount);
    } else {
      // Desktop view - original logic
      if (participantCount === 1) {
        gridLayout = 'grid-1';
        maxVisible = 1;
      } else if (participantCount === 2) {
        gridLayout = 'grid-2';
        maxVisible = 2;
      } else if (participantCount === 3) {
        gridLayout = 'grid-3';
        maxVisible = 3;
      } else if (participantCount >= 4) {
        gridLayout = 'grid-4';
        maxVisible = 4;
      }
    }

    const visible = allStreams.slice(0, maxVisible);
    const extraCount = Math.max(0, participantCount - maxVisible);

    setVisibleStreams(visible);
    setExtraStreamsCount(extraCount);
    setGridClass(gridLayout);
  }, [streams, localStream, isMobileView]);

  return (
    <div
      className={`video-section ${gridClass} ${isMobileView ? 'mobile-view' : ''}`}
    >
      <div className="video-grid">
        {visibleStreams.map(
          ({ stream, connectedUserSocketId, id, isLocal }, index) => (
            <StreamVideo
              stream={stream}
              key={id || connectedUserSocketId}
              showCountBadge={
                index === visibleStreams.length - 1 && extraStreamsCount > 0
              }
              extraCount={extraStreamsCount}
              isLocal={isLocal}
            />
          ),
        )}
      </div>

      <VideoButtons
        handleMute={handleMute}
        handleCamera={handleCamera}
        handleShare={handleShare}
        handleStartRecording={handleStartRecording}
        handleStopRecording={handleStopRecording}
        leaveRoom={leaveRoom}
        isMuted={isMuted}
        isCameraOn={isCameraOn}
        isConnectWithAudio={isConnectWithAudio}
        isShared={isShared}
        isRecording={isRecording}
        screenSharingStream={screenSharingStream}
      />
    </div>
  );
}

export default VideoSection;
