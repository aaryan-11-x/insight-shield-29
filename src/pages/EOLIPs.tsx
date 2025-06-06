
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Badge } from "@/components/ui/badge";

const seolIPStats = {
  totalIPsWithSEoLComponents: 48,
  averageSEoLComponentsPerIP: 4.48,
  maximumSEoLComponentsOnSingleIP: 15,
  ipsWithOneSEoLComponent: 5,
  ipsWithTwoToFiveSEoLComponents: 30,
  ipsWithMoreThanFiveSEoLComponents: 13
};

const topIPsForChart = [
  { ip: "10.168.50.77", count: 15, riskLevel: "Critical" },
  { ip: "10.167.36.196", count: 10, riskLevel: "High" },
  { ip: "10.167.38.8", count: 10, riskLevel: "High" },
  { ip: "10.167.37.217", count: 10, riskLevel: "High" },
  { ip: "10.167.37.206", count: 10, riskLevel: "High" },
  { ip: "10.167.36.104", count: 10, riskLevel: "High" },
  { ip: "10.167.36.33", count: 10, riskLevel: "High" },
  { ip: "10.167.36.52", count: 10, riskLevel: "High" },
  { ip: "10.168.51.82", count: 8, riskLevel: "High" },
  { ip: "10.167.37.229", count: 8, riskLevel: "High" }
];

const completeIPsList = [
  { ip: "10.168.50.77", count: 15, riskLevel: "Critical" },
  { ip: "10.167.36.196", count: 10, riskLevel: "High" },
  { ip: "10.167.38.8", count: 10, riskLevel: "High" },
  { ip: "10.167.37.217", count: 10, riskLevel: "High" },
  { ip: "10.167.37.206", count: 10, riskLevel: "High" },
  { ip: "10.167.36.104", count: 10, riskLevel: "High" },
  { ip: "10.167.36.33", count: 10, riskLevel: "High" },
  { ip: "10.167.36.52", count: 10, riskLevel: "High" },
  { ip: "10.168.51.82", count: 8, riskLevel: "High" },
  { ip: "10.167.37.229", count: 8, riskLevel: "High" },
  { ip: "10.168.52.75", count: 6, riskLevel: "High" },
  { ip: "10.168.2.48", count: 6, riskLevel: "High" },
  { ip: "10.168.53.157", count: 6, riskLevel: "High" },
  { ip: "10.168.59.55", count: 5, riskLevel: "Medium" },
  { ip: "10.168.9.33", count: 5, riskLevel: "Medium" },
  { ip: "10.168.50.100", count: 4, riskLevel: "Medium" },
  { ip: "10.168.50.183", count: 4, riskLevel: "Medium" },
  { ip: "10.168.52.59", count: 4, riskLevel: "Medium" },
  { ip: "10.168.50.19", count: 3, riskLevel: "Medium" },
  { ip: "10.168.50.76", count: 3, riskLevel: "Medium" },
  { ip: "10.168.64.208", count: 3, riskLevel: "Medium" },
  { ip: "10.168.138.20", count: 3, riskLevel: "Medium" },
  { ip: "10.168.138.15", count: 3, riskLevel: "Medium" },
  { ip: "10.168.98.10", count: 3, riskLevel: "Medium" },
  { ip: "10.167.37.102", count: 3, riskLevel: "Medium" },
  { ip: "10.167.37.155", count: 3, riskLevel: "Medium" },
  { ip: "10.168.1.209", count: 3, riskLevel: "Medium" },
  { ip: "10.167.37.103", count: 3, riskLevel: "Medium" },
  { ip: "10.167.36.50", count: 3, riskLevel: "Medium" },
  { ip: "10.167.37.104", count: 3, riskLevel: "Medium" },
  { ip: "10.168.1.180", count: 3, riskLevel: "Medium" },
  { ip: "10.167.37.100", count: 3, riskLevel: "Medium" },
  { ip: "10.168.1.112", count: 3, riskLevel: "Medium" },
  { ip: "10.167.37.101", count: 3, riskLevel: "Medium" },
  { ip: "10.167.37.133", count: 3, riskLevel: "Medium" },
  { ip: "10.167.37.156", count: 3, riskLevel: "Medium" },
  { ip: "10.167.37.150", count: 3, riskLevel: "Medium" },
  { ip: "10.168.1.235", count: 2, riskLevel: "Low" },
  { ip: "10.168.1.219", count: 2, riskLevel: "Low" },
  { ip: "10.167.37.171", count: 2, riskLevel: "Low" },
  { ip: "10.168.2.43", count: 2, riskLevel: "Low" },
  { ip: "10.168.142.195", count: 2, riskLevel: "Low" },
  { ip: "10.168.50.140", count: 2, riskLevel: "Low" },
  { ip: "10.168.1.222", count: 1, riskLevel: "Low" },
  { ip: "10.168.53.17", count: 1, riskLevel: "Low" },
  { ip: "10.168.2.76", count: 1, riskLevel: "Low" },
  { ip: "10.168.2.146", count: 1, riskLevel: "Low" },
  { ip: "10.168.50.75", count: 1, riskLevel: "Low" }
];

export default function EOLIPs() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">EOL IPs</h1>
        <p className="text-muted-foreground">IP address analysis for end-of-life component tracking</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tables Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* SEoL IP Statistics */}
          <div className="chart-container">
            <h3 className="text-lg font-semibold mb-4">SEoL IP Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total IPs with SEoL Components</span>
                  <span className="font-bold">{seolIPStats.totalIPsWithSEoLComponents}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Average SEoL Components per IP</span>
                  <span className="font-bold">{seolIPStats.averageSEoLComponentsPerIP}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Maximum SEoL Components on Single IP</span>
                  <span className="font-bold">{seolIPStats.maximumSEoLComponentsOnSingleIP}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">IPs with 1 SEoL Component</span>
                  <span className="font-bold">{seolIPStats.ipsWithOneSEoLComponent}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">IPs with 2-5 SEoL Components</span>
                  <span className="font-bold">{seolIPStats.ipsWithTwoToFiveSEoLComponents}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">IPs with &gt;recharts5 SEoL Components</span>
                  <span className="font-bold">{seolIPStats.ipsWithMoreThanFiveSEoLComponents}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Top IPs with Most SEoL Components */}
          <div className="chart-container">
            <h3 className="text-lg font-semibold mb-4">Top IPs with Most SEoL Components (For Chart)</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4">IP Address</th>
                    <th className="text-center py-3 px-4">SEoL Component Count</th>
                    <th className="text-center py-3 px-4">Risk Level</th>
                  </tr>
                </thead>
                <tbody>
                  {topIPsForChart.map((item, index) => (
                    <tr key={index} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                      <td className="py-3 px-4 font-mono text-sm">{item.ip}</td>
                      <td className="py-3 px-4 text-center font-bold">{item.count}</td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant={
                          item.riskLevel === "Critical" ? "destructive" : 
                          item.riskLevel === "High" ? "default" : 
                          item.riskLevel === "Medium" ? "secondary" :
                          "outline"
                        }>
                          {item.riskLevel}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Complete List of All IPs with SEoL Components */}
          <div className="chart-container">
            <h3 className="text-lg font-semibold mb-4">Complete List of All IPs with SEoL Components</h3>
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full">
                <thead className="sticky top-0 bg-background">
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4">IP Address</th>
                    <th className="text-center py-3 px-4">SEoL Component Count</th>
                    <th className="text-center py-3 px-4">Risk Level</th>
                  </tr>
                </thead>
                <tbody>
                  {completeIPsList.map((item, index) => (
                    <tr key={index} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                      <td className="py-3 px-4 font-mono text-sm">{item.ip}</td>
                      <td className="py-3 px-4 text-center font-bold">{item.count}</td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant={
                          item.riskLevel === "Critical" ? "destructive" : 
                          item.riskLevel === "High" ? "default" : 
                          item.riskLevel === "Medium" ? "secondary" :
                          "outline"
                        }>
                          {item.riskLevel}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="lg:col-span-1">
          <div className="chart-container">
            <h3 className="text-lg font-semibold mb-4">Top 10 IPs by SEoL Component Count</h3>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topIPsForChart} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis type="number" stroke="#9ca3af" />
                  <YAxis type="category" dataKey="ip" stroke="#9ca3af" fontSize={10} width={100} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "#1f2937", 
                      border: "1px solid #374151",
                      borderRadius: "8px"
                    }}
                    labelFormatter={(value) => `IP: ${value}`}
                    formatter={(value) => [`${value}`, "SEoL Components"]}
                  />
                  <Bar dataKey="count" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
