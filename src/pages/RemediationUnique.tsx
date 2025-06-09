
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface RemediationUniqueData {
  id: number;
  remediation: string;
  unique_vulnerability: string;
  risk_rating: string;
}

export default function RemediationUnique() {
  const { data: remediationUniqueData, isLoading } = useQuery({
    queryKey: ['remediation-unique-vulnerabilities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('remediation_to_unique_vulnerabilities')
        .select('*')
        .order('id');
      
      if (error) {
        console.error('Error fetching remediation unique vulnerabilities data:', error);
        throw error;
      }
      
      return data as RemediationUniqueData[];
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Remediation-Unique Vulnerabilities</h1>
          <p className="text-muted-foreground">Mapping of remediation actions to unique vulnerabilities</p>
        </div>
        <div className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">Loading remediation data...</p>
        </div>
      </div>
    );
  }

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
              {remediationUniqueData?.map((item, index) => (
                <tr key={index} className="border-b border-border/50 hover:bg-muted/20">
                  <td className="py-3 px-4">
                    <div className="max-w-md">
                      <p className="text-sm whitespace-pre-line">{item.remediation}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <code className="text-sm font-mono bg-background px-2 py-1 rounded">{item.unique_vulnerability}</code>
                  </td>
                  <td className="py-3 px-4">
                    {item.risk_rating === "nan" ? (
                      <span className="text-muted-foreground">N/A</span>
                    ) : (
                      <Badge variant={item.risk_rating === "Critical" ? "destructive" : "default"}>
                        {item.risk_rating}
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
