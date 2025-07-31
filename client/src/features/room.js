import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  localStream: null,
  streams: [],
  participants: [],
  roomId: null,
  username: null,
  isRoomHost: false,
  isLoad: true,
  messages: [],
  activeConversation: null,
  directChatHistory: [],
  socketId: null,
  scheduleData: null, // Add this line
  scheduledMeetings: [], // Add this to store multiple scheduled meetings
};

const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    setSocketId: (state, action) => {
      state.socketId = action.payload;
    },
    setDirectHistory: (state, action) => {
      state.directChatHistory = action.payload;
    },
    setActiveConversation: (state, action) => {
      state.activeConversation = action.payload;
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    setLocalStream: (state, action) => {
      state.localStream = action.payload;
    },
    setStreams: (state, action) => {
      state.streams.push(action.payload);
    },
    removeStream: (state, action) => {
      state.streams = state.streams.filter(
        (s) => s.connectedUserSocketId !== action.payload,
      );
    },
    setIsRoomHost: (state, action) => {
      state.isRoomHost = action.payload;
    },
    setRoomId: (state, action) => {
      state.roomId = action.payload;
    },
    setUserName: (state, action) => {
      state.username = action.payload;
    },
    setIsLoad: (state, action) => {
      state.isLoad = action.payload;
    },
    setParticipants: (state, action) => {
      state.participants = action.payload;
    },
    setScheduleData: (state, action) => {
      state.scheduleData = action.payload;
    },
  },
});

export default roomSlice.reducer;

export const { actions } = roomSlice;