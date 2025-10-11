import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  User,
  UserCredential
} from 'firebase/auth';
import { auth, googleProvider } from '@/config/firebaseConfig';
import { saveUserProfile, getUserProfile } from './databaseService';

export interface SignUpData {
  email: string;
  password: string;
  name: string;
}

export interface LoginData {
  email: string;
  password: string;
}

/**
 * Sync user data to Realtime Database
 */
const syncUserToDatabase = async (user: User): Promise<void> => {
  try {
    // Check if user profile already exists
    const existingProfile = await getUserProfile(user.uid);
    
    if (!existingProfile) {
      // Create new profile
      await saveUserProfile(user.uid, {
        displayName: user.displayName || 'User',
        email: user.email || '',
        photoURL: user.photoURL || undefined,
        preferences: {
          currency: 'INR',
          language: 'en',
          notifications: true
        }
      });
    }
  } catch (error) {
    console.error('Error syncing user to database:', error);
  }
};

/**
 * Sign up a new user with email and password
 */
export const signUpWithEmail = async (data: SignUpData): Promise<UserCredential> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );

    // Update user profile with display name
    if (userCredential.user) {
      await updateProfile(userCredential.user, {
        displayName: data.name
      });
      
      // Sync user data to Realtime Database
      await syncUserToDatabase(userCredential.user);
    }

    return userCredential;
  } catch (error: any) {
    throw new Error(getAuthErrorMessage(error.code));
  }
};

/**
 * Sign in with email and password
 */
export const loginWithEmail = async (data: LoginData): Promise<UserCredential> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
    
    // Sync user data to Realtime Database on login
    if (userCredential.user) {
      await syncUserToDatabase(userCredential.user);
    }
    
    return userCredential;
  } catch (error: any) {
    throw new Error(getAuthErrorMessage(error.code));
  }
};

/**
 * Sign in with Google OAuth
 */
export const loginWithGoogle = async (): Promise<UserCredential> => {
  try {
    const userCredential = await signInWithPopup(auth, googleProvider);
    
    // Sync user data to Realtime Database on Google login
    if (userCredential.user) {
      await syncUserToDatabase(userCredential.user);
    }
    
    return userCredential;
  } catch (error: any) {
    throw new Error(getAuthErrorMessage(error.code));
  }
};

/**
 * Sign out the current user
 */
export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error('Failed to sign out. Please try again.');
  }
};

/**
 * Get user-friendly error messages
 */
const getAuthErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'This email is already registered. Please login instead.';
    case 'auth/invalid-email':
      return 'Invalid email address format.';
    case 'auth/operation-not-allowed':
      return 'Email/password accounts are not enabled. Please contact support.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters long.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.';
    case 'auth/user-not-found':
      return 'No account found with this email. Please sign up.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please check your credentials.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in popup was closed. Please try again.';
    case 'auth/cancelled-popup-request':
      return 'Sign-in was cancelled. Please try again.';
    default:
      return 'An error occurred during authentication. Please try again.';
  }
};
