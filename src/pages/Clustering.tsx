import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UUID } from "crypto";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

interface ClusteringData {
  affected_hosts: number;
  common_vulnerabilities: string | null;
  critical: number;
  cve_count: number;
  high: number;
  kev_count: number;
  low: number;
  medium: number;
  product_service: string;
  total_vulnerabilities: number;
  instance_id: UUID;
  run_id: string;
}

export default function Clustering() {
  const { data: clusteringData, isLoading } = useQuery({
    queryKey: ['clustering'],
    queryFn: async () => {
      const instanceId = localStorage.getItem('currentInstanceId');
      const runId = localStorage.getItem('currentRunId');
      const { data, error } = await supabase
        .from('vulnerability_clustering')
        .select('*')
        .eq('instance_id', instanceId)
        .eq('run_id', runId)
        .order('total_vulnerabilities', { ascending: false });
      
      if (error) {
        console.error('Error fetching clustering data:', error);
        throw error;
      }
      
      return data;
    }
  });

  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  // Get top 5 clusters for pie chart
  const topClustersData = clusteringData ? 
    clusteringData.slice(0, 5).map((item, index) => ({
      product: item.product_service,
      vulnerabilities: item.total_vulnerabilities,
      color: ["#dc2626", "#ea580c", "#ca8a04", "#16a34a", "#2563eb"][index] || "#6b7280"
    })) : [];

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
      const sheetName = "3.2 Vulnerability Clustering";
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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Vulnerability Clustering</h1>
            <p className="text-muted-foreground">This sheet groups vulnerabilities by affected product/service, enabling targeted remediation campaigns and efficient operational planning.</p>
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
          <p className="text-muted-foreground">Loading vulnerability clustering data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Vulnerability Clustering</h1>
          <p className="text-muted-foreground">This sheet groups vulnerabilities by affected product/service, enabling targeted remediation campaigns and efficient operational planning.</p>
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
        {/* Top 5 Clusters Table */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold mb-4">Top 5 Clusters by Vulnerabilities</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4">Product/Service</th>
                  <th className="text-center py-3 px-4">Vulnerabilities</th>
                </tr>
              </thead>
              <tbody>
                {topClustersData.map((item, index) => (
                  <tr key={index} className="border-b border-border/50 hover:bg-muted/20">
                    <td className="py-3 px-4 font-medium">{item.product}</td>
                    <td className="py-3 px-4 text-center font-bold">{item.vulnerabilities.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Vulnerability Distribution by Product/Service */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold mb-4">Vulnerability Distribution by Product/Service</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={topClustersData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="vulnerabilities"
                  nameKey="product"
                >
                  {topClustersData.map((entry, index) => (
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
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {topClustersData.map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-xs">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span>{item.product}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Clusters Table */}
      <div className="chart-container">
        <h3 className="text-lg font-semibold mb-4">Detailed Product/Service Analysis</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-2">Product/Service</th>
                <th className="text-center py-3 px-2">Total</th>
                <th className="text-center py-3 px-2">Critical</th>
                <th className="text-center py-3 px-2">High</th>
                <th className="text-center py-3 px-2">Medium</th>
                <th className="text-center py-3 px-2">Low</th>
                <th className="text-center py-3 px-2">Affected Hosts</th>
                <th className="text-center py-3 px-2">CVE Count</th>
                <th className="text-center py-3 px-2">KEV Count</th>
                <th className="text-left py-3 px-2 min-w-[300px]">Common Vulnerabilities</th>
              </tr>
            </thead>
            <tbody>
              {clusteringData?.map((item, index) => (
                <tr key={index} className="border-b border-border/50 hover:bg-muted/20">
                  <td className="py-3 px-2 font-medium">{item.product_service}</td>
                  <td className="py-3 px-2 text-center font-bold">{item.total_vulnerabilities.toLocaleString()}</td>
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
                  <td className="py-3 px-2 text-center">{item.affected_hosts}</td>
                  <td className="py-3 px-2 text-center">{item.cve_count}</td>
                  <td className="py-3 px-2 text-center">{item.kev_count}</td>
                  <td className="py-3 px-2 text-xs">{item.common_vulnerabilities || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
