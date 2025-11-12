import React, { createContext, useContext, useEffect, useState } from 'react';

declare global {
  interface Window {
    google?: any;
  }
}

type User = {
  id: string;
  name: string;
  email: string;
  picture?: string;
};

type AuthContextValue = {
  user: User | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem('auth_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    // noop
  }, []);

  const signInWithGoogle = async () => {
    // Use Google Identity Services token client
    // @ts-ignore
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) throw new Error('Missing VITE_GOOGLE_CLIENT_ID');

    return new Promise<void>((resolve, reject) => {
      try {
        // @ts-ignore
        const tokenClient = window.google?.accounts?.oauth2?.initTokenClient
          ? window.google.accounts.oauth2.initTokenClient({
              client_id: clientId,
              scope: 'profile email openid',
              callback: (resp: any) => {
                if (resp && resp.access_token) {
                  // fetch userinfo
                  fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: {
                      Authorization: `Bearer ${resp.access_token}`,
                    },
                  })
                    .then((r) => r.json())
                    .then((data) => {
                      const u: User = { id: data.sub, name: data.name, email: data.email, picture: data.picture };
                      setUser(u);
                      localStorage.setItem('auth_user', JSON.stringify(u));
                      resolve();
                    })
                    .catch((err) => reject(err));
                } else {
                  reject(new Error('No access token'));
                }
              },
            })
          : null;

        if (tokenClient) {
          tokenClient.requestAccessToken();
        } else {
          // Fallback to popup using google.accounts.id (one-tap)
          // @ts-ignore
          window.google.accounts.id.initialize({ client_id: clientId, callback: (r: any) => {
            // r contains credential JWT
            const jwt = r?.credential;
            if (!jwt) {
              reject(new Error('No credential'));
              return;
            }
            // Decode simple base64 payload
            const payload = JSON.parse(atob(jwt.split('.')[1]));
            const u: User = { id: payload.sub, name: payload.name, email: payload.email, picture: payload.picture };
            setUser(u);
            localStorage.setItem('auth_user', JSON.stringify(u));
            resolve();
          }});
          // @ts-ignore
          window.google.accounts.id.prompt();
        }
      } catch (err) {
        reject(err);
      }
    });
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
  };

  return <AuthContext.Provider value={{ user, signInWithGoogle, signOut }}>{children}</AuthContext.Provider>;
};
