
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface PatchDetailData {
  id: number;
  cve: string;
  patch_status: string;
  source: string | null;
  url: string | null;
  tags: string | null;
}

interface PatchAvailabilityData {
  id: number;
  risk_severity: string;
  vulnerabilities_with_patch_available: number;
  vulnerabilities_with_patch_not_available: number;
  total_patches_to_be_applied: number;
}

export default function PatchDetails() {
  const { data: patchDetailsData, isLoading: detailsLoading } = useQuery({
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

  const { data: patchAvailabilityData, isLoading: availabilityLoading } = useQuery({
    queryKey: ['patch-availability'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('patch_availability')
        .select('*')
        .order('risk_severity');
      
      if (error) {
        console.error('Error fetching patch availability data:', error);
        throw error;
      }
      
      return data as PatchAvailabilityData[];
    }
  });

  // Transform patch availability data for chart
  const chartData = patchAvailabilityData?.map(item => ({
    severity: item.risk_severity,
    available: item.vulnerabilities_with_patch_available,
    unavailable: item.vulnerabilities_with_patch_not_available
  })) || [];

  if (detailsLoading || availabilityLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Patch Details</h1>
          <p className="text-muted-foreground">Detailed information about available patches</p>
        </div>
        <div className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">Loading patch data...</p>
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

      {/* Patch Availability by Severity */}
      <div className="chart-container">
        <h3 className="text-lg font-semibold mb-4">Patch Availability by Severity</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="severity" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "#1f2937", 
                  border: "1px solid #374151",
                  borderRadius: "8px"
                }} 
              />
              <Bar dataKey="available" fill="#10b981" name="Patches Available" />
              <Bar dataKey="unavailable" fill="#ef4444" name="Patches Unavailable" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-container">
        <h3 className="text-lg font-semibold mb-4">Patch Details</h3>
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
