
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function CreateInstance() {
  const [instanceName, setInstanceName] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (instanceName.trim()) {
      // Store instance data (in a real app, this would be sent to a backend)
      console.log("Creating instance:", { instanceName, description });
      navigate("/upload-vulnerabilities");
    }
  };

  const handleBack = () => {
    navigate("/instance-choice");
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
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
            <CardTitle className="text-2xl font-bold">Create New Instance</CardTitle>
            <CardDescription>
              Set up a new vulnerability scanning instance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="instanceName">Instance Name *</Label>
                <Input
                  id="instanceName"
                  type="text"
                  placeholder="Enter instance name (e.g., Production Environment)"
                  value={instanceName}
                  onChange={(e) => setInstanceName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter a description for this instance..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="flex gap-4">
                <Button type="button" variant="outline" onClick={handleBack} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" disabled={!instanceName.trim()} className="flex-1">
                  Create Instance
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
