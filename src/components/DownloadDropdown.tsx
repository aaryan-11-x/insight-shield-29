import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface DownloadDropdownProps {
  onDownloadExcel: () => void;
  onDownloadPDF: () => void;
  buttonText: string;
}

export function DownloadDropdown({ onDownloadExcel, onDownloadPDF, buttonText }: DownloadDropdownProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleExcelDownload = async () => {
    try {
      setIsLoading(true);
      const instanceId = localStorage.getItem('currentInstanceId');
      const runId = localStorage.getItem('currentRunId');

      if (!instanceId || !runId) {
        throw new Error('Instance ID or Run ID not found');
      }

      const response = await fetch(`http://192.168.89.143:8000/api/v1/download/${instanceId}/${runId}`);
      
      if (!response.ok) {
        throw new Error('Failed to download file');
      }

      // Get the redirect URL from the response
      const fileUrl = response.url;
      
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = `vulnerability-report-${runId}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Failed to download file. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center">
      <Button 
        onClick={handleExcelDownload}
        disabled={isLoading}
        className="flex items-center gap-2 rounded-r-none"
      >
        {isLoading ? 'Downloading...' : buttonText}
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            className="h-10 px-2 rounded-l-none border-l-0"
            disabled={isLoading}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleExcelDownload}>
            Download Excel
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onDownloadPDF}>
            Download PDF
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
