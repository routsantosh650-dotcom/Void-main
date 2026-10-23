import React, { useState, useEffect } from 'react';
import { MapPin, Users } from 'lucide-react';

interface Location {
  id: number;
  city: string;
  country: string;
  lat: number;
  lng: number;
  players: number;
}

const LOCATIONS: Location[] = [
  // India - 20 locations
  { id: 1, city: 'Mumbai', country: 'India', lat: 19.076, lng: 72.8777, players: 50 },
  { id: 2, city: 'Delhi', country: 'India', lat: 28.7041, lng: 77.1025, players: 50 },
  { id: 3, city: 'Bangalore', country: 'India', lat: 12.9716, lng: 77.5946, players: 50 },
  { id: 4, city: 'Hyderabad', country: 'India', lat: 17.385, lng: 78.4867, players: 50 },
  { id: 5, city: 'Chennai', country: 'India', lat: 13.0827, lng: 80.2707, players: 50 },
  { id: 6, city: 'Kolkata', country: 'India', lat: 22.5726, lng: 88.3639, players: 50 },
  { id: 7, city: 'Pune', country: 'India', lat: 18.5204, lng: 73.8567, players: 50 },
  { id: 8, city: 'Ahmedabad', country: 'India', lat: 23.0225, lng: 72.5714, players: 50 },
  { id: 9, city: 'Jaipur', country: 'India', lat: 26.9124, lng: 75.7873, players: 50 },
  { id: 10, city: 'Lucknow', country: 'India', lat: 26.8467, lng: 80.9462, players: 50 },
  { id: 11, city: 'Kanpur', country: 'India', lat: 26.4499, lng: 80.3319, players: 50 },
  { id: 12, city: 'Nagpur', country: 'India', lat: 21.1458, lng: 79.0882, players: 50 },
  { id: 13, city: 'Indore', country: 'India', lat: 22.7196, lng: 75.8577, players: 50 },
  { id: 14, city: 'Thane', country: 'India', lat: 19.2183, lng: 72.9781, players: 50 },
  { id: 15, city: 'Bhopal', country: 'India', lat: 23.2599, lng: 77.4126, players: 50 },
  { id: 16, city: 'Visakhapatnam', country: 'India', lat: 17.6868, lng: 83.2185, players: 50 },
  { id: 17, city: 'Patna', country: 'India', lat: 25.6093, lng: 85.1376, players: 50 },
  { id: 18, city: 'Vadodara', country: 'India', lat: 22.3072, lng: 73.1812, players: 50 },
  { id: 19, city: 'Ghaziabad', country: 'India', lat: 28.6692, lng: 77.4538, players: 50 },
  { id: 20, city: 'Ludhiana', country: 'India', lat: 30.901, lng: 75.8573, players: 50 },
  
  // International - 10 locations
  { id: 21, city: 'Singapore', country: 'Singapore', lat: 1.3521, lng: 103.8198, players: 50 },
  { id: 22, city: 'Dubai', country: 'UAE', lat: 25.2048, lng: 55.2708, players: 50 },
  { id: 23, city: 'London', country: 'UK', lat: 51.5074, lng: -0.1278, players: 50 },
  { id: 24, city: 'New York', country: 'USA', lat: 40.7128, lng: -74.006, players: 50 },
  { id: 25, city: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503, players: 50 },
  { id: 26, city: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093, players: 50 },
  { id: 27, city: 'Frankfurt', country: 'Germany', lat: 50.1109, lng: 8.6821, players: 50 },
  { id: 28, city: 'Toronto', country: 'Canada', lat: 43.6532, lng: -79.3832, players: 50 },
  { id: 29, city: 'Mumbai', country: 'India', lat: 19.076, lng: 72.8777, players: 50 },
  { id: 30, city: 'Bangkok', country: 'Thailand', lat: 13.7563, lng: 100.5018, players: 50 },
];

export const WorldMap: React.FC = () => {
  const [activeLocations, setActiveLocations] = useState<Location[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Show first 7 locations
    const updateLocations = () => {
      const locations = [];
      for (let i = 0; i < 7; i++) {
        const index = (currentIndex + i) % LOCATIONS.length;
        locations.push(LOCATIONS[index]);
      }
      setActiveLocations(locations);
    };

    updateLocations();

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % LOCATIONS.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  // Convert lat/lng to percentage position on map
  const getPosition = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * 100;
    const y = ((90 - lat) / 180) * 100;
    return { x, y };
  };

  return (
    <div className="relative w-full h-[500px] bg-[#0B0713] border border-purple-900/40 rounded-3xl overflow-hidden">
      {/* World Map Background */}
      <div className="absolute inset-0 opacity-30">
        <svg viewBox="0 0 1000 500" className="w-full h-full">
          {/* Simplified world map outline */}
          <path
            d="M 150 100 Q 200 80 250 100 T 350 120 T 450 100 T 550 110 T 650 100 T 750 120 T 850 100"
            fill="none"
            stroke="rgba(168, 85, 247, 0.3)"
            strokeWidth="2"
          />
          {/* Grid lines */}
          {Array.from({ length: 10 }).map((_, i) => (
            <line
              key={`h-${i}`}
              x1="0"
              y1={i * 50}
              x2="1000"
              y2={i * 50}
              stroke="rgba(168, 85, 247, 0.1)"
              strokeWidth="1"
            />
          ))}
          {Array.from({ length: 20 }).map((_, i) => (
            <line
              key={`v-${i}`}
              x1={i * 50}
              y1="0"
              x2={i * 50}
              y2="500"
              stroke="rgba(168, 85, 247, 0.1)"
              strokeWidth="1"
            />
          ))}
        </svg>
      </div>

      {/* Active Location Markers */}
      {activeLocations.map((location, idx) => {
        const pos = getPosition(location.lat, location.lng);
        return (
          <div
            key={location.id}
            className="absolute transition-all duration-1000 ease-in-out"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              animationDelay: `${idx * 0.1}s`,
            }}
          >
            {/* Pulsing Ring */}
            <div className="absolute -inset-4 bg-purple-500/30 rounded-full animate-ping" />
            
            {/* Location Dot */}
            <div className="relative w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.8)]">
              <div className="absolute inset-0 bg-white rounded-full animate-pulse" />
            </div>

            {/* Location Info Tooltip */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-[#130C22]/95 border border-purple-500/50 rounded-xl px-3 py-2 backdrop-blur-xl shadow-[0_0_20px_rgba(168,85,247,0.4)] whitespace-nowrap">
              <div className="flex items-center gap-2">
                <MapPin className="w-3 h-3 text-purple-400" />
                <span className="text-xs font-bold text-white">{location.city}</span>
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <Users className="w-3 h-3 text-emerald-400" />
                <span className="text-[10px] text-emerald-400 font-mono">{location.players} players</span>
              </div>
            </div>
          </div>
        );
      })}

      {/* Stats Overlay */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-[#130C22]/90 border border-purple-900/40 rounded-2xl px-6 py-3 backdrop-blur-xl">
        <div>
          <div className="text-xs text-slate-400 font-mono">ACTIVE NODES</div>
          <div className="text-xl font-bold text-white font-mono">{activeLocations.length}</div>
        </div>
        <div>
          <div className="text-xs text-slate-400 font-mono">TOTAL PLAYERS</div>
          <div className="text-xl font-bold text-emerald-400 font-mono">
            {activeLocations.reduce((sum, loc) => sum + loc.players, 0)}
          </div>
        </div>
        <div>
          <div className="text-xs text-slate-400 font-mono">COUNTRIES</div>
          <div className="text-xl font-bold text-purple-400 font-mono">
            {new Set(activeLocations.map((l) => l.country)).size}
          </div>
        </div>
      </div>
    </div>
  );
};
