const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const activeUsers = []; // array menyimpan data user yang aktif

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

function getRandomInitial() {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const randomIndex = Math.floor(Math.random() * alphabet.length);
  return alphabet[randomIndex];
}

io.on('connection', (socket) => {
  const uniqueID = uuidv4(); // generate unique id
  const initialName = getRandomInitial(); // random alphabet

  const user = { id: uniqueID, name: initialName }; // buat objek user
  activeUsers.push(user); // menambahkan objek user ke dalam array activeUsers

  socket.emit('active-users', activeUsers);

  // mengirim jumlah user online ke semua user
  io.emit('online-users', activeUsers);

  socket.on('disconnect', () => {
    // menghapus user dari array saat user disconnect
    const index = activeUsers.findIndex((u) => u.id === uniqueID);
    if (index !== -1) {
      activeUsers.splice(index, 1);
      io.emit('online-users', activeUsers);
    }
  });
});

app.use(express.static(__dirname));

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});