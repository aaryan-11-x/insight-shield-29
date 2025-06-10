
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileText, FileSpreadsheet } from "lucide-react";

interface DownloadDropdownProps {
  onDownloadPDF?: () => void;
  onDownloadExcel?: () => void;
}

export function DownloadDropdown({ onDownloadPDF, onDownloadExcel }: DownloadDropdownProps) {
  const handleDownloadPDF = () => {
    console.log("Downloading PDF report...");
    if (onDownloadPDF) onDownloadPDF();
  };

  const handleDownloadExcel = () => {
    console.log("Downloading Excel sheet...");
    if (onDownloadExcel) onDownloadExcel();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Download Report
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleDownloadExcel}>
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Download Excel Sheet
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDownloadPDF}>
          <FileText className="h-4 w-4 mr-2" />
          Download PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
