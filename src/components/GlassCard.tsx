import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: "blue" | "violet" | "green" | "red";
  animate?: boolean;
}

const glowClasses = {
  blue: "neon-glow-blue",
  violet: "neon-glow-violet",
  green: "neon-glow-green",
  red: "neon-glow-red",
};

export function GlassCard({ children, className = "", glowColor, animate = true }: GlassCardProps) {
  const Component = animate ? motion.div : "div";
  const props = animate
    ? {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4 },
        whileHover: { scale: 1.01 },
      }
    : {};

  return (
    <Component
      className={`glass-card p-5 ${glowColor ? glowClasses[glowColor] : ""} ${className}`}
      {...(props as any)}
    >
      {children}
    </Component>
  );
}
