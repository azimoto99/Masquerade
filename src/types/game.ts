// Core game types and interfaces for Masquerade Mansion

export interface Vector2D {
  x: number;
  y: number;
}

export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Game phases
export enum GamePhase {
  LOBBY = 'lobby',
  INTRODUCTION = 'introduction',
  EXPLORATION = 'exploration',
  EMERGENCY_MEETING = 'emergency_meeting',
  RESOLUTION = 'resolution',
  GAME_OVER = 'game_over'
}

// Player states
export enum PlayerStatus {
  ALIVE = 'alive',
  FLED = 'fled', // Left due to high fear
  VOTED_OUT = 'voted_out', // Accused and removed
  SPECTATING = 'spectating'
}

// Costume designs for identity masking
export interface Costume {
  id: string;
  name: string; // e.g., "Red Jester", "Blue Phantom"
  description: string;
  color: string; // Primary color for identification
  spritePath: string;
}

// Player data structure
export interface Player {
  id: string;
  discordId: string;
  username: string;
  costume: Costume;
  position: Vector2D;
  currentRoom: string;
  fearLevel: number;
  maxFear: number;
  status: PlayerStatus;
  role?: Role; // Hidden from other players
  abilities: Ability[];
  lastMovement: number;
  immuneUntil?: number; // For Bodyguard protection
}

// Room system
export interface Room {
  id: string;
  name: string;
  displayName: string;
  bounds: Rectangle;
  connections: string[]; // Connected room IDs
  backgroundImage: string;
  lighting: LightingState;
  interactables: Interactable[];
  secretPassages: string[]; // Hidden connections
  ambientFear: number; // Base fear generation rate
}

// Lighting states for atmosphere
export interface LightingState {
  level: number; // 0-1, affects visibility and fear
  color: string; // Hex color for ambient lighting
  flicker: boolean; // For haunted effects
  emergency: boolean; // Red emergency lighting
}

// Interactive objects in rooms
export interface Interactable {
  id: string;
  type: InteractableType;
  position: Vector2D;
  bounds: Rectangle;
  spritePath: string;
  animation?: string;
  state: InteractableState;
  onInteract?: (playerId: string) => void;
}

export enum InteractableType {
  DOOR = 'door',
  WINDOW = 'window',
  FURNITURE = 'furniture',
  OBJECT = 'object',
  CLUE = 'clue',
  RITUAL_ITEM = 'ritual_item',
  VALUABLE = 'valuable'
}

export enum InteractableState {
  NORMAL = 'normal',
  BROKEN = 'broken',
  LOCKED = 'locked',
  OPEN = 'open',
  HIDDEN = 'hidden',
  HAUNTED = 'haunted'
}

// Ability system
export interface Ability {
  id: string;
  name: string;
  description: string;
  roleId: string;
  icon: string;
  cooldown: number; // milliseconds
  duration?: number; // for channeled abilities
  range: AbilityRange;
  targetType: TargetType;
  cost?: AbilityCost;
  effects: AbilityEffect[];
  validationRules: ValidationRules;
}

export interface AbilityRange {
  type: 'self' | 'room' | 'adjacent' | 'global' | 'line_of_sight';
  radius?: number; // For area effects
}

export type TargetType = 'self' | 'player' | 'room' | 'area' | 'none';

export interface AbilityCost {
  type: 'cooldown' | 'uses' | 'resource';
  value: number;
  maxValue?: number; // For uses-based abilities
}

export interface AbilityEffect {
  type: string;
  value: number;
  duration?: number;
  target?: string;
  conditions?: EffectCondition[];
}

export interface EffectCondition {
  type: string;
  value: any;
}

// Role system
export interface Role {
  id: string;
  name: string;
  description: string;
  objective: string;
  winConditions: WinCondition[];
  abilities: string[]; // Ability IDs
  specialRules?: string[];
  color: string; // UI accent color
}

export interface WinCondition {
  type: string;
  description: string;
  conditions: WinConditionRule[];
}

export interface WinConditionRule {
  type: string;
  target?: string;
  value?: number;
  comparison?: 'equals' | 'greater' | 'less' | 'not_equals';
}

// Fear system
export interface FearState {
  currentLevel: number;
  baseDecayRate: number;
  modifiers: FearModifier[];
  lastUpdate: number;
  immuneUntil?: number;
}

export interface FearModifier {
  id: string;
  type: 'haunting' | 'isolation' | 'proximity' | 'environmental';
  value: number; // Positive = increase fear, Negative = decrease
  duration: number;
  source?: string; // Ability or event ID
}

// Game session data
export interface GameSession {
  id: string;
  players: Player[];
  currentPhase: GamePhase;
  timeRemaining: number;
  startTime: number;
  endTime?: number;
  winner?: string; // Role ID or 'ghost' or 'town'
  settings: GameSettings;
}

// Game configuration
export interface GameSettings {
  maxPlayers: number;
  gameDuration: number; // minutes
  fearDecayRate: number;
  hauntingCooldowns: Record<string, number>;
  rolesEnabled: string[]; // Role IDs to include
}

// Events and messaging
export interface GameEvent {
  id: string;
  type: GameEventType;
  timestamp: number;
  playerId?: string;
  data: any;
}

export enum GameEventType {
  PLAYER_MOVE = 'player_move',
  ABILITY_USE = 'ability_use',
  ROOM_CHANGE = 'room_change',
  FEAR_UPDATE = 'fear_update',
  HAUNTING_EVENT = 'haunting_event',
  VOTE_START = 'vote_start',
  VOTE_CAST = 'vote_cast',
  PLAYER_FLEE = 'player_flee',
  GAME_STATE_UPDATE = 'game_state_update',
  CHAT_MESSAGE = 'chat_message',
  PRIVATE_MESSAGE = 'private_message'
}

// Chat and communication
export interface ChatMessage {
  id: string;
  playerId: string;
  message: string;
  timestamp: number;
  type: 'public' | 'private' | 'system';
  recipientId?: string; // For private messages
}

// Validation rules for abilities
export interface ValidationRules {
  requiresLineOfSight?: boolean;
  requiresSameRoom?: boolean;
  maxTargets?: number;
  cooldownCheck?: boolean;
  fearCheck?: boolean;
  statusCheck?: PlayerStatus[];
}

// UI and rendering
export interface UILayout {
  gameViewport: Rectangle;
  topBar: Rectangle;
  bottomBar: Rectangle;
  sidePanel: Rectangle;
  overlayPanels: OverlayPanel[];
}

export interface OverlayPanel {
  id: string;
  type: 'modal' | 'notification' | 'menu';
  position: Vector2D;
  size: Vector2D;
  visible: boolean;
  content: any;
}

// Network synchronization
export interface NetworkState {
  connected: boolean;
  latency: number;
  lastSync: number;
  pendingActions: GameEvent[];
  serverState: Partial<GameSession>;
}

// Error handling
export interface GameError {
  code: string;
  message: string;
  timestamp: number;
  context?: any;
}

// Analytics and metrics
export interface GameMetrics {
  sessionId: string;
  startTime: number;
  endTime?: number;
  events: GameEvent[];
  playerActions: Record<string, number>;
  winCondition?: string;
}
