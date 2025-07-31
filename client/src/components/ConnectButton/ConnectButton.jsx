import React from 'react';
import { useNavigate } from 'react-router-dom';

function ConnectButton({ children, isJoinBtn }) {
  const navigate = useNavigate();

  const onClickHandler = () => {
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
      alert("To start or join a meet you should login first")
      navigate('/login');
    } else {
      // Proceed to room based on button type
      navigate(`join-room${!isJoinBtn ? '?host=true' : ''}`);
    }
  };

  return (
    <button
      type="button"
      className={isJoinBtn ? 'join_room_button' : 'create_room_button'}
      onClick={onClickHandler}
    >
      {children}
    </button>
  );
}

export default ConnectButton;
