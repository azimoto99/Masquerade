import React from 'react';
import { useGameStore } from '../../hooks/useGameStore';
import { Vector2D } from '../../types/game';
import { InteractableObject } from '../../types/rooms';
import RoomRenderer from './RoomRenderer';

const GameViewport: React.FC = () => {
  const { currentPlayer, movePlayer, gameSession } = useGameStore();

  if (!gameSession || !currentPlayer) {
    return (
      <div className="game-viewport-loading">
        <div>Loading game viewport...</div>
      </div>
    );
  }

  const handlePlayerClick = (playerId: string) => {
    console.log(`Clicked on player: ${playerId}`);
    // Future: Show player context menu, private messages, etc.
  };

  const handleInteractableClick = (interactable: InteractableObject) => {
    console.log(`Interacted with: ${interactable.name}`);
    console.log(`Description: ${interactable.description}`);

    if (interactable.clues && interactable.clues.length > 0) {
      console.log('Clues discovered:', interactable.clues);
    }

    // Future: Add interaction logic, ability checks, etc.
  };

  const handleEmptyClick = (position: Vector2D) => {
    if (!currentPlayer) return;

    // Move player to clicked position
    movePlayer(currentPlayer.id, position);
  };

  const currentRoomId = currentPlayer.currentRoom;
  const playersInRoom = gameSession.players.filter(p =>
    p.status === 'alive' && p.currentRoom === currentRoomId
  );

  return (
    <div className="game-viewport-container">
      <RoomRenderer
        roomId={currentRoomId}
        players={playersInRoom.map(p => ({
          id: p.id,
          position: p.position,
          costume: p.costume,
          fearLevel: p.fearLevel
        }))}
        currentPlayerId={currentPlayer.id}
        onPlayerClick={handlePlayerClick}
        onInteractableClick={handleInteractableClick}
        onEmptyClick={handleEmptyClick}
      />

      {/* Movement indicator */}
      <div className="movement-indicator">
        Click anywhere to move • Click objects to interact
      </div>

      {/* Debug info (can be removed later) */}
      <div className="debug-info">
        Room: {currentRoomId} | Players: {playersInRoom.length}
      </div>
    </div>
  );
};

export default GameViewport;
