
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UUID } from "crypto";
import { DownloadDropdown } from "@/components/DownloadDropdown";

interface RemediationData {
  id: number;
  observations_impacted: number;
  percentage: number | null;
  remediation: string;
  instance_id: UUID;
}

export default function Remediation() {
  const { data: remediationData, isLoading } = useQuery({
    queryKey: ['remediation'],
    queryFn: async () => {
      const instanceId = localStorage.getItem('currentInstanceId');
      const { data, error } = await supabase
        .from('remediation_insights')
        .select('*')
        .eq('instance_id', instanceId)
        .order('observations_impacted', { ascending: false });
      
      if (error) {
        console.error('Error fetching remediation data:', error);
        throw error;
      }
      
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Remediation Insights</h1>
            <p className="text-muted-foreground">Track remediation progress and prioritize actions</p>
          </div>
          <DownloadDropdown />
        </div>
        <div className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">Loading remediation data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Remediation Insights</h1>
          <p className="text-muted-foreground">Track remediation progress and prioritize actions</p>
        </div>
        <DownloadDropdown />
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
