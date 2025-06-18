import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PublicRoute } from "@/components/PublicRoute";
import { UserInfoHeader } from "@/components/UserInfoHeader";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Questionnaire from "./pages/Questionnaire";
import InstanceChoice from "./pages/InstanceChoice";
import CreateInstance from "./pages/CreateInstance";
import UploadVulnerabilities from "./pages/UploadVulnerabilities";
import SelectInstance from "./pages/SelectInstance";
import Dashboard from "./pages/Dashboard";
import Prioritization from "./pages/Prioritization";
import Exploitability from "./pages/Exploitability";
import VulnerabilityAging from "./pages/VulnerabilityAging";
import MostExploitable from "./pages/MostExploitable";
import Remediation from "./pages/Remediation";
import RemediationUnique from "./pages/RemediationUnique";
import PatchDetails from "./pages/PatchDetails";
import MTTMSeverity from "./pages/MTTMSeverity";
import IPInsights from "./pages/IPInsights";
import Clustering from "./pages/Clustering";
import UniqueVulnerabilities from "./pages/UniqueVulnerabilities";
import RiskSummary from "./pages/RiskSummary";
import CVESummary from "./pages/CVESummary";
import HostsSummary from "./pages/HostsSummary";
import RiskTrajectory from "./pages/RiskTrajectory";
import EOLSummary from "./pages/EOLSummary";
import EOLIPs from "./pages/EOLIPs";
import EOLVersions from "./pages/EOLVersions";
import EOLComponents from "./pages/EOLComponents";
import Assets from "./pages/Assets";
import NotFound from "./pages/NotFound";
import AccessManagement from "./pages/AccessManagement";
import RemediationDependencies from "./pages/RemediationDependencies";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<PublicRoute><Index /></PublicRoute>} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/questionnaire" element={<ProtectedRoute><Questionnaire /></ProtectedRoute>} />
            <Route path="/instance-choice" element={<ProtectedRoute><InstanceChoice /></ProtectedRoute>} />
            <Route path="/create-instance" element={<ProtectedRoute requireSuperuser><CreateInstance /></ProtectedRoute>} />
            <Route path="/upload-vulnerabilities" element={<ProtectedRoute requireSuperuser><UploadVulnerabilities /></ProtectedRoute>} />
            <Route path="/select-instance" element={<ProtectedRoute><SelectInstance /></ProtectedRoute>} />
            <Route path="/dashboard/*" element={
              <ProtectedRoute>
                <SidebarProvider>
                  <div className="min-h-screen flex w-full">
                    <AppSidebar />
                    <main className="flex-1 flex flex-col">
                      <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between gap-x-4 border-b border-border bg-background px-4 shadow-sm">
                        <SidebarTrigger />
                        <UserInfoHeader />
                      </div>
                      <div className="flex-1 p-6">
                        <Routes>
                          <Route path="/" element={<Dashboard />} />
                          <Route path="/access-management" element={<ProtectedRoute requireSuperuser><AccessManagement /></ProtectedRoute>} />
                          <Route path="/remediation-dependencies" element={<RemediationDependencies />} />
                          <Route path="/prioritization" element={<Prioritization />} />
                          <Route path="/exploitability" element={<Exploitability />} />
                          <Route path="/vulnerability-aging" element={<VulnerabilityAging />} />
                          <Route path="/most-exploitable" element={<MostExploitable />} />
                          <Route path="/remediation" element={<Remediation />} />
                          <Route path="/remediation-unique" element={<RemediationUnique />} />
                          <Route path="/patch-details" element={<PatchDetails />} />
                          <Route path="/mttm-severity" element={<MTTMSeverity />} />
                          <Route path="/ip-insights" element={<IPInsights />} />
                          <Route path="/clustering" element={<Clustering />} />
                          <Route path="/unique-vulnerabilities" element={<UniqueVulnerabilities />} />
                          <Route path="/risk-summary" element={<RiskSummary />} />
                          <Route path="/cve-summary" element={<CVESummary />} />
                          <Route path="/hosts-summary" element={<HostsSummary />} />
                          <Route path="/risk-trajectory" element={<RiskTrajectory />} />
                          <Route path="/eol-summary" element={<EOLSummary />} />
                          <Route path="/eol-components" element={<EOLComponents />} />
                          <Route path="/eol-ips" element={<EOLIPs />} />
                          <Route path="/eol-versions" element={<EOLVersions />} />
                          <Route path="/assets" element={<Assets />} />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </div>
                    </main>
                  </div>
                </SidebarProvider>
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
