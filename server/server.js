//======================================================================
// set up
//======================================================================
const express = require('express');
const app = express();
const port = 5000;
const http = require('http');
const server = http.createServer(app);
const socketIO = require('socket.io');
const io = socketIO(server);
const SocketManager = require('./SocketManager');
//======================================================================

// ルーティング
require('./routes/routes')(app);

// Socket接続
io.sockets.on('connection', SocketManager);

// Listen
server.listen(port, (err) => {
    if (err) throw err
    console.log(`Server started on port ${port}`);
});
