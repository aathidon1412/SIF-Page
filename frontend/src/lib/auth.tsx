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
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.error('Missing VITE_GOOGLE_CLIENT_ID');
      throw new Error('Missing VITE_GOOGLE_CLIENT_ID');
    }

    return new Promise<void>((resolve, reject) => {
      try {
        // Check if Google API is loaded
        if (!window.google) {
          reject(new Error('Google API not loaded'));
          return;
        }

        // Use OAuth2 token client for better user experience
        if (window.google.accounts?.oauth2?.initTokenClient) {
          const tokenClient = window.google.accounts.oauth2.initTokenClient({
            client_id: clientId,
            scope: 'profile email openid',
            callback: async (resp: any) => {
              if (resp && resp.access_token) {
                try {
                  // Fetch user info
                  const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: {
                      Authorization: `Bearer ${resp.access_token}`,
                    },
                  });
                  
                  if (!response.ok) {
                    throw new Error('Failed to fetch user info');
                  }
                  
                  const data = await response.json();
                  const user: User = { 
                    id: data.sub, 
                    name: data.name, 
                    email: data.email, 
                    picture: data.picture 
                  };
                  
                  setUser(user);
                  localStorage.setItem('auth_user', JSON.stringify(user));
                  console.log('User signed in successfully:', user.email);
                  resolve();
                } catch (err) {
                  console.error('Auth error:', err);
                  reject(err);
                }
              } else {
                reject(new Error('No access token received'));
              }
            },
            error_callback: (error: any) => {
              console.error('OAuth error:', error);
              reject(new Error('OAuth failed'));
            }
          });

          tokenClient.requestAccessToken();
        } else {
          // Fallback to ID token method
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: (response: any) => {
              try {
                const jwt = response?.credential;
                if (!jwt) {
                  reject(new Error('No credential received'));
                  return;
                }
                
                // Decode JWT payload
                const payload = JSON.parse(atob(jwt.split('.')[1]));
                const user: User = { 
                  id: payload.sub, 
                  name: payload.name, 
                  email: payload.email, 
                  picture: payload.picture 
                };
                
                setUser(user);
                localStorage.setItem('auth_user', JSON.stringify(user));
                console.log('User signed in successfully:', user.email);
                resolve();
              } catch (err) {
                console.error('JWT decode error:', err);
                reject(err);
              }
            }
          });
          
          window.google.accounts.id.prompt((notification: any) => {
            if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
              // Fallback to renderButton if prompt doesn't work
              const buttonDiv = document.createElement('div');
              document.body.appendChild(buttonDiv);
              
              window.google.accounts.id.renderButton(buttonDiv, {
                theme: 'outline',
                size: 'large',
                width: 250
              });
              
              // Clean up after 10 seconds
              setTimeout(() => {
                document.body.removeChild(buttonDiv);
              }, 10000);
            }
          });
        }
      } catch (err) {
        console.error('Sign-in initialization error:', err);
        reject(err);
      }
    });
  };

  const signOut = () => {
    // Clear user state and local storage
    setUser(null);
    localStorage.removeItem('auth_user');
    
    // Sign out from Google if available
    if (window.google?.accounts?.id) {
      try {
        window.google.accounts.id.disableAutoSelect();
      } catch (e) {
        console.warn('Google sign-out cleanup failed:', e);
      }
    }
    
    console.log('User signed out successfully');
    
    // Redirect to home page
    try {
      window.location.hash = '#/';
    } catch (e) {
      // Fallback navigation
      window.location.href = '/';
    }
  };

  return <AuthContext.Provider value={{ user, signInWithGoogle, signOut }}>{children}</AuthContext.Provider>;
};
