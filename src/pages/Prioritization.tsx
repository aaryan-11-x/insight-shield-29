
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const severityData = [
  { name: "Critical", value: 800 },
  { name: "High", value: 540 },
  { name: "Medium", value: 360 },
];

const riskScatterData = [
  { x: 1, y: 0.4, size: 200 },
  { x: 4, y: 0.2, size: 150 },
  { x: 6, y: 0.9, size: 250 },
  { x: 8, y: 0.5, size: 180 },
];

export default function Prioritization() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Prioritization Insights</h1>
          <p className="text-muted-foreground">Vulnerability prioritization based on severity and exploitability</p>
        </div>
        <div className="flex gap-4">
          <Select defaultValue="severity">
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="severity">Severity</SelectItem>
              <SelectItem value="exploitability">Exploitability</SelectItem>
              <SelectItem value="kev-listed">KEV Listed</SelectItem>
            </SelectContent>
          </Select>
          <Button>Apply</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vulnerabilities by Severity */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold mb-4">Vulnerabilities by Severity</h3>
          <div className="h-96">
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

        {/* EPSS Risk Summary vs CVSS Score vs Count */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold mb-4">EPSS Risk Summary vs. CVSS Score vs. Count</h3>
          <div className="h-96">
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
      </div>

      {/* Recommendations Table */}
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
                <td className="py-3 px-4">Patch critical vulnerabilities in public-facing services</td>
                <td className="py-3 px-4">2</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-sm">R</span>
                </td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-3 px-4">2</td>
                <td className="py-3 px-4">Update vulnerable libraries and dependencies</td>
                <td className="py-3 px-4">5</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-sm">R</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
