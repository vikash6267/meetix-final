import React from 'react';

function Message({ message, sameAuthor }) {
  const {
    username,
    content,
    messageCreatedByMe,
  } = message;

  return (
    <div
      className={`message_container message_align_${messageCreatedByMe ? 'right' : 'left'}`}
    >
      {!sameAuthor && (
        <p className="message_title">
          {messageCreatedByMe ? 'You' : username}
        </p>
      )}
      <p
        className={`message_content message_${messageCreatedByMe ? 'right' : 'left'}_styles`}
      >
        {content}
      </p>
    </div>
  );
}

export default Message;
