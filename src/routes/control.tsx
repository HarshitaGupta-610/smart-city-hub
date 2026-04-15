import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  AlertOctagon, Bell, Volume2, RotateCcw, Wifi, WifiOff,
  Cpu, HardDrive, Thermometer, Battery, Server,
} from "lucide-react";
import { GlassCard } from "../components/GlassCard";

export const Route = createFileRoute("/control")({
  component: ControlPage,
  head: () => ({
    meta: [
      { title: "Control Center – Smart Pole" },
      { name: "description", content: "Central control panel for Smart Pole system management." },
    ],
  }),
});

function ControlPage() {
  const [buzzerActive, setBuzzerActive] = useState(false);
  const [connected, setConnected] = useState(true);

  const controlActions = [
    {
      label: "Trigger SOS",
      icon: AlertOctagon,
      color: "neon-text-red",
      bgClass: "bg-neon-red/10 hover:bg-neon-red/20",
      glowClass: "hover:neon-glow-red",
      action: () => toast.error("🆘 SOS Signal Broadcasted!"),
    },
    {
      label: "Activate Buzzer",
      icon: Volume2,
      color: "neon-text-violet",
      bgClass: "bg-neon-violet/10 hover:bg-neon-violet/20",
      glowClass: "hover:neon-glow-violet",
      action: () => {
        setBuzzerActive(true);
        toast.warning("🔊 Buzzer Activated!");
        setTimeout(() => setBuzzerActive(false), 3000);
      },
    },
    {
      label: "Send Alert",
      icon: Bell,
      color: "neon-text-blue",
      bgClass: "bg-neon-blue/10 hover:bg-neon-blue/20",
      glowClass: "hover:neon-glow-blue",
      action: () => toast.info("📡 Alert sent to all connected devices"),
    },
    {
      label: "Reset System",
      icon: RotateCcw,
      color: "neon-text-green",
      bgClass: "bg-neon-green/10 hover:bg-neon-green/20",
      glowClass: "hover:neon-glow-green",
      action: () => toast.success("🔄 System reset complete"),
    },
  ];

  const healthMetrics = [
    { label: "CPU Usage", value: "23%", icon: Cpu, status: "good" },
    { label: "Memory", value: "512 MB", icon: HardDrive, status: "good" },
    { label: "Temperature", value: "42°C", icon: Thermometer, status: "warning" },
    { label: "Battery", value: "87%", icon: Battery, status: "good" },
    { label: "Uptime", value: "72h 14m", icon: Server, status: "good" },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6 min-h-screen">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold neon-text-blue">Control Center</h1>
        <p className="text-sm text-muted-foreground mt-1">System commands & diagnostics</p>
      </div>

      {/* Buzzer overlay */}
      {buzzerActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.1, 0, 0.1, 0] }}
          transition={{ duration: 0.3, repeat: Infinity }}
          className="fixed inset-0 bg-neon-violet z-30 pointer-events-none"
        />
      )}

      {/* Control Buttons */}
      <GlassCard animate={false}>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {controlActions.map((action) => (
            <motion.button
              key={action.label}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={action.action}
              className={`flex flex-col items-center gap-3 p-6 rounded-xl transition-all ${action.bgClass} ${action.glowClass}`}
            >
              <action.icon className={action.color} size={32} />
              <span className={`text-sm font-semibold ${action.color}`}>{action.label}</span>
            </motion.button>
          ))}
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Connection Status */}
        <GlassCard glowColor={connected ? "green" : "red"}>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Connection Status</h3>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {connected ? (
                <Wifi className="text-neon-green" size={28} />
              ) : (
                <WifiOff className="text-neon-red" size={28} />
              )}
              <div>
                <p className={`text-lg font-bold ${connected ? "status-online" : "status-offline"}`}>
                  {connected ? "CONNECTED" : "DISCONNECTED"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {connected ? "MQTT Broker: mqtt.smartpole.io:1883" : "Attempting reconnection..."}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setConnected((p) => !p);
                toast(connected ? "Disconnected from broker" : "Reconnected to broker");
              }}
              className="px-3 py-1.5 text-xs rounded-lg glass-card text-foreground"
            >
              {connected ? "Disconnect" : "Reconnect"}
            </button>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between p-2 rounded-md bg-surface/50">
              <span className="text-muted-foreground">Protocol</span>
              <span className="font-mono">MQTT v3.1.1</span>
            </div>
            <div className="flex justify-between p-2 rounded-md bg-surface/50">
              <span className="text-muted-foreground">Topic</span>
              <span className="font-mono">smartpole/001/#</span>
            </div>
            <div className="flex justify-between p-2 rounded-md bg-surface/50">
              <span className="text-muted-foreground">Last Ping</span>
              <span className="font-mono">{new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </GlassCard>

        {/* System Health */}
        <GlassCard>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">System Health</h3>
          <div className="space-y-3">
            {healthMetrics.map((metric) => (
              <div key={metric.label} className="flex items-center gap-3 p-3 rounded-lg bg-surface/50">
                <metric.icon
                  size={20}
                  className={metric.status === "warning" ? "text-neon-violet" : "text-neon-green"}
                />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="text-sm">{metric.label}</span>
                    <span className={`text-sm font-mono font-semibold ${
                      metric.status === "warning" ? "neon-text-violet" : "neon-text-green"
                    }`}>{metric.value}</span>
                  </div>
                  <div className="mt-1 h-1 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${parseInt(metric.value) || 50}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className={`h-full rounded-full ${
                        metric.status === "warning" ? "bg-neon-violet" : "bg-neon-green"
                      }`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
