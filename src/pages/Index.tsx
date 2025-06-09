
import { Shield, FileText, Target, BarChart, AlertTriangle, Database, TrendingUp, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: FileText,
    title: "Excel Integration",
    description: "Loads vulnerability data from Excel files exported from security scanning tools"
  },
  {
    icon: Database,
    title: "CVE Enrichment",
    description: "Enriches vulnerability data with CVE information from the NVD API"
  },
  {
    icon: Target,
    title: "Smart Categorization",
    description: "Categorizes vulnerabilities by type, severity, and exploitability"
  },
  {
    icon: BarChart,
    title: "Risk Scoring",
    description: "Calculates risk scores based on multiple factors (CVSS, EPSS, VPR, KEV)"
  },
  {
    icon: AlertTriangle,
    title: "Critical Analysis",
    description: "Identifies critical vulnerabilities requiring immediate attention"
  },
  {
    icon: TrendingUp,
    title: "Advanced Reports",
    description: "Generates standard and enhanced Excel reports with visualizations"
  },
  {
    icon: CheckCircle,
    title: "JSON Export",
    description: "Exports analysis results in JSON format for integration with other systems"
  },
  {
    icon: Shield,
    title: "Comprehensive Insights",
    description: "Provides comprehensive insights for vulnerability prioritization"
  }
];

export default function Index() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleGetStarted = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Fixed Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Shield className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">InsightShield</h1>
                <p className="text-xs text-muted-foreground">Security Platform</p>
              </div>
            </div>
            <Button onClick={handleLogin} className="hover-scale">
              Login
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-fade-in">
            <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-6">
              <Shield className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              InsightShield
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Advanced Vulnerability Management & Risk Assessment Platform
            </p>
            <p className="text-lg text-muted-foreground mb-10 max-w-4xl mx-auto">
              Transform your security posture with intelligent vulnerability analysis, 
              automated risk scoring, and comprehensive reporting capabilities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={handleGetStarted}
                className="hover-scale animate-scale-in text-lg px-8 py-6"
              >
                Get Started
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="hover-scale animate-scale-in text-lg px-8 py-6"
                style={{ animationDelay: "0.2s" }}
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage vulnerabilities and assess risks effectively
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={feature.title} 
                className="hover-scale border-border/50 hover:border-primary/50 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-sm leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Why Choose InsightShield?
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10 mt-1">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Automated Risk Assessment</h3>
                    <p className="text-muted-foreground">
                      Automatically calculate and prioritize vulnerabilities based on multiple risk factors
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10 mt-1">
                    <BarChart className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Interactive Dashboards</h3>
                    <p className="text-muted-foreground">
                      Visualize your security posture with comprehensive charts and metrics
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/10 mt-1">
                    <Target className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Smart Prioritization</h3>
                    <p className="text-muted-foreground">
                      Focus on what matters most with intelligent vulnerability prioritization
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="animate-fade-in lg:animate-slide-in-right">
              <Card className="p-8 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-6">
                    <Shield className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Ready to Secure Your Infrastructure?</h3>
                  <p className="text-muted-foreground mb-6">
                    Join security teams worldwide who trust InsightShield for their vulnerability management needs.
                  </p>
                  <Button 
                    size="lg" 
                    onClick={handleGetStarted}
                    className="hover-scale w-full"
                  >
                    Start Your Analysis
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold">InsightShield</span>
          </div>
          <p className="text-muted-foreground">
            Advanced Vulnerability Management & Risk Assessment Platform
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            © 2024 InsightShield. Securing your digital infrastructure.
          </p>
        </div>
      </footer>
    </div>
  );
}
