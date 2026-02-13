import React, { useState } from "react";
import { 
  Video, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, 
  RotateCcw, RotateCw, ArrowLeftRight, Camera, Target, 
  ShieldAlert, Circle, X, GripHorizontal 
} from "lucide-react";
import { useRobot } from "@/contexts/RobotContext";
import { Button } from "@/components/ui/button";
import GreenhouseMap from "./GreenhouseMap"; 

const LiveFeed = () => {
  const { state, moveManual, capturePest, setMode } = useRobot();
  const isRemoteApp = state.operation_mode === "remote_app";

  // LOGIKA GESER RADAR
  const [radarPos, setRadarPos] = useState({ x: 20, y: 80 });
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    setRadarPos({
      x: Math.max(10, Math.min(clientX - 60, window.innerWidth - 160)),
      y: Math.max(10, Math.min(clientY - 40, window.innerHeight - 110))
    });
  };

  return (
    <div 
      onMouseMove={handleDrag} onTouchMove={handleDrag}
      onMouseUp={() => setIsDragging(false)} onTouchEnd={() => setIsDragging(false)}
      className={`relative overflow-hidden transition-all duration-500 ${
        isRemoteApp ? "fixed inset-0 z-50 bg-black h-[100dvh] w-screen" : "rounded-xl border bg-card p-4 space-y-3 shadow-lg border-primary/20"
      }`}
    >
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

      {/* AREA POV */}
      <div className={`relative w-full bg-slate-950 flex items-center justify-center overflow-hidden ${
        isRemoteApp ? "h-full" : "rounded-lg border-2 border-primary/10 aspect-video"
      }`}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none z-10" />

        {/* RADAR DRAGGABLE */}
        {isRemoteApp && (
          <div 
            style={{ left: `${radarPos.x}px`, top: `${radarPos.y}px` }}
            className="absolute w-36 sm:w-56 aspect-[4/3] z-40 rounded-xl border-2 border-white/20 bg-black/60 backdrop-blur-xl overflow-hidden shadow-2xl transition-shadow active:scale-95 cursor-move"
          >
            <div onMouseDown={() => setIsDragging(true)} onTouchStart={() => setIsDragging(true)} className="absolute top-0 inset-x-0 h-6 bg-white/10 flex items-center justify-center z-50 active:bg-white/20">
              <GripHorizontal className="w-4 h-4 text-white/40" />
            </div>
            <div className="absolute top-1 left-2 z-10 text-[7px] font-mono font-black text-white/30 uppercase tracking-widest">Live Radar Map</div>
            <GreenhouseMap minimap={true} />
          </div>
        )}

        {/* Tombol Exit */}
        {isRemoteApp && (
          <Button onClick={() => setMode("autonomous")} variant="ghost" className="absolute top-4 left-4 z-50 text-white bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/20">
            <X className="w-4 h-4 mr-2" /> EXIT REMOTE
          </Button>
        )}

        {/* --- JOYSTICK: PERBAIKAN POSISI AGAR TIDAK TERPOTONG --- */}
        {isRemoteApp && (
          <div className="absolute inset-x-0 bottom-12 p-4 sm:p-10 flex items-end justify-between pointer-events-none z-30">
            
            {/* JOYSTICK KIRI (Dibuat Full Circle) */}
            <div className="grid grid-cols-3 gap-1 bg-black/60 backdrop-blur-xl p-3 rounded-full border-2 border-white/10 pointer-events-auto shadow-2xl scale-100">
              <div />
              <Button onClick={() => moveManual("forward")} size="icon" variant="ghost" className="h-9 w-9 text-white active:bg-primary"><ChevronUp className="w-5 h-5" /></Button>
              <div />
              <Button onClick={() => moveManual("strafe_left")} size="icon" variant="ghost" className="h-9 w-9 text-white active:bg-primary"><ChevronLeft className="w-5 h-5" /></Button>
              <div className="flex items-center justify-center opacity-30 text-white"><ArrowLeftRight className="w-3 h-3" /></div>
              <Button onClick={() => moveManual("strafe_right")} size="icon" variant="ghost" className="h-9 w-9 text-white active:bg-primary"><ChevronRight className="w-5 h-5" /></Button>
              <div />
              <Button onClick={() => moveManual("backward")} size="icon" variant="ghost" className="h-9 w-9 text-white active:bg-primary"><ChevronDown className="w-5 h-5" /></Button>
              <div />
            </div>

            {/* JOYSTICK KANAN (Dibuat Full Circle) */}
            <div className="grid grid-cols-3 gap-1 bg-black/60 backdrop-blur-xl p-3 rounded-full border-2 border-white/10 pointer-events-auto shadow-2xl scale-100">
              <div />
              <Button onClick={() => moveManual("tilt_up")} size="icon" variant="ghost" className="h-9 w-9 text-white active:bg-primary"><ChevronUp className="w-5 h-5" /></Button>
              <div />
              <Button onClick={() => moveManual("rotate_left")} size="icon" variant="ghost" className="h-9 w-9 text-white active:bg-primary"><RotateCcw className="w-4 h-4" /></Button>
              <div className="flex items-center justify-center"><div className="w-2 h-2 bg-primary rounded-full shadow-[0_0_10px_hsl(var(--primary))] animate-pulse" /></div>
              <Button onClick={() => moveManual("rotate_right")} size="icon" variant="ghost" className="h-9 w-9 text-white active:bg-primary"><RotateCw className="w-4 h-4" /></Button>
              <div />
              <Button onClick={() => moveManual("tilt_down")} size="icon" variant="ghost" className="h-9 w-9 text-white active:bg-primary"><ChevronDown className="w-5 h-5" /></Button>
              <div />
            </div>
          </div>
        )}

        <div className="absolute inset-0 pointer-events-none border-[1px] border-primary/10 overflow-hidden z-20">
          <div className="absolute w-full h-[1px] bg-primary/20 top-0" style={{ animation: "scan 4s linear infinite" }} />
        </div>
      </div>
    </div>
  );
};

export default LiveFeed;