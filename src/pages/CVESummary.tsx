
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const cveData = [
  {
    id: "CVE-2024-0124",
    count: 1257,
    severity: "High",
    affectedSystems: "Web Servers",
    description: "Buffer overflow vulnerability in HTTP request processing"
  },
  {
    id: "CVE-2024-0025",
    count: 1252, 
    severity: "Low",
    affectedSystems: "Database Systems",
    description: "Information disclosure in error messages"
  },
  {
    id: "CVE-2024-0031",
    count: 225,
    severity: "Critical",
    affectedSystems: "Authentication Services",
    description: "Authentication bypass vulnerability"
  },
  {
    id: "CVE-2024-0043",
    count: 105,
    severity: "Medium",
    affectedSystems: "API Gateways",
    description: "Cross-site scripting vulnerability"
  },
  {
    id: "CVE-2024-0082",
    count: 152,
    severity: "High",
    affectedSystems: "Load Balancers",
    description: "Remote code execution vulnerability"
  },
];

export default function CVESummary() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = cveData.filter(item => 
    item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">CVE Summary</h1>
        <p className="text-muted-foreground">Comprehensive CVE database with impact analysis</p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search CVE ID or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* CVE Table */}
      <div className="chart-container">
        <h3 className="text-lg font-semibold mb-4">CVE Details</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4">CVE ID</th>
                <th className="text-left py-3 px-4">Count</th>
                <th className="text-left py-3 px-4">Severity</th>
                <th className="text-left py-3 px-4">Affected Systems</th>
                <th className="text-left py-3 px-4">Description</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={index} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="py-4 px-4 font-mono text-sm font-medium">{item.id}</td>
                  <td className="py-4 px-4 font-bold">{item.count}</td>
                  <td className="py-4 px-4">
                    <Badge variant={
                      item.severity === "Critical" ? "destructive" : 
                      item.severity === "High" ? "default" : 
                      item.severity === "Medium" ? "secondary" : 
                      "outline"
                    }>
                      {item.severity}
                    </Badge>
                  </td>
                  <td className="py-4 px-4">{item.affectedSystems}</td>
                  <td className="py-4 px-4 text-sm text-muted-foreground max-w-md">{item.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="metric-card">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Total CVEs</p>
            <p className="text-2xl font-bold">{cveData.length}</p>
          </div>
        </div>
        <div className="metric-card">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Critical</p>
            <p className="text-2xl font-bold text-red-400">
              {cveData.filter(item => item.severity === "Critical").length}
            </p>
          </div>
        </div>
        <div className="metric-card">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">High</p>
            <p className="text-2xl font-bold text-orange-400">
              {cveData.filter(item => item.severity === "High").length}
            </p>
          </div>
        </div>
        <div className="metric-card">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Total Affected Systems</p>
            <p className="text-2xl font-bold">
              {cveData.reduce((sum, item) => sum + item.count, 0).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
