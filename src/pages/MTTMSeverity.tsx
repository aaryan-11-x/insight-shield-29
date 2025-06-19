import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UUID } from "crypto";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { useState } from "react";

interface MTTMSeverityData {
  average_mttm_days: number;
  id: number;
  risk_severity: string;
  vulnerability_count: number;
  instance_id: UUID;
  run_id: string;
}

// Custom Tooltip for BarChart
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 rounded bg-gray-800 border border-gray-700 text-white text-xs">
        <div className="font-semibold mb-1">{label}</div>
        <div>Vulnerability Count: <span className="font-mono">{payload[0].value}</span></div>
        <div>Average MTTM: <span className="font-mono">{payload[0].payload.averageMTTM.toFixed(1)}</span></div>
      </div>
    );
  }
  return null;
};

export default function MTTMSeverity() {
  const { data: mttmData, isLoading } = useQuery({
    queryKey: ['mttm-severity'],
    queryFn: async () => {
      const instanceId = localStorage.getItem('currentInstanceId');
      const runId = localStorage.getItem('currentRunId');
      const { data, error } = await supabase
        .from('mttm_by_severity')
        .select('*')
        .eq('instance_id', instanceId)
        .eq('run_id', runId)
        .order('average_mttm_days', { ascending: false });
      
      if (error) {
        console.error('Error fetching MTTM severity data:', error);
        throw error;
      }
      
      return data;
    }
  });

  const [isDownloading, setIsDownloading] = useState(false);

  // Transform data for chart display
  const chartData = mttmData?.map(item => ({
    severity: item.risk_severity,
    vulnerabilityCount: item.vulnerability_count,
    averageMTTM: item.average_mttm_days,
    color: item.risk_severity === "Critical" ? "#dc2626" :
           item.risk_severity === "High" ? "#ea580c" :
           item.risk_severity === "Medium" ? "#facc15" : // yellow
           item.risk_severity === "Low" ? "#16a34a" : "#6b7280"
  })) || [];

  // Download handler for Excel
  const handleDownloadSheet = async () => {
    try {
      setIsDownloading(true);
      const instanceId = localStorage.getItem('currentInstanceId');
      const runId = localStorage.getItem('currentRunId');
      if (!instanceId || !runId) {
        alert('Instance ID or Run ID not found');
        return;
      }
      const sheetName = '2.4. MTTM by Severity';
      const encodedSheetName = btoa(decodeURIComponent(encodeURIComponent(sheetName)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
      const response = await fetch(
        `http://192.168.89.143:8000/api/v1/download-sheet/${instanceId}/${runId}/${encodedSheetName}`,
        { method: 'GET' }
      );
      if (!response.ok) {
        throw new Error('Failed to download file');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${sheetName.replace(/ /g, '_')}.xls`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      alert('Failed to download file. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">MTTM by Severity</h1>
            <p className="text-muted-foreground">Mean Time to Mitigation analysis by vulnerability severity</p>
          </div>
          <Button 
            onClick={handleDownloadSheet}
            className="flex items-center gap-2"
            disabled={isDownloading}
          >
            {isDownloading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Downloading...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Download Sheet
              </>
            )}
          </Button>
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
        <Button 
          onClick={handleDownloadSheet}
          className="flex items-center gap-2"
          disabled={isDownloading}
        >
          {isDownloading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Downloading...
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              Download Sheet
            </>
          )}
        </Button>
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
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="vulnerabilityCount"
                  radius={[4, 4, 0, 0]}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
