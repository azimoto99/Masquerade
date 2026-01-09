import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:5173"],
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from dist in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
}

// Game state management
interface GameRoom {
  id: string;
  players: Player[];
  currentPhase: string;
  maxPlayers: number;
  isPrivate: boolean;
  password?: string;
}

interface Player {
  id: string;
  socketId: string;
  username: string;
  costume: any;
  currentRoom: string;
  fearLevel: number;
  role?: any;
  abilities: any[];
  isHost: boolean;
}

const gameRooms = new Map<string, GameRoom>();
const playerSockets = new Map<string, string>(); // socketId -> playerId

// Socket.IO event handlers
io.on('connection', (socket) => {
  console.log(`Player connected: ${socket.id}`);

  // Handle player joining
  socket.on('join_game', (data: { roomId?: string; playerName: string; isHost?: boolean }) => {
    try {
      const { roomId, playerName, isHost = false } = data;
      let room: GameRoom;

      if (roomId && gameRooms.has(roomId)) {
        // Join existing room
        room = gameRooms.get(roomId)!;
        if (room.players.length >= room.maxPlayers) {
          socket.emit('error', { message: 'Room is full' });
          return;
        }
      } else {
        // Create new room
        const newRoomId = roomId || generateRoomId();
        room = {
          id: newRoomId,
          players: [],
          currentPhase: 'lobby',
          maxPlayers: 10,
          isPrivate: false
        };
        gameRooms.set(newRoomId, room);
      }

      // Create player
      const player: Player = {
        id: `player_${socket.id}`,
        socketId: socket.id,
        username: playerName,
        costume: {
          id: 'default',
          name: 'Masked Guest',
          description: 'A mysterious guest in elegant attire',
          color: '#8b5cf6'
        },
        currentRoom: 'grand_ballroom',
        fearLevel: 0,
        abilities: [],
        isHost
      };

      // Add player to room
      room.players.push(player);
      playerSockets.set(socket.id, player.id);

      // Join socket room
      socket.join(room.id);

      // Send room info to player
      socket.emit('room_joined', {
        roomId: room.id,
        player: player,
        room: {
          id: room.id,
          players: room.players.map(p => ({ ...p, socketId: undefined })), // Don't send socket IDs
          currentPhase: room.currentPhase,
          maxPlayers: room.maxPlayers
        }
      });

      // Notify other players
      socket.to(room.id).emit('player_joined', {
        player: { ...player, socketId: undefined }
      });

      console.log(`Player ${playerName} joined room ${room.id}`);
    } catch (error) {
      console.error('Error joining game:', error);
      socket.emit('error', { message: 'Failed to join game' });
    }
  });

  // Handle game start
  socket.on('start_game', () => {
    try {
      const playerId = playerSockets.get(socket.id);
      if (!playerId) return;

      const room = findPlayerRoom(playerId);
      if (!room) return;

      const player = room.players.find(p => p.id === playerId);
      if (!player?.isHost) return;

      // Assign roles randomly
      assignRoles(room);

      // Update room phase
      room.currentPhase = 'exploration';

      // Notify all players
      io.to(room.id).emit('game_started', {
        room: {
          id: room.id,
          players: room.players.map(p => ({ ...p, socketId: undefined })),
          currentPhase: room.currentPhase
        }
      });

      console.log(`Game started in room ${room.id}`);
    } catch (error) {
      console.error('Error starting game:', error);
    }
  });

  // Handle player movement
  socket.on('player_move', (data: { position: { x: number; y: number } }) => {
    try {
      const playerId = playerSockets.get(socket.id);
      if (!playerId) return;

      const room = findPlayerRoom(playerId);
      if (!room) return;

      const player = room.players.find(p => p.id === playerId);
      if (!player) return;

      // Update player position
      player.currentRoom = data.position.x > 0 ? 'grand_ballroom' : 'library'; // Simplified room detection
      // In a full implementation, this would use proper collision detection

      // Broadcast movement to other players
      socket.to(room.id).emit('player_moved', {
        playerId: player.id,
        position: data.position,
        currentRoom: player.currentRoom
      });
    } catch (error) {
      console.error('Error handling player movement:', error);
    }
  });

  // Handle ability usage
  socket.on('use_ability', (data: { abilityId: string; targetId?: string }) => {
    try {
      const playerId = playerSockets.get(socket.id);
      if (!playerId) return;

      const room = findPlayerRoom(playerId);
      if (!room) return;

      // Validate ability usage (simplified)
      const player = room.players.find(p => p.id === playerId);
      if (!player) return;

      const ability = player.abilities.find((a: any) => a.id === data.abilityId);
      if (!ability) return;

      // Process ability (simplified - would have proper validation)
      if (data.abilityId === 'detective_reveal' && data.targetId) {
        const target = room.players.find(p => p.id === data.targetId);
        if (target?.role) {
          // Send private message to detective
          socket.emit('ability_result', {
            abilityId: data.abilityId,
            success: true,
            data: { revealedRole: target.role.id, targetName: target.username }
          });
        }
      } else if (data.abilityId.startsWith('ghost_')) {
        // Broadcast Ghost ability to room
        io.to(room.id).emit('ghost_ability_used', {
          abilityId: data.abilityId,
          playerId: player.id,
          roomId: player.currentRoom
        });
      }

      console.log(`Player ${player.username} used ability ${data.abilityId}`);
    } catch (error) {
      console.error('Error handling ability usage:', error);
    }
  });

  // Handle player disconnection
  socket.on('disconnect', () => {
    try {
      const playerId = playerSockets.get(socket.id);
      if (!playerId) return;

      console.log(`Player disconnected: ${socket.id}`);

      // Remove from all rooms
      for (const [roomId, room] of gameRooms) {
        const playerIndex = room.players.findIndex(p => p.id === playerId);
        if (playerIndex !== -1) {
          const player = room.players[playerIndex];
          room.players.splice(playerIndex, 1);

          // Notify other players
          socket.to(room.id).emit('player_left', { playerId });

          // If room is empty, clean it up
          if (room.players.length === 0) {
            gameRooms.delete(roomId);
          } else if (player.isHost) {
            // Assign new host
            room.players[0].isHost = true;
            io.to(room.id).emit('new_host', { playerId: room.players[0].id });
          }

          break;
        }
      }

      playerSockets.delete(socket.id);
    } catch (error) {
      console.error('Error handling disconnect:', error);
    }
  });

  // Handle chat messages
  socket.on('send_message', (data: { message: string; type?: 'public' | 'private'; targetId?: string }) => {
    try {
      const playerId = playerSockets.get(socket.id);
      if (!playerId) return;

      const room = findPlayerRoom(playerId);
      if (!room) return;

      const player = room.players.find(p => p.id === playerId);
      if (!player) return;

      const messageData = {
        id: `msg_${Date.now()}`,
        playerId: player.id,
        playerName: player.username,
        message: data.message,
        timestamp: Date.now(),
        type: data.type || 'public'
      };

      if (data.type === 'private' && data.targetId) {
        // Send to specific player
        const targetPlayer = room.players.find(p => p.id === data.targetId);
        if (targetPlayer) {
          io.to(targetPlayer.socketId).emit('private_message', messageData);
          socket.emit('private_message', messageData); // Also send to sender
        }
      } else {
        // Send to room
        io.to(room.id).emit('chat_message', messageData);
      }
    } catch (error) {
      console.error('Error handling message:', error);
    }
  });
});

// Helper functions
function generateRoomId(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function findPlayerRoom(playerId: string): GameRoom | null {
  for (const room of gameRooms.values()) {
    if (room.players.some(p => p.id === playerId)) {
      return room;
    }
  }
  return null;
}

function assignRoles(room: GameRoom): void {
  const roles = [
    'detective', 'blackmailer', 'accomplice', 'exorcist',
    'heir', 'medium', 'paranormal_investigator', 'skeptic',
    'insurance_investigator', 'ghost'
  ];

  // Shuffle roles
  const shuffledRoles = [...roles].sort(() => Math.random() - 0.5);

  // Assign roles to players
  room.players.forEach((player, index) => {
    const roleId = shuffledRoles[index % shuffledRoles.length];
    player.role = {
      id: roleId,
      name: roleId.charAt(0).toUpperCase() + roleId.slice(1).replace('_', ' '),
      description: getRoleDescription(roleId),
      objective: getRoleObjective(roleId),
      abilities: [], // Will be populated with actual abilities
      color: getRoleColor(roleId)
    };

    // Assign abilities based on role
    player.abilities = getRoleAbilities(roleId);
  });
}

function getRoleDescription(roleId: string): string {
  const descriptions: Record<string, string> = {
    detective: 'A sharp investigator who can reveal the true identities of other guests.',
    blackmailer: 'A cunning manipulator who discovers secrets and uses them for personal gain.',
    accomplice: 'A mysterious ally who subtly assists the Ghost while maintaining their cover.',
    exorcist: 'A spiritual expert who can perform rituals to banish supernatural entities.',
    heir: 'The mansion\'s rightful owner who benefits from the estate\'s misfortunes.',
    medium: 'A psychic sensitive who can commune with spirits and detect paranormal activity.',
    paranormal_investigator: 'A scientific researcher who documents supernatural phenomena.',
    skeptic: 'A rational debunker who exposes fraudulent hauntings and false identities.',
    insurance_investigator: 'A professional assessor who determines if hauntings are genuine.',
    ghost: 'A supernatural entity intent on scaring away all the mansion\'s guests.'
  };
  return descriptions[roleId] || 'Unknown role';
}

function getRoleObjective(roleId: string): string {
  const objectives: Record<string, string> = {
    detective: 'Unmask the Ghost and expose their identity to everyone.',
    blackmailer: 'Discover the Ghost\'s identity and extort them for personal benefit.',
    accomplice: 'Help the Ghost succeed while maintaining your innocent facade.',
    exorcist: 'Perform a ritual to banish the Ghost from the mortal realm.',
    heir: 'Ensure the Ghost scares everyone away so you can inherit the empty mansion.',
    medium: 'Use your psychic abilities to identify and communicate with the Ghost.',
    paranormal_investigator: 'Document sufficient supernatural phenomena for scientific study.',
    skeptic: 'Prove the haunting is fake and publicly humiliate the fraud.',
    insurance_investigator: 'Determine if the haunting is real or staged for insurance purposes.',
    ghost: 'Scare away all guests before your identity is revealed.'
  };
  return objectives[roleId] || 'Unknown objective';
}

function getRoleAbilities(roleId: string): any[] {
  // Simplified ability assignment - in a full implementation, this would use the ABILITIES from abilities.ts
  const abilityMap: Record<string, string[]> = {
    detective: ['detective_reveal'],
    blackmailer: ['blackmailer_message'],
    accomplice: ['accomplice_disturbance'],
    ghost: ['ghost_haunt', 'ghost_major_scare']
  };

  return (abilityMap[roleId] || []).map(id => ({ id, name: id, cooldown: 30000 }));
}

function getRoleColor(roleId: string): string {
  const colors: Record<string, string> = {
    detective: '#3b82f6',
    blackmailer: '#8b5cf6',
    accomplice: '#6b7280',
    exorcist: '#10b981',
    heir: '#f59e0b',
    medium: '#ec4899',
    paranormal_investigator: '#06b6d4',
    skeptic: '#ef4444',
    insurance_investigator: '#84cc16',
    ghost: '#7c2d12'
  };
  return colors[roleId] || '#6b7280';
}

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🎭 Masquerade Mansion server running on port ${PORT}`);
  console.log(`🌐 Socket.IO ready for multiplayer connections`);
});
