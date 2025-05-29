
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const cveDetailsData = [
  {
    cveId: "CVE-2024-0001",
    count: 325,
    severity: "High",
    affectedSystems: 245,
    description: "Apache HTTP Server remote code execution vulnerability allowing attackers to execute arbitrary code"
  },
  {
    cveId: "CVE-2024-0002",
    count: 210,
    severity: "Critical",
    affectedSystems: 180,
    description: "OpenSSL cryptographic library vulnerability enabling man-in-the-middle attacks"
  },
  {
    cveId: "CVE-2024-0003",
    count: 189,
    severity: "Medium",
    affectedSystems: 156,
    description: "SQL injection vulnerability in database drivers allowing unauthorized data access"
  },
  {
    cveId: "CVE-2024-0004",
    count: 167,
    severity: "High",
    affectedSystems: 134,
    description: "Windows kernel privilege escalation vulnerability"
  },
  {
    cveId: "CVE-2024-0005",
    count: 145,
    severity: "Medium",
    affectedSystems: 123,
    description: "Node.js runtime vulnerability allowing denial of service attacks"
  },
  {
    cveId: "CVE-2024-0006",
    count: 134,
    severity: "High",
    affectedSystems: 112,
    description: "Nginx HTTP request smuggling vulnerability"
  },
  {
    cveId: "CVE-2024-0007",
    count: 123,
    severity: "Medium",
    affectedSystems: 98,
    description: "PHP framework cross-site scripting vulnerability"
  },
  {
    cveId: "CVE-2024-0008",
    count: 112,
    severity: "High",
    affectedSystems: 87,
    description: "Container base image vulnerability enabling container escape"
  },
  {
    cveId: "CVE-2024-0009",
    count: 98,
    severity: "Critical",
    affectedSystems: 76,
    description: "SSL/TLS certificate validation vulnerability"
  },
  {
    cveId: "CVE-2024-0010",
    count: 87,
    severity: "Medium",
    affectedSystems: 65,
    description: "MySQL authentication bypass vulnerability"
  },
];

const summaryStats = {
  totalCves: cveDetailsData.length,
  critical: cveDetailsData.filter(item => item.severity === "Critical").length,
  high: cveDetailsData.filter(item => item.severity === "High").length,
  medium: cveDetailsData.filter(item => item.severity === "Medium").length,
  low: cveDetailsData.filter(item => item.severity === "Low").length,
  totalAffectedSystems: cveDetailsData.reduce((sum, item) => sum + item.affectedSystems, 0)
};

export default function CVESummary() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Higher Management Insights</h1>
          <p className="text-muted-foreground">CVE summary and executive overview</p>
        </div>
        <Button className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Download Report
        </Button>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="metric-card">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Total CVEs</p>
            <p className="text-2xl font-bold">{summaryStats.totalCves}</p>
          </div>
        </div>
        <div className="metric-card">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Critical</p>
            <p className="text-2xl font-bold text-red-400">{summaryStats.critical}</p>
          </div>
        </div>
        <div className="metric-card">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">High</p>
            <p className="text-2xl font-bold text-orange-400">{summaryStats.high}</p>
          </div>
        </div>
        <div className="metric-card">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Medium</p>
            <p className="text-2xl font-bold text-yellow-400">{summaryStats.medium}</p>
          </div>
        </div>
        <div className="metric-card">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Low</p>
            <p className="text-2xl font-bold text-green-400">{summaryStats.low}</p>
          </div>
        </div>
        <div className="metric-card">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Affected Systems</p>
            <p className="text-2xl font-bold">{summaryStats.totalAffectedSystems.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* CVE Details Table */}
      <div className="chart-container">
        <h3 className="text-lg font-semibold mb-4">CVE Details</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4">CVE ID</th>
                <th className="text-center py-3 px-4">Count</th>
                <th className="text-center py-3 px-4">Severity</th>
                <th className="text-center py-3 px-4">Affected Systems</th>
                <th className="text-left py-3 px-4">Description</th>
              </tr>
            </thead>
            <tbody>
              {cveDetailsData.map((item, index) => (
                <tr key={index} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="py-3 px-4">
                    <code className="text-sm font-mono bg-background px-2 py-1 rounded">{item.cveId}</code>
                  </td>
                  <td className="py-3 px-4 text-center font-bold">{item.count}</td>
                  <td className="py-3 px-4 text-center">
                    <Badge variant={
                      item.severity === "Critical" ? "destructive" : 
                      item.severity === "High" ? "default" : 
                      "secondary"
                    }>
                      {item.severity}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-center font-medium">{item.affectedSystems}</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground max-w-md">
                    {item.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
