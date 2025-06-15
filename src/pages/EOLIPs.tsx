import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Badge } from "@/components/ui/badge";
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

interface EOLIPData {
  ip_address: unknown;
  risk_level: string;
  seol_component_count: number;
  instance_id: UUID;
  run_id: string;
}

export default function EOLIPs() {
  const { data: eolIPData, isLoading } = useQuery({
    queryKey: ['eol-ips'],
    queryFn: async () => {
      const instanceId = localStorage.getItem('currentInstanceId');
      const runId = localStorage.getItem('currentRunId');
      const { data, error } = await supabase
        .from('eol_ip')
        .select('*')
        .eq('instance_id', instanceId)
        .eq('run_id', runId)
        .order('seol_component_count', { ascending: false });
      
      if (error) {
        console.error('Error fetching EOL IP data:', error);
        throw error;
      }
      
      return data;
    }
  });

  const [isDownloading, setIsDownloading] = useState(false);
  const [isOneComponentDialogOpen, setIsOneComponentDialogOpen] = useState(false);
  const [isTwoToFiveDialogOpen, setIsTwoToFiveDialogOpen] = useState(false);
  const [isMoreThanFiveDialogOpen, setIsMoreThanFiveDialogOpen] = useState(false);
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<string | null>(null);
  const { toast } = useToast();

  // Calculate statistics
  const stats = eolIPData ? {
    totalIPsWithSEoLComponents: eolIPData.length,
    averageSEoLComponentsPerIP: eolIPData.length > 0 ? 
      (eolIPData.reduce((sum, ip) => sum + ip.seol_component_count, 0) / eolIPData.length).toFixed(2) : 0,
    maximumSEoLComponentsOnSingleIP: eolIPData.length > 0 ? 
      Math.max(...eolIPData.map(ip => ip.seol_component_count)) : 0,
    ipsWithOneSEoLComponent: eolIPData.filter(ip => ip.seol_component_count === 1).length,
    ipsWithTwoToFiveSEoLComponents: eolIPData.filter(ip => ip.seol_component_count >= 2 && ip.seol_component_count <= 5).length,
    ipsWithMoreThanFiveSEoLComponents: eolIPData.filter(ip => ip.seol_component_count > 5).length
  } : {
    totalIPsWithSEoLComponents: 0,
    averageSEoLComponentsPerIP: 0,
    maximumSEoLComponentsOnSingleIP: 0,
    ipsWithOneSEoLComponent: 0,
    ipsWithTwoToFiveSEoLComponents: 0,
    ipsWithMoreThanFiveSEoLComponents: 0
  };

  // Get top 10 IPs for chart
  const topIPsForChart = eolIPData ? eolIPData.slice(0, 10) : [];

  // Get filtered IPs for each category
  const oneComponentIPs = eolIPData?.filter(ip => ip.seol_component_count === 1) || [];
  const twoToFiveComponentIPs = eolIPData?.filter(ip => ip.seol_component_count >= 2 && ip.seol_component_count <= 5) || [];
  const moreThanFiveComponentIPs = eolIPData?.filter(ip => ip.seol_component_count > 5) || [];

  // Filter data based on selected risk level
  const filteredIPData = useMemo(() => {
    if (!eolIPData) return [];
    if (!selectedRiskLevel) return eolIPData;
    
    return eolIPData.filter(ip => ip.risk_level === selectedRiskLevel);
  }, [eolIPData, selectedRiskLevel]);

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
      const sheetName = "5.2 EOL IPs";
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
            <h1 className="text-3xl font-bold">EOL IPs</h1>
            <p className="text-muted-foreground">IP address analysis for end-of-life component tracking</p>
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
          <p className="text-muted-foreground">Loading EOL IP data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">EOL IPs</h1>
          <p className="text-muted-foreground">IP address analysis for end-of-life component tracking</p>
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

      {/* SEoL IP Statistics - Full Width */}
      <div className="chart-container">
        <h3 className="text-lg font-semibold mb-4">SEoL IP Statistics</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center p-2">
              <span className="text-sm text-muted-foreground">Total IPs with SEoL Components</span>
              <span className="font-bold">{stats.totalIPsWithSEoLComponents}</span>
            </div>
            <div className="flex justify-between items-center p-2">
              <span className="text-sm text-muted-foreground">Average SEoL Components per IP</span>
              <span className="font-bold">{stats.averageSEoLComponentsPerIP}</span>
            </div>
            <div className="flex justify-between items-center p-2">
              <span className="text-sm text-muted-foreground">Maximum SEoL Components on Single IP</span>
              <span className="font-bold">{stats.maximumSEoLComponentsOnSingleIP}</span>
            </div>
          </div>
          <div className="space-y-3">
            <div 
              className="flex justify-between items-center p-2 cursor-pointer hover:bg-muted/20 rounded-md transition-colors"
              onClick={() => setIsOneComponentDialogOpen(true)}
            >
              <span className="text-sm text-muted-foreground">IPs with 1 SEoL Component</span>
              <span className="font-bold">{stats.ipsWithOneSEoLComponent}</span>
            </div>
            <div 
              className="flex justify-between items-center p-2 cursor-pointer hover:bg-muted/20 rounded-md transition-colors"
              onClick={() => setIsTwoToFiveDialogOpen(true)}
            >
              <span className="text-sm text-muted-foreground">IPs with 2-5 SEoL Components</span>
              <span className="font-bold">{stats.ipsWithTwoToFiveSEoLComponents}</span>
            </div>
            <div 
              className="flex justify-between items-center p-2 cursor-pointer hover:bg-muted/20 rounded-md transition-colors"
              onClick={() => setIsMoreThanFiveDialogOpen(true)}
            >
              <span className="text-sm text-muted-foreground">IPs with &gt;5 SEoL Components</span>
              <span className="font-bold">{stats.ipsWithMoreThanFiveSEoLComponents}</span>
            </div>
          </div>
        </div>
      </div>

      {/* IP Details Dialogs */}
      <Dialog open={isOneComponentDialogOpen} onOpenChange={setIsOneComponentDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>IPs with 1 SEoL Component</DialogTitle>
          </DialogHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3 bg-muted">IP Address</th>
                  <th className="text-center py-2 px-3 bg-muted">Risk Level</th>
                </tr>
              </thead>
              <tbody>
                {oneComponentIPs.map((ip, index) => (
                  <tr key={index} className="border-b hover:bg-muted/20">
                    <td className="py-2 px-3 font-mono">{String(ip.ip_address)}</td>
                    <td className="py-2 px-3 text-center">
                      <Badge variant={
                        ip.risk_level === "Critical" ? "destructive" : 
                        ip.risk_level === "High" ? "default" : 
                        ip.risk_level === "Medium" ? "secondary" :
                        "outline"
                      }>
                        {ip.risk_level}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isTwoToFiveDialogOpen} onOpenChange={setIsTwoToFiveDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>IPs with 2-5 SEoL Components</DialogTitle>
          </DialogHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3 bg-muted">IP Address</th>
                  <th className="text-center py-2 px-3 bg-muted">SEoL Component Count</th>
                  <th className="text-center py-2 px-3 bg-muted">Risk Level</th>
                </tr>
              </thead>
              <tbody>
                {twoToFiveComponentIPs.map((ip, index) => (
                  <tr key={index} className="border-b hover:bg-muted/20">
                    <td className="py-2 px-3 font-mono">{String(ip.ip_address)}</td>
                    <td className="py-2 px-3 text-center font-bold">{ip.seol_component_count}</td>
                    <td className="py-2 px-3 text-center">
                      <Badge variant={
                        ip.risk_level === "Critical" ? "destructive" : 
                        ip.risk_level === "High" ? "default" : 
                        ip.risk_level === "Medium" ? "secondary" :
                        "outline"
                      }>
                        {ip.risk_level}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isMoreThanFiveDialogOpen} onOpenChange={setIsMoreThanFiveDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>IPs with More Than 5 SEoL Components</DialogTitle>
          </DialogHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3 bg-muted">IP Address</th>
                  <th className="text-center py-2 px-3 bg-muted">SEoL Component Count</th>
                  <th className="text-center py-2 px-3 bg-muted">Risk Level</th>
                </tr>
              </thead>
              <tbody>
                {moreThanFiveComponentIPs.map((ip, index) => (
                  <tr key={index} className="border-b hover:bg-muted/20">
                    <td className="py-2 px-3 font-mono">{String(ip.ip_address)}</td>
                    <td className="py-2 px-3 text-center font-bold">{ip.seol_component_count}</td>
                    <td className="py-2 px-3 text-center">
                      <Badge variant={
                        ip.risk_level === "Critical" ? "destructive" : 
                        ip.risk_level === "High" ? "default" : 
                        ip.risk_level === "Medium" ? "secondary" :
                        "outline"
                      }>
                        {ip.risk_level}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>

      {/* Table and Chart Split 50/50 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top IPs Table - Left Side */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold mb-4">Top IPs with Most SEoL Components (For Chart)</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4">IP Address</th>
                  <th className="text-center py-3 px-4">SEoL Component Count</th>
                  <th className="text-center py-3 px-4">Risk Level</th>
                </tr>
              </thead>
              <tbody>
                {topIPsForChart.map((item, index) => (
                  <tr key={index} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-4 font-mono text-sm">{String(item.ip_address)}</td>
                    <td className="py-3 px-4 text-center font-bold">{item.seol_component_count}</td>
                    <td className="py-3 px-4 text-center">
                      <Badge variant={
                        item.risk_level === "Critical" ? "destructive" : 
                        item.risk_level === "High" ? "default" : 
                        item.risk_level === "Medium" ? "secondary" :
                        "outline"
                      }>
                        {item.risk_level}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Chart - Right Side */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold mb-4">Top 10 IPs by SEoL Component Count</h3>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topIPsForChart} layout="vertical" margin={{ top: 5, right: 30, left: 120, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis type="number" stroke="#9ca3af" />
                <YAxis type="category" dataKey="ip_address" stroke="#9ca3af" fontSize={10} width={110} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "#1f2937", 
                    border: "1px solid #374151",
                    borderRadius: "8px"
                  }}
                  labelFormatter={(value) => `IP: ${value}`}
                  formatter={(value, name) => [`${value}`, "SEoL Components"]}
                />
                <Bar dataKey="seol_component_count" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Complete List - Full Width */}
      <div className="chart-container">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold">Complete List of All IPs with SEoL Components</h3>
          <div className="flex items-center gap-2">
            <Button
              variant={selectedRiskLevel === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedRiskLevel(null)}
            >
              All Risk Levels
            </Button>
            <div className="relative group">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                Filter by Risk Level
                <ChevronDown className="h-4 w-4" />
              </Button>
              <div className="absolute right-0 mt-2 w-48 bg-background border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                <div className="py-1">
                  {["Critical", "High", "Medium", "Low"].map((riskLevel) => (
                    <button
                      key={riskLevel}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center justify-between ${
                        selectedRiskLevel === riskLevel ? 'bg-muted' : ''
                      }`}
                      onClick={() => setSelectedRiskLevel(riskLevel)}
                    >
                      <span>{riskLevel}</span>
                      {selectedRiskLevel === riskLevel && (
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
        <div className="max-h-96 overflow-y-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-background">
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4">IP Address</th>
                <th className="text-center py-3 px-4">SEoL Component Count</th>
                <th className="text-center py-3 px-4">Risk Level</th>
              </tr>
            </thead>
            <tbody>
              {filteredIPData.map((item, index) => (
                <tr key={index} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="py-3 px-4 font-mono text-sm">{String(item.ip_address)}</td>
                  <td className="py-3 px-4 text-center font-bold">{item.seol_component_count}</td>
                  <td className="py-3 px-4 text-center">
                    <Badge variant={
                      item.risk_level === "Critical" ? "destructive" : 
                      item.risk_level === "High" ? "default" : 
                      item.risk_level === "Medium" ? "secondary" :
                      "outline"
                    }>
                      {item.risk_level}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
