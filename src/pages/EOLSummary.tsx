import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UUID } from "crypto";
import { DownloadDropdown } from "@/components/DownloadDropdown";

interface EOLSummaryData {
  total_unique_components: number;
  software_types_affected: number;
  hosts_with_eol_components: number;
  unique_eol_versions: number;
  critical_count: number;
  high_count: number;
  medium_count: number;
  low_count: number;
  critical_pct: number;
  high_pct: number;
  medium_pct: number;
  low_pct: number;
  asp_net_core_count: number;
  microsoft_dotnet_core_count: number;
  apache_log4j_count: number;
  dotnet_core_sdk_count: number;
  microsoft_silverlight_count: number;
  total_count: number;
  created_at: string;
  id: number;
  instance_id: UUID;
}

export default function EOLSummary() {
  const { data: eolSummaryData, isLoading, error } = useQuery({
    queryKey: ['eol-summary'],
    queryFn: async () => {
      const instanceId = localStorage.getItem('currentInstanceId');
      const { data, error } = await supabase
        .from('eol_summary')
        .select('*')
        .eq('instance_id', instanceId)
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (error) {
        console.error('Error fetching EOL summary data:', error);
        throw error;
      }
      
      return data?.[0];
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">EOL Summary</h1>
            <p className="text-muted-foreground">Comprehensive overview of end-of-life components and risk assessment</p>
          </div>
          <DownloadDropdown />
        </div>
        <div className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">Loading EOL summary data...</p>
        </div>
      </div>
    );
  }

  if (error || !eolSummaryData) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">EOL Summary</h1>
            <p className="text-muted-foreground">Comprehensive overview of end-of-life components and risk assessment</p>
          </div>
          <DownloadDropdown />
        </div>
        <div className="flex items-center justify-center py-8">
          <p className="text-red-400">Error loading EOL summary data</p>
        </div>
      </div>
    );
  }

  const pieChartData = [
    { name: "Critical", value: eolSummaryData.critical_count, color: "#ef4444" },
    { name: "High", value: eolSummaryData.high_count, color: "#f97316" },
    { name: "Medium", value: eolSummaryData.medium_count, color: "#eab308" },
    { name: "Low", value: eolSummaryData.low_count, color: "#22c55e" }
  ];

  const topEOLSoftwareTypes = [
    { name: "ASP.NET Core", count: eolSummaryData.asp_net_core_count },
    { name: "Microsoft .NET Core", count: eolSummaryData.microsoft_dotnet_core_count },
    { name: "Apache Log4j", count: eolSummaryData.apache_log4j_count },
    { name: ".NET Core SDK", count: eolSummaryData.dotnet_core_sdk_count },
    { name: "Microsoft Silverlight", count: eolSummaryData.microsoft_silverlight_count }
  ].sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">EOL Summary</h1>
          <p className="text-muted-foreground">Comprehensive overview of end-of-life components and risk assessment</p>
        </div>
        <DownloadDropdown />
      </div>

      {/* End of Life Components Summary */}
      <div className="chart-container">
        <h2 className="text-xl font-semibold mb-6">End of Life Components Summary</h2>

        {/* EOL Summary Statistics */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">EOL Summary Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="metric-card">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Total Unique EOL Components</p>
                <p className="text-2xl font-bold">{eolSummaryData.total_unique_components}</p>
              </div>
            </div>
            <div className="metric-card">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Software Types Affected</p>
                <p className="text-2xl font-bold">{eolSummaryData.software_types_affected}</p>
              </div>
            </div>
            <div className="metric-card">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Hosts with EOL Components</p>
                <p className="text-2xl font-bold">{eolSummaryData.hosts_with_eol_components}</p>
              </div>
            </div>
            <div className="metric-card">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Unique EOL Versions</p>
                <p className="text-2xl font-bold">{eolSummaryData.unique_eol_versions}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Distribution */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Risk Distribution</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-center py-3 px-4">Critical</th>
                  <th className="text-center py-3 px-4">High</th>
                  <th className="text-center py-3 px-4">Medium</th>
                  <th className="text-center py-3 px-4">Low</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4 text-center text-red-400 font-bold">{eolSummaryData.critical_count}</td>
                  <td className="py-3 px-4 text-center text-orange-400 font-bold">{eolSummaryData.high_count}</td>
                  <td className="py-3 px-4 text-center text-yellow-400 font-bold">{eolSummaryData.medium_count}</td>
                  <td className="py-3 px-4 text-center text-green-400 font-bold">{eolSummaryData.low_count}</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4 text-center">{eolSummaryData.critical_pct.toFixed(1)}%</td>
                  <td className="py-3 px-4 text-center">{eolSummaryData.high_pct.toFixed(1)}%</td>
                  <td className="py-3 px-4 text-center">{eolSummaryData.medium_pct.toFixed(1)}%</td>
                  <td className="py-3 px-4 text-center">{eolSummaryData.low_pct.toFixed(1)}%</td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="border-t border-border">
                  <td colSpan={3} className="py-3 px-4 font-semibold">Total</td>
                  <td className="py-3 px-4 text-center font-bold">{eolSummaryData.total_count}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart - Top EOL Software Types */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold mb-4">Top EOL Software Types</h3>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topEOLSoftwareTypes} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  type="number"
                  stroke="#9ca3af"
                  domain={[0, 'dataMax + 10']}
                  label={{
                    value: "Component Count",
                    position: "insideBottom",
                    offset: -5,
                    fill: "#9ca3af",
                    fontSize: 12
                  }}
                />
                <YAxis type="category" dataKey="name" stroke="#9ca3af" fontSize={12} width={120} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px"
                  }}
                />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart - EOL Components by Risk Level */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold mb-4">EOL Components by Risk Level</h3>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px"
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
