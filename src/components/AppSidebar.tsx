import { Shield, BarChart, Target, Wrench, Grid2x2, Database, FileText, Calendar, Users, TrendingUp, AlertTriangle, LogOut, RefreshCw } from "lucide-react";
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

const menuItems = [
  {
    title: "Dashboard Overview",
    url: "/dashboard",
    icon: BarChart,
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
        title: "Ageing of Vulnerability",
        url: "/dashboard/vulnerability-aging",
      },
      {
        title: "Most Exploitable",
        url: "/dashboard/most-exploitable",
      },
    ],
  },
  {
    title: "Remediation Summary",
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
    title: "Higher Management Insights",
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
      {
        title: "Risk Trajectory",
        url: "/dashboard/risk-trajectory",
      },
    ],
  },
  {
    title: "SEoL Analysis",
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
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutDialog(true);
  };

  const handleLogoutConfirm = () => {
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
                          <SidebarMenuButton className="w-full flex items-center gap-3 px-3 py-2 text-left">
                            <item.icon className="h-4 w-4" />
                            <span className="flex-1">{item.title}</span>
                            <ChevronRight className="h-4 w-4 transition-transform group-data-[state=open]:rotate-90" />
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
                                  <button className="w-full text-left">
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
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
            onClick={handleSelectInstance}
          >
            <RefreshCw className="h-4 w-4" />
            <span>Select Instance</span>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
            onClick={handleLogoutClick}
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
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
    </>
  );
}
