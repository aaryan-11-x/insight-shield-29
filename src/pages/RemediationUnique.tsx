import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UUID } from "crypto";
import { DownloadDropdown } from "@/components/DownloadDropdown";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { Download, Loader2, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useState, useMemo } from "react";
import React from "react";

interface RemediationUniqueData {
  id: number;
  remediation: string;
  unique_vulnerability: string;
  risk_rating: string;
  instance_id: UUID;
  run_id: string;
}

export default function RemediationUnique() {
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();
  const [riskFilter, setRiskFilter] = useState<string>('All');

  const { data: remediationUniqueData, isLoading } = useQuery({
    queryKey: ['remediation-unique'],
    queryFn: async () => {
      const instanceId = localStorage.getItem('currentInstanceId');
      const runId = localStorage.getItem('currentRunId');
      const { data, error } = await supabase
        .from('remediation_to_unique_vulnerabilities')
        .select('*')
        .eq('instance_id', instanceId)
        .eq('run_id', runId)
        .order('id');
      
      if (error) {
        console.error('Error fetching remediation unique data:', error);
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
      const sheetName = "2.2 Remediation-Unique Vulnerabilities";
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
  // Sorting logic: by risk_rating, then by unique_vulnerability (oldest/alphabetical)
  const riskOrder = { "Critical": 1, "High": 2, "Medium": 3, "Low": 4, "None": 5 };
  // Filtered and sorted data
  const filteredSortedData = useMemo(() => {
    if (!remediationUniqueData) return [];
    let filtered = remediationUniqueData;
    if (riskFilter !== 'All') {
      filtered = remediationUniqueData.filter(item => item.risk_rating === riskFilter);
    }
    return [...filtered].sort((a, b) => {
      const aOrder = riskOrder[a.risk_rating] || 99;
      const bOrder = riskOrder[b.risk_rating] || 99;
      if (aOrder !== bOrder) return aOrder - bOrder;
      return a.unique_vulnerability.localeCompare(b.unique_vulnerability);
    });
  }, [remediationUniqueData, riskFilter]);

  // Pagination logic
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filteredSortedData.length / ITEMS_PER_PAGE);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredSortedData.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredSortedData, currentPage]);
  // Reset to first page if data or filter changes
  React.useEffect(() => { setCurrentPage(1); }, [remediationUniqueData, riskFilter]);

  // Summary cards
  const uniqueRemediations = useMemo(() => new Set((remediationUniqueData || []).map(item => item.remediation)).size, [remediationUniqueData]);
  const uniqueCVEs = useMemo(() => new Set((remediationUniqueData || []).map(item => item.unique_vulnerability)).size, [remediationUniqueData]);
  const criticalCount = useMemo(() => (remediationUniqueData || []).filter(item => item.risk_rating === "Critical").length, [remediationUniqueData]);
  const highCount = useMemo(() => (remediationUniqueData || []).filter(item => item.risk_rating === "High").length, [remediationUniqueData]);
  const mediumCount = useMemo(() => (remediationUniqueData || []).filter(item => item.risk_rating === "Medium").length, [remediationUniqueData]);
  const lowCount = useMemo(() => (remediationUniqueData || []).filter(item => item.risk_rating === "Low").length, [remediationUniqueData]);
  const noneCount = useMemo(() => (remediationUniqueData || []).filter(item => item.risk_rating === "None").length, [remediationUniqueData]);

  // Get unique risk ratings from the data
  const riskRatingOptions = useMemo(() => {
    if (!remediationUniqueData) return [];
    return Array.from(new Set(remediationUniqueData.map(item => item.risk_rating))).sort((a, b) => {
      const riskOrder = { "Critical": 1, "High": 2, "Medium": 3, "Low": 4, "None": 5 };
      return (riskOrder[a] || 99) - (riskOrder[b] || 99);
    });
  }, [remediationUniqueData]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Remediation-Unique Vulnerabilities</h1>
            <p className="text-muted-foreground">Mapping of remediation actions to unique vulnerabilities</p>
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Remediation-Unique Vulnerabilities</h1>
          <p className="text-muted-foreground">Mapping of remediation actions to unique vulnerabilities</p>
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4 mb-4">
        <div className="metric-card"><div className="space-y-2"><p className="text-sm font-medium text-muted-foreground">Unique Remediations</p><p className="text-2xl font-bold">{uniqueRemediations}</p></div></div>
        <div className="metric-card"><div className="space-y-2"><p className="text-sm font-medium text-muted-foreground">Unique CVEs</p><p className="text-2xl font-bold">{uniqueCVEs}</p></div></div>
        <div className="metric-card"><div className="space-y-2"><p className="text-sm font-medium text-muted-foreground">Critical Vulnerabilities</p><p className="text-2xl font-bold text-red-500">{criticalCount}</p></div></div>
        <div className="metric-card"><div className="space-y-2"><p className="text-sm font-medium text-muted-foreground">High Vulnerabilities</p><p className="text-2xl font-bold text-orange-500">{highCount}</p></div></div>
        <div className="metric-card"><div className="space-y-2"><p className="text-sm font-medium text-muted-foreground">Medium Vulnerabilities</p><p className="text-2xl font-bold text-yellow-500">{mediumCount}</p></div></div>
        <div className="metric-card"><div className="space-y-2"><p className="text-sm font-medium text-muted-foreground">Low Vulnerabilities</p><p className="text-2xl font-bold text-green-500">{lowCount + noneCount}</p></div></div>
      </div>

      <div className="chart-container">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold">Remediation to Unique Vulnerabilities</h3>
          <div className="flex items-center gap-2">
            <Button
              variant={riskFilter === 'All' ? "default" : "outline"}
              size="sm"
              onClick={() => setRiskFilter('All')}
            >
              All Risk Ratings
            </Button>
            <div className="relative group">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                Filter by Risk Rating
                <ChevronDown className="h-4 w-4" />
              </Button>
              <div className="absolute right-0 mt-2 w-48 bg-background border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                <div className="py-1">
                  {riskRatingOptions.map((risk) => (
                    <button
                      key={risk}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center justify-between ${riskFilter === risk ? 'bg-muted' : ''}`}
                      onClick={() => setRiskFilter(risk)}
                    >
                      <span>{risk}</span>
                      {riskFilter === risk && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-primary"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 min-w-[400px]">Remediation</th>
                <th className="text-left py-3 px-4">Unique Vulnerability</th>
                <th className="text-left py-3 px-4">Risk Rating</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, index) => (
                <tr key={index} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="py-3 px-4">
                    <div className="max-w-md">
                      <p className="text-sm whitespace-pre-line">{item.remediation}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <code className="text-sm font-mono bg-background px-2 py-1 rounded">{item.unique_vulnerability}</code>
                  </td>
                  <td className="py-3 px-4">
                    {item.risk_rating === "nan" ? (
                      <span className="text-muted-foreground">N/A</span>
                    ) : (
                      <Badge variant={item.risk_rating === "Critical" ? "destructive" : "default"}>
                        {item.risk_rating}
                      </Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination Controls */}
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredSortedData.length)} of {filteredSortedData.length} entries
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
      </div>
    </div>
  );
}
