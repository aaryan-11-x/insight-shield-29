
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function Questionnaire() {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({
    scanningTool: "",
    dataFormat: "",
    reportingNeeds: "",
    teamSize: ""
  });

  const handleSubmit = () => {
    console.log("Questionnaire answers:", answers);
    navigate("/instance-choice");
  };

  const isComplete = Object.values(answers).every(answer => answer !== "");

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Security Assessment Questionnaire</CardTitle>
            <CardDescription>
              Help us understand your security scanning needs to provide the best experience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Scanning Tool */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Which vulnerability scanning tool do you primarily use?</Label>
              <RadioGroup 
                value={answers.scanningTool} 
                onValueChange={(value) => setAnswers({...answers, scanningTool: value})}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="nessus" id="nessus" />
                  <Label htmlFor="nessus">Nessus</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="openvas" id="openvas" />
                  <Label htmlFor="openvas">OpenVAS</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="qualys" id="qualys" />
                  <Label htmlFor="qualys">Qualys VMDR</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="rapid7" id="rapid7" />
                  <Label htmlFor="rapid7">Rapid7 InsightVM</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other">Other</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Data Format */}
            <div className="space-y-3">
              <Label className="text-base font-medium">What format do you typically export vulnerability data in?</Label>
              <RadioGroup 
                value={answers.dataFormat} 
                onValueChange={(value) => setAnswers({...answers, dataFormat: value})}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="excel" id="excel" />
                  <Label htmlFor="excel">Excel (.xlsx/.xls)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="csv" id="csv" />
                  <Label htmlFor="csv">CSV</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="xml" id="xml" />
                  <Label htmlFor="xml">XML</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="json" id="json" />
                  <Label htmlFor="json">JSON</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Reporting Needs */}
            <div className="space-y-3">
              <Label className="text-base font-medium">What type of reports do you need most?</Label>
              <RadioGroup 
                value={answers.reportingNeeds} 
                onValueChange={(value) => setAnswers({...answers, reportingNeeds: value})}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="executive" id="executive" />
                  <Label htmlFor="executive">Executive Summary</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="technical" id="technical" />
                  <Label htmlFor="technical">Technical Details</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="compliance" id="compliance" />
                  <Label htmlFor="compliance">Compliance Reports</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="all" />
                  <Label htmlFor="all">All of the above</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Team Size */}
            <div className="space-y-3">
              <Label className="text-base font-medium">What's the size of your security team?</Label>
              <RadioGroup 
                value={answers.teamSize} 
                onValueChange={(value) => setAnswers({...answers, teamSize: value})}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1-5" id="small" />
                  <Label htmlFor="small">1-5 people</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="6-15" id="medium" />
                  <Label htmlFor="medium">6-15 people</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="16-50" id="large" />
                  <Label htmlFor="large">16-50 people</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="50+" id="enterprise" />
                  <Label htmlFor="enterprise">50+ people</Label>
                </div>
              </RadioGroup>
            </div>

            <Button 
              onClick={handleSubmit}
              disabled={!isComplete}
              className="w-full"
            >
              Continue
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
