import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Thermometer, Wind, Sun, Activity, Wifi, WifiOff,
  AlertTriangle, CheckCircle, Info, Bell,
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart,
} from "recharts";
import { GlassCard } from "../components/GlassCard";
import { useSimulation, useChartData } from "../hooks/useSimulation";

export const Route = createFileRoute("/")({
  component: DashboardPage,
  head: () => ({
    meta: [
      { title: "Live Dashboard – Smart Pole" },
      { name: "description", content: "Real-time monitoring dashboard for Smart Pole community safety system." },
    ],
  }),
});

function DashboardPage() {
  const [simulationMode, setSimulationMode] = useState(true);
  const { sensorData, alerts, isOnline, toggleOnline, addAlert } = useSimulation(simulationMode);
  const chartData = useChartData();

  const sensorCards = [
    {
      label: "Temperature",
      value: `${sensorData.temperature}°C`,
      icon: Thermometer,
      glow: "blue" as const,
      color: sensorData.temperature > 35 ? "neon-text-red" : "neon-text-blue",
    },
    {
      label: "Air Quality",
      value: `${sensorData.airQuality} AQI`,
      icon: Wind,
      glow: sensorData.airQuality < 50 ? ("red" as const) : ("green" as const),
      color: sensorData.airQuality < 50 ? "neon-text-red" : "neon-text-green",
    },
    {
      label: "Light Level",
      value: `${sensorData.lightLevel}%`,
      icon: Sun,
      glow: "violet" as const,
      color: "neon-text-violet",
    },
    {
      label: "Motion",
      value: sensorData.motionDetected ? "DETECTED" : "Clear",
      icon: Activity,
      glow: sensorData.motionDetected ? ("red" as const) : ("green" as const),
      color: sensorData.motionDetected ? "neon-text-red" : "neon-text-green",
    },
  ];

  const alertIcons = {
    info: Info,
    warning: AlertTriangle,
    danger: Bell,
    success: CheckCircle,
  };

  const alertColors = {
    info: "text-neon-cyan",
    warning: "text-neon-violet",
    danger: "text-neon-red",
    success: "text-neon-green",
  };

  return (
    <div className="p-4 md:p-6 space-y-6 min-h-screen">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold neon-text-blue">Live Command Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Real-time monitoring & control</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Online status */}
          <button
            onClick={() => {
              toggleOnline();
              toast(isOnline ? "System going offline" : "System back online");
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg glass-card text-sm font-medium transition-all ${
              isOnline ? "status-online" : "status-offline"
            }`}
          >
            {isOnline ? <Wifi size={16} /> : <WifiOff size={16} />}
            {isOnline ? "ONLINE" : "OFFLINE"}
          </button>

          {/* Mode toggle */}
          <button
            onClick={() => {
              setSimulationMode((p) => !p);
              toast(simulationMode ? "Switched to Manual Mode" : "Switched to Simulation Mode");
            }}
            className="px-4 py-2 rounded-lg glass-card text-sm font-medium text-foreground hover:neon-glow-blue transition-all"
          >
            {simulationMode ? "⚡ Simulation" : "🔧 Manual"}
          </button>
        </div>
      </div>

      {/* Sensor Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {sensorCards.map((card, i) => (
          <GlassCard key={card.label} glowColor={card.glow}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start justify-between"
            >
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">{card.label}</p>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={card.value}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className={`text-2xl font-bold mt-1 ${card.color}`}
                  >
                    {card.value}
                  </motion.p>
                </AnimatePresence>
              </div>
              <card.icon className={`${card.color} opacity-60`} size={28} />
            </motion.div>
          </GlassCard>
        ))}
      </div>

      {/* Charts + Live Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Charts */}
        <div className="lg:col-span-2 space-y-4">
          <GlassCard animate={false}>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Temperature & AQI Trends</h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.7 0.2 250)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="oklch(0.7 0.2 250)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="aqiGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.75 0.22 150)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="oklch(0.75 0.22 150)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0.03 260 / 30%)" />
                <XAxis dataKey="time" stroke="oklch(0.5 0.03 260)" fontSize={11} />
                <YAxis stroke="oklch(0.5 0.03 260)" fontSize={11} />
                <Tooltip contentStyle={{ background: "oklch(0.17 0.02 260)", border: "1px solid oklch(0.3 0.03 260 / 50%)", borderRadius: 8, color: "oklch(0.93 0.01 250)" }} />
                <Area type="monotone" dataKey="temp" stroke="oklch(0.7 0.2 250)" fill="url(#tempGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="aqi" stroke="oklch(0.75 0.22 150)" fill="url(#aqiGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </GlassCard>

          <GlassCard animate={false}>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Noise Level Distribution</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0.03 260 / 30%)" />
                <XAxis dataKey="time" stroke="oklch(0.5 0.03 260)" fontSize={11} />
                <YAxis stroke="oklch(0.5 0.03 260)" fontSize={11} />
                <Tooltip contentStyle={{ background: "oklch(0.17 0.02 260)", border: "1px solid oklch(0.3 0.03 260 / 50%)", borderRadius: 8, color: "oklch(0.93 0.01 250)" }} />
                <Bar dataKey="noise" fill="oklch(0.65 0.25 290)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </GlassCard>
        </div>

        {/* Live Alerts Log */}
        <GlassCard animate={false} className="max-h-[480px] flex flex-col">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Live Activity Log</h3>
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            <AnimatePresence initial={false}>
              {alerts.map((alert) => {
                const Icon = alertIcons[alert.type];
                return (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: -20, height: 0 }}
                    animate={{ opacity: 1, x: 0, height: "auto" }}
                    exit={{ opacity: 0, x: 20, height: 0 }}
                    className="flex items-start gap-2 p-2 rounded-md bg-surface/50 text-xs"
                  >
                    <Icon size={14} className={`flex-shrink-0 mt-0.5 ${alertColors[alert.type]}`} />
                    <div className="min-w-0">
                      <p className="text-foreground leading-tight">{alert.message}</p>
                      <p className="text-muted-foreground mt-0.5">
                        {alert.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            {alerts.length === 0 && (
              <p className="text-muted-foreground text-xs text-center py-8">Waiting for alerts...</p>
            )}
          </div>
        </GlassCard>
      </div>

      {/* Map Section */}
      <GlassCard animate={false} glowColor="blue">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Smart Pole Location</h3>
        <div className="relative h-48 rounded-lg overflow-hidden bg-surface">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `
              linear-gradient(oklch(0.3 0.03 260 / 30%) 1px, transparent 1px),
              linear-gradient(90deg, oklch(0.3 0.03 260 / 30%) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }} />
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="relative">
              <div className="w-4 h-4 rounded-full bg-neon-blue" />
              <div className="absolute inset-0 w-4 h-4 rounded-full bg-neon-blue animate-ping opacity-40" />
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] neon-text-blue font-semibold whitespace-nowrap">
                POLE #001
              </span>
            </div>
          </motion.div>
          <div className="absolute bottom-3 right-3 text-[10px] text-muted-foreground font-mono">
            LAT: 28.6139 | LNG: 77.2090
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
