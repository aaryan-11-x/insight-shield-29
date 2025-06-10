
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UUID } from "crypto";
import { DownloadDropdown } from "@/components/DownloadDropdown";

interface EOLIPData {
  ip_address: unknown;
  risk_level: string;
  seol_component_count: number;
  instance_id: UUID;
}

export default function EOLIPs() {
  const { data: eolIPData, isLoading } = useQuery({
    queryKey: ['eol-ips'],
    queryFn: async () => {
      const instanceId = localStorage.getItem('currentInstanceId');
      const { data, error } = await supabase
        .from('eol_ip')
        .select('*')
        .eq('instance_id', instanceId)
        .order('seol_component_count', { ascending: false });
      
      if (error) {
        console.error('Error fetching EOL IP data:', error);
        throw error;
      }
      
      return data;
    }
  });

  // Calculate statistics
  const stats = eolIPData ? {
    totalIPsWithSEoLComponents: eolIPData.length,
    averageSEoLComponentsPerIP: eolIPData.length > 0 ? 
      (eolIPData.reduce((sum, ip) => sum + ip.seol_component_count, 0) / eolIPData.length).toFixed(2) : 0,
    maximumSEoLComponentsOnSingleIP: eolIPData.length > 0 ? 
      Math.max(...eolIPData.map(ip => ip.seol_component_count)) : 0,
    ipsWithOneSEoLComponent: eolIPData.filter(ip => ip.seol_component_count === 1).length,
    ipsWithTwoToFiveSEoLComponents: eolIPData.filter(ip => ip.seol_component_count >= 2 && ip.seol_component_count <= 5).length,
    ipsWithMoreThanFiveSEoLComponents: eolIPData.filter(ip => ip.seol_component_count > 5).length
  } : {
    totalIPsWithSEoLComponents: 0,
    averageSEoLComponentsPerIP: 0,
    maximumSEoLComponentsOnSingleIP: 0,
    ipsWithOneSEoLComponent: 0,
    ipsWithTwoToFiveSEoLComponents: 0,
    ipsWithMoreThanFiveSEoLComponents: 0
  };

  // Get top 10 IPs for chart
  const topIPsForChart = eolIPData ? eolIPData.slice(0, 10) : [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">EOL IPs</h1>
            <p className="text-muted-foreground">IP address analysis for end-of-life component tracking</p>
          </div>
          <DownloadDropdown />
        </div>
        <div className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">Loading EOL IP data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">EOL IPs</h1>
          <p className="text-muted-foreground">IP address analysis for end-of-life component tracking</p>
        </div>
        <DownloadDropdown />
      </div>

      {/* SEoL IP Statistics - Full Width */}
      <div className="chart-container">
        <h3 className="text-lg font-semibold mb-4">SEoL IP Statistics</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Total IPs with SEoL Components</span>
              <span className="font-bold">{stats.totalIPsWithSEoLComponents}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Average SEoL Components per IP</span>
              <span className="font-bold">{stats.averageSEoLComponentsPerIP}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Maximum SEoL Components on Single IP</span>
              <span className="font-bold">{stats.maximumSEoLComponentsOnSingleIP}</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">IPs with 1 SEoL Component</span>
              <span className="font-bold">{stats.ipsWithOneSEoLComponent}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">IPs with 2-5 SEoL Components</span>
              <span className="font-bold">{stats.ipsWithTwoToFiveSEoLComponents}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">IPs with &gt;5 SEoL Components</span>
              <span className="font-bold">{stats.ipsWithMoreThanFiveSEoLComponents}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Table and Chart Split 50/50 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top IPs Table - Left Side */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold mb-4">Top IPs with Most SEoL Components (For Chart)</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4">IP Address</th>
                  <th className="text-center py-3 px-4">SEoL Component Count</th>
                  <th className="text-center py-3 px-4">Risk Level</th>
                </tr>
              </thead>
              <tbody>
                {topIPsForChart.map((item, index) => (
                  <tr key={index} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-4 font-mono text-sm">{String(item.ip_address)}</td>
                    <td className="py-3 px-4 text-center font-bold">{item.seol_component_count}</td>
                    <td className="py-3 px-4 text-center">
                      <Badge variant={
                        item.risk_level === "Critical" ? "destructive" : 
                        item.risk_level === "High" ? "default" : 
                        item.risk_level === "Medium" ? "secondary" :
                        "outline"
                      }>
                        {item.risk_level}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Chart - Right Side */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold mb-4">Top 10 IPs by SEoL Component Count</h3>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topIPsForChart} layout="vertical" margin={{ top: 5, right: 30, left: 120, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis type="number" stroke="#9ca3af" />
                <YAxis type="category" dataKey="ip_address" stroke="#9ca3af" fontSize={10} width={110} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "#1f2937", 
                    border: "1px solid #374151",
                    borderRadius: "8px"
                  }}
                  labelFormatter={(value) => `IP: ${value}`}
                  formatter={(value, name) => [`${value}`, "SEoL Components"]}
                />
                <Bar dataKey="seol_component_count" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Complete List - Full Width */}
      <div className="chart-container">
        <h3 className="text-lg font-semibold mb-4">Complete List of All IPs with SEoL Components</h3>
        <div className="max-h-96 overflow-y-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-background">
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4">IP Address</th>
                <th className="text-center py-3 px-4">SEoL Component Count</th>
                <th className="text-center py-3 px-4">Risk Level</th>
              </tr>
            </thead>
            <tbody>
              {eolIPData?.map((item, index) => (
                <tr key={index} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="py-3 px-4 font-mono text-sm">{String(item.ip_address)}</td>
                  <td className="py-3 px-4 text-center font-bold">{item.seol_component_count}</td>
                  <td className="py-3 px-4 text-center">
                    <Badge variant={
                      item.risk_level === "Critical" ? "destructive" : 
                      item.risk_level === "High" ? "default" : 
                      item.risk_level === "Medium" ? "secondary" :
                      "outline"
                    }>
                      {item.risk_level}
                    </Badge>
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
