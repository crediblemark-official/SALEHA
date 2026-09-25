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
 * Terjemahkan error Firebase Auth ke pesan ramah pengguna
 */
export function getAuthErrorMessage(error) {
  if (!error) return '';
  const code = error.code || '';
  switch (code) {
    case 'auth/popup-closed-by-user':
      return 'Jendela login ditutup sebelum proses selesai.';
    case 'auth/popup-blocked':
      return 'Popup diblokir oleh browser. Harap izinkan popup di browser ini atau gunakan tombol masuk kembali.';
    case 'auth/unauthorized-domain':
      return `Domain (${typeof window !== 'undefined' ? window.location.hostname : 'ini'}) belum diizinkan di Firebase Console > Authentication > Settings > Authorized domains.`;
    case 'auth/operation-not-allowed':
      return 'Metode Google Sign-In belum diaktifkan di Firebase Console > Authentication > Sign-in method.';
    case 'auth/configuration-not-found':
      return 'Konfigurasi Google Identity OAuth belum lengkap di Google Cloud Console.';
    case 'auth/network-request-failed':
      return 'Koneksi internet bermasalah. Periksa jaringan Anda dan coba lagi.';
    default:
      return error.message || 'Gagal login dengan akun Google.';
  }
}

/**
 * Login menggunakan Google Popup dengan fallback ke Redirect hanya jika diblokir
 */
export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { success: true, user: result.user };
  } catch (error) {
    console.warn('Popup login error/warning:', error);
    
    // Jika pengguna sengaja menutup popup, jangan paksa redirect
    if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
      return { success: false, error, userCancelled: true };
    }

    // Jika popup diblokir atau kendala browser COOP, baru beralih ke Redirect
    if (error.code === 'auth/popup-blocked' || error.message?.includes('Cross-Origin') || error.code === 'auth/internal-error') {
      console.warn('Popup diblokir atau terkendala COOP, mencoba fallback Redirect...');
      try {
        await signInWithRedirect(auth, googleProvider);
        return { success: true, redirecting: true };
      } catch (redirectError) {
        console.error('Firebase Google Login Error (Redirect):', redirectError);
        return { success: false, error: redirectError };
      }
    }

    return { success: false, error };
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
export function subscribeToAuth(callback, errorCallback) {
  // Periksa apakah baru kembali dari alur redirect Google
  getRedirectResult(auth)
    .then((result) => {
      if (result?.user) {
        callback(result.user);
      }
    })
    .catch((error) => {
      console.error('Firebase Redirect Result Error:', error);
      if (errorCallback) {
        errorCallback(error);
      }
    });

  return onAuthStateChanged(auth, callback, errorCallback);
}

