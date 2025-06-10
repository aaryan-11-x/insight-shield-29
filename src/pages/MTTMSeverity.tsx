import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UUID } from "crypto";
import { DownloadDropdown } from "@/components/DownloadDropdown";

interface MTTMSeverityData {
  average_mttm_days: number;
  id: number;
  risk_severity: string;
  vulnerability_count: number;
  instance_id: UUID;
}

export default function MTTMSeverity() {
  const { data: mttmData, isLoading } = useQuery({
    queryKey: ['mttm-severity'],
    queryFn: async () => {
      const instanceId = localStorage.getItem('currentInstanceId');
      const { data, error } = await supabase
        .from('mttm_by_severity')
        .select('*')
        .eq('instance_id', instanceId)
        .order('average_mttm_days', { ascending: false });
      
      if (error) {
        console.error('Error fetching MTTM severity data:', error);
        throw error;
      }
      
      return data;
    }
  });

  // Transform data for chart display
  const chartData = mttmData?.map(item => ({
    severity: item.risk_severity,
    vulnerabilityCount: item.vulnerability_count,
    averageMTTM: item.average_mttm_days,
    color: item.risk_severity === "Critical" ? "#dc2626" :
           item.risk_severity === "High" ? "#ea580c" :
           item.risk_severity === "Medium" ? "#ca8a04" : "#16a34a"
  })) || [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">MTTM by Severity</h1>
            <p className="text-muted-foreground">Mean Time to Mitigation analysis by vulnerability severity</p>
          </div>
          <DownloadDropdown />
        </div>
        <div className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">Loading MTTM data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">MTTM by Severity</h1>
          <p className="text-muted-foreground">Mean Time to Mitigation analysis by vulnerability severity</p>
        </div>
        <DownloadDropdown />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* MTTM Table */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold mb-4">MTTM by Severity</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4">Risk Severity</th>
                  <th className="text-center py-3 px-4">Vulnerability Count</th>
                  <th className="text-center py-3 px-4">Average MTTM (Days)</th>
                </tr>
              </thead>
              <tbody>
                {chartData.map((item, index) => (
                  <tr key={index} className="border-b border-border/50 hover:bg-muted/20">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="font-medium">{item.severity}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center font-mono">{item.vulnerabilityCount.toLocaleString()}</td>
                    <td className="py-3 px-4 text-center font-mono">{item.averageMTTM.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Vulnerability Count by Severity Chart */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold mb-4">Vulnerability Count by Severity</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
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
                <Bar 
                  dataKey="vulnerabilityCount" 
                  fill="#16a34a"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
