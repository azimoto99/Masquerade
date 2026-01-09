import React, { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../../hooks/useGameStore';
import { Vector2D } from '../../types/game';

const GameViewport: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { currentPlayer, movePlayer, gameSession } = useGameStore();
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState<Vector2D>({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !gameSession) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 640;
    canvas.height = 480;

    // Game rendering loop
    const render = () => {
      // Clear canvas
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw room background (placeholder)
      ctx.fillStyle = '#2a2a2a';
      ctx.fillRect(50, 50, canvas.width - 100, canvas.height - 100);

      // Draw room elements (placeholder)
      ctx.strokeStyle = '#404040';
      ctx.lineWidth = 2;
      ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);

      // Draw players
      gameSession.players.forEach((player) => {
        if (player.status === 'alive') {
          const isCurrentPlayer = player.id === currentPlayer?.id;

          // Player body (simple circle for now)
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

          // Player name/costume (placeholder)
          ctx.fillStyle = '#ffffff';
          ctx.font = '12px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(
            player.costume.name,
            player.position.x,
            player.position.y + 35
          );
        }
      });

      // Draw fear indicators
      gameSession.players.forEach((player) => {
        if (player.fearLevel > 20) {
          const alpha = Math.min(player.fearLevel / 100, 0.8);
          ctx.fillStyle = `rgba(239, 68, 68, ${alpha})`;
          ctx.beginPath();
          ctx.arc(player.position.x, player.position.y, 25, 0, 2 * Math.PI);
          ctx.fill();
        }
      });

      requestAnimationFrame(render);
    };

    render();
  }, [gameSession, currentPlayer]);

  // Handle mouse/touch input for movement
  const handlePointerDown = (event: React.PointerEvent) => {
    const canvas = canvasRef.current;
    if (!canvas || !currentPlayer) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    setLastMousePos({ x, y });
    setIsDragging(true);

    // Move player to clicked position
    movePlayer(currentPlayer.id, { x, y });
  };

  const handlePointerMove = (event: React.PointerEvent) => {
    if (!isDragging || !currentPlayer) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Smooth movement towards cursor
    const dx = x - lastMousePos.x;
    const dy = y - lastMousePos.y;

    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
      const newX = currentPlayer.position.x + dx * 0.1;
      const newY = currentPlayer.position.y + dy * 0.1;

      // Keep player within bounds
      const clampedX = Math.max(66, Math.min(640 - 66, newX));
      const clampedY = Math.max(66, Math.min(480 - 66, newY));

      movePlayer(currentPlayer.id, { x: clampedX, y: clampedY });
      setLastMousePos({ x, y });
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="game-viewport-container">
      <canvas
        ref={canvasRef}
        className="game-canvas"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      />

      {/* Click-to-move indicator */}
      {isDragging && (
        <div className="movement-indicator">
          Click and drag to move
        </div>
      )}

      {/* Room name overlay */}
      <div className="room-name-overlay">
        Grand Ballroom
      </div>
    </div>
  );
};

export default GameViewport;
