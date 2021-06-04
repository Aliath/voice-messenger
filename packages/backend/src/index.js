require('dotenv').config();
const cors = require('cors');
const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const socketController = require('./lib/socketController');

const expressServer = express();
expressServer.use(cors());
expressServer.use(express.static(path.resolve('../frontend/build')));
expressServer.get('/ping', (_, res) => res.status(200).send({ pong: Date.now() }));

const httpServer = expressServer.listen(process.env.PORT || 8080);
const socketServer = socketIO(httpServer, {
  cors: {
    origin: '*',
    methods: ["GET", "POST", "UPDATE"]
  }
});
socketController(socketServer);

