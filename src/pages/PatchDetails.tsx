import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Download, Loader2, ChevronDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { UUID } from "crypto";
import { useToast } from "@/components/ui/use-toast";
import { useState, useMemo } from "react";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PatchDetailsData {
  cve: string;
  id: number;
  patch_status: string;
  source: string | null;
  tags: string | null;
  url: string | null;
  instance_id: UUID;
  run_id: string;
}

interface PatchAvailabilityData {
  id: number;
  risk_severity: string;
  vulnerabilities_with_patch_available: number;
  vulnerabilities_with_patch_not_available: number;
  total_patches_to_be_applied: number;
  instance_id: UUID;
  run_id: string;
}

export default function PatchDetails() {
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();
  const [filterType, setFilterType] = useState<'cve' | 'tags' | 'patch_status' | 'sources'>('cve');
  const [filterValue, setFilterValue] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 50;
  const [showAll, setShowAll] = useState(true);
  const [showSourcesDialog, setShowSourcesDialog] = useState(false);
  const [showTagsDialog, setShowTagsDialog] = useState(false);

  const { data: patchData, isLoading } = useQuery({
    queryKey: ['patch-details'],
    queryFn: async () => {
      const instanceId = localStorage.getItem('currentInstanceId');
      const runId = localStorage.getItem('currentRunId');
      const { data, error } = await supabase
        .from('patch_details')
        .select('*')
        .eq('instance_id', instanceId)
        .eq('run_id', runId)
        .order('id');
      
      if (error) {
        console.error('Error fetching patch details data:', error);
        throw error;
      }
      
      return data;
    }
  });

  const { data: patchAvailabilityData, isLoading: availabilityLoading } = useQuery({
    queryKey: ['patch-availability'],
    queryFn: async () => {
      const instanceId = localStorage.getItem('currentInstanceId');
      const runId = localStorage.getItem('currentRunId');
      const { data, error } = await supabase
        .from('patch_availability')
        .select('*')
        .eq('instance_id', instanceId)
        .eq('run_id', runId)
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

  // Derive filter options from patchData
  const cveOptions = useMemo(() => Array.from(new Set((patchData || []).map(item => item.cve))).sort(), [patchData]);
  const tagOptions = useMemo(() => Array.from(new Set((patchData || []).flatMap(item => (item.tags ? item.tags.split(',').map(t => t.trim()) : [])))).sort(), [patchData]);
  const patchStatusOptions = useMemo(() => Array.from(new Set((patchData || []).map(item => item.patch_status))).sort(), [patchData]);
  const sourceOptions = useMemo(() => Array.from(new Set((patchData || []).map(item => item.source).filter(Boolean))).sort(), [patchData]);

  // Filtered data
  const filteredPatchData = useMemo(() => {
    if (showAll || !filterValue) return patchData;
    if (filterType === 'cve') return patchData?.filter(item => item.cve === filterValue);
    if (filterType === 'tags') return patchData?.filter(item => item.tags && item.tags.split(',').map(t => t.trim()).includes(filterValue));
    if (filterType === 'patch_status') return patchData?.filter(item => item.patch_status === filterValue);
    if (filterType === 'sources') return patchData?.filter(item => item.source === filterValue);
    return patchData;
  }, [patchData, filterType, filterValue, showAll]);

  // Pagination logic
  const totalPages = Math.ceil((filteredPatchData?.length || 0) / ITEMS_PER_PAGE);
  const paginatedPatchData = useMemo(() => {
    if (!filteredPatchData) return [];
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPatchData.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredPatchData, currentPage]);
  // Reset to first page when filter changes
  React.useEffect(() => { setCurrentPage(1); }, [filterType, filterValue]);

  // Summary stats
  const totalPatches = patchData?.length || 0;
  const uniqueSources = sourceOptions.length;
  const uniqueTags = tagOptions.length;
  const uniqueCVEsWithPatchAvailable = useMemo(() => Array.from(new Set((patchData || []).filter(item => item.patch_status === 'Available').map(item => item.cve))).sort(), [patchData]);
  const uniqueCVEsWithPatchAvailableCount = uniqueCVEsWithPatchAvailable.length;

  const handleDownloadSheet = async () => {
    try {
      setIsDownloading(true);
      const instanceId = localStorage.getItem('currentInstanceId');
      const runId = localStorage.getItem('currentRunId');
      
      if (!instanceId || !runId) {
        console.error('Instance ID or Run ID not found');
        toast({
          variant: "destructive",
          title: "Error",
          description: "Instance ID or Run ID not found",
          duration: 4000,
        });
        return;
      }

      // Encode the sheet name in Base64 URL-safe format
      const sheetName = "2.3 Patch Details";
      const encodedSheetName = btoa(decodeURIComponent(encodeURIComponent(sheetName)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      // Make the API request
      const response = await fetch(
        `http://192.168.89.143/api/v1/download-sheet/${instanceId}/${runId}/${encodedSheetName}`,
        {
          method: 'GET',
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.detail || `HTTP error! status: ${response.status}`);
      }

      // Get the blob from the response
      const blob = await response.blob();
      
      // Create a download link and trigger the download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${sheetName.replace(' ', '_')}.xls`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading sheet:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to download sheet',
        duration: 4000,
      });
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading || availabilityLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Patch Details</h1>
            <p className="text-muted-foreground">Detailed information about available patches</p>
          </div>
          <Button 
            onClick={handleDownloadSheet} 
            className="flex items-center gap-2"
            disabled={isDownloading}
          >
            {isDownloading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Downloading...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Download Sheet
              </>
            )}
          </Button>
        </div>
        <div className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">Loading patch data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Patch Details</h1>
          <p className="text-muted-foreground">Detailed information about available patches</p>
        </div>
        <Button 
          onClick={handleDownloadSheet} 
          className="flex items-center gap-2"
          disabled={isDownloading}
        >
          {isDownloading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Downloading...
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              Download Sheet
            </>
          )}
        </Button>
      </div>

      {/* Patch Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="metric-card"><div className="space-y-2"><p className="text-sm font-medium text-muted-foreground">Total Patches</p><p className="text-2xl font-bold">{totalPatches}</p></div></div>
        <div className="metric-card cursor-pointer hover:bg-muted/20 transition-colors" onClick={() => setShowSourcesDialog(true)}><div className="space-y-2"><p className="text-sm font-medium text-muted-foreground">Unique Sources</p><p className="text-2xl font-bold">{uniqueSources}</p></div></div>
        <div className="metric-card cursor-pointer hover:bg-muted/20 transition-colors" onClick={() => setShowTagsDialog(true)}><div className="space-y-2"><p className="text-sm font-medium text-muted-foreground">Unique Tags</p><p className="text-2xl font-bold">{uniqueTags}</p></div></div>
        <div className="metric-card"><div className="space-y-2"><p className="text-sm font-medium text-muted-foreground">CVEs with Patch Available</p><p className="text-2xl font-bold">{uniqueCVEsWithPatchAvailableCount}</p></div></div>
      </div>

      {/* Dialog for Unique Sources */}
      <Dialog open={showSourcesDialog} onOpenChange={setShowSourcesDialog}>
        <DialogContent className="max-w-md max-h-[70vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Unique Sources</DialogTitle>
          </DialogHeader>
          <ul className="list-disc pl-6 space-y-1">
            {sourceOptions.length === 0 ? (
              <li className="text-muted-foreground">No sources found.</li>
            ) : (
              sourceOptions.map((src, idx) => (
                <li key={idx} className="break-all text-sm">{src}</li>
              ))
            )}
          </ul>
        </DialogContent>
      </Dialog>
      {/* Dialog for Unique Tags */}
      <Dialog open={showTagsDialog} onOpenChange={setShowTagsDialog}>
        <DialogContent className="max-w-md max-h-[70vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Unique Tags</DialogTitle>
          </DialogHeader>
          <ul className="list-disc pl-6 space-y-1">
            {tagOptions.length === 0 ? (
              <li className="text-muted-foreground">No tags found.</li>
            ) : (
              tagOptions.map((tag, idx) => (
                <li key={idx} className="break-all text-sm">{tag}</li>
              ))
            )}
          </ul>
        </DialogContent>
      </Dialog>

      {/* Patch Details Table */}
      <div className="chart-container">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">Patch Details</h3>
          <div className="flex items-center gap-2 ml-auto">
            {/* Show All Button */}
            <Button
              variant={showAll ? "default" : "outline"}
              size="sm"
              className="min-w-[90px]"
              onClick={() => { setShowAll(true); setFilterValue(''); }}
            >
              Show All
            </Button>
            {/* Filter Type Dropdown */}
            <div className="relative group">
              <Button
                variant={!showAll ? "outline" : "ghost"}
                size="sm"
                className="flex items-center gap-2 min-w-[130px]"
                onClick={e => { e.preventDefault(); setShowAll(false); }}
              >
                {filterType === 'cve' ? 'CVE' : filterType === 'tags' ? 'Tags' : filterType === 'sources' ? 'Sources' : 'Patch Status'}
                <ChevronDown className="h-4 w-4" />
              </Button>
              <div className="absolute right-0 mt-2 w-40 bg-background border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                <button className="w-full text-left px-4 py-2 text-sm hover:bg-muted" onClick={() => { setFilterType('cve'); setFilterValue(''); setShowAll(false); }}>CVE</button>
                <button className="w-full text-left px-4 py-2 text-sm hover:bg-muted" onClick={() => { setFilterType('tags'); setFilterValue(''); setShowAll(false); }}>Tags</button>
                <button className="w-full text-left px-4 py-2 text-sm hover:bg-muted" onClick={() => { setFilterType('sources'); setFilterValue(''); setShowAll(false); }}>Sources</button>
                <button className="w-full text-left px-4 py-2 text-sm hover:bg-muted" onClick={() => { setFilterType('patch_status'); setFilterValue(''); setShowAll(false); }}>Patch Status</button>
              </div>
            </div>
            {/* Filter Value Dropdown */}
            <div className="relative group">
              <Button
                variant={!showAll ? "outline" : "ghost"}
                size="sm"
                className="flex items-center gap-2 min-w-[130px]"
                onClick={e => e.preventDefault()}
                disabled={showAll}
              >
                {filterValue ? filterValue : `All ${filterType === 'cve' ? 'CVEs' : filterType === 'tags' ? 'Tags' : filterType === 'sources' ? 'Sources' : 'Patch Statuses'}`}
                <ChevronDown className="h-4 w-4" />
              </Button>
              {!showAll && (
                <div className="absolute right-0 mt-2 w-48 bg-background border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 max-h-60 overflow-y-auto">
                  <button className="w-full text-left px-4 py-2 text-sm hover:bg-muted" onClick={() => setFilterValue('')}>All</button>
                  {filterType === 'cve' && cveOptions.map(opt => (
                    <button key={opt} className="w-full text-left px-4 py-2 text-sm hover:bg-muted" onClick={() => setFilterValue(opt)}>{opt}</button>
                  ))}
                  {filterType === 'tags' && tagOptions.map(opt => (
                    <button key={opt} className="w-full text-left px-4 py-2 text-sm hover:bg-muted" onClick={() => setFilterValue(opt)}>{opt}</button>
                  ))}
                  {filterType === 'sources' && sourceOptions.map(opt => (
                    <button key={opt} className="w-full text-left px-4 py-2 text-sm hover:bg-muted" onClick={() => setFilterValue(opt)}>{opt}</button>
                  ))}
                  {filterType === 'patch_status' && patchStatusOptions.map(opt => (
                    <button key={opt} className="w-full text-left px-4 py-2 text-sm hover:bg-muted" onClick={() => setFilterValue(opt)}>{opt}</button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
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
              {paginatedPatchData?.map((item, index) => (
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
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-4">
              <Button size="sm" variant="outline" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>&lt; Prev</Button>
              <span className="text-sm">Page {currentPage} of {totalPages}</span>
              <Button size="sm" variant="outline" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next &gt;</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
