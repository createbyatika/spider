import { useRobot } from "@/contexts/RobotContext";

const EnvironmentalCharts = () => {
  const { state } = useRobot();
  return (
    <div className="rounded-xl border bg-card p-4 space-y-4">
      <div className="flex items-center justify-between text-xs font-mono">
        <h3 className="font-semibold uppercase">Environmental Trends (Live)</h3>
        <span className="text-primary animate-pulse tracking-tighter">● MONITORING ACTIVE</span>
      </div>
      <div className="h-24 flex items-end gap-1.5 px-1 border-b border-l border-muted">
        {[...Array(15)].map((_, i) => (
          <div 
            key={i} 
            className="bg-primary/20 w-full rounded-t-sm transition-all duration-700" 
            style={{ height: `${Math.random() * 65 + 15}%` }} 
          />
        ))}
      </div>
      <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
        <span>History (1h)</span>
        <span className="font-bold">Current Node: {state.current_path_node} ({state.environmental_data.temperature}°C)</span>
      </div>
    </div>
  );
};
export default EnvironmentalCharts;