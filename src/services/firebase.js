import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Scopes lengkap Google Identity
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.email');
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.profile');

// Pastikan selalu meminta akun Google
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

/**
 * Login menggunakan Google Popup dengan fallback ke Redirect
 */
export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { success: true, user: result.user };
  } catch (error) {
    console.warn('Popup login terkendala COOP/kebijakan browser, beralih ke Redirect...', error);
    try {
      await signInWithRedirect(auth, googleProvider);
      return { success: true, redirecting: true };
    } catch (redirectError) {
      console.error('Firebase Google Login Error:', redirectError);
      return { success: false, error: redirectError };
    }
  }
}

/**
 * Logout
 */
export async function logoutFirebase() {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error('Firebase Logout Error:', error);
    return { success: false, error };
  }
}

/**
 * Listener perubahan status autentikasi
 */
export function subscribeToAuth(callback) {
  // Periksa apakah baru kembali dari alur redirect Google
  getRedirectResult(auth)
    .then((result) => {
      if (result?.user) {
        callback(result.user);
      }
    })
    .catch((error) => {
      console.error('Firebase Redirect Result Error:', error);
    });

  return onAuthStateChanged(auth, callback);
}
