
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

const clusterData = [
  { service: "Service/Product A", cveCount: 10, severity: "High" },
  { service: "Service/Product B", cveCount: 7, severity: "Medium" },
  { service: "Service/Product C", cveCount: 15, severity: "Critical" },
  { service: "Service/Product D", cveCount: 3, severity: "Low" },
];

export default function Clustering() {
  const [selectedCluster, setSelectedCluster] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Vulnerability Clustering</h1>
        <p className="text-muted-foreground">Group vulnerabilities by service, product, and impact</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cluster Visualization */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold mb-4">Vulnerability Distribution Map</h3>
          <div className="h-96 relative">
            {/* Tree map style visualization */}
            <div className="grid grid-cols-4 grid-rows-4 gap-2 h-full">
              <div className="col-span-2 row-span-2 bg-red-500/20 border-2 border-red-500/50 rounded-lg flex items-center justify-center">
                <span className="text-sm font-medium">Critical Services</span>
              </div>
              <div className="bg-yellow-500/20 border-2 border-yellow-500/50 rounded-lg flex items-center justify-center">
                <span className="text-xs">Web Apps</span>
              </div>
              <div className="bg-green-500/20 border-2 border-green-500/50 rounded-lg flex items-center justify-center">
                <span className="text-xs">Databases</span>
              </div>
              <div className="col-span-2 bg-orange-500/20 border-2 border-orange-500/50 rounded-lg flex items-center justify-center">
                <span className="text-sm">Infrastructure</span>
              </div>
              <div className="row-span-2 bg-blue-500/20 border-2 border-blue-500/50 rounded-lg flex items-center justify-center">
                <span className="text-sm">APIs</span>
              </div>
              <div className="bg-purple-500/20 border-2 border-purple-500/50 rounded-lg flex items-center justify-center">
                <span className="text-xs">Legacy</span>
              </div>
            </div>
          </div>
        </div>

        {/* Drill-down Modal */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold mb-4">Service Analysis</h3>
          <div className="space-y-4">
            <div className="p-4 bg-muted/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Service / Product A</h4>
                <span className="text-lg font-bold">10</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                  <span className="text-sm">Apache HTTP Server</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                  <span className="text-sm">OpenSSL Library</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CVE Count by Service */}
      <div className="chart-container">
        <h3 className="text-lg font-semibold mb-4">CVE Count by Service/Product</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4">Service/Product</th>
                <th className="text-left py-3 px-4">CVE Count</th>
                <th className="text-left py-3 px-4">Severity</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {clusterData.map((item, index) => (
                <tr key={index} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="py-3 px-4">{item.service}</td>
                  <td className="py-3 px-4 font-bold">{item.cveCount}</td>
                  <td className="py-3 px-4">
                    <Badge variant={
                      item.severity === "Critical" ? "destructive" : 
                      item.severity === "High" ? "default" : 
                      item.severity === "Medium" ? "secondary" : 
                      "outline"
                    }>
                      {item.severity}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <button 
                      className="text-primary hover:underline text-sm"
                      onClick={() => setSelectedCluster(item.service)}
                    >
                      View Details
                    </button>
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
