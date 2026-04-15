import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Cpu, Cloud, Monitor, Radio, Shield, Eye, Lightbulb,
  Thermometer, ArrowRight, Globe, Building, Lock,
} from "lucide-react";
import { GlassCard } from "../components/GlassCard";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "Architecture & About – Smart Pole" },
      { name: "description", content: "System architecture and real-world applications of the Smart Pole platform." },
    ],
  }),
});

const pipeline = [
  { label: "Sensors", sublabel: "DHT22, MQ-135, PIR, LDR", icon: Thermometer, color: "neon-text-green" },
  { label: "Raspberry Pi", sublabel: "Edge Processing", icon: Cpu, color: "neon-text-violet" },
  { label: "MQTT Broker", sublabel: "Real-time Messaging", icon: Radio, color: "neon-text-blue" },
  { label: "Cloud Server", sublabel: "Data Processing & AI", icon: Cloud, color: "neon-text-cyan" },
  { label: "Dashboard", sublabel: "Monitoring & Control", icon: Monitor, color: "neon-text-blue" },
];

const features = [
  { title: "AI-Powered Surveillance", description: "Real-time threat detection using computer vision and deep learning models.", icon: Eye, color: "neon-text-blue" },
  { title: "Smart Adaptive Lighting", description: "Energy-efficient lighting that responds to ambient conditions and human presence.", icon: Lightbulb, color: "neon-text-green" },
  { title: "Environmental Monitoring", description: "Continuous air quality, noise, and temperature tracking for urban health.", icon: Thermometer, color: "neon-text-violet" },
  { title: "Emergency Response", description: "One-touch SOS with GPS location, auto-alerting authorities and activating alarms.", icon: Shield, color: "neon-text-red" },
];

const applications = [
  { title: "Crime Prevention", description: "24/7 AI surveillance deters criminal activity and enables rapid response.", icon: Lock },
  { title: "Smart City Infrastructure", description: "Scalable IoT backbone for next-gen urban development.", icon: Building },
  { title: "Public Safety", description: "Emergency SOS, noise monitoring, and real-time alerts protect citizens.", icon: Shield },
  { title: "Environmental Protection", description: "Air quality monitoring drives policy decisions and public awareness.", icon: Globe },
];

function AboutPage() {
  return (
    <div className="p-4 md:p-6 space-y-8 min-h-screen">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold neon-text-blue">Architecture & About</h1>
        <p className="text-sm text-muted-foreground mt-1">System design, data flow, and real-world impact</p>
      </div>

      {/* Pipeline */}
      <GlassCard animate={false} glowColor="blue">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-6">Data Pipeline</h3>
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-0">
          {pipeline.map((step, i) => (
            <div key={step.label} className="flex items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                className="flex flex-col items-center text-center px-4 py-3"
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center bg-surface-elevated border border-border mb-2 ${step.color}`}>
                  <step.icon size={24} />
                </div>
                <p className={`text-sm font-bold ${step.color}`}>{step.label}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{step.sublabel}</p>
              </motion.div>
              {i < pipeline.length - 1 && (
                <ArrowRight className="text-muted-foreground mx-1 flex-shrink-0 hidden md:block" size={20} />
              )}
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Features */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Core Features</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((f, i) => (
            <GlassCard key={f.title}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-3"
              >
                <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center bg-surface-elevated ${f.color}`}>
                  <f.icon size={20} />
                </div>
                <div>
                  <p className="font-semibold">{f.title}</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{f.description}</p>
                </div>
              </motion.div>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Applications */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Real-World Applications</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {applications.map((app, i) => (
            <GlassCard key={app.title} glowColor="blue">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <app.icon size={28} className="mx-auto text-neon-blue mb-3" />
                <p className="font-semibold text-sm">{app.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{app.description}</p>
              </motion.div>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Tech Stack */}
      <GlassCard animate={false}>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Technology Stack</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {["React + TypeScript", "Tailwind CSS", "Framer Motion", "Recharts", "MQTT Protocol", "Raspberry Pi", "Python (AI/ML)", "Cloud IoT"].map((tech) => (
            <div key={tech} className="text-center py-3 px-2 rounded-lg bg-surface/50 border border-border text-xs font-mono text-muted-foreground hover:text-foreground hover:border-neon-blue/30 transition-all">
              {tech}
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
