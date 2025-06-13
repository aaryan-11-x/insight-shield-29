import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, User } from "lucide-react";

const AccessManagement = () => {
  const users = [
    {
      name: "User 1",
      role: "superuser",
      privileges: ["Read Instances", "Create Instances"],
      icon: <Shield className="h-6 w-6 text-primary" />
    },
    {
      name: "User 2",
      role: "normal user",
      privileges: ["Read Instances"],
      icon: <User className="h-6 w-6 text-primary" />
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Access & Profile Management</h2>
        <p className="text-muted-foreground">
          Manage user access and privileges across the system
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {users.map((user, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-bold">{user.name}</CardTitle>
              {user.icon}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Role</p>
                  <p className="text-lg font-semibold capitalize">{user.role}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Privileges</p>
                  <div className="flex flex-wrap gap-2">
                    {user.privileges.map((privilege, idx) => (
                      <Badge key={idx} variant="secondary">
                        {privilege}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AccessManagement; 