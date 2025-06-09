import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface PrioritizationInsightData {
  id: number;
  metric: string;
  critical_count: number;
  high_count: number;
  medium_count: number;
  low_count: number;
}

interface ExploitabilityScoringData {
  id: number;
  exploitability_score: number | null;
}

interface VulnerabilityAgingData {
  id: number;
  days_after_discovery: number | null;
}

interface MostExploitableData {
  id: number;
  host: string;
  cumulative_exploitability: number;
  critical_count: number;
  high_count: number;
  medium_count: number;
  low_count: number;
  total_vulnerabilities: number;
}

const severityData = [
  { name: "Critical", value: 800 },
  { name: "High", value: 540 },
  { name: "Medium", value: 360 },
];

const exploitabilityDistData = [
  { name: "High (9.0-10.0)", value: 25, color: "#dc2626" },
  { name: "Medium (7.0-8.9)", value: 35, color: "#ea580c" },
  { name: "Low (0.1-6.9)", value: 40, color: "#16a34a" },
];

const ageDistributionData = [
  { name: "0-30 days", value: 0 },
  { name: "31-90 days", value: 85 },
  { name: "91-180 days", value: 170 },
  { name: "180+ days", value: 340 },
];

const topHostsData = [
  { host: "192.168.1.10", score: 9.8, vulns: 45 },
  { host: "192.168.1.25", score: 9.5, vulns: 38 },
  { host: "192.168.1.33", score: 9.2, vulns: 42 },
  { host: "192.168.1.15", score: 8.9, vulns: 29 },
  { host: "192.168.1.50", score: 8.7, vulns: 33 },
];

const scoringMetrics = [
  { metric: "CVSS", critical: 36, high: 2296, medium: 2087, low: 35 },
  { metric: "EPSS", critical: 363, high: 38, medium: 14, low: 47 },
  { metric: "VPR", critical: 3972, high: 241, medium: 2559, low: 55 },
  { metric: "CISA KEV", critical: 54, high: 0, medium: 0, low: 0 },
  { metric: "TOTAL", critical: 4425, high: 2575, medium: 4660, low: 137 },
];

// Transform scoring metrics for chart (excluding TOTAL row)
const scoringMetricsChartData = [
  { metric: "CVSS", Critical: 36, High: 2296, Medium: 2087, Low: 35 },
  { metric: "EPSS", Critical: 363, High: 38, Medium: 14, Low: 47 },
  { metric: "VPR", Critical: 3972, High: 241, Medium: 2559, Low: 55 },
  { metric: "CISA KEV", Critical: 54, High: 0, Medium: 0, Low: 0 },
];

const legendData = [
  { rating: "None", cvssScore: "0", priorityScore: 0, color: "bg-gray-400" },
  { rating: "Low", cvssScore: "0.1 - 3.9", priorityScore: 1, color: "bg-green-400" },
  { rating: "Medium", cvssScore: "4.0 - 6.9", priorityScore: 2, color: "bg-yellow-400" },
  { rating: "High", cvssScore: "7.0 - 8.9", priorityScore: 3, color: "bg-orange-400" },
  { rating: "Critical", cvssScore: "9.0 - 10.0", priorityScore: 4, color: "bg-red-400" },
];

const epssLegend = [
  { rating: "None", epssScore: "0", priorityScore: 0, color: "bg-gray-400" },
  { rating: "Low", epssScore: "0.01-0.39", priorityScore: 1, color: "bg-green-400" },
  { rating: "Medium", epssScore: "0.4-0.69", priorityScore: 2, color: "bg-yellow-400" },
  { rating: "High", epssScore: "0.7-0.89", priorityScore: 3, color: "bg-orange-400" },
  { rating: "Critical", epssScore: "0.9-1.0", priorityScore: 4, color: "bg-red-400" },
];

const kevLegend = [
  { status: "Yes", meaning: "Listed in CISA KEV", priorityScore: 1, color: "bg-red-400" },
  { status: "No", meaning: "Not in CISA KEV", priorityScore: 0, color: "bg-gray-400" },
];

export default function Prioritization() {
  const { data: prioritizationData, isLoading: prioritizationLoading } = useQuery({
    queryKey: ['prioritization-insights'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prioritization_insights')
        .select('*')
        .order('id');
      
      if (error) {
        console.error('Error fetching prioritization insights data:', error);
        throw error;
      }
      
      return data as PrioritizationInsightData[];
    }
  });

  const { data: exploitabilityData, isLoading: exploitabilityLoading } = useQuery({
    queryKey: ['exploitability-scoring-simple'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('exploitability_scoring')
        .select('id, exploitability_score');
      
      if (error) {
        console.error('Error fetching exploitability data:', error);
        throw error;
      }
      
      return data as ExploitabilityScoringData[];
    }
  });

  const { data: agingData, isLoading: agingLoading } = useQuery({
    queryKey: ['ageing-of-vulnerability-simple'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ageing_of_vulnerability')
        .select('id, days_after_discovery');
      
      if (error) {
        console.error('Error fetching aging data:', error);
        throw error;
      }
      
      return data as VulnerabilityAgingData[];
    }
  });

  const { data: mostExploitableData, isLoading: mostExploitableLoading } = useQuery({
    queryKey: ['most-exploitable-top10'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('most_exploitable')
        .select('*')
        .order('cumulative_exploitability', { ascending: false })
        .limit(10);
      
      if (error) {
        console.error('Error fetching most exploitable data:', error);
        throw error;
      }
      
      return data as MostExploitableData[];
    }
  });

  // Transform prioritization data for chart
  const scoringMetricsChartData = prioritizationData?.map(item => ({
    metric: item.metric,
    Critical: item.critical_count,
    High: item.high_count,
    Medium: item.medium_count,
    Low: item.low_count
  })) || [];

  // Add total row for table
  const scoringMetrics = prioritizationData ? [
    ...prioritizationData.map(item => ({
      metric: item.metric,
      critical: item.critical_count,
      high: item.high_count,
      medium: item.medium_count,
      low: item.low_count
    })),
    {
      metric: "TOTAL",
      critical: prioritizationData.reduce((sum, item) => sum + item.critical_count, 0),
      high: prioritizationData.reduce((sum, item) => sum + item.high_count, 0),
      medium: prioritizationData.reduce((sum, item) => sum + item.medium_count, 0),
      low: prioritizationData.reduce((sum, item) => sum + item.low_count, 0)
    }
  ] : [];

  // Calculate exploitability distribution
  const exploitabilityDistData = exploitabilityData ? (() => {
    const ranges = {
      "High (9.0-10.0)": 0,
      "Medium (7.0-8.9)": 0,
      "Low (0.1-6.9)": 0
    };

    exploitabilityData.forEach(item => {
      const score = item.exploitability_score;
      if (score !== null) {
        if (score >= 9.0) {
          ranges["High (9.0-10.0)"]++;
        } else if (score >= 7.0) {
          ranges["Medium (7.0-8.9)"]++;
        } else if (score >= 0.1) {
          ranges["Low (0.1-6.9)"]++;
        }
      }
    });

    return Object.entries(ranges).map(([name, value]) => ({
      name,
      value,
      color: name.includes("High") ? "#dc2626" : 
             name.includes("Medium") ? "#ea580c" : "#16a34a"
    }));
  })() : [];

  // Calculate age distribution
  const ageDistributionData = agingData ? (() => {
    const ranges = {
      "0-30 days": 0,
      "31-90 days": 0,
      "91-180 days": 0,
      "180+ days": 0
    };

    agingData.forEach(item => {
      const days = item.days_after_discovery;
      if (days !== null) {
        if (days <= 30) {
          ranges["0-30 days"]++;
        } else if (days <= 90) {
          ranges["31-90 days"]++;
        } else if (days <= 180) {
          ranges["91-180 days"]++;
        } else {
          ranges["180+ days"]++;
        }
      }
    });

    return Object.entries(ranges).map(([name, value]) => ({ name, value }));
  })() : [];

  if (prioritizationLoading || exploitabilityLoading || agingLoading || mostExploitableLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Prioritization Insights</h1>
          <p className="text-muted-foreground">Vulnerability prioritization based on severity and exploitability</p>
        </div>
        <div className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">Loading prioritization data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Prioritization Insights</h1>
          <p className="text-muted-foreground">Vulnerability prioritization based on severity and exploitability</p>
        </div>
        <div className="flex gap-4">
          <Select defaultValue="severity">
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="severity">Severity</SelectItem>
              <SelectItem value="exploitability">Exploitability</SelectItem>
              <SelectItem value="kev-listed">KEV Listed</SelectItem>
            </SelectContent>
          </Select>
          <Button>Apply</Button>
        </div>
      </div>

      {/* Scoring Metrics Summary Table */}
      <div className="chart-container">
        <h3 className="text-lg font-semibold mb-4">Scoring Metrics Summary</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4">Metric</th>
                <th className="text-center py-3 px-4 bg-red-500/20">Critical Count</th>
                <th className="text-center py-3 px-4 bg-orange-500/20">High Count</th>
                <th className="text-center py-3 px-4 bg-yellow-500/20">Medium Count</th>
                <th className="text-center py-3 px-4 bg-green-500/20">Low Count</th>
              </tr>
            </thead>
            <tbody>
              {scoringMetrics.map((item, index) => (
                <tr key={index} className={`border-b border-border/50 ${item.metric === 'TOTAL' ? 'font-bold bg-muted/20' : ''}`}>
                  <td className="py-3 px-4 font-medium">{item.metric}</td>
                  <td className="py-3 px-4 text-center font-bold">{item.critical}</td>
                  <td className="py-3 px-4 text-center font-bold">{item.high}</td>
                  <td className="py-3 px-4 text-center font-bold">{item.medium}</td>
                  <td className="py-3 px-4 text-center font-bold">{item.low}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Scoring Metrics Chart */}
      <div className="chart-container">
        <h3 className="text-lg font-semibold mb-4">Scoring Metrics Overview</h3>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={scoringMetricsChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="metric" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "#1f2937", 
                  border: "1px solid #374151",
                  borderRadius: "8px"
                }} 
              />
              <Bar dataKey="Critical" fill="#dc2626" name="Critical" />
              <Bar dataKey="High" fill="#ea580c" name="High" />
              <Bar dataKey="Medium" fill="#ca8a04" name="Medium" />
              <Bar dataKey="Low" fill="#16a34a" name="Low" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Legend Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CVSS Legend */}
        <div className="chart-container">
          <h4 className="text-md font-semibold mb-3">CVSS Legend</h4>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3">Rating</th>
                <th className="text-left py-2 px-3">CVSS Score</th>
                <th className="text-left py-2 px-3">Priority Score</th>
              </tr>
            </thead>
            <tbody>
              {legendData.map((item, index) => (
                <tr key={index} className="border-b border-border/50">
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded ${item.color}`} />
                      {item.rating}
                    </div>
                  </td>
                  <td className="py-2 px-3">{item.cvssScore}</td>
                  <td className="py-2 px-3">{item.priorityScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* EPSS Legend */}
        <div className="chart-container">
          <h4 className="text-md font-semibold mb-3">EPSS Legend</h4>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3">Rating</th>
                <th className="text-left py-2 px-3">EPSS Score</th>
                <th className="text-left py-2 px-3">Priority Score</th>
              </tr>
            </thead>
            <tbody>
              {epssLegend.map((item, index) => (
                <tr key={index} className="border-b border-border/50">
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded ${item.color}`} />
                      {item.rating}
                    </div>
                  </td>
                  <td className="py-2 px-3">{item.epssScore}</td>
                  <td className="py-2 px-3">{item.priorityScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* KEV Legend */}
        <div className="chart-container">
          <h4 className="text-md font-semibold mb-3">KEV Legend</h4>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3">Status</th>
                <th className="text-left py-2 px-3">Meaning</th>
                <th className="text-left py-2 px-3">Priority Score</th>
              </tr>
            </thead>
            <tbody>
              {kevLegend.map((item, index) => (
                <tr key={index} className="border-b border-border/50">
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded ${item.color}`} />
                      {item.status}
                    </div>
                  </td>
                  <td className="py-2 px-3">{item.meaning}</td>
                  <td className="py-2 px-3">{item.priorityScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Exploitability Distribution */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold mb-4">Exploitability Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={exploitabilityDistData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {exploitabilityDistData.map((entry, index) => (
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
          <div className="flex justify-center gap-4 mt-4">
            {exploitabilityDistData.map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-xs">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Vulnerability Age Distribution */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold mb-4">Vulnerability Age Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageDistributionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "#1f2937", 
                    border: "1px solid #374151",
                    borderRadius: "8px"
                  }} 
                />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Hosts by Exploitability Score */}
      <div className="chart-container">
        <h3 className="text-lg font-semibold mb-4">Top Hosts by Exploitability Score</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4">Host IP</th>
                <th className="text-left py-3 px-4">Exploitability Score</th>
                <th className="text-left py-3 px-4">Vulnerability Count</th>
                <th className="text-left py-3 px-4">Risk Level</th>
              </tr>
            </thead>
            <tbody>
              {mostExploitableData?.map((item, index) => (
                <tr key={index} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="py-3 px-4 font-mono">{item.host}</td>
                  <td className="py-3 px-4 font-bold">{item.cumulative_exploitability.toFixed(1)}</td>
                  <td className="py-3 px-4">{item.total_vulnerabilities}</td>
                  <td className="py-3 px-4">
                    <Badge variant={item.cumulative_exploitability >= 9.0 ? "destructive" : "default"}>
                      {item.cumulative_exploitability >= 9.0 ? "Critical" : "High"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
