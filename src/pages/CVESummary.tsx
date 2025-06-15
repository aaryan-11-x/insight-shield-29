import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UUID } from "crypto";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Download, Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface CVEData {
  instance_id: UUID;
  run_id: string;
  cve: string;
  count: number | null;
  severity: string | null;
  name: string | null;
  description: string | null;
  hosts: string | null;
  solutions: string | null;
}

const ITEMS_PER_PAGE = 75;

export default function CVESummary() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();
  
  const { data: cveData, isLoading, error } = useQuery({
    queryKey: ['cve-summary'],
    queryFn: async () => {
      const instanceId = localStorage.getItem('currentInstanceId');
      const runId = localStorage.getItem('currentRunId');
      const { data, error } = await supabase
        .from('cve_summary')
        .select('*')
        .eq('instance_id', instanceId)
        .eq('run_id', runId)
        .order('count', { ascending: false });
      
      if (error) {
        console.error('Error fetching CVE summary data:', error);
        throw error;
      }
      
      return data;
    }
  });

  // Calculate summary statistics from the fetched data
  const summaryStats = {
    totalCves: cveData?.length || 0,
    critical: cveData?.filter(item => item.severity === "Critical").length || 0,
    high: cveData?.filter(item => item.severity === "High").length || 0,
    medium: cveData?.filter(item => item.severity === "Medium").length || 0,
    low: cveData?.filter(item => item.severity === "Low" || item.severity === "Low/None").length || 0,
  };

  // Pagination
  const totalPages = cveData ? Math.ceil(cveData.length / ITEMS_PER_PAGE) : 0;
  const paginatedData = cveData?.slice(
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
      const sheetName = "4.1 CVE Summary";
      const encodedSheetName = btoa(decodeURIComponent(encodeURIComponent(sheetName)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      // Make the API request
      const response = await fetch(
        `http://localhost:8000/api/v1/download-sheet/${instanceId}/${runId}/${encodedSheetName}`,
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
            <h1 className="text-3xl font-bold">CVE Summary</h1>
            <p className="text-muted-foreground">CVE summary and executive overview</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">Loading CVE data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">CVE Summary</h1>
            <p className="text-muted-foreground">CVE summary and executive overview</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-8">
          <p className="text-red-400">Error loading CVE data: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">CVE Summary</h1>
          <p className="text-muted-foreground">Overview of CVE distribution and trends</p>
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
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="metric-card">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Total CVEs</p>
            <p className="text-2xl font-bold">{summaryStats.totalCves}</p>
          </div>
        </div>
        <div className="metric-card">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Critical</p>
            <p className="text-2xl font-bold text-red-400">{summaryStats.critical}</p>
          </div>
        </div>
        <div className="metric-card">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">High</p>
            <p className="text-2xl font-bold text-orange-400">{summaryStats.high}</p>
          </div>
        </div>
        <div className="metric-card">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Medium</p>
            <p className="text-2xl font-bold text-yellow-400">{summaryStats.medium}</p>
          </div>
        </div>
        <div className="metric-card">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Low</p>
            <p className="text-2xl font-bold text-green-400">{summaryStats.low}</p>
          </div>
        </div>
      </div>

      {/* CVE Details Table */}
      <div className="chart-container">
        <h3 className="text-lg font-semibold mb-4">CVE Details</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4">CVE</th>
                <th className="text-center py-3 px-4">Count</th>
                <th className="text-center py-3 px-4">Severity</th>
                <th className="text-left py-3 px-4">Name</th>
                <th className="text-left py-3 px-4">Description</th>
                <th className="text-left py-3 px-4">Hosts</th>
                <th className="text-left py-3 px-4">Solutions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData?.map((item, index) => (
                <tr key={index} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="py-3 px-4">
                    <code className="text-sm font-mono bg-background px-2 py-1 rounded">{item.cve}</code>
                  </td>
                  <td className="py-3 px-4 text-center font-bold">{item.count || 0}</td>
                  <td className="py-3 px-4 text-center">
                    <Badge variant={
                      item.severity === "Critical" ? "destructive" : 
                      item.severity === "High" ? "default" : 
                      "secondary"
                    }>
                      {item.severity || "Unknown"}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-sm font-medium max-w-xs">{item.name || "N/A"}</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground max-w-md">
                    <div className="line-clamp-3">{item.description || "N/A"}</div>
                  </td>
                  <td className="py-3 px-4 text-xs text-muted-foreground max-w-xs">
                    <div className="line-clamp-2">{item.hosts || "N/A"}</div>
                  </td>
                  <td className="py-3 px-4 text-sm text-muted-foreground max-w-md">
                    <div className="line-clamp-3">{item.solutions || "N/A"}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, cveData?.length || 0)} of {cveData?.length || 0} entries
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

      {cveData?.length === 0 && (
        <div className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">No CVE data found.</p>
        </div>
      )}
    </div>
  );
}
