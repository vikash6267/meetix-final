// const express = require('express');
// const http = require('http');
// const mongoose = require('mongoose');
// const { Server } = require('socket.io');
// const handleSocket = require('./join/join.js');

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: '*'
//   }
// });

// mongoose.connect('mongodb+srv://gaurav0503:Gaurav7409@cluster0.nndflme.mongodb.net/zoom-clone-database', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// }).then(() => console.log('MongoDB connected'))
//   .catch(err => console.error('MongoDB error', err));

// io.on('connection', (socket) => {
//   console.log('New client connected:', socket.id);
//   handleSocket(io, socket);
// });

// const PORT = 5000;
// server.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });
