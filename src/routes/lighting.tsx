import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Lightbulb, Moon, Sun, Zap, Eye } from "lucide-react";
import { GlassCard } from "../components/GlassCard";

export const Route = createFileRoute("/lighting")({
  component: LightingPage,
  head: () => ({
    meta: [
      { title: "Smart Lighting Control – Smart Pole" },
      { name: "description", content: "Control smart pole lighting with auto mode, motion detection, and brightness adjustment." },
    ],
  }),
});

function LightingPage() {
  const [lightOn, setLightOn] = useState(true);
  const [autoMode, setAutoMode] = useState(false);
  const [isNight, setIsNight] = useState(false);
  const [motionLevel, setMotionLevel] = useState(30);
  const [brightness, setBrightness] = useState(70);

  useEffect(() => {
    if (autoMode) {
      const interval = setInterval(() => setIsNight((p) => !p), 5000);
      return () => clearInterval(interval);
    }
  }, [autoMode]);

  useEffect(() => {
    if (autoMode) {
      setLightOn(isNight);
      setBrightness(isNight ? 90 : 20);
    }
  }, [isNight, autoMode]);

  useEffect(() => {
    if (motionLevel > 70) {
      setBrightness(100);
      toast("⚡ Motion detected — brightness maxed!");
    }
  }, [motionLevel]);

  const effectiveBrightness = lightOn ? brightness : 0;

  return (
    <div className="p-4 md:p-6 space-y-6 min-h-screen">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold neon-text-violet">Smart Lighting Control</h1>
        <p className="text-sm text-muted-foreground mt-1">Intelligent illumination management</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pole Visual */}
        <GlassCard className="flex items-center justify-center min-h-[400px]" glowColor="violet">
          <div className="relative flex flex-col items-center">
            {/* Light glow effect */}
            <motion.div
              animate={{
                opacity: effectiveBrightness / 100,
                scale: 0.8 + (effectiveBrightness / 100) * 0.6,
              }}
              className="absolute -top-10 w-40 h-40 rounded-full"
              style={{
                background: `radial-gradient(circle, oklch(0.85 0.15 90 / ${effectiveBrightness}%) 0%, transparent 70%)`,
              }}
            />

            {/* Pole */}
            <div className="relative z-10 flex flex-col items-center">
              {/* Lamp head */}
              <motion.div
                animate={{ opacity: effectiveBrightness > 0 ? 1 : 0.3 }}
                className="w-16 h-6 rounded-t-full"
                style={{
                  background: effectiveBrightness > 0
                    ? `oklch(0.9 0.15 90 / ${effectiveBrightness}%)`
                    : "oklch(0.3 0.02 260)",
                  boxShadow: effectiveBrightness > 0
                    ? `0 0 ${effectiveBrightness / 2}px oklch(0.85 0.15 90 / ${effectiveBrightness}%)`
                    : "none",
                }}
              />
              {/* Pole body */}
              <div className="w-3 h-48 bg-gradient-to-b from-muted-foreground/50 to-muted-foreground/20 rounded-b-sm" />
              <div className="w-10 h-2 rounded-full bg-muted-foreground/30" />
            </div>

            {/* Status text */}
            <motion.p
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className={`mt-6 text-sm font-bold tracking-widest ${lightOn ? "neon-text-green" : "neon-text-red"}`}
            >
              {lightOn ? "● ACTIVE" : "○ OFF"}
            </motion.p>
            <p className="text-xs text-muted-foreground mt-1">Brightness: {effectiveBrightness}%</p>
          </div>
        </GlassCard>

        {/* Controls */}
        <div className="space-y-4">
          {/* Power Toggle */}
          <GlassCard glowColor={lightOn ? "green" : undefined}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Lightbulb className={lightOn ? "text-neon-green" : "text-muted-foreground"} size={22} />
                <div>
                  <p className="font-semibold">Power</p>
                  <p className="text-xs text-muted-foreground">{lightOn ? "Light is ON" : "Light is OFF"}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setLightOn((p) => !p);
                  setAutoMode(false);
                  toast(lightOn ? "Light turned OFF" : "Light turned ON");
                }}
                className={`w-14 h-7 rounded-full relative transition-all duration-300 ${
                  lightOn ? "bg-neon-green/30 neon-glow-green" : "bg-muted"
                }`}
              >
                <motion.div
                  animate={{ x: lightOn ? 28 : 2 }}
                  className={`absolute top-1 w-5 h-5 rounded-full ${lightOn ? "bg-neon-green" : "bg-muted-foreground"}`}
                />
              </button>
            </div>
          </GlassCard>

          {/* Auto Mode */}
          <GlassCard glowColor={autoMode ? "blue" : undefined}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isNight ? <Moon className="text-neon-blue" size={22} /> : <Sun className="text-neon-violet" size={22} />}
                <div>
                  <p className="font-semibold">Auto Mode (LDR)</p>
                  <p className="text-xs text-muted-foreground">
                    {autoMode ? (isNight ? "Night detected — lights ON" : "Day detected — lights dimmed") : "Manual control active"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setAutoMode((p) => !p);
                  toast(autoMode ? "Auto mode disabled" : "Auto mode enabled");
                }}
                className={`w-14 h-7 rounded-full relative transition-all duration-300 ${
                  autoMode ? "bg-neon-blue/30 neon-glow-blue" : "bg-muted"
                }`}
              >
                <motion.div
                  animate={{ x: autoMode ? 28 : 2 }}
                  className={`absolute top-1 w-5 h-5 rounded-full ${autoMode ? "bg-neon-blue" : "bg-muted-foreground"}`}
                />
              </button>
            </div>
          </GlassCard>

          {/* Motion Detection Slider */}
          <GlassCard>
            <div className="flex items-center gap-3 mb-3">
              <Eye className="text-neon-cyan" size={22} />
              <div>
                <p className="font-semibold">PIR Motion Simulation</p>
                <p className="text-xs text-muted-foreground">Slide to simulate motion intensity</p>
              </div>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={motionLevel}
              onChange={(e) => setMotionLevel(Number(e.target.value))}
              className="w-full accent-neon-cyan h-2 rounded-full appearance-none bg-muted cursor-pointer"
            />
            <div className="flex justify-between mt-1 text-xs text-muted-foreground">
              <span>None</span>
              <span className={motionLevel > 70 ? "neon-text-red" : ""}>{motionLevel}%</span>
              <span>High</span>
            </div>
          </GlassCard>

          {/* Brightness Slider */}
          <GlassCard>
            <div className="flex items-center gap-3 mb-3">
              <Zap className="text-neon-violet" size={22} />
              <div>
                <p className="font-semibold">Brightness Control</p>
                <p className="text-xs text-muted-foreground">Adjust output intensity</p>
              </div>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={brightness}
              onChange={(e) => setBrightness(Number(e.target.value))}
              disabled={autoMode}
              className="w-full accent-neon-violet h-2 rounded-full appearance-none bg-muted cursor-pointer disabled:opacity-40"
            />
            <div className="flex justify-between mt-1 text-xs text-muted-foreground">
              <span>0%</span>
              <span>{brightness}%</span>
              <span>100%</span>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
