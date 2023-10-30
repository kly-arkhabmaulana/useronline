const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const onlineUsers = new Set(); // Daftar pengguna online

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  onlineUsers.add(socket.id); // Menambahkan pengguna ke daftar pengguna online

  // Kirim jumlah pengguna online ke semua klien
  io.emit('online-users', onlineUsers.size);

  socket.on('disconnect', () => {
    onlineUsers.delete(socket.id); // Menghapus pengguna dari daftar pengguna online
    io.emit('online-users', onlineUsers.size);
  });
});

app.use(express.static(__dirname));

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
