
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Badge } from "@/components/ui/badge";

const vulnerabilityByHostData = [
  { host: "192.168.1.10", vulnerabilities: 45 },
  { host: "192.168.1.25", vulnerabilities: 38 },
  { host: "192.168.1.33", vulnerabilities: 42 },
  { host: "192.168.1.15", vulnerabilities: 29 },
  { host: "192.168.1.50", vulnerabilities: 33 },
  { host: "192.168.1.67", vulnerabilities: 25 },
  { host: "192.168.1.89", vulnerabilities: 31 },
];

const vulnerabilityByProductData = [
  { product: "Apache HTTP Server", vulnerabilities: 156, color: "#dc2626" },
  { product: "MySQL Database", vulnerabilities: 134, color: "#ea580c" },
  { product: "Node.js Runtime", vulnerabilities: 98, color: "#ca8a04" },
  { product: "Nginx Web Server", vulnerabilities: 87, color: "#16a34a" },
  { product: "PHP Framework", vulnerabilities: 76, color: "#2563eb" },
  { product: "OpenSSL Library", vulnerabilities: 65, color: "#9333ea" },
];

const vulnerabilityOverviewData = [
  { metric: "Total Vulnerabilities", value: 1247, percentage: "100%" },
  { metric: "Critical Severity", value: 89, percentage: "7.1%" },
  { metric: "High Severity", value: 234, percentage: "18.8%" },
  { metric: "Medium Severity", value: 567, percentage: "45.5%" },
  { metric: "Low Severity", value: 357, percentage: "28.6%" },
  { metric: "Unique CVEs", value: 456, percentage: "36.6%" },
  { metric: "Affected Hosts", value: 125, percentage: "N/A" },
  { metric: "Products/Services", value: 23, percentage: "N/A" },
];

export default function Clustering() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Operational Insights</h1>
        <p className="text-muted-foreground">Vulnerability clustering and distribution analysis</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vulnerability Distribution by Host (3.1) */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold mb-4">Vulnerability Distribution by Host (3.1)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={vulnerabilityByHostData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="host" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "#1f2937", 
                    border: "1px solid #374151",
                    borderRadius: "8px"
                  }} 
                />
                <Bar dataKey="vulnerabilities" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Vulnerability Distribution by Product/Service (3.2) */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold mb-4">Vulnerability Distribution by Product/Service (3.2)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={vulnerabilityByProductData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="vulnerabilities"
                >
                  {vulnerabilityByProductData.map((entry, index) => (
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
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {vulnerabilityByProductData.map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-xs">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span>{item.product}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Vulnerability Overview Table (3.3) */}
      <div className="chart-container">
        <h3 className="text-lg font-semibold mb-4">Vulnerability Overview (3.3)</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4">Metric</th>
                <th className="text-center py-3 px-4">Value</th>
                <th className="text-center py-3 px-4">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {vulnerabilityOverviewData.map((item, index) => (
                <tr key={index} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="py-3 px-4 font-medium">{item.metric}</td>
                  <td className="py-3 px-4 text-center font-bold">{item.value.toLocaleString()}</td>
                  <td className="py-3 px-4 text-center">
                    <Badge variant={item.percentage === "N/A" ? "secondary" : "default"}>
                      {item.percentage}
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
