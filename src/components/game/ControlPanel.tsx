import React, { useState } from 'react';
import { useGameStore } from '../../hooks/useGameStore';

const ControlPanel: React.FC = () => {
  const { currentPlayer, selectedAbility, setSelectedAbility } = useGameStore();
  const [chatMessage, setChatMessage] = useState('');

  if (!currentPlayer) {
    return null;
  }

  // Mock abilities for demonstration
  const mockAbilities = [
    {
      id: 'move',
      name: 'Move',
      icon: '🚶',
      description: 'Move around the mansion',
      available: true
    },
    {
      id: 'investigate',
      name: 'Investigate',
      icon: '🔍',
      description: 'Examine your surroundings',
      available: true
    },
    {
      id: 'talk',
      name: 'Talk',
      icon: '💬',
      description: 'Communicate with nearby players',
      available: true
    }
  ];

  const handleAbilityClick = (abilityId: string) => {
    if (selectedAbility === abilityId) {
      setSelectedAbility(null);
    } else {
      setSelectedAbility(abilityId);
      console.log(`Selected ability: ${abilityId}`);
    }
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
        {mockAbilities.map((ability) => (
          <button
            key={ability.id}
            className={`ability-button ${selectedAbility === ability.id ? 'selected' : ''}`}
            onClick={() => handleAbilityClick(ability.id)}
            disabled={!ability.available}
            title={ability.description}
          >
            <div className="ability-icon">{ability.icon}</div>
            <div className="ability-name">{ability.name}</div>
          </button>
        ))}
      </div>

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
