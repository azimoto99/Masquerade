# Core Mechanics Implementation

## Fear System Architecture

### Fear State Management
```typescript
interface FearState {
  currentLevel: number; // 0-100
  baseDecayRate: number; // -2% per 20 seconds in well-lit areas
  modifiers: FearModifier[];
  lastUpdate: number;
  immuneUntil?: number; // For Bodyguard protection
}

interface FearModifier {
  id: string;
  type: 'haunting' | 'isolation' | 'proximity' | 'environmental';
  value: number; // Positive = increase fear, Negative = decrease
  duration: number; // -1 for permanent until removed
  source?: string; // Ability or event ID
}
```

### Fear Calculation Engine
```typescript
class FearEngine {
  private fearStates: Map<string, FearState> = new Map();

  // Core fear calculation
  updateFear(playerId: string, deltaTime: number): void {
    const state = this.fearStates.get(playerId);
    if (!state) return;

    // Apply base decay
    const decayAmount = this.calculateBaseDecay(state, deltaTime);
    state.currentLevel = Math.max(0, state.currentLevel - decayAmount);

    // Apply active modifiers
    this.applyModifiers(state, deltaTime);

    // Clamp to bounds
    state.currentLevel = Math.min(100, Math.max(0, state.currentLevel));
    state.lastUpdate = Date.now();

    // Check for flee condition
    if (state.currentLevel >= 100) {
      this.triggerFlee(playerId);
    }
  }

  private calculateBaseDecay(state: FearState, deltaTime: number): number {
    const room = this.getPlayerRoom(playerId);
    const lighting = room.getLightingLevel();
    const playerCount = room.getPlayerCount();

    let decayRate = state.baseDecayRate;

    // Lighting modifier
    if (lighting > 0.7) decayRate *= 1.5; // Well-lit rooms reduce fear faster
    if (lighting < 0.3) decayRate *= 0.5; // Dark rooms slow decay

    // Social modifier
    if (playerCount >= 3) decayRate *= 1.3; // Groups reduce fear
    if (playerCount === 1) decayRate *= 0.7; // Isolation increases fear

    return (decayRate * deltaTime) / 1000;
  }

  // Apply fear-increasing events
  applyHauntingFear(roomId: string, fearIncrease: number, radius: number = 1): void {
    const affectedPlayers = this.getPlayersInRadius(roomId, radius);
    affectedPlayers.forEach(playerId => {
      this.addModifier(playerId, {
        id: `haunting_${Date.now()}`,
        type: 'haunting',
        value: fearIncrease,
        duration: 30000 // 30 seconds
      });
    });
  }
}
```

### Fear Events and Triggers

#### Environmental Fear Sources
- **Darkness**: +1% per 10 seconds in rooms with <30% lighting
- **Isolation**: +2% per 15 seconds when alone
- **Proximity to Ghost**: +20% when Ghost uses ability within 2 rooms

#### Ability-Generated Fear
- **Minor Haunting**: +15% to players in room
- **Major Scare**: +30% to players in room
- **Lockdown**: +10% to trapped players (additional to base isolation)

#### Fear Reduction
- **Group Presence**: -5% per 30 seconds with 3+ players
- **Well-lit Areas**: -2% per 20 seconds in bright rooms
- **Objective Completion**: -10% per completed objective milestone

## Movement System

### Player Movement Implementation
```typescript
interface MovementState {
  position: Vector2D;
  velocity: Vector2D;
  targetPosition?: Vector2D;
  movementSpeed: number; // pixels per second
  isRunning: boolean;
  lastRoomId: string;
  pathfinding: PathNode[];
}

class MovementSystem {
  private movementStates: Map<string, MovementState> = new Map();

  updateMovement(playerId: string, deltaTime: number): void {
    const state = this.movementStates.get(playerId);
    if (!state) return;

    // Handle click-to-move
    if (state.targetPosition) {
      this.updatePathfinding(state, deltaTime);
    }

    // Apply velocity
    state.position.x += state.velocity.x * deltaTime;
    state.position.y += state.velocity.y * deltaTime;

    // Room transition detection
    this.checkRoomTransitions(playerId, state);

    // Collision detection
    this.handleCollisions(playerId, state);
  }

  private updatePathfinding(state: MovementState, deltaTime: number): void {
    if (!state.pathfinding.length) return;

    const nextNode = state.pathfinding[0];
    const distance = Vector2D.distance(state.position, nextNode.position);

    if (distance < 5) { // Reached node
      state.pathfinding.shift();
      if (!state.pathfinding.length) {
        state.targetPosition = undefined;
        state.velocity = { x: 0, y: 0 };
        return;
      }
    }

    // Move toward next node
    const direction = Vector2D.normalize(
      Vector2D.subtract(nextNode.position, state.position)
    );

    const speed = state.isRunning ? RUN_SPEED : WALK_SPEED;
    state.velocity = Vector2D.multiply(direction, speed);
  }

  private checkRoomTransitions(playerId: string, state: MovementState): void {
    const currentRoom = this.getRoomAtPosition(state.position);

    if (currentRoom.id !== state.lastRoomId) {
      // Room transition
      this.handleRoomChange(playerId, state.lastRoomId, currentRoom.id);

      // Trigger room-specific events
      currentRoom.onPlayerEnter(playerId);

      state.lastRoomId = currentRoom.id;
    }
  }
}
```

### Pathfinding System
```typescript
interface PathNode {
  position: Vector2D;
  cost: number;
  parent?: PathNode;
}

class PathfindingSystem {
  private navMesh: NavigationMesh;

  findPath(start: Vector2D, end: Vector2D): PathNode[] {
    // A* pathfinding implementation
    const openSet: PathNode[] = [];
    const closedSet: Set<string> = new Set();

    const startNode: PathNode = {
      position: start,
      cost: 0
    };

    openSet.push(startNode);

    while (openSet.length > 0) {
      const current = this.getLowestCostNode(openSet);

      if (Vector2D.distance(current.position, end) < 10) {
        return this.reconstructPath(current);
      }

      openSet.splice(openSet.indexOf(current), 1);
      closedSet.add(this.getNodeKey(current));

      const neighbors = this.getNeighbors(current);
      for (const neighbor of neighbors) {
        if (closedSet.has(this.getNodeKey(neighbor))) continue;

        const tentativeCost = current.cost + Vector2D.distance(current.position, neighbor.position);

        if (!openSet.includes(neighbor) || tentativeCost < neighbor.cost) {
          neighbor.parent = current;
          neighbor.cost = tentativeCost;

          if (!openSet.includes(neighbor)) {
            openSet.push(neighbor);
          }
        }
      }
    }

    return []; // No path found
  }
}
```

### Movement Constraints
- **Walk Speed**: 120 pixels/second (normal movement)
- **Run Speed**: 180 pixels/second (creates noise, +5% fear if heard)
- **Door Transitions**: 500ms animation delay
- **Collision Detection**: Circle-based collision with 16px radius

## Ability System Architecture

### Ability Framework
```typescript
interface Ability {
  id: string;
  name: string;
  description: string;
  cooldown: number; // milliseconds
  duration?: number; // for channeled abilities
  range?: number; // tiles or rooms
  targetType: 'self' | 'player' | 'room' | 'area';
  cost?: AbilityCost;
  visualEffect?: VisualEffect;
  soundEffect?: SoundEffect;
}

interface AbilityCost {
  type: 'cooldown' | 'uses' | 'resource';
  value: number;
}

interface CooldownState {
  abilityId: string;
  remainingTime: number;
  lastUsed: number;
}

class AbilitySystem {
  private cooldowns: Map<string, Map<string, CooldownState>> = new Map();

  canUseAbility(playerId: string, abilityId: string): boolean {
    const playerCooldowns = this.cooldowns.get(playerId);
    if (!playerCooldowns) return true;

    const cooldown = playerCooldowns.get(abilityId);
    return !cooldown || cooldown.remainingTime <= 0;
  }

  useAbility(playerId: string, ability: Ability): boolean {
    if (!this.canUseAbility(playerId, abilityId)) return false;

    // Execute ability
    const success = this.executeAbility(playerId, ability);

    if (success) {
      // Apply cooldown
      this.applyCooldown(playerId, ability);
    }

    return success;
  }

  private executeAbility(playerId: string, ability: Ability): boolean {
    switch (ability.id) {
      case 'haunt_room':
        return this.executeHauntRoom(playerId, ability);
      case 'reveal_identity':
        return this.executeRevealIdentity(playerId, ability);
      case 'anonymous_message':
        return this.executeAnonymousMessage(playerId, ability);
      // ... other abilities
    }
  }
}
```

### Ability Execution Examples

#### Ghost Haunt Room Ability
```typescript
private executeHauntRoom(playerId: string, ability: Ability): boolean {
  const player = this.gameState.getPlayer(playerId);
  const room = this.gameState.getRoom(player.currentRoom);

  // Validate ability can be used
  if (!this.isGhost(playerId)) return false;
  if (room.hasActiveHaunting()) return false;

  // Create haunting event
  const haunting: HauntingEvent = {
    id: `haunt_${Date.now()}`,
    roomId: room.id,
    type: 'minor_haunting',
    duration: 10000, // 10 seconds
    fearIncrease: 15,
    effects: ['screen_shake', 'sound_whispers', 'particle_wisps']
  };

  // Apply effects
  room.addHaunting(haunting);
  this.fearEngine.applyHauntingFear(room.id, haunting.fearIncrease);

  // Visual and audio feedback
  this.visualSystem.playEffect(haunting.effects);
  this.audioSystem.playSound('haunting_whispers');

  // Generate evidence
  this.evidenceSystem.addClue({
    type: 'environmental',
    description: `Unexplained activity detected in ${room.name}`,
    timestamp: Date.now(),
    location: room.id
  });

  return true;
}
```

#### Detective Reveal Identity Ability
```typescript
private executeRevealIdentity(playerId: string, ability: Ability): boolean {
  const detective = this.gameState.getPlayer(playerId);
  const targetId = ability.targetPlayer;

  if (!this.isDetective(playerId)) return false;
  if (!targetId) return false;

  const target = this.gameState.getPlayer(targetId);
  const targetRole = this.roleSystem.getPlayerRole(targetId);

  // 5-second channeling time
  this.startChanneling(playerId, 5000, () => {
    // On success, reveal role privately to detective
    this.messageSystem.sendPrivateMessage(playerId, {
      type: 'role_reveal',
      targetRole: targetRole,
      targetCostume: target.costume
    });

    // Generate clue for others
    this.evidenceSystem.addClue({
      type: 'behavioral',
      description: `${detective.costume.description} was seen examining ${target.costume.description} closely`,
      timestamp: Date.now(),
      location: detective.currentRoom
    });
  });

  return true;
}
```

### Ability Balancing
- **Cooldown Management**: Server-authoritative cooldown tracking
- **Validation**: All abilities validated server-side before execution
- **Interruption**: Channeling abilities can be interrupted by movement or damage
- **Evidence Generation**: Most abilities leave detectable traces

## Integration with Game Loop

### Main Game Loop
```typescript
class GameEngine {
  private lastUpdate: number = 0;

  gameLoop(currentTime: number): void {
    const deltaTime = currentTime - this.lastUpdate;
    this.lastUpdate = currentTime;

    // Update all systems
    this.movementSystem.update(deltaTime);
    this.fearSystem.update(deltaTime);
    this.abilitySystem.updateCooldowns(deltaTime);
    this.environmentSystem.update(deltaTime);

    // Process queued events
    this.processEvents();

    // Synchronize state
    this.networkSystem.broadcastStateUpdate();

    // Render frame
    this.renderSystem.render();

    requestAnimationFrame(this.gameLoop.bind(this));
  }
}
```

This implementation provides a robust foundation for the core mechanics, with proper separation of concerns, server-side validation, and smooth client-side prediction for responsive gameplay.
