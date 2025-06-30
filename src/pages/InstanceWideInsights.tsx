import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, ShieldCheck, Clock, BarChart2 } from "lucide-react";
import { SimpleMetricCard } from "@/components/SimpleMetricCard";
import { SimpleTable } from "@/components/SimpleTable";
import { useMemo } from "react";
import { format } from 'date-fns';

interface RunSummary {
  "Scan Date": string;
  "Run ID": string;
  "Total Vulnerabilities": number;
  Critical: number;
  High: number;
  Medium: number;
  Low: number;
}

// Custom Tooltip for Charts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 rounded bg-gray-800 border border-gray-700 text-white text-xs">
        <div className="font-semibold mb-1">{label}</div>
        {payload.map((pld: any, index: number) => (
          <div key={index} style={{ color: pld.color }}>
            {`${pld.name}: `}
            <span className="font-mono">{pld.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const InstanceWideInsights = () => {
  const instanceId = localStorage.getItem('currentInstanceId');

  const { data: instanceData, isLoading: isLoadingInstanceData } = useQuery({
    queryKey: ['instanceWideInsights', instanceId],
    queryFn: async () => {
      if (!instanceId) return null;

      // Fetch all runs for the instance
      const { data: runs, error: runsError } = await supabase
        .from('runs')
        .select('run_id, created_at')
        .eq('instance_id', instanceId)
        .order('created_at', { ascending: true });
      if (runsError) throw new Error(runsError.message);

      const runIds = runs.map(r => r.run_id);
      
      // Fetch CVE summary for all runs
      const { data: cveSummary, error: cveError } = await supabase
        .from('cve_summary')
        .select('run_id, cve, severity, count')
        .in('run_id', runIds);
      if (cveError) throw new Error(cveError.message);

      // Fetch MTTM data for all runs
      const { data: mttmData, error: mttmError } = await supabase
        .from('mttm_by_severity')
        .select('run_id, risk_severity, average_mttm_days')
        .in('run_id', runIds);
      if (mttmError) throw new Error(mttmError.message);

      // Fetch EOL data for the latest run
      const latestRunId = runIds[runIds.length - 1];
      const { data: eolComponentsData, error: eolComponentsError } = await supabase
        .from('eol_components')
        .select('*')
        .eq('instance_id', instanceId)
        .eq('run_id', latestRunId);
      if (eolComponentsError) throw new Error(eolComponentsError.message);

      const { data: eolIpData, error: eolIpError } = await supabase
        .from('eol_ip')
        .select('*')
        .eq('instance_id', instanceId)
        .eq('run_id', latestRunId);
      if (eolIpError) throw new Error(eolIpError.message);

      const { data: eolVersionsData, error: eolVersionsError } = await supabase
        .from('eol_versions')
        .select('*')
        .eq('instance_id', instanceId)
        .eq('run_id', latestRunId);
      if (eolVersionsError) throw new Error(eolVersionsError.message);

      return { runs, cveSummary, mttmData, eolComponentsData, eolIpData, eolVersionsData };
    },
    enabled: !!instanceId,
  });

  const { chartData, tableData, metrics, topCves, pieChartData, severityProportionData, mostImprovedScan, oldestCVEs, scanFrequency, firstScanDate, lastScanDate, maxVulns, minVulns, totalUniqueCVEs, mostCommonSeverity, top10Cves, scanWithMostCriticals, scanWithMostHighs, scanWithMostCVEs, lineChartData, heatmapData, eolCards, eolRiskPie, eolTopSoftware, eolTopComponents, eolRiskOverTime, eolLongestPersisting, resolvedEol, newEol, resolvedEolCount, topHostsEol, eolAging } = useMemo(() => {
    if (!instanceData) return { 
      chartData: [], 
      tableData: [], 
      metrics: { totalRuns: 0, avgVulnerabilitiesPerRun: 0, criticalInLatest: 0, highInLatest: 0, growthPercentage: 0, criticalTrend: 0 },
      topCves: [],
      pieChartData: [],
      severityProportionData: [],
      mostImprovedScan: null,
      oldestCVEs: [],
      scanFrequency: null,
      firstScanDate: null,
      lastScanDate: null,
      maxVulns: 0,
      minVulns: 0,
      totalUniqueCVEs: 0,
      mostCommonSeverity: null,
      top10Cves: [],
      scanWithMostCriticals: null,
      scanWithMostHighs: null,
      scanWithMostCVEs: null,
      lineChartData: [],
      heatmapData: [],
      eolCards: [],
      eolRiskPie: [],
      eolTopSoftware: [],
      eolTopComponents: [],
      eolRiskOverTime: [],
      eolLongestPersisting: [],
      resolvedEol: [],
      newEol: 0,
      resolvedEolCount: 0,
      topHostsEol: [],
      eolAging: [],
    };

    const { runs, cveSummary, eolComponentsData = [], eolIpData = [], eolVersionsData = [] } = instanceData;

    // Process data for table & trends
    const runsTableData: RunSummary[] = runs.map(run => {
      const summaryForRun = cveSummary.filter(c => c.run_id === run.run_id);
      const severities: { [key: string]: number } = { Critical: 0, High: 0, Medium: 0, Low: 0 };
      
      summaryForRun.forEach(s => {
        const severity = s.severity === "Low/None" ? "Low" : s.severity;
        if (severity && severities.hasOwnProperty(severity)) {
            severities[severity] += (s.count || 1);
        }
      });
      
      const totalVulnerabilities = Object.values(severities).reduce((acc, val) => acc + val, 0);

      return {
        "Scan Date": new Date(run.created_at).toLocaleDateString(),
        "Run ID": run.run_id,
        "Total Vulnerabilities": totalVulnerabilities,
        "Critical": severities.Critical,
        "High": severities.High,
        "Medium": severities.Medium,
        "Low": severities.Low
      };
    }).sort((a, b) => new Date(a["Scan Date"]).getTime() - new Date(b["Scan Date"]).getTime());


    // Chart data uses the now-sorted table data
    const vulnerabilityTrends = runsTableData.map(d => ({
      date: d["Scan Date"],
      Critical: d.Critical,
      High: d.High,
      Medium: d.Medium,
      Low: d.Low,
    }));

    // Calculate overall metrics
    const totalRuns = runs.length;
    const latestRunSummary = runsTableData[totalRuns - 1];
    const firstRunSummary = runsTableData[0];
    const previousRunSummary = runsTableData[totalRuns - 2];

    const criticalInLatest = latestRunSummary?.Critical || 0;
    const highInLatest = latestRunSummary?.High || 0;

    const growthPercentage = firstRunSummary && latestRunSummary && firstRunSummary["Total Vulnerabilities"] > 0
      ? ((latestRunSummary["Total Vulnerabilities"] - firstRunSummary["Total Vulnerabilities"]) / firstRunSummary["Total Vulnerabilities"]) * 100
      : 0;

    const criticalTrend = previousRunSummary && latestRunSummary
      ? latestRunSummary.Critical - previousRunSummary.Critical
      : 0;

    const totalVulnerabilitiesAllTime = runsTableData.reduce((acc, s) => acc + s["Total Vulnerabilities"], 0);
    const avgVulnerabilitiesPerRun = totalRuns > 0 ? (totalVulnerabilitiesAllTime / totalRuns) : 0;

    const calculatedMetrics = {
      totalRuns,
      avgVulnerabilitiesPerRun: Math.round(avgVulnerabilitiesPerRun),
      criticalInLatest,
      highInLatest,
      growthPercentage: Math.round(growthPercentage),
      criticalTrend,
    };

    // Top 5 Recurring CVEs
    const cveCounts: { [key: string]: number } = {};
    cveSummary.forEach(cve => {
      cveCounts[cve.cve] = (cveCounts[cve.cve] || 0) + (cve.count || 1);
    });
    const topCves = Object.entries(cveCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, value]) => ({ name, value }));
      
    // Pie Chart data for latest run
    const pieChartData = latestRunSummary ? [
        { name: 'Critical', value: latestRunSummary.Critical, fill: '#dc2626' },
        { name: 'High', value: latestRunSummary.High, fill: '#ea580c' },
        { name: 'Medium', value: latestRunSummary.Medium, fill: '#facc15' },
        { name: 'Low', value: latestRunSummary.Low, fill: '#16a34a' },
    ] : [];

    // Severity Proportion Over Time
    const severityProportionData = runsTableData.map(d => {
      const c = typeof d.Critical === 'number' ? d.Critical : 0;
      const h = typeof d.High === 'number' ? d.High : 0;
      const m = typeof d.Medium === 'number' ? d.Medium : 0;
      const l = typeof d.Low === 'number' ? d.Low : 0;
      const total = c + h + m + l;
      return {
        date: d["Scan Date"],
        Critical: total ? c / total : 0,
        High: total ? h / total : 0,
        Medium: total ? m / total : 0,
        Low: total ? l / total : 0,
      };
    });

    // Most Improved Scan
    let mostImprovedScan = null;
    let maxDrop = 0;
    for (let i = 1; i < runsTableData.length; ++i) {
      const prevVal = runsTableData[i-1]["Total Vulnerabilities"];
      const currVal = runsTableData[i]["Total Vulnerabilities"];
      if (typeof prevVal === 'number' && typeof currVal === 'number') {
        const drop = prevVal - currVal;
        if (drop > maxDrop) {
          maxDrop = drop;
          mostImprovedScan = {
            date: runsTableData[i]["Scan Date"],
            drop,
            from: prevVal,
            to: currVal
          };
        }
      }
    }

    // Longest Unfixed CVEs
    // For each CVE, count in how many unique runs it appears
    const cveRunCounts: { [cve: string]: Set<string> } = {};
    cveSummary.forEach(cve => {
      if (!cveRunCounts[cve.cve]) cveRunCounts[cve.cve] = new Set();
      cveRunCounts[cve.cve].add(cve.run_id);
    });
    const oldestCVEs = Object.entries(cveRunCounts)
      .map(([cve, runs]) => ({ cve, scans: runs.size }))
      .sort((a, b) => b.scans - a.scans)
      .slice(0, 3);

    // Scan Frequency
    let scanFrequency = null;
    if (runsTableData.length > 1) {
      let totalDays = 0;
      for (let i = 1; i < runsTableData.length; ++i) {
        const prevDate = new Date(runsTableData[i-1]["Scan Date"]);
        const currDate = new Date(runsTableData[i]["Scan Date"]);
        if (!isNaN(prevDate.getTime()) && !isNaN(currDate.getTime())) {
          totalDays += (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);
        }
      }
      scanFrequency = (runsTableData.length - 1) > 0 ? Math.round(totalDays / (runsTableData.length - 1)) : null;
    }
    // First/Last Scan Dates
    const firstScanDate = runsTableData[0]?.["Scan Date"] || null;
    const lastScanDate = runsTableData[runsTableData.length-1]?.["Scan Date"] || null;

    // Max/Min Vulnerabilities in a Scan
    const maxVulns = Math.max(...runsTableData.map(d => d["Total Vulnerabilities"]));
    const minVulns = Math.min(...runsTableData.map(d => d["Total Vulnerabilities"]));

    // Total Unique CVEs
    const totalUniqueCVEs = new Set(cveSummary.map(c => c.cve)).size;

    // Most Common Severity
    const severityCounts = { Critical: 0, High: 0, Medium: 0, Low: 0 };
    cveSummary.forEach(c => {
      const sev = c.severity === "Low/None" ? "Low" : c.severity;
      if (sev && severityCounts.hasOwnProperty(sev)) severityCounts[sev] += (c.count || 1);
    });
    const mostCommonSeverity = Object.entries(severityCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

    // Top 10 Most Common CVEs
    const top10Cves = Object.entries(cveCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([name, value]) => ({ name, value }));

    // Scan with Most Criticals/Highs/Unique CVEs
    let scanWithMostCriticals = null, scanWithMostHighs = null, scanWithMostCVEs = null;
    let maxCriticals = 0, maxHighs = 0, maxUniqueCVEs = 0;
    runsTableData.forEach(run => {
      if (run.Critical > maxCriticals) {
        maxCriticals = run.Critical;
        scanWithMostCriticals = run;
      }
      if (run.High > maxHighs) {
        maxHighs = run.High;
        scanWithMostHighs = run;
      }
      // Unique CVEs in this run
      const uniqueCVEs = new Set(cveSummary.filter(c => c.run_id === run["Run ID"]).map(c => c.cve)).size;
      if (uniqueCVEs > maxUniqueCVEs) {
        maxUniqueCVEs = uniqueCVEs;
        scanWithMostCVEs = { ...run, uniqueCVEs };
      }
    });

    // Line chart for total vulnerabilities over time
    const lineChartData = runsTableData.map(d => ({ date: d["Scan Date"], Total: d["Total Vulnerabilities"] }));

    // Heatmap data: rows = scan (date+time), columns = severity
    const heatmapData = runsTableData.map(run => {
      const scanDate = run["Scan Date"];
      const scanTime = runs.find(r => format(new Date(r.created_at), 'yyyy-MM-dd') === scanDate)?.created_at;
      let label = scanDate;
      if (runsTableData.filter(r => r["Scan Date"] === scanDate).length > 1 && scanTime) {
        label = `${scanDate}, ${format(new Date(scanTime), 'hh:mm a')}`;
      }
      return {
        label,
        Critical: run.Critical,
        High: run.High,
        Medium: run.Medium,
        Low: run.Low,
      };
    });

    // EOL Insights
    const totalUniqueEolComponents = eolComponentsData.length;
    const softwareTypesAffected = new Set(eolComponentsData.map(item => item.software)).size;
    const hostsWithEolComponents = eolIpData.length;
    const uniqueEolVersions = eolVersionsData.length;
    const eolCards = [
      { title: "EOL Components", value: totalUniqueEolComponents },
      { title: "Hosts with EOL Components", value: hostsWithEolComponents },
      { title: "Unique EOL Versions", value: uniqueEolVersions },
      { title: "Software Types Affected", value: softwareTypesAffected },
    ];
    // Risk distribution
    const riskDistribution = eolComponentsData.reduce((acc, item) => {
      const risk = item.risk?.toLowerCase() || 'unknown';
      acc[risk] = (acc[risk] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const totalRiskItems = Object.values(riskDistribution).reduce((sum, count) => sum + count, 0);
    const eolRiskPie = [
      { name: "Critical", value: riskDistribution.critical || 0, color: "#ef4444" },
      { name: "High", value: riskDistribution.high || 0, color: "#f97316" },
      { name: "Medium", value: riskDistribution.medium || 0, color: "#eab308" },
      { name: "Low", value: riskDistribution.low || 0, color: "#22c55e" },
    ];
    // Top EOL software types
    const softwareTypeCount = eolVersionsData.reduce((acc, item) => {
      const softwareType = item.software_type;
      acc[softwareType] = (acc[softwareType] || 0) + item.unique_vulnerability_count;
      return acc;
    }, {} as Record<string, number>);
    const eolTopSoftware = Object.entries(softwareTypeCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
    // Top EOL components (across all runs)
    const eolComponentCount = eolComponentsData.reduce((acc, item) => {
      const key = typeof item.software === 'string' && item.software.trim() ? item.software : 'Unknown';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const eolTopComponents = Object.entries(eolComponentCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    // EOL/SEOL Risk Over Time (stacked area chart)
    const eolRiskOverTime = runs.map(run => {
      const runId = run.run_id;
      const runDate = new Date(run.created_at).toLocaleDateString();
      const runEolComponents = eolComponentsData.filter(e => e.run_id === runId);
      const runRisk = runEolComponents.reduce((acc, item) => {
        const risk = item.risk?.toLowerCase() || 'unknown';
        acc[risk] = (acc[risk] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      return {
        date: runDate,
        Critical: runRisk.critical || 0,
        High: runRisk.high || 0,
        Medium: runRisk.medium || 0,
        Low: runRisk.low || 0,
        Total: runEolComponents.length,
      };
    });
    // EOL/SEOL First Seen, Last Seen, Aging
    const eolSeenMap: Record<string, { first: string; last: string; count: number }> = {};
    eolComponentsData.forEach(item => {
      const key = typeof item.software === 'string' && item.software.trim() ? item.software : 'Unknown';
      const run = runs.find(r => r.run_id === item.run_id);
      const date = run ? new Date(run.created_at).toLocaleDateString() : 'Unknown';
      if (!eolSeenMap[key]) {
        eolSeenMap[key] = { first: date, last: date, count: 1 };
      } else {
        if (date < eolSeenMap[key].first) eolSeenMap[key].first = date;
        if (date > eolSeenMap[key].last) eolSeenMap[key].last = date;
        eolSeenMap[key].count++;
      }
    });
    const eolAging = Object.entries(eolSeenMap)
      .map(([name, v]) => ({ name, ...v }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    const eolLongestPersisting = eolAging;
    // Resolved EOL: present in earlier, not in latest
    const latestRunId = runs.length ? runs[runs.length-1].run_id : null;
    const latestEolSet = new Set(eolComponentsData.filter(e => e.run_id === latestRunId).map(e => e.software));
    const resolvedEol = Object.entries(eolSeenMap)
      .filter(([name, v]) => !latestEolSet.has(name))
      .map(([name, v]) => ({ name, ...v }))
      .sort((a, b) => b.last.localeCompare(a.last))
      .slice(0, 5);
    // Churn metrics
    const prevRunId = runs.length > 1 ? runs[runs.length-2].run_id : null;
    const prevEolSet = new Set(eolComponentsData.filter(e => e.run_id === prevRunId).map(e => e.software));
    const newEol = latestEolSet.size ? [...latestEolSet].filter(x => !prevEolSet.has(x)).length : 0;
    const resolvedEolCount = prevEolSet.size ? [...prevEolSet].filter(x => !latestEolSet.has(x)).length : 0;
    // Top hosts with EOL
    const hostEolCount = eolIpData.reduce((acc, item) => {
      const key = typeof item.ip_address === 'string' && item.ip_address.trim() ? item.ip_address : 'Unknown';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const topHostsEol = Object.entries(hostEolCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return { 
      chartData: vulnerabilityTrends, 
      tableData: [...runsTableData].reverse(), // For display, newest first
      metrics: calculatedMetrics,
      topCves,
      pieChartData,
      severityProportionData,
      mostImprovedScan,
      oldestCVEs,
      scanFrequency,
      firstScanDate,
      lastScanDate,
      maxVulns,
      minVulns,
      totalUniqueCVEs,
      mostCommonSeverity,
      top10Cves,
      scanWithMostCriticals,
      scanWithMostHighs,
      scanWithMostCVEs,
      lineChartData,
      heatmapData,
      eolCards,
      eolRiskPie,
      eolTopSoftware,
      eolTopComponents,
      eolRiskOverTime,
      eolLongestPersisting,
      resolvedEol,
      newEol,
      resolvedEolCount,
      topHostsEol,
      eolAging,
    };
  }, [instanceData]);

  if (isLoadingInstanceData) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Loading instance-wide insights...</p>
      </div>
    );
  }

  if (!instanceId || !instanceData) {
    return (
      <div className="flex items-center justify-center h-full">
         <div className="text-center p-8 border rounded-lg bg-card">
          <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
          <h2 className="mt-4 text-2xl font-bold">No Instance Selected</h2>
          <p className="mt-2 text-muted-foreground">Please select an instance to view its historical insights.</p>
        </div>
      </div>
    );
  }

  const severityColors: { [key: string]: string } = {
    Critical: "#dc2626",
    High: "#ea580c",
    Medium: "#facc15",
    Low: "#16a34a"
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Instance-Wide Insights</h1>
        <p className="text-muted-foreground">Historical security posture and vulnerability trends for the selected instance.</p>
      </div>
      
      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
        <SimpleMetricCard title="Total Scans" value={metrics.totalRuns?.toLocaleString()} />
        <SimpleMetricCard title="Avg. Vulns / Scan" value={metrics.avgVulnerabilitiesPerRun?.toLocaleString()} />
        <SimpleMetricCard title="Max Vulns in a Scan" value={maxVulns} color="red" />
        <SimpleMetricCard title="Min Vulns in a Scan" value={minVulns} color="green" />
        <SimpleMetricCard title="Unique CVEs" value={totalUniqueCVEs} color="blue" />
        <SimpleMetricCard title="Most Common Severity" value={mostCommonSeverity} />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 mt-2">
        <SimpleMetricCard title="Vulnerability Growth" value={`${metrics.growthPercentage}%`} subtitle="Since first scan" color={metrics.growthPercentage > 0 ? "red" : "green"} />
        <SimpleMetricCard title="Critical Issues Trend" value={metrics.criticalTrend} subtitle="Since last scan" color={metrics.criticalTrend > 0 ? "red" : "green"} />
        <SimpleMetricCard title="Scan w/ Most Criticals" value={scanWithMostCriticals ? `${scanWithMostCriticals["Scan Date"]} (${scanWithMostCriticals.Critical})` : '-'} color="red" />
        <SimpleMetricCard title="Scan w/ Most Highs" value={scanWithMostHighs ? `${scanWithMostHighs["Scan Date"]} (${scanWithMostHighs.High})` : '-'} color="yellow" />
        <SimpleMetricCard title="Scan w/ Most CVEs" value={scanWithMostCVEs ? `${scanWithMostCVEs["Scan Date"]} (${scanWithMostCVEs.uniqueCVEs})` : '-'} color="blue" />
        <SimpleMetricCard title="Most Improved Scan" value={mostImprovedScan ? `${mostImprovedScan.date} (↓${mostImprovedScan.drop})` : '-'} color="green" />
      </div>

      {/* Vulnerability Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Vulnerability Trends Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line type="monotone" dataKey="Critical" stroke={severityColors.Critical} />
                <Line type="monotone" dataKey="High" stroke={severityColors.High} />
                <Line type="monotone" dataKey="Medium" stroke={severityColors.Medium} />
                <Line type="monotone" dataKey="Low" stroke={severityColors.Low} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* New Visualizations Column */}
        <div className="lg:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Vulnerability Severity Proportion Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={severityProportionData} stackOffset="expand">
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="date" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" tickFormatter={v => (typeof v === 'number' ? `${Math.round(v*100)}%` : v)} />
                            <Tooltip content={<CustomTooltip />} formatter={v => (typeof v === 'number' ? `${Math.round(v*100)}%` : v)} />
                            <Legend />
                            <Area type="monotone" dataKey="Critical" stackId="1" stroke="#dc2626" fill="#dc2626" name="Critical" />
                            <Area type="monotone" dataKey="High" stackId="1" stroke="#ea580c" fill="#ea580c" name="High" />
                            <Area type="monotone" dataKey="Medium" stackId="1" stroke="#facc15" fill="#facc15" name="Medium" />
                            <Area type="monotone" dataKey="Low" stackId="1" stroke="#16a34a" fill="#16a34a" name="Low" />
                        </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Total Vulnerabilities Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={lineChartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="date" stroke="#9ca3af" />
                                <YAxis stroke="#9ca3af" />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Line type="monotone" dataKey="Total" stroke="#6366f1" name="Total Vulnerabilities" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Vulnerability Heatmap</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead>
                                <tr>
                                    <th className="p-2">Scan</th>
                                    <th className="p-2">Critical</th>
                                    <th className="p-2">High</th>
                                    <th className="p-2">Medium</th>
                                    <th className="p-2">Low</th>
                                </tr>
                            </thead>
                            <tbody>
                                {heatmapData.map((row, idx) => (
                                    <tr key={idx}>
                                        <td className="p-2 font-mono">{row.label}</td>
                                        {['Critical','High','Medium','Low'].map(sev => {
                                            const value = typeof row[sev] === 'number' ? row[sev] : 0;
                                            const denom = Math.max(1, typeof maxVulns === 'number' ? maxVulns : 1);
                                            const intensity = value / denom;
                                            return (
                                              <td key={sev} className="p-2 text-center" style={{ background: `rgba(220,38,38,${intensity})`, color: value > 0 ? '#fff' : '#888' }}>{value}</td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
            {/* Insights Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Instance Insights</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <div className="text-muted-foreground text-xs">First Scan</div>
                            <div className="font-mono font-bold">{firstScanDate || '-'}</div>
                        </div>
                        <div>
                            <div className="text-muted-foreground text-xs">Last Scan</div>
                            <div className="font-mono font-bold">{lastScanDate || '-'}</div>
                        </div>
                        <div>
                            <div className="text-muted-foreground text-xs">Avg. Days Between Scans</div>
                            <div className="font-mono font-bold">{scanFrequency !== null ? scanFrequency : '-'}</div>
                        </div>
                        <div>
                            <div className="text-muted-foreground text-xs">Most Improved Scan</div>
                            <div className="font-mono font-bold">
                                {mostImprovedScan ? `${mostImprovedScan.date} (↓${mostImprovedScan.drop} vulns)` : '-'}
                            </div>
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="text-muted-foreground text-xs mb-1">Longest Unfixed CVEs</div>
                        <ul className="space-y-1">
                            {oldestCVEs.map(cve => (
                                <li key={cve.cve} className="flex justify-between text-xs">
                                    <span className="font-mono bg-muted px-2 py-1 rounded">{cve.cve}</span>
                                    <span className="font-bold">{cve.scans} scans</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>

        {/* Top CVEs and Pie Chart Column */}
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Top 10 Most Common CVEs</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={top10Cves} layout="vertical" margin={{ left: 40 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis type="number" stroke="#9ca3af" />
                                <YAxis dataKey="name" type="category" stroke="#9ca3af" width={120} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="value" fill="#6366f1" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Latest Scan Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={pieChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                    {pieChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
      
      {/* Run Summary Table */}
      <Card>
        <CardHeader>
          <CardTitle>Scan History & Summary</CardTitle>
        </CardHeader>
        <CardContent>
            <SimpleTable
                columns={[
                    { key: "Scan Date", title: "Scan Date" },
                    { key: "Run ID", title: "Run ID" },
                    { key: "Total Vulnerabilities", title: "Total Vulnerabilities" },
                    { key: "Critical", title: "Critical" },
                    { key: "High", title: "High" },
                    { key: "Medium", title: "Medium" },
                    { key: "Low", title: "Low" }
                ]}
                data={tableData.map(row => {
                  // If multiple scans have the same date, show time
                  const sameDateCount = tableData.filter(r => r["Scan Date"] === row["Scan Date"]).length;
                  if (sameDateCount > 1) {
                    const run = instanceData.runs.find(r => format(new Date(r.created_at), 'yyyy-MM-dd') === row["Scan Date"]);
                    if (run) {
                      return {
                        ...row,
                        "Scan Date": `${row["Scan Date"]}, ${format(new Date(run.created_at), 'hh:mm a')}`
                      };
                    }
                  }
                  return row;
                })}
            />
        </CardContent>
      </Card>

      {/* EOL/SEOL Advanced Insights Section */}
      <Card>
        <CardHeader>
          <CardTitle>SEOL Risk Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={eolRiskOverTime} stackOffset="expand">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" tickFormatter={v => (typeof v === 'number' ? `${Math.round(v*100)}%` : v)} />
                <Tooltip content={<CustomTooltip />} formatter={v => (typeof v === 'number' ? `${Math.round(v*100)}%` : v)} />
                <Legend />
                <Area type="monotone" dataKey="Critical" stackId="1" stroke="#ef4444" fill="#ef4444" name="Critical" />
                <Area type="monotone" dataKey="High" stackId="1" stroke="#f97316" fill="#f97316" name="High" />
                <Area type="monotone" dataKey="Medium" stackId="1" stroke="#eab308" fill="#eab308" name="Medium" />
                <Area type="monotone" dataKey="Low" stackId="1" stroke="#22c55e" fill="#22c55e" name="Low" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Longest Persisting EOL Components</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-xs">
              <thead>
                <tr>
                  <th className="p-2 text-left">Component</th>
                  <th className="p-2 text-left">First Seen</th>
                  <th className="p-2 text-left">Last Seen</th>
                  <th className="p-2 text-left">#Scans</th>
                </tr>
              </thead>
              <tbody>
                {eolLongestPersisting.map(row => (
                  <tr key={row.name}>
                    <td className="p-2 font-mono">{row.name}</td>
                    <td className="p-2">{row.first}</td>
                    <td className="p-2">{row.last}</td>
                    <td className="p-2">{row.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recently Resolved EOL Components</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-xs">
              <thead>
                <tr>
                  <th className="p-2 text-left">Component</th>
                  <th className="p-2 text-left">First Seen</th>
                  <th className="p-2 text-left">Last Seen</th>
                  <th className="p-2 text-left">#Scans</th>
                </tr>
              </thead>
              <tbody>
                {resolvedEol.map(row => (
                  <tr key={row.name}>
                    <td className="p-2 font-mono">{row.name}</td>
                    <td className="p-2">{row.first}</td>
                    <td className="p-2">{row.last}</td>
                    <td className="p-2">{row.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>EOL Churn</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-6">
              <div className="flex-1 bg-card rounded-lg border p-4 flex flex-col items-center">
                <div className="text-2xl font-bold mb-1">{newEol}</div>
                <div className="text-xs text-muted-foreground text-center">New EOL Components (Latest Scan)</div>
              </div>
              <div className="flex-1 bg-card rounded-lg border p-4 flex flex-col items-center">
                <div className="text-2xl font-bold mb-1">{resolvedEolCount}</div>
                <div className="text-xs text-muted-foreground text-center">Resolved EOL Components (Latest Scan)</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top Hosts with EOL Components</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={topHostsEol} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis type="number" stroke="#9ca3af" />
                <YAxis dataKey="name" type="category" stroke="#9ca3af" width={120} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InstanceWideInsights; 