import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { LogOut, User, Shield, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const UserInfoHeader: React.FC = () => {
  const { user, userRole, signOut } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Clear instance and run IDs from localStorage
      localStorage.removeItem('currentInstanceId');
      localStorage.removeItem('currentRunId');
      localStorage.removeItem('analysisResults');
      
      // Sign out from Supabase
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getInitials = (email: string) => {
    return email.split('@')[0].substring(0, 2).toUpperCase();
  };

  const getRoleIcon = () => {
    return userRole === 'superuser' ? <Crown className="h-3 w-3" /> : <User className="h-3 w-3" />;
  };

  const getRoleColor = () => {
    return userRole === 'superuser' ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-gradient-to-r from-blue-500 to-cyan-500';
  };

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-auto px-3 rounded-full hover:bg-muted/50">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className={`${getRoleColor()} text-white font-semibold`}>
                {getInitials(user.email || '')}
              </AvatarFallback>
            </Avatar>
            <div className="hidden sm:flex flex-col items-start">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">
                  {user.email?.split('@')[0]}
                </span>
                <Badge variant="secondary" className="text-xs px-2 py-0.5">
                  <div className="flex items-center gap-1">
                    {getRoleIcon()}
                    <span className="capitalize">
                      {userRole === 'superuser' ? 'Super User' : 'Normal User'}
                    </span>
                  </div>
                </Badge>
              </div>
              <span className="text-xs text-muted-foreground">
                {user.email}
              </span>
            </div>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.email}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {userRole === 'superuser' ? 'Full Access' : 'Read Only Access'}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="text-red-600 focus:text-red-600 cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{isLoggingOut ? 'Signing out...' : 'Sign out'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}; 