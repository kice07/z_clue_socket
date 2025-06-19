const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const bodyParser = require('body-parser'); // pour lire les données POST

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(bodyParser.json()); // nécessaire pour lire le JSON dans les requêtes POST

// Route POST /notify (appelée par Laravel)
app.post('/notify', (req, res) => {
  const { remaining } = req.body;

  // 💬 Émettre l'événement à tous les clients connectés
  io.emit('remaining_updated', { remaining });

  console.log('📬 Notification reçue de Laravel:', remaining);
  res.status(200).json({ message: 'Notification envoyée aux clients.' });
});

// WebSocket
io.on('connection', (socket) => {
  console.log('Nouveau client connecté:', socket.id);
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`🚀 Socket.IO server running at http://localhost:${PORT}`);
});
// 