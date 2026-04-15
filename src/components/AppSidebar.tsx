import { Link, useLocation } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Lightbulb,
  ShieldAlert,
  BarChart3,
  Settings2,
  Cpu,
  Info,
  Radio,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Live Dashboard" },
  { to: "/lighting", icon: Lightbulb, label: "Smart Lighting" },
  { to: "/surveillance", icon: ShieldAlert, label: "Surveillance & AI" },
  { to: "/analytics", icon: BarChart3, label: "Analytics" },
  { to: "/control", icon: Settings2, label: "Control Center" },
  { to: "/visual", icon: Cpu, label: "Smart Pole 3D" },
  { to: "/about", icon: Info, label: "Architecture" },
] as const;

export function AppSidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setCollapsed((p) => !p)}
        className="fixed top-4 left-4 z-50 md:hidden glass-card p-2"
      >
        {collapsed ? <X size={20} /> : <Menu size={20} />}
      </button>

      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 64 : 240 }}
        className={`fixed top-0 left-0 z-40 h-screen flex flex-col border-r border-border bg-sidebar overflow-hidden
          max-md:${collapsed ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
        style={{ willChange: "width" }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-border min-h-[72px]">
          <div className="relative flex-shrink-0">
            <Radio className="text-neon-blue" size={24} />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-neon-green animate-glow-pulse" />
          </div>
          {!collapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-hidden">
              <h1 className="text-sm font-bold tracking-wider neon-text-blue">SMART POLE</h1>
              <p className="text-[10px] text-muted-foreground tracking-widest">CONTROL SYSTEM</p>
            </motion.div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <Link key={item.to} to={item.to}>
                <motion.div
                  className={`sidebar-nav-item ${isActive ? "sidebar-nav-item-active" : ""}`}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <item.icon size={18} className={isActive ? "text-neon-blue" : ""} />
                  {!collapsed && <span>{item.label}</span>}
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-indicator"
                      className="absolute left-0 top-0 bottom-0 w-[3px] rounded-full bg-neon-blue"
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Collapse toggle (desktop) */}
        <button
          onClick={() => setCollapsed((p) => !p)}
          className="hidden md:flex items-center justify-center py-3 border-t border-border text-muted-foreground hover:text-foreground transition-colors"
        >
          <Menu size={18} />
        </button>
      </motion.aside>
    </>
  );
}
