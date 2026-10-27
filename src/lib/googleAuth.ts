/**
 * Google Authentication Service
 * Uses Firebase Authentication with official Google OAuth 2.0 & Gmail scopes,
 * with Google Identity Services (GIS) token client as seamless fallback.
 */

import { googleSignIn as firebaseGoogleSignIn, logout as firebaseLogout } from './firebaseAuth';
import firebaseConfig from '../../firebase-applet-config.json';

export interface GoogleUser {
  sub: string;
  name: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  email: string;
  email_verified: boolean;
}

const STORAGE_KEY_CLIENT_ID = 'oryqen_google_client_id';
const STORAGE_KEY_GOOGLE_USER = 'oryqen_google_user';

export const getStoredGoogleClientId = (): string => {
  const envKey = (import.meta.env.VITE_GOOGLE_CLIENT_ID || '').trim();
  if (envKey && !envKey.includes('placeholder')) {
    return envKey;
  }
  const localKey = (localStorage.getItem(STORAGE_KEY_CLIENT_ID) || '').trim();
  if (localKey) {
    return localKey;
  }
  return (firebaseConfig as any)?.oAuthClientId || '';
};

export const setStoredGoogleClientId = (clientId: string): void => {
  if (clientId) {
    localStorage.setItem(STORAGE_KEY_CLIENT_ID, clientId.trim());
  } else {
    localStorage.removeItem(STORAGE_KEY_CLIENT_ID);
  }
};

export const getStoredGoogleUser = (): GoogleUser | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_GOOGLE_USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setStoredGoogleUser = (user: GoogleUser | null): void => {
  if (user) {
    localStorage.setItem(STORAGE_KEY_GOOGLE_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEY_GOOGLE_USER);
  }
};

// Wait for Google Identity Services script (window.google.accounts) to load
export const waitForGoogleIdentityServices = (maxWaitMs = 3000): Promise<boolean> => {
  return new Promise(resolve => {
    if (typeof window !== 'undefined' && (window as any).google?.accounts?.oauth2) {
      resolve(true);
      return;
    }

    const interval = 100;
    let elapsed = 0;
    const timer = setInterval(() => {
      elapsed += interval;
      if (typeof window !== 'undefined' && (window as any).google?.accounts?.oauth2) {
        clearInterval(timer);
        resolve(true);
      } else if (elapsed >= maxWaitMs) {
        clearInterval(timer);
        resolve(false);
      }
    }, interval);
  });
};

/**
 * Triggers authentic Google Account OAuth popup flow.
 * Tries Firebase Google Auth first (with Gmail scope & official Google Cloud project credentials),
 * falling back to GIS token client.
 */
export const signInWithGoogle = async (customClientId?: string): Promise<GoogleUser> => {
  // First attempt: Firebase Google OAuth popup
  try {
    const { user: fbUser } = await firebaseGoogleSignIn();
    const user: GoogleUser = {
      sub: fbUser.uid,
      name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Google Scholar',
      email: fbUser.email || '',
      picture: fbUser.photoURL || undefined,
      email_verified: Boolean(fbUser.emailVerified),
    };
    setStoredGoogleUser(user);
    return user;
  } catch (fbErr: any) {
    // If user closed the popup, rethrow immediately
    if (fbErr?.code === 'auth/popup-closed-by-user' || fbErr?.message?.includes('closed-by-user')) {
      throw new Error('Google Sign-In popup was closed before completion.');
    }
    console.warn('Firebase Google Auth encountered issue, trying GIS fallback:', fbErr);
  }

  // Second attempt: Google Identity Services (GIS)
  const clientId = (customClientId || getStoredGoogleClientId()).trim();

  if (!clientId) {
    throw new Error(
      'Google Client ID is required. Please set VITE_GOOGLE_CLIENT_ID in your environment or enter your Google OAuth Client ID.'
    );
  }

  const isLoaded = await waitForGoogleIdentityServices();
  if (!isLoaded || !(window as any).google?.accounts?.oauth2) {
    throw new Error(
      'Google Identity Services could not be loaded. Please verify your connection or check if an ad-blocker is blocking accounts.google.com.'
    );
  }

  return new Promise((resolve, reject) => {
    try {
      const client = (window as any).google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'openid email profile https://www.googleapis.com/auth/gmail.readonly',
        callback: async (tokenResponse: any) => {
          if (tokenResponse.error) {
            reject(new Error(tokenResponse.error_description || tokenResponse.error || 'Google Sign-In was cancelled or failed.'));
            return;
          }

          if (!tokenResponse.access_token) {
            reject(new Error('Google did not return a valid access token.'));
            return;
          }

          try {
            // Fetch verified user profile from Google's official UserInfo API
            const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: {
                Authorization: `Bearer ${tokenResponse.access_token}`,
              },
            });

            if (!res.ok) {
              throw new Error(`Google UserInfo API returned HTTP ${res.status}`);
            }

            const profileData = await res.json();
            const user: GoogleUser = {
              sub: profileData.sub,
              name: profileData.name || profileData.email.split('@')[0],
              given_name: profileData.given_name,
              family_name: profileData.family_name,
              picture: profileData.picture,
              email: profileData.email,
              email_verified: Boolean(profileData.email_verified),
            };

            setStoredGoogleUser(user);
            resolve(user);
          } catch (fetchErr: any) {
            reject(new Error(`Failed to fetch Google profile: ${fetchErr.message}`));
          }
        },
      });

      // Opens authentic Google accounts.google.com sign-in popup
      client.requestAccessToken({ prompt: 'select_account' });
    } catch (err: any) {
      reject(new Error(`Failed to initialize Google Sign-In: ${err.message}`));
    }
  });
};

export const signOutGoogle = async (): Promise<void> => {
  setStoredGoogleUser(null);
  try {
    await firebaseLogout();
  } catch {}
  if (typeof window !== 'undefined' && (window as any).google?.accounts?.id) {
    try {
      (window as any).google.accounts.id.disableAutoSelect();
    } catch {}
  }
};
