interface SimpleMetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  color?: "red" | "yellow" | "green" | "blue";
  onClick?: () => void;
}

export function SimpleMetricCard({ title, value, subtitle, color = "blue", onClick }: SimpleMetricCardProps) {
  const colorClasses = {
    red: "text-red-400",
    yellow: "text-yellow-400", 
    green: "text-green-400",
    blue: "text-blue-400"
  };

  return (
    <div 
      className={`bg-card p-6 rounded-lg border ${onClick ? 'cursor-pointer hover:bg-muted/20 transition-colors' : ''}`}
      onClick={onClick}
    >
      <p className="text-sm text-muted-foreground mb-2">{title}</p>
      <p className={`text-3xl font-bold ${colorClasses[color]}`}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
      {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
    </div>
  );
}
