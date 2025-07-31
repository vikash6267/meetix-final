// import { getTURNCredentials } from './api';

// let TURNIceServers = null;

// eslint-disable-next-line consistent-return
// export const fetchTURNCredentials = async () => {
//   try {
//     const responseData = await getTURNCredentials();

//     if (responseData.token?.iceServers) {
//       TURNIceServers = responseData.token.iceServers;
//     }

//     return TURNIceServers;
//   } catch (error) {
//     console.error(error);
//   }
// };

let TURNIceServers = [
  {
    urls: [
      'turn:turn01.hubl.in?transport=udp',
      'turn:turn02.hubl.in?transport=tcp',
      'turn:numb.viagenie.ca', 
      'turn:192.158.29.39:3478?transport=udp',
      'turn:192.158.29.39:3478?transport=tcp',
      'turn:turn.bistri.com:80',
      'turn:turn.anyfirewall.com:443?transport=tcp'
    ],
    username: 'webrtc@live.com',
    credential: 'muazkh',
  }
];


export const getTurnIceServers = () => {
  return TURNIceServers;
};
