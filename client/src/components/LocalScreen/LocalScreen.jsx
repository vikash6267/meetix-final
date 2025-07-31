import React, { useEffect, useRef } from 'react';

function LocalScreen({ stream }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;

    video.srcObject = stream;
    video.onloadedmetadata = () => {
      video.play();
    };
  }, [stream]);

  return (
    <div className="local_screen_share_preview">
      <video ref={videoRef} muted autoPlay>
        <track kind="captions" srcLang="en" label="English" />
      </video>
    </div>
  );
}

export default LocalScreen;
