
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Badge } from "@/components/ui/badge";

const topClustersData = [
  { product: "Microsoft", vulnerabilities: 29205, color: "#dc2626" },
  { product: "Miscellaneous", vulnerabilities: 15112, color: "#ea580c" },
  { product: "SSL/TLS_Certificate", vulnerabilities: 5622, color: "#ca8a04" },
  { product: "Config", vulnerabilities: 3356, color: "#16a34a" },
  { product: "Database", vulnerabilities: 1993, color: "#2563eb" },
];

const detailedClustersData = [
  {
    product: "Microsoft",
    total: 29205,
    critical: 1960,
    high: 1578,
    medium: 28,
    low: 5395,
    affectedHosts: 359,
    cveCount: 210,
    kevCount: 46,
    commonVulns: "Microsoft Windows Remote Listeners Enumeration (WMI); KB5048661: Windows 10 version 1809 / Windows Server 2019 Security Update (December 2024); Security Updates for Microsoft SQL Server (November 2024)"
  },
  {
    product: "Miscellaneous",
    total: 15112,
    critical: 69,
    high: 249,
    medium: 393,
    low: 6872,
    affectedHosts: 359,
    cveCount: 80,
    kevCount: 8,
    commonVulns: "HyperText Transfer Protocol (HTTP) Information; Web Application Cookies Are Expired; HTTP Server Type and Version"
  },
  {
    product: "SSL/TLS_Certificate",
    total: 5622,
    critical: 18,
    high: 285,
    medium: 1558,
    low: 1667,
    affectedHosts: 359,
    cveCount: 6,
    kevCount: 0,
    commonVulns: "SSL Cipher Suites Supported; SSL Certificate 'commonName' Mismatch; SSL Certificate with Wrong Hostname"
  },
  {
    product: "Config",
    total: 3356,
    critical: 0,
    high: 0,
    medium: 0,
    low: 274,
    affectedHosts: 359,
    cveCount: 0,
    kevCount: 0,
    commonVulns: "Windows DNS Server Enumeration; Microsoft Remote Desktop Connection Installed; Microsoft Internet Explorer Installed"
  },
  {
    product: "Database",
    total: 1993,
    critical: 12,
    high: 1313,
    medium: 2,
    low: 125,
    affectedHosts: 171,
    cveCount: 41,
    kevCount: 0,
    commonVulns: "Security Updates for Microsoft SQL Server (November 2024); Microsoft ODBC Driver for SQL Server Installed (Windows); Microsoft OLE DB Driver for SQL Server Installed (Windows)"
  },
  {
    product: "Virtualization",
    total: 761,
    critical: 0,
    high: 23,
    medium: 3,
    low: 0,
    affectedHosts: 333,
    cveCount: 6,
    kevCount: 0,
    commonVulns: "VMware Virtual Machine Detection; VMware Tools Detection; Citrix Virtual Apps and Desktops Installed"
  },
  {
    product: "Microsoft_NET",
    total: 686,
    critical: 163,
    high: 59,
    medium: 7,
    low: 0,
    affectedHosts: 359,
    cveCount: 15,
    kevCount: 0,
    commonVulns: "Microsoft .NET Security Rollup Enumeration; ASP.NET Core SEoL; Microsoft .NET Core SEoL"
  }
];

export default function Clustering() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Vulnerability Clustering</h1>
        <p className="text-muted-foreground">This sheet groups vulnerabilities by affected product/service, enabling targeted remediation campaigns and efficient operational planning.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 5 Clusters Table */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold mb-4">Top 5 Clusters by Vulnerabilities</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4">Product/Service</th>
                  <th className="text-center py-3 px-4">Vulnerabilities</th>
                </tr>
              </thead>
              <tbody>
                {topClustersData.map((item, index) => (
                  <tr key={index} className="border-b border-border/50 hover:bg-muted/20">
                    <td className="py-3 px-4 font-medium">{item.product}</td>
                    <td className="py-3 px-4 text-center font-bold">{item.vulnerabilities.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Vulnerability Distribution by Product/Service */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold mb-4">Vulnerability Distribution by Product/Service</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={topClustersData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="vulnerabilities"
                >
                  {topClustersData.map((entry, index) => (
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
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {topClustersData.map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-xs">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span>{item.product}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Clusters Table */}
      <div className="chart-container">
        <h3 className="text-lg font-semibold mb-4">Detailed Product/Service Analysis</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-2">Product/Service</th>
                <th className="text-center py-3 px-2">Total</th>
                <th className="text-center py-3 px-2">Critical</th>
                <th className="text-center py-3 px-2">High</th>
                <th className="text-center py-3 px-2">Medium</th>
                <th className="text-center py-3 px-2">Low</th>
                <th className="text-center py-3 px-2">Affected Hosts</th>
                <th className="text-center py-3 px-2">CVE Count</th>
                <th className="text-center py-3 px-2">KEV Count</th>
                <th className="text-left py-3 px-2 min-w-[300px]">Common Vulnerabilities</th>
              </tr>
            </thead>
            <tbody>
              {detailedClustersData.map((item, index) => (
                <tr key={index} className="border-b border-border/50 hover:bg-muted/20">
                  <td className="py-3 px-2 font-medium">{item.product}</td>
                  <td className="py-3 px-2 text-center font-bold">{item.total.toLocaleString()}</td>
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
                  <td className="py-3 px-2 text-center">{item.affectedHosts}</td>
                  <td className="py-3 px-2 text-center">{item.cveCount}</td>
                  <td className="py-3 px-2 text-center">{item.kevCount}</td>
                  <td className="py-3 px-2 text-xs">{item.commonVulns}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
