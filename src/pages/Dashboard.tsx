import { useAuth } from "@/contexts/AuthContext";
import { RobotProvider } from "@/contexts/RobotContext";
import GreenhouseMap from "@/components/dashboard/GreenhouseMap";
import TelemetryCards from "@/components/dashboard/TelemetryCards";
import ModeSelector from "@/components/dashboard/ModeSelector";
import LiveFeed from "@/components/dashboard/LiveFeed";
import StatusBar from "@/components/dashboard/StatusBar";
import EnvironmentalCharts from "@/components/dashboard/EnvironmentalCharts"; 
import { Bug, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const { user, signOut } = useAuth();

  return (
    <RobotProvider>
      {/* Menggunakan class 'spidr-tech-bg-light' untuk latar belakang grid yang cerah */}
      <div className="min-h-screen spidr-tech-bg-light text-foreground selection:bg-primary/20">
        {/* Header dengan efek Glassmorphism (semi-transparan) */}
        <header className="border-b bg-white/60 backdrop-blur-md sticky top-0 z-10">
          <div className="container flex items-center justify-between h-14 px-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                <Bug className="w-4 h-4 text-primary" />
              </div>
              <span className="font-mono font-bold text-sm tracking-wider text-primary">SPIDR</span>
            </div>
            <div className="flex items-center gap-4">
              <StatusBar />
              <span className="text-xs text-muted-foreground hidden sm:inline border-l pl-4 font-medium">
                {user?.email}
              </span>
              <Button variant="ghost" size="icon" onClick={signOut} className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive transition-colors">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container px-4 py-6 space-y-6 max-w-6xl">
          {/* Section Telemetri Utama */}
          <TelemetryCards />

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Kolom Kiri: Peta dan Grafik Lingkungan */}
            <div className="space-y-6">
              {/* Menambahkan efek glass-card agar pola background grid terlihat sedikit */}
              <div className="glass-card rounded-xl shadow-sm">
                <GreenhouseMap />
              </div>
              <div className="glass-card rounded-xl shadow-sm">
                <EnvironmentalCharts /> 
              </div>
            </div>

            {/* Kolom Kanan: Mode dan Live Feed */}
            <div className="space-y-6">
              <div className="glass-card rounded-xl shadow-sm">
                <ModeSelector />
              </div>
              <div className="glass-card rounded-xl shadow-sm">
                <LiveFeed />
              </div>
            </div>
          </div>
        </main>
      </div>
    </RobotProvider>
  );
};

export default Dashboard;