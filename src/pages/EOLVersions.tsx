
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { SimpleMetricCard } from "@/components/SimpleMetricCard";

const eolVersionsStats = {
  totalSEoLComponents: 215,
  totalDifferentSoftwareTypes: 7,
  totalDifferentVersions: 7
};

const seolSoftwareDistribution = [
  { softwareType: "ASP.NET Core", totalInstances: 99, uniqueVersions: 1 },
  { softwareType: "Microsoft .NET Core", totalInstances: 58, uniqueVersions: 1 },
  { softwareType: "Apache Log4j", totalInstances: 47, uniqueVersions: 1 },
  { softwareType: ".NET Core SDK", totalInstances: 6, uniqueVersions: 1 },
  { softwareType: "Microsoft Silverlight", totalInstances: 2, uniqueVersions: 1 },
  { softwareType: "Microsoft Windows Server 2008", totalInstances: 2, uniqueVersions: 1 },
  { softwareType: "Microsoft Windows Server 2012", totalInstances: 1, uniqueVersions: 1 }
];

const seolVersionDetails = [
  { softwareType: ".NET Core SDK", version: "Unknown", instanceCount: 6 },
  { softwareType: "ASP.NET Core", version: "Unknown", instanceCount: 99 },
  { softwareType: "Apache Log4j", version: "Unknown", instanceCount: 47 },
  { softwareType: "Microsoft .NET Core", version: "Unknown", instanceCount: 58 },
  { softwareType: "Microsoft Silverlight", version: "Unknown", instanceCount: 2 },
  { softwareType: "Microsoft Windows Server 2008", version: "2008", instanceCount: 2 },
  { softwareType: "Microsoft Windows Server 2012", version: "2012", instanceCount: 1 }
];

export default function EOLVersions() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">EOL Versions</h1>
        <p className="text-muted-foreground">Detailed analysis of end-of-life software versions and distribution</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SimpleMetricCard
          title="Total SEoL Components"
          value={eolVersionsStats.totalSEoLComponents}
          color="red"
        />
        <SimpleMetricCard
          title="Total Different Software Types"
          value={eolVersionsStats.totalDifferentSoftwareTypes}
          color="blue"
        />
        <SimpleMetricCard
          title="Total Different Versions"
          value={eolVersionsStats.totalDifferentVersions}
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
                  <th className="text-center py-3 px-4">Total Instances</th>
                  <th className="text-center py-3 px-4">Unique Versions</th>
                </tr>
              </thead>
              <tbody>
                {seolSoftwareDistribution.map((item, index) => (
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
                  <td className="py-3 px-4 text-center font-bold">215</td>
                  <td className="py-3 px-4 text-center font-bold">7</td>
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
              <BarChart data={seolSoftwareDistribution}>
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
                />
                <Bar dataKey="totalInstances" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* SEoL Version Details */}
      <div className="chart-container">
        <h3 className="text-lg font-semibold mb-4">SEoL Version Details</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4">Software Type</th>
                <th className="text-center py-3 px-4">Version</th>
                <th className="text-center py-3 px-4">Instance Count</th>
              </tr>
            </thead>
            <tbody>
              {seolVersionDetails.map((item, index) => (
                <tr key={index} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="py-3 px-4 text-sm">{item.softwareType}</td>
                  <td className="py-3 px-4 text-center font-mono text-sm">{item.version}</td>
                  <td className="py-3 px-4 text-center font-bold">{item.instanceCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
