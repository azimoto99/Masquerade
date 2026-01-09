import React, { useEffect, useRef } from 'react';
import { useGameStore } from '../../hooks/useGameStore';
import GameViewport from './GameViewport';
import StatusBar from './StatusBar';
import ControlPanel from './ControlPanel';
import Sidebar from './Sidebar';

const Game: React.FC = () => {
  const { gameSession, showSidebar } = useGameStore();
  const gameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Set up game event listeners
    const handleKeyDown = (event: KeyboardEvent) => {
      // Handle global keyboard shortcuts
      switch (event.key) {
        case 'Tab':
          event.preventDefault();
          // Toggle sidebar
          break;
        case 'Escape':
          // Close modals
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!gameSession) {
    return (
      <div className="game-loading">
        <div>Loading game...</div>
      </div>
    );
  }

  return (
    <div ref={gameRef} className="game">
      {/* Top Status Bar */}
      <StatusBar />

      {/* Main Game Area */}
      <div className="game-main">
        {/* Game Viewport */}
        <div className={`game-viewport ${showSidebar ? 'with-sidebar' : 'full-width'}`}>
          <GameViewport />
        </div>

        {/* Sidebar Panel */}
        {showSidebar && <Sidebar />}
      </div>

      {/* Bottom Control Panel */}
      <ControlPanel />
    </div>
  );
};

export default Game;
