import { createFileRoute } from "@tanstack/react-router";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Camera, ShieldAlert, AlertOctagon, Phone, Clock,
  Eye, UserX, ShoppingBag, CheckCircle,
} from "lucide-react";
import { GlassCard } from "../components/GlassCard";

export const Route = createFileRoute("/surveillance")({
  component: SurveillancePage,
  head: () => ({
    meta: [
      { title: "Surveillance & AI Safety – Smart Pole" },
      { name: "description", content: "AI-powered surveillance monitoring with threat detection and emergency SOS." },
    ],
  }),
});

type ThreatLevel = "normal" | "suspicious" | "theft";

const threatConfig = {
  normal: { label: "Normal", color: "neon-text-green", bg: "bg-neon-green/10", icon: CheckCircle },
  suspicious: { label: "Suspicious Activity", color: "neon-text-violet", bg: "bg-neon-violet/10", icon: Eye },
  theft: { label: "Theft Detected!", color: "neon-text-red", bg: "bg-neon-red/10", icon: UserX },
};

interface EventLog {
  id: string;
  time: Date;
  event: string;
  severity: "low" | "medium" | "high";
}

function SurveillancePage() {
  const [threatLevel, setThreatLevel] = useState<ThreatLevel>("normal");
  const [redFlash, setRedFlash] = useState(false);
  const [sosActive, setSosActive] = useState(false);
  const [events, setEvents] = useState<EventLog[]>([
    { id: "1", time: new Date(), event: "System initialized", severity: "low" },
  ]);

  const addEvent = useCallback((event: string, severity: EventLog["severity"]) => {
    setEvents((prev) => [
      { id: crypto.randomUUID(), time: new Date(), event, severity },
      ...prev,
    ].slice(0, 30));
  }, []);

  const simulateThreat = () => {
    setThreatLevel("suspicious");
    addEvent("Suspicious activity detected by AI", "medium");
    toast.warning("⚠️ Suspicious activity detected!");

    setTimeout(() => {
      setThreatLevel("theft");
      setRedFlash(true);
      addEvent("THEFT DETECTED — Alerting authorities", "high");
      toast.error("🚨 THEFT DETECTED! Authorities notified.");

      setTimeout(() => {
        setRedFlash(false);
        setThreatLevel("normal");
        addEvent("Situation resolved — returning to normal", "low");
      }, 4000);
    }, 2000);
  };

  const triggerSOS = () => {
    setSosActive(true);
    addEvent("🆘 SOS EMERGENCY ACTIVATED", "high");
    toast.error("🆘 SOS Emergency Signal Sent!");

    setTimeout(() => {
      setSosActive(false);
      addEvent("SOS signal acknowledged by dispatch", "medium");
    }, 5000);
  };

  const severityColors = {
    low: "text-neon-green",
    medium: "text-neon-violet",
    high: "text-neon-red",
  };

  const tc = threatConfig[threatLevel];
  const ThreatIcon = tc.icon;

  return (
    <div className={`p-4 md:p-6 space-y-6 min-h-screen relative ${redFlash ? "animate-pulse" : ""}`}>
      {/* Red flash overlay */}
      <AnimatePresence>
        {redFlash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.15, 0, 0.15, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, repeat: Infinity }}
            className="fixed inset-0 bg-neon-red z-30 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* SOS overlay */}
      <AnimatePresence>
        {sosActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="text-center"
            >
              <Phone className="mx-auto text-neon-red mb-4" size={64} />
              <p className="text-3xl font-bold neon-text-red">SOS ACTIVE</p>
              <p className="text-muted-foreground mt-2">Emergency signal broadcasting...</p>
              <motion.div
                className="mt-4 mx-auto w-24 h-1 rounded-full bg-neon-red/30 overflow-hidden"
              >
                <motion.div
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-full h-full bg-neon-red"
                />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div>
        <h1 className="text-2xl md:text-3xl font-bold neon-text-blue">Surveillance & AI Safety</h1>
        <p className="text-sm text-muted-foreground mt-1">AI-powered threat detection & emergency response</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Camera Feed */}
        <div className="lg:col-span-2 space-y-4">
          <GlassCard glowColor={threatLevel === "theft" ? "red" : "blue"} animate={false}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Camera size={18} className="text-neon-blue" />
                <span className="text-sm font-semibold">Camera Feed — Pole #001</span>
              </div>
              <span className="text-[10px] text-neon-green font-mono">● LIVE</span>
            </div>
            <div className="relative h-56 md:h-72 rounded-lg overflow-hidden bg-surface">
              {/* Simulated camera feed */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Camera size={48} className="mx-auto text-muted-foreground/30" />
                  <p className="text-xs text-muted-foreground mt-2">Live Video Feed</p>
                </div>
              </div>
              {/* Scanner line */}
              <motion.div
                animate={{ y: ["0%", "100%", "0%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-neon-blue to-transparent opacity-50"
              />
              {/* Timestamp overlay */}
              <div className="absolute bottom-2 left-3 text-[10px] font-mono text-muted-foreground">
                {new Date().toLocaleString()} | CAM-001
              </div>
            </div>
          </GlassCard>

          {/* AI Detection Panel */}
          <GlassCard animate={false}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">AI Detection Status</h3>
              <button
                onClick={simulateThreat}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-neon-red/20 text-neon-red hover:bg-neon-red/30 transition-colors"
              >
                <ShieldAlert size={14} className="inline mr-1" />
                Simulate Threat
              </button>
            </div>
            <motion.div
              key={threatLevel}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`flex items-center gap-3 p-4 rounded-lg ${tc.bg}`}
            >
              <ThreatIcon className={tc.color} size={28} />
              <div>
                <p className={`font-bold text-lg ${tc.color}`}>{tc.label}</p>
                <p className="text-xs text-muted-foreground">AI confidence: {threatLevel === "normal" ? "98%" : threatLevel === "suspicious" ? "76%" : "92%"}</p>
              </div>
            </motion.div>
          </GlassCard>
        </div>

        {/* Right Panel */}
        <div className="space-y-4">
          {/* SOS Button */}
          <GlassCard>
            <div className="text-center py-4">
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-4">Emergency</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={triggerSOS}
                className="sos-button w-28 h-28 rounded-full text-lg mx-auto flex items-center justify-center"
              >
                <div>
                  <AlertOctagon size={32} className="mx-auto mb-1" />
                  <span className="text-sm">SOS</span>
                </div>
              </motion.button>
              <p className="text-[10px] text-muted-foreground mt-3">Press to broadcast emergency signal</p>
            </div>
          </GlassCard>

          {/* Event Timeline */}
          <GlassCard animate={false} className="max-h-[350px] flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <Clock size={16} className="text-muted-foreground" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Event Timeline</h3>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              <AnimatePresence initial={false}>
                {events.map((evt) => (
                  <motion.div
                    key={evt.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-2 p-2 rounded-md bg-surface/50 text-xs"
                  >
                    <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                      evt.severity === "high" ? "bg-neon-red" : evt.severity === "medium" ? "bg-neon-violet" : "bg-neon-green"
                    }`} />
                    <div>
                      <p className={`${severityColors[evt.severity]}`}>{evt.event}</p>
                      <p className="text-muted-foreground">{evt.time.toLocaleTimeString()}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
