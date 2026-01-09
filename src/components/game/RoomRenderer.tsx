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
  onDoorClick?: (toRoom: string, connection: any) => void;
  onEmptyClick?: (position: Vector2D) => void;
}

const RoomRenderer: React.FC<RoomRendererProps> = ({
  roomId,
  players,
  currentPlayerId,
  onPlayerClick,
  onInteractableClick,
  onDoorClick,
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
    // Draw base background
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

    // Add room-specific visual elements
    drawRoomDetails(ctx, room);

    // Draw room name overlay
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(room.displayName, room.width / 2, 35);
  };

  const drawRoomDetails = (ctx: CanvasRenderingContext2D, room: RoomData) => {
    switch (room.id) {
      case 'grand_ballroom':
        // Draw chandelier shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.beginPath();
        ctx.ellipse(room.width / 2, 120, 80, 20, 0, 0, 2 * Math.PI);
        ctx.fill();
        break;

      case 'library':
        // Draw bookshelf patterns
        ctx.fillStyle = '#3d2817';
        for (let i = 0; i < 8; i++) {
          ctx.fillRect(20, 50 + i * 40, 15, 30);
          ctx.fillRect(room.width - 35, 50 + i * 40, 15, 30);
        }
        break;

      case 'dining_hall':
        // Draw table
        ctx.fillStyle = '#722f37';
        ctx.fillRect(room.width / 2 - 150, room.height / 2 - 20, 300, 40);
        break;

      case 'conservatory':
        // Draw glass effect
        ctx.fillStyle = 'rgba(135, 206, 235, 0.2)';
        ctx.fillRect(0, 0, room.width, room.height);
        break;
    }
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
      // Draw object based on type
      switch (obj.id) {
        case 'chandelier':
          drawChandelier(ctx, obj);
          break;
        case 'grand_piano':
          drawGrandPiano(ctx, obj);
          break;
        case 'refreshment_table':
          drawRefreshmentTable(ctx, obj);
          break;
        case 'dining_table':
          drawDiningTable(ctx, obj);
          break;
        case 'china_cabinet':
          drawChinaCabinet(ctx, obj);
          break;
        case 'piano_forte':
          drawPianoForte(ctx, obj);
          break;
        case 'tropical_plants':
          drawTropicalPlants(ctx, obj);
          break;
        case 'ancient_book':
          drawAncientBook(ctx, obj);
          break;
        default:
          // Generic object drawing
          drawGenericObject(ctx, obj);
          break;
      }

      // Add special indicators for special objects
      if (obj.type === 'ritual_item') {
        ctx.fillStyle = '#daa520';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('✨', obj.position.x, obj.position.y - obj.size.y / 2 - 8);
      }
    });
  };

  const drawChandelier = (ctx: CanvasRenderingContext2D, obj: InteractableObject) => {
    const x = obj.position.x;
    const y = obj.position.y;

    // Chain
    ctx.strokeStyle = '#c0c0c0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y - 30);
    ctx.lineTo(x, y - 10);
    ctx.stroke();

    // Main fixture
    ctx.fillStyle = '#2a2a2a';
    ctx.beginPath();
    ctx.ellipse(x, y - 5, 25, 8, 0, 0, 2 * Math.PI);
    ctx.fill();

    // Crystals
    ctx.fillStyle = '#e6e6fa';
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.ellipse(x - 15 + i * 7, y + 5, 3, 8, 0, 0, 2 * Math.PI);
      ctx.fill();
    }
  };

  const drawGrandPiano = (ctx: CanvasRenderingContext2D, obj: InteractableObject) => {
    const x = obj.position.x - obj.size.x / 2;
    const y = obj.position.y - obj.size.y / 2;

    // Piano body
    ctx.fillStyle = '#2a1810';
    ctx.fillRect(x + 5, y + 15, obj.size.x - 10, obj.size.y - 15);

    // Keyboard
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + 10, y + 20, obj.size.x - 20, 8);

    // Keys
    ctx.fillStyle = '#000000';
    for (let i = 0; i < 7; i++) {
      ctx.fillRect(x + 12 + i * 6, y + 21, 2, 6);
    }
  };

  const drawRefreshmentTable = (ctx: CanvasRenderingContext2D, obj: InteractableObject) => {
    const x = obj.position.x - obj.size.x / 2;
    const y = obj.position.y - obj.size.y / 2;

    // Table surface
    ctx.fillStyle = '#8b4513';
    ctx.fillRect(x + 5, y + 15, obj.size.x - 10, 12);

    // Items
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(x + 15, y + 18, 3, 1, 0, 0, 2 * Math.PI);
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(x + 35, y + 18, 3, 1, 0, 0, 2 * Math.PI);
    ctx.fill();
  };

  const drawDiningTable = (ctx: CanvasRenderingContext2D, obj: InteractableObject) => {
    const x = obj.position.x - obj.size.x / 2;
    const y = obj.position.y;

    // Table surface
    ctx.fillStyle = '#8b4513';
    ctx.beginPath();
    ctx.ellipse(x + obj.size.x / 2, y, obj.size.x / 2 - 10, 12, 0, 0, 2 * Math.PI);
    ctx.fill();

    // Table legs (simplified)
    ctx.fillStyle = '#654321';
    ctx.fillRect(x + 20, y + 10, 4, 10);
    ctx.fillRect(x + obj.size.x - 24, y + 10, 4, 10);
  };

  const drawChinaCabinet = (ctx: CanvasRenderingContext2D, obj: InteractableObject) => {
    const x = obj.position.x - obj.size.x / 2;
    const y = obj.position.y - obj.size.y / 2;

    // Cabinet frame
    ctx.fillStyle = '#8b4513';
    ctx.fillRect(x + 5, y + 5, obj.size.x - 10, obj.size.y - 10);

    // Glass doors
    ctx.fillStyle = 'rgba(230, 230, 250, 0.7)';
    ctx.fillRect(x + 10, y + 10, (obj.size.x - 20) / 2 - 2, obj.size.y - 20);
    ctx.fillRect(x + obj.size.x / 2 + 2, y + 10, (obj.size.x - 20) / 2 - 2, obj.size.y - 20);

    // China items
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(x + 19, y + 15, 2, 0, 2 * Math.PI);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x + 41, y + 15, 2, 0, 2 * Math.PI);
    ctx.fill();
  };

  const drawPianoForte = (ctx: CanvasRenderingContext2D, obj: InteractableObject) => {
    const x = obj.position.x - obj.size.x / 2;
    const y = obj.position.y - obj.size.y / 2;

    // Body
    ctx.fillStyle = '#2a1810';
    ctx.fillRect(x + 5, y + 15, obj.size.x - 10, obj.size.y - 15);

    // Keyboard
    ctx.fillStyle = '#fffffa';
    ctx.fillRect(x + 10, y + 20, obj.size.x - 20, 8);

    // Keys
    ctx.fillStyle = '#000000';
    for (let i = 0; i < 5; i++) {
      ctx.fillRect(x + 12 + i * 8, y + 21, 1.5, 6);
    }
  };

  const drawTropicalPlants = (ctx: CanvasRenderingContext2D, obj: InteractableObject) => {
    const x = obj.position.x - obj.size.x / 2;
    const y = obj.position.y - obj.size.y / 2;

    // Pots
    ctx.fillStyle = '#8b4513';
    ctx.beginPath();
    ctx.ellipse(x + 15, y + obj.size.y - 5, 8, 3, 0, 0, 2 * Math.PI);
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(x + 35, y + obj.size.y - 5, 8, 3, 0, 0, 2 * Math.PI);
    ctx.fill();

    // Plants
    ctx.fillStyle = '#228b22';
    ctx.beginPath();
    ctx.ellipse(x + 15, y + 30, 12, 25, 0, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle = '#32cd32';
    ctx.beginPath();
    ctx.ellipse(x + 35, y + 25, 10, 20, 0, 0, 2 * Math.PI);
    ctx.fill();
  };

  const drawAncientBook = (ctx: CanvasRenderingContext2D, obj: InteractableObject) => {
    const x = obj.position.x - obj.size.x / 2;
    const y = obj.position.y - obj.size.y / 2;

    // Book cover
    ctx.fillStyle = '#3d2817';
    ctx.fillRect(x + 2, y + 2, obj.size.x - 4, obj.size.y - 4);

    // Book spine
    ctx.fillStyle = '#2a1810';
    ctx.fillRect(x, y, 4, obj.size.y);

    // Pages
    ctx.fillStyle = '#f5f5dc';
    ctx.fillRect(x + 4, y + 4, obj.size.x - 8, obj.size.y - 8);

    // Ancient symbols
    ctx.fillStyle = '#8b0000';
    ctx.beginPath();
    ctx.arc(x + 10, y + 8, 1, 0, 2 * Math.PI);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x + 15, y + 12, 1, 0, 2 * Math.PI);
    ctx.fill();
  };

  const drawGenericObject = (ctx: CanvasRenderingContext2D, obj: InteractableObject) => {
    // Fallback for unknown objects
    ctx.strokeStyle = '#666666';
    ctx.lineWidth = 1;
    ctx.strokeRect(
      obj.position.x - obj.size.x / 2,
      obj.position.y - obj.size.y / 2,
      obj.size.x,
      obj.size.y
    );

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

    // Check if clicked on a door/connection
    for (const connection of roomData.connections) {
      if (
        x >= connection.position.x - connection.size.x / 2 &&
        x <= connection.position.x + connection.size.x / 2 &&
        y >= connection.position.y - connection.size.y / 2 &&
        y <= connection.position.y + connection.size.y / 2
      ) {
        console.log(`Door clicked: ${connection.toRoom}`);
        onDoorClick?.(connection.toRoom, connection);
        return;
      }
    }

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
