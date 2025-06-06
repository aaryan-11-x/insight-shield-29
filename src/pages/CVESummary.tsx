
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const cveDetailsData = [
  {
    cve: "CVE-2016-2183",
    count: 285,
    severity: "High",
    name: "SSL Medium Strength Cipher Suites Supported (SWEET32)",
    description: "The remote host supports the use of SSL ciphers that offer medium strength encryption. Nessus regards medium strength as any encryption that uses key lengths at least 64 bits and less than 112 bits, or else that uses the 3DES encryption suite. Note that it is considerably easier to circumvent medium strength encryption if the attacker is on the same physical network.",
    hosts: "10.167.36.104, 10.167.36.196, 10.167.36.33, 10.167.36.50, 10.167.36.52, 10.167.37.100, 10.167.37.101, 10.167.37.102, 10.167.37.103, 10.167.37.104, 10.167.37.133, 10.167.37.150, 10.167.37.155, 10.167.37.156, 10.167.37.171, 10.167.37.206, 10.167.37.217, 10.167.37.229, 10.167.38.8, 10.168.1.130, 10.168.1.131, 10.168.1.161, 10.168.1.162, 10.168.1.168, 10.168.1.169, 10.168.1.171, 10.168.1.172, 10.168.1.173, 10.168.1.176, 10.168.1.177, 10.168.1.180, 10.168.1.183, 10.168.1.184, 10.168.1.185, 10.168.1.209, 10.168.1.217, 10.168.1.219, 10.168.1.220, 10.168.1.221, 10.168.1.23, 10.168.1.235, 10.168.1.32, 10.168.1.39, 10.168.1.40, 10.168.1.42, 10.168.1.53, 10.168.1.55, 10.168.1.76, 10.168.1.79, 10.168.1.80, 10.168.1.86, 10.168.1.87, 10.168.1.9, 10.168.1.90, 10.168.138.15, 10.168.138.8, 10.168.142.117, 10.168.142.118, 10.168.142.119, 10.168.142.120, 10.168.142.141, 10.168.142.143, 10.168.142.15, 10.168.142.209, 10.168.142.228, 10.168.142.48, 10.168.142.49, 10.168.143.81, 10.168.145.235, 10.168.145.238, 10.168.2.105, 10.168.2.107, 10.168.2.109, 10.168.2.117, 10.168.2.122, 10.168.2.124, 10.168.2.125, 10.168.2.126, 10.168.2.127, 10.168.2.131, 10.168.2.134, 10.168.2.135, 10.168.2.136, 10.168.2.138, 10.168.2.141, 10.168.2.142, 10.168.2.144, 10.168.2.146, 10.168.2.158, 10.168.2.167, 10.168.2.168, 10.168.2.17, 10.168.2.175, 10.168.2.176, 10.168.2.178, 10.168.2.179, 10.168.2.18, 10.168.2.180, 10.168.2.188, 10.168.2.19, 10.168.2.209, 10.168.2.210, 10.168.2.211, 10.168.2.212, 10.168.2.217, 10.168.2.219, 10.168.2.220, 10.168.2.223, 10.168.2.225, 10.168.2.23, 10.168.2.232, 10.168.2.244, 10.168.2.245, 10.168.2.246, 10.168.2.248, 10.168.2.249, 10.168.2.36, 10.168.2.42, 10.168.2.43, 10.168.2.48, 10.168.2.49, 10.168.2.54, 10.168.2.55, 10.168.2.56, 10.168.2.58, 10.168.2.59, 10.168.2.60, 10.168.2.69, 10.168.2.70, 10.168.2.71, 10.168.2.72, 10.168.2.73, 10.168.2.74, 10.168.2.76, 10.168.2.77, 10.168.2.8, 10.168.2.88, 10.168.209.43, 10.168.209.92, 10.168.49.31, 10.168.49.44, 10.168.49.45, 10.168.49.46, 10.168.49.49, 10.168.49.51, 10.168.49.56, 10.168.49.57, 10.168.50.116, 10.168.50.117, 10.168.50.118, 10.168.50.140, 10.168.50.22, 10.168.50.49, 10.168.50.51, 10.168.50.54, 10.168.50.89, 10.168.51.102, 10.168.51.34, 10.168.51.41, 10.168.51.81, 10.168.51.82, 10.168.51.92, 10.168.51.95, 10.168.52.59, 10.168.52.60, 10.168.52.61, 10.168.52.75, 10.168.52.80, 10.168.53.17, 10.168.53.18, 10.168.58.155, 10.168.59.140, 10.168.59.164, 10.168.59.165, 10.168.59.169, 10.168.59.170, 10.168.59.171, 10.168.59.172, 10.168.59.180, 10.168.59.181, 10.168.59.182, 10.168.59.183, 10.168.59.184, 10.168.59.185, 10.168.59.50, 10.168.59.51, 10.168.59.52, 10.168.59.53, 10.168.59.56, 10.168.59.57, 10.168.59.59, 10.168.59.60, 10.168.59.61, 10.168.6.245, 10.168.6.252, 10.168.6.32, 10.168.64.208, 10.168.9.25, 10.168.9.31, 10.168.9.32, 10.168.9.33, 10.168.9.6, 10.168.9.62, 10.168.9.7, 10.168.9.8",
    solutions: "Reconfigure the affected application if possible to avoid use of medium strength ciphers."
  },
  {
    cve: "CVE-2019-17571",
    count: 47,
    severity: "Critical",
    name: "Apache Log4j 1.x Multiple Vulnerabilities",
    description: "According to its self-reported version number, the installation of Apache Log4j on the remote host is 1.x and is no longer supported. Log4j reached its end of life prior to 2016. Additionally, Log4j 1.x is affected by multiple vulnerabilities, including : - Log4j includes a SocketServer that accepts serialized log events and deserializes them without verifying whether the objects are allowed or not. This can provide an attack vector that can be exploited. (CVE-2019-17571) - Improper validation of certificate with host mismatch in Apache Log4j SMTP appender. This could allow an SMTPS connection to be intercepted by a man-in-the-middle attack which could leak any log messages sent through that appender. (CVE-2020-9488) - JMSSink uses JNDI in an unprotected manner allowing any application using the JMSSink to be vulnerable if it is configured to reference an untrusted site or if the site referenced can be accesseed by the attacker. (CVE-2022-23302) Lack of support implies that no new security patches for the product will be released by the vendor. As a result, it is likely to contain security vulnerabilities.",
    hosts: "10.168.1.209, 10.168.142.195, 10.168.2.146, 10.168.2.48, 10.168.50.100, 10.168.50.77, 10.168.51.82, 10.168.52.75, 10.168.53.17, 10.168.59.55",
    solutions: "Upgrade to a version of Apache Log4j that is currently supported. Upgrading to the latest versions for Apache Log4j is highly recommended as intermediate versions / patches have known high severity vulnerabilities and the vendor is updating their advisories often as new research and knowledge about the impact of Log4j is discovered. Refer to https://logging.apache.org/log4j/2.x/security.html for the latest versions."
  },
  {
    cve: "CVE-2020-9488",
    count: 47,
    severity: "Critical",
    name: "Apache Log4j 1.x Multiple Vulnerabilities",
    description: "According to its self-reported version number, the installation of Apache Log4j on the remote host is 1.x and is no longer supported. Log4j reached its end of life prior to 2016. Additionally, Log4j 1.x is affected by multiple vulnerabilities, including : - Log4j includes a SocketServer that accepts serialized log events and deserializes them without verifying whether the objects are allowed or not. This can provide an attack vector that can be exploited. (CVE-2019-17571) - Improper validation of certificate with host mismatch in Apache Log4j SMTP appender. This could allow an SMTPS connection to be intercepted by a man-in-the-middle attack which could leak any log messages sent through that appender. (CVE-2020-9488) - JMSSink uses JNDI in an unprotected manner allowing any application using the JMSSink to be vulnerable if it is configured to reference an untrusted site or if the site referenced can be accesseed by the attacker. (CVE-2022-23302) Lack of support implies that no new security patches for the product will be released by the vendor. As a result, it is likely to contain security vulnerabilities.",
    hosts: "10.168.1.209, 10.168.142.195, 10.168.2.146, 10.168.2.48, 10.168.50.100, 10.168.50.77, 10.168.51.82, 10.168.52.75, 10.168.53.17, 10.168.59.55",
    solutions: "Upgrade to a version of Apache Log4j that is currently supported. Upgrading to the latest versions for Apache Log4j is highly recommended as intermediate versions / patches have known high severity vulnerabilities and the vendor is updating their advisories often as new research and knowledge about the impact of Log4j is discovered. Refer to https://logging.apache.org/log4j/2.x/security.html for the latest versions."
  },
  {
    cve: "CVE-2022-23302",
    count: 47,
    severity: "Critical",
    name: "Apache Log4j 1.x Multiple Vulnerabilities",
    description: "According to its self-reported version number, the installation of Apache Log4j on the remote host is 1.x and is no longer supported. Log4j reached its end of life prior to 2016. Additionally, Log4j 1.x is affected by multiple vulnerabilities, including : - Log4j includes a SocketServer that accepts serialized log events and deserializes them without verifying whether the objects are allowed or not. This can provide an attack vector that can be exploited. (CVE-2019-17571) - Improper validation of certificate with host mismatch in Apache Log4j SMTP appender. This could allow an SMTPS connection to be intercepted by a man-in-the-middle attack which could leak any log messages sent through that appender. (CVE-2020-9488) - JMSSink uses JNDI in an unprotected manner allowing any application using the JMSSink to be vulnerable if it is configured to reference an untrusted site or if the site referenced can be accesseed by the attacker. (CVE-2022-23302) Lack of support implies that no new security patches for the product will be released by the vendor. As a result, it is likely to contain security vulnerabilities.",
    hosts: "10.168.1.209, 10.168.142.195, 10.168.2.146, 10.168.2.48, 10.168.50.100, 10.168.50.77, 10.168.51.82, 10.168.52.75, 10.168.53.17, 10.168.59.55",
    solutions: "Upgrade to a version of Apache Log4j that is currently supported. Upgrading to the latest versions for Apache Log4j is highly recommended as intermediate versions / patches have known high severity vulnerabilities and the vendor is updating their advisories often as new research and knowledge about the impact of Log4j is discovered. Refer to https://logging.apache.org/log4j/2.x/security.html for the latest versions."
  },
  {
    cve: "CVE-2022-23305",
    count: 47,
    severity: "Critical",
    name: "Apache Log4j 1.x Multiple Vulnerabilities",
    description: "According to its self-reported version number, the installation of Apache Log4j on the remote host is 1.x and is no longer supported. Log4j reached its end of life prior to 2016. Additionally, Log4j 1.x is affected by multiple vulnerabilities, including : - Log4j includes a SocketServer that accepts serialized log events and deserializes them without verifying whether the objects are allowed or not. This can provide an attack vector that can be exploited. (CVE-2019-17571) - Improper validation of certificate with host mismatch in Apache Log4j SMTP appender. This could allow an SMTPS connection to be intercepted by a man-in-the-middle attack which could leak any log messages sent through that appender. (CVE-2020-9488) - JMSSink uses JNDI in an unprotected manner allowing any application using the JMSSink to be vulnerable if it is configured to reference an untrusted site or if the site referenced can be accesseed by the attacker. (CVE-2022-23302) Lack of support implies that no new security patches for the product will be released by the vendor. As a result, it is likely to contain security vulnerabilities.",
    hosts: "10.168.1.209, 10.168.142.195, 10.168.2.146, 10.168.2.48, 10.168.50.100, 10.168.50.77, 10.168.51.82, 10.168.52.75, 10.168.53.17, 10.168.59.55",
    solutions: "Upgrade to a version of Apache Log4j that is currently supported. Upgrading to the latest versions for Apache Log4j is highly recommended as intermediate versions / patches have known high severity vulnerabilities and the vendor is updating their advisories often as new research and knowledge about the impact of Log4j is discovered. Refer to https://logging.apache.org/log4j/2.x/security.html for the latest versions."
  },
  {
    cve: "CVE-2022-23307",
    count: 47,
    severity: "Critical",
    name: "Apache Log4j 1.x Multiple Vulnerabilities",
    description: "According to its self-reported version number, the installation of Apache Log4j on the remote host is 1.x and is no longer supported. Log4j reached its end of life prior to 2016. Additionally, Log4j 1.x is affected by multiple vulnerabilities, including : - Log4j includes a SocketServer that accepts serialized log events and deserializes them without verifying whether the objects are allowed or not. This can provide an attack vector that can be exploited. (CVE-2019-17571) - Improper validation of certificate with host mismatch in Apache Log4j SMTP appender. This could allow an SMTPS connection to be intercepted by a man-in-the-middle attack which could leak any log messages sent through that appender. (CVE-2020-9488) - JMSSink uses JNDI in an unprotected manner allowing any application using the JMSSink to be vulnerable if it is configured to reference an untrusted site or if the site referenced can be accesseed by the attacker. (CVE-2022-23302) Lack of support implies that no new security patches for the product will be released by the vendor. As a result, it is likely to contain security vulnerabilities.",
    hosts: "10.168.1.209, 10.168.142.195, 10.168.2.146, 10.168.2.48, 10.168.50.100, 10.168.50.77, 10.168.51.82, 10.168.52.75, 10.168.53.17, 10.168.59.55",
    solutions: "Upgrade to a version of Apache Log4j that is currently supported. Upgrading to the latest versions for Apache Log4j is highly recommended as intermediate versions / patches have known high severity vulnerabilities and the vendor is updating their advisories often as new research and knowledge about the impact of Log4j is discovered. Refer to https://logging.apache.org/log4j/2.x/security.html for the latest versions."
  }
];

const summaryStats = {
  totalCves: cveDetailsData.length,
  critical: cveDetailsData.filter(item => item.severity === "Critical").length,
  high: cveDetailsData.filter(item => item.severity === "High").length,
  medium: cveDetailsData.filter(item => item.severity === "Medium").length,
  low: cveDetailsData.filter(item => item.severity === "Low").length,
};

export default function CVESummary() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Higher Management Insights</h1>
          <p className="text-muted-foreground">CVE summary and executive overview</p>
        </div>
        <Button className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Download Report
        </Button>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="metric-card">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Total CVEs</p>
            <p className="text-2xl font-bold">{summaryStats.totalCves}</p>
          </div>
        </div>
        <div className="metric-card">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Critical</p>
            <p className="text-2xl font-bold text-red-400">{summaryStats.critical}</p>
          </div>
        </div>
        <div className="metric-card">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">High</p>
            <p className="text-2xl font-bold text-orange-400">{summaryStats.high}</p>
          </div>
        </div>
        <div className="metric-card">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Medium</p>
            <p className="text-2xl font-bold text-yellow-400">{summaryStats.medium}</p>
          </div>
        </div>
        <div className="metric-card">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Low</p>
            <p className="text-2xl font-bold text-green-400">{summaryStats.low}</p>
          </div>
        </div>
      </div>

      {/* CVE Details Table */}
      <div className="chart-container">
        <h3 className="text-lg font-semibold mb-4">CVE Details</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4">CVE</th>
                <th className="text-center py-3 px-4">Count</th>
                <th className="text-center py-3 px-4">Severity</th>
                <th className="text-left py-3 px-4">Name</th>
                <th className="text-left py-3 px-4">Description</th>
                <th className="text-left py-3 px-4">Hosts</th>
                <th className="text-left py-3 px-4">Solutions</th>
              </tr>
            </thead>
            <tbody>
              {cveDetailsData.map((item, index) => (
                <tr key={index} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="py-3 px-4">
                    <code className="text-sm font-mono bg-background px-2 py-1 rounded">{item.cve}</code>
                  </td>
                  <td className="py-3 px-4 text-center font-bold">{item.count}</td>
                  <td className="py-3 px-4 text-center">
                    <Badge variant={
                      item.severity === "Critical" ? "destructive" : 
                      item.severity === "High" ? "default" : 
                      "secondary"
                    }>
                      {item.severity}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-sm font-medium max-w-xs">{item.name}</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground max-w-md">
                    <div className="line-clamp-3">{item.description}</div>
                  </td>
                  <td className="py-3 px-4 text-xs text-muted-foreground max-w-xs">
                    <div className="line-clamp-2">{item.hosts}</div>
                  </td>
                  <td className="py-3 px-4 text-sm text-muted-foreground max-w-md">
                    <div className="line-clamp-3">{item.solutions}</div>
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
