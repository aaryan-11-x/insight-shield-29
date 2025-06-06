
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const totalVulnerabilitiesData = [
  { timestamp: "2024-01-01", totalVulnerabilities: 45234 },
  { timestamp: "2024-02-01", totalVulnerabilities: 46789 },
  { timestamp: "2024-03-01", totalVulnerabilities: 48123 },
  { timestamp: "2024-04-01", totalVulnerabilities: 49567 },
  { timestamp: "2024-05-01", totalVulnerabilities: 51234 },
  { timestamp: "2024-06-01", totalVulnerabilities: 52678 },
  { timestamp: "2024-07-01", totalVulnerabilities: 53456 },
  { timestamp: "2024-08-01", totalVulnerabilities: 54123 },
  { timestamp: "2024-09-01", totalVulnerabilities: 54456 },
  { timestamp: "2024-10-01", totalVulnerabilities: 54578 },
  { timestamp: "2024-11-01", totalVulnerabilities: 54634 },
  { timestamp: "2024-12-01", totalVulnerabilities: 54655 },
];

const severityTrendsData = [
  { timestamp: "2024-01-01", critical: 2456, high: 2145, medium: 1978, low: 12456 },
  { timestamp: "2024-02-01", critical: 2523, high: 2198, medium: 2012, low: 12789 },
  { timestamp: "2024-03-01", critical: 2589, high: 2245, medium: 2034, low: 13123 },
  { timestamp: "2024-04-01", critical: 2612, high: 2278, medium: 2056, low: 13567 },
  { timestamp: "2024-05-01", critical: 2634, high: 2298, medium: 2078, low: 13834 },
  { timestamp: "2024-06-01", critical: 2645, high: 2312, medium: 2089, low: 14078 },
  { timestamp: "2024-07-01", critical: 2656, high: 2323, medium: 2095, low: 14156 },
  { timestamp: "2024-08-01", critical: 2665, high: 2329, medium: 2101, low: 14083 },
  { timestamp: "2024-09-01", critical: 2671, high: 2332, medium: 2103, low: 14090 },
  { timestamp: "2024-10-01", critical: 2675, high: 2334, medium: 2104, low: 14093 },
  { timestamp: "2024-11-01", critical: 2677, high: 2335, medium: 2104, low: 14095 },
  { timestamp: "2024-12-01", critical: 2678, high: 2336, medium: 2104, low: 14096 },
];

export default function RiskTrajectory() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Risk Trajectory</h1>
        <p className="text-muted-foreground">Vulnerability trends and risk evolution over time</p>
      </div>

      {/* Total Vulnerabilities Over Time */}
      <div className="chart-container">
        <h3 className="text-lg font-semibold mb-4">Total Vulnerabilities Over Time</h3>
        
        {/* Table */}
        <div className="mb-6 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4">Timestamp</th>
                <th className="text-center py-3 px-4">Total Vulnerabilities</th>
              </tr>
            </thead>
            <tbody>
              {totalVulnerabilitiesData.map((item, index) => (
                <tr key={index} className="border-b border-border/50 hover:bg-muted/20">
                  <td className="py-3 px-4 font-mono text-sm">{item.timestamp}</td>
                  <td className="py-3 px-4 text-center font-bold">{item.totalVulnerabilities.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Chart */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={totalVulnerabilitiesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="timestamp" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "#1f2937", 
                  border: "1px solid #374151",
                  borderRadius: "8px"
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="totalVulnerabilities" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Vulnerability Trends By Severity Over Time */}
      <div className="chart-container">
        <h3 className="text-lg font-semibold mb-4">Vulnerability Trends By Severity Over Time</h3>
        
        {/* Table */}
        <div className="mb-6 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4">Timestamp</th>
                <th className="text-center py-3 px-4">Critical</th>
                <th className="text-center py-3 px-4">High</th>
                <th className="text-center py-3 px-4">Medium</th>
                <th className="text-center py-3 px-4">Low</th>
              </tr>
            </thead>
            <tbody>
              {severityTrendsData.map((item, index) => (
                <tr key={index} className="border-b border-border/50 hover:bg-muted/20">
                  <td className="py-3 px-4 font-mono text-sm">{item.timestamp}</td>
                  <td className="py-3 px-4 text-center text-red-400 font-bold">{item.critical.toLocaleString()}</td>
                  <td className="py-3 px-4 text-center text-orange-400 font-bold">{item.high.toLocaleString()}</td>
                  <td className="py-3 px-4 text-center text-yellow-400 font-bold">{item.medium.toLocaleString()}</td>
                  <td className="py-3 px-4 text-center text-green-400 font-bold">{item.low.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Chart */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={severityTrendsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="timestamp" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "#1f2937", 
                  border: "1px solid #374151",
                  borderRadius: "8px"
                }} 
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="critical" 
                stroke="#dc2626" 
                strokeWidth={2}
                dot={{ fill: "#dc2626", strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="high" 
                stroke="#ea580c" 
                strokeWidth={2}
                dot={{ fill: "#ea580c", strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="medium" 
                stroke="#ca8a04" 
                strokeWidth={2}
                dot={{ fill: "#ca8a04", strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="low" 
                stroke="#16a34a" 
                strokeWidth={2}
                dot={{ fill: "#16a34a", strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
