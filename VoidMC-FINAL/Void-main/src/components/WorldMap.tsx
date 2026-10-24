import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  { id: 1, city: 'Mumbai', country: 'India', x: 65.5, y: 43, players: 50 },
  { id: 2, city: 'Delhi', country: 'India', x: 63.5, y: 36, players: 50 },
  { id: 3, city: 'Bangalore', country: 'India', x: 65, y: 48, players: 50 },
  { id: 4, city: 'Singapore', country: 'Singapore', x: 72, y: 53, players: 50 },
  { id: 5, city: 'Tokyo', country: 'Japan', x: 82, y: 35, players: 50 },
  { id: 6, city: 'Sydney', country: 'Australia', x: 86, y: 73, players: 50 },
  { id: 7, city: 'Dubai', country: 'UAE', x: 60, y: 39, players: 50 },
  { id: 8, city: 'London', country: 'UK', x: 48, y: 26, players: 50 },
  { id: 9, city: 'Frankfurt', country: 'Germany', x: 50.5, y: 27, players: 50 },
  { id: 10, city: 'New York', country: 'USA', x: 26, y: 33, players: 50 },
  { id: 11, city: 'Los Angeles', country: 'USA', x: 16, y: 36, players: 50 },
  { id: 12, city: 'Toronto', country: 'Canada', x: 25, y: 29, players: 50 },
  { id: 13, city: 'Sao Paulo', country: 'Brazil', x: 33, y: 65, players: 50 },
  { id: 14, city: 'Cape Town', country: 'South Africa', x: 52, y: 73, players: 50 },
  { id: 15, city: 'Lagos', country: 'Nigeria', x: 48, y: 50, players: 50 },
  { id: 16, city: 'Cairo', country: 'Egypt', x: 54, y: 38, players: 50 },
  { id: 17, city: 'Moscow', country: 'Russia', x: 57, y: 23, players: 50 },
  { id: 18, city: 'Seoul', country: 'S. Korea', x: 80, y: 34, players: 50 },
  { id: 19, city: 'Bangkok', country: 'Thailand', x: 71, y: 46, players: 50 },
  { id: 20, city: 'Jakarta', country: 'Indonesia', x: 73, y: 56, players: 50 },
  { id: 21, city: 'Melbourne', country: 'Australia', x: 85, y: 75, players: 50 },
  { id: 22, city: 'Mexico City', country: 'Mexico', x: 19, y: 43, players: 50 },
  { id: 23, city: 'Lima', country: 'Peru', x: 24, y: 58, players: 50 },
  { id: 24, city: 'Nairobi', country: 'Kenya', x: 56, y: 52, players: 50 },
  { id: 25, city: 'Istanbul', country: 'Turkey', x: 54, y: 32, players: 50 },
];

const CONNECTIONS: [number, number][] = [
  [0, 1], [0, 2], [0, 3], [1, 4], [2, 3], [3, 4],
  [3, 18], [3, 19], [4, 17], [5, 20], [6, 7], [6, 15],
  [7, 8], [7, 9], [8, 16], [9, 10], [9, 11], [10, 21],
  [12, 13], [13, 14], [14, 23], [15, 23], [16, 17], [17, 18],
  [18, 19], [19, 20], [20, 5], [21, 22], [22, 10], [23, 24],
  [24, 6], [0, 6], [7, 24], [1, 16], [8, 24],
];

export const WorldMap: React.FC = () => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  const hoveredLocation = useMemo(
    () => LOCATIONS.find((l) => l.id === hoveredId) ?? null,
    [hoveredId]
  );

  const totalPlayers = LOCATIONS.reduce((s, l) => s + l.players, 0);
  const uniqueCountries = new Set(LOCATIONS.map((l) => l.country)).size;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let running = true;

    const draw = () => {
      if (!running) return;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const time = Date.now() * 0.001;

      CONNECTIONS.forEach(([fromIdx, toIdx], ci) => {
        const from = LOCATIONS[fromIdx];
        const to = LOCATIONS[toIdx];
        if (!from || !to) return;

        const x1 = (from.x / 100) * w;
        const y1 = (from.y / 100) * h;
        const x2 = (to.x / 100) * w;
        const y2 = (to.y / 100) * h;

        const dist = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
        const midX = (x1 + x2) / 2;
        const midY = Math.min(y1, y2) - dist * 0.12;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.quadraticCurveTo(midX, midY, x2, y2);
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.12)';
        ctx.lineWidth = 0.8;
        ctx.stroke();

        const t = ((time * 0.3 + ci * 0.15) % 1);
        const px = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * midX + t * t * x2;
        const py = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * midY + t * t * y2;

        ctx.beginPath();
        ctx.arc(px, py, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(192, 132, 252, 0.7)';
        ctx.fill();
      });

      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      running = false;
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <div className="relative w-full h-[420px] sm:h-[500px] bg-[#0a0515] border border-purple-900/40 rounded-3xl overflow-hidden">
      {/* World Map SVG - proper continent shapes */}
      <svg
        viewBox="0 0 1000 500"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(168,85,247,0.08)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>
          <filter id="continentGlow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect width="1000" height="500" fill="url(#mapGlow)" />

        {/* Grid */}
        {Array.from({ length: 11 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 50} x2="1000" y2={i * 50} stroke="rgba(168,85,247,0.04)" strokeWidth="0.5" />
        ))}
        {Array.from({ length: 21 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="500" stroke="rgba(168,85,247,0.04)" strokeWidth="0.5" />
        ))}

        {/* Continents - simplified but recognizable */}
        <g filter="url(#continentGlow)" opacity="0.35">
          {/* North America */}
          <path d="M 100 70 L 130 60 160 55 190 60 210 65 230 70 250 80 265 95 270 115 265 135 255 155 240 170 225 180 210 190 195 195 180 200 165 205 150 210 140 215 130 210 120 200 110 185 105 170 100 155 95 140 95 120 98 100 Z" fill="#a855f7" stroke="#c084fc" strokeWidth="0.8" />
          {/* Greenland */}
          <path d="M 280 45 L 310 40 330 50 325 70 305 80 285 75 275 60 Z" fill="#a855f7" stroke="#c084fc" strokeWidth="0.8" />
          {/* Central America */}
          <path d="M 160 215 L 175 220 185 230 190 245 185 255 175 260 165 255 160 240 158 225 Z" fill="#a855f7" stroke="#c084fc" strokeWidth="0.8" />
          {/* South America */}
          <path d="M 210 265 L 240 260 265 270 280 285 290 305 295 330 290 355 275 375 260 385 245 390 230 385 220 370 215 350 210 325 208 300 210 280 Z" fill="#a855f7" stroke="#c084fc" strokeWidth="0.8" />
          {/* Europe */}
          <path d="M 440 80 L 460 75 480 78 500 82 515 90 520 105 515 120 505 130 490 138 475 140 460 135 448 125 440 112 438 95 Z" fill="#a855f7" stroke="#c084fc" strokeWidth="0.8" />
          {/* UK/Ireland */}
          <path d="M 428 85 L 438 80 442 90 438 100 430 98 426 92 Z" fill="#a855f7" stroke="#c084fc" strokeWidth="0.8" />
          {/* Scandinavia */}
          <path d="M 485 50 L 500 45 510 55 508 70 498 78 488 72 483 60 Z" fill="#a855f7" stroke="#c084fc" strokeWidth="0.8" />
          {/* Africa */}
          <path d="M 455 175 L 480 168 505 172 525 185 540 205 548 230 550 260 545 290 535 315 520 335 505 345 490 348 475 340 462 325 452 300 448 275 445 245 448 215 452 195 Z" fill="#a855f7" stroke="#c084fc" strokeWidth="0.8" />
          {/* Madagascar */}
          <path d="M 555 310 L 562 305 568 315 565 330 558 335 553 325 Z" fill="#a855f7" stroke="#c084fc" strokeWidth="0.8" />
          {/* Asia - main */}
          <path d="M 530 65 L 570 58 620 55 670 60 720 68 760 78 790 90 810 105 815 125 808 145 790 160 765 170 735 178 700 180 665 175 630 168 600 155 575 140 555 120 540 100 535 80 Z" fill="#a855f7" stroke="#c084fc" strokeWidth="0.8" />
          {/* India */}
          <path d="M 630 180 L 650 178 665 185 672 200 670 220 662 240 650 252 638 248 628 235 624 215 625 198 Z" fill="#a855f7" stroke="#c084fc" strokeWidth="0.8" />
          {/* Sri Lanka */}
          <path d="M 650 258 L 656 255 660 262 655 268 649 265 Z" fill="#a855f7" stroke="#c084fc" strokeWidth="0.8" />
          {/* Southeast Asia */}
          <path d="M 700 185 L 725 180 745 190 755 205 748 220 735 230 718 228 705 218 698 205 Z" fill="#a855f7" stroke="#c084fc" strokeWidth="0.8" />
          {/* Indonesia archipelago */}
          <path d="M 715 240 L 730 238 745 242 755 248 748 255 735 258 720 255 712 248 Z" fill="#a855f7" stroke="#c084fc" strokeWidth="0.8" />
          <path d="M 758 250 L 770 248 780 255 775 262 765 260 756 255 Z" fill="#a855f7" stroke="#c084fc" strokeWidth="0.8" />
          {/* Japan */}
          <path d="M 815 110 L 825 105 832 112 835 125 830 140 822 145 815 138 812 125 Z" fill="#a855f7" stroke="#c084fc" strokeWidth="0.8" />
          {/* Philippines */}
          <path d="M 785 195 L 792 190 798 198 795 210 788 215 783 208 Z" fill="#a855f7" stroke="#c084fc" strokeWidth="0.8" />
          {/* Australia */}
          <path d="M 770 310 L 810 300 845 305 870 315 880 335 875 355 860 370 840 378 815 380 790 372 775 358 768 340 768 325 Z" fill="#a855f7" stroke="#c084fc" strokeWidth="0.8" />
          {/* New Zealand */}
          <path d="M 895 365 L 902 360 908 368 905 380 898 385 893 378 Z" fill="#a855f7" stroke="#c084fc" strokeWidth="0.8" />
          {/* Middle East */}
          <path d="M 560 155 L 585 148 605 155 615 170 610 185 595 190 575 188 562 178 558 165 Z" fill="#a855f7" stroke="#c084fc" strokeWidth="0.8" />
        </g>
      </svg>

      {/* Animated connection lines */}
      <canvas
        ref={canvasRef}
        width={1000}
        height={500}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Location dots */}
      {LOCATIONS.map((loc) => (
        <div
          key={loc.id}
          className="absolute"
          style={{
            left: `${loc.x}%`,
            top: `${loc.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
          onMouseEnter={() => setHoveredId(loc.id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          <div className="absolute -inset-3 rounded-full bg-purple-500/20 animate-ping" style={{ animationDuration: `${2.5 + (loc.id % 5) * 0.5}s` }} />
          <div className="absolute -inset-1.5 rounded-full bg-purple-400/25 blur-[3px]" />
          <div className="relative w-2.5 h-2.5 rounded-full bg-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.9)] border border-purple-200/60 cursor-pointer hover:scale-150 transition-transform">
            <div className="absolute inset-[3px] rounded-full bg-white/70" />
          </div>
        </div>
      ))}

      {/* Tooltip */}
      {hoveredLocation && (
        <div
          className="absolute z-50 pointer-events-none bg-[#130C22]/95 border border-purple-500/60 rounded-xl px-4 py-2.5 backdrop-blur-xl shadow-[0_0_25px_rgba(168,85,247,0.5)]"
          style={{
            left: `${hoveredLocation.x}%`,
            top: `${hoveredLocation.y}%`,
            transform: 'translate(-50%, calc(-100% - 20px))',
          }}
        >
          <div className="flex items-center gap-2">
            <MapPin className="w-3 h-3 text-purple-400" />
            <span className="text-xs font-bold text-white">{hoveredLocation.city}, {hoveredLocation.country}</span>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <Users className="w-3 h-3 text-emerald-400" />
            <span className="text-[10px] text-emerald-400 font-mono">{hoveredLocation.players} players</span>
          </div>
        </div>
      )}

      {/* Stats bar */}
      <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 flex items-center justify-between bg-[#0a0515]/90 border border-purple-900/50 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-2.5 sm:py-3 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <Globe className="w-3.5 h-3.5 text-purple-400 hidden sm:block" />
          <div>
            <div className="text-[9px] sm:text-[10px] text-slate-400 font-mono uppercase">Nodes</div>
            <div className="text-sm sm:text-lg font-bold text-white font-mono">{LOCATIONS.length}</div>
          </div>
        </div>
        <div className="h-6 w-px bg-purple-800/40" />
        <div>
          <div className="text-[9px] sm:text-[10px] text-slate-400 font-mono uppercase">Players</div>
          <div className="text-sm sm:text-lg font-bold text-emerald-400 font-mono">{totalPlayers.toLocaleString()}</div>
        </div>
        <div className="h-6 w-px bg-purple-800/40" />
        <div>
          <div className="text-[9px] sm:text-[10px] text-slate-400 font-mono uppercase">Countries</div>
          <div className="text-sm sm:text-lg font-bold text-purple-400 font-mono">{uniqueCountries}</div>
        </div>
        <div className="h-6 w-px bg-purple-800/40 hidden sm:block" />
        <div className="hidden sm:flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-emerald-400 font-mono font-bold">LIVE</span>
        </div>
      </div>
    </div>
  );
};
