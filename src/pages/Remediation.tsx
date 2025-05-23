
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Badge } from "@/components/ui/badge";

const remediationTrendData = [
  { month: "Jan", vulnerabilities: 150 },
  { month: "Feb", vulnerabilities: 180 },
  { month: "Mar", vulnerabilities: 220 },
  { month: "Apr", vulnerabilities: 280 },
  { month: "May", vulnerabilities: 320 },
  { month: "Jun", vulnerabilities: 410 },
];

const topActions = [
  { action: "Update Apache web server", impacted: 325, priority: "High" },
  { action: "Patch OpenSSL library", impacted: 210, priority: "Critical" },
  { action: "Update database drivers", impacted: 150, priority: "Medium" },
];

const vulnMapping = [
  {
    cve: "CVE-2024-0001",
    remediation: "Apply security patch version 2.4.57",
    priority: "High"
  },
  {
    cve: "CVE-2024-0002", 
    remediation: "Update to OpenSSL 3.0.8 or later",
    priority: "Critical"
  }
];

export default function Remediation() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Remediation Insights</h1>
        <p className="text-muted-foreground">Track remediation progress and prioritize actions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Remediation Actions */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold mb-4">Top Remediation Actions</h3>
          <div className="space-y-4">
            {topActions.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                <div>
                  <p className="font-medium">{item.action}</p>
                  <p className="text-sm text-muted-foreground">Impacted: {item.impacted} systems</p>
                </div>
                <Badge variant={
                  item.priority === "Critical" ? "destructive" : 
                  item.priority === "High" ? "default" : 
                  "secondary"
                }>
                  {item.priority}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Unique Vuln to Fix Mapping */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold mb-4">Unique Vuln to Fix Mapping</h3>
          <div className="space-y-4">
            {vulnMapping.map((item, index) => (
              <div key={index} className="p-4 bg-muted/20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <code className="text-sm font-mono bg-background px-2 py-1 rounded">{item.cve}</code>
                  <Badge variant={item.priority === "Critical" ? "destructive" : "default"}>
                    {item.priority}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{item.remediation}</p>
              </div>
            ))}
          </div>
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
