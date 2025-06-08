import { MetricCard } from "@/components/MetricCard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const assetData = [
  { name: "Vulnerable Assets", value: 359, color: "#dc2626" },
  { name: "Unaffected Assets", value: 71, color: "#16a34a" },
];

const severityData = [
  { name: "Critical", value: 800, color: "#dc2626" },
  { name: "High", value: 540, color: "#ea580c" },
  { name: "Medium", value: 360, color: "#ca8a04" },
  { name: "Low", value: 180, color: "#16a34a" },
];

const vulnerabilityCategoriesData = [
  { name: "Microsoft", value: 25, color: "#3b82f6" },
  { name: "SSL/TLS_Certificate", value: 20, color: "#8b5cf6" },
  { name: "Database", value: 15, color: "#10b981" },
  { name: "Apache", value: 12, color: "#f59e0b" },
  { name: "Config", value: 10, color: "#ef4444" },
  { name: "Microsoft_NET", value: 8, color: "#06b6d4" },
  { name: "Oracle", value: 6, color: "#84cc16" },
  { name: "Miscellaneous", value: 4, color: "#6b7280" },
];

const vulnerabilityAgeData = [
  { ageRange: "0-30 days", count: 0 },
  { ageRange: "31-90 days", count: 1 },
  { ageRange: "91-180 days", count: 2146 },
  { ageRange: "181-365 days", count: 1691 },
  { ageRange: "Over 1 year", count: 989 },
];

const topCVEsData = [
  { cve: "CVE-2016-2183", count: 285 },
  { cve: "CVE-2020-9488", count: 47 },
  { cve: "CVE-2024-49069", count: 47 },
  { cve: "CVE-2024-49065", count: 47 },
  { cve: "CVE-2024-49059", count: 47 },
  { cve: "CVE-2019-17571", count: 47 },
  { cve: "CVE-2024-43600", count: 47 },
  { cve: "CVE-2022-23302", count: 47 },
  { cve: "CVE-2022-23307", count: 47 },
  { cve: "CVE-2023-26464", count: 47 },
];

const topVulnerableHostsData = [
  { host: "10.168.50.77", critical: 161, high: 46, medium: 10, low: 39 },
  { host: "10.168.50.140", critical: 83, high: 65, medium: 31, low: 52 },
  { host: "10.168.9.33", critical: 5, high: 16, medium: 31, low: 158 },
  { host: "10.168.51.82", critical: 97, high: 10, medium: 24, low: 58 },
  { host: "10.168.1.235", critical: 67, high: 46, medium: 15, low: 34 },
  { host: "10.168.9.6", critical: 0, high: 67, medium: 17, low: 61 },
  { host: "10.168.1.184", critical: 56, high: 33, medium: 9, low: 44 },
  { host: "10.168.1.130", critical: 56, high: 34, medium: 8, low: 36 },
  { host: "10.168.1.131", critical: 56, high: 34, medium: 8, low: 36 },
  { host: "10.168.2.131", critical: 56, high: 33, medium: 8, low: 37 },
];

export default function Dashboard() {
  const handleDownloadReport = () => {
    // In a real application, this would generate and download a report
    console.log("Downloading dashboard report...");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Vulnerability Visualization</h1>
          <p className="text-muted-foreground">Comprehensive security overview and threat assessment</p>
        </div>
        <Button onClick={handleDownloadReport} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Download Report
        </Button>
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
        {/* Vulnerability Risk Levels */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold mb-4">Vulnerability Risk Levels</h3>
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

        {/* Unique Assets */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold mb-4">Unique Assets</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={assetData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {assetData.map((entry, index) => (
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
            {assetData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm">{item.name} ({item.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Vulnerability Categories */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold mb-4">Vulnerability Categories</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={vulnerabilityCategoriesData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {vulnerabilityCategoriesData.map((entry, index) => (
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
          <div className="grid grid-cols-2 gap-2 mt-4">
            {vulnerabilityCategoriesData.map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-xs">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Vulnerability Age Distribution */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold mb-4">Vulnerability Age Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={vulnerabilityAgeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="ageRange" stroke="#9ca3af" angle={-45} textAnchor="end" height={80} />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "#1f2937", 
                    border: "1px solid #374151",
                    borderRadius: "8px"
                  }} 
                />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top 10 Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 10 CVEs */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold mb-4">Top 10 CVEs</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4">CVE</th>
                  <th className="text-left py-3 px-4">Count</th>
                </tr>
              </thead>
              <tbody>
                {topCVEsData.map((item, index) => (
                  <tr key={index} className="border-b border-border/50 hover:bg-muted/20">
                    <td className="py-3 px-4">
                      <code className="text-sm font-mono bg-background px-2 py-1 rounded">{item.cve}</code>
                    </td>
                    <td className="py-3 px-4 font-medium">{item.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                  <th className="text-center py-3 px-4 bg-red-500/20">Critical</th>
                  <th className="text-center py-3 px-4 bg-orange-500/20">High</th>
                  <th className="text-center py-3 px-4 bg-yellow-500/20">Medium</th>
                  <th className="text-center py-3 px-4 bg-green-500/20">Low</th>
                </tr>
              </thead>
              <tbody>
                {topVulnerableHostsData.map((item, index) => (
                  <tr key={index} className="border-b border-border/50 hover:bg-muted/20">
                    <td className="py-3 px-4">
                      <code className="text-sm font-mono">{item.host}</code>
                    </td>
                    <td className="py-3 px-4 text-center font-bold">{item.critical}</td>
                    <td className="py-3 px-4 text-center font-bold">{item.high}</td>
                    <td className="py-3 px-4 text-center font-bold">{item.medium}</td>
                    <td className="py-3 px-4 text-center font-bold">{item.low}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
