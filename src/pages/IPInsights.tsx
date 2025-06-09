
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface IPInsightsData {
  ip_address: string;
  hostname: string | null;
  total_vulnerabilities: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  kev_count: number;
  exploitability_score: number;
  most_common_category: string | null;
  last_scan_date: string | null;
}

export default function IPInsights() {
  const { data: ipInsightsData, isLoading } = useQuery({
    queryKey: ['ip-insights'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ip_insights')
        .select('*')
        .order('total_vulnerabilities', { ascending: false });
      
      if (error) {
        console.error('Error fetching IP insights data:', error);
        throw error;
      }
      
      return data as IPInsightsData[];
    }
  });

  // Calculate statistics from the data
  const stats = ipInsightsData ? {
    totalHosts: ipInsightsData.length,
    totalVulnerabilities: ipInsightsData.reduce((sum, host) => sum + host.total_vulnerabilities, 0),
    hostsWithVulnerabilities: ipInsightsData.filter(host => host.total_vulnerabilities > 0).length,
    hostsWithCritical: ipInsightsData.filter(host => host.critical > 0).length,
    hostsWithHigh: ipInsightsData.filter(host => host.high > 0).length,
    top5Hosts: ipInsightsData.slice(0, 5).map(host => host.ip_address).join(', ')
  } : {
    totalHosts: 0,
    totalVulnerabilities: 0,
    hostsWithVulnerabilities: 0,
    hostsWithCritical: 0,
    hostsWithHigh: 0,
    top5Hosts: ''
  };

  const vulnerabilityDistributionData = ipInsightsData ? [
    { name: "Critical", value: ipInsightsData.reduce((sum, host) => sum + host.critical, 0), color: "#dc2626" },
    { name: "High", value: ipInsightsData.reduce((sum, host) => sum + host.high, 0), color: "#ea580c" },
    { name: "Medium", value: ipInsightsData.reduce((sum, host) => sum + host.medium, 0), color: "#ca8a04" },
    { name: "Low", value: ipInsightsData.reduce((sum, host) => sum + host.low, 0), color: "#16a34a" },
  ] : [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">IP Insights</h1>
          <p className="text-muted-foreground">This sheet provides a detailed breakdown of vulnerabilities per IP, facilitating operational planning and remediation prioritization</p>
        </div>
        <div className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">Loading IP insights data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">IP Insights</h1>
        <p className="text-muted-foreground">This sheet provides a detailed breakdown of vulnerabilities per IP, facilitating operational planning and remediation prioritization</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Hosts</p>
              <p className="text-3xl font-bold">{stats.totalHosts}</p>
            </div>
          </div>
        </div>
        <div className="bg-card p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Vulnerabilities</p>
              <p className="text-3xl font-bold">{stats.totalVulnerabilities.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Operational Planning Statistics */}
      <div className="chart-container">
        <h3 className="text-lg font-semibold mb-4">Operational Planning Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-background p-4 rounded border">
            <p className="text-sm text-muted-foreground">Total Hosts Scanned</p>
            <p className="text-2xl font-bold">{stats.totalHosts}</p>
          </div>
          <div className="bg-background p-4 rounded border">
            <p className="text-sm text-muted-foreground">Hosts with Vulnerabilities</p>
            <p className="text-2xl font-bold">{stats.hostsWithVulnerabilities} <span className="text-sm text-muted-foreground">({stats.totalHosts > 0 ? ((stats.hostsWithVulnerabilities / stats.totalHosts) * 100).toFixed(1) : 0}%)</span></p>
          </div>
          <div className="bg-background p-4 rounded border">
            <p className="text-sm text-muted-foreground">Hosts with Critical Vulnerabilities</p>
            <p className="text-2xl font-bold">{stats.hostsWithCritical} <span className="text-sm text-muted-foreground">({stats.totalHosts > 0 ? ((stats.hostsWithCritical / stats.totalHosts) * 100).toFixed(1) : 0}%)</span></p>
          </div>
          <div className="bg-background p-4 rounded border">
            <p className="text-sm text-muted-foreground">Hosts with High Vulnerabilities</p>
            <p className="text-2xl font-bold">{stats.hostsWithHigh} <span className="text-sm text-muted-foreground">({stats.totalHosts > 0 ? ((stats.hostsWithHigh / stats.totalHosts) * 100).toFixed(1) : 0}%)</span></p>
          </div>
          <div className="bg-background p-4 rounded border md:col-span-2">
            <p className="text-sm text-muted-foreground">Top 5 Hosts Need Remediation</p>
            <p className="text-lg font-mono">{stats.top5Hosts}</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vulnerability Distribution */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold mb-4">Vulnerability Distribution by Severity</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={vulnerabilityDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {vulnerabilityDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {vulnerabilityDistributionData.map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Host Categories */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold mb-4">Top Hosts by Vulnerability Count</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ipInsightsData?.slice(0, 7)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="ip_address" stroke="#9ca3af" fontSize={10} angle={-45} textAnchor="end" height={80} />
                <YAxis stroke="#9ca3af" />
                <Tooltip />
                <Bar dataKey="total_vulnerabilities" fill="#3b82f6" name="Total Vulnerabilities" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* IP Details Table */}
      <div className="chart-container">
        <h3 className="text-lg font-semibold mb-4">IP Address Details</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-2">IP Address</th>
                <th className="text-left py-3 px-2">Hostname</th>
                <th className="text-center py-3 px-2">Total</th>
                <th className="text-center py-3 px-2">Critical</th>
                <th className="text-center py-3 px-2">High</th>
                <th className="text-center py-3 px-2">Medium</th>
                <th className="text-center py-3 px-2">Low</th>
                <th className="text-center py-3 px-2">KEV</th>
                <th className="text-center py-3 px-2">Exploit Score</th>
                <th className="text-left py-3 px-2">Category</th>
                <th className="text-left py-3 px-2">Last Scan</th>
              </tr>
            </thead>
            <tbody>
              {ipInsightsData?.map((item, index) => (
                <tr key={index} className="border-b border-border/50 hover:bg-muted/20">
                  <td className="py-3 px-2 font-mono text-xs">{item.ip_address}</td>
                  <td className="py-3 px-2">{item.hostname || "—"}</td>
                  <td className="py-3 px-2 text-center font-bold">{item.total_vulnerabilities}</td>
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
                  <td className="py-3 px-2 text-center">{item.kev_count}</td>
                  <td className="py-3 px-2 text-center font-mono">{item.exploitability_score}</td>
                  <td className="py-3 px-2">{item.most_common_category || "—"}</td>
                  <td className="py-3 px-2 text-muted-foreground">{item.last_scan_date || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
