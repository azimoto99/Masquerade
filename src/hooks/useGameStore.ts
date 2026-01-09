import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import {
  GameSession,
  Player,
  GamePhase,
  Room,
  GameEvent,
  GameSettings,
  Vector2D,
  PlayerStatus,
  GameEventType
} from '../types/game';

interface GameStore {
  // Game state
  gameSession: GameSession | null;
  currentPlayer: Player | null;
  rooms: Map<string, Room>;
  isConnected: boolean;

  // UI state
  selectedAbility: string | null;
  showSidebar: boolean;
  activeModal: string | null;

  // Actions
  initializeGame: (user: any, channel: any) => void;
  updateGameSession: (session: Partial<GameSession>) => void;
  updatePlayer: (playerId: string, updates: Partial<Player>) => void;
  movePlayer: (playerId: string, position: Vector2D) => void;
  changeRoom: (playerId: string, roomId: string) => void;
  addEvent: (event: GameEvent) => void;
  setSelectedAbility: (abilityId: string | null) => void;
  toggleSidebar: () => void;
  setActiveModal: (modalId: string | null) => void;
}

const defaultSettings: GameSettings = {
  maxPlayers: 10,
  gameDuration: 18, // minutes
  fearDecayRate: 2, // fear points per 20 seconds
  hauntingCooldowns: {
    haunt_room: 30000,
    major_scare: 90000,
    lockdown: 120000,
    lights_out: 60000
  },
  rolesEnabled: [
    'detective', 'blackmailer', 'accomplice', 'exorcist',
    'heir', 'medium', 'paranormal_investigator', 'skeptic',
    'insurance_investigator', 'ghost'
  ]
};

export const useGameStore = create<GameStore>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    gameSession: null,
    currentPlayer: null,
    rooms: new Map(),
    isConnected: false,
    selectedAbility: null,
    showSidebar: true,
    activeModal: null,

    // Initialize game with Discord context
    initializeGame: (user: any) => {
      const player: Player = {
        id: user.id,
        discordId: user.id,
        username: user.username,
        costume: {
          id: 'default',
          name: 'Masked Guest',
          description: 'A mysterious guest in elegant attire',
          color: '#8b5cf6',
          spritePath: '/assets/costumes/default.png'
        },
        position: { x: 400, y: 300 },
        currentRoom: 'grand_ballroom',
        fearLevel: 0,
        maxFear: 100,
        status: PlayerStatus.ALIVE,
        abilities: [],
        lastMovement: Date.now()
      };

      const gameSession: GameSession = {
        id: `game_${Date.now()}`,
        players: [player],
        currentPhase: GamePhase.LOBBY,
        timeRemaining: defaultSettings.gameDuration * 60 * 1000,
        startTime: Date.now(),
        settings: defaultSettings
      };

      set({
        gameSession,
        currentPlayer: player,
        isConnected: true
      });
    },

    // Update game session
    updateGameSession: (updates: Partial<GameSession>) => {
      set((state) => ({
        gameSession: state.gameSession ? { ...state.gameSession, ...updates } : null
      }));
    },

    // Update player data
    updatePlayer: (playerId: string, updates: Partial<Player>) => {
      set((state) => {
        if (!state.gameSession) return state;

        const updatedPlayers = state.gameSession.players.map(player =>
          player.id === playerId ? { ...player, ...updates } : player
        );

        const updatedSession = {
          ...state.gameSession,
          players: updatedPlayers
        };

        const currentPlayer = playerId === state.currentPlayer?.id
          ? updatedPlayers.find(p => p.id === playerId) || state.currentPlayer
          : state.currentPlayer;

        return {
          gameSession: updatedSession,
          currentPlayer
        };
      });
    },

    // Move player to new position
    movePlayer: (playerId: string, position: Vector2D) => {
      get().updatePlayer(playerId, {
        position,
        lastMovement: Date.now()
      });

      // Add movement event
      get().addEvent({
        id: `move_${Date.now()}`,
        type: GameEventType.PLAYER_MOVE,
        timestamp: Date.now(),
        playerId,
        data: { position }
      });
    },

    // Change player's current room
    changeRoom: (playerId: string, roomId: string) => {
      const player = get().gameSession?.players.find(p => p.id === playerId);
      if (!player) return;

      get().updatePlayer(playerId, {
        currentRoom: roomId,
        lastMovement: Date.now()
      });

      // Add room change event
      get().addEvent({
        id: `room_change_${Date.now()}`,
        type: GameEventType.ROOM_CHANGE,
        timestamp: Date.now(),
        playerId,
        data: {
          fromRoom: player.currentRoom,
          toRoom: roomId
        }
      });
    },

    // Add game event
    addEvent: (event: GameEvent) => {
      // In a full implementation, this would sync with server
      console.log('Game event:', event);
    },

    // UI actions
    setSelectedAbility: (abilityId: string | null) => {
      set({ selectedAbility: abilityId });
    },

    toggleSidebar: () => {
      set((state) => ({ showSidebar: !state.showSidebar }));
    },

    setActiveModal: (modalId: string | null) => {
      set({ activeModal: modalId });
    }
  }))
);
