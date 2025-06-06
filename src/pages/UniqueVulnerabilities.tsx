
import { Badge } from "@/components/ui/badge";

const vulnerabilityOverviewData = [
  { metric: "Total Vulnerabilities", value: 54655, percentage: "" },
  { metric: "Unique Vulnerabilities", value: 440, percentage: "100%" },
  { metric: "Critical Vulnerabilities", value: 37, percentage: "8.4%" },
  { metric: "High Vulnerabilities", value: 71, percentage: "16.1%" },
  { metric: "Medium Vulnerabilities", value: 47, percentage: "10.7%" },
  { metric: "Low Vulnerabilities", value: 54, percentage: "12.3%" },
  { metric: "KEV Listed Vulnerabilities", value: 16, percentage: "3.6%" },
];

const vulnerabilityDetailsData = [
  {
    name: "KB5048661: Windows 10 version 1809 / Windows Server 2019 Security Update (December 2024)",
    severity: "Critical",
    cve: "CVE-2024-49072, CVE-2024-49073, CVE-2024-49074 (+53 more)",
    affectedHosts: 28,
    instanceCount: 1568,
    kevListed: "Yes",
    cvssScore: 9.8,
    epssScore: 0.0009,
    remediation: "Apply Security Update 5048661"
  },
  {
    name: "Apache Log4j 1.x Multiple Vulnerabilities",
    severity: "Critical",
    cve: "CVE-2019-17571, CVE-2020-9488, CVE-2022-23302 (+3 more)",
    affectedHosts: 10,
    instanceCount: 282,
    kevListed: "No",
    cvssScore: 9.8,
    epssScore: 0.9385,
    remediation: "Upgrade to a version of Apache Log4j that is currently supported. Upgrading to the latest versions for Apache Log4j is highly recommended as intermediate versions / patches have known high severity vulnerabilities and the vendor is updating their advisories often as new research and knowledge about the impact of Log4j is discovered. Refer to https://logging.apache.org/log4j/2.x/security.html for the latest versions."
  },
  {
    name: "ASP.NET Core SEoL",
    severity: "Critical",
    cve: "",
    affectedHosts: 34,
    instanceCount: 99,
    kevListed: "No",
    cvssScore: 10,
    epssScore: "N/A",
    remediation: "Upgrade to a version of ASP.NET Core that is currently supported."
  },
  {
    name: "KB5048671: Windows 10 Version 1607 / Windows Server 2016 Security Update (December 2024)",
    severity: "Critical",
    cve: "CVE-2024-49072, CVE-2024-49079, CVE-2024-49080 (+30 more)",
    affectedHosts: 3,
    instanceCount: 99,
    kevListed: "Yes",
    cvssScore: 9.8,
    epssScore: 0.0009,
    remediation: "Apply Security Update 5048671"
  },
  {
    name: "KB5044321: Windows Server 2008 R2 Security Update (October 2024)",
    severity: "Critical",
    cve: "CVE-2024-38124, CVE-2024-38149, CVE-2024-38212 (+34 more)",
    affectedHosts: 2,
    instanceCount: 74,
    kevListed: "Yes",
    cvssScore: 9,
    epssScore: 0.0019,
    remediation: "Apply Security Update 5044321 or Cumulative Update 5044356"
  },
  {
    name: "Apache Tomcat 9.0.0.M1 < 9.0.98 multiple vulnerabilities",
    severity: "Critical",
    cve: "CVE-2024-50379, CVE-2024-54677, CVE-2024-56337",
    affectedHosts: 12,
    instanceCount: 63,
    kevListed: "No",
    cvssScore: 9.8,
    epssScore: 0.0004,
    remediation: "Upgrade to Apache Tomcat version 9.0.98 or later."
  },
  {
    name: "Oracle Database Server (October 2024 CPU)",
    severity: "Critical",
    cve: "CVE-2022-38136, CVE-2022-40196, CVE-2022-41342 (+27 more)",
    affectedHosts: 2,
    instanceCount: 60,
    kevListed: "No",
    cvssScore: 9.8,
    epssScore: 0.0014,
    remediation: "Apply the appropriate patch according to the October 2024 Oracle Critical Patch Update advisory."
  }
];

const vennDiagramData = [
  { name: "Unique Vulnerabilities", value: 440, color: "#3b82f6" },
  { name: "Critical", value: 37, color: "#dc2626" },
  { name: "High", value: 71, color: "#ea580c" },
  { name: "Medium", value: 47, color: "#ca8a04" },
  { name: "Low", value: 54, color: "#16a34a" },
  { name: "KEV Listed", value: 16, color: "#8b5cf6" },
];

export default function UniqueVulnerabilities() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Unique Vulnerabilities</h1>
        <p className="text-muted-foreground">This sheet provides a high-level summary of unique vulnerabilities by severity, aiding in operational planning and resource allocation.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vulnerability Overview Table */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold mb-4">Vulnerability Overview</h3>
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
                      <Badge variant={item.percentage === "" ? "secondary" : "default"}>
                        {item.percentage || "—"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Venn Diagram Representation */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold mb-4">Vulnerability Categories Distribution</h3>
          <div className="grid grid-cols-2 gap-4">
            {vennDiagramData.map((item, index) => (
              <div key={index} className="bg-background p-4 rounded border">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <div>
                    <p className="text-sm text-muted-foreground">{item.name}</p>
                    <p className="text-xl font-bold">{item.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Vulnerabilities Table */}
      <div className="chart-container">
        <h3 className="text-lg font-semibold mb-4">Top Unique Vulnerabilities Details</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-2 min-w-[200px]">Vulnerability Name</th>
                <th className="text-center py-3 px-2">Severity</th>
                <th className="text-left py-3 px-2 min-w-[150px]">CVE</th>
                <th className="text-center py-3 px-2">Affected Hosts</th>
                <th className="text-center py-3 px-2">Instance Count</th>
                <th className="text-center py-3 px-2">KEV Listed</th>
                <th className="text-center py-3 px-2">CVSS Score</th>
                <th className="text-center py-3 px-2">EPSS Score</th>
                <th className="text-left py-3 px-2 min-w-[250px]">Remediation</th>
              </tr>
            </thead>
            <tbody>
              {vulnerabilityDetailsData.map((item, index) => (
                <tr key={index} className="border-b border-border/50 hover:bg-muted/20">
                  <td className="py-3 px-2 font-medium">{item.name}</td>
                  <td className="py-3 px-2 text-center">
                    <Badge variant="destructive">{item.severity}</Badge>
                  </td>
                  <td className="py-3 px-2">
                    <code className="text-xs bg-background px-1 py-0.5 rounded">{item.cve || "—"}</code>
                  </td>
                  <td className="py-3 px-2 text-center">{item.affectedHosts}</td>
                  <td className="py-3 px-2 text-center font-mono">{item.instanceCount}</td>
                  <td className="py-3 px-2 text-center">
                    <Badge variant={item.kevListed === "Yes" ? "destructive" : "secondary"}>
                      {item.kevListed}
                    </Badge>
                  </td>
                  <td className="py-3 px-2 text-center font-mono">{item.cvssScore}</td>
                  <td className="py-3 px-2 text-center font-mono">{item.epssScore === "N/A" ? "N/A" : item.epssScore}</td>
                  <td className="py-3 px-2 text-xs">{item.remediation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
