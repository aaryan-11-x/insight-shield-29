import { ClickableMetricCard } from "@/components/ClickableMetricCard";
import { ClickableChartContainer } from "@/components/ClickableChartContainer";
import { DownloadDropdown } from "@/components/DownloadDropdown";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function Dashboard() {
  // Fetch CVE summary data
  const { data: cveData } = useQuery({
    queryKey: ['cve-summary'],
    queryFn: async () => {
      const instanceId = localStorage.getItem('currentInstanceId');
      const runId = localStorage.getItem('currentRunId');
      const { data, error } = await supabase
        .from('cve_summary')
        .select('cve, count')
        .eq('instance_id', instanceId)
        .eq('run_id', runId)
        .order('count', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch host summary data
  const { data: hostData } = useQuery({
    queryKey: ['host-summary'],
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
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch vulnerability clustering data
  const { data: clusteringData } = useQuery({
    queryKey: ['vulnerability-clustering'],
    queryFn: async () => {
      const instanceId = localStorage.getItem('currentInstanceId');
      const runId = localStorage.getItem('currentRunId');
      const { data, error } = await supabase
        .from('vulnerability_clustering')
        .select('product_service, total_vulnerabilities')
        .eq('instance_id', instanceId)
        .eq('run_id', runId)
        .order('total_vulnerabilities', { ascending: false })
        .limit(8);
      
      if (error) throw error;
      return data?.map((item, index) => ({
        name: item.product_service,
        value: item.total_vulnerabilities,
        color: ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#06b6d4", "#84cc16", "#6b7280"][index]
      }));
    }
  });

  // Fetch aging data
  const { data: agingData } = useQuery({
    queryKey: ['aging-data'],
    queryFn: async () => {
      const instanceId = localStorage.getItem('currentInstanceId');
      const runId = localStorage.getItem('currentRunId');
      const { data, error } = await supabase
        .from('ageing_of_vulnerability')
        .select('days_after_discovery')
        .eq('instance_id', instanceId)
        .eq('run_id', runId);
      
      if (error) throw error;
      
      const ranges = {
        "0-30 days": 0,
        "31-90 days": 0,
        "91-180 days": 0,
        "181-365 days": 0,
        "Over 1 year": 0,
      };

      data.forEach(vuln => {
        const days = vuln.days_after_discovery;
        if (days === null) return;
        if (days <= 30) ranges["0-30 days"]++;
        else if (days <= 90) ranges["31-90 days"]++;
        else if (days <= 180) ranges["91-180 days"]++;
        else if (days <= 365) ranges["181-365 days"]++;
        else ranges["Over 1 year"]++;
      });

      return Object.entries(ranges).map(([ageRange, count]) => ({
        ageRange,
        count
      }));
    }
  });

  // Fetch unique assets data
  const { data: assetsData } = useQuery({
    queryKey: ['unique-assets'],
    queryFn: async () => {
      const instanceId = localStorage.getItem('currentInstanceId');
      const runId = localStorage.getItem('currentRunId');
      const { data, error } = await supabase
        .from('unique_assets')
        .select('*')
        .eq('instance_id', instanceId)
        .eq('run_id', runId);
      
      if (error) throw error;
      
      return data?.map(item => ({
        name: item.assets_type,
        value: item.count,
        color: item.assets_type.includes("Vulnerable") ? "#dc2626" : "#16a34a"
      }));
    }
  });

  // Fetch risk summary data
  const { data: riskData } = useQuery({
    queryKey: ['risk-summary'],
    queryFn: async () => {
      const instanceId = localStorage.getItem('currentInstanceId');
      const runId = localStorage.getItem('currentRunId');
      const { data, error } = await supabase
        .from('risk_summary')
        .select('*')
        .eq('instance_id', instanceId)
        .eq('run_id', runId)
        .order('count', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch summary statistics
  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const instanceId = localStorage.getItem('currentInstanceId');
      const runId = localStorage.getItem('currentRunId');
      const [
        { data: totalVulns },
        { data: exploitabilityData },
        { data: kevData },
        { data: eolData },
        { data: remediationData }
      ] = await Promise.all([
        supabase.from('ageing_of_vulnerability').select('id', { count: 'exact' }).eq('instance_id', instanceId).eq('run_id', runId),
        supabase.from('exploitability_scoring').select('exploitability_score').gte('exploitability_score', 7).eq('instance_id', instanceId).eq('run_id', runId),
        supabase.from('exploitability_scoring').select('kev_listed').eq('kev_listed', true).eq('instance_id', instanceId).eq('run_id', runId),
        supabase.from('eol_components').select('name', { count: 'exact' }).eq('instance_id', instanceId).eq('run_id', runId),
        supabase.from('remediation_insights').select('id', { count: 'exact' }).eq('instance_id', instanceId).eq('run_id', runId)
      ]);

      return {
        totalVulnerabilities: totalVulns?.length || 0,
        highExploitability: exploitabilityData?.length || 0,
        kevListed: kevData?.length || 0,
        eolComponents: eolData?.length || 0,
        totalRemediations: remediationData?.length || 0
      };
    }
  });

  const handleDownloadReport = () => {
    console.log("Downloading dashboard report...");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Vulnerability Visualization</h1>
          <p className="text-muted-foreground">Comprehensive security overview and threat assessment</p>
        </div>
        <DownloadDropdown 
          onDownloadExcel={() => {}} 
          onDownloadPDF={() => console.log("PDF download not implemented yet")} 
          buttonText="Download Full Report" 
        />
      </div>

      {/* Clickable Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <ClickableMetricCard
          title="Total Vulnerabilities"
          value={stats?.totalVulnerabilities || 0}
          color="default"
          href="/dashboard/vulnerability-aging"
        />
        <ClickableMetricCard
          title="High Exploitability (≥7)"
          value={stats?.highExploitability || 0}
          color="critical"
          trend="up"
          href="/dashboard/exploitability"
        />
        <ClickableMetricCard
          title="KEV-Listed Vulns"
          value={stats?.kevListed || 0}
          color="warning"
          href="/dashboard/exploitability"
        />
        <ClickableMetricCard
          title="EOL Components"
          value={stats?.eolComponents || 0}
          color="warning"
          href="/dashboard/eol-components"
        />
        <ClickableMetricCard
          title="Total Remediations"
          value={stats?.totalRemediations || 0}
          color="success"
          trend="down"
          href="/dashboard/remediation"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vulnerability Risk Levels */}
        <ClickableChartContainer title="Vulnerability Risk Levels" href="/dashboard/risk-summary">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="severity" stroke="#9ca3af" />
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
                      <span style={{ color: "#000000" }}>{`Count: ${value}`}</span>,
                      null
                    ];
                  }}
                />
                <Bar dataKey="count" name="Count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ClickableChartContainer>

        {/* Unique Assets */}
        <ClickableChartContainer title="Unique Assets">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={assetsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {assetsData?.map((entry, index) => (
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
          <div className="flex justify-center gap-4 mt-4">
            {assetsData?.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm">{item.name} ({item.value})</span>
              </div>
            ))}
          </div>
        </ClickableChartContainer>

        {/* Vulnerability Categories */}
        <ClickableChartContainer title="Vulnerability Categories" href="/dashboard/clustering">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={clusteringData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {clusteringData?.map((entry, index) => (
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
          <div className="grid grid-cols-2 gap-2 mt-4">
            {clusteringData?.map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-xs">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </ClickableChartContainer>

        {/* Vulnerability Age Distribution */}
        <ClickableChartContainer title="Vulnerability Age Distribution" href="/dashboard/vulnerability-aging">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={agingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="ageRange" stroke="#9ca3af" angle={-45} textAnchor="end" height={80} />
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
                      <span style={{ color: "#000000" }}>{`Count: ${value}`}</span>,
                      null
                    ];
                  }}
                />
                <Bar dataKey="count" name="Count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ClickableChartContainer>
      </div>

      {/* Top 10 Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 10 CVEs */}
        <ClickableChartContainer title="Top 10 CVEs" href="/dashboard/cve-summary">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4">CVE</th>
                  <th className="text-left py-3 px-4">Count</th>
                </tr>
              </thead>
              <tbody>
                {cveData?.map((item, index) => (
                  <tr key={index} className="border-b border-border/50 hover:bg-muted/20">
                    <td className="py-3 px-4">
                      <code className="text-sm font-mono bg-background px-2 py-1 rounded">{item.cve}</code>
                    </td>
                    <td className="py-3 px-4 font-medium">{item.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ClickableChartContainer>

        {/* Top 10 Vulnerable Hosts */}
        <ClickableChartContainer title="Top 10 Vulnerable Hosts" href="/dashboard/hosts-summary">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4">Host</th>
                  <th className="text-center py-3 px-4 bg-red-500/20">Critical</th>
                  <th className="text-center py-3 px-4 bg-orange-500/20">High</th>
                  <th className="text-center py-3 px-4 bg-yellow-500/20">Medium</th>
                  <th className="text-center py-3 px-4 bg-green-500/20">Low</th>
                </tr>
              </thead>
              <tbody>
                {hostData?.map((item, index) => (
                  <tr key={index} className="border-b border-border/50 hover:bg-muted/20">
                    <td className="py-3 px-4">
                      <code className="text-sm font-mono">{item.host}</code>
                    </td>
                    <td className="py-3 px-4 text-center font-bold">{item.critical}</td>
                    <td className="py-3 px-4 text-center font-bold">{item.high}</td>
                    <td className="py-3 px-4 text-center font-bold">{item.medium}</td>
                    <td className="py-3 px-4 text-center font-bold">{item.low}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ClickableChartContainer>
      </div>
    </div>
  );
}
