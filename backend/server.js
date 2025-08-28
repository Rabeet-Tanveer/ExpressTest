require('dotenv').config();
const app = require('./app');
const http = require('http');
const server = http.createServer(app);

const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const bbg = io.of('/bbg');
// Make io accessible in your app
app.set('io', io);
app.set('bbg', bbg);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
