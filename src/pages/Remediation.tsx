import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { Download, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useState, useMemo } from "react";
import React from "react";
import { UUID } from "crypto";
import { Badge } from "@/components/ui/badge";

interface RemediationData {
  rank: number;
  remediation: string;
  critical: number;
  high: number;
  low: number;
  medium: number;
  none: number;
  total_vulnerabilities_closed: number;
  instance_id: UUID;
  run_id: string;
}

export default function Remediation() {
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  const { data: remediationData, isLoading } = useQuery({
    queryKey: ['remediation'],
    queryFn: async () => {
      const instanceId = localStorage.getItem('currentInstanceId');
      const runId = localStorage.getItem('currentRunId');
      const { data, error } = await supabase
        .from('remediation_insights')
        .select('*')
        .eq('instance_id', instanceId)
        .eq('run_id', runId)
        .order('rank', { ascending: true });
      
      if (error) {
        console.error('Error fetching remediation data:', error);
        throw error;
      }
      
      return data;
    }
  });

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
      const sheetName = "2.1 Remediation Insights";
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

  const ITEMS_PER_PAGE = 75;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = remediationData ? Math.ceil(remediationData.length / ITEMS_PER_PAGE) : 1;
  const paginatedData = useMemo(() => {
    if (!remediationData) return [];
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return remediationData.slice(start, start + ITEMS_PER_PAGE);
  }, [remediationData, currentPage]);
  // Reset to first page if data changes
  React.useEffect(() => { setCurrentPage(1); }, [remediationData]);

  // Top 10 Remediations by Critical Vulnerabilities Closed (useMemo for stability)
  const topCriticalRemediations = useMemo(() => {
    if (!remediationData) return [];
    return [...remediationData]
      .sort((a, b) => b.critical - a.critical)
      .slice(0, 10);
  }, [remediationData]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Remediation Insights</h1>
            <p className="text-muted-foreground">Track remediation progress and prioritize actions</p>
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
          <p className="text-muted-foreground">Loading remediation data...</p>
        </div>
      </div>
    );
  }

  // Compute summary stats for metric cards
  const totalRemediations = remediationData ? remediationData.length : 0;
  const totalClosed = remediationData ? remediationData.reduce((sum, item) => sum + (item.total_vulnerabilities_closed || 0), 0) : 0;
  const criticalCount = remediationData ? remediationData.reduce((sum, item) => sum + (item.critical || 0), 0) : 0;
  const highCount = remediationData ? remediationData.reduce((sum, item) => sum + (item.high || 0), 0) : 0;
  const mediumCount = remediationData ? remediationData.reduce((sum, item) => sum + (item.medium || 0), 0) : 0;
  const lowCount = remediationData ? remediationData.reduce((sum, item) => sum + (item.low || 0), 0) : 0;
  const noneCount = remediationData ? remediationData.reduce((sum, item) => sum + (item.none || 0), 0) : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Remediation Insights</h1>
          <p className="text-muted-foreground">Track remediation progress and prioritize actions</p>
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

      {/* Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4 mb-4">
        <div className="metric-card"><div className="space-y-2"><p className="text-sm font-medium text-muted-foreground">Total Remediations</p><p className="text-2xl font-bold">{totalRemediations}</p></div></div>
        <div className="metric-card"><div className="space-y-2"><p className="text-sm font-medium text-muted-foreground">Total Closed</p><p className="text-2xl font-bold">{totalClosed}</p></div></div>
        <div className="metric-card"><div className="space-y-2"><p className="text-sm font-medium text-muted-foreground">Critical</p><p className="text-2xl font-bold text-red-500">{criticalCount}</p></div></div>
        <div className="metric-card"><div className="space-y-2"><p className="text-sm font-medium text-muted-foreground">High</p><p className="text-2xl font-bold text-orange-500">{highCount}</p></div></div>
        <div className="metric-card"><div className="space-y-2"><p className="text-sm font-medium text-muted-foreground">Medium</p><p className="text-2xl font-bold text-yellow-500">{mediumCount}</p></div></div>
        <div className="metric-card"><div className="space-y-2"><p className="text-sm font-medium text-muted-foreground">Low/None</p><p className="text-2xl font-bold text-green-500">{lowCount + noneCount}</p></div></div>
      </div>

      {/* Top 10 Remediations by Critical Vulnerabilities Closed Chart */}
      <div className="chart-container bg-card border rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-card-foreground">Top 10 Remediations by Critical Vulnerabilities Closed</h3>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={topCriticalRemediations}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 120, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis type="number" stroke="#9ca3af" />
              <YAxis type="category" dataKey="remediation" stroke="#9ca3af" fontSize={12} width={200} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#ffffff"
                }}
                formatter={(value, name) => [value, "Critical Closed"]}
              />
              <Bar dataKey="critical" fill="#ef4444" radius={[4, 4, 4, 4]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Remediation Insights Table */}
      <div className="chart-container bg-muted/40 rounded-lg p-4">
        <h3 className="text-xl font-semibold mb-4 text-primary">Remediations by Observations</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm rounded-lg overflow-hidden">
            <thead>
              <tr className="border-b border-border bg-muted/60">
                <th className="text-left py-3 px-4">Remediation</th>
                <th className="text-center py-3 px-4">Critical</th>
                <th className="text-center py-3 px-4">High</th>
                <th className="text-center py-3 px-4">Medium</th>
                <th className="text-center py-3 px-4">Low</th>
                <th className="text-center py-3 px-4">None</th>
                <th className="text-center py-3 px-4">Total Vulnerabilities Closed</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData && paginatedData.length > 0 ? (
                paginatedData.map((item: any, index: number) => {
                  // Type guard: check if item has the new properties
                  const hasNewProps =
                    typeof item.rank === 'number' &&
                    typeof item.critical === 'number' &&
                    typeof item.high === 'number' &&
                    typeof item.medium === 'number' &&
                    typeof item.low === 'number' &&
                    typeof item.none === 'number' &&
                    typeof item.total_vulnerabilities_closed === 'number';
                  if (!hasNewProps) return null;
                  return (
                    <tr key={index} className={
                      `border-b border-border/50 ${index % 2 === 0 ? 'bg-background' : 'bg-muted/20'} hover:bg-primary/10 transition-colors`
                    }>
                      <td className="py-3 px-4">
                        <div className="max-w-md">
                          <p className="text-sm font-medium text-foreground whitespace-pre-line">{item.remediation}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center"><Badge variant="destructive">{item.critical}</Badge></td>
                      <td className="py-3 px-4 text-center"><Badge variant="default" style={{backgroundColor:'#ff9800',color:'#fff'}}>{item.high}</Badge></td>
                      <td className="py-3 px-4 text-center"><Badge variant="default" style={{backgroundColor:'#ffe066',color:'#333'}}>{item.medium}</Badge></td>
                      <td className="py-3 px-4 text-center"><Badge variant="default" style={{backgroundColor:'#4caf50',color:'#fff'}}>{item.low}</Badge></td>
                      <td className="py-3 px-4 text-center"><Badge variant="secondary">{item.none}</Badge></td>
                      <td className="py-3 px-4 text-center font-bold text-primary">{item.total_vulnerabilities_closed}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-4 text-center text-muted-foreground">
                    No remediation data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, remediationData ? remediationData.length : 0)} of {remediationData ? remediationData.length : 0} entries
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
