const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const onlineUsers = new Set();

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  onlineUsers.add(socket.id);

  io.emit('online-users', onlineUsers.size);

  socket.on('disconnect', () => {
    onlineUsers.delete(socket.id); 
    io.emit('online-users', onlineUsers.size);
  });
});

app.use(express.static(__dirname));

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
