import { configureStore } from '@reduxjs/toolkit';
import roomReducer from '../features/room';

const store = configureStore({
  reducer: {
    room: roomReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: {
      ignoreActions: [
        'room/setStreams',
        'room/setLocalStream',
      ],
      ignoredPaths: [
        'room.streams',
        'room.localStream',
      ],
    },
  }),
});

export default store;
