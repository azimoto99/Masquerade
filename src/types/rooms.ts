// Room and mansion data structures
import { Vector2D } from './game';

export interface RoomData {
  id: string;
  name: string;
  displayName: string;
  description: string;
  backgroundImage: string;
  width: number;
  height: number;
  lighting: 'bright' | 'normal' | 'dim' | 'dark';
  ambientFearRate: number; // Fear increase per second when alone
  connections: RoomConnection[];
  interactables: InteractableObject[];
  spawnPoints: Vector2D[];
}

export interface RoomConnection {
  toRoom: string;
  position: Vector2D; // Door position in current room
  size: Vector2D; // Door size
  locked?: boolean;
  secret?: boolean; // Hidden passage
  keyRequired?: string; // Item needed to unlock
}

export interface InteractableObject {
  id: string;
  name: string;
  type: InteractableType;
  position: Vector2D;
  size: Vector2D;
  sprite?: string;
  animation?: string;
  state: ObjectState;
  description: string;
  onInteract?: (playerId: string) => void;
  requiredAbility?: string; // Ability needed to interact
  clues?: string[]; // Clues revealed on interaction
  fearModifier?: number; // Fear change when interacted with
  cooldown?: number; // Interaction cooldown in ms
  lastInteracted?: number;
}

export type InteractableType =
  | 'door'
  | 'window'
  | 'furniture'
  | 'decoration'
  | 'clue'
  | 'ritual_item'
  | 'valuable'
  | 'light_source'
  | 'sound_source'
  | 'trap'
  | 'puzzle';

export type ObjectState =
  | 'normal'
  | 'broken'
  | 'locked'
  | 'open'
  | 'closed'
  | 'hidden'
  | 'haunted'
  | 'activated'
  | 'deactivated';

// Mansion layout data
export const MANSION_LAYOUT: Record<string, RoomData> = {
  grand_ballroom: {
    id: 'grand_ballroom',
    name: 'grand_ballroom',
    displayName: 'Grand Ballroom',
    description: 'The magnificent central hall of the mansion, adorned with crystal chandeliers and marble floors.',
    backgroundImage: '/assets/rooms/grand_ballroom.png',
    width: 640,
    height: 480,
    lighting: 'bright',
    ambientFearRate: 0.5, // Low fear in social areas
    spawnPoints: [
      { x: 320, y: 400 }, // Center spawn
      { x: 200, y: 350 },
      { x: 440, y: 350 },
    ],
    connections: [
      {
        toRoom: 'library',
        position: { x: 50, y: 200 },
        size: { x: 40, y: 80 }
      },
      {
        toRoom: 'dining_hall',
        position: { x: 550, y: 200 },
        size: { x: 40, y: 80 }
      },
      {
        toRoom: 'conservatory',
        position: { x: 320, y: 50 },
        size: { x: 80, y: 40 }
      }
    ],
    interactables: [
      {
        id: 'chandelier',
        name: 'Crystal Chandelier',
        type: 'decoration',
        position: { x: 320, y: 80 },
        size: { x: 120, y: 60 },
        sprite: '/assets/objects/chandelier.png',
        state: 'normal',
        description: 'A magnificent crystal chandelier hanging from the ceiling.',
        onInteract: (playerId) => {
          // This will be implemented when we add the chandelier scare ability
          console.log(`Player ${playerId} examined the chandelier`);
        },
        clues: [
          'The chandelier is securely fastened to the ceiling.',
          'Crystal prisms catch the light beautifully.'
        ]
      },
      {
        id: 'grand_piano',
        name: 'Grand Piano',
        type: 'furniture',
        position: { x: 150, y: 300 },
        size: { x: 80, y: 40 },
        sprite: '/assets/objects/grand_piano.png',
        state: 'normal',
        description: 'An elegant grand piano, perfectly tuned for the occasion.',
        clues: [
          'The piano keys are covered with a thin layer of dust.',
          'Someone has been playing recently - the stool is pulled out.'
        ]
      },
      {
        id: 'refreshment_table',
        name: 'Refreshment Table',
        type: 'furniture',
        position: { x: 450, y: 350 },
        size: { x: 60, y: 30 },
        sprite: '/assets/objects/refreshment_table.png',
        state: 'normal',
        description: 'A table laden with champagne flutes and hors d\'oeuvres.',
        clues: [
          'Several glasses have been used but not cleared away.',
          'The champagne is still chilled.'
        ]
      }
    ]
  },

  library: {
    id: 'library',
    name: 'library',
    displayName: 'Library',
    description: 'Walls lined with ancient books, leather armchairs, and a massive oak desk.',
    backgroundImage: '/assets/rooms/library.png',
    width: 640,
    height: 480,
    lighting: 'normal',
    ambientFearRate: 1.0, // Slightly higher fear in isolated rooms
    spawnPoints: [
      { x: 100, y: 400 }
    ],
    connections: [
      {
        toRoom: 'grand_ballroom',
        position: { x: 550, y: 200 },
        size: { x: 40, y: 80 }
      },
      {
        toRoom: 'study',
        position: { x: 50, y: 200 },
        size: { x: 40, y: 80 },
        secret: true // Secret passage
      }
    ],
    interactables: [
      {
        id: 'ritual_book_1',
        name: 'Ancient Tome',
        type: 'ritual_item',
        position: { x: 200, y: 250 },
        size: { x: 30, y: 20 },
        sprite: '/assets/objects/ancient_book.png',
        state: 'normal',
        description: 'An ancient book bound in cracked leather.',
        requiredAbility: 'exorcist_collect_ritual',
        clues: [
          'The book contains strange symbols and incantations.',
          'This appears to be part of a larger ritual.'
        ]
      },
      {
        id: 'bookshelf_secret',
        name: 'Ancient Bookshelf',
        type: 'door',
        position: { x: 45, y: 180 },
        size: { x: 10, y: 40 },
        state: 'closed',
        description: 'A bookshelf that seems slightly out of place.',
        clues: [
          'One of the books looks like it might be a lever.',
          'There\'s a faint draft coming from behind this shelf.'
        ]
      }
    ]
  },

  dining_hall: {
    id: 'dining_hall',
    name: 'dining_hall',
    displayName: 'Dining Hall',
    description: 'A long mahogany table set for dinner, with crystal glassware and silver candelabras.',
    backgroundImage: '/assets/rooms/dining_hall.png',
    width: 640,
    height: 480,
    lighting: 'normal',
    ambientFearRate: 0.8,
    spawnPoints: [
      { x: 100, y: 400 }
    ],
    connections: [
      {
        toRoom: 'grand_ballroom',
        position: { x: 550, y: 200 },
        size: { x: 40, y: 80 }
      },
      {
        toRoom: 'kitchen',
        position: { x: 50, y: 200 },
        size: { x: 40, y: 80 }
      }
    ],
    interactables: [
      {
        id: 'dining_table',
        name: 'Mahogany Dining Table',
        type: 'furniture',
        position: { x: 320, y: 300 },
        size: { x: 200, y: 60 },
        sprite: '/assets/objects/dining_table.png',
        state: 'normal',
        description: 'A magnificent table that could seat twenty guests.',
        clues: [
          'Place settings are arranged for a formal dinner.',
          'The tablecloth has a few small stains.'
        ]
      },
      {
        id: 'china_cabinet',
        name: 'China Cabinet',
        type: 'furniture',
        position: { x: 500, y: 250 },
        size: { x: 60, y: 40 },
        sprite: '/assets/objects/china_cabinet.png',
        state: 'normal',
        description: 'A tall cabinet displaying fine china and crystal glassware.',
        clues: [
          'Some glasses appear to have been recently used.',
          'The cabinet doors are slightly ajar.'
        ]
      }
    ]
  },

  conservatory: {
    id: 'conservatory',
    name: 'conservatory',
    displayName: 'Conservatory',
    description: 'A glass-walled room filled with exotic plants and elegant wicker furniture.',
    backgroundImage: '/assets/rooms/conservatory.png',
    width: 640,
    height: 480,
    lighting: 'bright',
    ambientFearRate: 0.6,
    spawnPoints: [
      { x: 320, y: 400 }
    ],
    connections: [
      {
        toRoom: 'grand_ballroom',
        position: { x: 320, y: 430 },
        size: { x: 80, y: 40 }
      }
    ],
    interactables: [
      {
        id: 'piano_forte',
        name: 'Piano Forte',
        type: 'furniture',
        position: { x: 200, y: 300 },
        size: { x: 80, y: 40 },
        sprite: '/assets/objects/piano_forte.png',
        state: 'normal',
        description: 'An elegant piano forte with ivory keys and brass candle holders.',
        clues: [
          'The sheet music is open to a haunting melody.',
          'Someone has been practicing recently.'
        ]
      },
      {
        id: 'tropical_plants',
        name: 'Tropical Plants',
        type: 'decoration',
        position: { x: 450, y: 280 },
        size: { x: 60, y: 80 },
        sprite: '/assets/objects/tropical_plants.png',
        state: 'normal',
        description: 'Exotic plants with large leaves and vibrant flowers.',
        clues: [
          'One of the plants appears to have been recently disturbed.',
          'Some leaves show signs of being brushed against.'
        ]
      }
    ]
  }
};

// Helper functions
export function getRoomData(roomId: string): RoomData | null {
  return MANSION_LAYOUT[roomId] || null;
}

export function getConnectedRooms(roomId: string): string[] {
  const room = getRoomData(roomId);
  return room ? room.connections.map(conn => conn.toRoom) : [];
}

export function canAccessRoom(fromRoom: string, toRoom: string): boolean {
  const room = getRoomData(fromRoom);
  if (!room) return false;

  const connection = room.connections.find(conn => conn.toRoom === toRoom);
  if (!connection) return false;

  return !connection.locked && !connection.secret;
}

export function getInteractableInRoom(roomId: string, interactableId: string): InteractableObject | null {
  const room = getRoomData(roomId);
  if (!room) return null;

  return room.interactables.find(obj => obj.id === interactableId) || null;
}

export function getInteractablesInRoom(roomId: string): InteractableObject[] {
  const room = getRoomData(roomId);
  return room ? room.interactables : [];
}
