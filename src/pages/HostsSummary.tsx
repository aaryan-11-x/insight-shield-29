
const hostsData = [
  { host: "10.168.50.77", vulnerabilityCount: 256, vulnerabilitiesWithCVE: 193, critical: 161, high: 46, medium: 10, low: 39 },
  { host: "10.168.50.140", vulnerabilityCount: 231, vulnerabilitiesWithCVE: 152, critical: 83, high: 65, medium: 31, low: 52 },
  { host: "10.168.9.33", vulnerabilityCount: 210, vulnerabilitiesWithCVE: 16, critical: 5, high: 16, medium: 31, low: 158 },
  { host: "10.168.51.82", vulnerabilityCount: 189, vulnerabilitiesWithCVE: 98, critical: 97, high: 10, medium: 24, low: 58 },
  { host: "10.168.1.235", vulnerabilityCount: 162, vulnerabilitiesWithCVE: 117, critical: 67, high: 46, medium: 15, low: 34 },
  { host: "10.168.9.6", vulnerabilityCount: 145, vulnerabilitiesWithCVE: 67, critical: 0, high: 67, medium: 17, low: 61 },
  { host: "10.168.1.184", vulnerabilityCount: 142, vulnerabilitiesWithCVE: 89, critical: 56, high: 33, medium: 9, low: 44 },
  { host: "10.168.2.131", vulnerabilityCount: 134, vulnerabilitiesWithCVE: 89, critical: 56, high: 33, medium: 8, low: 37 },
  { host: "10.168.1.130", vulnerabilityCount: 134, vulnerabilitiesWithCVE: 90, critical: 56, high: 34, medium: 8, low: 36 },
  { host: "10.168.1.131", vulnerabilityCount: 134, vulnerabilitiesWithCVE: 90, critical: 56, high: 34, medium: 8, low: 36 },
  { host: "10.167.38.8", vulnerabilityCount: 129, vulnerabilitiesWithCVE: 73, critical: 72, high: 13, medium: 5, low: 39 },
  { host: "10.167.36.196", vulnerabilityCount: 127, vulnerabilitiesWithCVE: 73, critical: 72, high: 13, medium: 4, low: 38 },
  { host: "10.167.36.33", vulnerabilityCount: 127, vulnerabilitiesWithCVE: 73, critical: 72, high: 14, medium: 4, low: 37 },
  { host: "10.167.36.104", vulnerabilityCount: 126, vulnerabilitiesWithCVE: 73, critical: 72, high: 13, medium: 4, low: 37 },
  { host: "10.167.37.217", vulnerabilityCount: 126, vulnerabilitiesWithCVE: 73, critical: 72, high: 15, medium: 4, low: 35 }
];

const summaryStats = {
  totalHosts: 359,
  totalVulnerabilities: hostsData.reduce((sum, host) => sum + host.vulnerabilityCount, 0),
  totalVulnerabilitiesWithCVE: hostsData.reduce((sum, host) => sum + host.vulnerabilitiesWithCVE, 0)
};

export default function HostsSummary() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Hosts Summary</h1>
        <p className="text-muted-foreground">Comprehensive overview of host vulnerabilities and risk assessment</p>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="metric-card">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Total Hosts</p>
            <p className="text-2xl font-bold">{summaryStats.totalHosts.toLocaleString()}</p>
          </div>
        </div>
        <div className="metric-card">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Total Vulnerabilities</p>
            <p className="text-2xl font-bold">{summaryStats.totalVulnerabilities.toLocaleString()}</p>
          </div>
        </div>
        <div className="metric-card">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Total Vulnerabilities with CVE</p>
            <p className="text-2xl font-bold">{summaryStats.totalVulnerabilitiesWithCVE.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Hosts Summary Table */}
      <div className="chart-container">
        <h3 className="text-lg font-semibold mb-4">Hosts Summary</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4">Host</th>
                <th className="text-center py-3 px-4">Vulnerability Count</th>
                <th className="text-center py-3 px-4">Vulnerabilities with CVE</th>
                <th className="text-center py-3 px-4">Critical</th>
                <th className="text-center py-3 px-4">High</th>
                <th className="text-center py-3 px-4">Medium</th>
                <th className="text-center py-3 px-4">Low</th>
              </tr>
            </thead>
            <tbody>
              {hostsData.map((item, index) => (
                <tr key={index} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="py-3 px-4 font-mono text-sm">{item.host}</td>
                  <td className="py-3 px-4 text-center font-bold">{item.vulnerabilityCount}</td>
                  <td className="py-3 px-4 text-center font-mono">{item.vulnerabilitiesWithCVE}</td>
                  <td className="py-3 px-4 text-center text-red-400 font-bold">{item.critical}</td>
                  <td className="py-3 px-4 text-center text-orange-400 font-bold">{item.high}</td>
                  <td className="py-3 px-4 text-center text-yellow-400 font-bold">{item.medium}</td>
                  <td className="py-3 px-4 text-center text-green-400 font-bold">{item.low}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
