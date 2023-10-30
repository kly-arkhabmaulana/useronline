const http = require('http');
const socketIO = require('socket.io');

const server = http.createServer();
const io = socketIO(server);

const onlineUsers = new Set(); // Daftar pengguna online

io.on('connection', (socket) => {
  onlineUsers.add(socket.id); // Menambahkan pengguna ke daftar pengguna online

  // Kirim jumlah pengguna online ke semua klien
  io.emit('online-users', onlineUsers.size);

  socket.on('disconnect', () => {
    onlineUsers.delete(socket.id); // Menghapus pengguna dari daftar pengguna online
    io.emit('online-users', onlineUsers.size);
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
