// Ability definitions and configurations

import { Ability } from './game';

export const ABILITIES: Record<string, Ability> = {
  // Detective Abilities
  detective_reveal: {
    id: 'detective_reveal',
    name: 'Reveal Identity',
    description: 'Uncover the true identity of another player. Can only be used 3 times per game.',
    roleId: 'detective',
    icon: '🔍',
    cooldown: 0, // No cooldown, limited uses instead
    duration: 0,
    range: { type: 'global' },
    targetType: 'player',
    cost: {
      type: 'uses',
      value: 3,
      maxValue: 3
    },
    effects: [{
      type: 'reveal_identity',
      value: 1,
      conditions: [{ type: 'target_has_role', value: true }]
    }],
    validationRules: {
      requiresLineOfSight: false,
      maxTargets: 1
    }
  },

  // Blackmailer Abilities
  blackmailer_message: {
    id: 'blackmailer_message',
    name: 'Anonymous Message',
    description: 'Send a private message to any player without revealing your identity.',
    roleId: 'blackmailer',
    icon: '💌',
    cooldown: 60000, // 1 minute
    duration: 0,
    range: { type: 'global' },
    targetType: 'player',
    cost: { type: 'cooldown', value: 60000 },
    effects: [{
      type: 'send_message',
      value: 1,
      conditions: [{ type: 'anonymous', value: true }]
    }],
    validationRules: {
      requiresLineOfSight: false,
      maxTargets: 1
    }
  },

  blackmailer_eavesdrop: {
    id: 'blackmailer_eavesdrop',
    name: 'Eavesdrop',
    description: 'Listen in on conversations in your current room for 20 seconds.',
    roleId: 'blackmailer',
    icon: '👂',
    cooldown: 90000, // 1.5 minutes
    duration: 20000,
    range: { type: 'room' },
    targetType: 'none',
    cost: { type: 'cooldown', value: 90000 },
    effects: [{
      type: 'eavesdrop',
      value: 1,
      duration: 20000,
      conditions: [{ type: 'in_same_room', value: true }]
    }],
    validationRules: {
      requiresLineOfSight: false
    }
  },

  // Accomplice Abilities
  accomplice_disturbance: {
    id: 'accomplice_disturbance',
    name: 'Minor Disturbance',
    description: 'Create a small spooky effect that the Ghost can take credit for.',
    roleId: 'accomplice',
    icon: '👻',
    cooldown: 45000, // 45 seconds
    duration: 0,
    range: { type: 'room' },
    targetType: 'none',
    cost: { type: 'cooldown', value: 45000 },
    effects: [{
      type: 'fear_increase',
      value: 5,
      conditions: [{ type: 'in_same_room', value: true }]
    }],
    validationRules: {
      requiresLineOfSight: false
    }
  },

  // Exorcist Abilities
  exorcist_sense: {
    id: 'exorcist_sense',
    name: 'Sense Presence',
    description: 'Detect if the Ghost has used abilities in this room recently.',
    roleId: 'exorcist',
    icon: '🔮',
    cooldown: 30000, // 30 seconds
    duration: 0,
    range: { type: 'adjacent' },
    targetType: 'none',
    cost: { type: 'cooldown', value: 30000 },
    effects: [{
      type: 'detect_ghost_activity',
      value: 1,
      conditions: [{ type: 'recent_activity', value: 60000 }] // Last minute
    }],
    validationRules: {
      requiresLineOfSight: false
    }
  },

  // Heir Abilities
  heir_fear_sense: {
    id: 'heir_fear_sense',
    name: 'Fear Sense',
    description: 'Always know how scared every player is.',
    roleId: 'heir',
    icon: '👁️',
    cooldown: 0,
    duration: 0,
    range: { type: 'global' },
    targetType: 'none',
    cost: { type: 'cooldown', value: 0 },
    effects: [{
      type: 'see_all_fear',
      value: 1,
      conditions: [{ type: 'always_active', value: true }]
    }],
    validationRules: {
      requiresLineOfSight: false
    }
  },

  // Medium Abilities
  medium_spiritual_awareness: {
    id: 'medium_spiritual_awareness',
    name: 'Spiritual Awareness',
    description: 'Get notified when the Ghost uses powerful abilities nearby.',
    roleId: 'medium',
    icon: '👁️',
    cooldown: 0,
    duration: 0,
    range: { type: 'adjacent' },
    targetType: 'none',
    cost: { type: 'cooldown', value: 0 },
    effects: [{
      type: 'detect_major_ghost_activity',
      value: 1,
      conditions: [{ type: 'within_2_rooms', value: true }]
    }],
    validationRules: {
      requiresLineOfSight: false
    }
  },

  medium_commune: {
    id: 'medium_commune',
    name: 'Commune with Spirits',
    description: 'Meditate to learn about recent supernatural activity.',
    roleId: 'medium',
    icon: '🕯️',
    cooldown: 120000, // 2 minutes
    duration: 5000, // 5 second channel
    range: { type: 'room' },
    targetType: 'none',
    cost: { type: 'cooldown', value: 120000 },
    effects: [{
      type: 'learn_ghost_location',
      value: 1,
      duration: 5000,
      conditions: [{ type: 'channeling', value: true }]
    }],
    validationRules: {
      requiresLineOfSight: false
    }
  },

  // Paranormal Investigator Abilities
  paranormal_sensor: {
    id: 'paranormal_sensor',
    name: 'Set Up Sensor',
    description: 'Place up to 3 sensors that detect Ghost activity.',
    roleId: 'paranormal_investigator',
    icon: '📡',
    cooldown: 0, // Limited by sensor count
    duration: 0,
    range: { type: 'room' },
    targetType: 'none',
    cost: { type: 'resource', value: 1 },
    effects: [{
      type: 'place_sensor',
      value: 1,
      conditions: [{ type: 'max_3_sensors', value: true }]
    }],
    validationRules: {
      requiresLineOfSight: false
    }
  },

  paranormal_document: {
    id: 'paranormal_document',
    name: 'Document Event',
    description: 'Record a supernatural event you witnessed.',
    roleId: 'paranormal_investigator',
    icon: '📸',
    cooldown: 15000, // 15 seconds
    duration: 0,
    range: { type: 'room' },
    targetType: 'none',
    cost: { type: 'cooldown', value: 15000 },
    effects: [{
      type: 'gain_evidence_point',
      value: 1,
      conditions: [{ type: 'witnessed_ghost_activity', value: true }]
    }],
    validationRules: {
      requiresLineOfSight: true
    }
  },

  // Skeptic Abilities
  skeptic_analyze: {
    id: 'skeptic_analyze',
    name: 'Rational Analysis',
    description: 'Analyze a haunting to find logical explanations.',
    roleId: 'skeptic',
    icon: '🔬',
    cooldown: 45000, // 45 seconds
    duration: 0,
    range: { type: 'room' },
    targetType: 'none',
    cost: { type: 'cooldown', value: 45000 },
    effects: [{
      type: 'find_explanation',
      value: 1,
      conditions: [{ type: 'haunting_present', value: true }]
    }],
    validationRules: {
      requiresLineOfSight: false
    }
  },

  skeptic_expose: {
    id: 'skeptic_expose',
    name: 'Public Accusation',
    description: 'Accuse someone of being the Ghost (high risk, high reward).',
    roleId: 'skeptic',
    icon: '📢',
    cooldown: 0, // Limited uses
    duration: 0,
    range: { type: 'global' },
    targetType: 'player',
    cost: { type: 'uses', value: 2, maxValue: 2 },
    effects: [{
      type: 'public_accusation',
      value: 1,
      conditions: [{ type: 'immediate_vote', value: true }]
    }],
    validationRules: {
      requiresLineOfSight: false,
      maxTargets: 1
    }
  },

  // Insurance Investigator Abilities
  insurance_inspect: {
    id: 'insurance_inspect',
    name: 'Inspect Damage',
    description: 'Examine haunting aftermath to determine if it\'s staged.',
    roleId: 'insurance_investigator',
    icon: '📋',
    cooldown: 30000, // 30 seconds
    duration: 0,
    range: { type: 'room' },
    targetType: 'none',
    cost: { type: 'cooldown', value: 30000 },
    effects: [{
      type: 'assess_damage',
      value: 1,
      conditions: [{ type: 'after_haunting', value: true }]
    }],
    validationRules: {
      requiresLineOfSight: false
    }
  },

  insurance_interview: {
    id: 'insurance_interview',
    name: 'Interview Witness',
    description: 'Ask another player a yes/no question about the events.',
    roleId: 'insurance_investigator',
    icon: '🗣️',
    cooldown: 60000, // 1 minute
    duration: 0,
    range: { type: 'room' },
    targetType: 'player',
    cost: { type: 'cooldown', value: 60000 },
    effects: [{
      type: 'ask_question',
      value: 1,
      conditions: [{ type: 'yes_no_only', value: true }]
    }],
    validationRules: {
      requiresLineOfSight: true,
      maxTargets: 1
    }
  },

  // Ghost Abilities
  ghost_haunt: {
    id: 'ghost_haunt',
    name: 'Haunt Room',
    description: 'Create eerie atmosphere that increases fear in the room.',
    roleId: 'ghost',
    icon: '👻',
    cooldown: 30000, // 30 seconds
    duration: 10000,
    range: { type: 'room' },
    targetType: 'none',
    cost: { type: 'cooldown', value: 30000 },
    effects: [{
      type: 'fear_increase',
      value: 15,
      duration: 10000,
      conditions: [{ type: 'in_same_room', value: true }]
    }],
    validationRules: {
      requiresLineOfSight: false
    }
  },

  ghost_major_scare: {
    id: 'ghost_major_scare',
    name: 'Major Scare',
    description: 'Create a dramatic haunting event with high fear impact.',
    roleId: 'ghost',
    icon: '😱',
    cooldown: 90000, // 1.5 minutes
    duration: 15000,
    range: { type: 'room' },
    targetType: 'none',
    cost: { type: 'cooldown', value: 90000 },
    effects: [{
      type: 'fear_increase',
      value: 30,
      duration: 15000,
      conditions: [{ type: 'in_same_room', value: true }]
    }],
    validationRules: {
      requiresLineOfSight: false
    }
  },

  ghost_lockdown: {
    id: 'ghost_lockdown',
    name: 'Lockdown',
    description: 'Lock all doors to/from this room for 20 seconds.',
    roleId: 'ghost',
    icon: '🔒',
    cooldown: 120000, // 2 minutes
    duration: 20000,
    range: { type: 'room' },
    targetType: 'none',
    cost: { type: 'cooldown', value: 120000 },
    effects: [{
      type: 'lock_doors',
      value: 1,
      duration: 20000,
      conditions: [{ type: 'affect_room_connections', value: true }]
    }],
    validationRules: {
      requiresLineOfSight: false
    }
  },

  ghost_lights_out: {
    id: 'ghost_lights_out',
    name: 'Lights Out',
    description: 'Turn off lights in this room and 2 adjacent rooms.',
    roleId: 'ghost',
    icon: '💡',
    cooldown: 60000, // 1 minute
    duration: 30000,
    range: { type: 'adjacent' },
    targetType: 'none',
    cost: { type: 'cooldown', value: 60000 },
    effects: [{
      type: 'reduce_lighting',
      value: 1,
      duration: 30000,
      conditions: [{ type: 'adjacent_rooms', value: true }]
    }],
    validationRules: {
      requiresLineOfSight: false
    }
  }
};

// Helper functions
export function getAbility(abilityId: string): Ability | null {
  return ABILITIES[abilityId] || null;
}

export function getRoleAbilities(roleId: string): Ability[] {
  return Object.values(ABILITIES).filter(ability => ability.roleId === roleId);
}

export function canUseAbility(ability: Ability, lastUsed?: number): boolean {
  if (!lastUsed) return true;

  const now = Date.now();
  return now - lastUsed >= ability.cooldown;
}
