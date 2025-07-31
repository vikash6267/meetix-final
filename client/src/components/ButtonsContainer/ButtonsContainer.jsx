import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Button from '../Button/Button';

function ButtonsContainer({ handleJoin, handleSchedule }) {
  const { isRoomHost } = useSelector((state) => state.room);
  const navigate = useNavigate();
  const handleCancel = () => {
    navigate('/');
  };

  return (
    <>
      <div className="join_room_buttons_container flex flex-wrap gap-3">
        <Button success handleClick={handleJoin}>
          {isRoomHost ? 'Host' : 'Join'}
        </Button>
        <Button handleClick={handleCancel}>Cancel</Button>
        {handleSchedule && (
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            onClick={handleSchedule}
          >
            Schedule Meeting
          </button>
        )}
      </div>
    </>
  );
}

export default ButtonsContainer;
