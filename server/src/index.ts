import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { RoomManager } from './roomManager.js';
import { GameManager } from './gameManager.js';
import { EmergencyManager } from './emergencyManager.js';

const app = express();
app.use(cors());

// In production, serve the built client
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientBuildPath = path.join(__dirname, '../../client/dist');
app.use(express.static(clientBuildPath));

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

const roomManager = new RoomManager();
const gameManager = new GameManager(roomManager, io);
const emergencyManager = new EmergencyManager(roomManager, io);

io.on('connection', (socket) => {
  console.log(`Player connected: ${socket.id}`);

  socket.on('create-room', ({ playerName }: { playerName: string }) => {
    const room = roomManager.createRoom(socket.id, playerName);
    socket.join(room.code);
    socket.emit('room-created', { roomCode: room.code });
    io.to(room.code).emit('player-joined', { players: roomManager.getPlayerList(room.code) });
  });

  socket.on('join-room', ({ roomCode, playerName }: { roomCode: string; playerName: string }) => {
    const result = roomManager.joinRoom(roomCode, socket.id, playerName);
    if (result.error) {
      socket.emit('join-error', { message: result.error });
      return;
    }
    socket.join(roomCode);
    io.to(roomCode).emit('player-joined', { players: roomManager.getPlayerList(roomCode) });
  });

  socket.on('player-ready', () => {
    const roomCode = roomManager.setPlayerReady(socket.id);
    if (roomCode) {
      io.to(roomCode).emit('player-joined', { players: roomManager.getPlayerList(roomCode) });
    }
  });

  socket.on('start-game', () => {
    const roomCode = roomManager.getRoomCodeByPlayer(socket.id);
    if (!roomCode) return;
    const room = roomManager.getRoom(roomCode);
    if (!room || room.host !== socket.id) return;

    gameManager.startGame(roomCode);
    emergencyManager.startEmergencyTimer(roomCode);
    io.to(roomCode).emit('game-start', { stage: 1 });
  });

  socket.on('stage-answer', (data: { stageId: number; questionId: string; answer: string; timestamp: number }) => {
    const result = gameManager.processAnswer(socket.id, data);
    if (result) {
      socket.emit('answer-result', result);
      const roomCode = roomManager.getRoomCodeByPlayer(socket.id);
      if (roomCode) {
        io.to(roomCode).emit('leaderboard-update', { rankings: gameManager.getRankings(roomCode) });
      }
    }
  });

  socket.on('emergency-response', (data: { emergencyId: string; answer: string; timestamp: number }) => {
    const result = emergencyManager.processResponse(socket.id, data);
    if (result) {
      socket.emit('emergency-result', result);
      const roomCode = roomManager.getRoomCodeByPlayer(socket.id);
      if (roomCode) {
        io.to(roomCode).emit('leaderboard-update', { rankings: gameManager.getRankings(roomCode) });
      }
    }
  });

  socket.on('stage-complete', ({ stageId }: { stageId: number }) => {
    const roomCode = roomManager.getRoomCodeByPlayer(socket.id);
    if (!roomCode) return;

    roomManager.setPlayerStageComplete(socket.id, stageId);

    if (roomManager.allPlayersCompletedStage(roomCode, stageId)) {
      if (stageId >= 4) {
        emergencyManager.stopEmergencyTimer(roomCode);
        io.to(roomCode).emit('game-over', { finalResults: gameManager.getFinalResults(roomCode) });
      } else {
        const nextStage = stageId + 1;
        roomManager.advanceStage(roomCode, nextStage);
        io.to(roomCode).emit('stage-transition', {
          nextStage,
          stageResults: gameManager.getStageResults(roomCode, stageId),
          rankings: gameManager.getRankings(roomCode),
        });
      }
    }
  });

  socket.on('disconnect', () => {
    console.log(`Player disconnected: ${socket.id}`);
    const roomCode = roomManager.getRoomCodeByPlayer(socket.id);
    if (roomCode) {
      roomManager.removePlayer(socket.id);
      const players = roomManager.getPlayerList(roomCode);
      if (players.length === 0) {
        emergencyManager.stopEmergencyTimer(roomCode);
        roomManager.deleteRoom(roomCode);
      } else {
        io.to(roomCode).emit('player-joined', { players });
      }
    }
  });
});

// Catch-all: serve client index.html for client-side routing
app.get('*', (_req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
