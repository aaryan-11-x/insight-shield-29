import { Shield, BarChart, Target, Wrench, Grid2x2, Database, FileText, Calendar, Users, TrendingUp, AlertTriangle, LogOut, RefreshCw, UserCog, Package, GitBranch, History } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Check, ChevronDown, Menu, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Outlet } from "react-router-dom";

const menuItems = [
  {
    title: "Access Management",
    url: "/dashboard/access-management",
    icon: UserCog,
  },
  {
    title: "Dashboard Overview",
    url: "/dashboard",
    icon: BarChart,
  },
  {
    title: "Inventory Details",
    url: "/dashboard/assets",
    icon: Package,
  },
  {
    title: "Prioritization Insights",
    url: "/dashboard/prioritization",
    icon: Target,
    subItems: [
      {
        title: "Overall Summary",
        url: "/dashboard/prioritization",
      },
      {
        title: "Exploitability Scoring",
        url: "/dashboard/exploitability",
      },
      {
        title: "Ageing of CVE",
        url: "/dashboard/vulnerability-aging",
      },
      {
        title: "Most Exploitable",
        url: "/dashboard/most-exploitable",
      },
    ],
  },
  {
    title: "Remediation Insights",
    url: "/dashboard/remediation",
    icon: Wrench,
    subItems: [
      {
        title: "Remediation Insights",
        url: "/dashboard/remediation",
      },
      {
        title: "Remediation-Unique Vulnerabilities",
        url: "/dashboard/remediation-unique",
      },
      {
        title: "Patch Details",
        url: "/dashboard/patch-details",
      },
      {
        title: "MTTM by Severity",
        url: "/dashboard/mttm-severity",
      },
    ],
  },
  {
    title: "Operational Insights",
    url: "/dashboard/operational",
    icon: Grid2x2,
    subItems: [
      {
        title: "IP Insights",
        url: "/dashboard/ip-insights",
      },
      {
        title: "Vulnerability Clustering",
        url: "/dashboard/clustering",
      },
      {
        title: "Unique Vulnerabilities",
        url: "/dashboard/unique-vulnerabilities",
      },
    ],
  },
  {
    title: "Management Insights",
    url: "/dashboard/management",
    icon: TrendingUp,
    subItems: [
      {
        title: "Risk Summary",
        url: "/dashboard/risk-summary",
      },
      {
        title: "CVE Summary",
        url: "/dashboard/cve-summary",
      },
      {
        title: "Hosts Summary",
        url: "/dashboard/hosts-summary",
      },
    ],
  },
  {
    title: "SEOL Insights",
    url: "/dashboard/seol",
    icon: AlertTriangle,
    subItems: [
      {
        title: "EoL Summary",
        url: "/dashboard/eol-summary",
      },
      {
        title: "EoL Components",
        url: "/dashboard/eol-components",
      },
      {
        title: "EOL IPs",
        url: "/dashboard/eol-ips",
      },
      {
        title: "EOL Versions",
        url: "/dashboard/eol-versions",
      },
    ],
  },
  {
    title: "Remediation Dependencies",
    url: "/dashboard/remediation-dependencies",
    icon: GitBranch,
  },
];

interface Run {
  id: number;
  run_id: string;
  instance_id: string;
  scan_date: string;
  status: string;
  created_at: string;
}

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  // Fetch runs for the current instance
  const { data: runs } = useQuery<Run[]>({
    queryKey: ['runs'],
    queryFn: async () => {
      const instanceId = localStorage.getItem('currentInstanceId');
      if (!instanceId) return [];

      const { data, error } = await supabase
        .from('runs')
        .select('*')
        .eq('instance_id', instanceId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching runs:', error);
        return [];
      }

      return data;
    }
  });

  const currentRunId = localStorage.getItem('currentRunId');

  const handleRunChange = (runId: string) => {
    localStorage.setItem('currentRunId', runId);
    // Refresh the page to update all queries
    window.location.reload();
  };

  const handleLogoutClick = () => {
    setShowLogoutDialog(true);
  };

  const handleLogoutConfirm = () => {
    // Clear instance and run IDs from localStorage
    localStorage.removeItem('currentInstanceId');
    localStorage.removeItem('currentRunId');
    setShowLogoutDialog(false);
    navigate("/login");
  };

  const handleLogoutCancel = () => {
    setShowLogoutDialog(false);
    // Stay on current page - don't navigate anywhere
  };

  const handleSelectInstance = () => {
    navigate("/select-instance");
  };

  return (
    <>
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col bg-background border-r transition-all duration-300",
        isOpen ? "w-64" : "w-16"
      )}>
        <Sidebar>
          <SidebarHeader className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Shield className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">InsightShield</h2>
                <p className="text-sm text-muted-foreground">Security Platform</p>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      {item.subItems ? (
                        <Collapsible>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton className="w-full flex items-center gap-3 px-3 py-2 text-left group">
                              <item.icon className="h-4 w-4" />
                              <span className="flex-1">{item.title}</span>
                              <ChevronRight className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-90" />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <SidebarMenuSub>
                              {item.subItems.map((subItem) => (
                                <SidebarMenuSubItem key={subItem.title}>
                                  <SidebarMenuSubButton
                                    isActive={location.pathname === subItem.url}
                                    onClick={() => navigate(subItem.url)}
                                    asChild
                                  >
                                    <button className="w-full text-left text-xs">
                                      {subItem.title}
                                    </button>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </Collapsible>
                      ) : (
                        <SidebarMenuButton 
                          asChild 
                          isActive={location.pathname === item.url}
                          onClick={() => navigate(item.url)}
                        >
                          <button className="w-full flex items-center gap-3 px-3 py-2 text-left">
                            <item.icon className="h-4 w-4" />
                            <span>{item.title}</span>
                          </button>
                        </SidebarMenuButton>
                      )}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="p-4 space-y-2">
            <div className="p-2 border-t space-y-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between px-3">
                    <div className="flex items-center gap-3">
                      <History className="h-4 w-4" />
                      <span>Change Run</span>
                    </div>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" side="right" className="w-[300px]">
                  {runs?.map((run, index) => (
                    <DropdownMenuItem
                      key={run.id}
                      onClick={() => handleRunChange(run.run_id)}
                      className="flex items-center justify-between"
                    >
                      <span className="truncate max-w-[220px]">
                        {new Date(run.created_at).toLocaleDateString()} - {run.run_id.slice(0, 8)}
                        {index === 0 && " (Latest)"}
                      </span>
                      {run.run_id === currentRunId && (
                        <Check className="h-4 w-4 ml-2" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="ghost"
                className="w-full justify-start gap-3 px-3"
                onClick={() => {
                  localStorage.removeItem('currentInstanceId');
                  localStorage.removeItem('currentRunId');
                  navigate('/select-instance');
                }}
              >
                <RefreshCw className="h-4 w-4" />
                <span>Select Another Instance</span>
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start gap-3 px-3"
                onClick={handleLogoutClick}
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Logout</DialogTitle>
              <DialogDescription>
                Are you sure you want to log out of InsightShield?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={handleLogoutCancel}>
                No
              </Button>
              <Button onClick={handleLogoutConfirm}>
                Yes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className={cn(
        "transition-all duration-300",
        isOpen ? "ml-64" : "ml-16"
      )}>
        <Outlet />
      </div>
    </>
  );
}
