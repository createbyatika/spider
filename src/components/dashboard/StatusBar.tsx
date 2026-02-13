import { useRobot } from "@/contexts/RobotContext";
import { Battery, Clock, Activity } from "lucide-react";

const StatusBar = () => {
  const { state } = useRobot();

  const statusColor = {
    idle: "text-muted-foreground",
    patrolling: "text-primary",
    charging: "text-warning",
    alert: "text-destructive",
    manual: "text-secondary-foreground",
  }[state.robot_status];

  const batteryColor = state.battery_level > 50 ? "text-primary" : state.battery_level > 20 ? "text-warning" : "text-destructive";

  return (
    <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
      <div className="flex items-center gap-1.5">
        <Activity className={`w-3.5 h-3.5 ${statusColor}`} />
        <span className={statusColor}>{state.robot_status.toUpperCase()}</span>
      </div>
      <div className={`flex items-center gap-1.5 ${batteryColor}`}>
        <Battery className="w-3.5 h-3.5" />
        <span>{state.battery_level}%</span>
      </div>
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <Clock className="w-3.5 h-3.5" />
        <span>{state.uptime_hours}h uptime</span>
      </div>
    </div>
  );
};

export default StatusBar;
