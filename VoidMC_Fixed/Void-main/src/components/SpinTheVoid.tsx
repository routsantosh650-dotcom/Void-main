import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy, RotateCcw, Volume2, VolumeX, Shield, Swords } from 'lucide-react';
import { PVP_PRACTICE_MODES } from '../data/initialData.ts';
import { calculatePvPWheelWinner } from '../utils/pureRules.ts';

export const SpinTheVoid: React.FC = () => {
  const [spinning, setSpinning] = useState(false);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [winner, setWinner] = useState<typeof PVP_PRACTICE_MODES[0] | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const segments = PVP_PRACTICE_MODES;
  const numSegments = segments.length;
  const anglePerSegment = 360 / numSegments;

  // Sound generator using Web Audio API
  const playClickSound = () => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // AudioContext unavailable
    }
  };

  const playWinSound = () => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      const notes = [440, 554.37, 659.25, 880];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0.2, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + idx * 0.08 + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.35);
      });
    } catch {
      // AudioContext unavailable
    }
  };

  const handleSpin = () => {
    if (spinning) return;
    setSpinning(true);
    setWinner(null);

    // Pick random extra turns (5 to 8 full rotations) + random stop angle
    const extraRotations = 360 * (5 + Math.floor(Math.random() * 3));
    const randomStopAngle = Math.floor(Math.random() * 360);
    const newTotalRotation = currentRotation + extraRotations + randomStopAngle;

    // Tick sound intervals
    let tickCount = 0;
    const tickInterval = setInterval(() => {
      tickCount++;
      playClickSound();
      if (tickCount > 24) clearInterval(tickInterval);
    }, 150);

    setCurrentRotation(newTotalRotation);

    // Easing duration is 4.5 seconds
    setTimeout(() => {
      clearInterval(tickInterval);
      setSpinning(false);
      const modeNames = segments.map((s) => s.name);
      // Notice: In the SVG, segment 0 starts at 0° (which is 3 o'clock).
      // The pointer is at top (12 o'clock = 270° from center, or -90°).
      // Angle under top pointer = (270 - (newTotalRotation % 360) + 360) % 360
      const normalizedRot = (newTotalRotation % 360 + 360) % 360;
      const effectiveAngle = (270 - normalizedRot + 360) % 360;
      const winningIdx = Math.floor(effectiveAngle / anglePerSegment) % numSegments;
      const selected = segments[winningIdx];
      setWinner(selected);

      playWinSound();

      // Confetti celebration
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#a855f7', '#c084fc', '#9333ea', '#ffffff', '#e879f9'],
        });
      } catch {
        // ignore
      }
    }, 4500);
  };

  return (
    <div className="py-16 bg-[#0B0713]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Header matching screenshot 998 */}
        <span className="text-xs font-mono uppercase tracking-[0.25em] text-purple-400 font-bold">
          RANDOM PVP PRACTICE
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-white mt-1 mb-3 font-heading tracking-tight">
          SPIN THE <span className="text-purple-400">VOID.</span>
        </h1>
        <p className="text-sm text-slate-300 max-w-xl mx-auto mb-10 leading-relaxed">
          Don't know which PvP mode to practice? Spin the wheel and let VOIDMC choose your next challenge.
        </p>

        {/* Sound toggle */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#180E2B] border border-purple-900/60 text-xs text-purple-300 hover:text-white transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>{soundEnabled ? 'Sound On' : 'Muted'}</span>
          </button>
        </div>

        {/* Wheel Container matching screenshot 998 */}
        <div className="relative w-80 h-80 sm:w-96 sm:h-96 mx-auto mb-8">
          {/* Top Indicator Arrow (Pointing Down at Wheel) */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-30 drop-shadow-[0_0_12px_rgba(255,255,255,0.8)] pointer-events-none">
            <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[22px] border-t-white" />
          </div>

          {/* Glowing Ambient Ring */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-700/40 via-indigo-600/30 to-purple-500/40 blur-xl scale-105 pointer-events-none" />

          {/* Rotating SVG Wheel */}
          <div
            className="w-full h-full rounded-full overflow-hidden border-4 border-purple-500/60 shadow-[0_0_40px_rgba(168,85,247,0.4)] relative"
            style={{
              transform: `rotate(${currentRotation}deg)`,
              transition: spinning ? 'transform 4.5s cubic-bezier(0.15, 0.95, 0.25, 1)' : 'none',
            }}
          >
            <svg viewBox="0 0 400 400" className="w-full h-full select-none">
              <defs>
                <filter id="segment-glow">
                  <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#ffffff" floodOpacity="0.2" />
                </filter>
              </defs>
              {segments.map((seg, idx) => {
                const startAngle = idx * anglePerSegment;
                const endAngle = (idx + 1) * anglePerSegment;
                const midAngle = startAngle + anglePerSegment / 2;

                // Sector Arc Math
                const r = 200;
                const cx = 200;
                const cy = 200;
                const startRad = (startAngle * Math.PI) / 180;
                const endRad = (endAngle * Math.PI) / 180;
                const x1 = cx + r * Math.cos(startRad);
                const y1 = cy + r * Math.sin(startRad);
                const x2 = cx + r * Math.cos(endRad);
                const y2 = cy + r * Math.sin(endRad);

                // Alternating deep purple & bright purple sectors like screenshot 998
                const isEven = idx % 2 === 0;
                const fillColor = isEven ? '#6b21a8' : '#9333ea';

                // Text Position
                const textRad = (midAngle * Math.PI) / 180;
                const tx = cx + 130 * Math.cos(textRad);
                const ty = cy + 130 * Math.sin(textRad);
                // Rotate text to point radially towards center
                const textRotation = midAngle + 90;

                return (
                  <g key={seg.name}>
                    <path
                      d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`}
                      fill={fillColor}
                      stroke="#4c1d95"
                      strokeWidth="1.5"
                    />
                    <text
                      x={tx}
                      y={ty}
                      fill="#ffffff"
                      fontSize="12"
                      fontWeight="bold"
                      fontFamily="Outfit, sans-serif"
                      letterSpacing="1px"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${textRotation}, ${tx}, ${ty})`}
                    >
                      {seg.name}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Center SPIN Button matching screenshot 998 */}
          <button
            onClick={handleSpin}
            disabled={spinning}
            aria-label="Spin the Void PvP practice wheel"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-b from-[#22103E] to-[#120626] border-4 border-purple-500 flex flex-col items-center justify-center text-white font-black font-heading shadow-[0_0_25px_rgba(168,85,247,0.8)] hover:scale-105 active:scale-95 transition-all focus:outline-none disabled:opacity-80 disabled:cursor-not-allowed group cursor-pointer"
          >
            <span className="text-xs sm:text-sm tracking-widest text-white group-hover:text-purple-300 transition-colors">
              SPIN
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1 shadow-[0_0_6px_#a855f7]" />
          </button>
        </div>

        {/* Footer State Text matching screenshot 998 */}
        <div className="mt-8">
          <div className="text-xs font-mono uppercase tracking-[0.2em] text-slate-400 mb-1">
            YOUR RANDOM MODE
          </div>
          {winner ? (
            <div className="animate-in fade-in zoom-in duration-300">
              <div className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-300 to-indigo-300 font-heading">
                {winner.icon} {winner.name}
              </div>
              <div className="max-w-md mx-auto mt-4 p-4 rounded-xl bg-[#160D26] border border-purple-700/50 text-left shadow-lg">
                <div className="flex items-center gap-2 text-purple-300 font-bold text-xs uppercase mb-1">
                  <Swords className="w-3.5 h-3.5" />
                  <span>Practice Guidelines:</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {winner.description}
                </p>
                <div className="mt-3 pt-3 border-t border-purple-900/40 flex items-center justify-between text-[11px] font-mono text-purple-400">
                  <span>Server command: /pvp practice {winner.name.toLowerCase()}</span>
                  <span className="text-emerald-400 font-bold">READY</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-lg font-bold tracking-wider text-purple-400 font-heading">
              {spinning ? 'DECIDING YOUR FATE...' : 'SPIN TO START'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
