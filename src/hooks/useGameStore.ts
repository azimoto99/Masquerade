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
  GameEventType,
  PlayerAbility
} from '../types/game';

// Helper functions for role management
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
    paranormal_investigator: 'Document sufficient supernatural evidence for scientific study.',
    skeptic: 'Prove the haunting is fake and publicly humiliate the fraud.',
    insurance_investigator: 'Determine if the haunting is real or staged for insurance purposes.',
    ghost: 'Scare away all guests before your identity is revealed.'
  };
  return objectives[roleId] || 'Unknown objective';
}

function getRoleAbilities(roleId: string): string[] {
  const abilities: Record<string, string[]> = {
    detective: ['detective_reveal'],
    blackmailer: ['blackmailer_message', 'blackmailer_eavesdrop'],
    accomplice: ['accomplice_disturbance'],
    exorcist: ['exorcist_sense', 'exorcist_ritual'],
    heir: ['heir_fear_sense'],
    medium: ['medium_spiritual_awareness', 'medium_commune'],
    paranormal_investigator: ['paranormal_sensor', 'paranormal_document'],
    skeptic: ['skeptic_analyze', 'skeptic_expose'],
    insurance_investigator: ['insurance_inspect', 'insurance_interview'],
    ghost: ['ghost_haunt', 'ghost_major_scare', 'ghost_lockdown', 'ghost_lights_out']
  };
  return abilities[roleId] || [];
}

function getRoleColor(roleId: string): string {
  const colors: Record<string, string> = {
    detective: '#3b82f6', // Blue
    blackmailer: '#8b5cf6', // Purple
    accomplice: '#6b7280', // Gray
    exorcist: '#10b981', // Green
    heir: '#f59e0b', // Amber
    medium: '#ec4899', // Pink
    paranormal_investigator: '#06b6d4', // Cyan
    skeptic: '#ef4444', // Red
    insurance_investigator: '#84cc16', // Lime
    ghost: '#7c2d12' // Brown
  };
  return colors[roleId] || '#6b7280';
}

function executeDetectiveReveal(detectiveId: string, targetId: string, gameSession: GameSession): boolean {
  const targetPlayer = gameSession.players.find(p => p.id === targetId);
  if (!targetPlayer || !targetPlayer.role) return false;

  // Reveal the target's role to the detective (in a real implementation,
  // this would be sent privately to the detective's client)
  console.log(`Detective ${detectiveId} revealed that ${targetPlayer.username} is the ${targetPlayer.role.name}`);

  // In a full implementation, this would trigger a private message to the detective
  // For now, we'll log it and potentially show it in the UI

  return true;
}

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
  startGame: () => void;
  updateGameSession: (session: Partial<GameSession>) => void;
  updatePlayer: (playerId: string, updates: Partial<Player>) => void;
  movePlayer: (playerId: string, position: Vector2D) => void;
  changeRoom: (playerId: string, roomId: string) => void;
  useAbility: (abilityId: string, targetId?: string) => boolean;
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
        position: { x: 320, y: 400 }, // Center spawn in Grand Ballroom
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
    },

    // Start the game and assign roles
    startGame: () => {
      set((state) => {
        if (!state.gameSession) return state;

        const players = [...state.gameSession.players];
        const roles = [
          'detective', 'blackmailer', 'accomplice', 'exorcist',
          'heir', 'medium', 'paranormal_investigator', 'skeptic',
          'insurance_investigator', 'ghost'
        ];

        // Shuffle roles
        const shuffledRoles = [...roles].sort(() => Math.random() - 0.5);

        // Assign roles to players
        players.forEach((player, index) => {
          const roleId = shuffledRoles[index % shuffledRoles.length];
          const roleAbilities = getRoleAbilities(roleId);
          player.role = {
            id: roleId,
            name: roleId.charAt(0).toUpperCase() + roleId.slice(1).replace('_', ' '),
            description: getRoleDescription(roleId),
            objective: getRoleObjective(roleId),
            winConditions: [], // Simplified for now
            abilities: roleAbilities.map((a: any) => a.id),
            color: getRoleColor(roleId)
          };
          // Assign actual ability objects with runtime properties
          player.abilities = roleAbilities.map((ability: any): PlayerAbility => ({
            ...ability,
            lastUsed: undefined
          }));
        });

        // Start the game
        return {
          gameSession: {
            ...state.gameSession,
            players,
            currentPhase: GamePhase.EXPLORATION,
            timeRemaining: state.gameSession.settings.gameDuration * 60 * 1000
          }
        };
      });
    },

    // Use an ability
    useAbility: (abilityId: string, targetId?: string) => {
      const state = get();
      const { currentPlayer, gameSession } = state;

      if (!currentPlayer || !gameSession) return false;

      // Find the ability
      const abilityIndex = currentPlayer.abilities.findIndex(a => a.id === abilityId);
      if (abilityIndex === -1) return false;

      const ability: PlayerAbility = currentPlayer.abilities[abilityIndex];

      // Check cooldown
      const now = Date.now();
      const lastUsed = ability.lastUsed || 0;
      if (now - lastUsed < ability.cooldown) return false;

      // Execute ability based on type
      let success = false;
      switch (abilityId) {
        case 'detective_reveal':
          success = executeDetectiveReveal(currentPlayer.id, targetId || '', gameSession);
          break;
        default:
          console.log(`Ability ${abilityId} executed`);
          success = true;
      }

      if (success) {
        // Update ability cooldown
        const updatedAbilities = [...currentPlayer.abilities];
        updatedAbilities[abilityIndex] = { ...ability, lastUsed: now };

        state.updatePlayer(currentPlayer.id, { abilities: updatedAbilities as PlayerAbility[] });

        // Add event
        state.addEvent({
          id: `ability_${abilityId}_${now}`,
          type: GameEventType.ABILITY_USE,
          timestamp: now,
          playerId: currentPlayer.id,
          data: { abilityId, targetId }
        });
      }

      return success;
    }
  }))
);
