
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Dashboard from "./pages/Dashboard";
import Prioritization from "./pages/Prioritization";
import Exploitability from "./pages/Exploitability";
import Remediation from "./pages/Remediation";
import Clustering from "./pages/Clustering";
import CVESummary from "./pages/CVESummary";
import EOLComponents from "./pages/EOLComponents";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
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
                  <Route path="/remediation" element={<Remediation />} />
                  <Route path="/clustering" element={<Clustering />} />
                  <Route path="/cve-summary" element={<CVESummary />} />
                  <Route path="/eol-components" element={<EOLComponents />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </main>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
