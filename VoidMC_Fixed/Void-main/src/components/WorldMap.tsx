import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Users, Globe } from 'lucide-react';

interface Location {
  id: number;
  city: string;
  country: string;
  x: number;
  y: number;
  players: number;
}

const LOCATIONS: Location[] = [
  { id: 1, city: 'Mumbai', country: 'India', x: 66, y: 42, players: 50 },
  { id: 2, city: 'Delhi', country: 'India', x: 64, y: 35, players: 50 },
  { id: 3, city: 'Bangalore', country: 'India', x: 65, y: 48, players: 50 },
  { id: 4, city: 'Singapore', country: 'Singapore', x: 72, y: 52, players: 50 },
  { id: 5, city: 'Tokyo', country: 'Japan', x: 82, y: 35, players: 50 },
  { id: 6, city: 'Sydney', country: 'Australia', x: 85, y: 72, players: 50 },
  { id: 7, city: 'Dubai', country: 'UAE', x: 60, y: 38, players: 50 },
  { id: 8, city: 'London', country: 'UK', x: 48, y: 26, players: 50 },
  { id: 9, city: 'Frankfurt', country: 'Germany', x: 50, y: 27, players: 50 },
  { id: 10, city: 'New York', country: 'USA', x: 26, y: 32, players: 50 },
  { id: 11, city: 'Los Angeles', country: 'USA', x: 16, y: 35, players: 50 },
  { id: 12, city: 'Toronto', country: 'Canada', x: 25, y: 28, players: 50 },
  { id: 13, city: 'Sao Paulo', country: 'Brazil', x: 32, y: 65, players: 50 },
  { id: 14, city: 'Cape Town', country: 'South Africa', x: 52, y: 73, players: 50 },
  { id: 15, city: 'Lagos', country: 'Nigeria', x: 48, y: 50, players: 50 },
  { id: 16, city: 'Cairo', country: 'Egypt', x: 54, y: 38, players: 50 },
  { id: 17, city: 'Moscow', country: 'Russia', x: 58, y: 22, players: 50 },
  { id: 18, city: 'Seoul', country: 'South Korea', x: 80, y: 33, players: 50 },
  { id: 19, city: 'Bangkok', country: 'Thailand', x: 71, y: 45, players: 50 },
  { id: 20, city: 'Jakarta', country: 'Indonesia', x: 73, y: 55, players: 50 },
  { id: 21, city: 'Melbourne', country: 'Australia', x: 84, y: 74, players: 50 },
  { id: 22, city: 'Mexico City', country: 'Mexico', x: 19, y: 43, players: 50 },
  { id: 23, city: 'Lima', country: 'Peru', x: 24, y: 58, players: 50 },
  { id: 24, city: 'Nairobi', country: 'Kenya', x: 56, y: 52, players: 50 },
  { id: 25, city: 'Istanbul', country: 'Turkey', x: 54, y: 32, players: 50 },
];

const CONNECTIONS: [number, number][] = [
  [0, 7], [0, 3], [1, 4], [2, 3], [3, 18], [3, 19],
  [4, 17], [5, 20], [6, 7], [6, 15], [7, 8], [7, 9],
  [8, 16], [9, 10], [9, 11], [10, 21], [11, 9], [12, 13],
  [13, 14], [14, 23], [15, 23], [16, 17], [17, 18], [18, 19],
  [19, 20], [20, 5], [21, 22], [22, 10], [23, 24], [24, 6],
  [0, 1], [1, 2], [2, 4], [5, 6], [8, 9], [12, 14],
];

export const WorldMap: React.FC = () => {
  const [hoveredLocation, setHoveredLocation] = useState<Location | null>(null);
  const [pulsePhase, setPulsePhase] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulsePhase((prev) => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      CONNECTIONS.forEach(([fromIdx, toIdx]) => {
        const from = LOCATIONS[fromIdx];
        const to = LOCATIONS[toIdx];
        if (!from || !to) return;

        const x1 = (from.x / 100) * w;
        const y1 = (from.y / 100) * h;
        const x2 = (to.x / 100) * w;
        const y2 = (to.y / 100) * h;

        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2 - Math.abs(x2 - x1) * 0.15;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.quadraticCurveTo(midX, midY, x2, y2);

        const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
        gradient.addColorStop(0, 'rgba(168, 85, 247, 0.15)');
        gradient.addColorStop(0.5, 'rgba(168, 85, 247, 0.35)');
        gradient.addColorStop(1, 'rgba(168, 85, 247, 0.15)');

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1;
        ctx.stroke();

        const t = ((pulsePhase % 360) / 360);
        const px = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * midX + t * t * x2;
        const py = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * midY + t * t * y2;

        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(192, 132, 252, 0.8)';
        ctx.fill();
      });
    };

    draw();
  }, [pulsePhase]);

  const totalPlayers = LOCATIONS.reduce((sum, loc) => sum + loc.players, 0);
  const uniqueCountries = new Set(LOCATIONS.map((l) => l.country)).size;

  return (
    <div className="relative w-full h-[500px] bg-[#0B0713] border border-purple-900/40 rounded-3xl overflow-hidden">
      {/* World Map SVG Background */}
      <svg
        viewBox="0 0 1000 500"
        className="absolute inset-0 w-full h-full opacity-20"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* North America */}
        <path
          d="M 120 100 L 140 90 L 170 85 L 200 90 L 230 95 L 260 100 L 280 110 L 290 130 L 285 150 L 275 170 L 260 185 L 240 195 L 220 200 L 200 210 L 180 220 L 160 225 L 140 220 L 125 210 L 115 195 L 105 175 L 100 155 L 105 135 L 110 115 Z"
          fill="rgba(168, 85, 247, 0.15)"
          stroke="rgba(168, 85, 247, 0.3)"
          strokeWidth="1"
        />
        {/* Central America */}
        <path
          d="M 180 225 L 195 230 L 205 240 L 200 255 L 190 265 L 180 270 L 175 260 L 178 245 Z"
          fill="rgba(168, 85, 247, 0.15)"
          stroke="rgba(168, 85, 247, 0.3)"
          strokeWidth="1"
        />
        {/* South America */}
        <path
          d="M 220 280 L 250 275 L 280 285 L 300 300 L 310 325 L 305 350 L 290 370 L 270 385 L 250 390 L 235 380 L 225 360 L 220 340 L 215 315 L 218 295 Z"
          fill="rgba(168, 85, 247, 0.15)"
          stroke="rgba(168, 85, 247, 0.3)"
          strokeWidth="1"
        />
        {/* Europe */}
        <path
          d="M 440 90 L 460 85 L 490 88 L 520 92 L 540 100 L 545 115 L 535 130 L 520 140 L 500 145 L 480 142 L 460 135 L 445 125 L 438 110 Z"
          fill="rgba(168, 85, 247, 0.15)"
          stroke="rgba(168, 85, 247, 0.3)"
          strokeWidth="1"
        />
        {/* Africa */}
        <path
          d="M 460 180 L 490 175 L 520 180 L 545 195 L 555 220 L 560 250 L 555 280 L 545 310 L 530 335 L 510 350 L 490 355 L 470 345 L 455 325 L 448 300 L 445 270 L 448 240 L 452 210 Z"
          fill="rgba(168, 85, 247, 0.15)"
          stroke="rgba(168, 85, 247, 0.3)"
          strokeWidth="1"
        />
        {/* Asia - main mass */}
        <path
          d="M 550 80 L 590 75 L 640 78 L 690 82 L 740 88 L 780 95 L 810 105 L 830 120 L 835 140 L 825 160 L 800 175 L 770 185 L 740 190 L 700 192 L 660 188 L 620 180 L 590 170 L 565 155 L 550 135 L 545 110 Z"
          fill="rgba(168, 85, 247, 0.15)"
          stroke="rgba(168, 85, 247, 0.3)"
          strokeWidth="1"
        />
        {/* India subcontinent */}
        <path
          d="M 630 195 L 650 192 L 670 198 L 680 215 L 675 235 L 665 250 L 650 258 L 635 252 L 625 238 L 622 220 L 625 205 Z"
          fill="rgba(168, 85, 247, 0.15)"
          stroke="rgba(168, 85, 247, 0.3)"
          strokeWidth="1"
        />
        {/* Southeast Asia */}
        <path
          d="M 700 200 L 730 195 L 755 205 L 765 220 L 755 240 L 735 250 L 715 248 L 700 235 L 695 218 Z"
          fill="rgba(168, 85, 247, 0.15)"
          stroke="rgba(168, 85, 247, 0.3)"
          strokeWidth="1"
        />
        {/* Australia */}
        <path
          d="M 780 310 L 820 305 L 860 310 L 885 325 L 890 345 L 880 365 L 855 375 L 825 378 L 795 370 L 778 355 L 775 335 L 778 320 Z"
          fill="rgba(168, 85, 247, 0.15)"
          stroke="rgba(168, 85, 247, 0.3)"
          strokeWidth="1"
        />
        {/* Japan */}
        <path
          d="M 820 120 L 830 115 L 838 120 L 840 135 L 835 148 L 825 150 L 818 142 L 816 130 Z"
          fill="rgba(168, 85, 247, 0.15)"
          stroke="rgba(168, 85, 247, 0.3)"
          strokeWidth="1"
        />
        {/* Grid lines */}
        {Array.from({ length: 11 }).map((_, i) => (
          <line
            key={`h-${i}`}
            x1="0"
            y1={i * 50}
            x2="1000"
            y2={i * 50}
            stroke="rgba(168, 85, 247, 0.05)"
            strokeWidth="0.5"
          />
        ))}
        {Array.from({ length: 21 }).map((_, i) => (
          <line
            key={`v-${i}`}
            x1={i * 50}
            y1="0"
            x2={i * 50}
            y2="500"
            stroke="rgba(168, 85, 247, 0.05)"
            strokeWidth="0.5"
          />
        ))}
      </svg>

      {/* Animated Connection Lines Canvas */}
      <canvas
        ref={canvasRef}
        width={1000}
        height={500}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ mixBlendMode: 'screen' }}
      />

      {/* Location Dots */}
      {LOCATIONS.map((location) => (
        <div
          key={location.id}
          className="absolute group"
          style={{
            left: `${location.x}%`,
            top: `${location.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
          onMouseEnter={() => setHoveredLocation(location)}
          onMouseLeave={() => setHoveredLocation(null)}
        >
          {/* Outer pulse ring */}
          <div className="absolute -inset-3 rounded-full bg-purple-500/20 animate-ping" style={{ animationDuration: '3s' }} />
          {/* Glow */}
          <div className="absolute -inset-2 rounded-full bg-purple-500/30 blur-sm" />
          {/* Core dot */}
          <div className="relative w-3 h-3 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 shadow-[0_0_12px_rgba(168,85,247,0.9)] border border-purple-300/50">
            <div className="absolute inset-0.5 rounded-full bg-white/60" />
          </div>
        </div>
      ))}

      {/* Tooltip for hovered location */}
      {hoveredLocation && (
        <div
          className="absolute z-50 pointer-events-none bg-[#130C22]/95 border border-purple-500/60 rounded-xl px-4 py-3 backdrop-blur-xl shadow-[0_0_25px_rgba(168,85,247,0.5)]"
          style={{
            left: `${hoveredLocation.x}%`,
            top: `${hoveredLocation.y - 8}%`,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-xs font-bold text-white">{hoveredLocation.city}, {hoveredLocation.country}</span>
          </div>
          <div className="flex items-center gap-1.5 mt-1.5">
            <Users className="w-3 h-3 text-emerald-400" />
            <span className="text-[11px] text-emerald-400 font-mono">{hoveredLocation.players} players online</span>
          </div>
        </div>
      )}

      {/* Stats Overlay */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-[#130C22]/90 border border-purple-900/50 rounded-2xl px-6 py-3 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-purple-400" />
          <div>
            <div className="text-[10px] text-slate-400 font-mono uppercase">Active Nodes</div>
            <div className="text-lg font-bold text-white font-mono">{LOCATIONS.length}</div>
          </div>
        </div>
        <div className="h-8 w-px bg-purple-800/40" />
        <div>
          <div className="text-[10px] text-slate-400 font-mono uppercase">Total Players</div>
          <div className="text-lg font-bold text-emerald-400 font-mono">{totalPlayers.toLocaleString()}</div>
        </div>
        <div className="h-8 w-px bg-purple-800/40" />
        <div>
          <div className="text-[10px] text-slate-400 font-mono uppercase">Countries</div>
          <div className="text-lg font-bold text-purple-400 font-mono">{uniqueCountries}</div>
        </div>
        <div className="h-8 w-px bg-purple-800/40" />
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-emerald-400 font-mono font-bold">LIVE</span>
        </div>
      </div>
    </div>
  );
};
