import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UUID } from "crypto";

interface PrioritizationData {
  metric: string;
  critical_count: number;
  high_count: number;
  medium_count: number;
  low_count: number;
  instance_id: UUID;
  run_id: string;
}

const METRIC_ORDER = {
  'CVSS': 1,
  'EPSS': 2,
  'VPR': 3,
  'CISA KEV': 4
};

export default function Prioritization() {
  const { data: prioritizationData, isLoading } = useQuery({
    queryKey: ['prioritization-insights'],
    queryFn: async () => {
      const instanceId = localStorage.getItem('currentInstanceId');
      const runId = localStorage.getItem('currentRunId');
      const { data, error } = await supabase
        .from('prioritization_insights')
        .select('*')
        .eq('instance_id', instanceId)
        .eq('run_id', runId);

      
      if (error) {
        console.error('Error fetching prioritization data:', error);
        throw error;
      }
      
      // Sort the data based on the predefined order
      return (data as PrioritizationData[]).sort((a, b) => 
        (METRIC_ORDER[a.metric as keyof typeof METRIC_ORDER] || 999) - 
        (METRIC_ORDER[b.metric as keyof typeof METRIC_ORDER] || 999)
      );
    }
  });

  const handleDownloadSheet = () => {
    console.log("Downloading prioritization sheet...");
  };

  // Transform data for charts
  const chartData = prioritizationData?.map(item => ({
    metric: item.metric,
    Critical: item.critical_count,
    High: item.high_count,
    Medium: item.medium_count,
    Low: item.low_count
  })) || [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Prioritization Insights</h1>
            <p className="text-muted-foreground">Vulnerability prioritization based on multiple factors</p>
          </div>
          <Button className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download Sheet
          </Button>
        </div>
        <div className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">Loading prioritization data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Prioritization Insights</h1>
          <p className="text-muted-foreground">Vulnerability prioritization based on multiple factors</p>
        </div>
        <Button onClick={handleDownloadSheet} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Download Sheet
        </Button>
      </div>

      {/* Priority Metrics Chart */}
      <div className="chart-container">
        <h3 className="text-lg font-semibold mb-4">Vulnerability Prioritization by Severity</h3>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="metric" 
                stroke="#9ca3af" 
                angle={-45}
                textAnchor="end"
                height={100}
                interval={0}
              />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "#1f2937", 
                  border: "1px solid #374151",
                  borderRadius: "8px"
                }} 
              />
              <Bar dataKey="Critical" stackId="a" fill="#ef4444" />
              <Bar dataKey="High" stackId="a" fill="#f97316" />
              <Bar dataKey="Medium" stackId="a" fill="#eab308" />
              <Bar dataKey="Low" stackId="a" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Priority Metrics Table */}
      <div className="chart-container">
        <h3 className="text-lg font-semibold mb-4">Detailed Prioritization Metrics</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4">Priority Metric</th>
                <th className="text-center py-3 px-4 bg-red-500/20">Critical</th>
                <th className="text-center py-3 px-4 bg-orange-500/20">High</th>
                <th className="text-center py-3 px-4 bg-yellow-500/20">Medium</th>
                <th className="text-center py-3 px-4 bg-green-500/20">Low</th>
                <th className="text-center py-3 px-4">Total</th>
              </tr>
            </thead>
            <tbody>
              {prioritizationData?.map((item, index) => (
                <tr key={index} className="border-b border-border/50 hover:bg-muted/20">
                  <td className="py-3 px-4 font-medium">{item.metric}</td>
                  <td className="py-3 px-4 text-center font-bold text-red-600">{item.critical_count}</td>
                  <td className="py-3 px-4 text-center font-bold text-orange-600">{item.high_count}</td>
                  <td className="py-3 px-4 text-center font-bold text-yellow-600">{item.medium_count}</td>
                  <td className="py-3 px-4 text-center font-bold text-green-600">{item.low_count}</td>
                  <td className="py-3 px-4 text-center font-bold">
                    {item.critical_count + item.high_count + item.medium_count + item.low_count}
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
