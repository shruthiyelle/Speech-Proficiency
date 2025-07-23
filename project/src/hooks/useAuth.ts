import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authAPI, userAPI } from '../lib/api';
import { getAuthToken, setAuthToken, removeAuthToken, isAuthenticated } from '../lib/auth';
import type { User } from '../types';

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: userAPI.getMe,
    enabled: isLoggedIn,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const loginMutation = useMutation({
    mutationFn: ({ username, password }: { username: string; password: string }) =>
      authAPI.login(username, password),
    onSuccess: (data) => {
      console.log('Login successful:', data);
      setAuthToken(data.access_token);
      setIsLoggedIn(true);
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.refetchQueries({ queryKey: ['user'] });
    },
    onError: (error) => {
      console.error('Login failed:', error.response?.data?.detail || error.message);
      setIsLoggedIn(false);
      removeAuthToken();
    },
  });

  const registerMutation = useMutation({
    mutationFn: ({ username, email, password }: { username: string; email: string; password: string }) =>
      authAPI.register(username, email, password),
    onError: (error) => {
      console.error('Registration failed:', error.response?.data?.detail || error.message);
    },
  });

  const logout = () => {
    removeAuthToken();
    setIsLoggedIn(false);
    queryClient.clear();
  };

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      console.log('Auth check result:', authenticated);
      setIsLoggedIn(authenticated);
      if (!authenticated) {
        removeAuthToken();
        queryClient.clear();
      }
    };
    
    checkAuth();
    
    // Listen for storage changes (token updates)
    const handleStorageChange = () => {
      checkAuth();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [queryClient]);

  return {
    user,
    isLoggedIn,
    isLoading,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
  };
};