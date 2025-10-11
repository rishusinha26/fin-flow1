import React, { createContext, useContext } from 'react';
import { User } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/config/firebaseConfig';
import { 
  signUpWithEmail,
  loginWithEmail,
  loginWithGoogle as loginWithGoogleService,
  logout as logoutService,
  SignUpData,
  LoginData
} from '@/services/authService';

interface AuthContextType {
  user: User | null | undefined;
  loading: boolean;
  error: Error | undefined;
  signUp: (data: SignUpData) => Promise<void>;
  login: (data: LoginData) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
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
  const [user, loading, error] = useAuthState(auth);

  const signUp = async (data: SignUpData): Promise<void> => {
    await signUpWithEmail(data);
  };

  const login = async (data: LoginData): Promise<void> => {
    await loginWithEmail(data);
  };

  const loginWithGoogleHandler = async (): Promise<void> => {
    await loginWithGoogleService();
  };

  const logoutHandler = async (): Promise<void> => {
    await logoutService();
  };

  const value: AuthContextType = {
    user,
    loading,
    error,
    signUp,
    login,
    loginWithGoogle: loginWithGoogleHandler,
    logout: logoutHandler
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
