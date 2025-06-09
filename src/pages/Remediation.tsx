
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface RemediationInsightData {
  id: number;
  remediation: string;
  observations_impacted: number;
  percentage: number | null;
}

export default function Remediation() {
  const { data: remediationData, isLoading } = useQuery({
    queryKey: ['remediation-insights'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('remediation_insights')
        .select('*')
        .order('observations_impacted', { ascending: false });
      
      if (error) {
        console.error('Error fetching remediation insights data:', error);
        throw error;
      }
      
      return data as RemediationInsightData[];
    }
  });

  // Get top 10 remediations for chart
  const top10Remediations = remediationData?.slice(0, 10) || [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Remediation Insights</h1>
          <p className="text-muted-foreground">Track remediation progress and prioritize actions</p>
        </div>
        <div className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">Loading remediation data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Remediation Insights</h1>
        <p className="text-muted-foreground">Track remediation progress and prioritize actions</p>
      </div>

      {/* Top 10 Remediations Chart */}
      <div className="chart-container">
        <h3 className="text-lg font-semibold mb-4">Top 10 Remediations by Observations</h3>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={top10Remediations} layout="horizontal" margin={{ left: 250, right: 30, top: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis type="number" stroke="#9ca3af" />
              <YAxis 
                dataKey="remediation" 
                type="category" 
                stroke="#9ca3af" 
                width={240}
                fontSize={11}
                tick={{ fontSize: 11 }}
                interval={0}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "#1f2937", 
                  border: "1px solid #374151",
                  borderRadius: "8px"
                }} 
              />
              <Bar 
                dataKey="observations_impacted" 
                fill="#10b981"
                stroke="#10b981"
                strokeWidth={1}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Remediation Insights Table */}
      <div className="chart-container">
        <h3 className="text-lg font-semibold mb-4">Remediations by Observations</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4">Remediation</th>
                <th className="text-center py-3 px-4">Observations Impacted</th>
                <th className="text-center py-3 px-4">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {remediationData?.map((item, index) => (
                <tr key={index} className="border-b border-border/50 hover:bg-muted/20">
                  <td className="py-3 px-4">
                    <div className="max-w-md">
                      <p className="text-sm">{item.remediation}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center font-bold">{item.observations_impacted}</td>
                  <td className="py-3 px-4 text-center">
                    {item.percentage ? `${item.percentage.toFixed(1)}%` : "—"}
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
