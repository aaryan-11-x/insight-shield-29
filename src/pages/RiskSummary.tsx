
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Badge } from "@/components/ui/badge";

const severityData = [
  { severity: "Critical", count: 2678, vulnerabilitiesWithCVE: 2409, color: "#dc2626" },
  { severity: "High", count: 2336, vulnerabilitiesWithCVE: 2256, color: "#ea580c" },
  { severity: "Medium", count: 2104, vulnerabilitiesWithCVE: 125, color: "#ca8a04" },
  { severity: "Low", count: 14096, vulnerabilitiesWithCVE: 37, color: "#16a34a" },
];

const topCVEsData = [
  { cve: "CVE-2016-2183", count: 285, severity: "High" },
  { cve: "CVE-2024-43600", count: 47, severity: "High" },
  { cve: "CVE-2024-49059", count: 47, severity: "High" },
  { cve: "CVE-2024-49065", count: 47, severity: "High" },
  { cve: "CVE-2024-49069", count: 47, severity: "High" },
  { cve: "CVE-2019-17571", count: 47, severity: "Critical" },
  { cve: "CVE-2020-9488", count: 47, severity: "Critical" },
  { cve: "CVE-2022-23302", count: 47, severity: "Critical" },
  { cve: "CVE-2022-23305", count: 47, severity: "Critical" },
  { cve: "CVE-2022-23307", count: 47, severity: "Critical" },
];

const topHostsData = [
  { host: "10.168.50.77", vulnerabilityCount: 256, vulnerabilitiesWithCVE: 193, critical: 161, high: 46, medium: 10, low: 39 },
  { host: "10.168.50.140", vulnerabilityCount: 231, vulnerabilitiesWithCVE: 152, critical: 83, high: 65, medium: 31, low: 52 },
  { host: "10.168.9.33", vulnerabilityCount: 210, vulnerabilitiesWithCVE: 16, critical: 5, high: 16, medium: 31, low: 158 },
  { host: "10.168.51.82", vulnerabilityCount: 189, vulnerabilitiesWithCVE: 98, critical: 97, high: 10, medium: 24, low: 58 },
  { host: "10.168.1.235", vulnerabilityCount: 162, vulnerabilitiesWithCVE: 117, critical: 67, high: 46, medium: 15, low: 34 },
  { host: "10.168.9.6", vulnerabilityCount: 145, vulnerabilitiesWithCVE: 67, critical: 0, high: 67, medium: 17, low: 61 },
  { host: "10.168.1.184", vulnerabilityCount: 142, vulnerabilitiesWithCVE: 89, critical: 56, high: 33, medium: 9, low: 44 },
  { host: "10.168.1.131", vulnerabilityCount: 134, vulnerabilitiesWithCVE: 90, critical: 56, high: 34, medium: 8, low: 36 },
  { host: "10.168.2.131", vulnerabilityCount: 134, vulnerabilitiesWithCVE: 89, critical: 56, high: 33, medium: 8, low: 37 },
  { host: "10.168.1.130", vulnerabilityCount: 134, vulnerabilitiesWithCVE: 90, critical: 56, high: 34, medium: 8, low: 36 },
];

export default function RiskSummary() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Risk Summary</h1>
        <p className="text-muted-foreground">Comprehensive risk assessment and vulnerability overview</p>
      </div>

      {/* Severity Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="chart-container">
          <h3 className="text-lg font-semibold mb-4">Vulnerability Severity Distribution</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4">Severity</th>
                  <th className="text-center py-3 px-4">Count</th>
                  <th className="text-center py-3 px-4">Vulnerabilities with CVE</th>
                </tr>
              </thead>
              <tbody>
                {severityData.map((item, index) => (
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
                    <td className="py-3 px-4 text-center font-bold">{item.count.toLocaleString()}</td>
                    <td className="py-3 px-4 text-center font-mono">{item.vulnerabilitiesWithCVE.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="chart-container">
          <h3 className="text-lg font-semibold mb-4">Severity Distribution Chart</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ severity, count }) => `${severity}: ${count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top 10 CVEs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="chart-container">
          <h3 className="text-lg font-semibold mb-4">Top 10 CVEs</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4">CVE</th>
                  <th className="text-center py-3 px-4">Count</th>
                  <th className="text-center py-3 px-4">Severity</th>
                </tr>
              </thead>
              <tbody>
                {topCVEsData.map((item, index) => (
                  <tr key={index} className="border-b border-border/50 hover:bg-muted/20">
                    <td className="py-3 px-4">
                      <code className="text-sm font-mono bg-background px-2 py-1 rounded">{item.cve}</code>
                    </td>
                    <td className="py-3 px-4 text-center font-bold">{item.count}</td>
                    <td className="py-3 px-4 text-center">
                      <Badge variant={item.severity === "Critical" ? "destructive" : "default"}>
                        {item.severity}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="chart-container">
          <h3 className="text-lg font-semibold mb-4">Top CVEs Chart</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topCVEsData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis type="number" stroke="#9ca3af" />
                <YAxis dataKey="cve" type="category" stroke="#9ca3af" width={120} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "#1f2937", 
                    border: "1px solid #374151",
                    borderRadius: "8px"
                  }} 
                />
                <Bar 
                  dataKey="count" 
                  fill="#3b82f6"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top 10 Vulnerable Hosts */}
      <div className="chart-container">
        <h3 className="text-lg font-semibold mb-4">Top 10 Vulnerable Hosts</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4">Host</th>
                <th className="text-center py-3 px-4">Vulnerability Count</th>
                <th className="text-center py-3 px-4">Vulnerabilities with CVE</th>
                <th className="text-center py-3 px-4">Critical</th>
                <th className="text-center py-3 px-4">High</th>
                <th className="text-center py-3 px-4">Medium</th>
                <th className="text-center py-3 px-4">Low</th>
              </tr>
            </thead>
            <tbody>
              {topHostsData.map((item, index) => (
                <tr key={index} className="border-b border-border/50 hover:bg-muted/20">
                  <td className="py-3 px-4 font-mono text-sm">{item.host}</td>
                  <td className="py-3 px-4 text-center font-bold">{item.vulnerabilityCount}</td>
                  <td className="py-3 px-4 text-center font-mono">{item.vulnerabilitiesWithCVE}</td>
                  <td className="py-3 px-4 text-center text-red-400 font-bold">{item.critical}</td>
                  <td className="py-3 px-4 text-center text-orange-400 font-bold">{item.high}</td>
                  <td className="py-3 px-4 text-center text-yellow-400 font-bold">{item.medium}</td>
                  <td className="py-3 px-4 text-center text-green-400 font-bold">{item.low}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topHostsData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis type="number" stroke="#9ca3af" />
              <YAxis dataKey="host" type="category" stroke="#9ca3af" width={120} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "#1f2937", 
                  border: "1px solid #374151",
                  borderRadius: "8px"
                }} 
              />
              <Bar dataKey="critical" stackId="a" fill="#dc2626" />
              <Bar dataKey="high" stackId="a" fill="#ea580c" />
              <Bar dataKey="medium" stackId="a" fill="#ca8a04" />
              <Bar dataKey="low" stackId="a" fill="#16a34a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
