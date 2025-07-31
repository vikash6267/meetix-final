import React from 'react';

function VideoButton({ children, handleClick }) {
  return (
    <div
      onClick={handleClick}
      aria-hidden="true"
      className="video_button_container"
    >
      {children}
    </div>
  );
}

export default VideoButton;
