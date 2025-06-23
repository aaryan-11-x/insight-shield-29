import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { SimpleMetricCard } from "@/components/SimpleMetricCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UUID } from "crypto";
import { DownloadDropdown } from "@/components/DownloadDropdown";
import { Button } from "@/components/ui/button";
import { Download, Loader2, ChevronDown } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface EOLVersionData {
  unique_vulnerability_count: number;
  software_type: string;
  version: string;
  instance_id: UUID;
  run_id: string;
}

export default function EOLVersions() {
  const { data: eolVersionData, isLoading } = useQuery({
    queryKey: ['eol-versions'],
    queryFn: async () => {
      const instanceId = localStorage.getItem('currentInstanceId');
      const runId = localStorage.getItem('currentRunId');
      const { data, error } = await supabase
        .from('eol_versions')
        .select('*')
        .eq('instance_id', instanceId)
        .eq('run_id', runId)
        .order('unique_vulnerability_count', { ascending: false });
      
      if (error) {
        console.error('Error fetching EOL versions data:', error);
        throw error;
      }
      
      return data;
    }
  });

  const [isDownloading, setIsDownloading] = useState(false);
  const [isSoftwareTypesDialogOpen, setIsSoftwareTypesDialogOpen] = useState(false);
  const [selectedSoftwareType, setSelectedSoftwareType] = useState<string | null>(null);
  const { toast } = useToast();

  // Function to extract version number from software type
  const extractVersion = (softwareType: string): string => {
    // Match patterns like:
    // - Windows Server 2008
    // - Windows 10
    // - Ubuntu 20.04
    // - RHEL 7
    const versionMatch = softwareType.match(/\b\d+(?:\.\d+)?\b/);
    return versionMatch ? versionMatch[0] : '';
  };

  // Calculate statistics
  const stats = eolVersionData ? {
    totalSEoLComponents: eolVersionData.reduce((sum, version) => sum + version.unique_vulnerability_count, 0),
    totalDifferentSoftwareTypes: new Set(eolVersionData.map(v => v.software_type)).size,
    totalDifferentVersions: eolVersionData.length
  } : {
    totalSEoLComponents: 0,
    totalDifferentSoftwareTypes: 0,
    totalDifferentVersions: 0
  };

  // Get unique software types from data
  const uniqueSoftwareTypes = eolVersionData ? 
    Array.from(new Set(eolVersionData.map(v => v.software_type))).sort() : [];

  // Filter data based on selected software type
  const filteredVersionData = useMemo(() => {
    if (!eolVersionData) return [];
    if (!selectedSoftwareType) return eolVersionData;
    
    return eolVersionData.filter(v => v.software_type === selectedSoftwareType);
  }, [eolVersionData, selectedSoftwareType]);

  // Create software distribution data
  const softwareDistribution = eolVersionData ? 
    Array.from(new Set(eolVersionData.map(v => v.software_type))).map(softwareType => {
      const versions = eolVersionData.filter(v => v.software_type === softwareType);
      return {
        softwareType,
        totalInstances: versions.reduce((sum, v) => sum + v.unique_vulnerability_count, 0),
        uniqueVersions: versions.reduce((sum, v) => sum + v.unique_vulnerability_count, 0)
      };
    }).sort((a, b) => b.totalInstances - a.totalInstances) : [];

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
      const sheetName = "5.3 EOL Versions";
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
            <h1 className="text-3xl font-bold">EOL Versions</h1>
            <p className="text-muted-foreground">Detailed analysis of end-of-life software versions and distribution</p>
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
          <p className="text-muted-foreground">Loading EOL versions data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">EOL Versions</h1>
          <p className="text-muted-foreground">Detailed analysis of end-of-life software versions and distribution</p>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SimpleMetricCard
          title="Total SEoL Components"
          value={stats.totalSEoLComponents}
          color="red"
        />
        <SimpleMetricCard
          title="Total Different Software Types"
          value={stats.totalDifferentSoftwareTypes}
          color="blue"
          onClick={() => setIsSoftwareTypesDialogOpen(true)}
        />
        <SimpleMetricCard
          title="Total Different Versions"
          value={stats.totalDifferentVersions}
          color="green"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SEoL Software Distribution Table */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold mb-4">SEoL Software Distribution</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4">Software Type</th>
                  <th className="text-center py-3 px-4">Unique Vulnerability Count</th>
                  <th className="text-center py-3 px-4">Unique Versions</th>
                </tr>
              </thead>
              <tbody>
                {softwareDistribution.map((item, index) => (
                  <tr key={index} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-4 text-sm">{item.softwareType}</td>
                    <td className="py-3 px-4 text-center font-bold">{item.totalInstances}</td>
                    <td className="py-3 px-4 text-center">{item.uniqueVersions}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-border bg-muted/20">
                  <td className="py-3 px-4 font-semibold">Total</td>
                  <td className="py-3 px-4 text-center font-bold">{stats.totalSEoLComponents}</td>
                  <td className="py-3 px-4 text-center font-bold">{stats.totalSEoLComponents}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Chart - Software Distribution */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold mb-4">Software Distribution Chart</h3>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={softwareDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="softwareType" 
                  stroke="#9ca3af" 
                  fontSize={10}
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "#1f2937", 
                    border: "1px solid #374151",
                    borderRadius: "8px"
                  }}
                  formatter={(value, name) => {
                    return [value, "Unique Vulnerability Count"];
                  }}
                />
                <Bar dataKey="totalInstances" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* SEoL Version Details */}
      <div className="chart-container">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold">SEoL Version Details</h3>
          <div className="flex items-center gap-2">
            <Button
              variant={selectedSoftwareType === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedSoftwareType(null)}
            >
              All Software Types
            </Button>
            <div className="relative group">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                Filter by Software Type
                <ChevronDown className="h-4 w-4" />
              </Button>
              <div className="absolute right-0 mt-2 w-64 bg-background border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                <div className="py-1 max-h-48 overflow-y-auto">
                  {uniqueSoftwareTypes.map((softwareType) => (
                    <button
                      key={softwareType}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center justify-between ${
                        selectedSoftwareType === softwareType ? 'bg-muted' : ''
                      }`}
                      onClick={() => setSelectedSoftwareType(softwareType)}
                    >
                      <span className="truncate">{softwareType}</span>
                      {selectedSoftwareType === softwareType && (
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
                          className="text-primary flex-shrink-0 ml-2"
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
                <th className="text-left py-3 px-4">Software Type</th>
                <th className="text-center py-3 px-4">Version</th>
                <th className="text-center py-3 px-4">Unique Vulnerability Count</th>
              </tr>
            </thead>
            <tbody>
              {filteredVersionData.map((item, index) => (
                <tr key={index} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="py-3 px-4 text-sm">{item.software_type}</td>
                  <td className="py-3 px-4 text-center font-mono text-sm">{item.version}</td>
                  <td className="py-3 px-4 text-center font-bold">{item.unique_vulnerability_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Software Types Dialog */}
      <Dialog open={isSoftwareTypesDialogOpen} onOpenChange={setIsSoftwareTypesDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Software Types ({uniqueSoftwareTypes.length})</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {uniqueSoftwareTypes.map((softwareType, index) => (
              <div key={index} className="p-3 border rounded-md hover:bg-muted/20 transition-colors">
                <span className="text-sm font-medium">{softwareType}</span>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
