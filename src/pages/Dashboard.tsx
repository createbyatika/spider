import { useAuth } from "@/contexts/AuthContext";
import { RobotProvider, useRobot } from "@/contexts/RobotContext";
import GreenhouseMap from "@/components/dashboard/GreenhouseMap";
import TelemetryCards from "@/components/dashboard/TelemetryCards";
import ModeSelector from "@/components/dashboard/ModeSelector";
import LiveFeed from "@/components/dashboard/LiveFeed";
import StatusBar from "@/components/dashboard/StatusBar";
import EnvironmentalCharts from "@/components/dashboard/EnvironmentalCharts"; 
import { Bug, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

const DashboardContent = () => {
  const { user, signOut } = useAuth();
  const { state } = useRobot();
  const isRemoteApp = state.operation_mode === "remote_app";

  return (
    <div className={`min-h-screen spidr-tech-bg-light text-foreground selection:bg-primary/20 ${isRemoteApp ? "h-screen overflow-hidden touch-none" : ""}`}>
      {/* Header hanya muncul di Dashboard Utama */}
      <header className={`border-b bg-white/60 backdrop-blur-md sticky top-0 z-10 ${isRemoteApp ? "hidden sm:flex" : "flex"}`}>
        <div className="container flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
              <Bug className="w-4 h-4 text-primary" />
            </div>
            <span className="font-mono font-bold text-sm tracking-wider text-primary">SPIDR</span>
          </div>
          <div className="flex items-center gap-4">
            <StatusBar />
            <span className="text-xs text-muted-foreground hidden sm:inline border-l pl-4 font-medium">{user?.email}</span>
            <Button variant="ghost" size="icon" onClick={signOut} className="h-8 w-8 hover:bg-destructive/10"><LogOut className="w-4 h-4" /></Button>
          </div>
        </div>
      </header>

      <main className={`container px-4 py-6 space-y-6 max-w-6xl ${isRemoteApp ? "p-0 max-w-none m-0" : ""}`}>
        {!isRemoteApp ? (
          <>
            <TelemetryCards />
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="glass-card rounded-xl shadow-sm"><GreenhouseMap /></div>
                <div className="glass-card rounded-xl shadow-sm"><EnvironmentalCharts /></div>
              </div>
              <div className="space-y-6">
                <div className="glass-card rounded-xl shadow-sm"><ModeSelector /></div>
                <div className="glass-card rounded-xl shadow-sm"><LiveFeed /></div>
              </div>
            </div>
          </>
        ) : (
          <div className="h-full w-full"><LiveFeed /></div>
        )}
      </main>
    </div>
  );
};

const Dashboard = () => (
  <RobotProvider>
    <DashboardContent />
  </RobotProvider>
);

export default Dashboard;