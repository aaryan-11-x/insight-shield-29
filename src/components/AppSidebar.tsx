
import { Shield, BarChart, Target, Wrench, Grid2x2, Database, FileText, Calendar } from "lucide-react";
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
  SidebarHeader,
} from "@/components/ui/sidebar";

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
  },
  {
    title: "Exploitability Scoring",
    url: "/exploitability",
    icon: Shield,
  },
  {
    title: "Remediation Insights",
    url: "/remediation",
    icon: Wrench,
  },
  {
    title: "Vulnerability Clustering",
    url: "/clustering",
    icon: Grid2x2,
  },
  {
    title: "CVE Summary",
    url: "/cve-summary",
    icon: Database,
  },
  {
    title: "EOL Components",
    url: "/eol-components",
    icon: Calendar,
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
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
