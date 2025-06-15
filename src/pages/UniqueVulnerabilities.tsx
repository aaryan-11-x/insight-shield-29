import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DownloadDropdown } from "@/components/DownloadDropdown";
import { Button } from "@/components/ui/button";
import { Download, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useState, useMemo } from "react";

interface UniqueVulnerabilityData {
  vulnerability_name: string;
  severity: string;
  cve: string | null;
  cvss_score: string | null;
  epss_score: string | null;
  kev_listed: boolean;
  affected_hosts: number;
  instance_count: number;
  remediation: string | null;
  instance_id: string;
  run_id: string;
}

const ITEMS_PER_PAGE = 50;

export default function UniqueVulnerabilities() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  const { data: uniqueVulnerabilities, isLoading } = useQuery({
    queryKey: ['unique-vulnerabilities'],
    queryFn: async () => {
      const instanceId = localStorage.getItem('currentInstanceId');
      const runId = localStorage.getItem('currentRunId');
      const { data, error } = await supabase
        .from('unique_vulnerabilities')
        .select('*')
        .eq('instance_id', instanceId)
        .eq('run_id', runId)
        .order('instance_count', { ascending: false });
      
      if (error) {
        console.error('Error fetching unique vulnerabilities data:', error);
        throw error;
      }
      
      return data as UniqueVulnerabilityData[];
    }
  });

  // Memoize calculations to prevent unnecessary recalculations
  const { categoriesData, overviewStats, topVulnerabilities, paginatedData, totalPages } = useMemo(() => {
    if (!uniqueVulnerabilities) {
      return {
        categoriesData: [],
        overviewStats: {
          totalVulnerabilities: 0,
          withCVE: 0,
          kevListed: 0,
          totalInstances: 0,
          totalAffectedHosts: 0,
        },
        topVulnerabilities: [],
        paginatedData: [],
        totalPages: 0
      };
    }

    // Calculate vulnerability categories distribution
    const categoriesData = [
      { name: "Critical", value: uniqueVulnerabilities.filter(v => v.severity === "Critical").length, color: "#dc2626" },
      { name: "High", value: uniqueVulnerabilities.filter(v => v.severity === "High").length, color: "#ea580c" },
      { name: "Medium", value: uniqueVulnerabilities.filter(v => v.severity === "Medium").length, color: "#ca8a04" },
      { name: "Low", value: uniqueVulnerabilities.filter(v => v.severity === "Low").length, color: "#16a34a" },
    ];

    // Calculate vulnerability overview stats
    const overviewStats = {
      totalVulnerabilities: uniqueVulnerabilities.length,
      withCVE: uniqueVulnerabilities.filter(v => v.cve).length,
      kevListed: uniqueVulnerabilities.filter(v => v.kev_listed).length,
      totalInstances: uniqueVulnerabilities.reduce((sum, v) => sum + v.instance_count, 0),
      totalAffectedHosts: uniqueVulnerabilities.reduce((sum, v) => sum + v.affected_hosts, 0),
    };

    // Top 10 vulnerabilities by instance count
    const topVulnerabilities = uniqueVulnerabilities.slice(0, 10);

    // Pagination
    const totalPages = Math.ceil(uniqueVulnerabilities.length / ITEMS_PER_PAGE);
    const paginatedData = uniqueVulnerabilities.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );

    return {
      categoriesData,
      overviewStats,
      topVulnerabilities,
      paginatedData,
      totalPages
    };
  }, [uniqueVulnerabilities, currentPage]);

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
      const sheetName = "3.3 Unique Vulnerabilities";
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Unique Vulnerabilities</h1>
            <p className="text-muted-foreground">Analysis of unique vulnerabilities across the infrastructure</p>
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
          <p className="text-muted-foreground">Loading unique vulnerabilities data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Unique Vulnerabilities</h1>
          <p className="text-muted-foreground">Analysis of unique vulnerabilities across the infrastructure</p>
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

      {/* Vulnerability Overview Statistics */}
      <div className="chart-container">
        <h3 className="text-lg font-semibold mb-4">Vulnerability Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-background p-4 rounded border">
            <p className="text-sm text-muted-foreground">Total Unique Vulnerabilities</p>
            <p className="text-2xl font-bold">{overviewStats.totalVulnerabilities}</p>
          </div>
          <div className="bg-background p-4 rounded border">
            <p className="text-sm text-muted-foreground">With CVE</p>
            <p className="text-2xl font-bold">{overviewStats.withCVE}</p>
          </div>
          <div className="bg-background p-4 rounded border">
            <p className="text-sm text-muted-foreground">KEV Listed</p>
            <p className="text-2xl font-bold">{overviewStats.kevListed}</p>
          </div>
          <div className="bg-background p-4 rounded border">
            <p className="text-sm text-muted-foreground">Total Instances</p>
            <p className="text-2xl font-bold">{overviewStats.totalInstances}</p>
          </div>
          <div className="bg-background p-4 rounded border">
            <p className="text-sm text-muted-foreground">Total Affected Hosts</p>
            <p className="text-2xl font-bold">{overviewStats.totalAffectedHosts}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vulnerability Categories Distribution */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold mb-4">Vulnerability Categories Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoriesData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoriesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {categoriesData.map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span>{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top 10 Vulnerabilities Chart */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold mb-4">Top 10 Vulnerabilities by Instance Count</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topVulnerabilities}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="vulnerability_name" 
                  stroke="#9ca3af" 
                  fontSize={10}
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  interval={0}
                />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    color: "#000000"
                  }}
                  formatter={(value, name) => {
                    return [
                      <span style={{ color: "#000000" }}>{`Instance Count: ${value}`}</span>,
                      null
                    ];
                  }}
                />
                <Bar dataKey="instance_count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Vulnerabilities Table */}
      <div className="chart-container">
        <h3 className="text-lg font-semibold mb-4">Detailed Vulnerability Analysis</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-2 min-w-[300px]">Vulnerability Name</th>
                <th className="text-center py-3 px-2">Severity</th>
                <th className="text-center py-3 px-2">CVE</th>
                <th className="text-center py-3 px-2">CVSS Score</th>
                <th className="text-center py-3 px-2">EPSS Score</th>
                <th className="text-center py-3 px-2">KEV Listed</th>
                <th className="text-center py-3 px-2">Affected Hosts</th>
                <th className="text-center py-3 px-2">Instance Count</th>
                <th className="text-left py-3 px-2 min-w-[200px]">Remediation</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData?.map((item, index) => (
                <tr key={index} className="border-b border-border/50 hover:bg-muted/20">
                  <td className="py-3 px-2">{item.vulnerability_name}</td>
                  <td className="py-3 px-2 text-center">
                    <Badge variant={
                      item.severity === "Critical" ? "destructive" : 
                      item.severity === "High" ? "default" : "secondary"
                    }>
                      {item.severity}
                    </Badge>
                  </td>
                  <td className="py-3 px-2 text-center">
                    {item.cve ? (
                      <code className="text-xs bg-background px-1 py-0.5 rounded">{item.cve}</code>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="py-3 px-2 text-center">{item.cvss_score || "—"}</td>
                  <td className="py-3 px-2 text-center">{item.epss_score || "—"}</td>
                  <td className="py-3 px-2 text-center">
                    <Badge variant={item.kev_listed ? "destructive" : "secondary"}>
                      {item.kev_listed ? "Yes" : "No"}
                    </Badge>
                  </td>
                  <td className="py-3 px-2 text-center font-bold">{item.affected_hosts}</td>
                  <td className="py-3 px-2 text-center font-bold">{item.instance_count}</td>
                  <td className="py-3 px-2 text-xs">{item.remediation || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, uniqueVulnerabilities?.length || 0)} of {uniqueVulnerabilities?.length || 0} entries
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
    </div>
  );
}
