import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { GlassCard } from "../components/GlassCard";
import { TrendingUp, TrendingDown, Clock } from "lucide-react";

export const Route = createFileRoute("/analytics")({
  component: AnalyticsPage,
  head: () => ({
    meta: [
      { title: "Environment Analytics – Smart Pole" },
      { name: "description", content: "Environmental data trends and analytics for smart city monitoring." },
    ],
  }),
});

const randomBetween = (min: number, max: number) =>
  Math.round((Math.random() * (max - min) + min) * 10) / 10;

function generateData(points: number, hourly: boolean) {
  return Array.from({ length: points }, (_, i) => ({
    label: hourly ? `${i.toString().padStart(2, "0")}:00` : `Day ${i + 1}`,
    temp: randomBetween(22, 38),
    aqi: randomBetween(30, 95),
    humidity: randomBetween(40, 85),
    noise: randomBetween(20, 75),
    pm25: randomBetween(10, 80),
  }));
}

const tooltipStyle = {
  background: "oklch(0.17 0.02 260)",
  border: "1px solid oklch(0.3 0.03 260 / 50%)",
  borderRadius: 8,
  color: "oklch(0.93 0.01 250)",
};

function AnalyticsPage() {
  const [view, setView] = useState<"hourly" | "daily">("hourly");
  const [data, setData] = useState(() => generateData(24, true));

  useEffect(() => {
    setData(generateData(view === "hourly" ? 24 : 14, view === "hourly"));
  }, [view]);

  const avgTemp = (data.reduce((s, d) => s + d.temp, 0) / data.length).toFixed(1);
  const avgAqi = Math.round(data.reduce((s, d) => s + d.aqi, 0) / data.length);
  const maxNoise = Math.max(...data.map((d) => d.noise));

  return (
    <div className="p-4 md:p-6 space-y-6 min-h-screen">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold neon-text-green">Environment Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">Historical trends & environmental data</p>
        </div>
        <div className="flex items-center gap-1 p-1 rounded-lg glass-card">
          {(["hourly", "daily"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
                view === v ? "bg-neon-blue/20 text-neon-blue" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Clock size={12} className="inline mr-1" />
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <GlassCard glowColor="blue">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Avg Temperature</p>
          <p className="text-3xl font-bold neon-text-blue mt-1">{avgTemp}°C</p>
          <p className="text-xs text-neon-green mt-1 flex items-center gap-1">
            <TrendingUp size={12} /> Normal range
          </p>
        </GlassCard>
        <GlassCard glowColor="green">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Avg Air Quality</p>
          <p className={`text-3xl font-bold mt-1 ${avgAqi > 70 ? "neon-text-green" : "neon-text-red"}`}>{avgAqi} AQI</p>
          <p className={`text-xs mt-1 flex items-center gap-1 ${avgAqi > 70 ? "text-neon-green" : "text-neon-red"}`}>
            {avgAqi > 70 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {avgAqi > 70 ? "Good" : "Needs attention"}
          </p>
        </GlassCard>
        <GlassCard glowColor="violet">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Peak Noise</p>
          <p className="text-3xl font-bold neon-text-violet mt-1">{maxNoise} dB</p>
          <p className="text-xs text-muted-foreground mt-1">Measured today</p>
        </GlassCard>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <GlassCard animate={false}>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Temperature Trends</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="aTempGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.7 0.2 250)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="oklch(0.7 0.2 250)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0.03 260 / 30%)" />
              <XAxis dataKey="label" stroke="oklch(0.5 0.03 260)" fontSize={10} />
              <YAxis stroke="oklch(0.5 0.03 260)" fontSize={10} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="temp" stroke="oklch(0.7 0.2 250)" fill="url(#aTempGrad)" strokeWidth={2} name="Temp °C" />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard animate={false}>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Air Quality (PM2.5)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0.03 260 / 30%)" />
              <XAxis dataKey="label" stroke="oklch(0.5 0.03 260)" fontSize={10} />
              <YAxis stroke="oklch(0.5 0.03 260)" fontSize={10} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="pm25" fill="oklch(0.75 0.22 150)" radius={[4, 4, 0, 0]} name="PM2.5" />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard animate={false}>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Humidity Levels</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0.03 260 / 30%)" />
              <XAxis dataKey="label" stroke="oklch(0.5 0.03 260)" fontSize={10} />
              <YAxis stroke="oklch(0.5 0.03 260)" fontSize={10} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="humidity" stroke="oklch(0.78 0.15 200)" strokeWidth={2} dot={false} name="Humidity %" />
            </LineChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard animate={false}>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Noise Levels</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0.03 260 / 30%)" />
              <XAxis dataKey="label" stroke="oklch(0.5 0.03 260)" fontSize={10} />
              <YAxis stroke="oklch(0.5 0.03 260)" fontSize={10} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="noise" fill="oklch(0.65 0.25 290)" radius={[4, 4, 0, 0]} name="Noise dB" />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>
    </div>
  );
}
