import React from 'react';
import { useGameStore } from '../../hooks/useGameStore';
import { GamePhase } from '../../types/game';

const StatusBar: React.FC = () => {
  const { gameSession, currentPlayer } = useGameStore();

  if (!gameSession || !currentPlayer) {
    return null;
  }

  const formatTime = (milliseconds: number): string => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getPhaseDisplayName = (phase: GamePhase): string => {
    switch (phase) {
      case GamePhase.LOBBY:
        return 'Lobby';
      case GamePhase.INTRODUCTION:
        return 'Introduction';
      case GamePhase.EXPLORATION:
        return 'Exploration';
      case GamePhase.EMERGENCY_MEETING:
        return 'Emergency Meeting';
      case GamePhase.RESOLUTION:
        return 'Resolution';
      case GamePhase.GAME_OVER:
        return 'Game Over';
      default:
        return 'Unknown';
    }
  };

  const alivePlayers = gameSession.players.filter(p => p.status === 'alive').length;
  const totalPlayers = gameSession.players.length;

  return (
    <div className="status-bar">
      {/* Fear Meter */}
      <div className="status-item fear-meter">
        <div className="fear-label">Fear</div>
        <div className="fear-bar-container">
          <div
            className="fear-bar-fill"
            style={{
              width: `${(currentPlayer.fearLevel / currentPlayer.maxFear) * 100}%`,
              backgroundColor: currentPlayer.fearLevel > 75 ? '#ef4444' :
                              currentPlayer.fearLevel > 50 ? '#f59e0b' : '#10b981'
            }}
          />
        </div>
        <div className="fear-percentage">{Math.round(currentPlayer.fearLevel)}%</div>
      </div>

      {/* Time Remaining */}
      <div className="status-item time-display">
        <div className="time-icon">⏱️</div>
        <div className="time-value">{formatTime(gameSession.timeRemaining)}</div>
      </div>

      {/* Player Count */}
      <div className="status-item player-count">
        <div className="player-icon">👥</div>
        <div className="player-value">{alivePlayers}/{totalPlayers}</div>
      </div>

      {/* Current Phase */}
      <div className="status-item game-phase">
        <div className="phase-indicator">
          {getPhaseDisplayName(gameSession.currentPhase)}
        </div>
      </div>

      {/* Costume Display */}
      <div className="status-item costume-display">
        <div className="costume-icon">🎭</div>
        <div className="costume-name">{currentPlayer.costume.name}</div>
      </div>
    </div>
  );
};

export default StatusBar;
