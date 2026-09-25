import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCGYecLYhuN5K16HOn7-wUgol3Jl6Weaac",
  authDomain: "salehalpnu.firebaseapp.com",
  projectId: "salehalpnu",
  storageBucket: "salehalpnu.firebasestorage.app",
  messagingSenderId: "858425384712",
  appId: "1:858425384712:web:eae43075c9bde3b1ca16bd"
};

async function testConnection() {
  console.log("====================================================");
  console.log("🚀 MENGUJI KONEKSI REALTIME CLOUD FIRESTORE 'salehalpnu'");
  console.log("====================================================");

  try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    const testRef = doc(db, '_health', 'ping');
    const timestamp = new Date().toISOString();

    console.log("1. Menguji WRITE (menulis data test)...");
    await setDoc(testRef, {
      pesan: "Bismillah, koneksi SALEHA PCNU Sumenep sukses!",
      project: "salehalpnu",
      platform: "Android / Vue 3",
      timestamp: timestamp
    });
    console.log("   ✓ WRITE BERHASIL! Data tersimpan di Firestore.");

    console.log("2. Menguji READ (membaca kembali data)...");
    const snap = await getDoc(testRef);
    if (snap.exists()) {
      console.log("   ✓ READ BERHASIL! Isi dokumen:");
      console.log("   ", JSON.stringify(snap.data(), null, 2));
    } else {
      console.log("   ✗ Dokumen tidak ditemukan.");
    }

    console.log("====================================================");
    console.log("🎉 ALHAMDULILLAH KONEKSI DATABASE FIRESTORE 100% AKTIF & STABIL!");
    console.log("====================================================");
    process.exit(0);
  } catch (error) {
    console.error("✗ GAGAL:", error);
    process.exit(1);
  }
}

testConnection();
