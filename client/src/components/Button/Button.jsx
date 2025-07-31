import React from 'react';

function Button({ children, handleClick, success }) {
  return (
    <button
      className={`join_room_${success ? 'success' : 'cancel'}_button`}
      type="button"
      onClick={handleClick}
    >
      {children}
    </button>
  );
}

export default Button;
