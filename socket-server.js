const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('🚀 Socket.IO Server is running');
});

app.post('/notify', (req, res) => {
  const { remaining } = req.body;
  io.emit('remaining_updated', { remaining });
  console.log('📬 Notification reçue de Laravel:', remaining);
  res.status(200).json({ message: 'Notification envoyée aux clients.' });
});

io.on('connection', (socket) => {
  console.log('Nouveau client connecté:', socket.id);
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Socket.IO server running on port ${PORT}`);
});
