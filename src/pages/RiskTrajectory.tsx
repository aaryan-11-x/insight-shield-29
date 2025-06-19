import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle, BarChart3, Activity } from "lucide-react";
import { useMemo } from "react";

interface RunData {
  run_id: string;
  created_at: string;
  scan_date: string;
}

interface RiskSummaryData {
  count: number;
  severity: string;
  run_id: string;
}

interface CVESummaryData {
  count: number | null;
  severity: string | null;
  run_id: string;
}

export default function RiskTrajectory() {
  const instanceId = localStorage.getItem('currentInstanceId');

  // Fetch all runs for the current instance
  const { data: runsData, isLoading: runsLoading } = useQuery({
    queryKey: ['runs-trajectory', instanceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('runs')
        .select('run_id, created_at, scan_date')
        .eq('instance_id', instanceId)
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error('Error fetching runs data:', error);
        throw error;
      }
      
      return data as RunData[];
    },
    enabled: !!instanceId
  });

  // Fetch risk summary data for all runs
  const { data: riskData, isLoading: riskLoading } = useQuery({
    queryKey: ['risk-summary-trajectory', instanceId],
    queryFn: async () => {
      if (!runsData?.length) return [];
      
      const runIds = runsData.map(run => run.run_id);
      const { data, error } = await supabase
        .from('risk_summary')
        .select('count, severity, run_id')
        .eq('instance_id', instanceId)
        .in('run_id', runIds);
      
      if (error) {
        console.error('Error fetching risk summary data:', error);
        throw error;
      }
      
      return data as RiskSummaryData[];
    },
    enabled: !!runsData?.length
  });

  // Fetch CVE summary data for all runs
  const { data: cveData, isLoading: cveLoading } = useQuery({
    queryKey: ['cve-summary-trajectory', instanceId],
    queryFn: async () => {
      if (!runsData?.length) return [];
      
      const runIds = runsData.map(run => run.run_id);
      const { data, error } = await supabase
        .from('cve_summary')
        .select('count, severity, run_id')
        .eq('instance_id', instanceId)
        .in('run_id', runIds);
      
      if (error) {
        console.error('Error fetching CVE summary data:', error);
        throw error;
      }
      
      return data as CVESummaryData[];
    },
    enabled: !!runsData?.length
  });

  // Process data for charts and tables
  const { totalVulnerabilitiesData, severityTrendsData, trendAnalysis } = useMemo(() => {
    if (!runsData || !riskData || !cveData) {
      return {
        totalVulnerabilitiesData: [],
        severityTrendsData: [],
        trendAnalysis: {
          totalTrend: 'neutral' as const,
          totalChange: 0,
          totalChangePercent: 0,
          severityTrends: {
            critical: { trend: 'neutral' as const, change: 0, changePercent: 0 },
            high: { trend: 'neutral' as const, change: 0, changePercent: 0 },
            medium: { trend: 'neutral' as const, change: 0, changePercent: 0 },
            low: { trend: 'neutral' as const, change: 0, changePercent: 0 }
          }
        }
      };
    }

    // Helper function to format timestamp with hours/minutes in brackets if needed
    const formatTimestamp = (createdAt: string, runId: string, allRuns: RunData[]) => {
      const date = new Date(createdAt);
      const dateOnly = date.toISOString().split('T')[0];
      
      // Check if there are multiple runs on the same date
      const runsOnSameDate = allRuns.filter(run => 
        new Date(run.created_at).toISOString().split('T')[0] === dateOnly
      );
      
      if (runsOnSameDate.length > 1) {
        // Include hours and minutes in brackets for runs on the same date
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${dateOnly} (${hours}:${minutes})`;
      }
      
      return dateOnly;
    };

    // Process total vulnerabilities data
    const totalVulnerabilitiesData = runsData.map(run => {
      const runRiskData = riskData.filter(r => r.run_id === run.run_id);
      const totalVulns = runRiskData.reduce((sum, item) => sum + item.count, 0);
      
      return {
        timestamp: formatTimestamp(run.created_at, run.run_id, runsData),
        totalVulnerabilities: totalVulns,
        run_id: run.run_id
      };
    });

    // Process severity trends data
    const severityTrendsData = runsData.map(run => {
      const runCveData = cveData.filter(c => c.run_id === run.run_id);
      
      const critical = runCveData
        .filter(c => c.severity === "Critical")
        .reduce((sum, c) => sum + (c.count || 0), 0);
      
      const high = runCveData
        .filter(c => c.severity === "High")
        .reduce((sum, c) => sum + (c.count || 0), 0);
      
      const medium = runCveData
        .filter(c => c.severity === "Medium")
        .reduce((sum, c) => sum + (c.count || 0), 0);
      
      const low = runCveData
        .filter(c => c.severity === "Low" || c.severity === "Low/None")
        .reduce((sum, c) => sum + (c.count || 0), 0);
      
      return {
        timestamp: formatTimestamp(run.created_at, run.run_id, runsData),
        critical,
        high,
        medium,
        low,
        run_id: run.run_id
      };
    });

    // Calculate trend analysis
    const trendAnalysis = (() => {
      if (totalVulnerabilitiesData.length < 2) {
        return {
          totalTrend: 'neutral' as const,
          totalChange: 0,
          totalChangePercent: 0,
          severityTrends: {
            critical: { trend: 'neutral' as const, change: 0, changePercent: 0 },
            high: { trend: 'neutral' as const, change: 0, changePercent: 0 },
            medium: { trend: 'neutral' as const, change: 0, changePercent: 0 },
            low: { trend: 'neutral' as const, change: 0, changePercent: 0 }
          }
        };
      }

      const firstTotal = totalVulnerabilitiesData[0].totalVulnerabilities;
      const lastTotal = totalVulnerabilitiesData[totalVulnerabilitiesData.length - 1].totalVulnerabilities;
      const totalChange = lastTotal - firstTotal;
      const totalChangePercent = firstTotal > 0 ? (totalChange / firstTotal) * 100 : 0;
      const totalTrend: 'up' | 'down' | 'neutral' = totalChange > 0 ? 'up' : totalChange < 0 ? 'down' : 'neutral';

      const firstSeverity = severityTrendsData[0];
      const lastSeverity = severityTrendsData[severityTrendsData.length - 1];

      const calculateSeverityTrend = (severity: 'critical' | 'high' | 'medium' | 'low') => {
        const first = firstSeverity[severity];
        const last = lastSeverity[severity];
        const change = last - first;
        const changePercent = first > 0 ? (change / first) * 100 : 0;
        const trend: 'up' | 'down' | 'neutral' = change > 0 ? 'up' : change < 0 ? 'down' : 'neutral';
        
        return { trend, change, changePercent };
      };

      return {
        totalTrend,
        totalChange,
        totalChangePercent,
        severityTrends: {
          critical: calculateSeverityTrend('critical'),
          high: calculateSeverityTrend('high'),
          medium: calculateSeverityTrend('medium'),
          low: calculateSeverityTrend('low')
        }
      };
    })();

    return { totalVulnerabilitiesData, severityTrendsData, trendAnalysis };
  }, [runsData, riskData, cveData]);

  const isLoading = runsLoading || riskLoading || cveLoading;

  const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-green-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendBadge = (trend: 'up' | 'down' | 'neutral', changePercent: number) => {
    const isGood = trend === 'down' || (trend === 'neutral' && changePercent === 0);
    
    return (
      <Badge variant={isGood ? "default" : "destructive"} className="flex items-center gap-1 px-3 py-1">
        {getTrendIcon(trend)}
        <span className="font-semibold">{Math.abs(changePercent).toFixed(1)}%</span>
      </Badge>
    );
  };

  const getTrendMessage = (trend: 'up' | 'down' | 'neutral', changePercent: number, metric: string) => {
    if (trend === 'up') {
      return (
        <div className="flex items-center gap-2 text-white bg-red-900 p-3 rounded-lg border border-red-700">
          <AlertTriangle className="h-4 w-4 flex-shrink-0 text-red-200" />
          <span className="text-sm font-medium">⚠️ {metric} increased by {Math.abs(changePercent).toFixed(1)}% - Requires attention</span>
        </div>
      );
    } else if (trend === 'down') {
      return (
        <div className="flex items-center gap-2 text-white bg-emerald-900 p-3 rounded-lg border border-emerald-700">
          <CheckCircle className="h-4 w-4 flex-shrink-0 text-emerald-200" />
          <span className="text-sm font-medium">✅ {metric} decreased by {Math.abs(changePercent).toFixed(1)}% - Good progress</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-2 text-white bg-slate-900 p-3 rounded-lg border border-slate-700">
          <Minus className="h-4 w-4 flex-shrink-0 text-slate-200" />
          <span className="text-sm font-medium">➖ {metric} remained stable - No change</span>
        </div>
      );
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Activity className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Risk Trajectory</h1>
            <p className="text-muted-foreground">Vulnerability trends and risk evolution over time</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Loading trajectory data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!runsData?.length) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Activity className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Risk Trajectory</h1>
            <p className="text-muted-foreground">Vulnerability trends and risk evolution over time</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <BarChart3 className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No runs found for this instance</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Activity className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Risk Trajectory</h1>
          <p className="text-muted-foreground">Vulnerability trends and risk evolution over time</p>
        </div>
      </div>

      {/* Trend Analysis Summary */}
      <div className="bg-gradient-to-br from-card to-card/50 p-8 rounded-xl border shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <TrendingUp className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold">Trend Analysis Summary</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-muted-foreground">Total Vulnerabilities</span>
              {getTrendBadge(trendAnalysis.totalTrend, trendAnalysis.totalChangePercent)}
            </div>
            {getTrendMessage(trendAnalysis.totalTrend, trendAnalysis.totalChangePercent, "Total vulnerabilities")}
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-muted-foreground">Critical Severity</span>
              {getTrendBadge(trendAnalysis.severityTrends.critical.trend, trendAnalysis.severityTrends.critical.changePercent)}
            </div>
            {getTrendMessage(trendAnalysis.severityTrends.critical.trend, trendAnalysis.severityTrends.critical.changePercent, "Critical vulnerabilities")}
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-muted-foreground">High Severity</span>
              {getTrendBadge(trendAnalysis.severityTrends.high.trend, trendAnalysis.severityTrends.high.changePercent)}
            </div>
            {getTrendMessage(trendAnalysis.severityTrends.high.trend, trendAnalysis.severityTrends.high.changePercent, "High vulnerabilities")}
          </div>
        </div>
      </div>

      {/* Total Vulnerabilities Over Time */}
      <div className="bg-card p-6 rounded-xl border shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <BarChart3 className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold">Total Vulnerabilities Over Time</h3>
        </div>

        {/* Table */}
        <div className="mb-8 overflow-x-auto">
          <div className="rounded-lg border bg-muted/20">
          <table className="w-full">
            <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left py-4 px-6 font-semibold">Timestamp</th>
                  <th className="text-center py-4 px-6 font-semibold">Total Vulnerabilities</th>
                  <th className="text-center py-4 px-6 font-semibold">Run ID</th>
              </tr>
            </thead>
            <tbody>
              {totalVulnerabilitiesData.map((item, index) => (
                  <tr key={index} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-4 px-6 font-mono text-sm font-medium">{item.timestamp}</td>
                    <td className="py-4 px-6 text-center font-bold text-lg">{item.totalVulnerabilities.toLocaleString()}</td>
                    <td className="py-4 px-6 text-center text-xs text-muted-foreground font-mono bg-muted/30 rounded px-2 py-1">{item.run_id}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>

        {/* Chart */}
        <div className="h-96 bg-muted/20 rounded-lg p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={totalVulnerabilitiesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis dataKey="timestamp" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                }}
              />
              <Line
                type="monotone"
                dataKey="totalVulnerabilities"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: "#3b82f6", strokeWidth: 2, r: 5 }}
                activeDot={{ r: 8, stroke: "#3b82f6", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Vulnerability Trends By Severity Over Time */}
      <div className="bg-card p-6 rounded-xl border shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-100 rounded-lg">
            <BarChart3 className="h-5 w-5 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold">Vulnerability Trends By Severity Over Time</h3>
        </div>

        {/* Table */}
        <div className="mb-8 overflow-x-auto">
          <div className="rounded-lg border bg-muted/20">
          <table className="w-full">
            <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left py-4 px-6 font-semibold">Timestamp</th>
                  <th className="text-center py-4 px-6 font-semibold">Critical</th>
                  <th className="text-center py-4 px-6 font-semibold">High</th>
                  <th className="text-center py-4 px-6 font-semibold">Medium</th>
                  <th className="text-center py-4 px-6 font-semibold">Low</th>
                  <th className="text-center py-4 px-6 font-semibold">Run ID</th>
              </tr>
            </thead>
            <tbody>
              {severityTrendsData.map((item, index) => (
                  <tr key={index} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-4 px-6 font-mono text-sm font-medium">{item.timestamp}</td>
                    <td className="py-4 px-6 text-center text-red-500 font-bold text-lg">{item.critical.toLocaleString()}</td>
                    <td className="py-4 px-6 text-center text-orange-500 font-bold text-lg">{item.high.toLocaleString()}</td>
                    <td className="py-4 px-6 text-center text-yellow-500 font-bold text-lg">{item.medium.toLocaleString()}</td>
                    <td className="py-4 px-6 text-center text-green-500 font-bold text-lg">{item.low.toLocaleString()}</td>
                    <td className="py-4 px-6 text-center text-xs text-muted-foreground font-mono bg-muted/30 rounded px-2 py-1">{item.run_id}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>

        {/* Chart */}
        <div className="h-96 bg-muted/20 rounded-lg p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={severityTrendsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis dataKey="timestamp" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="critical"
                stroke="#dc2626"
                strokeWidth={3}
                dot={{ fill: "#dc2626", strokeWidth: 2, r: 5 }}
                activeDot={{ r: 8, stroke: "#dc2626", strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="high"
                stroke="#ea580c"
                strokeWidth={3}
                dot={{ fill: "#ea580c", strokeWidth: 2, r: 5 }}
                activeDot={{ r: 8, stroke: "#ea580c", strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="medium"
                stroke="#ca8a04"
                strokeWidth={3}
                dot={{ fill: "#ca8a04", strokeWidth: 2, r: 5 }}
                activeDot={{ r: 8, stroke: "#ca8a04", strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="low"
                stroke="#16a34a"
                strokeWidth={3}
                dot={{ fill: "#16a34a", strokeWidth: 2, r: 5 }}
                activeDot={{ r: 8, stroke: "#16a34a", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
