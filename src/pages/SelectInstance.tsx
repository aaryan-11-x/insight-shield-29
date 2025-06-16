import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { Server, Shield, AlertTriangle, ArrowLeft, Upload, Pencil } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

interface Instance {
  id: number;
  instance_id: `${string}-${string}-${string}-${string}-${string}`;
  name: string;
  description: string;
  status: string;
  created_at: string;
  runs?: Run[];
}

interface Run {
  id: number;
  run_id: string;
  scan_date: string;
  status: string;
}

export default function SelectInstance() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedInstance, setSelectedInstance] = useState<string>("");
  const [selectedRun, setSelectedRun] = useState<string>("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingInstance, setEditingInstance] = useState<Instance | null>(null);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const { data: instances, isLoading } = useQuery({
    queryKey: ['instances'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('instances')
        .select(`
          *,
          runs (
            id,
            run_id,
            scan_date,
            status
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching instances:', error);
        throw error;
      }
      
      // Sort runs for each instance by scan_date in descending order
      return (data as any[]).map((instance) => ({
        ...instance,
        runs: instance.runs?.sort((a: Run, b: Run) => 
          new Date(b.scan_date).getTime() - new Date(a.scan_date).getTime()
        )
      })) as Instance[];
    }
  });

  const updateInstanceMutation = useMutation({
    mutationFn: async ({ instanceId, name, description }: { instanceId: string, name: string, description: string }) => {
      const { error } = await supabase
        .from('instances')
        .update({ name, description })
        .eq('instance_id', instanceId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instances'] });
      toast({
        title: "Success",
        description: "Instance updated successfully",
      });
      setIsEditDialogOpen(false);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update instance",
      });
    }
  });

  const handleEdit = (instance: Instance, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingInstance(instance);
    setNewName(instance.name);
    setNewDescription(instance.description);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (editingInstance && newName.trim()) {
      updateInstanceMutation.mutate({
        instanceId: editingInstance.instance_id,
        name: newName.trim(),
        description: newDescription.trim()
      });
    }
  };

  const handleSelect = () => {
    if (selectedInstance && selectedRun) {
      // Store both IDs in localStorage
      localStorage.setItem('currentInstanceId', selectedInstance);
      localStorage.setItem('currentRunId', selectedRun);
      navigate("/dashboard");
    }
  };

  const handleUploadNewRun = (instanceId: string) => {
    localStorage.setItem('currentInstanceId', instanceId);
    navigate("/upload-vulnerabilities");
  };

  const handleBack = () => {
    navigate("/instance-choice");
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high": return "text-red-400";
      case "medium": return "text-yellow-400";
      case "low": return "text-green-400";
      default: return "text-gray-400";
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case "high": return <AlertTriangle className="h-5 w-5 text-red-400" />;
      case "medium": return <Shield className="h-5 w-5 text-yellow-400" />;
      case "low": return <Shield className="h-5 w-5 text-green-400" />;
      default: return <Server className="h-5 w-5 text-gray-400" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-center">Loading instances...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <Button 
          variant="ghost" 
          className="mb-6" 
          onClick={handleBack}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Instance Choice
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Select Instance</CardTitle>
            <CardDescription>
              Choose the environment instance and run you want to analyze
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {instances?.map((instance) => (
                <div 
                  key={instance.id} 
                  className="border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => {
                    if (instance.runs && instance.runs.length > 0) {
                      setSelectedInstance(instance.instance_id);
                      setSelectedRun(instance.runs[0].run_id);
                    }
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      {getRiskIcon(instance.status)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{instance.name}</h3>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => handleEdit(instance, e)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Badge variant={instance.status === "active" ? "default" : "secondary"}>
                            {instance.status}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">{instance.description}</p>
                      
                      {/* Runs */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium">Available Runs</h4>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent instance selection when clicking the button
                              handleUploadNewRun(instance.instance_id);
                            }}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Upload New Run
                          </Button>
                        </div>
                        <RadioGroup
                          value={selectedRun}
                          onValueChange={(runId) => {
                            setSelectedRun(runId);
                            setSelectedInstance(instance.instance_id);
                          }}
                          className="space-y-2"
                          onClick={(e) => e.stopPropagation()} // Prevent instance selection when clicking radio buttons
                        >
                          {instance.runs?.map((run, index, runs) => (
                            <div key={run.id} className="flex items-center space-x-2">
                              <RadioGroupItem
                                value={run.run_id}
                                id={run.run_id}
                              />
                              <Label
                                htmlFor={run.run_id}
                                className="text-sm"
                              >
                                Run from {new Date(run.scan_date).toLocaleString()}
                                {index === 0 && " (Latest)"}
                                {index === runs.length - 1 && " (Oldest)"}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Button 
              onClick={handleSelect}
              disabled={!selectedInstance || !selectedRun}
              className="w-full mt-6"
            >
              Continue to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Instance</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Instance Name</Label>
              <Input
                id="name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Enter instance name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Enter instance description"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={!newName.trim() || updateInstanceMutation.isPending}
            >
              {updateInstanceMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
