import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { Capacitor } from '@capacitor/core';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  signInWithCredential,
  signInWithEmailAndPassword,
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

// Provider Google Auth (secara default sudah menyertakan openid, email, dan profile)
// Hindari addScope manual URL userinfo yang dapat memicu konflik token 401
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
    case 'auth/invalid-credential':
      return 'Kredensial tidak valid (email atau kata sandi salah, atau kredensial OAuth ditolak).';
    case 'auth/user-not-found':
      return 'Akun operator dengan email ini tidak ditemukan.';
    case 'auth/wrong-password':
      return 'Kata sandi salah. Silakan periksa kembali.';
    case 'auth/invalid-email':
      return 'Format alamat email tidak valid.';
    case 'auth/user-disabled':
      return 'Akun pengguna ini telah dinonaktifkan oleh administrator.';
    case 'auth/too-many-requests':
      return 'Terlalu banyak percobaan masuk gagal. Akses dibatasi sementara demi keamanan.';
    case 'auth/network-request-failed':
    case '7':
    case 'NETWORK_ERROR':
      return 'Koneksi internet bermasalah. Periksa jaringan Anda dan coba lagi.';
    case '10':
    case 'DEVELOPER_ERROR':
      return 'Developer Error (10): Sertifikat SHA-1 APK belum sesuai dengan SHA-1 di Firebase Console.';
    default:
      if (typeof error.message === 'string' && (error.message.includes('10:') || error.message.includes('DEVELOPER_ERROR'))) {
        return 'Developer Error (10): Sertifikat SHA-1 APK belum sesuai dengan SHA-1 di Firebase Console.';
      }
      return error.message || 'Gagal autentikasi.';
  }
}

/**
 * Login Google: Otomatis Native Google Play Services di Android, Popup/Redirect di Web
 */
export async function loginWithGoogle() {
  // 1. DI ANDROID NATIVE (CAPACITOR APK)
  if (Capacitor.isNativePlatform()) {
    try {
      console.log('Menjalankan Native Google Play Services Sign-In di Android...');
      const result = await FirebaseAuthentication.signInWithGoogle();
      const idToken = result.credential?.idToken;
      if (!idToken) {
        throw new Error('ID Token tidak ditemukan dari Google Play Services');
      }
      const credential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(auth, credential);
      return { success: true, user: userCredential.user };
    } catch (error) {
      console.error('Native Android Google Sign-In Error:', error);
      // Jika pengguna membatalkan dialog akun Android
      if (error?.message?.includes('cancel') || error?.code === '12501' || error?.message?.includes('12501')) {
        return { success: false, error, userCancelled: true };
      }
      return { success: false, error };
    }
  }

  // 2. DI WEB BROWSER
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
 * Login khusus Admin/Operator via Email & Password
 */
export async function loginWithEmailPassword(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error('Firebase Email/Password Login Error:', error);
    return { success: false, error };
  }
}

/**
 * Logout dari Firebase & Google Native
 */
export async function logoutFirebase() {
  try {
    if (Capacitor.isNativePlatform()) {
      try {
        await FirebaseAuthentication.signOut();
      } catch (nativeErr) {
        console.warn('Native sign out warning:', nativeErr);
      }
    }
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

