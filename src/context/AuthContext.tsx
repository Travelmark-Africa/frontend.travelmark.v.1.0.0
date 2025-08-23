import { ReactNode, createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { Models } from 'appwrite';
import { AuthService } from '@/appwrite/auth';

interface AuthContextType {
  user: Models.User<Models.Preferences> | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  userId: string;
  login: (email: string, password: string) => Promise<Models.Session | null>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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
        localStorage.setItem(CACHE_KEY, JSON.stringify(authData));
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
      // Try cache first on initial load
      if (!forceRefresh && !hasInitialized) {
        const cachedData = loadCachedData();
        if (cachedData) {
          setUser(cachedData.user);
          setIsAuthenticated(cachedData.isAuthenticated);
          setLastFetch(cachedData.lastFetch);
          setHasInitialized(true);
          setIsLoading(false);
          return;
        }
      }

      // Skip API call if cache is still valid
      if (!forceRefresh && hasInitialized && isCacheValid()) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const currentUser = await authService.getCurrentUser();

        if (currentUser) {
          updateAuthState(currentUser, true);
        } else {
          updateAuthState(null, false);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        updateAuthState(null, false);
      } finally {
        setIsLoading(false);
      }
    },
    [hasInitialized, isCacheValid, authService, updateAuthState, loadCachedData]
  );

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback(
    async (email: string, password: string): Promise<Models.Session | null> => {
      setIsLoading(true);
      try {
        const session = await authService.login(email, password);
        const currentUser = await authService.getCurrentUser();

        if (currentUser) {
          updateAuthState(currentUser, true);
          return session;
        } else {
          updateAuthState(null, false);
          return null;
        }
      } catch (error) {
        updateAuthState(null, false);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [authService, updateAuthState]
  );

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      updateAuthState(null, false);
      clearCachedData();
    } finally {
      setIsLoading(false);
    }
  }, [authService, updateAuthState, clearCachedData]);

  const refreshUser = useCallback(async () => {
    await checkAuth(true);
  }, [checkAuth]);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated,
      userId,
      login,
      logout,
      refreshUser,
    }),
    [user, isLoading, isAuthenticated, userId, login, logout, refreshUser]
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
