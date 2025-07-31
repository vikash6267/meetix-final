# Integrating HeimatTalk SFU with ReactJS

This guide will help you integrate the HeimatTalk SFU (Selective Forwarding Unit) video conferencing platform into your ReactJS application.

## Prerequisites

- Node.js (v18 or higher)
- React (v16.8+ with Hooks support)
- HeimatTalk SFU server running (either locally or hosted)

## Installation

```bash
npm install axios socket.io-client mediasoup-client
```

## Configuration

Create a `.env` file in your React project root:

```
REACT_APP_HEIMATTALK_API_URL=https://your-heimattalk-server.com/api/v1
REACT_APP_HEIMATTALK_SOCKET_URL=https://your-heimattalk-server.com
REACT_APP_HEIMATTALK_API_KEY=your_heimattalk_api_key
```

## Basic API Client

Create a file `src/services/heimattalkService.js`:

```javascript
import axios from 'axios';

const API_URL = process.env.REACT_APP_HEIMATTALK_API_URL;
const API_KEY = process.env.REACT_APP_HEIMATTALK_API_KEY;

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': API_KEY
  }
});

export const getStats = async () => {
  const response = await apiClient.get('/stats');
  return response.data;
};

export const getMeetings = async () => {
  const response = await apiClient.get('/meetings');
  return response.data;
};

export const createMeeting = async () => {
  const response = await apiClient.post('/meeting');
  return response.data;
};

export const createJoinURL = async (joinOptions) => {
  const response = await apiClient.post('/join', joinOptions);
  return response.data;
};

export const getToken = async (tokenOptions) => {
  const response = await apiClient.post('/token', tokenOptions);
  return response.data;
};
```

## Room Client Component

Create a file `src/components/VideoRoom.js`:

```jsx
import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import * as mediasoupClient from 'mediasoup-client';

const VideoRoom = ({ roomId, username, token }) => {
  const socketRef = useRef(null);
  const localVideoRef = useRef(null);
  const localAudioRef = useRef(null);
  const remoteVideosContainerRef = useRef(null);
  const roomClientRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initRoom = async () => {
      try {
        // Connect to socket
        socketRef.current = io(process.env.REACT_APP_HEIMATTALK_SOCKET_URL, {
          transports: ['websocket'],
          query: {
            roomId,
            username,
            token
          }
        });

        // Initialize room client
        const roomClient = new RoomClient(
          localAudioRef.current,
          null, // Remote audio element will be created dynamically
          remoteVideosContainerRef.current,
          null, // Video Pin container not needed for basic implementation
          mediasoupClient,
          socketRef.current,
          roomId,
          username,
          generateUUID(), // Generate a UUID for this peer
          {}, // Peer info (can be extended)
          true, // isAudioAllowed
          true, // isVideoAllowed
          false, // isScreenAllowed
          false, // joinWithScreen
          true, // isSpeechSynthesisSupported
          false, // transcription
          () => setIsConnected(true) // Success callback
        );

        // Store reference to room client
        roomClientRef.current = roomClient;

        // Socket event listeners
        socketRef.current.on('connect', () => {
          console.log('Socket connected');
          roomClient.join();
        });

        socketRef.current.on('disconnect', () => {
          console.log('Socket disconnected');
          setIsConnected(false);
        });

        // Cleanup on unmount
        return () => {
          if (roomClientRef.current) {
            roomClientRef.current.exit(true);
          }
          if (socketRef.current) {
            socketRef.current.disconnect();
          }
        };
      } catch (err) {
        console.error('Failed to initialize room:', err);
        setError(err.message);
      }
    };

    initRoom();
  }, [roomId, username, token]);

  // Simplified UUID generator for this example
  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  // Function to toggle audio
  const toggleAudio = () => {
    if (roomClientRef.current) {
      if (roomClientRef.current.producerExist('audio')) {
        roomClientRef.current.closeProducer('audio');
      } else {
        roomClientRef.current.produce('audio');
      }
    }
  };

  // Function to toggle video
  const toggleVideo = () => {
    if (roomClientRef.current) {
      if (roomClientRef.current.producerExist('video')) {
        roomClientRef.current.closeProducer('video');
      } else {
        roomClientRef.current.produce('video');
      }
    }
  };

  // Function to toggle screen sharing
  const toggleScreenShare = () => {
    if (roomClientRef.current) {
      if (roomClientRef.current.producerExist('screen')) {
        roomClientRef.current.closeProducer('screen');
      } else {
        roomClientRef.current.produce('screen');
      }
    }
  };

  // Function to leave the room
  const leaveRoom = () => {
    if (roomClientRef.current) {
      roomClientRef.current.exit(true);
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    }
  };

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="video-room">
      <div className="controls">
        <button onClick={toggleAudio}>Toggle Audio</button>
        <button onClick={toggleVideo}>Toggle Video</button>
        <button onClick={toggleScreenShare}>Toggle Screen Share</button>
        <button onClick={leaveRoom}>Leave Room</button>
      </div>
      
      <div className="video-container">
        <div className="local-video">
          <video ref={localVideoRef} autoPlay playsInline muted></video>
          <audio ref={localAudioRef} autoPlay playsInline muted></audio>
        </div>
        <div ref={remoteVideosContainerRef} className="remote-videos"></div>
      </div>
    </div>
  );
};

export default VideoRoom;
```

## Meeting Creation Component

Create a file `src/components/CreateMeeting.js`:

```jsx
import React, { useState } from 'react';
import { createMeeting, createJoinURL } from '../services/heimattalkService';

const CreateMeeting = () => {
  const [meetingUrl, setMeetingUrl] = useState('');
  const [customRoomId, setCustomRoomId] = useState('');
  const [usePassword, setUsePassword] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCreateStandardMeeting = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { meeting } = await createMeeting();
      setMeetingUrl(meeting);
    } catch (err) {
      setError('Failed to create meeting: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCustomMeeting = async () => {
    if (!customRoomId) {
      setError('Please enter a room ID');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const options = {
        room: customRoomId,
        roomPassword: usePassword ? password : false,
        name: 'Host',
        audio: true,
        video: true,
        screen: false,
        hide: false,
        notify: true
      };
      
      const { join } = await createJoinURL(options);
      setMeetingUrl(join);
    } catch (err) {
      setError('Failed to create custom meeting: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-meeting">
      <h2>Create a Meeting</h2>
      
      <div className="standard-meeting">
        <h3>Standard Meeting</h3>
        <button 
          onClick={handleCreateStandardMeeting} 
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Meeting'}
        </button>
      </div>
      
      <div className="custom-meeting">
        <h3>Custom Meeting</h3>
        <div>
          <label htmlFor="roomId">Room ID:</label>
          <input 
            type="text" 
            id="roomId" 
            value={customRoomId} 
            onChange={(e) => setCustomRoomId(e.target.value)} 
            placeholder="Enter custom room ID"
          />
        </div>
        
        <div>
          <label>
            <input 
              type="checkbox" 
              checked={usePassword} 
              onChange={(e) => setUsePassword(e.target.checked)} 
            />
            Use Password
          </label>
        </div>
        
        {usePassword && (
          <div>
            <label htmlFor="password">Password:</label>
            <input 
              type="password" 
              id="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Enter room password"
            />
          </div>
        )}
        
        <button 
          onClick={handleCreateCustomMeeting} 
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Custom Meeting'}
        </button>
      </div>
      
      {error && <div className="error">{error}</div>}
      
      {meetingUrl && (
        <div className="meeting-result">
          <h3>Meeting URL:</h3>
          <div className="url-container">
            <input type="text" readOnly value={meetingUrl} />
            <button onClick={() => navigator.clipboard.writeText(meetingUrl)}>
              Copy
            </button>
          </div>
          <div className="join-button">
            <a href={meetingUrl} target="_blank" rel="noopener noreferrer">
              Join Meeting
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateMeeting;
```

## Embedded Meeting Component

Create a file `src/components/EmbeddedMeeting.js`:

```jsx
import React from 'react';

const EmbeddedMeeting = ({ url }) => {
  return (
    <div className="embedded-meeting">
      <iframe
        title="HeimatTalk SFU Meeting"
        src={url}
        allow="camera; microphone; display-capture; fullscreen; clipboard-read; clipboard-write; web-share; autoplay"
        style={{ height: '100vh', width: '100%', border: 0 }}
      ></iframe>
    </div>
  );
};

export default EmbeddedMeeting;
```

## Main Application Component

Create or update your `src/App.js`:

```jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { getStats } from './services/heimattalkService';
import CreateMeeting from './components/CreateMeeting';
import EmbeddedMeeting from './components/EmbeddedMeeting';
import VideoRoom from './components/VideoRoom';
import './App.css';

function App() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <Router>
      <div className="app">
        <header>
          <h1>HeimatTalk SFU React Integration</h1>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/create">Create Meeting</Link>
            <Link to="/join">Join Meeting</Link>
          </nav>
        </header>

        <main>
          <Routes>
            <Route 
              path="/" 
              element={
                <div className="home">
                  <h2>HeimatTalk SFU Dashboard</h2>
                  {loading ? (
                    <p>Loading statistics...</p>
                  ) : stats ? (
                    <div className="stats">
                      <p>Active Rooms: {stats.totalRooms}</p>
                      <p>Active Participants: {stats.totalPeers}</p>
                      <p>Last Updated: {new Date(stats.timestamp).toLocaleString()}</p>
                    </div>
                  ) : (
                    <p>Failed to load statistics</p>
                  )}
                </div>
              } 
            />

            <Route path="/create" element={<CreateMeeting />} />
            
            <Route 
              path="/join" 
              element={
                <div className="join-meeting">
                  <h2>Join Meeting</h2>
                  <div className="join-form">
                    <label htmlFor="meetingUrl">Meeting URL or Room ID:</label>
                    <input 
                      type="text" 
                      id="meetingUrl" 
                      placeholder="Enter meeting URL or room ID"
                    />
                    <button>Join</button>
                  </div>
                  <p>Or join our demo room:</p>
                  <EmbeddedMeeting url={`${process.env.REACT_APP_HEIMATTALK_SOCKET_URL}/join/demo`} />
                </div>
              } 
            />
            
            <Route 
              path="/room/:roomId" 
              element={<VideoRoom />} 
            />
          </Routes>
        </main>

        <footer>
          <p>Powered by HeimatTalk SFU</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
```

## Styles

Create or update `src/App.css`:

```css
/* Base styles */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: Arial, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f4f4f4;
}

.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

header {
  background-color: #356E23;
  color: white;
  padding: 1rem;
}

header h1 {
  margin-bottom: 1rem;
}

nav {
  display: flex;
  gap: 1rem;
}

nav a {
  color: white;
  text-decoration: none;
  padding: 0.5rem;
  border-radius: 4px;
}

nav a:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

main {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

footer {
  background-color: #333;
  color: white;
  text-align: center;
  padding: 1rem;
  margin-top: auto;
}

/* Component styles */
.create-meeting,
.join-meeting,
.home {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.standard-meeting,
.custom-meeting {
  margin-bottom: 2rem;
}

h2 {
  margin-bottom: 1.5rem;
  color: #356E23;
}

h3 {
  margin-bottom: 1rem;
  color: #444;
}

button {
  background-color: #356E23;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

button:hover {
  background-color: #2a5a1e;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

label {
  display: block;
  margin-bottom: 0.5rem;
}

.error {
  color: #e74c3c;
  margin: 1rem 0;
}

.meeting-result {
  margin-top: 2rem;
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.url-container {
  display: flex;
  margin-bottom: 1rem;
}

.url-container input {
  flex: 1;
  margin-bottom: 0;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.url-container button {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.join-button a {
  display: inline-block;
  background-color: #356E23;
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-align: center;
  width: 100%;
}

.stats {
  background-color: #f0f8ff;
  padding: 1rem;
  border-radius: 4px;
  margin-top: 1rem;
}

/* Video room styles */
.video-room {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.controls {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background-color: #f4f4f4;
  border-radius: 8px 8px 0 0;
}

.video-container {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 1rem;
  background-color: #333;
  border-radius: 0 0 8px 8px;
}

.local-video {
  width: 20%;
  min-width: 200px;
}

.local-video video {
  width: 100%;
  border-radius: 8px;
}

.remote-videos {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.embedded-meeting {
  height: 600px;
  margin-top: 1rem;
}
```

## Implementation Notes

1. **RoomClient Implementation**: This example assumes you'll implement or import the `RoomClient` class from the HeimatTalk SFU project, which manages WebRTC connections using mediasoup.

2. **Route Parameters**: The `/room/:roomId` route is designed to accept a room ID parameter, which you'd use to join a specific meeting.

3. **Environment Variables**: Make sure to set the correct environment variables in your `.env` file.

4. **Mediasoup Integration**: For a full implementation, you'll need to adapt the `RoomClient` class from the HeimatTalk SFU project to work with React.

5. **Error Handling**: Add more robust error handling in a production environment.

## Full Integration

For a complete integration, you'll need to adapt the server's `RoomClient.js` implementation to work within your React application. This will involve understanding the WebRTC and mediasoup-specific code from the HeimatTalk SFU project.
