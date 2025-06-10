
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ClickableMetricCardProps {
  title: string;
  value: number | string;
  color?: "default" | "success" | "warning" | "critical";
  trend?: "up" | "down";
  href?: string;
}

export function ClickableMetricCard({ 
  title, 
  value, 
  color = "default", 
  trend, 
  href 
}: ClickableMetricCardProps) {
  const navigate = useNavigate();

  const colorClasses = {
    default: "bg-card text-card-foreground",
    success: "bg-green-500/10 text-green-700 dark:text-green-400",
    warning: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
    critical: "bg-red-500/10 text-red-700 dark:text-red-400",
  };

  const handleClick = () => {
    if (href) {
      navigate(href);
    }
  };

  return (
    <Card 
      className={`p-6 ${colorClasses[color]} ${href ? 'cursor-pointer hover:bg-muted/50 transition-colors' : ''}`}
      onClick={handleClick}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold">{typeof value === 'number' ? value.toLocaleString() : value}</p>
        </div>
        {trend && (
          <div className="text-muted-foreground">
            {trend === "up" ? (
              <TrendingUp className="h-5 w-5" />
            ) : (
              <TrendingDown className="h-5 w-5" />
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
