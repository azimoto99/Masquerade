# Masquerade Mansion

A social deduction Discord Activity game where players attend a mysterious masquerade party in a haunted Victorian mansion. One player is secretly the "Ghost" trying to scare everyone away, while others have unique roles that revolve around discovering and interacting with the Ghost.

## Features

- **Social Deduction Gameplay**: Multiple roles with unique objectives and abilities
- **Discord Integration**: Native voice chat and user management
- **Real-time Multiplayer**: Smooth synchronization for 6-10 players
- **Atmospheric Experience**: Gothic Victorian mansion with dynamic lighting
- **Role-based Abilities**: 9 distinct roles with unique powers and win conditions

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd masquerade-mansion
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Discord Application**
   - Go to [Discord Developer Portal](https://discord.com/developers/applications)
   - Create a new application or select existing one
   - In "General Information" section, collect:
     - **Application ID** (copy this value)
     - **Public Key** (copy this value)
     - **Client Secret** (copy this value - keep it secret!)

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env and replace the placeholder values:
   # VITE_DISCORD_CLIENT_ID=your-actual-application-id
   # VITE_DISCORD_PUBLIC_KEY=your-actual-public-key
   # DISCORD_CLIENT_SECRET=your-actual-client-secret
   ```

   **Discord Credentials Explanation:**
   - **Application ID**: Used by the client-side Activity to identify your app
   - **Public Key**: Used for verifying Discord webhooks (server-side validation)
   - **Client Secret**: Used for server-side API authentication (never expose in client code!)
   - **Note**: For client-side Activities, you mainly need the Application ID. The Public Key and Client Secret are for future server integration.

5. **Start development server**
   ```bash
   npm run dev
   ```

## Game Roles

### Ghost (Antagonist)
- **Haunt Room**: Create fear in targeted areas
- **Major Scare**: Dramatic events affecting multiple players
- **Lockdown**: Trap players in rooms
- **Lights Out**: Disable lighting in multiple areas

### Investigator Roles
- **Detective**: Reveal player identities with investigation
- **Blackmailer**: Extort the Ghost and send anonymous messages
- **Medium**: Sense Ghost presence and commune for clues
- **Exorcist**: Collect ritual items to banish the Ghost
- **Skeptic**: Debunk hauntings and catch the Ghost in the act
- **Insurance Investigator**: Gather evidence for neutral objectives
- **Paranormal Investigator**: Document supernatural phenomena

## Architecture

### Tech Stack
- **Frontend**: React 18 + TypeScript + Canvas API
- **State Management**: Zustand for game state
- **Real-time**: Socket.IO for multiplayer sync
- **Discord Integration**: Discord Embedded App SDK
- **Build Tool**: Vite for fast development

### Project Structure
```
src/
├── components/          # React components
│   ├── game/           # Game-specific components
│   ├── ui/             # User interface components
│   └── rooms/          # Room-specific components
├── systems/            # Game logic systems
├── types/              # TypeScript type definitions
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
└── assets/             # Game assets
```

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues

### Key Systems

#### Fear System
Dynamic fear meter that increases based on:
- Ghost abilities in the same room
- Isolation (being alone)
- Dark environments
- Failed objectives

#### Movement System
- Point-and-click navigation
- Collision detection
- Room transitions
- Line-of-sight calculations

#### Ability Framework
Modular ability system supporting:
- Instant effects
- Channeled abilities
- Cooldown management
- Range validation
- Target selection

## Discord Activity Setup

1. **Create Discord Application**
   - Visit [Discord Developer Portal](https://discord.com/developers/applications)
   - Create new application
   - Add "Activities" section

2. **Configure Activity**
   - Set Activity URL to your deployment
   - Configure supported platforms
   - Set orientation and dimensions

3. **Deploy to Discord**
   - Host the built application
   - Update Activity URL in Discord
   - Test in Discord client

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

This project is licensed under the ISC License - see the LICENSE file for details.

## Acknowledgments

- Inspired by social deduction games like Among Us and Werewolf
- Gothic Victorian aesthetic inspired by classic mystery literature
- Built with modern web technologies for Discord's platform
