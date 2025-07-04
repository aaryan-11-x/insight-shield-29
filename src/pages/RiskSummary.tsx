import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UUID } from "crypto";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface RiskSummaryData {
  count: number;
  severity: string;
  vulnerabilities_with_cve: number;
  instance_id: UUID;
  run_id: string;
}

interface CVEData {
  cve: string;
  count: number | null;
  severity: string | null;
  name: string | null;
  description: string | null;
  hosts: string | null;
  solutions: string | null;
  instance_id: UUID;
  run_id: string;
}

interface HostData {
  host: string;
  vulnerability_count: number;
  vulnerabilities_with_cve: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  instance_id: UUID;
  run_id: string;
}

export default function RiskSummary() {
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: riskData, isLoading: riskLoading } = useQuery({
    queryKey: ['risk-summary'],
    queryFn: async () => {
      const instanceId = localStorage.getItem('currentInstanceId');
      const runId = localStorage.getItem('currentRunId');
      const { data, error } = await supabase
        .from('risk_summary')
        .select('*')
        .eq('instance_id', instanceId)
        .eq('run_id', runId)
        // .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching risk summary data:', error);
        throw error;
      }
      
      return data;
    }
  });

  const { data: cveData, isLoading: cveLoading } = useQuery({
    queryKey: ['top-cves'],
    queryFn: async () => {
      const instanceId = localStorage.getItem('currentInstanceId');
      const runId = localStorage.getItem('currentRunId');
      const { data, error } = await supabase
        .from('cve_summary')
        .select('*')
        .eq('instance_id', instanceId)
        .eq('run_id', runId)
        .order('count', { ascending: false })
        .limit(10);
      
      if (error) {
        console.error('Error fetching CVE data:', error);
        throw error;
      }
      
      return data as CVEData[];
    }
  });

  const { data: hostData, isLoading: hostLoading } = useQuery({
    queryKey: ['top-hosts'],
    queryFn: async () => {
      const instanceId = localStorage.getItem('currentInstanceId');
      const runId = localStorage.getItem('currentRunId');
      const { data, error } = await supabase
        .from('host_summary')
        .select('*')
        .eq('instance_id', instanceId)
        .eq('run_id', runId)
        .order('vulnerability_count', { ascending: false })
        .order('vulnerabilities_with_cve', { ascending: false })
        .limit(10);
      
      if (error) {
        console.error('Error fetching host data:', error);
        throw error;
      }
      
      return data as HostData[];
    }
  });

  // Calculate totals for vulnerability severity
  const totalVulnerabilities = riskData?.reduce((sum, item) => sum + item.count, 0) || 0;
  const totalWithCVE = riskData?.reduce((sum, item) => sum + item.vulnerabilities_with_cve, 0) || 0;

  // Prepare pie chart data
  const pieData = riskData?.map(item => ({
    name: item.severity,
    value: item.count,
    color: 
      item.severity === "Critical" ? "#ef4444" :
      item.severity === "High" ? "#f97316" :
      item.severity === "Medium" ? "#eab308" :
      "#22c55e"
  })) || [];

  // Prepare CVE chart data
  const cveChartData = cveData?.map(item => ({
    cve: item.cve,
    count: item.count || 0,
    severity: item.severity
  })) || [];

  // Prepare host chart data
  const hostChartData = hostData?.map(item => ({
    host: item.host.length > 15 ? item.host.substring(0, 15) + "..." : item.host,
    fullHost: item.host,
    count: item.vulnerability_count
  })) || [];

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
      const sheetName = "4. Risk Summary";
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

  const handleCVEClick = () => {
    navigate('/dashboard/cve-summary');
  };

  const handleHostClick = () => {
    navigate('/dashboard/hosts-summary');
  };

  if (riskLoading || cveLoading || hostLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Risk Summary</h1>
            <p className="text-muted-foreground">Risk assessment and vulnerability overview</p>
          </div>
          <Button className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download Sheet
          </Button>
        </div>
        <div className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">Loading risk data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Risk Summary</h1>
          <p className="text-muted-foreground">Overview of risk metrics and trends</p>
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="metric-card">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Total Vulnerabilities</p>
            <p className="text-3xl font-bold">{totalVulnerabilities.toLocaleString()}</p>
          </div>
        </div>
        <div className="metric-card">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Vulnerabilities with CVE</p>
            <p className="text-3xl font-bold">{totalWithCVE.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Vulnerability Severity Distribution */}
      <div className="chart-container">
        <h3 className="text-lg font-semibold mb-4">Vulnerability Severity Distribution</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4">Severity</th>
                  <th className="text-center py-3 px-4">Count</th>
                  <th className="text-center py-3 px-4">With CVE</th>
                </tr>
              </thead>
              <tbody>
                {riskData?.map((item, index) => (
                  <tr key={index} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-4">
                      <Badge variant={
                        item.severity === "Critical" ? "destructive" : 
                        item.severity === "High" ? "default" : 
                        "secondary"
                      }>
                        {item.severity}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-center font-bold">{item.count}</td>
                    <td className="py-3 px-4 text-center">{item.vulnerabilities_with_cve}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pie Chart */}
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
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
        </div>
      </div>

      {/* Top 10 CVEs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CVE Table */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold mb-4">Top 10 CVEs</h3>
          <div className="overflow-x-auto cursor-pointer" onClick={handleCVEClick}>
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4">CVE</th>
                  <th className="text-center py-3 px-4">Count</th>
                  <th className="text-center py-3 px-4">Severity</th>
                </tr>
              </thead>
              <tbody>
                {cveData?.map((item, index) => (
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CVE Chart */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold mb-4">Top CVEs by Count</h3>
          <div className="h-80 cursor-pointer" onClick={handleCVEClick}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cveChartData} layout="vertical" onClick={handleCVEClick}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis type="number" stroke="#9ca3af" />
                <YAxis type="category" dataKey="cve" stroke="#9ca3af" fontSize={10} width={100} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px"
                  }}
                />
                <Bar dataKey="count" fill="#3b82f6" onClick={handleCVEClick} cursor="pointer" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top 10 Vulnerable Hosts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Host Table */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold mb-4">Top 10 Vulnerable Hosts</h3>
          <div className="overflow-x-auto cursor-pointer" onClick={handleHostClick}>
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4">Host</th>
                  <th className="text-center py-3 px-4">Vulnerability Count</th>
                  <th className="text-center py-3 px-4">CVE Count</th>
                </tr>
              </thead>
              <tbody>
                {hostData?.map((item, index) => (
                  <tr key={index} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-4 font-mono text-sm">{item.host}</td>
                    <td className="py-3 px-4 text-center font-bold">{item.vulnerability_count}</td>
                    <td className="py-3 px-4 text-center">{item.vulnerabilities_with_cve}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Host Chart */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold mb-4">Top Hosts by Vulnerability Count</h3>
          <div className="h-80 cursor-pointer" onClick={handleHostClick}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hostChartData} layout="vertical" onClick={handleHostClick}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis type="number" stroke="#9ca3af" />
                <YAxis type="category" dataKey="host" stroke="#9ca3af" fontSize={10} width={120} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px"
                  }}
                  formatter={(value, name, props) => [value, "Vulnerability Count"]}
                  labelFormatter={(label, payload) => payload?.[0]?.payload?.fullHost || label}
                />
                <Bar dataKey="count" fill="#ef4444" onClick={handleHostClick} cursor="pointer" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
