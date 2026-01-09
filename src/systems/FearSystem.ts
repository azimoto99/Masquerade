// Fear System - Manages player fear levels and environmental effects

import { Player, PlayerStatus } from '../types/game';
import { getRoomData } from '../types/rooms';

export interface FearModifier {
  id: string;
  type: 'haunting' | 'isolation' | 'environmental' | 'proximity' | 'darkness';
  value: number; // Fear increase per second (positive) or decrease (negative)
  duration?: number; // How long this modifier lasts (undefined = permanent until removed)
  source?: string; // What caused this fear modifier
  startTime: number;
}

export interface FearState {
  currentLevel: number;
  maxLevel: number;
  baseDecayRate: number; // Fear reduction when safe
  modifiers: FearModifier[];
  lastUpdate: number;
  immuneUntil?: number; // Temporary immunity (e.g., from Bodyguard)
}

export class FearSystem {
  private fearStates: Map<string, FearState> = new Map();
  private roomFearRates: Map<string, number> = new Map();

  constructor() {
    // Initialize room-specific fear rates
    this.initializeRoomFearRates();
  }

  // Initialize a player's fear state
  initializePlayerFear(playerId: string, maxFear: number = 100): void {
    const fearState: FearState = {
      currentLevel: 0,
      maxLevel: maxFear,
      baseDecayRate: 2, // Reduce fear by 2 points per second when safe
      modifiers: [],
      lastUpdate: Date.now()
    };

    this.fearStates.set(playerId, fearState);
  }

  // Update fear for all players (call this every frame/second)
  updateFearLevels(players: Player[], deltaTime: number): void {
    const now = Date.now();

    players.forEach(player => {
      if (player.status !== PlayerStatus.ALIVE) return;

      const fearState = this.fearStates.get(player.id);
      if (!fearState) return;

      // Calculate fear change for this update
      const fearChange = this.calculateFearChange(player, fearState, deltaTime, now);

      // Apply fear change
      fearState.currentLevel = Math.max(0, Math.min(
        fearState.maxLevel,
        fearState.currentLevel + fearChange
      ));

      fearState.lastUpdate = now;

      // Update the player object
      player.fearLevel = fearState.currentLevel;

      // Check for flee condition
      if (fearState.currentLevel >= fearState.maxLevel) {
        this.handlePlayerFlee(player);
      }
    });
  }

  // Calculate fear change for a player in this time slice
  private calculateFearChange(player: Player, fearState: FearState, deltaTime: number, now: number): number {
    let totalFearChange = 0;

    // Base environmental fear from current room
    const roomFearRate = this.getRoomFearRate(player.currentRoom);
    totalFearChange += roomFearRate * (deltaTime / 1000);

    // Isolation fear (being alone in a room)
    const playersInRoom = this.getPlayersInRoom(player.currentRoom, [player]);
    if (playersInRoom.length === 0) {
      // Alone - significant fear increase
      totalFearChange += 3 * (deltaTime / 1000);
    } else if (playersInRoom.length >= 3) {
      // In a group - fear reduction
      totalFearChange -= 1 * (deltaTime / 1000);
    }

    // Apply active modifiers
    fearState.modifiers = fearState.modifiers.filter(modifier => {
      if (modifier.duration && now - modifier.startTime > modifier.duration) {
        return false; // Modifier expired
      }

      totalFearChange += modifier.value * (deltaTime / 1000);
      return true; // Keep modifier
    });

    // Base decay when in safe conditions
    if (totalFearChange <= 0 && roomFearRate <= 1) {
      totalFearChange -= fearState.baseDecayRate * (deltaTime / 1000);
    }

    return totalFearChange;
  }

  // Add a fear modifier to a player
  addFearModifier(playerId: string, modifier: Omit<FearModifier, 'startTime'>): void {
    const fearState = this.fearStates.get(playerId);
    if (!fearState) return;

    const fullModifier: FearModifier = {
      ...modifier,
      startTime: Date.now()
    };

    // Remove any existing modifier of the same type and source
    fearState.modifiers = fearState.modifiers.filter(m =>
      !(m.type === modifier.type && m.source === modifier.source)
    );

    fearState.modifiers.push(fullModifier);

    console.log(`Added fear modifier to ${playerId}:`, modifier);
  }

  // Remove fear modifiers by type and source
  removeFearModifier(playerId: string, type: FearModifier['type'], source?: string): void {
    const fearState = this.fearStates.get(playerId);
    if (!fearState) return;

    fearState.modifiers = fearState.modifiers.filter(m =>
      !(m.type === type && (!source || m.source === source))
    );
  }

  // Apply fear from Ghost ability usage
  applyGhostAbilityFear(roomId: string, players: Player[], fearIncrease: number, duration: number = 10000): void {
    const roomData = getRoomData(roomId);
    if (!roomData) return;

    // Get all players in the affected room
    const affectedPlayers = players.filter(p =>
      p.status === PlayerStatus.ALIVE && p.currentRoom === roomId
    );

    affectedPlayers.forEach(player => {
      this.addFearModifier(player.id, {
        id: `ghost_ability_${Date.now()}_${Math.random()}`,
        type: 'haunting',
        value: fearIncrease / (duration / 1000), // Convert to per-second rate
        duration,
        source: 'ghost_ability'
      });
    });

    console.log(`Applied ${fearIncrease} fear to ${affectedPlayers.length} players in ${roomId}`);
  }

  // Apply fear from proximity to Ghost activity
  applyProximityFear(playerId: string, ghostRoomId: string, playerRoomId: string, fearIncrease: number): void {
    if (playerRoomId === ghostRoomId) {
      // Same room - direct proximity
      this.addFearModifier(playerId, {
        id: `proximity_ghost_${Date.now()}`,
        type: 'proximity',
        value: fearIncrease,
        duration: 5000, // 5 seconds
        source: 'ghost_proximity'
      });
    } else if (this.areRoomsAdjacent(ghostRoomId, playerRoomId)) {
      // Adjacent room - reduced effect
      this.addFearModifier(playerId, {
        id: `proximity_ghost_adjacent_${Date.now()}`,
        type: 'proximity',
        value: fearIncrease * 0.5,
        duration: 3000, // 3 seconds
        source: 'ghost_proximity_adjacent'
      });
    }
  }

  // Handle player fleeing due to max fear
  private handlePlayerFlee(player: Player): void {
    console.log(`Player ${player.username} is fleeing due to max fear!`);

    // Update player status
    player.status = PlayerStatus.FLED;

    // Clear all fear modifiers
    const fearState = this.fearStates.get(player.id);
    if (fearState) {
      fearState.modifiers = [];
      fearState.currentLevel = 0; // Reset for spectator mode
    }

    // In a full implementation, this would:
    // - Move player to spectator area
    // - Notify all players of the flee
    // - Update game state
    // - Check win conditions
  }

  // Get fear state for a player
  getFearState(playerId: string): FearState | null {
    return this.fearStates.get(playerId) || null;
  }

  // Get all active fear modifiers for a player
  getFearModifiers(playerId: string): FearModifier[] {
    const fearState = this.fearStates.get(playerId);
    return fearState ? fearState.modifiers : [];
  }

  // Set temporary fear immunity
  setFearImmunity(playerId: string, duration: number): void {
    const fearState = this.fearStates.get(playerId);
    if (fearState) {
      fearState.immuneUntil = Date.now() + duration;
    }
  }

  // Check if player is immune to fear
  isImmune(playerId: string): boolean {
    const fearState = this.fearStates.get(playerId);
    return fearState ? (fearState.immuneUntil || 0) > Date.now() : false;
  }

  // Initialize room-specific fear rates
  private initializeRoomFearRates(): void {
    // Base fear rates per room (fear increase per second when alone)
    this.roomFearRates.set('grand_ballroom', 0.5); // Social hub - low fear
    this.roomFearRates.set('library', 1.0); // Quiet, isolated - moderate fear
    this.roomFearRates.set('dining_hall', 0.8); // Formal but can be creepy
    this.roomFearRates.set('conservatory', 0.6); // Natural light helps
    this.roomFearRates.set('kitchen', 1.2); // Dark, isolated - high fear
    this.roomFearRates.set('study', 1.0); // Private, mysterious
    this.roomFearRates.set('master_bedroom', 1.5); // Personal space invasion
    this.roomFearRates.set('wine_cellar', 2.0); // Dark, damp, underground
    this.roomFearRates.set('gallery', 0.9); // Art can be unsettling
    this.roomFearRates.set('chapel', 1.3); // Sacred but eerie
    this.roomFearRates.set('attic', 2.5); // Dusty, forgotten, very creepy
    this.roomFearRates.set('billiard_room', 0.7); // Game room, somewhat social
  }

  private getRoomFearRate(roomId: string): number {
    return this.roomFearRates.get(roomId) || 1.0;
  }

  private getPlayersInRoom(_roomId: string, _excludePlayers: Player[] = []): Player[] {
    // This would need to be passed in or accessed from game state
    // For now, return empty array (isolation fear will apply)
    return [];
  }

  private areRoomsAdjacent(roomId1: string, roomId2: string): boolean {
    const room1 = getRoomData(roomId1);
    const room2 = getRoomData(roomId2);

    if (!room1 || !room2) return false;

    // Check if room2 is in room1's connections
    return room1.connections.some((conn: any) => conn.toRoom === roomId2);
  }

  // Utility method to get fear percentage
  getFearPercentage(playerId: string): number {
    const fearState = this.fearStates.get(playerId);
    if (!fearState) return 0;

    return (fearState.currentLevel / fearState.maxLevel) * 100;
  }

  // Reset fear for a new game
  resetPlayerFear(playerId: string): void {
    this.fearStates.delete(playerId);
  }

  // Clean up inactive players
  cleanupInactivePlayers(activePlayerIds: string[]): void {
    const currentPlayerIds = Array.from(this.fearStates.keys());
    currentPlayerIds.forEach(playerId => {
      if (!activePlayerIds.includes(playerId)) {
        this.fearStates.delete(playerId);
      }
    });
  }
}
