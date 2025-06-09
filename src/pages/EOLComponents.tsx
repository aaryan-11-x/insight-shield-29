import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { SimpleMetricCard } from "@/components/SimpleMetricCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UUID } from "crypto";

interface EOLComponentData {
  created_at: string;
  cve: string | null;
  eol_duration_days: number | null;
  name: string;
  plugin_id: number;
  risk: string;
  instance_id: UUID;
}

interface EOLSummary {
  total_unique_components: number;
  total_count: number;
  hosts_with_eol_components: number;
  software_types_affected: number;
}

export default function EOLComponents() {
  const { data: eolData, isLoading } = useQuery({
    queryKey: ['eol-components'],
    queryFn: async () => {
      const instanceId = localStorage.getItem('currentInstanceId');
      const { data, error } = await supabase
        .from('eol_components')
        .select('*')
        .eq('instance_id', instanceId)
        .order('eol_duration_days', { ascending: false });
      
      if (error) {
        console.error('Error fetching EOL components data:', error);
        throw error;
      }
      
      return data;
    }
  });

  const { data: eolSummary, isLoading: summaryLoading } = useQuery({
    queryKey: ['eol-summary'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('eol_summary')
        .select('*')
        .single();
      
      if (error) {
        console.error('Error fetching EOL summary:', error);
        throw error;
      }
      
      return data as EOLSummary;
    }
  });

  // Map risk → numeric value
  const riskValueMap: Record<string, number> = {
    "Critical": 3,
    "High": 2,
    "Medium": 1
  };

  // Prepare chart data
  const chartData = eolData?.map(item => ({
    name: item.name.replace(" SEoL", ""),
    risk: item.risk,
    riskValue: riskValueMap[item.risk] ?? 0
  })) || [];

  // Count components with unknown duration
  const unknownDurationCount = eolData?.filter(item => 
    item.eol_duration_days === null || item.eol_duration_days === undefined
  ).length || 0;

  if (isLoading || summaryLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">EOL Components</h1>
            <p className="text-muted-foreground">End-of-life component tracking and risk assessment</p>
          </div>
          <Button className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download Report
          </Button>
        </div>
        <div className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">Loading EOL data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">EOL Components</h1>
          <p className="text-muted-foreground">End-of-life component tracking and risk assessment</p>
        </div>
        <Button className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Download Report
        </Button>
      </div>

      {/* Unique SEoL Components Table and Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Table */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold mb-4">Unique SEoL Components</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4">Plugin ID</th>
                  <th className="text-left py-3 px-4">Name</th>
                  <th className="text-center py-3 px-4">Risk</th>
                  <th className="text-center py-3 px-4">EOL Duration (Days)</th>
                  <th className="text-center py-3 px-4">CVE</th>
                </tr>
              </thead>
              <tbody>
                {eolData?.map((item, index) => (
                  <tr key={index} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-4 font-mono text-sm">{item.plugin_id}</td>
                    <td className="py-3 px-4 text-sm">{item.name}</td>
                    <td className="py-3 px-4 text-center">
                      <Badge variant={
                        item.risk === "Critical" ? "destructive" : 
                        item.risk === "High" ? "default" : 
                        item.risk === "Medium" ? "secondary" :
                        "outline"
                      }>
                        {item.risk}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {item.eol_duration_days !== null ? item.eol_duration_days : "nan"}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {item.cve || "nan"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Chart */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold mb-4">Component Severity by Name</h3>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis type="number" domain={[0, 3]} ticks={[1, 2, 3]} stroke="#9ca3af" />
                <YAxis type="category" dataKey="name" stroke="#9ca3af" fontSize={12} width={200} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "#1f2937", 
                    border: "1px solid #374151",
                    borderRadius: "8px"
                  }}
                  formatter={(value, name) => {
                    const level = Object.entries(riskValueMap).find(([k, v]) => v === value)?.[0] || "Unknown";
                    return [level, "Risk Level"];
                  }}
                />
                <Bar dataKey="riskValue">
                  {chartData.map((entry, index) => {
                    const color = 
                      entry.risk === "Critical" ? "#ef4444" :
                      entry.risk === "High" ? "#f59e0b" :
                      entry.risk === "Medium" ? "#3b82f6" :
                      "#10b981"; // fallback green
                    return <Cell key={`cell-${index}`} fill={color} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SimpleMetricCard
          title="Total Unique SEoL Components"
          value={eolSummary?.total_unique_components || 0}
          color="red"
        />
        <SimpleMetricCard
          title="Total SEoL Instances (across all hosts)"
          value={eolSummary?.total_count || 0}
          color="blue"
        />
        <SimpleMetricCard
          title="Unknown EOL Duration"
          value={`${unknownDurationCount} Components`}
          color="yellow"
        />
        <SimpleMetricCard
          title="Total"
          value={`${eolData?.length || 0} Components`}
          color="green"
        />
      </div>
    </div>
  );
}
