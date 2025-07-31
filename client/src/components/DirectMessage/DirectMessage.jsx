import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { IoIosSend } from 'react-icons/io';
import { sendDirectMessage } from '../../socket/socket';
import Input from '../Input/Input';

function DirectMessage() {
  const [message, setMessage] = useState('');
  const { activeConversation, username } = useSelector((state) => state.room);

  const sendMessage = () => {
    sendDirectMessage({
      receiverSocketId: activeConversation.socketId,
      username,
      messageContent: message,
    });

    setMessage('');
  };

  const handleTextChange = (event) => {
    setMessage(event.target.value);
  };

  const handleKeyPressed = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="new_message_container new_message_direct_border">
      <div className="new_message_input_container">
      <Input
        value={message}
        handleChange={handleTextChange}
        placeholder="Type your message ..."
        onKeyDown={handleKeyPressed}
        className="new_message_input"
      />
      <IoIosSend className="new_message_button pr-0" onClick={sendMessage} />
      </div>
    </div>
  );
}

export default DirectMessage;
