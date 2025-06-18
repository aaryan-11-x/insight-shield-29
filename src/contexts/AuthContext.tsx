import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userRole: 'superuser' | 'normaluser' | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  changePassword: (newPassword: string) => Promise<{ error: any }>;
  changeUserPassword: (email: string, newPassword: string) => Promise<{ error: any }>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<'superuser' | 'normaluser' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await determineUserRole(session.user);
      }
      
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await determineUserRole(session.user);
        } else {
          setUserRole(null);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const determineUserRole = async (user: User) => {
    // Define the two allowed users
    const allowedUsers = {
      'superuser@insightshield.com': 'superuser' as const,
      'normaluser@insightshield.com': 'normaluser' as const
    };

    const role = allowedUsers[user.email as keyof typeof allowedUsers];
    if (role) {
      setUserRole(role);
    } else {
      // If user is not in allowed list, sign them out
      await supabase.auth.signOut();
      setUserRole(null);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!error) {
      // Check if user is allowed
      const allowedUsers = {
        'superuser@insightshield.com': 'superuser' as const,
        'normaluser@insightshield.com': 'normaluser' as const
      };

      const role = allowedUsers[email as keyof typeof allowedUsers];
      if (!role) {
        await supabase.auth.signOut();
        return { error: { message: 'Access denied. Only authorized users can sign in.' } };
      }
    }

    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUserRole(null);
  };

  const changePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    return { error };
  };

  const changeUserPassword = async (email: string, newPassword: string) => {
    // Only superusers can change other users' passwords
    if (userRole !== 'superuser') {
      return { error: { message: 'Insufficient permissions to change other users\' passwords.' } };
    }

    try {
      // First, we need to get the user by email
      const { data: users, error: fetchError } = await supabase.auth.admin.listUsers();
      if (fetchError) {
        return { error: fetchError };
      }

      const targetUser = users.users.find((u: any) => u.email === email);
      if (!targetUser) {
        return { error: { message: 'User not found.' } };
      }

      // Update the user's password
      const { error } = await supabase.auth.admin.updateUserById(
        targetUser.id,
        { password: newPassword }
      );
      
      return { error };
    } catch (error) {
      return { error: { message: 'Failed to change user password.' } };
    }
  };

  const value = {
    user,
    session,
    userRole,
    loading,
    signIn,
    signOut,
    changePassword,
    changeUserPassword,
    isAuthenticated: !!user && !!userRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 