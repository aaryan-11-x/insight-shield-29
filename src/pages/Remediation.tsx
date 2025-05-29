
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { useState } from "react";

const patchAvailabilityData = [
  { severity: "Critical", available: 45, unavailable: 12 },
  { severity: "High", available: 156, unavailable: 34 },
  { severity: "Medium", available: 289, unavailable: 78 },
  { severity: "Low", available: 432, unavailable: 23 },
];

const remediationTrendData = [
  { month: "Jan", vulnerabilities: 150 },
  { month: "Feb", vulnerabilities: 180 },
  { month: "Mar", vulnerabilities: 220 },
  { month: "Apr", vulnerabilities: 280 },
  { month: "May", vulnerabilities: 320 },
  { month: "Jun", vulnerabilities: 410 },
];

const topRemediationActions = [
  { action: "Update Apache web server to 2.4.57", impacted: 325, priority: "High", effort: "Medium" },
  { action: "Patch OpenSSL library to 3.0.8", impacted: 210, priority: "Critical", effort: "Low" },
  { action: "Update database drivers to latest", impacted: 150, priority: "Medium", effort: "High" },
  { action: "Apply Windows security updates", impacted: 143, priority: "High", effort: "Low" },
  { action: "Update Node.js runtime", impacted: 128, priority: "Medium", effort: "Medium" },
  { action: "Patch nginx web server", impacted: 112, priority: "High", effort: "Low" },
  { action: "Update PHP framework", impacted: 98, priority: "Medium", effort: "High" },
  { action: "Apply container base image updates", impacted: 87, priority: "High", effort: "Medium" },
  { action: "Update SSL/TLS certificates", impacted: 76, priority: "Critical", effort: "Low" },
  { action: "Patch MySQL database", impacted: 65, priority: "Medium", effort: "Medium" },
];

const uniqueVulnMapping = [
  {
    cve: "CVE-2024-0001",
    description: "Apache HTTP Server vulnerability",
    remediation: "Apply security patch version 2.4.57",
    priority: "High",
    affectedSystems: 325
  },
  {
    cve: "CVE-2024-0002", 
    description: "OpenSSL cryptographic vulnerability",
    remediation: "Update to OpenSSL 3.0.8 or later",
    priority: "Critical",
    affectedSystems: 210
  },
  {
    cve: "CVE-2024-0003",
    description: "Database driver SQL injection",
    remediation: "Update to latest driver version",
    priority: "Medium",
    affectedSystems: 150
  },
  {
    cve: "CVE-2024-0004",
    description: "Windows kernel privilege escalation",
    remediation: "Install KB5034441 security update",
    priority: "High",
    affectedSystems: 143
  },
  {
    cve: "CVE-2024-0005",
    description: "Node.js runtime vulnerability",
    remediation: "Upgrade to Node.js 18.19.0",
    priority: "Medium",
    affectedSystems: 128
  },
  {
    cve: "CVE-2024-0006",
    description: "Nginx HTTP request smuggling",
    remediation: "Update to nginx 1.24.0",
    priority: "High",
    affectedSystems: 112
  },
  {
    cve: "CVE-2024-0007",
    description: "PHP framework XSS vulnerability",
    remediation: "Apply framework security patch",
    priority: "Medium",
    affectedSystems: 98
  },
  {
    cve: "CVE-2024-0008",
    description: "Container base image vulnerability",
    remediation: "Update base image to latest",
    priority: "High",
    affectedSystems: 87
  },
  {
    cve: "CVE-2024-0009",
    description: "SSL/TLS certificate vulnerability",
    remediation: "Renew and update certificates",
    priority: "Critical",
    affectedSystems: 76
  },
  {
    cve: "CVE-2024-0010",
    description: "MySQL authentication bypass",
    remediation: "Apply MySQL 8.0.35 patch",
    priority: "Medium",
    affectedSystems: 65
  },
];

const patchDetailsData = [
  {
    cve: "CVE-2024-0001",
    patchStatus: "Available",
    source: "Apache Foundation",
    url: "https://httpd.apache.org/security/",
    description: "Critical security update for Apache HTTP Server",
    releaseDate: "2024-01-15",
    severity: "High"
  },
  {
    cve: "CVE-2024-0002",
    patchStatus: "Available",
    source: "OpenSSL Project",
    url: "https://www.openssl.org/news/secadv/",
    description: "Security fix for cryptographic vulnerability",
    releaseDate: "2024-01-20",
    severity: "Critical"
  },
  {
    cve: "CVE-2024-0003",
    patchStatus: "In Development",
    source: "Database Vendor",
    url: "https://vendor.com/security",
    description: "SQL injection fix in development",
    releaseDate: "Expected Q2 2024",
    severity: "Medium"
  },
  {
    cve: "CVE-2024-0004",
    patchStatus: "Available",
    source: "Microsoft",
    url: "https://msrc.microsoft.com/",
    description: "Windows security update KB5034441",
    releaseDate: "2024-01-10",
    severity: "High"
  },
  {
    cve: "CVE-2024-0005",
    patchStatus: "Available",
    source: "Node.js Foundation",
    url: "https://nodejs.org/en/security/",
    description: "Runtime security update",
    releaseDate: "2024-01-25",
    severity: "Medium"
  }
];

export default function Remediation() {
  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  const toggleRow = (cve: string) => {
    setExpandedRows(prev => 
      prev.includes(cve) 
        ? prev.filter(id => id !== cve)
        : [...prev, cve]
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Remediation Insights</h1>
        <p className="text-muted-foreground">Track remediation progress and prioritize actions</p>
      </div>

      {/* Patch Availability by Severity */}
      <div className="chart-container">
        <h3 className="text-lg font-semibold mb-4">Patch Availability by Severity</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={patchAvailabilityData}>
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
              <Bar dataKey="available" fill="#10b981" name="Patches Available" />
              <Bar dataKey="unavailable" fill="#ef4444" name="Patches Unavailable" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 10 Remediation Actions (2.1) */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold mb-4">Top 10 Remediation Actions (2.1)</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {topRemediationActions.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.action}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">Systems: {item.impacted}</span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">Effort: {item.effort}</span>
                  </div>
                </div>
                <Badge variant={
                  item.priority === "Critical" ? "destructive" : 
                  item.priority === "High" ? "default" : 
                  "secondary"
                } className="ml-2">
                  {item.priority}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Top 10 Unique Vulnerabilities to Fix Mapping */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold mb-4">Top 10 Unique Vulnerabilities to Fix Mapping</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {uniqueVulnMapping.map((item, index) => (
              <div key={index} className="p-3 bg-muted/20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <code className="text-sm font-mono bg-background px-2 py-1 rounded">{item.cve}</code>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{item.affectedSystems} systems</span>
                    <Badge variant={item.priority === "Critical" ? "destructive" : item.priority === "High" ? "default" : "secondary"}>
                      {item.priority}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm font-medium mb-1">{item.description}</p>
                <p className="text-xs text-muted-foreground">{item.remediation}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Patch Details Expandable Table */}
      <div className="chart-container">
        <h3 className="text-lg font-semibold mb-4">Patch Details</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4">CVE ID</th>
                <th className="text-left py-3 px-4">Patch Status</th>
                <th className="text-left py-3 px-4">Source</th>
                <th className="text-left py-3 px-4">Severity</th>
                <th className="text-left py-3 px-4">Release Date</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {patchDetailsData.map((item, index) => (
                <>
                  <tr key={index} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-4">
                      <code className="text-sm font-mono bg-background px-2 py-1 rounded">{item.cve}</code>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={item.patchStatus === "Available" ? "default" : "secondary"}>
                        {item.patchStatus}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm">{item.source}</td>
                    <td className="py-3 px-4">
                      <Badge variant={
                        item.severity === "Critical" ? "destructive" : 
                        item.severity === "High" ? "default" : 
                        "secondary"
                      }>
                        {item.severity}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm">{item.releaseDate}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleRow(item.cve)}
                        >
                          {expandedRows.includes(item.cve) ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                        >
                          <a href={item.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </td>
                  </tr>
                  {expandedRows.includes(item.cve) && (
                    <tr className="bg-muted/10">
                      <td colSpan={6} className="py-4 px-4">
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Description:</p>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                          <p className="text-sm font-medium">Source URL:</p>
                          <a 
                            href={item.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-blue-400 hover:text-blue-300 underline"
                          >
                            {item.url}
                          </a>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vulnerabilities Remediated Over Time */}
      <div className="chart-container">
        <h3 className="text-lg font-semibold mb-4">Vulnerabilities Remediated Over Time</h3>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={remediationTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9ca3af" />
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
                dataKey="vulnerabilities" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ fill: "#10b981", strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
