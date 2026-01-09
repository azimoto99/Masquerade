import React, { useState } from 'react';
import { useGameStore } from '../../hooks/useGameStore';

const Sidebar: React.FC = () => {
  const { currentPlayer, showSidebar, toggleSidebar } = useGameStore();
  const [activeTab, setActiveTab] = useState<'objectives' | 'clues' | 'players'>('objectives');

  if (!currentPlayer) {
    return null;
  }

  // Mock data for demonstration
  const mockObjectives = [
    {
      id: 'main_objective',
      title: 'Unmask the Ghost',
      description: 'Use your abilities to reveal the Ghost\'s identity',
      completed: false,
      progress: 0
    },
    {
      id: 'survive',
      title: 'Survive the Night',
      description: 'Keep your fear level below 100%',
      completed: false,
      progress: 35
    }
  ];

  const mockClues = [
    {
      id: 'clue_1',
      text: 'Someone was seen in the Library at 8:45 PM',
      timestamp: Date.now() - 300000,
      type: 'movement'
    },
    {
      id: 'clue_2',
      text: 'Cold air detected in the Wine Cellar',
      timestamp: Date.now() - 180000,
      type: 'environmental'
    }
  ];

  const mockPlayers = [
    {
      id: 'player_1',
      name: 'Red Jester',
      status: 'alive',
      fearLevel: 25,
      location: 'Grand Ballroom'
    },
    {
      id: 'player_2',
      name: 'Blue Phantom',
      status: 'alive',
      fearLevel: 45,
      location: 'Library'
    }
  ];

  const formatTime = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return 'Just now';
    if (minutes === 1) return '1 minute ago';
    return `${minutes} minutes ago`;
  };

  return (
    <div className={`sidebar ${showSidebar ? 'open' : 'closed'}`}>
      {/* Sidebar Toggle */}
      <button
        className="sidebar-toggle"
        onClick={toggleSidebar}
        title={showSidebar ? 'Collapse sidebar' : 'Expand sidebar'}
      >
        {showSidebar ? '◀' : '▶'}
      </button>

      {showSidebar && (
        <div className="sidebar-content">
          {/* Tab Navigation */}
          <div className="sidebar-tabs">
            <button
              className={`tab-button ${activeTab === 'objectives' ? 'active' : ''}`}
              onClick={() => setActiveTab('objectives')}
            >
              🎯 Objectives
            </button>
            <button
              className={`tab-button ${activeTab === 'clues' ? 'active' : ''}`}
              onClick={() => setActiveTab('clues')}
            >
              🔍 Clues
            </button>
            <button
              className={`tab-button ${activeTab === 'players' ? 'active' : ''}`}
              onClick={() => setActiveTab('players')}
            >
              👥 Players
            </button>
          </div>

          {/* Tab Content */}
          <div className="sidebar-body">
            {activeTab === 'objectives' && (
              <div className="objectives-tab">
                <h3>Your Objectives</h3>
                <div className="objectives-list">
                  {mockObjectives.map((objective) => (
                    <div key={objective.id} className="objective-item">
                      <div className="objective-header">
                        <h4>{objective.title}</h4>
                        {objective.completed && <span className="completed-badge">✓</span>}
                      </div>
                      <p className="objective-description">{objective.description}</p>
                      <div className="objective-progress">
                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{ width: `${objective.progress}%` }}
                          />
                        </div>
                        <span className="progress-text">{objective.progress}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'clues' && (
              <div className="clues-tab">
                <h3>Collected Clues</h3>
                <div className="clues-list">
                  {mockClues.map((clue) => (
                    <div key={clue.id} className="clue-item">
                      <div className="clue-type">
                        {clue.type === 'movement' ? '🚶' : '🌡️'}
                      </div>
                      <div className="clue-content">
                        <p className="clue-text">{clue.text}</p>
                        <span className="clue-timestamp">{formatTime(clue.timestamp)}</span>
                      </div>
                    </div>
                  ))}
                </div>
                {mockClues.length === 0 && (
                  <div className="empty-state">
                    <p>No clues collected yet.</p>
                    <p>Explore the mansion to find evidence!</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'players' && (
              <div className="players-tab">
                <h3>Players</h3>
                <div className="players-list">
                  {mockPlayers.map((player) => (
                    <div key={player.id} className="player-card">
                      <div className="player-avatar">
                        <div className="avatar-placeholder">
                          {player.name.charAt(0)}
                        </div>
                      </div>
                      <div className="player-info">
                        <div className="player-name">{player.name}</div>
                        <div className="player-details">
                          <span className={`status ${player.status}`}>
                            {player.status}
                          </span>
                          <span className="location">{player.location}</span>
                        </div>
                        <div className="fear-indicator">
                          <span className="fear-label">Fear:</span>
                          <div className="fear-mini-bar">
                            <div
                              className="fear-mini-fill"
                              style={{ width: `${player.fearLevel}%` }}
                            />
                          </div>
                          <span className="fear-value">{player.fearLevel}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
