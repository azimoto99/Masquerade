import { io, Socket } from 'socket.io-client';
import { Player } from '../types/game';

export interface RoomInfo {
  id: string;
  players: Player[];
  currentPhase: string;
  maxPlayers: number;
}

export interface GameEvent {
  type: string;
  data: any;
  timestamp: number;
}

class SocketService {
  private socket: Socket | null = null;
  private currentRoomId: string | null = null;
  private eventListeners: Map<string, ((data: any) => void)[]> = new Map();

  // Initialize connection
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.socket = io('http://localhost:3001', {
          transports: ['websocket', 'polling']
        });

        this.socket.on('connect', () => {
          console.log('🔌 Connected to game server');
          resolve();
        });

        this.socket.on('connect_error', (error) => {
          console.error('❌ Failed to connect to game server:', error);
          reject(error);
        });

        this.socket.on('disconnect', () => {
          console.log('🔌 Disconnected from game server');
        });

        // Set up global event handlers
        this.setupEventHandlers();

      } catch (error) {
        reject(error);
      }
    });
  }

  // Join a game room
  async joinGame(playerName: string, roomId?: string): Promise<{ room: RoomInfo; player: Player }> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new Error('Not connected to server'));
        return;
      }

      const timeout = setTimeout(() => {
        reject(new Error('Join game timeout'));
      }, 10000);

      this.socket.emit('join_game', { playerName, roomId });

      this.socket.once('room_joined', (data: { room: RoomInfo; player: Player }) => {
        clearTimeout(timeout);
        this.currentRoomId = data.room.id;
        console.log(`🎭 Joined room: ${data.room.id}`);
        resolve(data);
      });

      this.socket.once('error', (error: { message: string }) => {
        clearTimeout(timeout);
        reject(new Error(error.message));
      });
    });
  }

  // Start the game (host only)
  startGame(): void {
    if (this.socket) {
      this.socket.emit('start_game');
    }
  }

  // Send player movement
  sendMovement(position: { x: number; y: number }): void {
    if (this.socket) {
      this.socket.emit('player_move', { position });
    }
  }

  // Use an ability
  useAbility(abilityId: string, targetId?: string): void {
    if (this.socket) {
      this.socket.emit('use_ability', { abilityId, targetId });
    }
  }

  // Send chat message
  sendMessage(message: string, type: 'public' | 'private' = 'public', targetId?: string): void {
    if (this.socket) {
      this.socket.emit('send_message', { message, type, targetId });
    }
  }

  // Event subscription system
  on(event: string, callback: (data: any) => void): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  off(event: string, callback?: (data: any) => void): void {
    if (!this.eventListeners.has(event)) return;

    const listeners = this.eventListeners.get(event)!;
    if (callback) {
      const index = listeners.indexOf(callback);
      if (index !== -1) {
        listeners.splice(index, 1);
      }
    } else {
      this.eventListeners.delete(event);
    }
  }

  private emit(event: string, data: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in ${event} listener:`, error);
        }
      });
    }
  }

  // Set up all event handlers
  private setupEventHandlers(): void {
    if (!this.socket) return;

    // Room events
    this.socket.on('player_joined', (data: { player: Player }) => {
      this.emit('player_joined', data);
    });

    this.socket.on('player_left', (data: { playerId: string }) => {
      this.emit('player_left', data);
    });

    this.socket.on('player_moved', (data: { playerId: string; position: { x: number; y: number }; currentRoom: string }) => {
      this.emit('player_moved', data);
    });

    // Game events
    this.socket.on('game_started', (data: { room: RoomInfo }) => {
      this.emit('game_started', data);
    });

    this.socket.on('new_host', (data: { playerId: string }) => {
      this.emit('new_host', data);
    });

    // Ability events
    this.socket.on('ability_result', (data: any) => {
      this.emit('ability_result', data);
    });

    this.socket.on('ghost_ability_used', (data: { abilityId: string; playerId: string; roomId: string }) => {
      this.emit('ghost_ability_used', data);
    });

    // Chat events
    this.socket.on('chat_message', (data: any) => {
      this.emit('chat_message', data);
    });

    this.socket.on('private_message', (data: any) => {
      this.emit('private_message', data);
    });

    // Error handling
    this.socket.on('error', (error: { message: string }) => {
      console.error('Server error:', error.message);
      this.emit('error', error);
    });
  }

  // Get current room ID
  getCurrentRoomId(): string | null {
    return this.currentRoomId;
  }

  // Check if connected
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  // Disconnect
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.currentRoomId = null;
      this.eventListeners.clear();
    }
  }

  // Get socket ID (for debugging)
  getSocketId(): string | null {
    return this.socket?.id || null;
  }
}

// Export singleton instance
export const socketService = new SocketService();
export default socketService;
