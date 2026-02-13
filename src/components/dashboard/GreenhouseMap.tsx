import { useRobot } from "@/contexts/RobotContext";

const GreenhouseMap = () => {
  const { state } = useRobot();

  // --- KALIBRASI PROGRES (PENTING) ---
  // Menggunakan (Node - 1) agar Node 1 dimulai dari 0% progres
  const progress = (state.current_path_node - 1) / (state.total_path_nodes - 1);

  const getPathPosition = (t: number) => {
    // Titik koordinat diselaraskan 100% dengan atribut 'd' pada tag <path>
    const points = [
      { x: 40, y: 25 },   // Node 1 (Start)
      { x: 360, y: 25 },  
      { x: 360, y: 100 }, 
      { x: 40, y: 100 },  
      { x: 40, y: 175 },  
      { x: 360, y: 175 }, 
      { x: 360, y: 250 }, 
      { x: 40, y: 250 },  
      { x: 40, y: 285 },  // Node 18 (End)
    ];
    const segmentCount = points.length - 1;
    const segment = Math.min(Math.floor(t * segmentCount), segmentCount - 1);
    const segmentT = (t * segmentCount) - segment;
    const p1 = points[segment];
    const p2 = points[segment + 1];
    
    return {
      x: p1.x + (p2.x - p1.x) * segmentT,
      y: p1.y + (p2.y - p1.y) * segmentT,
    };
  };

  const robotPos = getPathPosition(progress);

  return (
    <div className="rounded-xl border bg-card/60 backdrop-blur-md p-4 space-y-3 shadow-sm border-primary/20">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-primary">Greenhouse Map</h3>
        <span className="text-xs text-muted-foreground font-mono font-bold bg-primary/5 px-2 py-0.5 rounded-full">
          Node {state.current_path_node}/{state.total_path_nodes}
        </span>
      </div>
      
      <div className="relative w-full bg-background/40 rounded-lg overflow-hidden grid-pattern border border-primary/5" style={{ aspectRatio: "4/3" }}>
        <svg viewBox="0 0 400 300" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          {/* Soil Beds (Warna Cokelat SPIDR) */}
          <rect x="60" y="45" width="280" height="35" rx="12" fill="hsl(25 40% 20%)" stroke="hsl(25 30% 30%)" strokeWidth="1" />
          <rect x="60" y="120" width="280" height="35" rx="12" fill="hsl(25 40% 20%)" stroke="hsl(25 30% 30%)" strokeWidth="1" />
          <rect x="60" y="195" width="280" height="35" rx="12" fill="hsl(25 40% 20%)" stroke="hsl(25 30% 30%)" strokeWidth="1" />

          {/* Plant dots on beds */}
          {[0, 1, 2].map((bed) =>
            [0, 1, 2, 3, 4, 5].map((plant) => (
              <circle
                key={`${bed}-${plant}`}
                cx={100 + plant * 45}
                cy={62 + bed * 75}
                r="6"
                fill="hsl(145 50% 30%)"
                opacity="0.6"
              />
            ))
          )}

          {/* S-shaped dashed path - Koordinat diperbarui agar lebih presisi */}
          <path
            d="M 40 25 L 360 25 L 360 100 L 40 100 L 40 175 L 360 175 L 360 250 L 40 250 L 40 285"
            fill="none"
            stroke="hsl(145 65% 38%)"
            strokeWidth="2.5"
            strokeDasharray="6 4"
            opacity="0.3"
          />

          {/* Ikon Robot SPIDR (High Visibility) */}
          <g transform={`translate(${robotPos.x}, ${robotPos.y})`} style={{ transition: 'all 0.8s linear' }}>
            <circle r="12" fill="hsl(145 65% 38%)" opacity="0.2" className="animate-pulse" />
            {/* Outline putih agar robot terlihat jelas di background terang */}
            <circle r="8" fill="hsl(145 65% 38%)" stroke="white" strokeWidth="1.5" />
            {[0, 60, 120, 180, 240, 300].map((angle) => (
              <line
                key={angle}
                x1={Math.cos((angle * Math.PI) / 180) * 5}
                y1={Math.sin((angle * Math.PI) / 180) * 5}
                x2={Math.cos((angle * Math.PI) / 180) * 11}
                y2={Math.sin((angle * Math.PI) / 180) * 11}
                stroke="white"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            ))}
            <circle r="3" fill="black" />
          </g>

          {/* Labels - Dibuat lebih kontras */}
          <text x="200" y="67" textAnchor="middle" fill="white" fontSize="8" fontFamily="monospace" fontWeight="bold" opacity="0.6">BED A</text>
          <text x="200" y="142" textAnchor="middle" fill="white" fontSize="8" fontFamily="monospace" fontWeight="bold" opacity="0.6">BED B</text>
          <text x="200" y="217" textAnchor="middle" fill="white" fontSize="8" fontFamily="monospace" fontWeight="bold" opacity="0.6">BED C</text>
        </svg>
      </div>
    </div>
  );
};

export default GreenhouseMap;