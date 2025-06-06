
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const mttmData = [
  { severity: "Critical", vulnerabilityCount: 2678, averageMTTM: 210.7, color: "#dc2626" },
  { severity: "High", vulnerabilityCount: 2336, averageMTTM: 702.7, color: "#ea580c" },
  { severity: "Medium", vulnerabilityCount: 2104, averageMTTM: 3054.5, color: "#ca8a04" },
  { severity: "Low", vulnerabilityCount: 42, averageMTTM: 3462.2, color: "#16a34a" },
];

export default function MTTMSeverity() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">MTTM by Severity</h1>
        <p className="text-muted-foreground">Mean Time to Mitigation analysis by vulnerability severity</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* MTTM Table */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold mb-4">MTTM by Severity</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4">Risk Severity</th>
                  <th className="text-center py-3 px-4">Vulnerability Count</th>
                  <th className="text-center py-3 px-4">Average MTTM (Days)</th>
                </tr>
              </thead>
              <tbody>
                {mttmData.map((item, index) => (
                  <tr key={index} className="border-b border-border/50 hover:bg-muted/20">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="font-medium">{item.severity}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center font-mono">{item.vulnerabilityCount.toLocaleString()}</td>
                    <td className="py-3 px-4 text-center font-mono">{item.averageMTTM.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Vulnerability Count by Severity Chart */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold mb-4">Vulnerability Count by Severity</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mttmData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="severity" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "#1f2937", 
                    border: "1px solid #374151",
                    borderRadius: "8px"
                  }} 
                />
                <Bar 
                  dataKey="vulnerabilityCount" 
                  fill={(entry) => entry.color}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
