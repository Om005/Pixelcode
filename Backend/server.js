import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import axios from 'axios';

import connectdb from "./config/mongodb.js";
import authRouter from './routes/authRoutes.js';
import userRouter from "./routes/userRoutes.js";
import fileRouter from "./routes/fileRoutes.js";
import chatRouter from "./routes/chatRouter.js";
import projectRouter from "./routes/projectRoutes.js";
import roomRouter from "./routes/roomRoutes.js"

const app = express();
const port = process.env.PORT || 4000;
connectdb();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ['https://pixelcode-nine.vercel.app', 'http://localhost:5173'],
    credentials: true
  }
});

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: ['https://pixelcode-nine.vercel.app', 'http://localhost:5173'], credentials: true }));

app.get('/health', (req, res) => {
  res.status(200).send('Server is healthy');
});

app.get('/', (req, res) => {
  res.send("API is Working");
});

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/file', fileRouter);
app.use('/api/chat', chatRouter);
app.use('/api/project', projectRouter);
app.use('/api/room', roomRouter);
io.on('connection', (socket) => {


  socket.on('join-room', async(roomId, username, email)=>{
    // socket.join(roomId);
    // console.log(`${socket.id} joined room ${roomId}`);
  
    // socket.to(roomId).emit('user-joined', username);
    
    socket.join(roomId);
    socket.data.username = username; // Store user info on socket
    socket.data.roomId = roomId
    socket.data.email = email;

    // Notify others
    socket.to(roomId).emit("user-joined", username);

    // Send updated user list to everyone in the room
    const clients = await io.in(roomId).fetchSockets();
    const users = clients.map((s) => ({
      username: s.data.username,
      email: s.data.email
    }));
    io.to(roomId).emit("room-users", users);
  })
  socket.on('file-deleted', (roomId, node)=>{
    socket.to(roomId).emit('update-delete', node)
  })
  socket.on('file-created', (roomId)=>{
    socket.to(roomId).emit('update-files');
  })
  socket.on('file-renamed', (roomId, node, name, ext)=>{
    socket.to(roomId).emit('update-filerename', node, name, ext);
  })
  socket.on('folder-renamed', (roomId, node, name)=>{
    
    socket.to(roomId).emit('update-folderrename', node, name);
  })
  socket.on('file-written', (roomId, node)=>{
    
    socket.to(roomId).emit("update-writefile", node);
  })

  socket.on('user-blocked', (roomId, email)=>{
    socket.to(roomId).emit('update-block', email);
  })

  socket.on("disconnect", async () => {
  const roomId = socket.data.roomId; 
  const username = socket.data.username;
  if (roomId) {
    const clientsLeft = await io.in(roomId).fetchSockets();
    // console.log(clientsLeft)
    const usersLeft = clientsLeft.map((s) => ({
      username: s.data.username,
      email: s.data.email
    }));
    io.to(roomId).emit("room-users", usersLeft);
    socket.to(roomId).emit("user-left", username);
  }
});
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  setInterval(() => {
    axios.get('https://pixelcode.onrender.com/health')
      .then(res => {
        console.log(`Health check successful: ${res.status}`);
      })
      .catch(err => {
        console.error(`Health check failed: ${err.message}`);
      });
  }, 8 * 60 * 1000);
});
