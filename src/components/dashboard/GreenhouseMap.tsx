import { useRobot } from "@/contexts/RobotContext";

/**
 * KOMPONEN: GreenhouseMap (V1.2.0)
 * Deskripsi: Visualisasi pemetaan lahan (Digital Twin) untuk robot SPIDR.
 * Dikembangkan sebagai bagian dari riset Teknik Pertanian, FTP, Universitas Brawijaya.
 * * Fitur:
 * - Interpolasi linear untuk pergerakan robot yang halus (45 Node).
 * - Mode Ganda: Dashboard View & HUD Minimap View.
 * - Kalibrasi Jalur S-Path presisi tinggi.
 */
interface GreenhouseMapProps {
  minimap?: boolean; // Prop untuk mendeteksi apakah peta sedang ditampilkan sebagai radar
}

const GreenhouseMap = ({ minimap = false }: GreenhouseMapProps) => {
  const { state } = useRobot();

  // --- 1. KALIBRASI LOGIKA NAVIGASI (45 NODES) ---
  // Kita menggunakan variabel progres 't' berbasis node aktif.
  // Rumus: $t = \frac{\text{Node} - 1}{\text{Total Node} - 1}$
  const progress = (state.current_path_node - 1) / (state.total_path_nodes - 1);

  /**
   * getPathPosition
   * Fungsi inti untuk menghitung koordinat spasial (X, Y) robot pada bidang kartesius SVG.
   * Parameter 't' adalah progres perjalanan dari 0.0 (awal) hingga 1.0 (akhir).
   */
  const getPathPosition = (t: number) => {
    // Array Koordinat Sudut Jalur (S-Path) - Selaras dengan desain fisik bedengan.
    const points = [
      { x: 40, y: 25 },   // Node Awal (Pojok Kiri Atas)
      { x: 360, y: 25 },  // Ujung Bed A Kanan
      { x: 360, y: 100 }, // Transisi ke Bed B
      { x: 40, y: 100 },  // Ujung Bed B Kiri
      { x: 40, y: 175 },  // Transisi ke Bed B Bawah
      { x: 360, y: 175 }, // Ujung Bed B Kanan Bawah
      { x: 360, y: 250 }, // Transisi ke Bed C
      { x: 40, y: 250 },  // Ujung Bed C Kiri
      { x: 40, y: 285 },  // Titik Finish (Pojok Kiri Bawah)
    ];

    // Menghitung segmen mana yang sedang dilalui berdasarkan progres 't'
    const segmentCount = points.length - 1;
    const segment = Math.min(Math.floor(t * segmentCount), segmentCount - 1);
    const segmentT = (t * segmentCount) - segment;
    
    // Titik Interpolasi (Awal dan Akhir Segmen)
    const p1 = points[segment];
    const p2 = points[segment + 1];
    
    // Mengembalikan koordinat hasil perhitungan linear
    return {
      x: p1.x + (p2.x - p1.x) * segmentT,
      y: p1.y + (p2.y - p1.y) * segmentT,
    };
  };

  const robotPos = getPathPosition(progress);

  // --- 2. RENDER INTERFACE (SVG) ---
  return (
    <div className={`
      transition-all duration-700 ease-in-out
      ${minimap 
        ? "w-full h-full bg-transparent p-0" 
        : "rounded-xl border bg-card/60 backdrop-blur-md p-4 space-y-3 shadow-sm border-primary/20"
      }
    `}>
      {/* HEADER: Hanya muncul jika bukan dalam mode radar kecil */}
      {!minimap && (
        <div className="flex items-center justify-between border-b border-primary/10 pb-2">
          <h3 className="text-sm font-bold text-primary flex items-center gap-2">
            Greenhouse Map (Digital Twin)
          </h3>
          <span className="text-[10px] font-mono font-bold bg-primary/10 text-primary px-2 py-1 rounded-full border border-primary/20">
            NAV-NODE: {state.current_path_node} OF {state.total_path_nodes}
          </span>
        </div>
      )}
      
      {/* Wadah Peta SVG */}
      <div 
        className={`relative w-full rounded-lg overflow-hidden ${!minimap ? "bg-background/40 grid-pattern border border-primary/5 shadow-inner" : ""}`} 
        style={{ aspectRatio: "4/3" }}
      >
        <svg viewBox="0 0 400 300" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          
          {/* DEFINISI LAYER 1: Bedengan Tanah (Soil Beds) */}
          <rect x="60" y="45" width="280" height="35" rx="12" fill="hsl(25 40% 15%)" stroke="hsl(25 30% 25%)" strokeWidth="1" opacity={minimap ? 0.4 : 1} />
          <rect x="60" y="120" width="280" height="35" rx="12" fill="hsl(25 40% 15%)" stroke="hsl(25 30% 25%)" strokeWidth="1" opacity={minimap ? 0.4 : 1} />
          <rect x="60" y="195" width="280" height="35" rx="12" fill="hsl(25 40% 15%)" stroke="hsl(25 30% 25%)" strokeWidth="1" opacity={minimap ? 0.4 : 1} />

          {/* DEFINISI LAYER 2: Titik Tanaman (Hanya di Dashboard) */}
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

          {/* DEFINISI LAYER 3: Jalur Navigasi Dashed (S-Path) */}
          <path
            d="M 40 25 L 360 25 L 360 100 L 40 100 L 40 175 L 360 175 L 360 250 L 40 250 L 40 285"
            fill="none"
            stroke="hsl(145 65% 38%)"
            strokeWidth={minimap ? "4.5" : "2.5"}
            strokeDasharray="6 4"
            opacity={minimap ? 0.3 : 0.4}
          />

          {/* DEFINISI LAYER 4: Ikon Robot SPIDR (High Visibility) */}
          <g transform={`translate(${robotPos.x}, ${robotPos.y})`} style={{ transition: 'all 0.8s linear' }}>
            {/* Animasi Sinyal Radar */}
            <circle r={minimap ? "22" : "14"} fill="hsl(145 65% 38%)" opacity="0.15" className="animate-ping" />
            
            {/* Body Robot */}
            <circle r={minimap ? "15" : "9"} fill="hsl(145 65% 38%)" stroke="white" strokeWidth="2" shadow-xl />
            
            {/* Kaki Heksapoda Visual */}
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
            {/* Sensor Inti */}
            <circle r="4" fill="black" />
          </g>

          {/* DEFINISI LAYER 5: Label Identitas Bedengan */}
          {!minimap && (
            <g className="font-mono text-[9px] font-black" fill="white" opacity="0.5">
              <text x="200" y="67" textAnchor="middle">PLANTATION_BED_A</text>
              <text x="200" y="142" textAnchor="middle">PLANTATION_BED_B</text>
              <text x="200" y="217" textAnchor="middle">PLANTATION_BED_C</text>
            </g>
          )}
        </svg>
      </div>

      {/* FOOTER: Informasi Tambahan Map Utama */}
      {!minimap && (
        <p className="text-[9px] text-muted-foreground font-mono uppercase tracking-widest text-center">
          Status: Operational // Data Linked to Supabase Cloud
        </p>
      )}
    </div>
  );
};

export default GreenhouseMap;