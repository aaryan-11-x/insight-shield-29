import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EOLSummary() {
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch EOL Components data
  const { data: eolComponentsData, isLoading: componentsLoading } = useQuery({
    queryKey: ['eol-components'],
    queryFn: async () => {
      const instanceId = localStorage.getItem('currentInstanceId');
      const runId = localStorage.getItem('currentRunId');
      const { data, error } = await supabase
        .from('eol_components')
        .select('*')
        .eq('instance_id', instanceId)
        .eq('run_id', runId);
      
      if (error) {
        console.error('Error fetching EOL components data:', error);
        throw error;
      }
      
      return data;
    }
  });

  // Fetch EOL IP data
  const { data: eolIpData, isLoading: ipLoading } = useQuery({
    queryKey: ['eol-ip'],
    queryFn: async () => {
      const instanceId = localStorage.getItem('currentInstanceId');
      const runId = localStorage.getItem('currentRunId');
      const { data, error } = await supabase
        .from('eol_ip')
        .select('*')
        .eq('instance_id', instanceId)
        .eq('run_id', runId);
      
      if (error) {
        console.error('Error fetching EOL IP data:', error);
        throw error;
      }
      
      return data;
    }
  });

  // Fetch EOL Versions data
  const { data: eolVersionsData, isLoading: versionsLoading } = useQuery({
    queryKey: ['eol-versions'],
    queryFn: async () => {
      const instanceId = localStorage.getItem('currentInstanceId');
      const runId = localStorage.getItem('currentRunId');
      const { data, error } = await supabase
        .from('eol_versions')
        .select('*')
        .eq('instance_id', instanceId)
        .eq('run_id', runId);
      
      if (error) {
        console.error('Error fetching EOL versions data:', error);
        throw error;
      }
      
      return data;
    }
  });

  const isLoading = componentsLoading || ipLoading || versionsLoading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">EOL Summary</h1>
            <p className="text-muted-foreground">Comprehensive overview of end-of-life components and risk assessment</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">Loading EOL summary data...</p>
        </div>
      </div>
    );
  }

  if (!eolComponentsData || !eolIpData || !eolVersionsData) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">EOL Summary</h1>
            <p className="text-muted-foreground">Comprehensive overview of end-of-life components and risk assessment</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-8">
          <p className="text-red-400">Error loading EOL summary data</p>
        </div>
      </div>
    );
  }

  if (
    Array.isArray(eolComponentsData) && eolComponentsData.length === 0 &&
    Array.isArray(eolIpData) && eolIpData.length === 0 &&
    Array.isArray(eolVersionsData) && eolVersionsData.length === 0
  ) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="rounded-full bg-muted p-6 mb-4 shadow">
          <Download className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-semibold mb-2">No EOL summary data available</h2>
        <p className="text-muted-foreground text-center max-w-md">There is no end-of-life summary data for the selected instance and run. Try uploading new data or selecting a different run.</p>
      </div>
    );
  }

  // Calculate metrics from the actual data
  const totalUniqueComponents = eolComponentsData.length;
  const softwareTypesAffected = new Set(eolComponentsData.map(item => item.software)).size;
  const hostsWithEolComponents = eolIpData.length;
  const uniqueEolVersions = eolVersionsData.length;

  // Calculate risk distribution from EOL Components data (not IP data)
  const riskDistribution = eolComponentsData.reduce((acc, item) => {
    const risk = item.risk?.toLowerCase() || 'unknown';
    acc[risk] = (acc[risk] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalRiskItems = Object.values(riskDistribution).reduce((sum, count) => sum + count, 0);

  const pieChartData = [
    { 
      name: "Critical", 
      value: riskDistribution.critical || 0, 
      color: "#ef4444",
      percentage: totalRiskItems > 0 ? ((riskDistribution.critical || 0) / totalRiskItems * 100).toFixed(1) : '0.0'
    },
    { 
      name: "High", 
      value: riskDistribution.high || 0, 
      color: "#f97316",
      percentage: totalRiskItems > 0 ? ((riskDistribution.high || 0) / totalRiskItems * 100).toFixed(1) : '0.0'
    },
    { 
      name: "Medium", 
      value: riskDistribution.medium || 0, 
      color: "#eab308",
      percentage: totalRiskItems > 0 ? ((riskDistribution.medium || 0) / totalRiskItems * 100).toFixed(1) : '0.0'
    },
    { 
      name: "Low", 
      value: riskDistribution.low || 0, 
      color: "#22c55e",
      percentage: totalRiskItems > 0 ? ((riskDistribution.low || 0) / totalRiskItems * 100).toFixed(1) : '0.0'
    }
  ];

  // Calculate software types from EOL versions data using unique_vulnerability_count
  const softwareTypeCount = eolVersionsData.reduce((acc, item) => {
    const softwareType = item.software_type;
    acc[softwareType] = (acc[softwareType] || 0) + item.unique_vulnerability_count;
    return acc;
  }, {} as Record<string, number>);

  const topEOLSoftwareTypes = Object.entries(softwareTypeCount)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10); // Show top 10

  const handleDownloadSheet = async () => {
    try {
      setIsDownloading(true);
      const instanceId = localStorage.getItem('currentInstanceId');
      const runId = localStorage.getItem('currentRunId');
      
      if (!instanceId || !runId) {
        console.error('Instance ID or Run ID not found');
        toast({
          variant: "destructive",
          title: "Error",
          description: "Instance ID or Run ID not found",
          duration: 4000,
        });
        return;
      }

      // Encode the sheet name in Base64 URL-safe format
      const sheetName = "5.0 EOL Summary";
      const encodedSheetName = btoa(decodeURIComponent(encodeURIComponent(sheetName)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      // Make the API request
      const response = await fetch(
        `http://192.168.1.102:8000/api/v1/download-sheet/${instanceId}/${runId}/${encodedSheetName}`,
        {
          method: 'GET',
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.detail || `HTTP error! status: ${response.status}`);
      }

      // Get the blob from the response
      const blob = await response.blob();
      
      // Create a download link and trigger the download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${sheetName.replace(' ', '_')}.xls`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading sheet:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to download sheet',
        duration: 4000,
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">EOL Summary</h1>
          <p className="text-muted-foreground">Comprehensive overview of end-of-life components and risk assessment</p>
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

      {/* End of Life Components Summary */}
      <div className="chart-container">
        <h2 className="text-xl font-semibold mb-6">End of Life Components Summary</h2>

        {/* EOL Summary Statistics */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">EOL Summary Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div 
              className="metric-card cursor-pointer hover:bg-muted/20 transition-colors"
              onClick={() => navigate('/dashboard/eol-components')}
            >
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Total Unique EOL Components</p>
                <p className="text-2xl font-bold">{totalUniqueComponents}</p>
              </div>
            </div>
            <div className="metric-card">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Software Types Affected</p>
                <p className="text-2xl font-bold">{softwareTypesAffected}</p>
              </div>
            </div>
            <div 
              className="metric-card cursor-pointer hover:bg-muted/20 transition-colors"
              onClick={() => navigate('/dashboard/eol-ips')}
            >
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Hosts with EOL Components</p>
                <p className="text-2xl font-bold">{hostsWithEolComponents}</p>
              </div>
            </div>
            <div 
              className="metric-card cursor-pointer hover:bg-muted/20 transition-colors"
              onClick={() => navigate('/dashboard/eol-versions')}
            >
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Unique EOL Versions</p>
                <p className="text-2xl font-bold">{uniqueEolVersions}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Distribution */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Risk Distribution</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-center py-3 px-4">Critical</th>
                  <th className="text-center py-3 px-4">High</th>
                  <th className="text-center py-3 px-4">Medium</th>
                  <th className="text-center py-3 px-4">Low</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4 text-center text-red-400 font-bold">{riskDistribution.critical || 0}</td>
                  <td className="py-3 px-4 text-center text-orange-400 font-bold">{riskDistribution.high || 0}</td>
                  <td className="py-3 px-4 text-center text-yellow-400 font-bold">{riskDistribution.medium || 0}</td>
                  <td className="py-3 px-4 text-center text-green-400 font-bold">{riskDistribution.low || 0}</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4 text-center">{pieChartData[0].percentage}%</td>
                  <td className="py-3 px-4 text-center">{pieChartData[1].percentage}%</td>
                  <td className="py-3 px-4 text-center">{pieChartData[2].percentage}%</td>
                  <td className="py-3 px-4 text-center">{pieChartData[3].percentage}%</td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="border-t border-border">
                  <td colSpan={3} className="py-3 px-4 font-semibold">Total</td>
                  <td className="py-3 px-4 text-center font-bold">{totalRiskItems}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart - Top EOL Software Types */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold mb-4">Top EOL Software Types</h3>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topEOLSoftwareTypes} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  type="number"
                  stroke="#9ca3af"
                  domain={[0, 'dataMax + 10']}
                  label={{
                    value: "Unique Vulnerability Count",
                    position: "insideBottom",
                    offset: -5,
                    fill: "#9ca3af",
                    fontSize: 12
                  }}
                />
                <YAxis type="category" dataKey="name" stroke="#9ca3af" fontSize={12} width={120} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px"
                  }}
                  formatter={(value, name) => [value, "Unique Vulnerability Count"]}
                />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart - EOL Components by Risk Level */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold mb-4">EOL Components by Risk Level</h3>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name} ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    color: "#000000"
                  }}
                  formatter={(value, name) => {
                    return [
                      <span style={{ color: "#000000" }}>{`${name}: ${value}`}</span>,
                      null
                    ];
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
