
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const mttmData = [
  {
    riskSeverity: "Critical",
    vulnerabilityCount: 2678,
    averageMTTM: 210.69,
    displayMTTM: "210.69"
  },
  {
    riskSeverity: "High", 
    vulnerabilityCount: 2336,
    averageMTTM: 702.72,
    displayMTTM: "702.72"
  },
  {
    riskSeverity: "Medium",
    vulnerabilityCount: 2104,
    averageMTTM: 3054.46,
    displayMTTM: "3054.46"
  },
  {
    riskSeverity: "Low",
    vulnerabilityCount: 42,
    averageMTTM: 3462.17,
    displayMTTM: "3462.17"
  }
];

export default function MTTMSeverity() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">MTTM by Severity</h1>
        <p className="text-muted-foreground">Mean Time to Mitigation analysis by risk severity</p>
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
                  <th className="text-left py-3 px-4">Vulnerability Count</th>
                  <th className="text-left py-3 px-4">Average MTTM (Days)</th>
                </tr>
              </thead>
              <tbody>
                {mttmData.map((item, index) => (
                  <tr key={index} className="border-b border-border/50 hover:bg-muted/20">
                    <td className="py-3 px-4">
                      <span className={`font-medium ${
                        item.riskSeverity === "Critical" ? "text-red-400" :
                        item.riskSeverity === "High" ? "text-orange-400" :
                        item.riskSeverity === "Medium" ? "text-yellow-400" :
                        "text-green-400"
                      }`}>
                        {item.riskSeverity}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium">{item.vulnerabilityCount.toLocaleString()}</td>
                    <td className="py-3 px-4 font-mono">{item.displayMTTM}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* MTTM Chart */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold mb-4">Average MTTM by Severity</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mttmData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="riskSeverity" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "#1f2937", 
                    border: "1px solid #374151",
                    borderRadius: "8px"
                  }}
                  formatter={(value: number) => [`${value.toFixed(2)} days`, "Average MTTM"]}
                />
                <Bar 
                  dataKey="averageMTTM" 
                  fill="#8884d8"
                  name="Average MTTM (Days)"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Additional Chart - Vulnerability Count by Severity */}
      <div className="chart-container">
        <h3 className="text-lg font-semibold mb-4">Vulnerability Count by Severity</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mttmData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="riskSeverity" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "#1f2937", 
                  border: "1px solid #374151",
                  borderRadius: "8px"
                }}
                formatter={(value: number) => [value.toLocaleString(), "Vulnerability Count"]}
              />
              <Bar 
                dataKey="vulnerabilityCount" 
                fill="#10b981"
                name="Vulnerability Count"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
