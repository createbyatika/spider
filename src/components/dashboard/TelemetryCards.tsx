import { useRobot } from "@/contexts/RobotContext";
import { Thermometer, Droplets, Leaf, Bug } from "lucide-react";

interface TelemetryCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
  status?: "normal" | "warning" | "critical";
}

const TelemetryCard = ({ icon, label, value, unit, status = "normal" }: TelemetryCardProps) => (
  <div className={`rounded-xl border bg-card p-4 space-y-2 transition-colors ${
    status === "warning" ? "border-warning/30" : status === "critical" ? "border-destructive/30" : ""
  }`}>
    <div className="flex items-center gap-2 text-muted-foreground">
      {icon}
      <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
    </div>
    <div className="flex items-baseline gap-1">
      <span className="text-2xl font-bold font-mono">{value}</span>
      <span className="text-sm text-muted-foreground">{unit}</span>
    </div>
  </div>
);

const TelemetryCards = () => {
  const { state } = useRobot();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <TelemetryCard
        icon={<Thermometer className="w-4 h-4" />}
        label="Temperature"
        value={state.environmental_data.temperature.toFixed(1)}
        unit="°C"
        status={state.environmental_data.temperature > 30 ? "warning" : "normal"}
      />
      <TelemetryCard
        icon={<Droplets className="w-4 h-4" />}
        label="Humidity"
        value={state.environmental_data.humidity.toString()}
        unit="%"
      />
      <TelemetryCard
        icon={<Leaf className="w-4 h-4" />}
        label={`${state.plant_type} Health`}
        value={state.plant_health.toString()}
        unit="%"
        status={state.plant_health < 60 ? "warning" : "normal"}
      />
      <TelemetryCard
        icon={<Bug className="w-4 h-4" />}
        label="Pests Detected"
        value={state.detected_pest_count.toString()}
        unit="found"
        status={state.detected_pest_count > 5 ? "critical" : state.detected_pest_count > 0 ? "warning" : "normal"}
      />
    </div>
  );
};

export default TelemetryCards;
