
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Login from "./pages/Login";
import Questionnaire from "./pages/Questionnaire";
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
import Clustering from "./pages/Clustering";
import CVESummary from "./pages/CVESummary";
import EOLComponents from "./pages/EOLComponents";
import Assets from "./pages/Assets";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/questionnaire" element={<Questionnaire />} />
          <Route path="/select-instance" element={<SelectInstance />} />
          <Route path="/*" element={
            <SidebarProvider>
              <div className="min-h-screen flex w-full">
                <AppSidebar />
                <main className="flex-1 flex flex-col">
                  <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-border bg-background px-4 shadow-sm">
                    <SidebarTrigger />
                  </div>
                  <div className="flex-1 p-6">
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/prioritization" element={<Prioritization />} />
                      <Route path="/exploitability" element={<Exploitability />} />
                      <Route path="/vulnerability-aging" element={<VulnerabilityAging />} />
                      <Route path="/most-exploitable" element={<MostExploitable />} />
                      <Route path="/remediation" element={<Remediation />} />
                      <Route path="/remediation-unique" element={<RemediationUnique />} />
                      <Route path="/patch-details" element={<PatchDetails />} />
                      <Route path="/mttm-severity" element={<MTTMSeverity />} />
                      <Route path="/clustering" element={<Clustering />} />
                      <Route path="/cve-summary" element={<CVESummary />} />
                      <Route path="/eol-components" element={<EOLComponents />} />
                      <Route path="/assets" element={<Assets />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </div>
                </main>
              </div>
            </SidebarProvider>
          } />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
