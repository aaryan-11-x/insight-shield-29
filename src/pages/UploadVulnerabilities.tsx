import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { Upload, FileSpreadsheet, CheckCircle, ArrowLeft } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { supabase } from "@/integrations/supabase/client";

interface AnalysisResponse {
  status: 'success' | 'error';
  message: string;
  output_files: {
    standard_report: string;
    enhanced_workbook: string;
    json_results: string;
  };
  completed: boolean;
  redirect: boolean;
}

export default function UploadVulnerabilities() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const steps = [
    "Uploading file...",
    "Analyzing vulnerabilities...",
    "Processing CVE data...",
    "Generating tables...",
    "Creating charts...",
    "Preparing Dashboard page...",
    "Preparing IP Insights page...",
    "Preparing Ageing of CVE page...",
    "Preparing Most Exploitable Hosts page...",
    "Preparing Remediation Insights page...",
    "Preparing Remediation By Unique Vulnerabilities page...",
    "Preparing Patch Details page...",
    "Preparing MTTM by Severity page...",
    "Preparing Prioritization Insights page...",
    "Preparing Unique Vulnerabilities page...",
    "Preparing Risk Summary page...",
    "Preparing CVE Summary page...",
    "Preparing Hosts Summary page...",
    "Preparing SEoL Components page...",
    "Preparing EOL IPs page...",
    "Preparing EOL Versions page...",
    "Preparing final report...",
    "Almost done..."
  ];

  useEffect(() => {
    let stepIndex = 0;
    let interval: NodeJS.Timeout;
    let progressInterval: NodeJS.Timeout;

    if (isUploading) {
      // Calculate interval based on total steps and expected duration
      const totalDuration = 100000; // 100 seconds in milliseconds
      const intervalTime = Math.floor(totalDuration / steps.length);
      
      interval = setInterval(() => {
        setCurrentStep(steps[stepIndex]);
        stepIndex = (stepIndex + 1) % steps.length;
      }, intervalTime);

      // Start analysis progress after upload completes
      progressInterval = setInterval(() => {
        if (uploadProgress === 100 && !isAnalyzing) {
          setIsAnalyzing(true);
          setAnalysisProgress(0);
        }
        
        if (isAnalyzing && analysisProgress < 100) {
          setAnalysisProgress(prev => {
            const newProgress = prev + (100 / (totalDuration / 1000));
            return newProgress > 100 ? 100 : newProgress;
          });
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [isUploading, uploadProgress, isAnalyzing]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const xhr = new XMLHttpRequest();
      
      // Get instance ID from localStorage
      const instanceId = localStorage.getItem('currentInstanceId');
      
      if (!instanceId) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No instance ID found. Please create an instance first.",
          action: <ToastAction altText="Go to instance creation" onClick={() => navigate("/create-instance")}>Create Instance</ToastAction>,
        });
        return;
      }

      // Create a new run first
      const { data: runData, error: runError } = await supabase
        .from('runs')
        .insert([
          {
            instance_id: instanceId,
            status: 'active',
            scan_date: new Date().toISOString()
          }
        ])
        .select();

      if (runError) {
        console.error('Error creating run:', runError);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to create run. Please try again.",
        });
        setIsUploading(false);
        return;
      }

      // Store the run ID
      if (!runData || !runData[0]) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to create run. Please try again.",
        });
        setIsUploading(false);
        return;
      }

      const runId = runData[0].run_id;
      localStorage.setItem('currentRunId', runId);
      
      // Create a promise to handle the XHR request
      const uploadPromise = new Promise<AnalysisResponse>((resolve, reject) => {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = (event.loaded / event.total) * 100;
            setUploadProgress(Math.round(progress));
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              console.log('Raw response:', xhr.responseText); // Log the raw response
              const response = JSON.parse(xhr.responseText) as AnalysisResponse;
              if (response.status === 'success' && response.redirect) {
                resolve(response);
              } else {
                reject(new Error('Analysis completed but redirection failed'));
              }
            } catch (parseError) {
              console.error('JSON Parse Error:', parseError);
              console.error('Response Text:', xhr.responseText);
              toast({
                variant: "destructive",
                title: "Error",
                description: "Invalid response from server. Please try again.",
              });
              reject(new Error('Invalid JSON response from server'));
            }
          } else {
            console.error('Server Error:', xhr.status, xhr.responseText);
            toast({
              variant: "destructive",
              title: "Server Error",
              description: `Server returned error: ${xhr.status}`,
            });
            reject(new Error(`Server error: ${xhr.status} - ${xhr.responseText}`));
          }
        });

        xhr.addEventListener('error', () => {
          console.error('Network Error:', xhr.status, xhr.responseText);
          toast({
            variant: "destructive",
            title: "Network Error",
            description: "Failed to connect to the server. Please check your internet connection and try again.",
            action: <ToastAction altText="Try again" onClick={() => handleUpload()}>Try Again</ToastAction>,
          });
          reject(new Error('Network error occurred'));
        });

        xhr.addEventListener('abort', () => {
          console.error('Request Aborted');
          toast({
            variant: "destructive",
            title: "Upload Cancelled",
            description: "The file upload was cancelled.",
          });
          reject(new Error('Request was aborted'));
        });
      });

      xhr.open('POST', 'http://192.168.89.143:8000/api/v1/analyze');
      // Add the instance ID and run ID headers
      xhr.setRequestHeader('X-Current-Instance-Id', instanceId);
      xhr.setRequestHeader('X-Current-Run-Id', runId);
      
      // Add Authorization header with Bearer token
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        xhr.setRequestHeader('Authorization', `Bearer ${session.access_token}`);
        console.log('Added Authorization header with Bearer token');
      } else {
        console.warn('No access token available for API request');
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "No authentication token available. Please log in again.",
        });
        setIsUploading(false);
        return;
      }
      
      console.log('Sending request with headers:', {
        'X-Current-Instance-Id': instanceId,
        'X-Current-Run-Id': runId,
        'Authorization': 'Bearer [TOKEN]' // Don't log the actual token
      });
      
      xhr.send(formData);

      const result = await uploadPromise;
      console.log('Analysis result:', result);
      
      // Store the analysis results in localStorage or state management
      localStorage.setItem('analysisResults', JSON.stringify(result));
      
      // Set progress to 100% before redirecting
      setUploadProgress(100);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Small delay to show 100%
      
      // Show success toast
      toast({
        title: "Success",
        description: "File uploaded and analyzed successfully!",
      });
      
      // Ensure we're in a valid state before redirecting
      if (result.status === 'success' && result.redirect) {
        navigate("/dashboard", { replace: true });
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setIsUploading(false);
    }
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

            {isUploading && (
              <div className="space-y-4">
                {uploadProgress < 100 ? (
                  <>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Upload Progress</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} className="h-2" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Analysis Progress</span>
                        <span>{Math.round(analysisProgress)}%</span>
                      </div>
                      <Progress value={analysisProgress} className="h-2" />
                    </div>
                  </>
                )}
                <p className="text-sm text-muted-foreground text-center animate-pulse">
                  {currentStep}
                </p>
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
                {isUploading ? "Processing..." : "Upload & Continue"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
