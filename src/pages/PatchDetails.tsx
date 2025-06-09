
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface PatchDetailData {
  id: number;
  cve: string;
  patch_status: string;
  source: string | null;
  url: string | null;
  tags: string | null;
}

export default function PatchDetails() {
  const { data: patchDetailsData, isLoading } = useQuery({
    queryKey: ['patch-details'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('patch_details')
        .select('*')
        .order('id');
      
      if (error) {
        console.error('Error fetching patch details data:', error);
        throw error;
      }
      
      return data as PatchDetailData[];
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Patch Details</h1>
          <p className="text-muted-foreground">Detailed information about available patches</p>
        </div>
        <div className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">Loading patch details data...</p>
        </div>
      </div>
    );
  }

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
              {patchDetailsData?.map((item, index) => (
                <tr key={index} className="border-b border-border/50 hover:bg-muted/20">
                  <td className="py-3 px-4">
                    <code className="text-sm font-mono bg-background px-2 py-1 rounded">{item.cve}</code>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="default">{item.patch_status}</Badge>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm">{item.source || "—"}</span>
                  </td>
                  <td className="py-3 px-4">
                    {item.url ? (
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
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm">{item.tags || "—"}</span>
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
