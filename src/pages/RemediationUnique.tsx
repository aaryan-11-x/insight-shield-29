
import { Badge } from "@/components/ui/badge";

const remediationUniqueData = [
  {
    remediation: `Filter out the ICMP timestamp requests (13), and the outgoing ICMP timestamp replies (14).`,
    uniqueVulnerability: "CVE-1999-0524",
    riskRating: "nan"
  },
  {
    remediation: `Reconfigure the affected application if possible to avoid use of medium strength ciphers.`,
    uniqueVulnerability: "CVE-2016-2183",
    riskRating: "High"
  },
  {
    remediation: "Upgrade to 2402, 2402 LTSR, 1912 LTSR CU9, 2203 LTSR CU5 or later.",
    uniqueVulnerability: "CVE-2024-6151",
    riskRating: "High"
  },
  {
    remediation: `Microsoft has released KB5002586 to address this issue.\n\nFor Office 365, Office 2016 C2R, or Office 2019, ensure automatic updates are enabled or open any office app and manually perform an update.`,
    uniqueVulnerability: "CVE-2024-38171",
    riskRating: "High"
  },
  {
    remediation: "Update .NET Core, remove vulnerable packages and refer to vendor advisory.",
    uniqueVulnerability: "CVE-2024-38229",
    riskRating: "High"
  },
  {
    remediation: "Update .NET Core, remove vulnerable packages and refer to vendor advisory.",
    uniqueVulnerability: "CVE-2024-43483",
    riskRating: "High"
  },
  {
    remediation: "Update .NET Core, remove vulnerable packages and refer to vendor advisory.",
    uniqueVulnerability: "CVE-2024-43484",
    riskRating: "High"
  },
  {
    remediation: "Update .NET Core, remove vulnerable packages and refer to vendor advisory.",
    uniqueVulnerability: "CVE-2024-43485",
    riskRating: "High"
  },
  {
    remediation: "Microsoft has released KB5002619 to address this issue.",
    uniqueVulnerability: "CVE-2024-49033",
    riskRating: "High"
  },
  {
    remediation: `Microsoft has released the following security updates to address this issue:\n    - Update 17.6.20 for Visual Studio 2022\n    - Update 17.8.15 for Visual Studio 2022\n    - Update 17.10.8 for Visual Studio 2022\n    - Update 17.11.5 for Visual Studio 2022`,
    uniqueVulnerability: "CVE-2024-43498",
    riskRating: "Critical"
  },
  {
    remediation: `Microsoft has released the following security updates to address this issue:\n    - Update 17.6.20 for Visual Studio 2022\n    - Update 17.8.15 for Visual Studio 2022\n    - Update 17.10.8 for Visual Studio 2022\n    - Update 17.11.5 for Visual Studio 2022`,
    uniqueVulnerability: "CVE-2024-43499",
    riskRating: "Critical"
  }
];

export default function RemediationUnique() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Remediation-Unique Vulnerabilities</h1>
        <p className="text-muted-foreground">Mapping of remediation actions to unique vulnerabilities</p>
      </div>

      <div className="chart-container">
        <h3 className="text-lg font-semibold mb-4">Remediation to Unique Vulnerabilities</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 min-w-[400px]">Remediation</th>
                <th className="text-left py-3 px-4">Unique Vulnerability</th>
                <th className="text-left py-3 px-4">Risk Rating</th>
              </tr>
            </thead>
            <tbody>
              {remediationUniqueData.map((item, index) => (
                <tr key={index} className="border-b border-border/50 hover:bg-muted/20">
                  <td className="py-3 px-4">
                    <div className="max-w-md">
                      <p className="text-sm whitespace-pre-line">{item.remediation}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <code className="text-sm font-mono bg-background px-2 py-1 rounded">{item.uniqueVulnerability}</code>
                  </td>
                  <td className="py-3 px-4">
                    {item.riskRating === "nan" ? (
                      <span className="text-muted-foreground">N/A</span>
                    ) : (
                      <Badge variant={item.riskRating === "Critical" ? "destructive" : "default"}>
                        {item.riskRating}
                      </Badge>
                    )}
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
