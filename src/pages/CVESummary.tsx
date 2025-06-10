import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UUID } from "crypto";
import { DownloadDropdown } from "@/components/DownloadDropdown";

interface CVEData {
  instance_id: UUID;
  cve: string;
  count: number | null;
  severity: string | null;
  name: string | null;
  description: string | null;
  hosts: string | null;
  solutions: string | null;
}

export default function CVESummary() {
  const { data: cveData, isLoading, error } = useQuery({
    queryKey: ['cve-summary'],
    queryFn: async () => {
      const instanceId = localStorage.getItem('currentInstanceId');
      const { data, error } = await supabase
        .from('cve_summary')
        .select('*')
        .eq('instance_id', instanceId)
        .order('count', { ascending: false });
      
      if (error) {
        console.error('Error fetching CVE summary data:', error);
        throw error;
      }
      
      return data;
    }
  });

  // Calculate summary statistics from the fetched data
  const summaryStats = {
    totalCves: cveData?.length || 0,
    critical: cveData?.filter(item => item.severity === "Critical").length || 0,
    high: cveData?.filter(item => item.severity === "High").length || 0,
    medium: cveData?.filter(item => item.severity === "Medium").length || 0,
    low: cveData?.filter(item => item.severity === "Low" || item.severity === "Low/None").length || 0,
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">CVE Summary</h1>
            <p className="text-muted-foreground">CVE summary and executive overview</p>
          </div>
          <DownloadDropdown />
        </div>
        <div className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">Loading CVE data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">CVE Summary</h1>
            <p className="text-muted-foreground">CVE summary and executive overview</p>
          </div>
          <DownloadDropdown />
        </div>
        <div className="flex items-center justify-center py-8">
          <p className="text-red-400">Error loading CVE data: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">CVE Summary</h1>
          <p className="text-muted-foreground">CVE summary and executive overview</p>
        </div>
        <DownloadDropdown />
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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
      </div>

      {/* CVE Details Table */}
      <div className="chart-container">
        <h3 className="text-lg font-semibold mb-4">CVE Details</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4">CVE</th>
                <th className="text-center py-3 px-4">Count</th>
                <th className="text-center py-3 px-4">Severity</th>
                <th className="text-left py-3 px-4">Name</th>
                <th className="text-left py-3 px-4">Description</th>
                <th className="text-left py-3 px-4">Hosts</th>
                <th className="text-left py-3 px-4">Solutions</th>
              </tr>
            </thead>
            <tbody>
              {cveData?.map((item, index) => (
                <tr key={index} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="py-3 px-4">
                    <code className="text-sm font-mono bg-background px-2 py-1 rounded">{item.cve}</code>
                  </td>
                  <td className="py-3 px-4 text-center font-bold">{item.count || 0}</td>
                  <td className="py-3 px-4 text-center">
                    <Badge variant={
                      item.severity === "Critical" ? "destructive" : 
                      item.severity === "High" ? "default" : 
                      "secondary"
                    }>
                      {item.severity || "Unknown"}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-sm font-medium max-w-xs">{item.name || "N/A"}</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground max-w-md">
                    <div className="line-clamp-3">{item.description || "N/A"}</div>
                  </td>
                  <td className="py-3 px-4 text-xs text-muted-foreground max-w-xs">
                    <div className="line-clamp-2">{item.hosts || "N/A"}</div>
                  </td>
                  <td className="py-3 px-4 text-sm text-muted-foreground max-w-md">
                    <div className="line-clamp-3">{item.solutions || "N/A"}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {cveData?.length === 0 && (
        <div className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">No CVE data found.</p>
        </div>
      )}
    </div>
  );
}
