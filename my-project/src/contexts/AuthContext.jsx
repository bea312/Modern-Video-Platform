import { createContext, useCallback, useContext, useMemo } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage('reeltube_user', null);
  const [subscriptions, setSubscriptions] = useLocalStorage('reeltube_subscriptions', {});

  const login = useCallback((name = 'ReelFan') => {
    setUser({ name, loggedAt: new Date().toISOString() });
  }, [setUser]);

  const logout = useCallback(() => {
    setUser(null);
  }, [setUser]);

  const toggleSubscription = useCallback(
    (channelId, channelTitle) => {
      setSubscriptions((previous) => {
        const next = { ...previous };
        if (next[channelId]) {
          delete next[channelId];
        } else {
          next[channelId] = { title: channelTitle, toggledAt: new Date().toISOString() };
        }
        return next;
      });
    },
    [setSubscriptions]
  );

  const isSubscribed = useCallback(
    (channelId) => Boolean(channelId && subscriptions[channelId]),
    [subscriptions]
  );

  const subscriptionCount = Object.keys(subscriptions).length;

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      toggleSubscription,
      isSubscribed,
      subscriptionCount,
      subscriptions
    }),
    [user, login, logout, toggleSubscription, isSubscribed, subscriptionCount, subscriptions]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
