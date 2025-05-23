
import { Badge } from "@/components/ui/badge";

const eolData = [
  {
    component: "Apache HTTP Server 2.2",
    product: "Web Server Infrastructure", 
    eolDate: "2017-07-11",
    risk: "Critical",
    instances: 145
  },
  {
    component: "OpenSSL 1.0.1",
    product: "Encryption Library",
    eolDate: "2016-12-31", 
    risk: "Critical",
    instances: 89
  },
  {
    component: "MySQL 5.5",
    product: "Database Management",
    eolDate: "2018-12-03",
    risk: "High",
    instances: 67
  },
  {
    component: "PHP 7.2",
    product: "Application Runtime",
    eolDate: "2020-11-30",
    risk: "Medium",
    instances: 234
  }
];

export default function EOLComponents() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">EOL Components</h1>
        <p className="text-muted-foreground">End-of-life software components requiring immediate attention</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="metric-card">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Total EOL Components</p>
            <p className="text-2xl font-bold text-red-400">{eolData.length}</p>
          </div>
        </div>
        <div className="metric-card">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Critical Risk</p>
            <p className="text-2xl font-bold text-red-400">
              {eolData.filter(item => item.risk === "Critical").length}
            </p>
          </div>
        </div>
        <div className="metric-card">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Total Instances</p>
            <p className="text-2xl font-bold">
              {eolData.reduce((sum, item) => sum + item.instances, 0)}
            </p>
          </div>
        </div>
        <div className="metric-card">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Avg EOL Age</p>
            <p className="text-2xl font-bold text-yellow-400">4.2 yrs</p>
          </div>
        </div>
      </div>

      {/* EOL Components Table */}
      <div className="chart-container">
        <h3 className="text-lg font-semibold mb-4">End-of-Life Components Inventory</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4">Component</th>
                <th className="text-left py-3 px-4">Product</th>
                <th className="text-left py-3 px-4">EOL Date</th>
                <th className="text-left py-3 px-4">Risk Level</th>
                <th className="text-left py-3 px-4">Instances</th>
              </tr>
            </thead>
            <tbody>
              {eolData.map((item, index) => (
                <tr key={index} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="py-4 px-4 font-medium">{item.component}</td>
                  <td className="py-4 px-4">{item.product}</td>
                  <td className="py-4 px-4">
                    <Badge variant="outline" className="font-mono text-xs">
                      {item.eolDate}
                    </Badge>
                  </td>
                  <td className="py-4 px-4">
                    <Badge variant={
                      item.risk === "Critical" ? "destructive" : 
                      item.risk === "High" ? "default" : 
                      "secondary"
                    }>
                      {item.risk}
                    </Badge>
                  </td>
                  <td className="py-4 px-4 font-bold">{item.instances}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recommendations */}
      <div className="chart-container">
        <h3 className="text-lg font-semibold mb-4">Upgrade Recommendations</h3>
        <div className="space-y-4">
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="destructive">Critical</Badge>
              <span className="font-medium">Apache HTTP Server 2.2</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Upgrade to Apache HTTP Server 2.4+ immediately. Version 2.2 has been EOL since 2017 with multiple critical vulnerabilities.
            </p>
          </div>
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="default">High</Badge>
              <span className="font-medium">MySQL 5.5</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Plan migration to MySQL 8.0+ for continued security support and performance improvements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
