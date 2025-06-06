
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Badge } from "@/components/ui/badge";

const eolSummaryStats = {
  totalUniqueEOLComponents: 7,
  softwareTypesAffected: 7,
  hostsWithEOLComponents: 48,
  uniqueEOLVersions: 7
};

const riskDistribution = [
  { severity: "Critical", count: 215, percentage: "100.0%" },
  { severity: "High", count: 0, percentage: "0.0%" },
  { severity: "Medium", count: 0, percentage: "0.0%" },
  { severity: "Low", count: 0, percentage: "0.0%" }
];

const pieChartData = [
  { name: "Critical", value: 215, color: "#ef4444" },
  { name: "High", value: 0, color: "#f97316" },
  { name: "Medium", value: 0, color: "#eab308" },
  { name: "Low", value: 0, color: "#22c55e" }
];

const topEOLSoftwareTypes = [
  { name: "ASP.NET Core", count: 99 },
  { name: "Microsoft .NET Core", count: 58 },
  { name: "Apache Log4j", count: 47 },
  { name: ".NET Core SDK", count: 6 },
  { name: "Microsoft Silverlight", count: 2 },
  { name: "Windows Server 2008", count: 2 },
  { name: "Windows Server 2012", count: 1 }
];

export default function EOLSummary() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">EOL Summary</h1>
        <p className="text-muted-foreground">Comprehensive overview of end-of-life components and risk assessment</p>
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
                <p className="text-2xl font-bold">{eolSummaryStats.totalUniqueEOLComponents}</p>
              </div>
            </div>
            <div className="metric-card">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Software Types Affected</p>
                <p className="text-2xl font-bold">{eolSummaryStats.softwareTypesAffected}</p>
              </div>
            </div>
            <div className="metric-card">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Hosts with EOL Components</p>
                <p className="text-2xl font-bold">{eolSummaryStats.hostsWithEOLComponents}</p>
              </div>
            </div>
            <div className="metric-card">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Unique EOL Versions</p>
                <p className="text-2xl font-bold">{eolSummaryStats.uniqueEOLVersions}</p>
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
                  <td className="py-3 px-4 text-center text-red-400 font-bold">215</td>
                  <td className="py-3 px-4 text-center text-orange-400 font-bold">0</td>
                  <td className="py-3 px-4 text-center text-yellow-400 font-bold">0</td>
                  <td className="py-3 px-4 text-center text-green-400 font-bold">0</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4 text-center">100.0%</td>
                  <td className="py-3 px-4 text-center">0.0%</td>
                  <td className="py-3 px-4 text-center">0.0%</td>
                  <td className="py-3 px-4 text-center">0.0%</td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="border-t border-border">
                  <td colSpan={3} className="py-3 px-4 font-semibold">Total</td>
                  <td className="py-3 px-4 text-center font-bold">215</td>
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
