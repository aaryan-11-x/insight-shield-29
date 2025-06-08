import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { Server, Shield, AlertTriangle, ArrowLeft } from "lucide-react";

const instances = [
  {
    id: "prod-env",
    name: "Production Environment",
    description: "Main production infrastructure with critical systems",
    status: "active",
    vulnerabilities: 1247,
    riskLevel: "high",
    lastScan: "2 hours ago"
  },
  {
    id: "staging-env",
    name: "Staging Environment", 
    description: "Pre-production testing environment",
    status: "active",
    vulnerabilities: 456,
    riskLevel: "medium",
    lastScan: "6 hours ago"
  },
  {
    id: "dev-env",
    name: "Development Environment",
    description: "Development and testing infrastructure",
    status: "active",
    vulnerabilities: 234,
    riskLevel: "low",
    lastScan: "12 hours ago"
  }
];

export default function SelectInstance() {
  const [selectedInstance, setSelectedInstance] = useState("");
  const navigate = useNavigate();

  const handleContinue = () => {
    if (selectedInstance) {
      navigate("/");
    }
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
              Choose the environment instance you want to analyze
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={selectedInstance} onValueChange={setSelectedInstance}>
              <div className="grid gap-4">
                {instances.map((instance) => (
                  <div key={instance.id} className="relative">
                    <RadioGroupItem 
                      value={instance.id} 
                      id={instance.id}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={instance.id}
                      className="flex cursor-pointer rounded-lg border-2 border-muted p-4 hover:bg-accent peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <div className="flex items-start gap-4 w-full">
                        <div className="mt-1">
                          {getRiskIcon(instance.riskLevel)}
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold">{instance.name}</h3>
                            <Badge variant={instance.status === "active" ? "default" : "secondary"}>
                              {instance.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{instance.description}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <span className={`font-medium ${getRiskColor(instance.riskLevel)}`}>
                              {instance.vulnerabilities} vulnerabilities
                            </span>
                            <span className="text-muted-foreground">
                              Last scan: {instance.lastScan}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>

            <Button 
              onClick={handleContinue}
              disabled={!selectedInstance}
              className="w-full mt-6"
            >
              Continue to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
