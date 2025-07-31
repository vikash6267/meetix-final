'use strict';

const Attendee = require('../models/Attendee');
const Session = require('../models/Session');

async function getJoin() {
    try {
        // Use dynamic import with await
        const { default: fetch } = await import('node-fetch');

        const API_KEY_SECRET = 'mirotalksfu_default_secret';
        const MIROTALK_URL = 'https://sfu.mirotalk.com/api/v1/join';
        //const MIROTALK_URL = 'http://localhost:3010/api/v1/join';

        const response = await fetch(MIROTALK_URL, {
            method: 'POST',
            headers: {
                authorization: API_KEY_SECRET,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                room: 'test',
                roomPassword: false,
                name: 'mirotalksfu',
                avatar: false,
                audio: false,
                video: false,
                screen: false,
                hide: false,
                notify: true,
                duration: 'unlimited',
                token: {
                    username: 'username',
                    password: 'password',
                    presenter: true,
                    expire: '1h',
                },
            }),
        });
        const data = await response.json();
        if (data.error) {
            console.log('Error:', data.error);
        } else {
            console.log('join:', data.join);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

getJoin();

// const socketToAttendeeMap = new Map();

// module.exports = function handleJoinSockets(io, socket) {
//     socket.on('join-session', async ({ sessionId, username, email }) => {
//         try {
//             let session = await Session.findOne({ sessionId });
//             if (!session) {
//                 session = await Session.create({ sessionId });
//             }

//             const attendee = await Attendee.create({
//                 name: username,
//                 email,
//                 session: session._id,
//                 socketId: socket.id
//             });

//             session.attendees.push(attendee._id);
//             await session.save();

//             socketToAttendeeMap.set(socket.id, attendee._id);
//             console.log(`${name} joined session ${sessionId}`);
//         } catch (err) {
//             console.error('Join error:', err);
//         }
//     });

//     socket.on('disconnect', async () => {
//         const attendeeId = socketToAttendeeMap.get(socket.id);
//         if (attendeeId) {
//             await Attendee.findByIdAndUpdate(attendeeId, { leaveTime: new Date() });
//             console.log(`Attendee ${attendeeId} disconnected`);
//             socketToAttendeeMap.delete(socket.id);
//         }
//     });
// }