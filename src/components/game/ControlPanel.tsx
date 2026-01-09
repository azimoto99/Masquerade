import React, { useState } from 'react';
import { useGameStore } from '../../hooks/useGameStore';

const ControlPanel: React.FC = () => {
  const { currentPlayer, selectedAbility, setSelectedAbility, useAbility, sendAbility, isMultiplayer } = useGameStore();
  const [chatMessage, setChatMessage] = useState('');
  const [targetPlayer, setTargetPlayer] = useState<string>('');

  if (!currentPlayer) {
    return null;
  }

  // Get player's actual abilities
  const playerAbilities = currentPlayer.abilities || [];

  // Mock target players for demonstration (in real multiplayer, this would come from game state)
  const mockPlayers = [
    { id: 'player1', username: 'Alice' },
    { id: 'player2', username: 'Bob' },
    { id: 'player3', username: 'Charlie' }
  ];

  const handleAbilityClick = (abilityId: string) => {
    const ability = playerAbilities.find(a => a.id === abilityId);
    if (!ability) return;

    if (selectedAbility === abilityId) {
      // Execute the ability
      if (ability.targetType === 'player' && !targetPlayer) {
        console.log('Please select a target player first');
        return;
      }

      const success = useAbility(abilityId, targetPlayer || undefined);
      if (success) {
        console.log(`Successfully used ability: ${ability.name}`);

        // Send to server in multiplayer
        if (isMultiplayer) {
          sendAbility(abilityId, targetPlayer || undefined);
        }

        if (ability.targetType === 'player') {
          setTargetPlayer('');
        }
      } else {
        console.log(`Failed to use ability: ${ability.name} (on cooldown or invalid)`);
      }
      setSelectedAbility(null);
    } else {
      // Select the ability
      setSelectedAbility(abilityId);
      console.log(`Selected ability: ${ability.name}`);
    }
  };

  const isAbilityOnCooldown = (ability: any) => {
    if (!ability.lastUsed) return false;
    const now = Date.now();
    return now - ability.lastUsed < ability.cooldown;
  };

  const getCooldownTime = (ability: any) => {
    if (!ability.lastUsed) return 0;
    const now = Date.now();
    const remaining = ability.cooldown - (now - ability.lastUsed);
    return Math.max(0, Math.ceil(remaining / 1000));
  };

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      console.log(`Sending message: ${chatMessage}`);
      // In full implementation, this would send to voice channel or text chat
      setChatMessage('');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="control-panel">
      {/* Ability Bar */}
      <div className="ability-bar">
        {playerAbilities.map((ability) => {
          const onCooldown = isAbilityOnCooldown(ability);
          const cooldownTime = getCooldownTime(ability);

          return (
            <button
              key={ability.id}
              className={`ability-button ${selectedAbility === ability.id ? 'selected' : ''} ${onCooldown ? 'cooldown' : ''}`}
              onClick={() => handleAbilityClick(ability.id)}
              disabled={onCooldown}
              title={`${ability.name}: ${ability.description}${onCooldown ? ` (Cooldown: ${cooldownTime}s)` : ''}`}
            >
              <div className="ability-icon">{ability.icon}</div>
              <div className="ability-name">{ability.name}</div>
              {onCooldown && (
                <div className="cooldown-timer">{cooldownTime}</div>
              )}
            </button>
          );
        })}
      </div>

      {/* Target Selection (when ability requires a player target) */}
      {selectedAbility && playerAbilities.find(a => a.id === selectedAbility)?.targetType === 'player' && (
        <div className="target-selection">
          <select
            value={targetPlayer}
            onChange={(e) => setTargetPlayer(e.target.value)}
            className="target-select"
          >
            <option value="">Select target player...</option>
            {mockPlayers.map(player => (
              <option key={player.id} value={player.id}>
                {player.username}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Quick Chat */}
      <div className="quick-chat">
        <input
          type="text"
          className="chat-input"
          placeholder="Type a message..."
          value={chatMessage}
          onChange={(e) => setChatMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          maxLength={200}
        />
        <button
          className="chat-send-btn"
          onClick={handleSendMessage}
          disabled={!chatMessage.trim()}
        >
          Send
        </button>
      </div>

      {/* Voice Status */}
      <div className="voice-status">
        <div className="voice-icon">🎤</div>
        <div className="voice-text">Voice Connected</div>
      </div>
    </div>
  );
};

export default ControlPanel;
