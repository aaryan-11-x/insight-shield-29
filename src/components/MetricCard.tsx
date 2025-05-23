
import { useEffect, useState } from "react";

interface MetricCardProps {
  title: string;
  value: number;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
  color?: "default" | "critical" | "warning" | "success";
}

export function MetricCard({ title, value, subtitle, trend, color = "default" }: MetricCardProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayValue(value);
    }, 200);
    return () => clearTimeout(timer);
  }, [value]);

  const colorClasses = {
    default: "text-foreground",
    critical: "text-red-400",
    warning: "text-yellow-400",
    success: "text-green-400",
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  return (
    <div className="metric-card">
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className="flex items-center gap-2">
          <p className={`text-3xl font-bold ${colorClasses[color]} animate-count-up`}>
            {formatNumber(displayValue)}
          </p>
          {trend && (
            <div className={`text-sm px-2 py-1 rounded-full ${
              trend === "up" ? "bg-red-500/20 text-red-400" :
              trend === "down" ? "bg-green-500/20 text-green-400" :
              "bg-gray-500/20 text-gray-400"
            }`}>
              {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"}
            </div>
          )}
        </div>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
