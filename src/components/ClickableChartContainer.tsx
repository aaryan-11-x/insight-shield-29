
import { useNavigate } from "react-router-dom";

interface ClickableChartContainerProps {
  title: string;
  children: React.ReactNode;
  href?: string;
  className?: string;
}

export function ClickableChartContainer({ 
  title, 
  children, 
  href, 
  className = "" 
}: ClickableChartContainerProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (href) {
      navigate(href);
    }
  };

  return (
    <div 
      className={`chart-container ${href ? 'cursor-pointer hover:bg-muted/20 transition-colors' : ''} ${className}`}
      onClick={handleClick}
    >
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      {children}
    </div>
  );
}
