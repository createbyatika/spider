import { useRobot } from "@/contexts/RobotContext";

/**
 * KOMPONEN: GreenhouseMap (V1.5.0 - Professional Digital Twin)
 * Deskripsi: Sistem pemetaan lahan real-time untuk pemantauan robot SPIDR.
 * -----------------------------------------------------------------------------
 * Dikembangkan untuk: Fakultas Teknologi Pertanian, Universitas Brawijaya.
 * Riset: Mahasiswa Teknik Pertanian Angkatan 2023.
 * * Modul ini menangani:
 * 1. Visualisasi Spasial bedengan tanam (Bed A, B, C).
 * 2. Perhitungan posisi robot menggunakan interpolasi linear (45 Nodes).
 * 3. Adaptasi UI untuk Dashboard Utama dan HUD Radar Draggable.
 * -----------------------------------------------------------------------------
 */
interface GreenhouseMapProps {
  minimap?: boolean; // Prop pendukung mode radar di dalam Live Feed
}

const GreenhouseMap = ({ minimap = false }: GreenhouseMapProps) => {
  const { state } = useRobot();

  /**
   * progress (t)
   * Menghitung progres pergerakan robot dari 0 (awal) ke 1 (akhir).
   * Nilai ini diikat pada current_path_node (1-45).
   */
  const progress = (state.current_path_node - 1) / (state.total_path_nodes - 1);

  /**
   * getPathPosition
   * Fungsi matematis untuk memetakan progres perjalanan ke koordinat SVG.
   * Koordinat ini harus presisi agar robot tidak keluar dari jalur garis.
   */
  const getPathPosition = (t: number) => {
    // Array titik sudut (Corner Points) jalur inspeksi S-Path.
    const points = [
      { x: 40, y: 25 },   // Start: Masuk Bed A
      { x: 360, y: 25 },  // Titik Balik Bed A
      { x: 360, y: 100 }, // Lorong 1
      { x: 40, y: 100 },  // Titik Balik Bed B Atas
      { x: 40, y: 175 },  // Lorong 2
      { x: 360, y: 175 }, // Titik Balik Bed B Bawah
      { x: 360, y: 250 }, // Lorong 3
      { x: 40, y: 250 },  // Titik Balik Bed C
      { x: 40, y: 285 },  // Finish: Area Keluar
    ];

    // Menghitung segmen garis mana yang sedang diduduki robot
    const segmentCount = points.length - 1;
    const segment = Math.min(Math.floor(t * segmentCount), segmentCount - 1);
    const segmentT = (t * segmentCount) - segment;
    
    // Titik referensi p1 dan p2 untuk kalkulasi antara dua node
    const p1 = points[segment];
    const p2 = points[segment + 1];
    
    // Mengembalikan koordinat hasil kalkulasi
    return {
      x: p1.x + (p2.x - p1.x) * segmentT,
      y: p1.y + (p2.y - p1.y) * segmentT,
    };
  };

  const robotPos = getPathPosition(progress);

  // --- RENDERING SVG ENGINE ---
  return (
    <div className={`
      transition-all duration-300
      ${minimap 
        ? "w-full h-full bg-transparent p-0" 
        : "rounded-xl border bg-card/60 backdrop-blur-md p-4 space-y-3 shadow-lg border-primary/20"
      }
    `}>
      {/* Header Utama: Hanya muncul jika bukan sebagai minimap kecil */}
      {!minimap && (
        <div className="flex items-center justify-between border-b border-primary/10 pb-2">
          <h3 className="text-sm font-bold text-primary tracking-tight">
            Greenhouse Map (Digital Twin)
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold bg-primary/10 text-primary px-2 py-1 rounded-full border border-primary/20">
              NAV_NODE: {state.current_path_node} / {state.total_path_nodes}
            </span>
          </div>
        </div>
      )}
      
      {/* Bidang Kartesius Peta */}
      <div 
        className={`relative w-full rounded-lg overflow-hidden ${!minimap ? "bg-background/40 grid-pattern border border-primary/5" : ""}`} 
        style={{ aspectRatio: "4/3" }}
      >
        <svg viewBox="0 0 400 300" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          
          {/* Layer 1: Visualisasi Bedengan (Soil Beds) */}
          <rect x="60" y="45" width="280" height="35" rx="12" fill="hsl(25 40% 15%)" stroke="hsl(25 30% 25%)" strokeWidth="1" opacity={minimap ? 0.3 : 1} />
          <rect x="60" y="120" width="280" height="35" rx="12" fill="hsl(25 40% 15%)" stroke="hsl(25 30% 25%)" strokeWidth="1" opacity={minimap ? 0.3 : 1} />
          <rect x="60" y="195" width="280" height="35" rx="12" fill="hsl(25 40% 15%)" stroke="hsl(25 30% 25%)" strokeWidth="1" opacity={minimap ? 0.3 : 1} />

          {/* Layer 2: Titik Tanaman (Hanya di Dashboard View) */}
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

          {/* Layer 3: Jalur Navigasi Robot (Dashed Line) */}
          <path
            d="M 40 25 L 360 25 L 360 100 L 40 100 L 40 175 L 360 175 L 360 250 L 40 250 L 40 285"
            fill="none"
            stroke="hsl(145 65% 38%)"
            strokeWidth={minimap ? "5" : "2.5"}
            strokeDasharray="6 4"
            opacity={minimap ? 0.2 : 0.4}
          />

          {/* Layer 4: Ikon Heksapoda SPIDR (Status Active) */}
          <g transform={`translate(${robotPos.x}, ${robotPos.y})`} style={{ transition: 'all 0.8s linear' }}>
            {/* Animasi Sinyal (Pulse) */}
            <circle r={minimap ? "24" : "14"} fill="hsl(145 65% 38%)" opacity="0.15" className="animate-ping" />
            
            {/* Body Utama */}
            <circle r={minimap ? "16" : "9"} fill="hsl(145 65% 38%)" stroke="white" strokeWidth="2" />
            
            {/* Visualisasi Kaki Mekanik */}
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
            {/* Unit Sensor Lidar */}
            <circle r="4" fill="black" />
          </g>

          {/* Layer 5: Label Identitas Area (Hanya di Dashboard View) */}
          {!minimap && (
            <g className="font-mono text-[9px] font-black" fill="white" opacity="0.4">
              <text x="200" y="67" textAnchor="middle">BED_A_PLANTATION</text>
              <text x="200" y="142" textAnchor="middle">BED_B_PLANTATION</text>
              <text x="200" y="217" textAnchor="middle">BED_C_PLANTATION</text>
            </g>
          )}
        </svg>
      </div>

      {/* Footer Komponen */}
      {!minimap && (
        <div className="pt-2 border-t border-primary/10">
          <p className="text-[8px] text-muted-foreground font-mono uppercase tracking-widest text-center">
            System Synchronized // Precision Mode Active
          </p>
        </div>
      )}
    </div>
  );
};

export default GreenhouseMap;