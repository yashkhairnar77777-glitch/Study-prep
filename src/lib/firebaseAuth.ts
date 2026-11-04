import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut as firebaseSignOut,
  updateProfile,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import {
  UserProfile,
  Conversation,
  Flashcard,
  SavedNote,
  MockTestAttempt,
  StudyTask,
} from '../types';

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Firestore (with specific databaseId if provided in config)
const firestoreDbId = (firebaseConfig as any).firestoreDatabaseId;
export const db = firestoreDbId ? getFirestore(app, firestoreDbId) : getFirestore(app);

// Configure Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

/**
 * Sign in with Google using authentic Google popup flow.
 */
export const signInWithGoogle = async (): Promise<FirebaseUser> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    console.error('[Firebase Auth] Google Sign-In error:', error);
    // Provide user-friendly error translations
    if (error.code === 'auth/popup-blocked') {
      throw new Error('Sign-in popup was blocked by your browser. Please allow popups for this site or use Email/Password login.');
    }
    if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('Google sign-in was cancelled.');
    }
    throw new Error(error.message || 'Google Sign-In failed. Please try again or use Email & Password.');
  }
};

/**
 * Sign up with real Email and Password.
 */
export const signUpWithEmail = async (
  email: string,
  password: string,
  displayName: string
): Promise<FirebaseUser> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email.trim(),
      password
    );
    const user = userCredential.user;

    if (displayName.trim()) {
      await updateProfile(user, {
        displayName: displayName.trim(),
      });
    }

    return user;
  } catch (error: any) {
    console.error('[Firebase Auth] Sign up error:', error);
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('An account with this email already exists. Please log in instead.');
    }
    if (error.code === 'auth/weak-password') {
      throw new Error('Password should be at least 6 characters long.');
    }
    if (error.code === 'auth/invalid-email') {
      throw new Error('Please enter a valid email address.');
    }
    throw new Error(error.message || 'Failed to create account.');
  }
};

/**
 * Sign in with real Email and Password.
 */
export const signInWithEmail = async (
  email: string,
  password: string
): Promise<FirebaseUser> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email.trim(),
      password
    );
    return userCredential.user;
  } catch (error: any) {
    console.error('[Firebase Auth] Sign in error:', error);
    if (
      error.code === 'auth/user-not-found' ||
      error.code === 'auth/wrong-password' ||
      error.code === 'auth/invalid-credential'
    ) {
      throw new Error('Invalid email or password. Please verify and try again.');
    }
    if (error.code === 'auth/too-many-requests') {
      throw new Error('Too many failed attempts. Please reset your password or try again in a few minutes.');
    }
    throw new Error(error.message || 'Failed to sign in.');
  }
};

/**
 * Send password reset email.
 */
export const sendResetPasswordEmail = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email.trim());
  } catch (error: any) {
    console.error('[Firebase Auth] Password reset error:', error);
    if (error.code === 'auth/user-not-found') {
      throw new Error('No registered account found with this email address.');
    }
    throw new Error(error.message || 'Failed to send password reset email.');
  }
};

/**
 * Sign out from Firebase session.
 */
export const signOutUser = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    console.error('[Firebase Auth] Sign out error:', error);
    throw error;
  }
};

/**
 * Subscribe to Firebase auth state changes.
 */
export const subscribeToAuth = (
  callback: (user: FirebaseUser | null) => void
) => {
  return onAuthStateChanged(auth, callback);
};

// ==========================================
// REAL CLOUD DATA SYNCHRONIZATION WITH FIRESTORE
// ==========================================

export interface UserCloudData {
  profile?: Partial<UserProfile>;
  conversations?: Conversation[];
  flashcards?: Flashcard[];
  notes?: SavedNote[];
  mockTests?: MockTestAttempt[];
  tasks?: StudyTask[];
  updatedAt?: number;
}

/**
 * Save / sync student data to their real cloud Firestore document.
 */
export const syncToFirestore = async (
  userId: string,
  data: UserCloudData
): Promise<void> => {
  try {
    if (!userId) return;
    const userDocRef = doc(db, 'users', userId);
    await setDoc(
      userDocRef,
      {
        ...data,
        updatedAt: Date.now(),
        lastSync: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (err) {
    console.warn('[Firestore Sync] Non-blocking cloud save warning:', err);
  }
};

/**
 * Load student cloud data from Firestore.
 */
export const loadFromFirestore = async (
  userId: string
): Promise<UserCloudData | null> => {
  try {
    if (!userId) return null;
    const userDocRef = doc(db, 'users', userId);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      return snap.data() as UserCloudData;
    }
    return null;
  } catch (err) {
    console.warn('[Firestore Sync] Non-blocking cloud load warning:', err);
    return null;
  }
};

// Aliases for compatibility
export const googleSignIn = signInWithGoogle;
export const logout = signOutUser;

