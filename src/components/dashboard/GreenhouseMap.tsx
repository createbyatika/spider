import { useRobot } from "@/contexts/RobotContext";

/**
 * KOMPONEN: GreenhouseMap (V1.4.0 - Draggable & High-Res)
 * Deskripsi: Visualisasi pemetaan digital (Digital Twin) untuk sistem SPIDR.
 * -----------------------------------------------------------------------------
 * Dikembangkan untuk: Departemen Teknik Biosistem, FTP, Universitas Brawijaya.
 * Riset: Mahasiswa Angkatan 2023.
 * * Fungsi Utama:
 * 1. Tracking posisi robot pada jalur S-Path (45 Nodes).
 * 2. Visualisasi Bedengan (Soil Beds) A, B, dan C.
 * 3. Mode Ganda: Tampilan Dashboard & HUD Minimap Radar.
 * -----------------------------------------------------------------------------
 */
interface GreenhouseMapProps {
  minimap?: boolean; // Prop untuk mendeteksi penggunaan sebagai radar di HUD
}

const GreenhouseMap = ({ minimap = false }: GreenhouseMapProps) => {
  const { state } = useRobot();

  /**
   * Progres Kalkulasi (t)
   * Menghitung rasio pergerakan robot dari start (0) hingga finish (1).
   * Berbasis pada total 45 Node untuk kehalusan pergerakan.
   */
  const progress = (state.current_path_node - 1) / (state.total_path_nodes - 1);

  /**
   * getPathPosition (Linear Interpolation Algorithm)
   * Menentukan koordinat X dan Y robot berdasarkan array titik sudut.
   */
  const getPathPosition = (t: number) => {
    // Array koordinat absolut jalur navigasi (S-Path) dalam grid 400x300.
    const points = [
      { x: 40, y: 25 },   // Start: Masuk Bed A
      { x: 360, y: 25 },  // Ujung Bed A Kanan
      { x: 360, y: 100 }, // Lorong 1
      { x: 40, y: 100 },  // Ujung Bed B Kiri
      { x: 40, y: 175 },  // Lorong 2
      { x: 360, y: 175 }, // Ujung Bed B Kanan
      { x: 360, y: 250 }, // Lorong 3
      { x: 40, y: 250 },  // Ujung Bed C Kiri
      { x: 40, y: 285 },  // Finish: Jalur Keluar
    ];

    // Menghitung segmen saat ini
    const segmentCount = points.length - 1;
    const segment = Math.min(Math.floor(t * segmentCount), segmentCount - 1);
    const segmentT = (t * segmentCount) - segment;
    
    // Titik referensi p1 (awal) dan p2 (akhir) segmen
    const p1 = points[segment];
    const p2 = points[segment + 1];
    
    // Interpolasi linear antar koordinat
    return {
      x: p1.x + (p2.x - p1.x) * segmentT,
      y: p1.y + (p2.y - p1.y) * segmentT,
    };
  };

  const robotPos = getPathPosition(progress);

  // --- RENDERING LAYER KOMPONEN ---
  return (
    <div className={`
      transition-all duration-300
      ${minimap 
        ? "w-full h-full bg-transparent p-0" 
        : "rounded-xl border bg-card/60 backdrop-blur-md p-4 space-y-3 shadow-lg border-primary/20"
      }
    `}>
      {/* HEADER: Hanya muncul di peta dashboard utama */}
      {!minimap && (
        <div className="flex items-center justify-between border-b border-primary/10 pb-2">
          <h3 className="text-sm font-bold text-primary tracking-tight">
            Greenhouse Map (Digital Twin)
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold bg-primary/10 text-primary px-2 py-1 rounded-full border border-primary/20">
              NODE: {state.current_path_node} / {state.total_path_nodes}
            </span>
          </div>
        </div>
      )}
      
      {/* AREA GRAFIS: SVG CANVAS */}
      <div 
        className={`relative w-full rounded-lg overflow-hidden ${!minimap ? "bg-background/40 grid-pattern border border-primary/5" : ""}`} 
        style={{ aspectRatio: "4/3" }}
      >
        <svg viewBox="0 0 400 300" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          
          {/* 1. LAYER BEDENGAN (Soil Beds Visualization) */}
          <rect x="60" y="45" width="280" height="35" rx="12" fill="hsl(25 40% 15%)" stroke="hsl(25 30% 25%)" strokeWidth="1" opacity={minimap ? 0.3 : 1} />
          <rect x="60" y="120" width="280" height="35" rx="12" fill="hsl(25 40% 15%)" stroke="hsl(25 30% 25%)" strokeWidth="1" opacity={minimap ? 0.3 : 1} />
          <rect x="60" y="195" width="280" height="35" rx="12" fill="hsl(25 40% 15%)" stroke="hsl(25 30% 25%)" strokeWidth="1" opacity={minimap ? 0.3 : 1} />

          {/* 2. LAYER TANAMAN (Hanya muncul di dashboard) */}
          {!minimap && [0, 1, 2].map((bed) =>
            [0, 1, 2, 3, 4, 5].map((plant) => (
              <circle
                key={`${bed}-${plant}`}
                cx={100 + plant * 45}
                cy={62 + bed * 75}
                r="6"
                fill="hsl(145 60% 25%)"
                opacity="0.5"
              />
            ))
          )}

          {/* 3. LAYER JALUR (S-Path Dashed Line) */}
          <path
            d="M 40 25 L 360 25 L 360 100 L 40 100 L 40 175 L 360 175 L 360 250 L 40 250 L 40 285"
            fill="none"
            stroke="hsl(145 65% 38%)"
            strokeWidth={minimap ? "5" : "2.5"}
            strokeDasharray="6 4"
            opacity={minimap ? 0.2 : 0.4}
          />

          {/* 4. LAYER ROBOT (High Visibility Hexapod Icon) */}
          <g transform={`translate(${robotPos.x}, ${robotPos.y})`} style={{ transition: 'all 0.8s linear' }}>
            <circle r={minimap ? "24" : "14"} fill="hsl(145 65% 38%)" opacity="0.15" className="animate-ping" />
            <circle r={minimap ? "16" : "9"} fill="hsl(145 65% 38%)" stroke="white" strokeWidth="2" />
            
            {/* Visual Kaki Heksapoda */}
            {[0, 60, 120, 180, 240, 300].map((angle) => (
              <line
                key={angle}
                x1={Math.cos((angle * Math.PI) / 180) * 5}
                y1={Math.sin((angle * Math.PI) / 180) * 5}
                x2={Math.cos((angle * Math.PI) / 180) * 12}
                y2={Math.sin((angle * Math.PI) / 180) * 12}
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            ))}
            <circle r="4" fill="black" />
          </g>

          {/* 5. LAYER LABEL (Metadata) */}
          {!minimap && (
            <g className="font-mono text-[9px] font-black" fill="white" opacity="0.4">
              <text x="200" y="67" textAnchor="middle">BED_A_ZONE</text>
              <text x="200" y="142" textAnchor="middle">BED_B_ZONE</text>
              <text x="200" y="217" textAnchor="middle">BED_C_ZONE</text>
            </g>
          )}
        </svg>
      </div>

      {/* FOOTER: Informasi Tambahan */}
      {!minimap && (
        <div className="pt-2 border-t border-primary/10">
          <p className="text-[8px] text-muted-foreground font-mono uppercase tracking-widest text-center">
            Precision Navigation // Linked to Bio-AI System
          </p>
        </div>
      )}
    </div>
  );
};

export default GreenhouseMap;