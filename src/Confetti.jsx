import { useState } from 'react'

const PIECE_COUNT = 36;

function makePieces(colors) {
  return Array.from({ length: PIECE_COUNT }, (_, i) => {
    const angle = Math.random() * Math.PI - Math.PI; // upward half-circle
    const distance = 70 + Math.random() * 110;
    return {
      id: i,
      color: colors[i % colors.length],
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      rotate: (Math.random() - 0.5) * 720,
      delay: Math.random() * 0.15,
      round: Math.random() < 0.3,
    };
  });
}

// A small one-off confetti burst. Remount it (e.g. with a new key) to play again.
function Confetti({ colors }) {
  const [pieces] = useState(() => makePieces(colors));

  return (
    <div className="confetti" aria-hidden="true">
      {pieces.map((p) => (
        <span
          key={p.id}
          className={`confetti-piece ${p.round ? 'round' : ''}`}
          style={{
            '--color': p.color,
            '--x': `${p.x}px`,
            '--y': `${p.y}px`,
            '--r': `${p.rotate}deg`,
            '--delay': `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

export default Confetti
