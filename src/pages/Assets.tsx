
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Server, Monitor, Smartphone, Cloud, Download } from "lucide-react";

const assetsData = [
  {
    id: "srv-001",
    name: "Web Server 01",
    type: "Server",
    ip: "192.168.1.10",
    os: "Ubuntu 20.04",
    status: "active",
    vulnerabilities: 12,
    riskLevel: "high",
    lastSeen: "2 minutes ago"
  },
  {
    id: "db-001",
    name: "Database Server",
    type: "Server", 
    ip: "192.168.1.25",
    os: "CentOS 7",
    status: "active",
    vulnerabilities: 8,
    riskLevel: "medium",
    lastSeen: "5 minutes ago"
  },
  {
    id: "ws-001",
    name: "Workstation 01",
    type: "Workstation",
    ip: "192.168.1.50",
    os: "Windows 10",
    status: "active",
    vulnerabilities: 15,
    riskLevel: "high",
    lastSeen: "10 minutes ago"
  },
  {
    id: "mob-001",
    name: "Mobile Device 01",
    type: "Mobile",
    ip: "192.168.1.75",
    os: "iOS 16",
    status: "active",
    vulnerabilities: 3,
    riskLevel: "low",
    lastSeen: "1 hour ago"
  },
  {
    id: "cld-001",
    name: "Cloud Instance",
    type: "Cloud",
    ip: "10.0.1.100",
    os: "Amazon Linux 2",
    status: "active",
    vulnerabilities: 6,
    riskLevel: "medium",
    lastSeen: "30 minutes ago"
  }
];

const getAssetIcon = (type: string) => {
  switch (type) {
    case "Server": return <Server className="h-4 w-4" />;
    case "Workstation": return <Monitor className="h-4 w-4" />;
    case "Mobile": return <Smartphone className="h-4 w-4" />;
    case "Cloud": return <Cloud className="h-4 w-4" />;
    default: return <Server className="h-4 w-4" />;
  }
};

export default function Assets() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredAssets = assetsData.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.ip.includes(searchTerm) ||
                         asset.os.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || asset.type.toLowerCase() === filterType;
    const matchesStatus = filterStatus === "all" || asset.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const totalAssets = assetsData.length;
  const activeAssets = assetsData.filter(a => a.status === "active").length;
  const highRiskAssets = assetsData.filter(a => a.riskLevel === "high").length;
  const totalVulnerabilities = assetsData.reduce((sum, asset) => sum + asset.vulnerabilities, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Assets</h1>
          <p className="text-muted-foreground">Manage and monitor your IT assets</p>
        </div>
        <Button className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Assets
        </Button>
      </div>

      {/* Asset Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="metric-card">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Total Assets</p>
            <p className="text-2xl font-bold">{totalAssets}</p>
          </div>
        </div>
        <div className="metric-card">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Active Assets</p>
            <p className="text-2xl font-bold text-green-400">{activeAssets}</p>
          </div>
        </div>
        <div className="metric-card">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">High Risk Assets</p>
            <p className="text-2xl font-bold text-red-400">{highRiskAssets}</p>
          </div>
        </div>
        <div className="metric-card">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Total Vulnerabilities</p>
            <p className="text-2xl font-bold">{totalVulnerabilities}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search assets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Asset Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="server">Server</SelectItem>
            <SelectItem value="workstation">Workstation</SelectItem>
            <SelectItem value="mobile">Mobile</SelectItem>
            <SelectItem value="cloud">Cloud</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Assets Table */}
      <div className="chart-container">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4">Asset</th>
                <th className="text-left py-3 px-4">Type</th>
                <th className="text-left py-3 px-4">IP Address</th>
                <th className="text-left py-3 px-4">Operating System</th>
                <th className="text-center py-3 px-4">Status</th>
                <th className="text-center py-3 px-4">Vulnerabilities</th>
                <th className="text-center py-3 px-4">Risk Level</th>
                <th className="text-left py-3 px-4">Last Seen</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.map((asset) => (
                <tr key={asset.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {getAssetIcon(asset.type)}
                      <span className="font-medium">{asset.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm">{asset.type}</td>
                  <td className="py-3 px-4 font-mono text-sm">{asset.ip}</td>
                  <td className="py-3 px-4 text-sm">{asset.os}</td>
                  <td className="py-3 px-4 text-center">
                    <Badge variant={asset.status === "active" ? "default" : "secondary"}>
                      {asset.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-center font-bold">
                    <span className={
                      asset.vulnerabilities > 10 ? "text-red-400" :
                      asset.vulnerabilities > 5 ? "text-yellow-400" :
                      "text-green-400"
                    }>
                      {asset.vulnerabilities}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Badge variant={
                      asset.riskLevel === "high" ? "destructive" :
                      asset.riskLevel === "medium" ? "default" :
                      "secondary"
                    }>
                      {asset.riskLevel}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{asset.lastSeen}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
