"use client";

import React, { useEffect, useState } from 'react';

export const Confetti: React.FC = () => {
  const [pieces, setPieces] = useState<{ id: number; left: string; delay: string; color: string }[]>([]);

  useEffect(() => {
    const colors = ['#B899DB', '#FF99FF', '#FFD700', '#7FFFD4', '#FF69B4'];
    const newPieces = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 3}s`,
      color: colors[Math.floor(Math.random() * colors.length)]
    }));
    setPieces(newPieces);
    
    const timer = setTimeout(() => setPieces([]), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (pieces.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[9999]">
      {pieces.map(p => (
        <div
          key={p.id}
          className="absolute top-[-20px] w-3 h-3 animate-confetti"
          style={{
            left: p.left,
            backgroundColor: p.color,
            animationDelay: p.delay,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px'
          }}
        />
      ))}
    </div>
  );
};
