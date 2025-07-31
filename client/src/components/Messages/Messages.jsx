import React from 'react';
import { useSelector } from 'react-redux';
import Message from '../Message/Message';

function Messages() {
  const { messages } = useSelector((state) => state.room);

  return (
    <div className="messages_container">
      {messages.map((message, i) => {
        const sameAuthor = i && message.username === messages[i - 1].username;

        return (
          <Message
            sameAuthor={sameAuthor}
            key={`${message.content}${i + 1}`}
            message={message}
          />
        );
      })}
    </div>
  );
}

export default Messages;
