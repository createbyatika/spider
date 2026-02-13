import { 
  Video, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, 
  RotateCcw, RotateCw, ArrowLeftRight, Camera, Target, 
  ShieldAlert, Circle // PASTIKAN DUA INI ADA
} from "lucide-react";
import { useRobot } from "@/contexts/RobotContext";
import { Button } from "@/components/ui/button";

const LiveFeed = () => {
  const { state, moveManual, capturePest } = useRobot();
  const isRemoteApp = state.operation_mode === "remote_app";

  return (
    <div className="rounded-xl border bg-card p-4 space-y-3 relative overflow-hidden shadow-lg border-primary/20">
      {/* Header Live Feed */}
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
          <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
        </div>
      </div>

      {/* WADAH VIDEO: Dibuat gelap permanen agar HUD selalu terlihat */}
      <div className="relative w-full bg-slate-950 rounded-lg overflow-hidden flex items-center justify-center border-2 border-primary/10" style={{ aspectRatio: "16/9" }}>
        
        {/* GRADIENT OVERLAY: Membuat area bawah lebih gelap agar tombol makin menonjol */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30 pointer-events-none z-10" />

        {/* --- TOMBOL DOKUMENTASI (Pojok Kanan Atas - Ukuran Diperbesar) --- */}
        <div className="absolute top-4 right-4 flex flex-col gap-3 z-40">
          <Button 
            onClick={() => capturePest("photo")}
            size="icon"
            className="h-12 w-12 rounded-full shadow-2xl border-2 border-white/20 bg-white/10 backdrop-blur-md hover:bg-primary text-white transition-all active:scale-90"
          >
            <Camera className="w-6 h-6" />
          </Button>
          <Button 
            onClick={() => capturePest("video")}
            size="icon"
            className="h-12 w-12 rounded-full shadow-2xl border-2 border-white/20 bg-white/10 backdrop-blur-md hover:bg-destructive text-white transition-all active:scale-90"
          >
            <Circle className={`w-4 h-4 fill-current ${state.robot_status === "alert" ? "text-destructive animate-ping" : "text-white"}`} />
          </Button>
        </div>

        {/* Cam Placeholder */}
        <div className="text-center opacity-40 pointer-events-none z-0">
          <Video className="w-12 h-12 mx-auto mb-2 opacity-20 text-white" />
          <p className="text-[10px] font-mono text-white/50 tracking-[0.2em]">AWAITING DIGITAL TWIN CONNECTION..</p>
        </div>

        {/* --- DUAL STICK CONTROLLERS (Mobile Optimized) --- */}
        {isRemoteApp && (
          <div className="absolute inset-0 p-4 sm:p-8 flex items-end justify-between pointer-events-none z-30">
            
            {/* STICK KIRI: Movement (Wadah dipertegas warnanya) */}
            <div className="grid grid-cols-3 gap-2 bg-black/60 backdrop-blur-xl p-3 rounded-full border-2 border-white/20 pointer-events-auto scale-110 sm:scale-125 shadow-2xl transition-transform">
              <div />
              <Button onClick={() => moveManual("forward")} size="icon" variant="ghost" className="h-10 w-10 rounded-full text-white hover:bg-primary/40 active:bg-primary"><ChevronUp className="w-6 h-6" /></Button>
              <div />
              <Button onClick={() => moveManual("strafe_left")} size="icon" variant="ghost" className="h-10 w-10 rounded-full text-white hover:bg-primary/40 active:bg-primary"><ChevronLeft className="w-6 h-6" /></Button>
              <div className="flex items-center justify-center opacity-50 text-white"><ArrowLeftRight className="w-4 h-4" /></div>
              <Button onClick={() => moveManual("strafe_right")} size="icon" variant="ghost" className="h-10 w-10 rounded-full text-white hover:bg-primary/40 active:bg-primary"><ChevronRight className="w-6 h-6" /></Button>
              <div />
              <Button onClick={() => moveManual("backward")} size="icon" variant="ghost" className="h-10 w-10 rounded-full text-white hover:bg-primary/40 active:bg-primary"><ChevronDown className="w-6 h-6" /></Button>
              <div />
            </div>

            {/* STICK KANAN: Rotation & Action */}
            <div className="grid grid-cols-3 gap-2 bg-black/60 backdrop-blur-xl p-3 rounded-full border-2 border-white/20 pointer-events-auto scale-110 sm:scale-125 shadow-2xl transition-transform">
              <div />
              <Button onClick={() => moveManual("tilt_up")} size="icon" variant="ghost" className="h-10 w-10 rounded-full text-white hover:bg-primary/40 active:bg-primary"><ChevronUp className="w-6 h-6" /></Button>
              <div />
              <Button onClick={() => moveManual("rotate_left")} size="icon" variant="ghost" className="h-10 w-10 rounded-full text-white hover:bg-primary/40 active:bg-primary"><RotateCcw className="w-5 h-5" /></Button>
              <div className="flex items-center justify-center">
                <div className="w-3 h-3 bg-primary rounded-full shadow-[0_0_15px_hsl(var(--primary))] animate-pulse" />
              </div>
              <Button onClick={() => moveManual("rotate_right")} size="icon" variant="ghost" className="h-10 w-10 rounded-full text-white hover:bg-primary/40 active:bg-primary"><RotateCw className="w-5 h-5" /></Button>
              <div />
              <Button onClick={() => moveManual("tilt_down")} size="icon" variant="ghost" className="h-10 w-10 rounded-full text-white hover:bg-primary/40 active:bg-primary"><ChevronDown className="w-6 h-6" /></Button>
              <div />
            </div>

          </div>
        )}

        {/* HUD Scan Effect: Diperjelas garisnya */}
        <div className="absolute inset-0 pointer-events-none border-[1px] border-primary/30 overflow-hidden z-20">
          <div className="absolute w-full h-[1.5px] bg-primary/40 top-0 shadow-[0_0_8px_hsl(var(--primary))]" style={{ animation: "scan 4s linear infinite" }} />
        </div>
      </div>
    </div>
  );
};

export default LiveFeed;