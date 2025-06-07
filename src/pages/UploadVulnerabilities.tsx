
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { Upload, FileSpreadsheet, CheckCircle, ArrowLeft } from "lucide-react";

export default function UploadVulnerabilities() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    
    // Simulate file upload
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log("Uploading file:", selectedFile.name);
    setIsUploading(false);
    
    // Redirect to dashboard after successful upload
    navigate("/");
  };

  const handleBack = () => {
    navigate("/create-instance");
  };

  const isExcelFile = selectedFile && (
    selectedFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    selectedFile.type === "application/vnd.ms-excel" ||
    selectedFile.name.endsWith('.xlsx') ||
    selectedFile.name.endsWith('.xls')
  );

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        <Button 
          variant="ghost" 
          className="mb-6" 
          onClick={handleBack}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Instance Creation
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Upload Vulnerability Data</CardTitle>
            <CardDescription>
              Upload an Excel file containing vulnerability scan results
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
              <div className="flex flex-col items-center space-y-4">
                <div className="rounded-full bg-muted p-4">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <Label htmlFor="file-upload" className="cursor-pointer">
                    <span className="text-lg font-medium">Choose Excel file</span>
                    <p className="text-sm text-muted-foreground mt-1">
                      Supported formats: .xlsx, .xls
                    </p>
                  </Label>
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            {selectedFile && (
              <div className="flex items-center gap-3 p-4 border rounded-lg bg-muted/20">
                {isExcelFile ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <FileSpreadsheet className="h-5 w-5 text-muted-foreground" />
                )}
                <div className="flex-1">
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-3 text-sm text-muted-foreground">
              <h4 className="font-medium text-foreground">File Requirements:</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Excel format (.xlsx or .xls)</li>
                <li>Maximum file size: 50MB</li>
                <li>Should contain vulnerability scan data</li>
                <li>Include columns for CVE IDs, severity levels, and affected hosts</li>
              </ul>
            </div>

            <div className="flex gap-4">
              <Button type="button" variant="outline" onClick={handleBack} className="flex-1">
                Back
              </Button>
              <Button 
                onClick={handleUpload} 
                disabled={!selectedFile || !isExcelFile || isUploading}
                className="flex-1"
              >
                {isUploading ? "Uploading..." : "Upload & Continue"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
