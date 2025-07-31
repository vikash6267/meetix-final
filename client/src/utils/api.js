import axios from 'axios';

const serverApi = 'https://webinar-backend-sa37.onrender.com/api';

export const getRoomExists = async (roomId) => {
  try {
    const response = await axios.get(`${serverApi}/room-exists/${roomId}`);

    return response.data;
  } catch (error) {
    throw error;
  }
};

// utils/api.js
export const scheduleMeeting = async (meetingData) => {
  try {
    const response = await fetch(
      'https://webinar-backend-sa37.onrender.com/schedule-meeting',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(meetingData),
      },
    );
    return await response.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getScheduledMeetings = async () => {
  try {
    const response = await fetch(
      'https://webinar-backend-sa37.onrender.com/scheduled-meetings',
    );
    return await response.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// export const getTURNCredentials = async () => {
//   try {
//     const response = await axios.get(`${serverApi}/get-turn-credentials`);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };
