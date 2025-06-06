
import { Shield, BarChart, Target, Wrench, Grid2x2, Database, FileText, Calendar, Users, TrendingUp, AlertTriangle } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
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
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronRight } from "lucide-react";

const menuItems = [
  {
    title: "Dashboard Overview",
    url: "/",
    icon: BarChart,
  },
  {
    title: "Prioritization Insights",
    url: "/prioritization",
    icon: Target,
    subItems: [
      {
        title: "Overall Summary",
        url: "/prioritization",
      },
      {
        title: "Exploitability Scoring",
        url: "/exploitability",
      },
      {
        title: "Ageing of Vulnerability",
        url: "/vulnerability-aging",
      },
      {
        title: "Most Exploitable",
        url: "/most-exploitable",
      },
    ],
  },
  {
    title: "Remediation Summary",
    url: "/remediation",
    icon: Wrench,
    subItems: [
      {
        title: "Remediation Insights",
        url: "/remediation",
      },
      {
        title: "Remediation-Unique Vulnerabilities",
        url: "/remediation-unique",
      },
      {
        title: "Patch Details",
        url: "/patch-details",
      },
      {
        title: "MTTM by Severity",
        url: "/mttm-severity",
      },
    ],
  },
  {
    title: "Operational Insights",
    url: "/operational",
    icon: Grid2x2,
    subItems: [
      {
        title: "IP Insights",
        url: "/ip-insights",
      },
      {
        title: "Vulnerability Clustering",
        url: "/clustering",
      },
      {
        title: "Unique Vulnerabilities",
        url: "/unique-vulnerabilities",
      },
    ],
  },
  {
    title: "Higher Management Insights",
    url: "/management",
    icon: TrendingUp,
    subItems: [
      {
        title: "Risk Summary",
        url: "/risk-summary",
      },
      {
        title: "CVE Summary",
        url: "/cve-summary",
      },
      {
        title: "Hosts Summary",
        url: "/hosts-summary",
      },
      {
        title: "Risk Trajectory",
        url: "/risk-trajectory",
      },
    ],
  },
  {
    title: "SEoL Analysis",
    url: "/seol",
    icon: AlertTriangle,
    subItems: [
      {
        title: "EoL Summary",
        url: "/eol-summary",
      },
      {
        title: "EoL Components",
        url: "/eol-components",
      },
      {
        title: "EOL IPs",
        url: "/eol-ips",
      },
      {
        title: "EOL Versions",
        url: "/eol-versions",
      },
    ],
  },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Sidebar>
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Shield className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">VulnDash</h2>
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
    </Sidebar>
  );
}
