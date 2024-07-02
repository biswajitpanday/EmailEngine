import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3000'; // Replace with your backend URL

const socket = io(SOCKET_URL, {
  transports: ['websocket'], // Optional, depending on your needs
  withCredentials: true,
});

socket.on('connect', () => {
    console.log('Connected to WebSocket server');
  });
  
  socket.on('connect_error', (error) => {
    console.error('WebSocket connection error:', error);
  });
  
  socket.on('disconnect', () => {
    console.log('Disconnected from WebSocket server');
  });

export default socket;
