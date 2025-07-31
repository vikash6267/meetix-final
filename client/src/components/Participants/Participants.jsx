import React, { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from '../../features/room';
import { FaUserCircle } from 'react-icons/fa'; // Import the user icon

function Participants() {
  const { participants, socketId } = useSelector((state) => state.room);
  const dispatch = useDispatch();

  const openChatBox = (user) => () => {
    if (user.socketId !== socketId) {
      dispatch(actions.setActiveConversation(user));
    }
  };

  return (
    <div className="participants_container">
      {participants.map((user) => (
        <Fragment key={user.id}>
          <div
            className="participant_item flex items-center gap-3 cursor-pointer"
            onClick={openChatBox(user)}
            aria-hidden
          >
            {/* Participant icon */}
            <FaUserCircle size={18} className="text-gray-700 -mr-10" />
            <p className="participants_paragraph">{user.username}</p>
          </div>
        </Fragment>
      ))}
    </div>
  );
}

export default Participants;
