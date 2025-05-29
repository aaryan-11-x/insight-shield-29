
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const eolSummaryStats = {
  totalEOLComponents: 47,
  criticalRisk: 12,
  totalInstances: 234,
  avgEOLAge: "18 months"
};

const eolComponentsData = [
  {
    component: "Windows Server 2012",
    product: "Microsoft Windows",
    eolDate: "2023-10-10",
    riskLevel: "Critical",
    instances: 45
  },
  {
    component: "Apache HTTP Server 2.2",
    product: "Apache Software Foundation",
    eolDate: "2023-07-15",
    riskLevel: "High",
    instances: 38
  },
  {
    component: "PHP 7.4",
    product: "PHP Group",
    eolDate: "2022-11-28",
    riskLevel: "High",
    instances: 32
  },
  {
    component: "MySQL 5.7",
    product: "Oracle Corporation",
    eolDate: "2023-10-31",
    riskLevel: "Medium",
    instances: 28
  },
  {
    component: "Node.js 14.x",
    product: "Node.js Foundation",
    eolDate: "2023-04-30",
    riskLevel: "Medium",
    instances: 25
  },
  {
    component: "Ubuntu 18.04 LTS",
    product: "Canonical",
    eolDate: "2023-05-31",
    riskLevel: "High",
    instances: 22
  },
  {
    component: "OpenSSL 1.1.1",
    product: "OpenSSL Project",
    eolDate: "2023-09-11",
    riskLevel: "Critical",
    instances: 19
  },
  {
    component: "jQuery 1.x",
    product: "jQuery Foundation",
    eolDate: "2022-12-31",
    riskLevel: "Low",
    instances: 15
  },
  {
    component: "CentOS 7",
    product: "Red Hat",
    eolDate: "2024-06-30",
    riskLevel: "Medium",
    instances: 10
  }
];

const topIPsByEOLData = [
  { ip: "192.168.1.10", eolCount: 12 },
  { ip: "192.168.1.25", eolCount: 10 },
  { ip: "192.168.1.33", eolCount: 9 },
  { ip: "192.168.1.15", eolCount: 8 },
  { ip: "192.168.1.50", eolCount: 7 },
  { ip: "192.168.1.67", eolCount: 6 },
  { ip: "192.168.1.89", eolCount: 5 },
  { ip: "192.168.1.102", eolCount: 4 },
  { ip: "192.168.1.145", eolCount: 3 },
  { ip: "192.168.1.178", eolCount: 2 }
];

export default function EOLComponents() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">EOL Components</h1>
          <p className="text-muted-foreground">End-of-life component tracking and risk assessment</p>
        </div>
        <Button className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Download Report
        </Button>
      </div>

      {/* EOL Summary Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="metric-card">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Total EOL Components</p>
            <p className="text-2xl font-bold">{eolSummaryStats.totalEOLComponents}</p>
          </div>
        </div>
        <div className="metric-card">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Critical Risk</p>
            <p className="text-2xl font-bold text-red-400">{eolSummaryStats.criticalRisk}</p>
          </div>
        </div>
        <div className="metric-card">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Total Instances</p>
            <p className="text-2xl font-bold">{eolSummaryStats.totalInstances}</p>
          </div>
        </div>
        <div className="metric-card">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Avg. EOL Age</p>
            <p className="text-2xl font-bold">{eolSummaryStats.avgEOLAge}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* EOL Components Inventory Table */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold mb-4">EOL Components Inventory</h3>
          <div className="max-h-96 overflow-y-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-background">
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4">Component</th>
                  <th className="text-left py-3 px-4">Product</th>
                  <th className="text-left py-3 px-4">EOL Date</th>
                  <th className="text-left py-3 px-4">Risk Level</th>
                  <th className="text-center py-3 px-4">Instances</th>
                </tr>
              </thead>
              <tbody>
                {eolComponentsData.map((item, index) => (
                  <tr key={index} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-4 font-medium text-sm">{item.component}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{item.product}</td>
                    <td className="py-3 px-4 text-sm">{item.eolDate}</td>
                    <td className="py-3 px-4">
                      <Badge variant={
                        item.riskLevel === "Critical" ? "destructive" : 
                        item.riskLevel === "High" ? "default" : 
                        item.riskLevel === "Medium" ? "secondary" :
                        "outline"
                      }>
                        {item.riskLevel}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-center font-bold">{item.instances}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top 10 IPs by EOL Component Count */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold mb-4">Top 10 IPs by EOL Component Count</h3>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topIPsByEOLData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="ip" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "#1f2937", 
                    border: "1px solid #374151",
                    borderRadius: "8px"
                  }} 
                />
                <Bar dataKey="eolCount" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
