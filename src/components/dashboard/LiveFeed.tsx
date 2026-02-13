import { 
  Video, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, 
  RotateCcw, RotateCw, ArrowLeftRight, Camera, Target, 
  ShieldAlert, Circle, X 
} from "lucide-react";
import { useRobot } from "@/contexts/RobotContext";
import { Button } from "@/components/ui/button";
import GreenhouseMap from "./GreenhouseMap"; 

const LiveFeed = () => {
  const { state, moveManual, capturePest, setMode } = useRobot();
  const isRemoteApp = state.operation_mode === "remote_app";

  return (
    <div className={`relative overflow-hidden transition-all duration-500 ${
      isRemoteApp ? "fixed inset-0 z-50 bg-black h-screen w-screen" : "rounded-xl border bg-card p-4 space-y-3 shadow-lg border-primary/20"
    }`}>
      
      {/* Header Dashboard Utama */}
      {!isRemoteApp && (
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold flex items-center gap-2 font-mono uppercase tracking-tighter text-primary">
            <Video className="w-4 h-4" /> Live Feed System
          </h3>
          <div className="flex items-center gap-2">
            {state.robot_status === "alert" && (
              <span className="text-[10px] bg-destructive text-white px-2 py-0.5 rounded-full animate-pulse font-bold flex items-center gap-1 shadow-lg shadow-destructive/20">
                <ShieldAlert className="w-3 h-3" /> PEST DETECTED
              </span>
            )}
            <span className="text-[10px] font-mono text-muted-foreground uppercase font-semibold">SPIDR_V1_PRO</span>
          </div>
        </div>
      )}

      {/* WADAH UTAMA VIDEO / POV */}
      <div className={`relative w-full bg-slate-950 flex items-center justify-center overflow-hidden ${
        isRemoteApp ? "h-full" : "rounded-lg border-2 border-primary/10 aspect-video"
      }`}>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none z-10" />

        {/* --- PERBAIKAN: MINIMAP PINDAH KE POJOK KIRI ATAS (DI BAWAH EXIT) --- */}
        {isRemoteApp && (
          <div className="absolute top-20 left-6 w-36 sm:w-60 aspect-[4/3] z-40 rounded-xl border-2 border-white/20 bg-black/50 backdrop-blur-xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-left duration-700">
            <div className="absolute top-1 left-2 z-10 text-[7px] font-mono font-black text-white/40 uppercase tracking-widest">
              LIVE_RADAR_MAP
            </div>
            <GreenhouseMap minimap={true} />
          </div>
        )}

        {/* --- TOMBOL KELUAR (Hanya saat Remote) --- */}
        {isRemoteApp && (
          <Button 
            onClick={() => setMode("autonomous")}
            variant="ghost" 
            className="absolute top-4 left-4 z-50 text-white bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/20"
          >
            <X className="w-4 h-4 mr-2" /> EXIT REMOTE
          </Button>
        )}

        {/* --- TOMBOL DOKUMENTASI (Pojok Kanan Atas) --- */}
        <div className="absolute top-4 right-4 flex flex-col gap-3 z-40">
          <Button onClick={() => capturePest("photo")} size="icon" className="h-12 w-12 rounded-full shadow-2xl border-2 border-white/20 bg-white/10 backdrop-blur-md hover:bg-primary text-white transition-all active:scale-90"><Camera className="w-6 h-6" /></Button>
          <Button onClick={() => capturePest("video")} size="icon" className="h-12 w-12 rounded-full shadow-2xl border-2 border-white/20 bg-white/10 backdrop-blur-md hover:bg-destructive text-white transition-all active:scale-90"><Circle className={`w-4 h-4 fill-current ${state.robot_status === "alert" ? "text-destructive animate-ping" : "text-white"}`} /></Button>
        </div>

        {/* Cam Placeholder */}
        <div className="text-center opacity-40 pointer-events-none z-0">
          <Video className="w-16 h-16 mx-auto mb-2 opacity-20 text-white" />
          <p className="text-[10px] font-mono text-white/50 tracking-[0.3em] uppercase font-bold">Awaiting Digital Twin Pov..</p>
        </div>

        {/* --- DUAL STICK CONTROLLERS (Mobile Optimized) --- */}
        {isRemoteApp && (
          <div className="absolute inset-0 p-8 flex items-end justify-between pointer-events-none z-30">
            
            {/* STICK KIRI (Gerak) - Sekarang Bersih dari Minimap! */}
            <div className="grid grid-cols-3 gap-2 bg-black/60 backdrop-blur-xl p-3 rounded-full border-2 border-white/20 pointer-events-auto scale-110 sm:scale-150 shadow-2xl">
              <div /><Button onClick={() => moveManual("forward")} size="icon" variant="ghost" className="h-10 w-10 text-white active:bg-primary"><ChevronUp className="w-6 h-6" /></Button><div />
              <Button onClick={() => moveManual("strafe_left")} size="icon" variant="ghost" className="h-10 w-10 text-white active:bg-primary"><ChevronLeft className="w-6 h-6" /></Button>
              <div className="flex items-center justify-center opacity-40 text-white"><ArrowLeftRight className="w-4 h-4" /></div>
              <Button onClick={() => moveManual("strafe_right")} size="icon" variant="ghost" className="h-10 w-10 text-white active:bg-primary"><ChevronRight className="w-6 h-6" /></Button>
              <div /><Button onClick={() => moveManual("backward")} size="icon" variant="ghost" className="h-10 w-10 text-white active:bg-primary"><ChevronDown className="w-6 h-6" /></Button><div />
            </div>

            {/* STICK KANAN (Rotasi) */}
            <div className="grid grid-cols-3 gap-2 bg-black/60 backdrop-blur-xl p-3 rounded-full border-2 border-white/20 pointer-events-auto scale-110 sm:scale-150 shadow-2xl">
              <div /><Button onClick={() => moveManual("tilt_up")} size="icon" variant="ghost" className="h-10 w-10 text-white active:bg-primary"><ChevronUp className="w-6 h-6" /></Button><div />
              <Button onClick={() => moveManual("rotate_left")} size="icon" variant="ghost" className="h-10 w-10 text-white active:bg-primary"><RotateCcw className="w-5 h-5" /></Button>
              <div className="flex items-center justify-center"><div className="w-3 h-3 bg-primary rounded-full shadow-[0_0_15px_hsl(var(--primary))] animate-pulse" /></div>
              <Button onClick={() => moveManual("rotate_right")} size="icon" variant="ghost" className="h-10 w-10 text-white active:bg-primary"><RotateCw className="w-5 h-5" /></Button>
              <div /><Button onClick={() => moveManual("tilt_down")} size="icon" variant="ghost" className="h-10 w-10 text-white active:bg-primary"><ChevronDown className="w-6 h-6" /></Button><div />
            </div>
          </div>
        )}

        {/* HUD Scan Effect */}
        <div className="absolute inset-0 pointer-events-none border-[1px] border-primary/10 overflow-hidden z-20">
          <div className="absolute w-full h-[1px] bg-primary/30 top-0 shadow-[0_0_10px_rgba(34,197,94,0.4)]" style={{ animation: "scan 4s linear infinite" }} />
        </div>
      </div>
    </div>
  );
};

export default LiveFeed;