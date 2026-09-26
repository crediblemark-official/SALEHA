import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot 
} from 'firebase/firestore';
import { db } from './firebase';

const PERMOHONAN_COLLECTION = 'permohonan';
const USERS_COLLECTION = 'users';
const ADMINS_COLLECTION = 'admins';

export const firestoreService = {
  /**
   * Simpan atau update dokumen permohonan ke Firestore
   */
  async savePermohonan(ticketData) {
    if (!ticketData || !ticketData.id_ticket) return;
    try {
      const docRef = doc(db, PERMOHONAN_COLLECTION, ticketData.id_ticket);
      await setDoc(docRef, {
        ...ticketData,
        updated_at: new Date().toISOString()
      }, { merge: true });
      return { success: true };
    } catch (error) {
      console.error('Gagal menyimpan permohonan ke Firestore:', error);
      return { success: false, error };
    }
  },

  /**
   * Update field tertentu pada permohonan (Status, Catatan, Operator, PDF)
   */
  async updatePermohonan(ticketId, updateFields) {
    if (!ticketId) return;
    try {
      const docRef = doc(db, PERMOHONAN_COLLECTION, ticketId);
      await updateDoc(docRef, {
        ...updateFields,
        updated_at: new Date().toISOString()
      });
      return { success: true };
    } catch (error) {
      console.error('Gagal update permohonan di Firestore:', error);
      return { success: false, error };
    }
  },

  /**
   * Simpan profil user UMKM yang login
   */
  async saveUserProfile(user, profileExtra = {}) {
    if (!user || !user.uid) return;
    try {
      const docRef = doc(db, USERS_COLLECTION, user.uid);
      await setDoc(docRef, {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        last_login: new Date().toISOString(),
        ...profileExtra
      }, { merge: true });
    } catch (error) {
      console.warn('Gagal simpan profil user ke Firestore:', error);
    }
  },

  /**
   * Listener real-time Firestore untuk permohonan
   */
  subscribePermohonan({ userId, isAdmin, onData, onError }) {
    try {
      let q;
      if (isAdmin) {
        // Admin melihat semua antrean permohonan
        q = query(collection(db, PERMOHONAN_COLLECTION));
      } else if (userId) {
        // UMKM hanya membaca permohonannya sendiri
        q = query(collection(db, PERMOHONAN_COLLECTION), where('user_id', '==', userId));
      } else {
        return () => {};
      }

      return onSnapshot(q, (snapshot) => {
        const list = [];
        snapshot.forEach(docSnap => {
          list.push(docSnap.data());
        });
        // Urutkan berdasarkan waktu pengajuan terbaru
        list.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
        onData(list);
      }, (error) => {
        console.warn('Firestore subscription warning:', error);
        if (onError) onError(error);
      });
    } catch (error) {
      console.warn('Gagal inisialisasi Firestore listener:', error);
      return () => {};
    }
  },

  /**
   * Jika Firestore masih kosong (misal baru dibuat atau hanya ada _health ping),
   * upload data permohonan awal agar langsung tampil di Firebase Console & antar-perangkat.
   */
  async syncInitialDataIfEmpty(initialList, currentUser) {
    if (!currentUser) return;
    try {
      const snapshot = await getDocs(query(collection(db, PERMOHONAN_COLLECTION)));
      if (snapshot.empty && Array.isArray(initialList) && initialList.length > 0) {
        console.log('Menginisialisasi data awal permohonan ke Firestore...');
        for (const item of initialList) {
          const itemToSave = {
            ...item,
            user_id: item.user_id === 'umkm_ahmad_01' ? currentUser.uid : item.user_id
          };
          await setDoc(doc(db, PERMOHONAN_COLLECTION, item.id_ticket), itemToSave, { merge: true });
        }
      }
    } catch (e) {
      console.warn('Inisialisasi Firestore awal dilewati:', e);
    }
  }
};
