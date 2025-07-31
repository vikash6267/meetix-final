import React, { useState } from 'react';
import { IoIosSend } from 'react-icons/io';
import { sendMessageUsingDataChannel } from '../../utils/webRTCHandler';
import Input from '../Input/Input';

function NewMessage() {
  const [message, setMessage] = useState('');

  const handleChange = (event) => {
    setMessage(event.target.value);
  };

  const sendMessage = () => {
    if (message.length) {
      sendMessageUsingDataChannel(message);
      setMessage('');
    }
  };

  const handleKeyPressed = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();

      sendMessage();
    }
  };

  return (
    <div className="new_message_container">
      <div className="new_message_input_container">
      <Input
        value={message}
        handleChange={handleChange}
        placeholder="Type your message ..."
        onKeyDown={handleKeyPressed}
        className="new_message_input"
      />

      <IoIosSend className="new_message_button" onClick={sendMessage} />
      </div>
    </div>
  );
}

export default NewMessage;
