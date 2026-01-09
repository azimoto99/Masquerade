import React, { useState } from 'react';
import { useGameStore } from '../../hooks/useGameStore';
import { Vector2D } from '../../types/game';
import { InteractableObject } from '../../types/rooms';
import RoomRenderer from './RoomRenderer';

const GameViewport: React.FC = () => {
  const { currentPlayer, movePlayer, changeRoom, gameSession } = useGameStore();
  const [isTransitioning, setIsTransitioning] = useState(false);

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

  const handleDoorClick = (toRoom: string, connection: any) => {
    if (!currentPlayer || isTransitioning) return;

    console.log(`Attempting to enter ${toRoom} through door`);

    // Check if door is locked or secret
    if (connection.locked) {
      console.log('Door is locked!');
      // Future: Show locked door message
      return;
    }

    if (connection.secret) {
      console.log('This is a secret passage!');
      // Future: Check if player has discovered the secret
    }

    // Start transition
    setIsTransitioning(true);

    // Set spawn position in new room (for now, center of room)
    // Future: Use proper spawn points from room data
    const newPosition = { x: 320, y: 400 }; // Center spawn

    // Brief delay for transition effect
    setTimeout(() => {
      // Update player room and position
      changeRoom(currentPlayer.id, toRoom);

      // Move to spawn position in new room after room change
      setTimeout(() => {
        movePlayer(currentPlayer.id, newPosition);
        setIsTransitioning(false);
      }, 100);

      console.log(`Moved to ${toRoom} at position (${newPosition.x}, ${newPosition.y})`);
    }, 300);
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
        onDoorClick={handleDoorClick}
        onEmptyClick={handleEmptyClick}
      />

      {/* Room transition overlay */}
      {isTransitioning && (
        <div className="room-transition-overlay">
          <div className="transition-text">Entering new room...</div>
        </div>
      )}

      {/* Movement indicator */}
      <div className="movement-indicator">
        Click anywhere to move • Click doors to change rooms • Click objects to interact
      </div>

      {/* Debug info (can be removed later) */}
      <div className="debug-info">
        Room: {currentRoomId} | Players: {playersInRoom.length}
        {isTransitioning && ' | TRANSITIONING...'}
      </div>
    </div>
  );
};

export default GameViewport;
