import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Plus, Database } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function InstanceChoice() {
  const navigate = useNavigate();
  const { userRole } = useAuth();

  const handleCreateNew = () => {
    navigate("/create-instance");
  };

  const handleSelectPrevious = () => {
    navigate("/select-instance");
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Instance Management</CardTitle>
            <CardDescription>
              Choose whether to create a new instance or select from existing ones
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className={`grid gap-6 ${userRole === 'superuser' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
              {/* Create New Instance Option - Only visible to superusers */}
              {userRole === 'superuser' && (
                <Card className="cursor-pointer hover:bg-accent transition-colors" onClick={handleCreateNew}>
                  <CardContent className="p-6 text-center">
                    <div className="mb-4 flex justify-center">
                      <div className="rounded-full bg-primary p-4">
                        <Plus className="h-8 w-8 text-primary-foreground" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Create New Instance</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Set up a new vulnerability scanning instance with custom configuration
                    </p>
                    <Button className="w-full" onClick={handleCreateNew}>
                      Create New
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Select Previous Instance Option */}
              <Card className="cursor-pointer hover:bg-accent transition-colors" onClick={handleSelectPrevious}>
                <CardContent className="p-6 text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="rounded-full bg-secondary p-4">
                      <Database className="h-8 w-8 text-secondary-foreground" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Select Previous Instance</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Choose from previously created instances to continue analysis
                  </p>
                  <Button variant="secondary" className="w-full" onClick={handleSelectPrevious}>
                    Select Existing
                  </Button>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
