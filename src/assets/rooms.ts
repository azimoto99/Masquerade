// Room background and asset definitions
// These are placeholder assets that can be replaced with actual images

export interface RoomAsset {
  id: string;
  name: string;
  type: 'background' | 'object' | 'decoration';
  svg: string;
  width: number;
  height: number;
  color: string;
}

// Generate placeholder SVG assets for rooms and objects
export const generateRoomBackground = (roomId: string, width: number, height: number): string => {
  const backgrounds = {
    grand_ballroom: `
      <defs>
        <pattern id="marble" patternUnits="userSpaceOnUse" width="40" height="40">
          <rect width="40" height="40" fill="#2a2a2a"/>
          <rect x="20" y="0" width="20" height="20" fill="#3a3a3a"/>
          <rect x="0" y="20" width="20" height="20" fill="#3a3a3a"/>
          <circle cx="20" cy="20" r="15" fill="#4a4a4a" opacity="0.3"/>
        </pattern>
        <linearGradient id="ballroomGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#2a2a2a"/>
          <stop offset="50%" style="stop-color:#1a1a1a"/>
          <stop offset="100%" style="stop-color:#0a0a0a"/>
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#ballroomGradient)"/>
      <!-- Chandelier shadow -->
      <ellipse cx="${width/2}" cy="120" rx="80" ry="20" fill="rgba(0,0,0,0.5)"/>
      <!-- Wall paneling -->
      <rect x="0" y="0" width="50" height="${height}" fill="url(#marble)"/>
      <rect x="${width-50}" y="0" width="50" height="${height}" fill="url(#marble)"/>
    `,
    library: `
      <defs>
        <pattern id="wood" patternUnits="userSpaceOnUse" width="30" height="30">
          <rect width="30" height="30" fill="#3d2817"/>
          <rect x="15" y="0" width="15" height="15" fill="#4d3827"/>
          <rect x="0" y="15" width="15" height="15" fill="#4d3827"/>
        </pattern>
        <radialGradient id="libraryGradient" cx="50%" cy="30%" r="70%">
          <stop offset="0%" style="stop-color:#1a1a1a"/>
          <stop offset="100%" style="stop-color:#0a0a0a"/>
        </radialGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#libraryGradient)"/>
      <!-- Bookshelves -->
      <rect x="20" y="50" width="15" height="${height-100}" fill="url(#wood)"/>
      <rect x="${width-35}" y="50" width="15" height="${height-100}" fill="url(#wood)"/>
      <!-- Desk area -->
      <rect x="${width/2-100}" y="${height-150}" width="200" height="80" fill="#2a1810" opacity="0.8"/>
    `,
    dining_hall: `
      <defs>
        <pattern id="tablecloth" patternUnits="userSpaceOnUse" width="20" height="20">
          <rect width="20" height="20" fill="#722f37"/>
          <rect x="10" y="0" width="10" height="10" fill="#823f47"/>
          <rect x="0" y="10" width="10" height="10" fill="#823f47"/>
        </pattern>
        <linearGradient id="diningGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#2a2a2a"/>
          <stop offset="100%" style="stop-color:#1a1a1a"/>
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#diningGradient)"/>
      <!-- Long dining table -->
      <rect x="${width/2-150}" y="${height/2-20}" width="300" height="40" fill="url(#tablecloth)"/>
      <!-- Chairs around table -->
      <rect x="${width/2-170}" y="${height/2-15}" width="20" height="30" fill="#4a2a1a"/>
      <rect x="${width/2+150}" y="${height/2-15}" width="20" height="30" fill="#4a2a1a"/>
    `,
    conservatory: `
      <defs>
        <radialGradient id="glassGradient" cx="50%" cy="50%" r="100%">
          <stop offset="0%" style="stop-color:#87ceeb" stop-opacity="0.3"/>
          <stop offset="100%" style="stop-color:#4682b4" stop-opacity="0.1"/>
        </radialGradient>
        <pattern id="plants" patternUnits="userSpaceOnUse" width="40" height="40">
          <circle cx="20" cy="20" r="15" fill="#228b22" opacity="0.6"/>
          <circle cx="10" cy="30" r="8" fill="#32cd32" opacity="0.4"/>
          <circle cx="30" cy="10" r="10" fill="#006400" opacity="0.5"/>
        </pattern>
      </defs>
      <rect width="${width}" height="${height}" fill="#1a2a1a"/>
      <!-- Glass walls effect -->
      <rect width="${width}" height="${height}" fill="url(#glassGradient)"/>
      <!-- Plants -->
      <rect x="${width-100}" y="${height-200}" width="80" height="150" fill="url(#plants)"/>
      <!-- Piano area -->
      <rect x="${width/2-60}" y="${height-120}" width="120" height="60" fill="#2a1810" opacity="0.8"/>
    `
  };

  return backgrounds[roomId as keyof typeof backgrounds] || backgrounds.grand_ballroom;
};

// Object sprites
export const OBJECT_SPRITES = {
  chandelier: `
    <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="crystal" cx="50%" cy="30%" r="60%">
          <stop offset="0%" style="stop-color:#e6e6fa"/>
          <stop offset="70%" style="stop-color:#b0c4de"/>
          <stop offset="100%" style="stop-color:#4682b4"/>
        </radialGradient>
      </defs>
      <!-- Chain -->
      <line x1="60" y1="0" x2="60" y2="20" stroke="#c0c0c0" stroke-width="2"/>
      <!-- Main fixture -->
      <ellipse cx="60" cy="25" rx="25" ry="8" fill="#2a2a2a"/>
      <!-- Crystals -->
      <ellipse cx="45" cy="35" rx="3" ry="8" fill="url(#crystal)"/>
      <ellipse cx="60" cy="35" rx="3" ry="8" fill="url(#crystal)"/>
      <ellipse cx="75" cy="35" rx="3" ry="8" fill="url(#crystal)"/>
      <ellipse cx="38" cy="42" rx="3" ry="8" fill="url(#crystal)"/>
      <ellipse cx="52" cy="42" rx="3" ry="8" fill="url(#crystal)"/>
      <ellipse cx="68" cy="42" rx="3" ry="8" fill="url(#crystal)"/>
      <ellipse cx="82" cy="42" rx="3" ry="8" fill="url(#crystal)"/>
    </svg>
  `,
  grand_piano: `
    <svg viewBox="0 0 80 40" xmlns="http://www.w3.org/2000/svg">
      <!-- Piano body -->
      <rect x="5" y="15" width="70" height="20" rx="2" fill="#2a1810"/>
      <!-- Keyboard -->
      <rect x="10" y="20" width="50" height="8" fill="#ffffff"/>
      <!-- Keys -->
      <rect x="12" y="21" width="2" height="6" fill="#000000"/>
      <rect x="16" y="21" width="2" height="6" fill="#000000"/>
      <rect x="20" y="21" width="2" height="6" fill="#000000"/>
      <rect x="26" y="21" width="2" height="6" fill="#000000"/>
      <rect x="30" y="21" width="2" height="6" fill="#000000"/>
      <rect x="36" y="21" width="2" height="6" fill="#000000"/>
      <rect x="40" y="21" width="2" height="6" fill="#000000"/>
      <!-- Legs -->
      <rect x="15" y="35" width="3" height="5" fill="#1a0a00"/>
      <rect x="62" y="35" width="3" height="5" fill="#1a0a00"/>
    </svg>
  `,
  dining_table: `
    <svg viewBox="0 0 200 40" xmlns="http://www.w3.org/2000/svg">
      <!-- Table surface -->
      <ellipse cx="100" cy="25" rx="95" ry="12" fill="#8b4513"/>
      <!-- Table legs -->
      <rect x="20" y="30" width="4" height="10" fill="#654321"/>
      <rect x="176" y="30" width="4" height="10" fill="#654321"/>
      <!-- Table settings (simplified) -->
      <circle cx="60" cy="22" r="3" fill="#ffffff" opacity="0.8"/>
      <circle cx="140" cy="22" r="3" fill="#ffffff" opacity="0.8"/>
    </svg>
  `,
  refreshment_table: `
    <svg viewBox="0 0 60 30" xmlns="http://www.w3.org/2000/svg">
      <!-- Table -->
      <rect x="5" y="15" width="50" height="12" rx="2" fill="#8b4513"/>
      <!-- Legs -->
      <rect x="10" y="27" width="2" height="3" fill="#654321"/>
      <rect x="48" y="27" width="2" height="3" fill="#654321"/>
      <!-- Items on table -->
      <ellipse cx="25" cy="18" rx="3" ry="1" fill="#ffffff"/>
      <ellipse cx="35" cy="18" rx="3" ry="1" fill="#ffffff"/>
    </svg>
  `,
  ancient_book: `
    <svg viewBox="0 0 30 20" xmlns="http://www.w3.org/2000/svg">
      <!-- Book cover -->
      <rect x="2" y="2" width="26" height="16" rx="1" fill="#3d2817"/>
      <!-- Book spine -->
      <rect x="0" y="0" width="4" height="20" fill="#2a1810"/>
      <!-- Pages -->
      <rect x="4" y="4" width="22" height="12" fill="#f5f5dc"/>
      <!-- Ancient symbols -->
      <circle cx="10" cy="8" r="1" fill="#8b0000"/>
      <circle cx="15" cy="12" r="1" fill="#8b0000"/>
      <circle cx="20" cy="8" r="1" fill="#8b0000"/>
    </svg>
  `,
  china_cabinet: `
    <svg viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg">
      <!-- Cabinet frame -->
      <rect x="5" y="5" width="50" height="30" rx="2" fill="#8b4513"/>
      <!-- Glass doors -->
      <rect x="10" y="10" width="18" height="20" fill="#e6e6fa" opacity="0.7"/>
      <rect x="32" y="10" width="18" height="20" fill="#e6e6fa" opacity="0.7"/>
      <!-- China items -->
      <circle cx="19" cy="15" r="2" fill="#ffffff"/>
      <circle cx="41" cy="15" r="2" fill="#ffffff"/>
      <circle cx="19" cy="25" r="2" fill="#ffffff"/>
      <circle cx="41" cy="25" r="2" fill="#ffffff"/>
    </svg>
  `,
  piano_forte: `
    <svg viewBox="0 0 80 40" xmlns="http://www.w3.org/2000/svg">
      <!-- Body -->
      <rect x="5" y="15" width="70" height="20" rx="3" fill="#2a1810"/>
      <!-- Keyboard -->
      <rect x="10" y="20" width="50" height="8" fill="#fffffa"/>
      <!-- Keys -->
      <rect x="12" y="21" width="1.5" height="6" fill="#000000"/>
      <rect x="15" y="21" width="1.5" height="6" fill="#000000"/>
      <rect x="18" y="21" width="1.5" height="6" fill="#000000"/>
      <rect x="23" y="21" width="1.5" height="6" fill="#000000"/>
      <rect x="26" y="21" width="1.5" height="6" fill="#000000"/>
      <!-- Legs -->
      <rect x="15" y="35" width="3" height="5" fill="#1a0a00"/>
      <rect x="62" y="35" width="3" height="5" fill="#1a0a00"/>
    </svg>
  `,
  tropical_plants: `
    <svg viewBox="0 0 60 80" xmlns="http://www.w3.org/2000/svg">
      <!-- Pots -->
      <ellipse cx="20" cy="75" rx="8" ry="3" fill="#8b4513"/>
      <ellipse cx="40" cy="75" rx="8" ry="3" fill="#8b4513"/>
      <!-- Plants -->
      <ellipse cx="20" cy="50" rx="12" ry="25" fill="#228b22"/>
      <ellipse cx="40" cy="45" rx="10" ry="20" fill="#32cd32"/>
      <!-- Leaves -->
      <ellipse cx="15" cy="35" rx="8" ry="15" fill="#006400"/>
      <ellipse cx="45" cy="30" rx="6" ry="12" fill="#228b22"/>
      <!-- Flowers -->
      <circle cx="20" cy="25" r="3" fill="#ffd700"/>
      <circle cx="40" cy="20" r="2" fill="#ff6347"/>
    </svg>
  `
};

// UI Icons
export const UI_ICONS = {
  fear: `
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L13.09 8.26L19 9L13.09 9.74L12 16L10.91 9.74L5 9L10.91 8.26L12 2Z" fill="#ef4444"/>
      <circle cx="12" cy="12" r="8" fill="none" stroke="#ef4444" stroke-width="2" opacity="0.3"/>
    </svg>
  `,
  time: `
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/>
      <line x1="12" y1="7" x2="12" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <line x1="12" y1="12" x2="16" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `,
  players: `
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="8" r="3" fill="currentColor"/>
      <circle cx="16" cy="8" r="3" fill="currentColor"/>
      <circle cx="8" cy="16" r="3" fill="currentColor"/>
      <circle cx="16" cy="16" r="3" fill="currentColor"/>
    </svg>
  `,
  door: `
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="2"/>
      <circle cx="16" cy="12" r="1.5" fill="currentColor"/>
    </svg>
  `,
  investigate: `
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" stroke-width="2"/>
    </svg>
  `,
  talk: `
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `
};
