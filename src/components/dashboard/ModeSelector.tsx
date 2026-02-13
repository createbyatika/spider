import { useRobot } from "@/contexts/RobotContext";
import { Bot, Gamepad2, Smartphone } from "lucide-react";

const modes = [
  { key: "autonomous" as const, label: "AUTONOMOUS", icon: Bot },
  { key: "manual_remote" as const, label: "MANUAL REMOTE", icon: Gamepad2 },
  { key: "remote_app" as const, label: "REMOTE APP", icon: Smartphone },
];

const ModeSelector = () => {
  const { state, setMode } = useRobot();

  return (
    <div className="rounded-xl border bg-card p-4 space-y-3">
      <h3 className="text-sm font-semibold">Operation Mode</h3>
      <div className="grid grid-cols-3 gap-2">
        {modes.map(({ key, label, icon: Icon }) => {
          const active = state.operation_mode === key;
          return (
            <button
              key={key}
              onClick={() => setMode(key)}
              className={`flex flex-col items-center gap-2 p-3 rounded-lg text-xs font-mono font-medium transition-all ${
                active
                  ? "bg-primary text-primary-foreground glow-green-strong"
                  : "bg-muted text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="leading-tight text-center">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ModeSelector;
