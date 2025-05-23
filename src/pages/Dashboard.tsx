
import { MetricCard } from "@/components/MetricCard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, ScatterChart, Scatter } from "recharts";

const severityData = [
  { name: "Critical", value: 800, color: "#dc2626" },
  { name: "High", value: 540, color: "#ea580c" },
  { name: "Medium", value: 360, color: "#ca8a04" },
  { name: "Low", value: 180, color: "#16a34a" },
];

const exploitabilityData = [
  { name: "High", value: 45, color: "#dc2626" },
  { name: "Medium", value: 35, color: "#ea580c" },
  { name: "Low", value: 20, color: "#16a34a" },
];

const riskScatterData = [
  { x: 2, y: 0.4, size: 150, name: "Group A" },
  { x: 4, y: 0.6, size: 300, name: "Group B" },
  { x: 6, y: 0.9, size: 200, name: "Group C" },
  { x: 8, y: 0.5, size: 180, name: "Group D" },
];

const COLORS = ["#dc2626", "#ea580c", "#ca8a04", "#16a34a"];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Vulnerability Visualization</h1>
        <p className="text-muted-foreground">Comprehensive security overview and threat assessment</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <MetricCard
          title="Total Vulnerabilities"
          value={20730}
          color="default"
        />
        <MetricCard
          title="High Exploitability (>7)"
          value={9452}
          color="critical"
          trend="up"
        />
        <MetricCard
          title="KEV-Listed Vulns"
          value={1087}
          color="warning"
        />
        <MetricCard
          title="EOL Components"
          value={3210}
          color="warning"
        />
        <MetricCard
          title="Open Remediations"
          value={6738}
          color="success"
          trend="down"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Prioritization Insights */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold mb-4">Prioritization Insights</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={severityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "#1f2937", 
                    border: "1px solid #374151",
                    borderRadius: "8px"
                  }} 
                />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* EPSS Risk Summary */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold mb-4">EPSS Risk Summary vs. CVSS Score vs. Count</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart data={riskScatterData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  type="number" 
                  dataKey="x" 
                  domain={[0, 10]} 
                  stroke="#9ca3af"
                  label={{ value: 'CVSS Score', position: 'insideBottom', offset: -10 }}
                />
                <YAxis 
                  type="number" 
                  dataKey="y" 
                  domain={[0, 1]} 
                  stroke="#9ca3af"
                  label={{ value: 'EPSS Score', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "#1f2937", 
                    border: "1px solid #374151",
                    borderRadius: "8px"
                  }} 
                />
                <Scatter dataKey="size" fill="#3b82f6" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Exploitability Scoring */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold mb-4">Exploitability Scoring</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={exploitabilityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {exploitabilityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "#1f2937", 
                    border: "1px solid #374151",
                    borderRadius: "8px"
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            {exploitabilityData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Enmuditabillity scoring placeholder */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold mb-4">Risk Assessment Matrix</h3>
          <div className="h-80 flex items-center justify-center">
            <div className="grid grid-cols-3 gap-4 w-full max-w-md">
              {Array.from({ length: 9 }, (_, i) => (
                <div 
                  key={i}
                  className={`aspect-square rounded-lg border-2 border-border ${
                    i < 3 ? 'bg-green-500/20' : 
                    i < 6 ? 'bg-yellow-500/20' : 
                    'bg-red-500/20'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Prioritization Recommendations */}
      <div className="chart-container">
        <h3 className="text-lg font-semibold mb-4">Top Prioritization Recommendations</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4">Rank</th>
                <th className="text-left py-3 px-4">Recommendation</th>
                <th className="text-left py-3 px-4">Count</th>
                <th className="text-left py-3 px-4">Risk</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/50">
                <td className="py-3 px-4">1</td>
                <td className="py-3 px-4">Critical Infrastructure Vulnerabilities</td>
                <td className="py-3 px-4">7,978</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-sm">High</span>
                </td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-3 px-4">2</td>
                <td className="py-3 px-4">Public Facing Services</td>
                <td className="py-3 px-4">3,456</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-sm">High</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
