import { Shield, FileText, Target, BarChart, AlertTriangle, Database, TrendingUp, CheckCircle, ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const features = [
  {
    icon: FileText,
    title: "Excel Integration",
    description: "Seamlessly import vulnerability data from Excel files with intelligent parsing",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: Database,
    title: "CVE Enrichment",
    description: "Real-time CVE data enrichment from NVD API with automatic updates",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: Target,
    title: "Smart Categorization",
    description: "AI-powered vulnerability categorization by type, severity, and exploitability",
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: BarChart,
    title: "Risk Scoring",
    description: "Multi-factor risk assessment using CVSS, EPSS, VPR, and KEV data",
    color: "from-orange-500 to-red-500"
  },
  {
    icon: AlertTriangle,
    title: "Critical Analysis",
    description: "Intelligent identification of critical vulnerabilities requiring immediate action",
    color: "from-red-500 to-pink-500"
  },
  {
    icon: TrendingUp,
    title: "Advanced Reports",
    description: "Comprehensive Excel reports with interactive visualizations and insights",
    color: "from-indigo-500 to-purple-500"
  },
  {
    icon: CheckCircle,
    title: "JSON Export",
    description: "Flexible JSON export for seamless integration with existing systems",
    color: "from-teal-500 to-cyan-500"
  },
  {
    icon: Shield,
    title: "Comprehensive Insights",
    description: "Deep vulnerability analysis with actionable prioritization recommendations",
    color: "from-amber-500 to-orange-500"
  }
];

export default function Index() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleLogin = () => {
    navigate("/login");
  };

  const handleGetStarted = () => {
    navigate("/login");
  };

  const handleWatchDemo = () => {
    window.open("https://drive.google.com/file/d/12SJiNiCh-1s1zZA5rPKGaEdJIMCY3lbq/view?usp=drive_link", "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-emerald-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Fixed Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  InsightShield
                </h1>
                <p className="text-xs text-slate-400">KPMG Internal Platform</p>
              </div>
            </div>
            <Button 
              onClick={handleLogin} 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Login
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className={`space-y-8 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full border border-blue-500/30">
                  <Zap className="h-4 w-4 text-blue-400" />
                  <span className="text-sm font-medium text-blue-300">KPMG Internal Security Platform</span>
                </div>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                    Advanced Vulnerability
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Management
                  </span>
                </h1>
                <p className="text-xl text-slate-300 leading-relaxed">
                  Transform your security posture with AI-powered vulnerability analysis, 
                  automated risk scoring, and comprehensive reporting capabilities.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  onClick={handleGetStarted}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
                >
                  Access Platform
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={handleWatchDemo}
                  className="border-2 border-slate-600 hover:border-blue-500 hover:bg-slate-800 transition-all duration-300 hover:scale-105 text-slate-300"
                >
                  Watch Demo
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">99.9%</div>
                  <div className="text-sm text-slate-400">Detection Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">24/7</div>
                  <div className="text-sm text-slate-400">Monitoring</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">10x</div>
                  <div className="text-sm text-slate-400">Faster Analysis</div>
                </div>
              </div>
            </div>

            {/* Right Content - Mockup */}
            <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="relative w-full h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 shadow-2xl border border-slate-700">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                  <div className="text-xs text-slate-400">InsightShield Dashboard</div>
                </div>
                
                {/* Content Grid */}
                <div className="grid grid-cols-3 gap-3 h-48">
                  {/* Chart 1 */}
                  <div className="bg-slate-700/50 rounded-lg p-2 border border-slate-600">
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <div className="text-xs text-slate-400">Risk Score</div>
                    </div>
                    <div className="space-y-1">
                      {[60, 80, 45, 90, 70].map((height, i) => (
                        <div 
                          key={i}
                          className="bg-gradient-to-t from-blue-500 to-blue-400 rounded-sm animate-pulse"
                          style={{ height: `${height * 0.3}px`, animationDelay: `${i * 0.1}s` }}
                        ></div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Chart 2 */}
                  <div className="bg-slate-700/50 rounded-lg p-2 border border-slate-600">
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <div className="text-xs text-slate-400">Vulnerabilities</div>
                    </div>
                    <div className="relative h-20">
                      <svg className="w-full h-full" viewBox="0 0 100 50">
                        <path 
                          d="M0,40 L20,30 L40,35 L60,20 L80,25 L100,15" 
                          stroke="#10b981" 
                          strokeWidth="2" 
                          fill="none"
                          className="animate-dash"
                        />
                        <circle cx="20" cy="30" r="2" fill="#10b981" className="animate-ping" />
                        <circle cx="60" cy="20" r="2" fill="#10b981" className="animate-ping" style={{ animationDelay: '0.5s' }} />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Chart 3 */}
                  <div className="bg-slate-700/50 rounded-lg p-2 border border-slate-600">
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <div className="text-xs text-slate-400">Severity</div>
                    </div>
                    <div className="flex items-end justify-around h-20">
                      <div className="w-3 bg-red-500 rounded-t-sm animate-pulse" style={{ height: '60%' }}></div>
                      <div className="w-3 bg-orange-500 rounded-t-sm animate-pulse" style={{ height: '80%', animationDelay: '0.2s' }}></div>
                      <div className="w-3 bg-yellow-500 rounded-t-sm animate-pulse" style={{ height: '40%', animationDelay: '0.4s' }}></div>
                      <div className="w-3 bg-green-500 rounded-t-sm animate-pulse" style={{ height: '20%', animationDelay: '0.6s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full border border-emerald-500/30">
              <Target className="h-4 w-4 text-emerald-400" />
              <span className="text-sm font-medium text-emerald-300">Powerful Features</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Everything You Need
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Comprehensive vulnerability management tools designed for KPMG security teams
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={feature.title} 
                className="group hover:shadow-2xl border-slate-700 bg-slate-800/50 backdrop-blur-sm hover:bg-slate-800/80 transition-all duration-500 hover:scale-105 cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-lg font-semibold text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-sm leading-relaxed text-slate-400">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full border border-orange-500/30">
                  <CheckCircle className="h-4 w-4 text-orange-400" />
                  <span className="text-sm font-medium text-orange-300">Why Choose InsightShield</span>
                </div>
                <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  Trusted by KPMG Security Teams
                </h2>
                <p className="text-xl text-slate-400">
                  Join KPMG security professionals who rely on InsightShield for their vulnerability management needs.
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4 group">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-white mb-2">Real-time Monitoring</h3>
                    <p className="text-slate-400">
                      Continuous vulnerability scanning with instant alerts and automated response capabilities
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 group">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                    <BarChart className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-white mb-2">Advanced Analytics</h3>
                    <p className="text-slate-400">
                      Deep insights with machine learning-powered risk assessment and trend analysis
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 group">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-white mb-2">Enterprise Security</h3>
                    <p className="text-slate-400">
                      Role-based access control with seamless team collaboration and workflow management
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-3xl blur-3xl"></div>
              <Card className="relative p-8 bg-slate-800/80 backdrop-blur-sm border-slate-700 shadow-2xl">
                <div className="text-center space-y-6">
                  <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4">Ready to Secure Your Infrastructure?</h3>
                    <p className="text-slate-400 mb-6">
                      Access the platform and experience the power of next-generation vulnerability management.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <Button 
                      size="lg" 
                      onClick={handleGetStarted}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                      Access Platform
                    </Button>
                    <p className="text-xs text-slate-500">KPMG Internal Security Platform</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              InsightShield
            </span>
          </div>
          <p className="text-slate-400 mb-2">
            Advanced Vulnerability Management & Risk Assessment Platform
          </p>
          <p className="text-sm text-slate-500">
            © 2024 KPMG. Internal security platform for vulnerability management and risk assessment.
          </p>
        </div>
      </footer>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: 0;
          }
        }
        .animate-dash {
          stroke-dasharray: 10;
          stroke-dashoffset: 10;
          animation: dash 2s linear infinite;
        }
      `}</style>
    </div>
  );
}
