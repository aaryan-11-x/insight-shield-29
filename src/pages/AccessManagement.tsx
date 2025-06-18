import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Shield, User, Crown, Lock, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

const AccessManagement = () => {
  const { user, userRole, changePassword, changeUserPassword } = useAuth();
  const { toast } = useToast();
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);

  // For changing other users' passwords
  const [isChangeUserPasswordOpen, setIsChangeUserPasswordOpen] = useState(false);
  const [isChangingUserPassword, setIsChangingUserPassword] = useState(false);
  const [selectedUserEmail, setSelectedUserEmail] = useState("");
  const [selectedUserName, setSelectedUserName] = useState("");
  const [showUserNewPassword, setShowUserNewPassword] = useState(false);
  const [showUserConfirmPassword, setShowUserConfirmPassword] = useState(false);
  const [userNewPassword, setUserNewPassword] = useState("");
  const [userConfirmPassword, setUserConfirmPassword] = useState("");
  const [userPasswordStrength, setUserPasswordStrength] = useState(0);

  // Dynamic user data based on authentication context
  const users = [
    {
      name: "Super User",
      email: "superuser@insightshield.com",
      role: "superuser" as const,
      privileges: [
        "Full System Access",
        "Create Instances", 
        "Upload Vulnerability Data",
        "Edit Instance Details",
        "Access Management",
        "Read All Data"
      ],
      icon: <Crown className="h-6 w-6 text-amber-500" />,
      color: "bg-gradient-to-r from-amber-500 to-orange-500",
      status: "Active"
    },
    {
      name: "Normal User", 
      email: "normaluser@insightshield.com",
      role: "normaluser" as const,
      privileges: [
        "Read Instances",
        "View Dashboard Data",
        "Select Existing Runs",
        "Read-Only Access"
      ],
      icon: <User className="h-6 w-6 text-blue-500" />,
      color: "bg-gradient-to-r from-blue-500 to-cyan-500",
      status: "Active"
    }
  ];

  const currentUser = users.find(u => u.role === userRole);

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    return strength;
  };

  const handlePasswordChange = (password: string) => {
    setNewPassword(password);
    setPasswordStrength(calculatePasswordStrength(password));
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 25) return "bg-red-500";
    if (passwordStrength <= 50) return "bg-orange-500";
    if (passwordStrength <= 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 25) return "Weak";
    if (passwordStrength <= 50) return "Fair";
    if (passwordStrength <= 75) return "Good";
    return "Strong";
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "New passwords do not match.",
      });
      return;
    }

    if (passwordStrength < 75) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Password strength must be at least 'Good'.",
      });
      return;
    }

    setIsChangingPassword(true);
    try {
      const { error } = await changePassword(newPassword);
      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to change password.",
        });
      } else {
        toast({
          title: "Success",
          description: "Password changed successfully!",
        });
        setIsChangePasswordOpen(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setPasswordStrength(0);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred.",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleUserPasswordChange = (password: string) => {
    setUserNewPassword(password);
    setUserPasswordStrength(calculatePasswordStrength(password));
  };

  const handleChangeUserPassword = async () => {
    if (userNewPassword !== userConfirmPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "New passwords do not match.",
      });
      return;
    }

    if (userPasswordStrength < 75) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Password strength must be at least 'Good'.",
      });
      return;
    }

    setIsChangingUserPassword(true);
    try {
      const { error } = await changeUserPassword(selectedUserEmail, userNewPassword);
      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to change user password.",
        });
      } else {
        toast({
          title: "Success",
          description: `Password changed successfully for ${selectedUserName}!`,
        });
        setIsChangeUserPasswordOpen(false);
        setUserNewPassword("");
        setUserConfirmPassword("");
        setUserPasswordStrength(0);
        setSelectedUserEmail("");
        setSelectedUserName("");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred.",
      });
    } finally {
      setIsChangingUserPassword(false);
    }
  };

  const openChangeUserPasswordDialog = (userEmail: string, userName: string) => {
    setSelectedUserEmail(userEmail);
    setSelectedUserName(userName);
    setIsChangeUserPasswordOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Access & Profile Management</h2>
        <p className="text-muted-foreground">
          Manage user access, privileges, and account settings across the system
        </p>
      </div>

      {/* Current User Profile Card */}
      {currentUser && (
        <Card className="border-2 border-primary/20">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`rounded-full p-3 ${currentUser.color}`}>
                  {currentUser.icon}
                </div>
                <div>
                  <CardTitle className="text-xl">{currentUser.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{currentUser.email}</p>
                </div>
              </div>
              <Badge variant="outline" className="text-sm">
                {currentUser.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Your Privileges</h4>
              <div className="flex flex-wrap gap-2">
                {currentUser.privileges.map((privilege, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {privilege}
                  </Badge>
                ))}
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Account Security</span>
              </div>
              <Dialog open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    Change Password
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                    <DialogDescription>
                      Update your account password. Make sure to use a strong password.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <div className="relative">
                        <Input
                          id="new-password"
                          type={showNewPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => handlePasswordChange(e.target.value)}
                          placeholder="Enter new password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      {newPassword && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span>Password Strength:</span>
                            <span className={getPasswordStrengthColor() === "bg-green-500" ? "text-green-600" : 
                                             getPasswordStrengthColor() === "bg-yellow-500" ? "text-yellow-600" :
                                             getPasswordStrengthColor() === "bg-orange-500" ? "text-orange-600" : "text-red-600"}>
                              {getPasswordStrengthText()}
                            </span>
                          </div>
                          <Progress value={passwordStrength} className="h-2" />
                          <div className="text-xs text-muted-foreground">
                            Password must be at least 8 characters with uppercase, lowercase, and numbers.
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <div className="relative">
                        <Input
                          id="confirm-password"
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm new password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsChangePasswordOpen(false)}
                      disabled={isChangingPassword}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleChangePassword}
                      disabled={!newPassword || !confirmPassword || passwordStrength < 75 || isChangingPassword}
                    >
                      {isChangingPassword ? "Changing..." : "Change Password"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Users Overview */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold">System Users Overview</h3>
          <p className="text-sm text-muted-foreground">
            Overview of all users and their access levels in the system
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {users.map((user, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`rounded-full p-2 ${user.color}`}>
                      {user.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{user.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <Badge 
                    variant={user.role === 'superuser' ? 'default' : 'secondary'}
                    className={user.role === 'superuser' ? 'bg-amber-500 hover:bg-amber-600' : ''}
                  >
                    {user.role === 'superuser' ? 'Super User' : 'Normal User'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm mb-2">Privileges</h4>
                  <div className="flex flex-wrap gap-1">
                    {user.privileges.map((privilege, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {privilege}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      {user.status}
                    </Badge>
                    {userRole === 'superuser' && user.role !== userRole && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openChangeUserPasswordDialog(user.email, user.name)}
                      >
                        <Lock className="h-3 w-3 mr-1" />
                        Change Password
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Security Information */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Authentication</h4>
              <p className="text-sm text-muted-foreground">
                Email-based authentication with role-based access control
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Data Protection</h4>
              <p className="text-sm text-muted-foreground">
                Row Level Security (RLS) policies ensure data isolation and access control
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Change User Password Dialog */}
      <Dialog open={isChangeUserPasswordOpen} onOpenChange={setIsChangeUserPasswordOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change User Password</DialogTitle>
            <DialogDescription>
              Change password for {selectedUserName} ({selectedUserEmail}). Make sure to use a strong password.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="user-new-password">New Password</Label>
              <div className="relative">
                <Input
                  id="user-new-password"
                  type={showUserNewPassword ? "text" : "password"}
                  value={userNewPassword}
                  onChange={(e) => handleUserPasswordChange(e.target.value)}
                  placeholder="Enter new password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowUserNewPassword(!showUserNewPassword)}
                >
                  {showUserNewPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {userNewPassword && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span>Password Strength:</span>
                    <span className={getPasswordStrengthColor() === "bg-green-500" ? "text-green-600" : 
                                     getPasswordStrengthColor() === "bg-yellow-500" ? "text-yellow-600" :
                                     getPasswordStrengthColor() === "bg-orange-500" ? "text-orange-600" : "text-red-600"}>
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                  <Progress value={userPasswordStrength} className="h-2" />
                  <div className="text-xs text-muted-foreground">
                    Password must be at least 8 characters with uppercase, lowercase, and numbers.
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-confirm-password">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="user-confirm-password"
                  type={showUserConfirmPassword ? "text" : "password"}
                  value={userConfirmPassword}
                  onChange={(e) => setUserConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowUserConfirmPassword(!showUserConfirmPassword)}
                >
                  {showUserConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsChangeUserPasswordOpen(false)}
              disabled={isChangingUserPassword}
            >
              Cancel
            </Button>
            <Button
              onClick={handleChangeUserPassword}
              disabled={!userNewPassword || !userConfirmPassword || userPasswordStrength < 75 || isChangingUserPassword}
            >
              {isChangingUserPassword ? "Changing..." : "Change Password"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AccessManagement; 