import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Badge } from "@/components/ui/badge";
import { SimpleMetricCard } from "@/components/SimpleMetricCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UUID } from "crypto";
import { DownloadDropdown } from "@/components/DownloadDropdown";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Download, Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface EOLComponentData {
  created_at: string;
  software: string;
  software_extraction_status: string;
  plugin_id: number;
  risk: string;
  instance_id: UUID;
  run_id: string;
}

interface EOLIPData {
  unique_eol_vulnerabilities: number;
  instance_id: string;
  run_id: string;
}

const ITEMS_PER_PAGE = 75;

export default function EOLComponents() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  const { data: eolData, isLoading } = useQuery({
    queryKey: ['eol-components'],
    queryFn: async () => {
      const instanceId = localStorage.getItem('currentInstanceId');
      const runId = localStorage.getItem('currentRunId');
      const { data, error } = await supabase
        .from('eol_components')
        .select('plugin_id, software, software_extraction_status, risk')
        .eq('instance_id', instanceId)
        .eq('run_id', runId)
        .order('risk', { ascending: false });
      
      if (error) {
        console.error('Error fetching EOL components data:', error);
        throw error;
      }
      
      // Sort by risk level: Critical, High, Medium
      const riskOrder = { "Critical": 3, "High": 2, "Medium": 1 };
      return data?.sort((a, b) => {
        // Put "Unknown" software types at the end regardless of risk
        if (a.software === "Unknown" && b.software !== "Unknown") return 1;
        if (a.software !== "Unknown" && b.software === "Unknown") return -1;
        
        // Then sort by risk level
        return (riskOrder[b.risk as keyof typeof riskOrder] || 0) - (riskOrder[a.risk as keyof typeof riskOrder] || 0);
      });
    },
    staleTime: 5 * 60 * 1000, // Data stays fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Cache is kept for 10 minutes
  });

  const { data: eolIPData, isLoading: ipLoading } = useQuery({
    queryKey: ['eol-ip-data'],
    queryFn: async () => {
      const instanceId = localStorage.getItem('currentInstanceId');
      const runId = localStorage.getItem('currentRunId');
      const { data, error } = await supabase
        .from('eol_ip')
        .select('unique_eol_vulnerabilities')
        .eq('instance_id', instanceId)
        .eq('run_id', runId);
      
      if (error) {
        console.error('Error fetching EOL IP data:', error);
        throw error;
      }
      
      return data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  // Map risk → numeric value
  const riskValueMap: Record<string, number> = {
    "Critical": 3,
    "High": 2,
    "Medium": 1
  };

  // Pagination
  const totalPages = eolData ? Math.ceil(eolData.length / ITEMS_PER_PAGE) : 0;
  const paginatedData = eolData?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Prepare chart data
  const chartData = eolData?.map(item => ({
    name: item.software.replace(" SEoL", ""),
    risk: item.risk,
    riskValue: riskValueMap[item.risk] ?? 0
  })) || [];

  // Prepare risk distribution data
  const riskDistribution = eolData?.reduce((acc, item) => {
    acc[item.risk] = (acc[item.risk] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const riskChartData = Object.entries(riskDistribution).map(([risk, count]) => ({
    risk,
    count,
    color: risk === "Critical" ? "#ef4444" : risk === "High" ? "#f59e0b" : "#3b82f6"
  }));

  // Calculate total SEoL instances across all hosts
  const totalSEoLInstances = eolIPData?.reduce((sum, item) => sum + item.unique_eol_vulnerabilities, 0) || 0;

  // Calculate affected hosts count
  const affectedHostsCount = eolIPData?.length || 0;

  // Calculate unique software components count
  const uniqueSoftwareCount = eolData ? new Set(eolData.map(item => item.plugin_id)).size : 0;

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
      const sheetName = "5.1 EOL Components";
      const encodedSheetName = btoa(decodeURIComponent(encodeURIComponent(sheetName)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      // Make the API request
      const response = await fetch(
        `http://192.168.89.143/api/v1/download-sheet/${instanceId}/${runId}/${encodedSheetName}`,
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

  if (isLoading || ipLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">EOL Components</h1>
            <p className="text-muted-foreground">End-of-life component tracking and risk assessment</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">Loading EOL data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">EOL Components</h1>
          <p className="text-muted-foreground">Detailed analysis of End-of-Life components</p>
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

      {/* Cards Section */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <SimpleMetricCard
          title="Unique EOL Components"
          value={uniqueSoftwareCount}
          color="red"
        />
        <SimpleMetricCard
          title="Total Unique EOL Vulnerabilities"
          value={totalSEoLInstances}
          color="blue"
        />
        <SimpleMetricCard
          title="Affected Hosts"
          value={affectedHostsCount}
          color="green"
        />
      </div>

      {/* Unique SEoL Components Table and Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Table */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold mb-4">Unique SEoL Components</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4">Plugin ID</th>
                  <th className="text-left py-3 px-4">Software</th>
                  <th className="text-center py-3 px-4">Software Extraction Status</th>
                  <th className="text-center py-3 px-4">Risk</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData?.map((item, index) => (
                  <tr key={index} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-4 font-mono text-sm">{item.plugin_id}</td>
                    <td className="py-3 px-4 text-sm">{item.software}</td>
                    <td className="py-3 px-4 text-center">
                      <Badge variant={
                        item.software_extraction_status === "Success" ? "default" : 
                        item.software_extraction_status === "Failed" ? "destructive" : 
                        "outline"
                      }>
                        {item.software_extraction_status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge variant={
                        item.risk === "Critical" ? "destructive" : 
                        item.risk === "High" ? "default" : 
                        item.risk === "Medium" ? "secondary" :
                        "outline"
                      }>
                        {item.risk}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Controls */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, eolData?.length || 0)} of {eolData?.length || 0} entries
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="space-y-6">
          {/* Component Severity by Software Chart */}
          <div className="chart-container bg-card border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-card-foreground">Component Severity by Software</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  layout="horizontal"
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    type="category" 
                    dataKey="name" 
                    stroke="#9ca3af" 
                    fontSize={11}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    type="number" 
                    domain={[0, 3]} 
                    ticks={[1, 2, 3]} 
                    stroke="#9ca3af"
                    label={{ value: 'Risk Level', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "#1f2937", 
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      color: "#ffffff"
                    }}
                    formatter={(value, name, props) => {
                      const level = Object.entries(riskValueMap).find(([k, v]) => v === value)?.[0] || "Unknown";
                      const color = 
                        level === "Critical" ? "#ef4444" :
                        level === "High" ? "#f59e0b" :
                        level === "Medium" ? "#3b82f6" :
                        "#10b981";
                      return [
                        <span style={{ color: color }}>{`Risk Level: ${level}`}</span>,
                        null
                      ];
                    }}
                  />
                  <Bar dataKey="riskValue" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => {
                      const color = 
                        entry.risk === "Critical" ? "#ef4444" :
                        entry.risk === "High" ? "#f59e0b" :
                        entry.risk === "Medium" ? "#3b82f6" :
                        "#10b981";
                      return <Cell key={`cell-${index}`} fill={color} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Risk Distribution Chart */}
          <div className="chart-container bg-card border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-card-foreground">Risk Distribution</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={riskChartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="risk" 
                    stroke="#9ca3af" 
                    fontSize={12}
                    label={{ value: 'Risk Level', position: 'insideBottom', offset: -10 }}
                  />
                  <YAxis 
                    stroke="#9ca3af"
                    label={{ 
                      value: 'Count', 
                      angle: -90, 
                      position: 'insideLeft', 
                      style: { textAnchor: 'middle', fill: '#9ca3af' }
                    }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "#1f2937", 
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      color: "#ffffff"
                    }}
                    formatter={(value, name, props) => {
                      const color = props.payload?.color || "#ffffff";
                      return [
                        <span style={{ color: color }}>{`Count: ${value}`}</span>,
                        null
                      ];
                    }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {riskChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
