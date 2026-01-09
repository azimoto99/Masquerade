import React, { useState, useEffect } from 'react';
import Game from './components/game/Game';
import Lobby from './components/ui/Lobby';
import { GamePhase } from './types/game';
import { useGameStore } from './hooks/useGameStore';

interface AppProps {
  discordContext: {
    user: any;
    channel: any;
  };
}

const App: React.FC<AppProps> = ({ discordContext }) => {
  const [isConnected, setIsConnected] = useState(false);
  const { gameSession, initializeGame } = useGameStore();

  useEffect(() => {
    // Initialize game store with Discord context
    initializeGame(discordContext.user, discordContext.channel);
    setIsConnected(true);

    // Discord event handling would be set up here in production
    // For now, we'll handle events through the game store

    return () => {
      // Cleanup
    };
  }, [discordContext, initializeGame]);

  if (!isConnected) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#1a1a1a',
        color: '#ffffff'
      }}>
        <div>Connecting to Discord...</div>
      </div>
    );
  }

  return (
    <div className="app">
      {gameSession?.currentPhase === GamePhase.LOBBY ? (
        <Lobby />
      ) : (
        <Game />
      )}
    </div>
  );
};

export default App;
