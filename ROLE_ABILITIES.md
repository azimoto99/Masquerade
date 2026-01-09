# Role Abilities Specification

## Ability Framework

### Core Ability Properties
```typescript
interface Ability {
  id: string;
  name: string;
  description: string;
  roleId: string;
  cooldown: number; // milliseconds
  duration?: number; // for channeled abilities
  range: AbilityRange;
  targetType: TargetType;
  cost?: AbilityCost;
  visualEffect: VisualEffect;
  soundEffect: SoundEffect;
  validation: ValidationRules;
  effects: AbilityEffect[];
}
```

### Ability Categories
- **Active Abilities**: Triggered by player input
- **Passive Abilities**: Always active background effects
- **Ultimate Abilities**: Powerful one-time or rare use abilities
- **Utility Abilities**: Support and information gathering

## Ghost Abilities

### 1. Haunt Room (Active)
**Cooldown**: 30 seconds
**Range**: Current room
**Target**: All players in room
**Effects**:
- Increases fear by 15 for all players in room
- 10-second duration with visual effects
- Leaves environmental evidence
- Generates minor clues

**Implementation**:
```typescript
{
  id: 'haunt_room',
  name: 'Haunt Room',
  description: 'Create an eerie atmosphere that unnerves guests',
  cooldown: 30000,
  effects: [
    {
      type: 'fear_increase',
      value: 15,
      duration: 10000,
      targets: 'room_occupants'
    },
    {
      type: 'visual_effect',
      effect: 'room_dimming',
      duration: 10000
    },
    {
      type: 'evidence_generation',
      clue: 'atmospheric_disturbance'
    }
  ]
}
```

### 2. Major Scare (Active)
**Cooldown**: 90 seconds
**Range**: Current room
**Target**: All players in room
**Effects**:
- Increases fear by 30 for all players in room
- 15-second duration with dramatic effects
- Higher evidence generation
- Chance to trigger flee at high fear levels

### 3. Lockdown (Active)
**Cooldown**: 120 seconds
**Range**: Current room
**Target**: Room doors
**Effects**:
- Locks all doors for 20 seconds
- Traps players inside
- Generates significant fear from isolation
- Creates alibi opportunities

### 4. Lights Out (Active)
**Cooldown**: 60 seconds
**Range**: Adjacent rooms (3 rooms)
**Target**: Lighting systems
**Effects**:
- Reduces lighting to emergency levels
- Increases fear generation rate
- Reduces visibility
- Creates navigation challenges

### 5. Possession (Passive)
**Trigger**: Interacting with cursed objects
**Effects**:
- Temporary manifestation
- High fear increase (25)
- Leaves strong evidence
- Reveals Ghost location briefly

## Detective Abilities

### 1. Reveal Identity (Ultimate)
**Uses**: 3 per game
**Range**: Line of sight
**Target**: Single player
**Effects**:
- Learn target's true role (private)
- 5-second channeling (interruptible)
- Generates behavioral evidence
- Cannot be used in rapid succession

**Implementation Notes**:
- Channeling creates tension
- Interruption by movement or scares
- Evidence generation for other players

### 2. Call Emergency Meeting (Active)
**Cooldown**: Twice per game
**Uses**: 2 total
**Range**: Global
**Effects**:
- Teleport all to Grand Ballroom
- 60-second discussion phase
- Enables voting phase
- Reveals player positions

### 3. Analyze Clue (Active)
**Cooldown**: 45 seconds
**Range**: Current room
**Effects**:
- Reveals recent activity in room
- Shows timing of ability usage
- Provides environmental clues
- Helps track Ghost patterns

## Blackmailer Abilities

### 1. Anonymous Message (Active)
**Cooldown**: 60 seconds
**Range**: Global
**Target**: Single player
**Effects**:
- Send private message without revealing sender
- No recipient knows who sent it
- Can contain threats, deals, or misinformation
- Creates paranoia and suspicion

**Strategic Use**:
- Extortion attempts
- False information spreading
- Alliance building
- Ghost manipulation

### 2. Eavesdrop (Active)
**Cooldown**: 90 seconds
**Range**: Current room
**Effects**:
- Become temporarily invisible
- Hear proximity chat for 20 seconds
- See ability usage in room
- Cannot move while active

### 3. Demand Payment (Ultimate)
**Uses**: Once after identifying Ghost
**Range**: Private message to Ghost
**Effects**:
- Present extortion terms
- Ghost can accept or refuse
- If refused, can expose Ghost publicly
- Creates high-stakes negotiation

## Accomplice Abilities

### 1. Minor Disturbance (Active)
**Cooldown**: 45 seconds
**Range**: Current room
**Effects**:
- Small spooky event (creaking, cold breeze)
- +5 fear increase
- Blame attributed to Ghost
- Minimal evidence generation

### 2. False Witness (Active)
**Cooldown**: Twice per game
**Uses**: 2 total
**Range**: Current room
**Effects**:
- Plant false evidence
- Creates misleading clues
- Can frame other players
- Subtle enough to seem like Ghost activity

### 3. Tip Off (Active)
**Cooldown**: 90 seconds
**Range**: Private to Ghost
**Effects**:
- Send anonymous warning to Ghost
- Reveals player movements or plans
- Helps Ghost coordinate ambushes
- Maintains Accomplice's secrecy

## Exorcist Abilities

### 1. Sense Presence (Active)
**Cooldown**: 30 seconds
**Range**: Adjacent rooms
**Effects**:
- Detect Ghost ability usage in last 60 seconds
- Visual indicator on affected rooms
- Shows direction of recent activity
- Builds evidence for ritual

### 2. Collect Ritual Component (Passive)
**Trigger**: Being in specific rooms
**Locations**: Library, Chapel, Attic
**Effects**:
- Automatic collection when entering room
- Progress: 0/3 components
- Visual feedback on collection
- Required for exorcism

### 3. Perform Exorcism (Ultimate)
**Uses**: Once with 3 components
**Range**: Same room as Ghost
**Effects**:
- 10-second channeling ritual
- Must stay in same room as Ghost
- If successful, Ghost is banished
- Alternative win condition to voting

## Heir Abilities

### 1. Fear Sense (Passive)
**Effects**:
- See fear meters of all players
- Real-time fear level visibility
- Know who is close to fleeing
- Strategic information for objectives

### 2. Fake Panic (Active)
**Cooldown**: 60 seconds
**Effects**:
- Appear more frightened than actual fear level
- Misleads investigators
- Looks vulnerable to protect status
- Can be called out if overused

### 3. Sabotage Investigation (Active)
**Cooldown**: 90 seconds
**Range**: Current room
**Effects**:
- Remove one piece of evidence
- Destroys clues that could help catch Ghost
- Leaves subtle trace of interference
- Protects Ghost indirectly

## Medium Abilities

### 1. Spiritual Awareness (Passive)
**Trigger**: Ghost uses Major Scare or Lockdown
**Range**: Within 2 rooms
**Effects**:
- Notification of powerful presence
- Direction indicator to Ghost location
- No exact position, just proximity
- Helps narrow down search areas

### 2. Séance (Active)
**Cooldown**: 120 seconds
**Range**: Current room
**Effects**:
- 5-second meditation
- Reveals if Ghost was in room recently
- Shows directional hint if Ghost left
- Builds case for identification

### 3. Commune (Ultimate)
**Uses**: Once per game
**Range**: Within 2 rooms of Ghost
**Effects**:
- Psychic vision of Ghost's costume
- Narrows suspects by color family
- Significant clue toward identity
- Cannot be used for accusation

## Paranormal Investigator Abilities

### 1. Set Up Equipment (Passive)
**Setup**: Place up to 3 sensors
**Range**: Chosen rooms
**Effects**:
- Sensors detect Ghost ability usage
- Notifications when triggered
- Accumulates evidence points
- Cannot be removed once placed

### 2. Document Event (Active)
**Cooldown**: 15 seconds
**Trigger**: Witnessing or being in room during haunting
**Effects**:
- Capture evidence point
- Need 5 points total for victory
- Can be done multiple times
- Benefits from active Ghost

### 3. Analyze Pattern (Active)
**Cooldown**: 90 seconds
**Effects**:
- Review collected evidence
- Gain insight into Ghost's patterns
- Predict likely next locations
- Improves investigation efficiency

## Skeptic Abilities

### 1. Rational Analysis (Active)
**Cooldown**: 45 seconds
**Range**: Current room
**Effects**:
- Examine haunting evidence
- Get debunking clue
- Points toward human explanation
- Reveals logical inconsistencies

### 2. Catch in the Act (Passive)
**Trigger**: Direct line of sight to Ghost ability use
**Effects**:
- Immediate notification
- Significant clue toward identity
- Higher chance of correct identification
- Risk of being too close to Ghost

### 3. Public Accusation (Active)
**Uses**: Twice per game
**Range**: Global announcement
**Effects**:
- Accuse specific costume publicly
- High risk, high reward
- If correct: Ghost exposed with humiliation
- If wrong: Lose credibility and fear immunity

## Insurance Investigator Abilities

### 1. Inspect Damage (Active)
**Cooldown**: 30 seconds
**Range**: Current room
**Effects**:
- Examine aftermath of hauntings
- Get classification: Natural/Staged/Inconclusive
- Builds case file evidence
- Neutral information gathering

### 2. Interview Witness (Active)
**Cooldown**: 60 seconds
**Range**: Same room
**Target**: One player
**Effects**:
- Ask one yes/no question
- Target must answer (can lie)
- Gather testimonial evidence
- Helps determine Ghost's nature

### 3. File Report (Ultimate)
**Uses**: Once with 4+ evidence pieces
**Effects**:
- Submit final determination
- Can conclude Real or Fake haunting
- Win condition regardless of accuracy
- Ends investigation phase

## Ability Balance Considerations

### Power Scaling
- **Early Game**: Information gathering abilities
- **Mid Game**: Active intervention abilities
- **Late Game**: Ultimate resolution abilities

### Counterplay
- **Interruption**: Channeling abilities vulnerable
- **Evidence Generation**: Most abilities leave traces
- **Cooldown Management**: Strategic timing required
- **Risk/Reward**: Powerful abilities have consequences

### Accessibility
- **Clear Feedback**: Visual and audio indicators
- **Predictable Timing**: Consistent cooldowns
- **Strategic Depth**: Multiple use patterns
- **Balance Iteration**: Data-driven adjustments

This ability system creates distinct playstyles for each role while maintaining balance and strategic depth. Each ability serves the role's objectives while contributing to the overall social deduction gameplay.
