import io from 'socket.io-client';
import store from '../store/store';
import { actions } from '../features/room';
import { handleSignalData, prepareNewPeerConnection, removePeerConnection } from '../utils/webRTCHandler';
import { appendMessageToHistory } from '../utils/directMessages';

const socket = io('https://webinar-backend-sa37.onrender.com');
const { dispatch } = store;

export const connetWithSocket = () => {
  socket.on('connect', () => {
    dispatch(actions.setSocketId(socket.id));
  });

  socket.on('room-id', (data) => {
    dispatch(actions.setRoomId(data.roomId));
  });

  socket.on('room-update', (data) => {
    dispatch(actions.setParticipants(data.connectedUsers));
  });

  socket.on('connection-prepare', (data) => {
    const { connectedUserSocketId } = data;
    prepareNewPeerConnection(connectedUserSocketId, false);

    socket.emit('connection-init', { connectedUserSocketId });
  });

  socket.on('connection-signal', (data) => {
    handleSignalData(data);
  });

  socket.on('connection-init', (data) => {
    prepareNewPeerConnection(data.connectedUserSocketId, true);
  });

  socket.on('user-disconnected', (data) => {
    removePeerConnection(data);
  });

  socket.on('direct-message', (data) => {
    appendMessageToHistory(data);
  });
};

export const createNewRoom = (username, onlyAudio) => {
  socket.emit('create-new-room', { username, onlyAudio });
};

export const joinRoom = (roomId, username, onlyAudio) => {
  socket.emit('join-room', { roomId, username, onlyAudio });
};

export const signalPeerData = (data) => {
  socket.emit('connection-signal', data);
};

export const sendDirectMessage = (data) => {
  socket.emit('direct-message', data);
};