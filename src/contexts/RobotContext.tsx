import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { toast } from "sonner";

export interface EnvironmentalData {
  temperature: number;
  humidity: number;
  soil_moisture: number;
}

export interface RobotState {
  robot_status: "idle" | "patrolling" | "charging" | "alert" | "manual";
  battery_level: number;
  current_path_node: number;
  total_path_nodes: number;
  detected_pest_count: number;
  environmental_data: EnvironmentalData;
  operation_mode: "autonomous" | "manual_remote" | "remote_app";
  plant_health: number;
  plant_type: string;
  uptime_hours: number;
  last_scan_time: string;
}

interface RobotContextType {
  state: RobotState;
  setState: React.Dispatch<React.SetStateAction<RobotState>>;
  setMode: (mode: RobotState["operation_mode"]) => void;
  moveManual: (action: "forward" | "backward" | "strafe_left" | "strafe_right" | "rotate_left" | "rotate_right" | "tilt_up" | "tilt_down") => void;
  capturePest: (type: "photo" | "video") => void;
}

const defaultState: RobotState = {
  robot_status: "patrolling",
  battery_level: 78,
  current_path_node: 1,
  // DIPERBANYAK: Dari 18 menjadi 45 agar langkah robot di peta lebih rapat/kecil
  total_path_nodes: 45, 
  detected_pest_count: 3,
  environmental_data: { temperature: 24.5, humidity: 68, soil_moisture: 42 },
  operation_mode: "autonomous",
  plant_health: 87,
  plant_type: "Strawberry",
  uptime_hours: 12.5,
  last_scan_time: new Date().toISOString(),
};

const RobotContext = createContext<RobotContextType | undefined>(undefined);

export const RobotProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<RobotState>(defaultState);

  // --- LOGIKA SIMULASI OTOMATIS (DIGITAL SHADOW) ---
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (state.operation_mode === "autonomous") {
      interval = setInterval(() => {
        setState((prev) => {
          // Probabilitas deteksi hama saat scanning
          const pestFound = Math.random() > 0.96;
          if (pestFound) toast.warning("Potential Pest Detected during Scan!");

          return {
            ...prev,
            // Pergerakan 1 node setiap 3 detik agar tidak "ngebut"
            current_path_node: prev.current_path_node < prev.total_path_nodes ? prev.current_path_node + 1 : 1,
            environmental_data: {
              ...prev.environmental_data,
              temperature: +(prev.environmental_data.temperature + (Math.random() * 0.2 - 0.1)).toFixed(1),
              humidity: prev.environmental_data.humidity + Math.floor(Math.random() * 3 - 1),
            },
            battery_level: prev.battery_level > 0 ? +(prev.battery_level - 0.01).toFixed(2) : 0,
            detected_pest_count: pestFound ? prev.detected_pest_count + 1 : prev.detected_pest_count,
            // Update status ke patrolling jika sebelumnya alert
            robot_status: pestFound ? "alert" : "patrolling",
            last_scan_time: new Date().toISOString(),
          };
        });
      }, 3000); // DIPERLAMBAT: Dari 2 detik menjadi 3 detik per titik
    }
    return () => clearInterval(interval);
  }, [state.operation_mode]);

  const moveManual = (action: string) => {
    setState((prev) => {
      let nextNode = prev.current_path_node;
      // Logika manual disesuaikan dengan total 45 node
      if (action === "forward" && prev.current_path_node < prev.total_path_nodes) {
        nextNode = prev.current_path_node + 1;
      } else if (action === "backward" && prev.current_path_node > 1) {
        nextNode = prev.current_path_node - 1;
      }
      return { 
        ...prev, 
        current_path_node: nextNode, 
        robot_status: "manual", 
        last_scan_time: new Date().toISOString() 
      };
    });
  };

  const capturePest = (type: "photo" | "video") => {
    setState((prev) => ({
      ...prev,
      detected_pest_count: prev.detected_pest_count + 1,
      robot_status: "alert",
    }));

    if (type === "photo") {
      toast.success("Pest photo captured! Data synced with Node " + state.current_path_node);
    } else {
      toast.error("Recording started: Capturing pest movement...");
      setTimeout(() => {
        toast.success("Video documentation saved successfully.");
        setState(prev => ({ ...prev, robot_status: "manual" }));
      }, 3000);
    }
  };

  const setMode = (mode: RobotState["operation_mode"]) => {
    setState((prev) => ({
      ...prev,
      operation_mode: mode,
      robot_status: mode === "autonomous" ? "patrolling" : "manual",
    }));
  };

  return (
    <RobotContext.Provider value={{ state, setState, setMode, moveManual, capturePest }}>
      {children}
    </RobotContext.Provider>
  );
};

export const useRobot = () => {
  const ctx = useContext(RobotContext);
  if (!ctx) throw new Error("useRobot must be used within RobotProvider");
  return ctx;
};