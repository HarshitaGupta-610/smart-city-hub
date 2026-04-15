import { useState, useEffect, useCallback, useRef } from "react";

export interface SensorData {
  temperature: number;
  humidity: number;
  airQuality: number;
  lightLevel: number;
  motionDetected: boolean;
  noiseLevel: number;
}

export interface AlertLog {
  id: string;
  timestamp: Date;
  message: string;
  type: "info" | "warning" | "danger" | "success";
}

const randomBetween = (min: number, max: number) =>
  Math.round((Math.random() * (max - min) + min) * 10) / 10;

const alertMessages: { message: string; type: AlertLog["type"] }[] = [
  { message: "Motion detected near Pole #3", type: "warning" },
  { message: "Air quality dropped below threshold", type: "danger" },
  { message: "Light sensor adjusted to night mode", type: "info" },
  { message: "Temperature spike detected", type: "warning" },
  { message: "System health check passed", type: "success" },
  { message: "Camera feed reconnected", type: "info" },
  { message: "Noise level exceeded limit", type: "warning" },
  { message: "Perimeter breach detected", type: "danger" },
  { message: "Battery backup activated", type: "info" },
  { message: "Firmware update available", type: "info" },
];

export function useSimulation(enabled: boolean = true) {
  const [sensorData, setSensorData] = useState<SensorData>({
    temperature: 28.5,
    humidity: 65,
    airQuality: 72,
    lightLevel: 45,
    motionDetected: false,
    noiseLevel: 35,
  });

  const [alerts, setAlerts] = useState<AlertLog[]>([]);
  const [isOnline, setIsOnline] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const generateData = useCallback(() => {
    setSensorData({
      temperature: randomBetween(22, 38),
      humidity: randomBetween(40, 85),
      airQuality: randomBetween(30, 95),
      lightLevel: randomBetween(0, 100),
      motionDetected: Math.random() > 0.6,
      noiseLevel: randomBetween(20, 80),
    });

    if (Math.random() > 0.5) {
      const alert = alertMessages[Math.floor(Math.random() * alertMessages.length)];
      const newAlert: AlertLog = {
        id: crypto.randomUUID(),
        timestamp: new Date(),
        ...alert,
      };
      setAlerts((prev) => [newAlert, ...prev].slice(0, 50));
    }
  }, []);

  useEffect(() => {
    if (enabled && isOnline) {
      generateData();
      intervalRef.current = setInterval(generateData, 2500);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [enabled, isOnline, generateData]);

  const toggleOnline = () => setIsOnline((p) => !p);

  const addAlert = useCallback((message: string, type: AlertLog["type"] = "danger") => {
    setAlerts((prev) => [
      { id: crypto.randomUUID(), timestamp: new Date(), message, type },
      ...prev,
    ].slice(0, 50));
  }, []);

  return { sensorData, alerts, isOnline, toggleOnline, addAlert, generateData };
}

export function useChartData() {
  const [data, setData] = useState<{ time: string; temp: number; aqi: number; noise: number }[]>([]);

  useEffect(() => {
    const initial = Array.from({ length: 12 }, (_, i) => ({
      time: `${(i * 2).toString().padStart(2, "0")}:00`,
      temp: randomBetween(22, 36),
      aqi: randomBetween(30, 90),
      noise: randomBetween(20, 70),
    }));
    setData(initial);

    const interval = setInterval(() => {
      setData((prev) => {
        const newPoint = {
          time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
          temp: randomBetween(22, 36),
          aqi: randomBetween(30, 90),
          noise: randomBetween(20, 70),
        };
        return [...prev.slice(1), newPoint];
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return data;
}
