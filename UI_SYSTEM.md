# UI/UX System for Discord Overlay

## Discord Activity Constraints

### Screen Dimensions
- **Primary Viewport**: 800x600 pixels (typical Discord overlay)
- **Safe Zone**: 720x480 pixels (accounting for Discord UI elements)
- **Aspect Ratio**: 4:3 or 16:10 (depending on user setup)

### Interaction Limitations
- **Input Methods**: Mouse/keyboard primarily, limited touch support
- **Modal Restrictions**: Cannot open external windows or popups
- **Focus Management**: Must work within Discord's focus system

## UI Layout Architecture

### Core Layout Structure
```typescript
interface UILayout {
  gameViewport: Rectangle; // Main game area (640x480)
  topBar: Rectangle; // Status indicators (800x40)
  bottomBar: Rectangle; // Controls and chat (800x80)
  sidePanel: Rectangle; // Objectives and clues (120x600, collapsible)
  overlayPanels: OverlayPanel[]; // Modals and notifications
}
```

### Responsive Design System
```css
/* CSS Custom Properties for Responsive Layout */
:root {
  --viewport-width: 800px;
  --viewport-height: 600px;
  --game-area-width: 640px;
  --game-area-height: 480px;
  --ui-scale: 1;
  --font-scale: 1;
}

/* Responsive breakpoints */
@media (max-width: 720px) {
  :root {
    --viewport-width: 720px;
    --ui-scale: 0.9;
  }
}
```

## Component System

### Status Bar (Top Bar)
```typescript
interface StatusBarProps {
  player: Player;
  gameState: GameState;
  timeRemaining: number;
}

const StatusBar: React.FC<StatusBarProps> = ({ player, gameState, timeRemaining }) => {
  return (
    <div className="status-bar">
      {/* Fear Meter */}
      <FearMeter level={player.fearLevel} />

      {/* Time Remaining */}
      <TimerDisplay time={timeRemaining} />

      {/* Player Count */}
      <PlayerCountDisplay
        alive={gameState.players.filter(p => p.status === 'alive').length}
        total={gameState.players.length}
      />

      {/* Current Phase */}
      <PhaseIndicator phase={gameState.currentPhase} />
    </div>
  );
};
```

### Fear Meter Component
```typescript
const FearMeter: React.FC<{ level: number }> = ({ level }) => {
  const getFearColor = (level: number): string => {
    if (level < 30) return '#4ade80'; // Green
    if (level < 60) return '#fbbf24'; // Yellow
    if (level < 80) return '#f97316'; // Orange
    return '#dc2626'; // Red
  };

  return (
    <div className="fear-meter">
      <div className="fear-label">Fear</div>
      <div className="fear-bar-container">
        <div
          className="fear-bar-fill"
          style={{
            width: `${level}%`,
            backgroundColor: getFearColor(level)
          }}
        />
      </div>
      <div className="fear-percentage">{Math.round(level)}%</div>
    </div>
  );
};
```

### Control Panel (Bottom Bar)
```typescript
interface ControlPanelProps {
  abilities: Ability[];
  onAbilityUse: (abilityId: string) => void;
  chatMessages: ChatMessage[];
  onSendMessage: (message: string) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  abilities,
  onAbilityUse,
  chatMessages,
  onSendMessage
}) => {
  return (
    <div className="control-panel">
      {/* Ability Buttons */}
      <div className="ability-bar">
        {abilities.map(ability => (
          <AbilityButton
            key={ability.id}
            ability={ability}
            onUse={() => onAbilityUse(ability.id)}
          />
        ))}
      </div>

      {/* Quick Chat */}
      <QuickChat
        messages={chatMessages}
        onSend={onSendMessage}
      />
    </div>
  );
};
```

### Ability Button Component
```typescript
interface AbilityButtonProps {
  ability: Ability;
  cooldownRemaining: number;
  onUse: () => void;
  disabled: boolean;
}

const AbilityButton: React.FC<AbilityButtonProps> = ({
  ability,
  cooldownRemaining,
  onUse,
  disabled
}) => {
  const isOnCooldown = cooldownRemaining > 0;

  return (
    <button
      className={`ability-button ${isOnCooldown ? 'cooldown' : ''}`}
      onClick={onUse}
      disabled={disabled || isOnCooldown}
      title={ability.description}
    >
      <div className="ability-icon">
        <AbilityIcon abilityId={ability.id} />
      </div>

      {isOnCooldown && (
        <div className="cooldown-overlay">
          <div className="cooldown-timer">
            {Math.ceil(cooldownRemaining / 1000)}
          </div>
        </div>
      )}

      <div className="ability-name">{ability.name}</div>
    </button>
  );
};
```

## Sidebar Panel System

### Collapsible Sidebar
```typescript
interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  objectives: Objective[];
  clues: Clue[];
  playerList: Player[];
}

const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggle,
  objectives,
  clues,
  playerList
}) => {
  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : 'expanded'}`}>
      <button className="sidebar-toggle" onClick={onToggle}>
        {isCollapsed ? '→' : '←'}
      </button>

      {!isCollapsed && (
        <div className="sidebar-content">
          <TabbedPanel>
            <Tab title="Objectives">
              <ObjectivesPanel objectives={objectives} />
            </Tab>
            <Tab title="Clues">
              <CluesPanel clues={clues} />
            </Tab>
            <Tab title="Players">
              <PlayersPanel players={playerList} />
            </Tab>
          </TabbedPanel>
        </div>
      )}
    </div>
  );
};
```

### Objectives Panel
```typescript
const ObjectivesPanel: React.FC<{ objectives: Objective[] }> = ({ objectives }) => {
  return (
    <div className="objectives-panel">
      <h3>Your Role & Objectives</h3>

      <div className="role-display">
        <div className="role-icon">
          <RoleIcon roleId={objectives[0]?.roleId} />
        </div>
        <div className="role-info">
          <div className="role-name">{objectives[0]?.roleName}</div>
          <div className="role-description">{objectives[0]?.roleDescription}</div>
        </div>
      </div>

      <div className="objectives-list">
        {objectives.map((objective, index) => (
          <ObjectiveItem
            key={index}
            objective={objective}
            completed={objective.completed}
          />
        ))}
      </div>
    </div>
  );
};
```

## Modal and Overlay System

### Emergency Meeting Modal
```typescript
interface EmergencyMeetingModalProps {
  isOpen: boolean;
  players: Player[];
  timeRemaining: number;
  onVote: (targetPlayerId: string) => void;
  onClose: () => void;
}

const EmergencyMeetingModal: React.FC<EmergencyMeetingModalProps> = ({
  isOpen,
  players,
  timeRemaining,
  onVote,
  onClose
}) => {
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);

  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>
          <h2>Emergency Meeting</h2>
          <TimerDisplay time={timeRemaining} />
        </ModalHeader>

        <ModalBody>
          <div className="discussion-area">
            {/* Voice chat continues here */}
            <VoiceChatIndicator />
          </div>

          <div className="player-vote-grid">
            {players.map(player => (
              <PlayerVoteCard
                key={player.id}
                player={player}
                selected={selectedPlayer === player.id}
                onSelect={() => setSelectedPlayer(player.id)}
              />
            ))}
          </div>
        </ModalBody>

        <ModalFooter>
          <button
            className="vote-button"
            disabled={!selectedPlayer}
            onClick={() => selectedPlayer && onVote(selectedPlayer)}
          >
            Cast Vote
          </button>
          <button className="skip-button" onClick={() => onVote('skip')}>
            Skip Vote
          </button>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
};
```

### Notification System
```typescript
interface NotificationSystemProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}

const NotificationSystem: React.FC<NotificationSystemProps> = ({
  notifications,
  onDismiss
}) => {
  return (
    <div className="notification-container">
      {notifications.map(notification => (
        <NotificationToast
          key={notification.id}
          notification={notification}
          onDismiss={() => onDismiss(notification.id)}
        />
      ))}
    </div>
  );
};
```

## Game Viewport and Camera

### Camera System
```typescript
interface CameraState {
  position: Vector2D;
  zoom: number;
  bounds: Rectangle;
  followTarget?: string; // Player ID to follow
  smoothing: number; // Camera smoothing factor
}

class CameraSystem {
  updateCamera(deltaTime: number): void {
    if (this.followTarget) {
      const targetPlayer = this.gameState.getPlayer(this.followTarget);
      const targetPosition = targetPlayer.position;

      // Smooth camera follow
      const distance = Vector2D.distance(this.position, targetPosition);
      if (distance > 10) {
        const direction = Vector2D.normalize(
          Vector2D.subtract(targetPosition, this.position)
        );
        const moveAmount = Math.min(distance * this.smoothing * deltaTime, distance);
        this.position = Vector2D.add(
          this.position,
          Vector2D.multiply(direction, moveAmount)
        );
      }
    }

    // Clamp to bounds
    this.position.x = Math.max(
      this.bounds.x,
      Math.min(this.bounds.x + this.bounds.width - this.viewportWidth / this.zoom, this.position.x)
    );
    this.position.y = Math.max(
      this.bounds.y,
      Math.min(this.bounds.y + this.bounds.height - this.viewportHeight / this.zoom, this.position.y)
    );
  }
}
```

### Mini-map Component
```typescript
interface MiniMapProps {
  rooms: Room[];
  players: Player[];
  currentRoomId: string;
  exploredRooms: Set<string>;
}

const MiniMap: React.FC<MiniMapProps> = ({
  rooms,
  players,
  currentRoomId,
  exploredRooms
}) => {
  return (
    <div className="mini-map">
      <svg width="120" height="120" viewBox="0 0 400 400">
        {rooms
          .filter(room => exploredRooms.has(room.id))
          .map(room => (
            <MiniMapRoom
              key={room.id}
              room={room}
              isCurrent={room.id === currentRoomId}
              playersInRoom={players.filter(p => p.currentRoom === room.id)}
            />
          ))}
      </svg>
    </div>
  );
};
```

## Styling and Theming

### CSS Architecture
```css
/* Component-scoped styles */
.ability-button {
  position: relative;
  width: 60px;
  height: 60px;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  background: var(--button-bg);
  cursor: pointer;
  transition: all 0.2s ease;
}

.ability-button:hover:not(:disabled) {
  border-color: var(--accent-color);
  transform: scale(1.05);
}

.ability-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.cooldown-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
}

/* Theme variables */
:root {
  --primary-bg: #1a1a1a;
  --secondary-bg: #2a2a2a;
  --accent-color: #8b5cf6;
  --text-primary: #ffffff;
  --text-secondary: #a0a0a0;
  --border-color: #404040;
  --success-color: #10b981;
  --warning-color: #f59e0b;
  --error-color: #ef4444;
}
```

## Accessibility Features

### Keyboard Navigation
- **Tab order**: Logical navigation through interactive elements
- **Keyboard shortcuts**: Quick access to common actions
- **Focus indicators**: Clear visual focus states

### Screen Reader Support
- **ARIA labels**: Descriptive labels for screen readers
- **Live regions**: Dynamic content announcements
- **Semantic HTML**: Proper heading hierarchy and landmarks

### Visual Accessibility
- **High contrast mode**: Enhanced color schemes
- **Font scaling**: Adjustable text sizes
- **Reduced motion**: Respect user motion preferences

## Performance Optimization

### UI Rendering Optimization
- **React.memo**: Prevent unnecessary re-renders
- **Virtual scrolling**: For long lists (clues, chat)
- **Lazy loading**: Load UI components as needed
- **Sprite sheets**: Efficient icon rendering

### Memory Management
- **Component cleanup**: Proper unmounting and cleanup
- **Image optimization**: Compressed assets and lazy loading
- **Event listener management**: Clean up listeners on unmount

This UI system is designed specifically for Discord's constrained overlay environment, providing an intuitive and responsive interface that maximizes the available screen space while maintaining accessibility and performance standards.
