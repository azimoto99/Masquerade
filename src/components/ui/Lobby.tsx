import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../hooks/useGameStore';

const Lobby: React.FC = () => {
  const { gameSession, startGame, connectToServer, joinMultiplayerGame, startMultiplayerGame, isConnected, isMultiplayer } = useGameStore();
  const [isStarting, setIsStarting] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [gameMode, setGameMode] = useState<'single' | 'multiplayer'>('single');

  const handleStartGame = async () => {
    if (!gameSession) return;

    setIsStarting(true);

    try {
      if (gameMode === 'multiplayer') {
        startMultiplayerGame();
      } else {
        // Start single-player game
        startGame();
      }

      // Brief introduction phase
      setTimeout(() => {
        setIsStarting(false);
      }, 1000);

    } catch (error) {
      console.error('Failed to start game:', error);
      setIsStarting(false);
    }
  };

  const handleJoinMultiplayer = async () => {
    if (!playerName.trim()) return;

    setIsJoining(true);

    try {
      await connectToServer();
      await joinMultiplayerGame(playerName.trim(), roomId.trim() || undefined);
      setGameMode('multiplayer');
    } catch (error) {
      console.error('Failed to join multiplayer game:', error);
      alert('Failed to join game. Please check your connection and try again.');
    } finally {
      setIsJoining(false);
    }
  };

  // Auto-connect to server on mount for multiplayer option
  useEffect(() => {
    if (gameMode === 'multiplayer' && !isConnected) {
      connectToServer().catch(error => {
        console.error('Failed to connect to server:', error);
      });
    }
  }, [gameMode, isConnected, connectToServer]);

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

      {/* Game Mode Selection */}
      <div className="game-mode-selection">
        <div className="mode-tabs">
          <button
            className={`mode-tab ${gameMode === 'single' ? 'active' : ''}`}
            onClick={() => setGameMode('single')}
          >
            🎭 Single Player
          </button>
          <button
            className={`mode-tab ${gameMode === 'multiplayer' ? 'active' : ''}`}
            onClick={() => setGameMode('multiplayer')}
          >
            👥 Multiplayer
            {isConnected && <span className="connection-indicator">🟢</span>}
            {!isConnected && gameMode === 'multiplayer' && <span className="connection-indicator">🔴</span>}
          </button>
        </div>

        {gameMode === 'multiplayer' && !isMultiplayer && (
          <div className="multiplayer-setup">
            <div className="setup-fields">
              <input
                type="text"
                placeholder="Your name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="lobby-input"
                maxLength={20}
              />
              <input
                type="text"
                placeholder="Room ID (optional)"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="lobby-input"
                maxLength={10}
              />
              <button
                onClick={handleJoinMultiplayer}
                disabled={!playerName.trim() || isJoining}
                className="btn btn-primary"
              >
                {isJoining ? 'Joining...' : 'Join Game'}
              </button>
            </div>
            {!isConnected && (
              <p className="connection-status">Connecting to game server...</p>
            )}
          </div>
        )}
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
