// Discord Activities SDK types and interfaces

export interface DiscordSDK {
  // Authentication and user management
  authenticate(access_token: string): Promise<DiscordAuth>;
  getUser(): Promise<DiscordUser>;

  // Voice channel integration
  getChannel(): Promise<DiscordChannel>;
  getVoiceParticipants(): Promise<DiscordUser[]>;

  // Activity lifecycle
  ready(): void;
  close(): void;

  // Event handling
  on(event: DiscordEventType, handler: (data: any) => void): void;
  off(event: DiscordEventType, handler: (data: any) => void): void;
}

export interface DiscordAuth {
  access_token: string;
  user: DiscordUser;
  scopes: string[];
  expires: string;
}

export interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar: string | null;
  bot?: boolean;
  system?: boolean;
  mfa_enabled?: boolean;
  locale?: string;
  verified?: boolean;
  email?: string;
  flags?: number;
  premium_type?: number;
  public_flags?: number;
}

export interface DiscordChannel {
  id: string;
  type: number;
  guild_id?: string;
  position?: number;
  permission_overwrites?: any[];
  name?: string;
  topic?: string;
  nsfw?: boolean;
  last_message_id?: string;
  bitrate?: number;
  user_limit?: number;
  rate_limit_per_user?: number;
  recipients?: DiscordUser[];
  icon?: string;
  owner_id?: string;
  application_id?: string;
  parent_id?: string;
  last_pin_timestamp?: string;
}

export enum DiscordEventType {
  READY = 'ready',
  ERROR = 'error',
  GUILD_STATUS = 'guildStatus',
  SPEAKING_START = 'speakingStart',
  SPEAKING_STOP = 'speakingStop',
  VOICE_STATE_UPDATE = 'voiceStateUpdate',
  CHANNEL_UPDATE = 'channelUpdate'
}

export interface DiscordVoiceState {
  channel_id: string;
  user_id: string;
  session_id: string;
  deaf: boolean;
  mute: boolean;
  self_deaf: boolean;
  self_mute: boolean;
  self_stream?: boolean;
  self_video: boolean;
  suppress: boolean;
}

// Activity configuration
export interface DiscordActivityConfig {
  client_id: string;
  redirect_uri: string;
  scopes: string[];
  response_type: string;
}

// Activity metadata for Discord
export interface ActivityMetadata {
  name: string;
  description: string;
  image: string;
  url: string;
  supported_platforms: string[];
  orientation_lock: 'portrait' | 'landscape' | 'unlocked';
  dimensions: {
    width: number;
    height: number;
  };
}

// Voice chat integration
export interface VoiceParticipant {
  user: DiscordUser;
  isSpeaking: boolean;
  volume: number;
  muted: boolean;
  deafened: boolean;
}

// Error handling
export interface DiscordError {
  code: number;
  message: string;
  details?: any;
}

// Activity lifecycle states
export enum ActivityState {
  INITIALIZING = 'initializing',
  AUTHENTICATING = 'authenticating',
  CONNECTING = 'connecting',
  READY = 'ready',
  RUNNING = 'running',
  ERROR = 'error',
  DISCONNECTED = 'disconnected'
}

// Platform detection
export interface PlatformInfo {
  platform: 'desktop' | 'mobile' | 'web';
  os: string;
  version: string;
  isEmbedded: boolean;
}

// Activity permissions
export interface ActivityPermissions {
  voice: boolean;
  chat: boolean;
  users: boolean;
  channels: boolean;
}

// Network status for Discord connection
export interface DiscordConnectionStatus {
  connected: boolean;
  authenticated: boolean;
  voiceConnected: boolean;
  latency: number;
  lastHeartbeat: number;
}
