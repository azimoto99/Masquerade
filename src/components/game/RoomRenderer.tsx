import React, { useRef, useEffect } from 'react';
import { RoomData, InteractableObject, getRoomData } from '../../types/rooms';
import { Vector2D } from '../../types/game';

interface RoomRendererProps {
  roomId: string;
  players: Array<{
    id: string;
    position: Vector2D;
    costume: { color: string };
    fearLevel: number;
  }>;
  currentPlayerId: string;
  onPlayerClick?: (playerId: string) => void;
  onInteractableClick?: (interactable: InteractableObject) => void;
  onEmptyClick?: (position: Vector2D) => void;
}

const RoomRenderer: React.FC<RoomRendererProps> = ({
  roomId,
  players,
  currentPlayerId,
  onPlayerClick,
  onInteractableClick,
  onEmptyClick
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const roomData = getRoomData(roomId);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !roomData) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = roomData.width;
    canvas.height = roomData.height;

    // Clear canvas
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw room background (placeholder for now - we'll add actual images later)
    drawRoomBackground(ctx, roomData);

    // Draw doors/connections
    drawConnections(ctx, roomData);

    // Draw interactable objects
    drawInteractables(ctx, roomData.interactables);

    // Draw players
    drawPlayers(ctx, players, currentPlayerId);

  }, [roomData, players, currentPlayerId]);

  const drawRoomBackground = (ctx: CanvasRenderingContext2D, room: RoomData) => {
    // Placeholder background - will be replaced with actual images
    const gradient = ctx.createLinearGradient(0, 0, 0, room.height);

    switch (room.lighting) {
      case 'bright':
        gradient.addColorStop(0, '#2a2a2a');
        gradient.addColorStop(1, '#1a1a1a');
        break;
      case 'normal':
        gradient.addColorStop(0, '#222222');
        gradient.addColorStop(1, '#1a1a1a');
        break;
      case 'dim':
        gradient.addColorStop(0, '#1a1a1a');
        gradient.addColorStop(1, '#111111');
        break;
      case 'dark':
        gradient.addColorStop(0, '#111111');
        gradient.addColorStop(1, '#000000');
        break;
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, room.width, room.height);

    // Draw room boundaries
    ctx.strokeStyle = '#404040';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, room.width - 20, room.height - 20);

    // Draw room name
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(room.displayName, room.width / 2, 35);
  };

  const drawConnections = (ctx: CanvasRenderingContext2D, room: RoomData) => {
    room.connections.forEach(connection => {
      // Draw door frame
      ctx.strokeStyle = connection.locked ? '#8b0000' : '#daa520';
      ctx.lineWidth = 3;
      ctx.strokeRect(
        connection.position.x - connection.size.x / 2,
        connection.position.y - connection.size.y / 2,
        connection.size.x,
        connection.size.y
      );

      // Fill door
      ctx.fillStyle = connection.secret ? '#333333' : '#4a4a4a';
      ctx.fillRect(
        connection.position.x - connection.size.x / 2 + 2,
        connection.position.y - connection.size.y / 2 + 2,
        connection.size.x - 4,
        connection.size.y - 4
      );

      // Door label
      ctx.fillStyle = '#ffffff';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(
        connection.secret ? '???' : connection.toRoom.replace('_', ' ').toUpperCase(),
        connection.position.x,
        connection.position.y + connection.size.y / 2 + 15
      );
    });
  };

  const drawInteractables = (ctx: CanvasRenderingContext2D, interactables: InteractableObject[]) => {
    interactables.forEach(obj => {
      // Draw object bounds (placeholder)
      ctx.strokeStyle = '#666666';
      ctx.lineWidth = 1;
      ctx.strokeRect(
        obj.position.x - obj.size.x / 2,
        obj.position.y - obj.size.y / 2,
        obj.size.x,
        obj.size.y
      );

      // Fill object
      let fillColor = '#555555';
      switch (obj.type) {
        case 'ritual_item':
          fillColor = '#daa520';
          break;
        case 'valuable':
          fillColor = '#ffd700';
          break;
        case 'clue':
          fillColor = '#87ceeb';
          break;
        case 'decoration':
          fillColor = '#9370db';
          break;
      }

      ctx.fillStyle = fillColor;
      ctx.fillRect(
        obj.position.x - obj.size.x / 2 + 1,
        obj.position.y - obj.size.y / 2 + 1,
        obj.size.x - 2,
        obj.size.y - 2
      );

      // Object label
      ctx.fillStyle = '#ffffff';
      ctx.font = '8px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(
        obj.name,
        obj.position.x,
        obj.position.y - obj.size.y / 2 - 5
      );
    });
  };

  const drawPlayers = (ctx: CanvasRenderingContext2D, players: any[], currentPlayerId: string) => {
    players.forEach(player => {
      const isCurrentPlayer = player.id === currentPlayerId;

      // Player shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.beginPath();
      ctx.ellipse(player.position.x, player.position.y + 20, 12, 6, 0, 0, 2 * Math.PI);
      ctx.fill();

      // Player body (circle)
      ctx.fillStyle = isCurrentPlayer ? '#8b5cf6' : '#666666';
      ctx.beginPath();
      ctx.arc(player.position.x, player.position.y, 16, 0, 2 * Math.PI);
      ctx.fill();

      // Player outline
      ctx.strokeStyle = isCurrentPlayer ? '#ffffff' : '#cccccc';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Costume indicator
      ctx.fillStyle = player.costume.color;
      ctx.beginPath();
      ctx.arc(player.position.x, player.position.y - 20, 8, 0, 2 * Math.PI);
      ctx.fill();

      // Fear aura (if fear level is high)
      if (player.fearLevel > 30) {
        const alpha = Math.min(player.fearLevel / 100, 0.6);
        ctx.strokeStyle = `rgba(239, 68, 68, ${alpha})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(player.position.x, player.position.y, 25, 0, 2 * Math.PI);
        ctx.stroke();
      }

      // Player name
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(
        isCurrentPlayer ? 'YOU' : `Player ${player.id.slice(-4)}`,
        player.position.x,
        player.position.y + 35
      );
    });
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !roomData) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Check if clicked on a player
    for (const player of players) {
      const distance = Math.sqrt(
        Math.pow(x - player.position.x, 2) + Math.pow(y - player.position.y, 2)
      );
      if (distance <= 20) {
        onPlayerClick?.(player.id);
        return;
      }
    }

    // Check if clicked on an interactable
    for (const interactable of roomData.interactables) {
      if (
        x >= interactable.position.x - interactable.size.x / 2 &&
        x <= interactable.position.x + interactable.size.x / 2 &&
        y >= interactable.position.y - interactable.size.y / 2 &&
        y <= interactable.position.y + interactable.size.y / 2
      ) {
        onInteractableClick?.(interactable);
        return;
      }
    }

    // Empty space click - move player
    onEmptyClick?.({ x, y });
  };

  if (!roomData) {
    return (
      <div className="room-loading">
        <div>Loading room...</div>
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="room-canvas"
      onClick={handleCanvasClick}
      style={{ cursor: 'pointer' }}
    />
  );
};

export default RoomRenderer;
