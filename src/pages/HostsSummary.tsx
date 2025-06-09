import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface HostData {
  host: string;
  critical: number;
  high: number;
  medium: number;
  low: number;
  vulnerabilities_with_cve: number;
  vulnerability_count: number;
  instance_id: string;
}

export default function HostsSummary() {
  const { data: hostData, isLoading, error } = useQuery({
    queryKey: ['host-summary'],
    queryFn: async () => {
      const instanceId = localStorage.getItem('currentInstanceId');
      const { data, error } = await supabase
        .from('host_summary')
        .select('*')
        .eq('instance_id', instanceId)
        .order('vulnerability_count', { ascending: false });
      
      if (error) {
        console.error('Error fetching host summary data:', error);
        throw error;
      }
      
      return data;
    }
  });

  // Calculate summary statistics from the fetched data
  const summaryStats = {
    totalHosts: hostData?.length || 0,
    totalVulnerabilities: hostData?.reduce((sum, host) => sum + host.vulnerability_count, 0) || 0,
    totalVulnerabilitiesWithCVE: hostData?.reduce((sum, host) => sum + host.vulnerabilities_with_cve, 0) || 0
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Hosts Summary</h1>
            <p className="text-muted-foreground">Comprehensive overview of host vulnerabilities and risk assessment</p>
          </div>
          <Button className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download Report
          </Button>
        </div>
        <div className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">Loading host data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Hosts Summary</h1>
            <p className="text-muted-foreground">Comprehensive overview of host vulnerabilities and risk assessment</p>
          </div>
          <Button className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download Report
          </Button>
        </div>
        <div className="flex items-center justify-center py-8">
          <p className="text-red-400">Error loading host data: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Hosts Summary</h1>
          <p className="text-muted-foreground">Comprehensive overview of host vulnerabilities and risk assessment</p>
        </div>
        <Button className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Download Report
        </Button>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="metric-card">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Total Hosts</p>
            <p className="text-2xl font-bold">{summaryStats.totalHosts.toLocaleString()}</p>
          </div>
        </div>
        <div className="metric-card">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Total Vulnerabilities</p>
            <p className="text-2xl font-bold">{summaryStats.totalVulnerabilities.toLocaleString()}</p>
          </div>
        </div>
        <div className="metric-card">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Total Vulnerabilities with CVE</p>
            <p className="text-2xl font-bold">{summaryStats.totalVulnerabilitiesWithCVE.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Hosts Summary Table */}
      <div className="chart-container">
        <h3 className="text-lg font-semibold mb-4">Hosts Summary</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4">Host</th>
                <th className="text-center py-3 px-4">Vulnerability Count</th>
                <th className="text-center py-3 px-4">Vulnerabilities with CVE</th>
                <th className="text-center py-3 px-4">Critical</th>
                <th className="text-center py-3 px-4">High</th>
                <th className="text-center py-3 px-4">Medium</th>
                <th className="text-center py-3 px-4">Low</th>
              </tr>
            </thead>
            <tbody>
              {hostData?.map((item, index) => (
                <tr key={index} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="py-3 px-4 font-mono text-sm">{item.host}</td>
                  <td className="py-3 px-4 text-center font-bold">{item.vulnerability_count}</td>
                  <td className="py-3 px-4 text-center font-mono">{item.vulnerabilities_with_cve}</td>
                  <td className="py-3 px-4 text-center text-red-400 font-bold">{item.critical}</td>
                  <td className="py-3 px-4 text-center text-orange-400 font-bold">{item.high}</td>
                  <td className="py-3 px-4 text-center text-yellow-400 font-bold">{item.medium}</td>
                  <td className="py-3 px-4 text-center text-green-400 font-bold">{item.low}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {hostData?.length === 0 && (
        <div className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">No host data found.</p>
        </div>
      )}
    </div>
  );
}
