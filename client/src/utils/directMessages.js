import { actions } from '../features/room';
import store from '../store/store';

export const appendMessageToHistory = (data) => {
  const { receiverSocketId, isAuthor, authorSocketId } = data;
  const socketId = isAuthor ? receiverSocketId : authorSocketId;

  addMessage(socketId, data);
};

const addMessage = (socketId, data) => {
  const { directChatHistory } = store.getState().room;
  const userHistory = directChatHistory.find((h) => h.socketId === socketId);

  if (userHistory) {
    const newDirectMessage = {
      isAuthor: data.isAuthor,
      messageContent: data.messageContent,
      usename: data.usename,
    };

    const newUserChatHistory = {
      ...userHistory,
      chatHistory: [...userHistory.chatHistory, newDirectMessage],
    };

    const newChatHistory = [
      ...directChatHistory.filter((h) => h.socketId !== socketId),
      newUserChatHistory,
    ];

    store.dispatch(actions.setDirectHistory(newChatHistory));
  } else {
    const newUserChatHistory = {
      socketId,
      chatHistory: [
        {
          isAuthor: data.isAuthor,
          messageContent: data.messageContent,
          username: data.username,
        },
      ],
    };

    store.dispatch(
      actions.setDirectHistory([...directChatHistory, newUserChatHistory]),
    );
  }
};
