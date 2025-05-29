
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";

const questions = [
  {
    id: "organization-size",
    question: "What is the size of your organization?",
    options: [
      { value: "small", label: "Small (1-50 employees)" },
      { value: "medium", label: "Medium (51-500 employees)" },
      { value: "large", label: "Large (500+ employees)" }
    ]
  },
  {
    id: "industry",
    question: "What industry does your organization operate in?",
    options: [
      { value: "healthcare", label: "Healthcare" },
      { value: "finance", label: "Financial Services" },
      { value: "technology", label: "Technology" },
      { value: "retail", label: "Retail" },
      { value: "other", label: "Other" }
    ]
  },
  {
    id: "security-maturity",
    question: "How would you rate your current security maturity?",
    options: [
      { value: "basic", label: "Basic - Limited security measures" },
      { value: "intermediate", label: "Intermediate - Some security processes" },
      { value: "advanced", label: "Advanced - Comprehensive security program" }
    ]
  }
];

export default function Questionnaire() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [additionalInfo, setAdditionalInfo] = useState("");
  const navigate = useNavigate();

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Questionnaire answers:", answers, additionalInfo);
    navigate("/select-instance");
  };

  const isComplete = questions.every(q => answers[q.id]);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Security Assessment Questionnaire</CardTitle>
            <CardDescription>
              Help us understand your organization to provide better vulnerability insights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {questions.map((question) => (
                <div key={question.id} className="space-y-4">
                  <Label className="text-base font-medium">{question.question}</Label>
                  <RadioGroup
                    value={answers[question.id] || ""}
                    onValueChange={(value) => handleAnswerChange(question.id, value)}
                  >
                    {question.options.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={option.value} />
                        <Label htmlFor={option.value}>{option.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              ))}

              <div className="space-y-2">
                <Label htmlFor="additional-info">Additional Information (Optional)</Label>
                <Textarea
                  id="additional-info"
                  placeholder="Any specific security concerns or requirements..."
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                />
              </div>

              <Button type="submit" disabled={!isComplete} className="w-full">
                Continue to Instance Selection
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
