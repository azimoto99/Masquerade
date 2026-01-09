import React, { useState } from 'react';
import { useGameStore } from '../../hooks/useGameStore';
import { GamePhase } from '../../types/game';

const Lobby: React.FC = () => {
  const { gameSession, updateGameSession } = useGameStore();
  const [isStarting, setIsStarting] = useState(false);

  const handleStartGame = async () => {
    if (!gameSession) return;

    setIsStarting(true);

    try {
      // Transition to game
      updateGameSession({
        currentPhase: GamePhase.INTRODUCTION
      });

      // In a full implementation, this would:
      // 1. Assign roles randomly
      // 2. Assign costumes
      // 3. Sync with all players
      // 4. Start the game timer

      setTimeout(() => {
        updateGameSession({
          currentPhase: GamePhase.EXPLORATION
        });
        setIsStarting(false);
      }, 3000); // Brief introduction phase

    } catch (error) {
      console.error('Failed to start game:', error);
      setIsStarting(false);
    }
  };

  if (!gameSession) {
    return (
      <div className="lobby-loading">
        <div>Loading game session...</div>
      </div>
    );
  }

  return (
    <div className="lobby">
      <div className="lobby-header">
        <h1>Masquerade Mansion</h1>
        <p>A social deduction game for Discord</p>
      </div>

      <div className="lobby-content">
        <div className="game-info">
          <h2>Game Setup</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="label">Players:</span>
              <span className="value">{gameSession.players.length}/10</span>
            </div>
            <div className="info-item">
              <span className="label">Duration:</span>
              <span className="value">{gameSession.settings.gameDuration} minutes</span>
            </div>
            <div className="info-item">
              <span className="label">Voice Channel:</span>
              <span className="value">Connected</span>
            </div>
          </div>
        </div>

        <div className="players-list">
          <h3>Players in Lobby</h3>
          <div className="players-grid">
            {gameSession.players.map((player) => (
              <div key={player.id} className="player-card">
                <div className="player-avatar">
                  {/* Placeholder for Discord avatar */}
                  <div className="avatar-placeholder">
                    {player.username.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="player-info">
                  <div className="player-name">{player.username}</div>
                  <div className="player-status">Ready</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="game-rules">
          <h3>How to Play</h3>
          <div className="rules-content">
            <p>
              One player is secretly the <strong>Ghost</strong> trying to scare everyone away.
              Everyone else has unique roles and objectives that revolve around the Ghost.
            </p>
            <p>
              Use your abilities, gather clues, and form alliances in this social deduction game!
            </p>
          </div>
        </div>
      </div>

      <div className="lobby-actions">
        <button
          className="btn btn-primary"
          onClick={handleStartGame}
          disabled={isStarting || gameSession.players.length < 2}
        >
          {isStarting ? 'Starting Game...' : 'Start Game'}
        </button>

        {gameSession.players.length < 2 && (
          <p className="waiting-text">
            Waiting for more players to join...
          </p>
        )}
      </div>
    </div>
  );
};

export default Lobby;
