import { ReactNode, createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { Models } from 'appwrite';
import { AuthService } from '@/appwrite/auth';

interface AuthContextType {
  user: Models.User<Models.Preferences> | null;
  isLoading: boolean; // For initial auth check
  isAuthenticating: boolean; // For login/logout operations
  isAuthenticated: boolean;
  userId: string;
  login: (email: string, password: string) => Promise<Models.Session | null>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Initial auth check
  const [isAuthenticating, setIsAuthenticating] = useState(false); // Login/logout operations
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [lastFetch, setLastFetch] = useState<number | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);

  const authService = useMemo(() => new AuthService(), []);
  const userId = authService.getExistingUserId();

  // Cache for 5 minutes
  const CACHE_KEY = 'appwrite_auth_cache';
  const CACHE_DURATION = 5 * 60 * 1000;

  const loadCachedData = useCallback(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;

      const data = JSON.parse(cached);

      if (Date.now() - data.lastFetch > CACHE_DURATION) {
        localStorage.removeItem(CACHE_KEY);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Failed to load cached auth data:', error);
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
  }, [CACHE_KEY, CACHE_DURATION]);

  const saveCachedData = useCallback(
    (authData: { user: Models.User<Models.Preferences> | null; isAuthenticated: boolean; lastFetch: number }) => {
      try {
        if (authData.isAuthenticated && authData.user) {
          localStorage.setItem(CACHE_KEY, JSON.stringify(authData));
        } else {
          localStorage.removeItem(CACHE_KEY);
        }
      } catch (error) {
        console.error('Failed to cache auth data:', error);
      }
    },
    [CACHE_KEY]
  );

  const clearCachedData = useCallback(() => {
    try {
      localStorage.removeItem(CACHE_KEY);
    } catch (error) {
      console.error('Failed to clear cached auth data:', error);
    }
  }, [CACHE_KEY]);

  const isCacheValid = useCallback(() => {
    if (!lastFetch) return false;
    return Date.now() - lastFetch < CACHE_DURATION;
  }, [lastFetch, CACHE_DURATION]);

  const updateAuthState = useCallback(
    (userData: Models.User<Models.Preferences> | null, authenticated: boolean) => {
      const timestamp = Date.now();

      setUser(userData);
      setIsAuthenticated(authenticated);
      setLastFetch(timestamp);
      setHasInitialized(true);

      saveCachedData({
        user: userData,
        isAuthenticated: authenticated,
        lastFetch: timestamp,
      });
    },
    [saveCachedData]
  );

  const checkAuth = useCallback(
    async (forceRefresh = false) => {
      try {
        // On initial load, try cache first for faster response
        if (!forceRefresh && !hasInitialized) {
          const cachedData = loadCachedData();
          if (cachedData && cachedData.isAuthenticated) {
            // Set cached data immediately
            setUser(cachedData.user);
            setIsAuthenticated(cachedData.isAuthenticated);
            setLastFetch(cachedData.lastFetch);
            setHasInitialized(true);
            setIsLoading(false);

            // Verify in background
            setTimeout(async () => {
              try {
                const currentUser = await authService.getCurrentUser();
                if (!currentUser) {
                  updateAuthState(null, false);
                  clearCachedData();
                }
              } catch {
                updateAuthState(null, false);
                clearCachedData();
              }
            }, 100);
            return;
          }
        }

        // Skip API call if cache is still valid
        if (!forceRefresh && hasInitialized && isCacheValid() && isAuthenticated) {
          setIsLoading(false);
          return;
        }

        if (!hasInitialized) {
          setIsLoading(true);
        }

        const currentUser = await authService.getCurrentUser();

        if (currentUser) {
          updateAuthState(currentUser, true);
        } else {
          updateAuthState(null, false);
          clearCachedData();
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        updateAuthState(null, false);
        clearCachedData();
      } finally {
        setIsLoading(false);
      }
    },
    [hasInitialized, isCacheValid, isAuthenticated, authService, updateAuthState, loadCachedData, clearCachedData]
  );

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback(
    async (email: string, password: string): Promise<Models.Session | null> => {
      setIsAuthenticating(true);
      try {
        clearCachedData();

        // Clear any existing session first
        try {
          await authService.logout();
        } catch (error) {
          // Ignore logout errors
          console.warn('Pre-login logout failed:', error);
        }

        // Small delay to ensure session is cleared
        await new Promise(resolve => setTimeout(resolve, 300));

        // Login
        const session = await authService.login(email, password);

        if (session) {
          // Wait a bit before getting user to ensure session is established
          await new Promise(resolve => setTimeout(resolve, 500));

          // Get current user
          const currentUser = await authService.getCurrentUser();

          if (currentUser) {
            updateAuthState(currentUser, true);
            return session;
          }
        }

        updateAuthState(null, false);
        return null;
      } catch (error) {
        console.error('Login error:', error);
        updateAuthState(null, false);
        clearCachedData();
        throw error;
      } finally {
        setIsAuthenticating(false);
      }
    },
    [authService, updateAuthState, clearCachedData]
  );

  const logout = useCallback(async () => {
    setIsAuthenticating(true);
    try {
      await authService.logout();
      updateAuthState(null, false);
      clearCachedData();
    } catch (error) {
      console.error('Logout error:', error);
      updateAuthState(null, false);
      clearCachedData();
    } finally {
      setIsAuthenticating(false);
    }
  }, [authService, updateAuthState, clearCachedData]);

  const refreshUser = useCallback(async () => {
    await checkAuth(true);
  }, [checkAuth]);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticating,
      isAuthenticated,
      userId,
      login,
      logout,
      refreshUser,
    }),
    [user, isLoading, isAuthenticating, isAuthenticated, userId, login, logout, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
