import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DownloadDropdown } from "@/components/DownloadDropdown";
import { UUID } from "crypto";
import { Button } from "@/components/ui/button";
import { Download, Loader2, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useState, useMemo, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface IPInsightsData {
  ip_address: string;
  hostname: string | null;
  total_vulnerabilities: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  exploitability_score: number;
  kev_count: number;
  last_scan_date: string | null;
  most_common_category: string | null;
  instance_id: UUID;
  run_id: string;
}

const ITEMS_PER_PAGE = 50;

export default function IPInsights() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isCriticalDialogOpen, setIsCriticalDialogOpen] = useState(false);
  const [isHighDialogOpen, setIsHighDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: ipData, isLoading } = useQuery({
    queryKey: ['ip-insights'],
    queryFn: async () => {
      const instanceId = localStorage.getItem('currentInstanceId');
      const runId = localStorage.getItem('currentRunId');
      const { data, error } = await supabase
        .from('ip_insights')
        .select('*')
        .eq('instance_id', instanceId)
        .eq('run_id', runId)
        .order('total_vulnerabilities', { ascending: false });
      
      if (error) {
        console.error('Error fetching IP insights data:', error);
        throw error;
      }
      
      return data;
    }
  });

  // Calculate statistics from the data
  const stats = ipData ? {
    totalHosts: ipData.length,
    totalVulnerabilities: ipData.reduce((sum, host) => sum + host.total_vulnerabilities, 0),
    hostsWithVulnerabilities: ipData.filter(host => host.total_vulnerabilities > 0).length,
    hostsWithCritical: ipData.filter(host => host.critical > 0).length,
    hostsWithHigh: ipData.filter(host => host.high > 0).length,
    top5Hosts: ipData.slice(0, 5).map(host => String(host.ip_address)).join(', ')
  } : {
    totalHosts: 0,
    totalVulnerabilities: 0,
    hostsWithVulnerabilities: 0,
    hostsWithCritical: 0,
    hostsWithHigh: 0,
    top5Hosts: ''
  };

  const vulnerabilityDistributionData = ipData ? [
    { name: "Critical", value: ipData.reduce((sum, host) => sum + host.critical, 0), color: "#dc2626" },
    { name: "High", value: ipData.reduce((sum, host) => sum + host.high, 0), color: "#ea580c" },
    { name: "Medium", value: ipData.reduce((sum, host) => sum + host.medium, 0), color: "#ca8a04" },
    { name: "Low", value: ipData.reduce((sum, host) => sum + host.low, 0), color: "#16a34a" },
  ] : [];

  // Get hosts with critical vulnerabilities
  const hostsWithCritical = ipData?.filter(host => host.critical > 0) || [];

  // Get hosts with high vulnerabilities
  const hostsWithHigh = ipData?.filter(host => host.high > 0) || [];

  // Get unique categories
  const categories = useMemo(() => {
    if (!ipData) return [];
    const uniqueCategories = new Set(ipData.map(host => host.most_common_category).filter(Boolean));
    return Array.from(uniqueCategories).sort();
  }, [ipData]);

  // Filter and sort data based on selected category
  const filteredAndSortedData = useMemo(() => {
    if (!ipData) return [];
    let filtered = ipData;
    
    if (selectedCategory) {
      filtered = ipData.filter(host => host.most_common_category === selectedCategory);
    }
    
    return filtered.sort((a, b) => {
      // First sort by exploit score in descending order
      if (b.exploitability_score !== a.exploitability_score) {
        return b.exploitability_score - a.exploitability_score;
      }
      // If exploit scores are equal, sort by total vulnerabilities
      return b.total_vulnerabilities - a.total_vulnerabilities;
    });
  }, [ipData, selectedCategory]);

  // Update pagination for filtered data
  const totalPages = Math.ceil((filteredAndSortedData?.length || 0) / ITEMS_PER_PAGE);
  const paginatedData = filteredAndSortedData?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset to first page when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

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
      const sheetName = "3.1 IP Insights";
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
            <h1 className="text-3xl font-bold">IP Insights</h1>
            <p className="text-muted-foreground">This sheet provides a detailed breakdown of vulnerabilities per IP, facilitating operational planning and remediation prioritization</p>
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
          <p className="text-muted-foreground">Loading IP insights data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">IP Insights</h1>
          <p className="text-muted-foreground">This sheet provides a detailed breakdown of vulnerabilities per IP, facilitating operational planning and remediation prioritization</p>
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          className="bg-card p-6 rounded-lg border cursor-pointer hover:bg-muted/20 transition-colors"
          onClick={() => {
            const tableElement = document.getElementById('ip-details-table');
            if (tableElement) {
              tableElement.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Hosts</p>
              <p className="text-3xl font-bold">{stats.totalHosts}</p>
            </div>
          </div>
        </div>
        <div 
          className="bg-card p-6 rounded-lg border cursor-pointer hover:bg-muted/20 transition-colors"
          onClick={() => {
            const tableElement = document.getElementById('ip-details-table');
            if (tableElement) {
              tableElement.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Vulnerabilities</p>
              <p className="text-3xl font-bold">{stats.totalVulnerabilities.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Operational Planning Statistics */}
      <div className="chart-container">
        <h3 className="text-lg font-semibold mb-4">Operational Planning Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-background p-4 rounded border">
            <p className="text-sm text-muted-foreground">Total Hosts Scanned</p>
            <p className="text-2xl font-bold">{stats.totalHosts}</p>
          </div>
          <div className="bg-background p-4 rounded border">
            <p className="text-sm text-muted-foreground">Hosts with Vulnerabilities</p>
            <p className="text-2xl font-bold">{stats.hostsWithVulnerabilities} <span className="text-sm text-muted-foreground">({stats.totalHosts > 0 ? ((stats.hostsWithVulnerabilities / stats.totalHosts) * 100).toFixed(1) : 0}%)</span></p>
          </div>
          <div 
            className="bg-background p-4 rounded border cursor-pointer hover:bg-muted/20 transition-colors"
            onClick={() => setIsCriticalDialogOpen(true)}
          >
            <p className="text-sm text-muted-foreground">Hosts with Critical Vulnerabilities</p>
            <p className="text-2xl font-bold">{stats.hostsWithCritical} <span className="text-sm text-muted-foreground">({stats.totalHosts > 0 ? ((stats.hostsWithCritical / stats.totalHosts) * 100).toFixed(1) : 0}%)</span></p>
          </div>
          <div 
            className="bg-background p-4 rounded border cursor-pointer hover:bg-muted/20 transition-colors"
            onClick={() => setIsHighDialogOpen(true)}
          >
            <p className="text-sm text-muted-foreground">Hosts with High Vulnerabilities</p>
            <p className="text-2xl font-bold">{stats.hostsWithHigh} <span className="text-sm text-muted-foreground">({stats.totalHosts > 0 ? ((stats.hostsWithHigh / stats.totalHosts) * 100).toFixed(1) : 0}%)</span></p>
          </div>
          <div className="bg-background p-4 rounded border md:col-span-2">
            <p className="text-sm text-muted-foreground">Top 5 Hosts Need Remediation</p>
            <p className="text-lg font-mono">{stats.top5Hosts}</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vulnerability Distribution */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold mb-4">Vulnerability Distribution by Severity</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={vulnerabilityDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {vulnerabilityDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {vulnerabilityDistributionData.map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Host Categories */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold mb-4">Top Hosts by Vulnerability Count</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ipData?.slice(0, 7)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="ip_address" stroke="#9ca3af" fontSize={10} angle={-45} textAnchor="end" height={80} />
                <YAxis stroke="#9ca3af" />
                <Tooltip />
                <Bar dataKey="total_vulnerabilities" fill="#3b82f6" name="Total Vulnerabilities" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Critical Vulnerabilities Dialog */}
      <Dialog open={isCriticalDialogOpen} onOpenChange={setIsCriticalDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Hosts with Critical Vulnerabilities</DialogTitle>
          </DialogHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3 bg-muted">IP Address</th>
                  <th className="text-center py-2 px-3 bg-muted">Critical</th>
                  <th className="text-center py-2 px-3 bg-muted">Exploit Score</th>
                  <th className="text-left py-2 px-3 bg-muted">Category</th>
                </tr>
              </thead>
              <tbody>
                {hostsWithCritical.map((host, index) => (
                  <tr key={index} className="border-b hover:bg-muted/20">
                    <td className="py-2 px-3 font-mono text-xs">{String(host.ip_address)}</td>
                    <td className="py-2 px-3 text-center">
                      <Badge variant="destructive">{host.critical}</Badge>
                    </td>
                    <td className="py-2 px-3 text-center font-mono">{host.exploitability_score}</td>
                    <td className="py-2 px-3">{host.most_common_category || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>

      {/* High Vulnerabilities Dialog */}
      <Dialog open={isHighDialogOpen} onOpenChange={setIsHighDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Hosts with High Vulnerabilities</DialogTitle>
          </DialogHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3 bg-muted">IP Address</th>
                  <th className="text-center py-2 px-3 bg-muted">High</th>
                  <th className="text-center py-2 px-3 bg-muted">Exploit Score</th>
                  <th className="text-left py-2 px-3 bg-muted">Category</th>
                </tr>
              </thead>
              <tbody>
                {hostsWithHigh.map((host, index) => (
                  <tr key={index} className="border-b hover:bg-muted/20">
                    <td className="py-2 px-3 font-mono text-xs">{String(host.ip_address)}</td>
                    <td className="py-2 px-3 text-center">
                      <Badge variant="default">{host.high}</Badge>
                    </td>
                    <td className="py-2 px-3 text-center font-mono">{host.exploitability_score}</td>
                    <td className="py-2 px-3">{host.most_common_category || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>

      {/* IP Details Table */}
      <div className="chart-container" id="ip-details-table">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold">IP Address Details</h3>
          <div className="flex items-center gap-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              All Categories
            </Button>
            <div className="relative group">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                Filter by Category
                <ChevronDown className="h-4 w-4" />
              </Button>
              <div className="absolute right-0 mt-2 w-48 bg-background border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                <div className="py-1 max-h-60 overflow-y-auto">
                  {categories.map((category) => (
                    <button
                      key={category}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center justify-between ${
                        selectedCategory === category ? 'bg-muted' : ''
                      }`}
                      onClick={() => setSelectedCategory(category)}
                    >
                      <span>{category}</span>
                      {selectedCategory === category && (
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
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-2">IP Address</th>
                <th className="text-left py-3 px-2">Hostname</th>
                <th className="text-center py-3 px-2">Total</th>
                <th className="text-center py-3 px-2">Critical</th>
                <th className="text-center py-3 px-2">High</th>
                <th className="text-center py-3 px-2">Medium</th>
                <th className="text-center py-3 px-2">Low</th>
                <th className="text-center py-3 px-2">KEV</th>
                <th className="text-center py-3 px-2">Exploit Score</th>
                <th className="text-left py-3 px-2">Category</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData?.map((item, index) => (
                <tr key={index} className="border-b border-border/50 hover:bg-muted/20">
                  <td className="py-3 px-2 font-mono text-xs">{String(item.ip_address)}</td>
                  <td className="py-3 px-2">{item.hostname || "—"}</td>
                  <td className="py-3 px-2 text-center font-bold">{item.total_vulnerabilities}</td>
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
                  <td className="py-3 px-2 text-center">{item.kev_count}</td>
                  <td className="py-3 px-2 text-center font-mono">{item.exploitability_score}</td>
                  <td className="py-3 px-2">{item.most_common_category || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredAndSortedData?.length || 0)} of {filteredAndSortedData?.length || 0} entries
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
