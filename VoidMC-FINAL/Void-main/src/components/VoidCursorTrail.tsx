import React, { useEffect, useRef } from 'react';

interface TrailParticle {
  x: number;
  y: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  vx: number;
  vy: number;
  rotation: number;
  vRot: number;
}

export const VoidCursorTrail: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const particles: TrailParticle[] = [];
    const colors = ['#C084FC', '#E879F9', '#F472B6', '#38BDF8', '#FFFFFF', '#A855F7'];

    let lastX = -100;
    let lastY = -100;

    const handleMouseMove = (e: MouseEvent) => {
      const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY);
      if (dist > 6) {
        lastX = e.clientX;
        lastY = e.clientY;

        // Spawn 2-3 sparkle particles behind cursor
        for (let i = 0; i < 2; i++) {
          particles.push({
            x: e.clientX + (Math.random() - 0.5) * 8,
            y: e.clientY + (Math.random() - 0.5) * 8,
            size: Math.random() * 3.5 + 1.5,
            color: colors[Math.floor(Math.random() * colors.length)],
            alpha: 0.9,
            decay: 0.035 + Math.random() * 0.025,
            vx: (Math.random() - 0.5) * 1.2,
            vy: (Math.random() - 0.5) * 1.2 - 0.6,
            rotation: Math.random() * Math.PI * 2,
            vRot: (Math.random() - 0.5) * 0.2,
          });
        }
      }
    };

    const handleClick = (e: MouseEvent) => {
      // Critical hit void spark explosion on click
      for (let i = 0; i < 18; i++) {
        const angle = (Math.PI * 2 * i) / 18 + (Math.random() - 0.5) * 0.3;
        const speed = Math.random() * 3.5 + 2;
        particles.push({
          x: e.clientX,
          y: e.clientY,
          size: Math.random() * 4 + 2,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          decay: 0.03 + Math.random() * 0.02,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.3,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    let animationId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;
        p.rotation += p.vRot;
        p.size *= 0.96;

        if (p.alpha <= 0 || p.size <= 0.4) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;

        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        // Draw 4-point Minecraft enchanted sparkle star
        const s = p.size;
        ctx.beginPath();
        ctx.moveTo(0, -s);
        ctx.quadraticCurveTo(0, 0, s, 0);
        ctx.quadraticCurveTo(0, 0, 0, s);
        ctx.quadraticCurveTo(0, 0, -s, 0);
        ctx.quadraticCurveTo(0, 0, 0, -s);
        ctx.fill();

        ctx.restore();
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};
