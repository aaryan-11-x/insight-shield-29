import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { SimpleMetricCard } from "@/components/SimpleMetricCard";

const uniqueSEoLComponents = [
  { pluginId: "172178", name: "ASP.NET Core SEoL", risk: "Critical", eolDuration: "nan", cve: "nan" },
  { pluginId: "172179", name: "Microsoft .NET Core SEoL", risk: "Critical", eolDuration: "nan", cve: "nan" },
  { pluginId: "182252", name: "Apache Log4j SEoL (<= 1.x)", risk: "Critical", eolDuration: "nan", cve: "nan" },
  { pluginId: "192813", name: "Microsoft Windows Server 2012 SEoL", risk: "Critical", eolDuration: "nan", cve: "nan" },
  { pluginId: "58134", name: "Microsoft Silverlight SEoL", risk: "High", eolDuration: "nan", cve: "nan" },
  { pluginId: "192782", name: "Microsoft Windows Server 2008 SEoL", risk: "High", eolDuration: "nan", cve: "nan" },
  { pluginId: "172177", name: ".NET Core SDK SEoL", risk: "Medium", eolDuration: "nan", cve: "nan" }
];

// Map risk → numeric value
const riskValueMap: Record<string, number> = {
  "Critical": 3,
  "High": 2,
  "Medium": 1
};

// Prepare chart data
const chartData = uniqueSEoLComponents.map(item => ({
  name: item.name.replace(" SEoL", ""),
  risk: item.risk,
  riskValue: riskValueMap[item.risk] ?? 0
}));

const eolDurationStats = {
  totalUniqueSEoLComponents: 7,
  totalSEoLInstances: 215,
  unknownDurationCount: 7,
  totalCount: 7
};

export default function EOLComponents() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">EOL Components</h1>
          <p className="text-muted-foreground">End-of-life component tracking and risk assessment</p>
        </div>
        <Button className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Download Report
        </Button>
      </div>

      {/* Unique SEoL Components Table and Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Table */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold mb-4">Unique SEoL Components</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4">Plugin ID</th>
                  <th className="text-left py-3 px-4">Name</th>
                  <th className="text-center py-3 px-4">Risk</th>
                  <th className="text-center py-3 px-4">EOL Duration (Days)</th>
                  <th className="text-center py-3 px-4">CVE</th>
                </tr>
              </thead>
              <tbody>
                {uniqueSEoLComponents.map((item, index) => (
                  <tr key={index} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-4 font-mono text-sm">{item.pluginId}</td>
                    <td className="py-3 px-4 text-sm">{item.name}</td>
                    <td className="py-3 px-4 text-center">
                      <Badge variant={
                        item.risk === "Critical" ? "destructive" : 
                        item.risk === "High" ? "default" : 
                        item.risk === "Medium" ? "secondary" :
                        "outline"
                      }>
                        {item.risk}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-center">{item.eolDuration}</td>
                    <td className="py-3 px-4 text-center">{item.cve}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Chart */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold mb-4">Component Severity by Name</h3>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis type="number" domain={[0, 3]} ticks={[1, 2, 3]} stroke="#9ca3af" />
                <YAxis type="category" dataKey="name" stroke="#9ca3af" fontSize={12} width={200} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "#1f2937", 
                    border: "1px solid #374151",
                    borderRadius: "8px"
                  }}
                  formatter={(value, name) => {
                    const level = Object.entries(riskValueMap).find(([k, v]) => v === value)?.[0] || "Unknown";
                    return [level, "Risk Level"];
                  }}
                />
                <Bar dataKey="riskValue">
                  {chartData.map((entry, index) => {
                    const color = 
                      entry.risk === "Critical" ? "#ef4444" :
                      entry.risk === "High" ? "#f59e0b" :
                      entry.risk === "Medium" ? "#3b82f6" :
                      "#10b981"; // fallback green
                    return <Cell key={`cell-${index}`} fill={color} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SimpleMetricCard
          title="Total Unique SEoL Components"
          value={eolDurationStats.totalUniqueSEoLComponents}
          color="red"
        />
        <SimpleMetricCard
          title="Total SEoL Instances (across all hosts)"
          value={eolDurationStats.totalSEoLInstances}
          color="blue"
        />
        <SimpleMetricCard
          title="Unknown EOL Duration"
          value={`${eolDurationStats.unknownDurationCount} Components`}
          color="yellow"
        />
        <SimpleMetricCard
          title="Total"
          value={`${eolDurationStats.totalCount} Components`}
          color="green"
        />
      </div>
    </div>
  );
}
