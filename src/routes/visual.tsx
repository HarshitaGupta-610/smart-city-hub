import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Camera, Radio, Lightbulb, AlertOctagon, Thermometer, Wind, Mic } from "lucide-react";
import { GlassCard } from "../components/GlassCard";

export const Route = createFileRoute("/visual")({
  component: VisualPage,
  head: () => ({
    meta: [
      { title: "Smart Pole 3D Visual – Smart Pole" },
      { name: "description", content: "Interactive visual diagram of the Smart Pole and its components." },
    ],
  }),
});

interface PoleComponent {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  yPosition: number;
  color: string;
}

const poleComponents: PoleComponent[] = [
  { id: "camera", label: "HD Camera", description: "360° surveillance camera with night vision, AI-powered threat detection and facial recognition.", icon: Camera, yPosition: 5, color: "neon-text-blue" },
  { id: "antenna", label: "Communication Antenna", description: "4G/5G + LoRa antenna for real-time data transmission to the cloud via MQTT.", icon: Radio, yPosition: 18, color: "neon-text-violet" },
  { id: "light", label: "Smart LED Light", description: "Adaptive LED lighting with LDR sensor for auto day/night switching and PIR motion-triggered brightness.", icon: Lightbulb, yPosition: 32, color: "neon-text-green" },
  { id: "env-sensor", label: "Environmental Sensors", description: "DHT22 temperature & humidity sensor, MQ-135 air quality sensor, and noise level microphone.", icon: Thermometer, yPosition: 50, color: "neon-text-cyan" },
  { id: "air", label: "Air Quality Module", description: "Real-time PM2.5 and PM10 particle monitoring with AQI calculation.", icon: Wind, yPosition: 63, color: "neon-text-green" },
  { id: "mic", label: "Noise Sensor", description: "Ambient noise level monitoring with threshold alerting for public safety.", icon: Mic, yPosition: 73, color: "neon-text-violet" },
  { id: "sos", label: "SOS Button", description: "Physical emergency button that triggers alarm, sends GPS location, and alerts nearest responders.", icon: AlertOctagon, yPosition: 85, color: "neon-text-red" },
];

function VisualPage() {
  const [activeComponent, setActiveComponent] = useState<string | null>(null);
  const active = poleComponents.find((c) => c.id === activeComponent);

  return (
    <div className="p-4 md:p-6 space-y-6 min-h-screen">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold neon-text-blue">Smart Pole Visual</h1>
        <p className="text-sm text-muted-foreground mt-1">Interactive component explorer</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pole Illustration */}
        <GlassCard className="lg:col-span-2 flex items-center justify-center min-h-[600px] relative" glowColor="blue" animate={false}>
          <div className="relative h-[520px] w-full max-w-md mx-auto">
            {/* Pole body */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-8 w-4 bg-gradient-to-b from-muted-foreground/40 to-muted-foreground/15 rounded-full" />
            {/* Base */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-20 h-3 rounded-full bg-muted-foreground/20" />

            {/* Components */}
            {poleComponents.map((comp) => {
              const isActive = activeComponent === comp.id;
              return (
                <motion.div
                  key={comp.id}
                  className="absolute left-1/2 cursor-pointer"
                  style={{ top: `${comp.yPosition}%` }}
                  whileHover={{ scale: 1.2 }}
                  onHoverStart={() => setActiveComponent(comp.id)}
                  onHoverEnd={() => setActiveComponent(null)}
                  onClick={() => setActiveComponent(isActive ? null : comp.id)}
                >
                  <motion.div
                    animate={isActive ? { scale: [1, 1.3, 1] } : {}}
                    transition={{ duration: 0.5, repeat: isActive ? Infinity : 0 }}
                    className={`relative -translate-x-1/2 flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                      isActive
                        ? `border-current ${comp.color} neon-glow-blue bg-surface-elevated`
                        : "border-muted-foreground/30 bg-surface text-muted-foreground"
                    }`}
                  >
                    <comp.icon size={18} />
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="absolute left-14 whitespace-nowrap z-10"
                      >
                        <div className="glass-card px-3 py-2 text-xs">
                          <p className={`font-bold ${comp.color}`}>{comp.label}</p>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </GlassCard>

        {/* Component Details */}
        <div className="space-y-4">
          <GlassCard>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Component Details
            </h3>
            {active ? (
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className={`flex items-center gap-3 mb-3 ${active.color}`}>
                  <active.icon size={28} />
                  <p className="text-lg font-bold">{active.label}</p>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{active.description}</p>
              </motion.div>
            ) : (
              <p className="text-sm text-muted-foreground">Hover over a component on the pole to see details.</p>
            )}
          </GlassCard>

          {/* Component list */}
          <GlassCard animate={false}>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">All Components</h3>
            <div className="space-y-2">
              {poleComponents.map((comp) => (
                <motion.div
                  key={comp.id}
                  whileHover={{ x: 4 }}
                  onHoverStart={() => setActiveComponent(comp.id)}
                  onHoverEnd={() => setActiveComponent(null)}
                  className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors ${
                    activeComponent === comp.id ? "bg-surface-elevated" : "hover:bg-surface/50"
                  }`}
                >
                  <comp.icon size={16} className={activeComponent === comp.id ? comp.color : "text-muted-foreground"} />
                  <span className={`text-sm ${activeComponent === comp.id ? comp.color : ""}`}>{comp.label}</span>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
