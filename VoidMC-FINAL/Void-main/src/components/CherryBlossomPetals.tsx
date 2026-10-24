import React, { useEffect, useState } from 'react';

interface Petal {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

export const CherryBlossomPetals: React.FC = () => {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    const count = 18;
    const generated: Petal[] = [];
    for (let i = 0; i < count; i++) {
      generated.push({
        id: i,
        left: Math.random() * 100,
        size: 6 + Math.random() * 10,
        duration: 8 + Math.random() * 12,
        delay: Math.random() * 15,
        opacity: 0.3 + Math.random() * 0.5,
      });
    }
    setPetals(generated);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      {petals.map((p) => (
        <div
          key={p.id}
          className="cherry-petal"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            opacity: p.opacity,
          }}
        />
      ))}
    </div>
  );
};
