/* eslint-disable guard-for-in */
import Peer from 'simple-peer';
import { actions } from '../features/room';
import * as socketConnection from '../socket/socket';
import store from '../store/store';
// import { fetchTURNCredentials, getTurnIceServers } from "./turn"
import { getTurnIceServers } from './turn';

const defaultConstrains = {
  video: {
    width: 480,
    height: 360,
  },
  audio: true,
};

const audioConstrains = {
  video: false,
  audio: true,
};

const peers = {};

const { dispatch } = store;

export const getLocalPreviewAndInitConnection = async (
  isRoomHost,
  username,
  roomId,
  onlyAudio,
) => {
  // await fetchTURNCredentials();

  const constrains = onlyAudio ? audioConstrains : defaultConstrains;

  try {
    const stream = await navigator.mediaDevices.getUserMedia(constrains);

    if (isRoomHost) {
      socketConnection.createNewRoom(username, onlyAudio);
    } else {
      socketConnection.joinRoom(roomId, username, onlyAudio);
    }
    store.dispatch(actions.setLocalStream(stream));
  } catch (error) {
    console.error(error);
  } finally {
    dispatch(actions.setIsLoad(false));
  }
};

const getConfiguration = () => {
  const turnIceServers = getTurnIceServers();

  if (turnIceServers) {
    return {
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }, ...turnIceServers],
    };
  }

  return {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
  };
};

const messengerChannel = 'messenger';

export const prepareNewPeerConnection = (
  connectedUserSocketId,
  isInitiator,
) => {
  const configuration = getConfiguration();
  const { localStream } = store.getState().room;

  peers[connectedUserSocketId] = new Peer({
    initiator: isInitiator,
    config: configuration,
    stream: localStream,
    channelName: messengerChannel,
  });

  peers[connectedUserSocketId].on('signal', (data) => {
    const signalData = {
      signal: data,
      connectedUserSocketId,
    };

    socketConnection.signalPeerData(signalData);
  });

  peers[connectedUserSocketId].on('stream', (stream) => {
    addStream(stream, connectedUserSocketId);
  });

  peers[connectedUserSocketId].on('data', (data) => {
    const messageData = JSON.parse(data);

    appendNewMessage(messageData);
  });
};

export const handleSignalData = (data) => {
  peers[data.connectedUserSocketId].signal(data.signal);
};

export const removePeerConnection = (data) => {
  const { socketId } = data;
  if (peers[socketId]) {
    peers[socketId].destroy();
  }

  delete peers[socketId];

  dispatch(actions.removeStream(socketId));
};

const addStream = (stream, connectedUserSocketId) => {
  dispatch(actions.setStreams({ connectedUserSocketId, stream }));
};

export const toggleScreenShare = (isShared, screenSharedStream = null) => {
  const { localStream } = store.getState().room;

  if (isShared) {
    switchVideoTracks(localStream);
  } else {
    switchVideoTracks(screenSharedStream);
  }
};

const switchVideoTracks = (stream) => {
  for (const socketId of Object.keys(peers)) {
    for (const index in peers[socketId].streams[0].getTracks()) {
      for (const index2 in stream.getTracks()) {
        if (
          peers[socketId].streams[0].getTracks()[index].kind
          === stream.getTracks()[index2].kind
        ) {
          peers[socketId].replaceTrack(
            peers[socketId].streams[0].getTracks()[index],
            stream.getTracks()[index2],
            peers[socketId].streams[0],
          );
          break;
        }
      }
    }
  }
};

const appendNewMessage = (messageData) => {
  const { messages } = store.getState().room;

  dispatch(actions.setMessages([...messages, messageData]));
};

export const sendMessageUsingDataChannel = (message) => {
  const { username } = store.getState().room;
  const localMessageData = {
    content: message,
    username,
    messageCreatedByMe: true,
  };

  appendNewMessage(localMessageData);

  const messageData = {
    content: message,
    username,
    messageCreatedByMe: false,
  };

  const stringifiedMessageData = JSON.stringify(messageData);

  for (const socketId of Object.keys(peers)) {
    peers[socketId].send(stringifiedMessageData);
  }
};
