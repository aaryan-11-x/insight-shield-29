
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Badge } from "@/components/ui/badge";

const ipInsightsData = [
  { ip: "10.168.9.33", hostname: "", total: 413, critical: 5, high: 16, medium: 31, low: 158, kev: 0, exploitability: 288, category: "Miscellaneous", lastScan: "N/A" },
  { ip: "10.168.50.77", hostname: "", total: 350, critical: 161, high: 46, medium: 10, low: 39, kev: 1, exploitability: 844, category: "Microsoft", lastScan: "N/A" },
  { ip: "10.168.50.140", hostname: "", total: 344, critical: 83, high: 65, medium: 31, low: 52, kev: 9, exploitability: 668, category: "Microsoft", lastScan: "N/A" },
  { ip: "10.168.51.82", hostname: "", total: 319, critical: 97, high: 10, medium: 24, low: 58, kev: 1, exploitability: 527, category: "Microsoft", lastScan: "N/A" },
  { ip: "10.168.9.6", hostname: "", total: 279, critical: 0, high: 67, medium: 17, low: 61, kev: 0, exploitability: 296, category: "Microsoft", lastScan: "N/A" },
  { ip: "10.168.2.69", hostname: "", total: 260, critical: 0, high: 1, medium: 7, low: 78, kev: 0, exploitability: 95, category: "Microsoft", lastScan: "N/A" },
  { ip: "10.168.1.235", hostname: "", total: 259, critical: 67, high: 46, medium: 15, low: 34, kev: 5, exploitability: 485, category: "Microsoft", lastScan: "N/A" },
];

const vulnerabilityDistributionData = [
  { name: "Critical", value: 413, color: "#dc2626" },
  { name: "High", value: 251, color: "#ea580c" },
  { name: "Medium", value: 135, color: "#ca8a04" },
  { name: "Low", value: 480, color: "#16a34a" },
];

const hostCategoriesData = [
  { name: "Microsoft", value: 5, color: "#3b82f6" },
  { name: "Miscellaneous", value: 2, color: "#8b5cf6" },
];

export default function IPInsights() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">IP Insights</h1>
        <p className="text-muted-foreground">This sheet provides a detailed breakdown of vulnerabilities per IP, facilitating operational planning and remediation prioritization</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Hosts</p>
              <p className="text-3xl font-bold">359</p>
            </div>
          </div>
        </div>
        <div className="bg-card p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Vulnerabilities</p>
              <p className="text-3xl font-bold">54,655</p>
            </div>
          </div>
        </div>
      </div>

      {/* Operational Planning Statistics */}
      <div className="chart-container">
        <h3 className="text-lg font-semibold mb-4">Operational Planning Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-background p-4 rounded border">
            <p className="text-sm text-muted-foreground">Total Hosts Scanned</p>
            <p className="text-2xl font-bold">359</p>
          </div>
          <div className="bg-background p-4 rounded border">
            <p className="text-sm text-muted-foreground">Hosts with Vulnerabilities</p>
            <p className="text-2xl font-bold">359 <span className="text-sm text-muted-foreground">(100.0%)</span></p>
          </div>
          <div className="bg-background p-4 rounded border">
            <p className="text-sm text-muted-foreground">Hosts with Critical Vulnerabilities</p>
            <p className="text-2xl font-bold">90 <span className="text-sm text-muted-foreground">(25.1%)</span></p>
          </div>
          <div className="bg-background p-4 rounded border">
            <p className="text-sm text-muted-foreground">Hosts with High Vulnerabilities</p>
            <p className="text-2xl font-bold">277 <span className="text-sm text-muted-foreground">(77.2%)</span></p>
          </div>
          <div className="bg-background p-4 rounded border md:col-span-2">
            <p className="text-sm text-muted-foreground">Top 5 Hosts Need Remediation</p>
            <p className="text-lg font-mono">10.168.9.33, 10.168.50.77, 10.168.50.140, 10.168.51.82, 10.168.9.6</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vulnerability Distribution */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold mb-4">Vulnerability Distribution by Severity</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={vulnerabilityDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {vulnerabilityDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {vulnerabilityDistributionData.map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Host Categories */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold mb-4">Host Categories Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ipInsightsData.slice(0, 7)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="ip" stroke="#9ca3af" fontSize={10} angle={-45} textAnchor="end" height={80} />
                <YAxis stroke="#9ca3af" />
                <Tooltip />
                <Bar dataKey="total" fill="#3b82f6" name="Total Vulnerabilities" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* IP Details Table */}
      <div className="chart-container">
        <h3 className="text-lg font-semibold mb-4">IP Address Details</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-2">IP Address</th>
                <th className="text-left py-3 px-2">Hostname</th>
                <th className="text-center py-3 px-2">Total</th>
                <th className="text-center py-3 px-2">Critical</th>
                <th className="text-center py-3 px-2">High</th>
                <th className="text-center py-3 px-2">Medium</th>
                <th className="text-center py-3 px-2">Low</th>
                <th className="text-center py-3 px-2">KEV</th>
                <th className="text-center py-3 px-2">Exploit Score</th>
                <th className="text-left py-3 px-2">Category</th>
                <th className="text-left py-3 px-2">Last Scan</th>
              </tr>
            </thead>
            <tbody>
              {ipInsightsData.map((item, index) => (
                <tr key={index} className="border-b border-border/50 hover:bg-muted/20">
                  <td className="py-3 px-2 font-mono text-xs">{item.ip}</td>
                  <td className="py-3 px-2">{item.hostname || "—"}</td>
                  <td className="py-3 px-2 text-center font-bold">{item.total}</td>
                  <td className="py-3 px-2 text-center">
                    <Badge variant={item.critical > 0 ? "destructive" : "secondary"}>
                      {item.critical}
                    </Badge>
                  </td>
                  <td className="py-3 px-2 text-center">
                    <Badge variant={item.high > 0 ? "default" : "secondary"}>
                      {item.high}
                    </Badge>
                  </td>
                  <td className="py-3 px-2 text-center">{item.medium}</td>
                  <td className="py-3 px-2 text-center">{item.low}</td>
                  <td className="py-3 px-2 text-center">{item.kev}</td>
                  <td className="py-3 px-2 text-center font-mono">{item.exploitability}</td>
                  <td className="py-3 px-2">{item.category}</td>
                  <td className="py-3 px-2 text-muted-foreground">{item.lastScan}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
