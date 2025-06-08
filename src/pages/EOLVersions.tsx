
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { SimpleMetricCard } from "@/components/SimpleMetricCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface EOLVersionData {
  software_type: string;
  version: string;
  instance_count: number;
}

export default function EOLVersions() {
  const { data: eolVersions, isLoading } = useQuery({
    queryKey: ['eol-versions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('eol_versions')
        .select('*')
        .order('instance_count', { ascending: false });
      
      if (error) {
        console.error('Error fetching EOL versions:', error);
        throw error;
      }
      
      return data as EOLVersionData[];
    }
  });

  // Calculate statistics
  const stats = eolVersions ? {
    totalSEoLComponents: eolVersions.reduce((sum, version) => sum + version.instance_count, 0),
    totalDifferentSoftwareTypes: new Set(eolVersions.map(v => v.software_type)).size,
    totalDifferentVersions: eolVersions.length
  } : {
    totalSEoLComponents: 0,
    totalDifferentSoftwareTypes: 0,
    totalDifferentVersions: 0
  };

  // Create software distribution data
  const softwareDistribution = eolVersions ? 
    Array.from(new Set(eolVersions.map(v => v.software_type))).map(softwareType => {
      const versions = eolVersions.filter(v => v.software_type === softwareType);
      return {
        softwareType,
        totalInstances: versions.reduce((sum, v) => sum + v.instance_count, 0),
        uniqueVersions: versions.length
      };
    }).sort((a, b) => b.totalInstances - a.totalInstances) : [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">EOL Versions</h1>
          <p className="text-muted-foreground">Detailed analysis of end-of-life software versions and distribution</p>
        </div>
        <div className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">Loading EOL versions data...</p>
        </div>
      </div>
    );
  }

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
          value={stats.totalSEoLComponents}
          color="red"
        />
        <SimpleMetricCard
          title="Total Different Software Types"
          value={stats.totalDifferentSoftwareTypes}
          color="blue"
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
                  <th className="text-center py-3 px-4">Total Instances</th>
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
                  <td className="py-3 px-4 text-center font-bold">{stats.totalDifferentSoftwareTypes}</td>
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
              {eolVersions?.map((item, index) => (
                <tr key={index} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="py-3 px-4 text-sm">{item.software_type}</td>
                  <td className="py-3 px-4 text-center font-mono text-sm">{item.version}</td>
                  <td className="py-3 px-4 text-center font-bold">{item.instance_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
