
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

const patchDetailsData = [
  {
    cve: "CVE-1999-0524",
    patchStatus: "Available",
    source: "cve@mitre.org",
    url: "http://kb.juniper.net/InfoCenter/index?page=content&id=JSA10705",
    tags: "Third Party Advisory"
  },
  {
    cve: "CVE-2016-2183",
    patchStatus: "Available",
    source: "secalert@redhat.com",
    url: "http://kb.juniper.net/InfoCenter/index?page=content&id=JSA10759",
    tags: "Third Party Advisory"
  },
  {
    cve: "CVE-2024-38171",
    patchStatus: "Available",
    source: "secure@microsoft.com",
    url: "https://msrc.microsoft.com/update-guide/vulnerability/CVE-2024-38171",
    tags: "Patch, Vendor Advisory"
  },
  {
    cve: "CVE-2024-38229",
    patchStatus: "Available",
    source: "secure@microsoft.com",
    url: "https://msrc.microsoft.com/update-guide/vulnerability/CVE-2024-38229",
    tags: "Patch, Vendor Advisory"
  },
  {
    cve: "CVE-2024-43483",
    patchStatus: "Available",
    source: "secure@microsoft.com",
    url: "https://msrc.microsoft.com/update-guide/vulnerability/CVE-2024-43483",
    tags: "Patch, Vendor Advisory"
  },
  {
    cve: "CVE-2024-43484",
    patchStatus: "Available",
    source: "secure@microsoft.com",
    url: "https://msrc.microsoft.com/update-guide/vulnerability/CVE-2024-43484",
    tags: "Patch, Vendor Advisory"
  },
  {
    cve: "CVE-2024-43485",
    patchStatus: "Available",
    source: "secure@microsoft.com",
    url: "https://msrc.microsoft.com/update-guide/vulnerability/CVE-2024-43485",
    tags: "Patch, Vendor Advisory"
  },
  {
    cve: "CVE-2024-49033",
    patchStatus: "Available",
    source: "secure@microsoft.com",
    url: "https://msrc.microsoft.com/update-guide/vulnerability/CVE-2024-49033",
    tags: "Patch, Vendor Advisory"
  }
];

export default function PatchDetails() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Patch Details</h1>
        <p className="text-muted-foreground">Detailed information about available patches</p>
      </div>

      <div className="chart-container">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4">CVE</th>
                <th className="text-left py-3 px-4">Patch Status</th>
                <th className="text-left py-3 px-4">Source</th>
                <th className="text-left py-3 px-4">URL</th>
                <th className="text-left py-3 px-4">Tags</th>
              </tr>
            </thead>
            <tbody>
              {patchDetailsData.map((item, index) => (
                <tr key={index} className="border-b border-border/50 hover:bg-muted/20">
                  <td className="py-3 px-4">
                    <code className="text-sm font-mono bg-background px-2 py-1 rounded">{item.cve}</code>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="default">{item.patchStatus}</Badge>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm">{item.source}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <a 
                        href={item.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-400 hover:text-blue-300 underline max-w-xs truncate"
                      >
                        {item.url}
                      </a>
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                      >
                        <a href={item.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm">{item.tags}</span>
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
