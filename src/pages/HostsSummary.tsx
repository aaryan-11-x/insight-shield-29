import { Button } from "@/components/ui/button";
import { Download, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UUID } from "crypto";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface HostData {
  host: string;
  critical: number;
  high: number;
  medium: number;
  low: number;
  vulnerabilities_with_cve: number;
  vulnerability_count: number;
  instance_id: UUID;
  run_id: string;
}

const ITEMS_PER_PAGE = 75;

export default function HostsSummary() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();
  
  const { data: hostData, isLoading, error } = useQuery({
    queryKey: ['host-summary'],
    queryFn: async () => {
      const instanceId = localStorage.getItem('currentInstanceId');
      const runId = localStorage.getItem('currentRunId');
      const { data, error } = await supabase
        .from('host_summary')
        .select('*')
        .eq('instance_id', instanceId)
        .eq('run_id', runId)
        .order('vulnerability_count', { ascending: false });
      
      if (error) {
        console.error('Error fetching host summary data:', error);
        throw error;
      }
      
      return data;
    }
  });

  // Calculate summary statistics from the fetched data
  const summaryStats = {
    totalHosts: hostData?.length || 0,
    totalVulnerabilities: hostData?.reduce((sum, host) => sum + host.vulnerability_count, 0) || 0,
    totalVulnerabilitiesWithCVE: hostData?.reduce((sum, host) => sum + host.vulnerabilities_with_cve, 0) || 0
  };

  // Pagination
  const totalPages = hostData ? Math.ceil(hostData.length / ITEMS_PER_PAGE) : 0;
  const paginatedData = hostData?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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
      const sheetName = "4.2 Vulnerable Hosts Summary";
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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Hosts Summary</h1>
            <p className="text-muted-foreground">Comprehensive overview of host vulnerabilities and risk assessment</p>
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
          <p className="text-muted-foreground">Loading host data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Hosts Summary</h1>
            <p className="text-muted-foreground">Comprehensive overview of host vulnerabilities and risk assessment</p>
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
          <p className="text-red-400">Error loading host data: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Vulnerable Hosts Summary</h1>
          <p className="text-muted-foreground">Overview of vulnerable hosts and their status</p>
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

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="metric-card">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Total Hosts</p>
            <p className="text-2xl font-bold">{summaryStats.totalHosts.toLocaleString()}</p>
          </div>
        </div>
        <div className="metric-card">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Total Vulnerabilities</p>
            <p className="text-2xl font-bold">{summaryStats.totalVulnerabilities.toLocaleString()}</p>
          </div>
        </div>
        <div className="metric-card">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Total Vulnerabilities with CVE</p>
            <p className="text-2xl font-bold">{summaryStats.totalVulnerabilitiesWithCVE.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Hosts Summary Table */}
      <div className="chart-container">
        <h3 className="text-lg font-semibold mb-4">Hosts Summary</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4">Host</th>
                <th className="text-center py-3 px-4">Vulnerability Count</th>
                <th className="text-center py-3 px-4">Vulnerabilities with CVE</th>
                <th className="text-center py-3 px-4">Critical</th>
                <th className="text-center py-3 px-4">High</th>
                <th className="text-center py-3 px-4">Medium</th>
                <th className="text-center py-3 px-4">Low</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData?.map((item, index) => (
                <tr key={index} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="py-3 px-4 font-mono text-sm">{item.host}</td>
                  <td className="py-3 px-4 text-center font-bold">{item.vulnerability_count}</td>
                  <td className="py-3 px-4 text-center font-mono">{item.vulnerabilities_with_cve}</td>
                  <td className="py-3 px-4 text-center text-red-400 font-bold">{item.critical}</td>
                  <td className="py-3 px-4 text-center text-orange-400 font-bold">{item.high}</td>
                  <td className="py-3 px-4 text-center text-yellow-400 font-bold">{item.medium}</td>
                  <td className="py-3 px-4 text-center text-green-400 font-bold">{item.low}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, hostData?.length || 0)} of {hostData?.length || 0} entries
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

      {hostData?.length === 0 && (
        <div className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">No host data found.</p>
        </div>
      )}
    </div>
  );
}
