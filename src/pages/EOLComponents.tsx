import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Badge } from "@/components/ui/badge";
import { SimpleMetricCard } from "@/components/SimpleMetricCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UUID } from "crypto";
import { DownloadDropdown } from "@/components/DownloadDropdown";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface EOLComponentData {
  created_at: string;
  cve: string | null;
  eol_duration_days: number | null;
  name: string;
  plugin_id: number;
  risk: string;
  instance_id: UUID;
  run_id: string;
}

interface EOLIPData {
  seol_component_count: number;
  instance_id: string;
  run_id: string;
}

const ITEMS_PER_PAGE = 100;

export default function EOLComponents() {
  const [currentPage, setCurrentPage] = useState(1);

  const { data: eolData, isLoading } = useQuery({
    queryKey: ['eol-components'],
    queryFn: async () => {
      const instanceId = localStorage.getItem('currentInstanceId');
      const runId = localStorage.getItem('currentRunId');
      const { data, error } = await supabase
        .from('eol_components')
        .select('plugin_id, name, risk, eol_duration_days, cve')
        .eq('instance_id', instanceId)
        .eq('run_id', runId)
        .order('eol_duration_days', { ascending: false });
      
      if (error) {
        console.error('Error fetching EOL components data:', error);
        throw error;
      }
      
      return data;
    },
    staleTime: 5 * 60 * 1000, // Data stays fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Cache is kept for 10 minutes
  });

  const { data: eolIPData, isLoading: ipLoading } = useQuery({
    queryKey: ['eol-ip-data'],
    queryFn: async () => {
      const instanceId = localStorage.getItem('currentInstanceId');
      const runId = localStorage.getItem('currentRunId');
      const { data, error } = await supabase
        .from('eol_ip')
        .select('seol_component_count')
        .eq('instance_id', instanceId)
        .eq('run_id', runId);
      
      if (error) {
        console.error('Error fetching EOL IP data:', error);
        throw error;
      }
      
      return data as EOLIPData[];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  // Map risk → numeric value
  const riskValueMap: Record<string, number> = {
    "Critical": 3,
    "High": 2,
    "Medium": 1
  };

  // Pagination
  const totalPages = eolData ? Math.ceil(eolData.length / ITEMS_PER_PAGE) : 0;
  const paginatedData = eolData?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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

  // Calculate total SEoL instances across all hosts
  const totalSEoLInstances = eolIPData?.reduce((sum, item) => sum + item.seol_component_count, 0) || 0;

  if (isLoading || ipLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">EOL Components</h1>
            <p className="text-muted-foreground">End-of-life component tracking and risk assessment</p>
          </div>
          <DownloadDropdown />
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
        <DownloadDropdown />
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
                {paginatedData?.map((item, index) => (
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
          
          {/* Pagination Controls */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, eolData?.length || 0)} of {eolData?.length || 0} entries
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
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
                    borderRadius: "8px",
                    color: "#ffffff"
                  }}
                  formatter={(value, name, props) => {
                    const level = Object.entries(riskValueMap).find(([k, v]) => v === value)?.[0] || "Unknown";
                    const color = 
                      level === "Critical" ? "#ef4444" :
                      level === "High" ? "#f59e0b" :
                      level === "Medium" ? "#3b82f6" :
                      "#10b981";
                    return [
                      <span style={{ color: color }}>{`Risk Level: ${level}`}</span>,
                      null
                    ];
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
          value={eolData?.length || 0}
          color="red"
        />
        <SimpleMetricCard
          title="Total SEoL Instances (across all hosts)"
          value={totalSEoLInstances}
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
