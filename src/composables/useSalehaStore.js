import { ref, computed, watch } from 'vue';
import { gasService } from '../services/gasService';
import { firestoreService } from '../services/firestoreService';
import { loginWithGoogle, loginWithEmailPassword, logoutFirebase, subscribeToAuth, getAuthErrorMessage, db } from '../services/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { APP_VERSION } from '../config/appInfo';

const STORAGE_KEY = 'saleha_permohonan_data_v1';
const USER_KEY = 'saleha_current_user_v1';
const ROLE_KEY = 'saleha_active_role_v1';

// Data Awal Demonstrasi UMKM Nahdliyin Sumenep
const INITIAL_PERMOHONAN = [
  {
    _id: "doc_001",
    id_ticket: "SLH-202609-0001",
    user_id: "umkm_ahmad_01",
    no_wa: "081234567890",
    email: "ahmad.barokah@gmail.com",
    password_email: "AhmadBarokah26!",
    punya_2fa: true,
    nama_pemilik: "Ahmad Fulan",
    nik: "3529012304850001",
    nama_usaha: "Kopi Sumenep Barokah",
    alamat_usaha: {
      desa: "Pandian",
      kecamatan: "Kota Sumenep",
      detail_alamat: "Jl. Trunojoyo No. 45"
    },
    jenis_izin: ["NIB", "HALAL"],
    foto_ktp_url: "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=600&q=80",
    foto_produk_url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80",
    status: "DIPROSES",
    catatan_lpnu: "Berkas lengkap. Sedang diinput ke portal OSS-RBA Kementerian Investasi.",
    pdf_hasil_url: "",
    operator_assigned: "H. M. Syukron, M.E.",
    created_at: "2026-09-24T08:30:00.000Z",
    updated_at: "2026-09-25T10:15:00.000Z"
  },
  {
    _id: "doc_002",
    id_ticket: "SLH-202609-0002",
    user_id: "umkm_ahmad_01",
    no_wa: "081234567890",
    email: "ahmad.barokah@gmail.com",
    password_email: "AhmadBarokah26!",
    nama_pemilik: "Ahmad Fulan",
    nik: "3529012304850001",
    nama_usaha: "Batik Madura Canteng Koneng",
    alamat_usaha: {
      desa: "Karanganyar",
      kecamatan: "Kalianget",
      detail_alamat: "Dusun Karanganyar RT 02 / RW 01"
    },
    jenis_izin: ["NIB"],
    foto_ktp_url: "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=600&q=80",
    foto_produk_url: "https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=600&q=80",
    status: "SELESAI",
    catatan_lpnu: "Alhamdulillah NIB telah terbit dan terverifikasi OSS-RBA.",
    pdf_hasil_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    operator_assigned: "Ahmad Zaini, S.E.",
    created_at: "2026-09-20T09:00:00.000Z",
    updated_at: "2026-09-22T14:20:00.000Z"
  },
  {
    _id: "doc_003",
    id_ticket: "SLH-202609-0003",
    user_id: "umkm_thohir_02",
    no_wa: "085233887766",
    email: "thohir.lorjuk@gmail.com",
    password_email: "ThohirGapura2026",
    nama_pemilik: "H. Moh. Thohir",
    nik: "3529071508780003",
    nama_usaha: "Rengginang Lorjuk Gapura Barokah",
    alamat_usaha: {
      desa: "Gapura Barat",
      kecamatan: "Gapura",
      detail_alamat: "Sentra Rengginang Gapura Lor"
    },
    jenis_izin: ["PIRT", "HALAL"],
    foto_ktp_url: "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=600&q=80",
    foto_produk_url: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80",
    status: "BUTUH_REVISI",
    catatan_lpnu: "Foto KTP bagian angka NIK agak silau cahaya lampu. Mohon unggah ulang foto KTP dengan pencahayaan terang dan tegak lurus.",
    pdf_hasil_url: "",
    operator_assigned: "Miftahul Arifin, S.Kom.",
    created_at: "2026-09-25T11:00:00.000Z",
    updated_at: "2026-09-25T15:45:00.000Z"
  },
  {
    _id: "doc_004",
    id_ticket: "SLH-202609-0004",
    user_id: "umkm_farhan_03",
    no_wa: "087799001122",
    email: "Dibuatkan oleh Tim LPNU",
    password_email: "Dibuatkan oleh Tim LPNU",
    nama_pemilik: "Farhan Hidayat",
    nik: "3529120101950002",
    nama_usaha: "Keripik Singkong Renyah Marengan",
    alamat_usaha: {
      desa: "Marengan Laok",
      kecamatan: "Batuan",
      detail_alamat: "Depan Lapangan Voli RT 03"
    },
    jenis_izin: ["NIB"],
    foto_ktp_url: "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=600&q=80",
    foto_produk_url: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=600&q=80",
    status: "BARU",
    catatan_lpnu: "Permohonan baru masuk, menunggu verifikasi berkas.",
    pdf_hasil_url: "",
    operator_assigned: "",
    created_at: "2026-09-26T01:10:00.000Z",
    updated_at: "2026-09-26T01:10:00.000Z"
  }
];

// Reaktif Shared State
const permohonanList = ref(loadPermohonan());
const activeRole = ref(localStorage.getItem(ROLE_KEY) || 'umkm'); // 'umkm' | 'admin'

// Cache dinamis daftar email admin dari Google Sheets (Tab ADMIN_USERS) & Firestore
const adminListFromSheet = ref(gasService.getCachedAdmins());

// Ambil data terbaru dari Google Sheets saat aplikasi aktif
gasService.fetchAdminsFromSheet().then(list => {
  if (Array.isArray(list) && list.length > 0) {
    adminListFromSheet.value = list;
  }
}).catch(err => console.warn('Sync admin sheet status:', err));

// Verifikasi Otoritas Admin LPNU Dinamis (Sheet Kontrol & Firestore)
export async function verifyAdminFromSheetOrDb(email, uid) {
  if (!email) return { isAdmin: false };
  const cleanEmail = email.toLowerCase().trim();

  // 1. Cek langsung dari kontrol Google Sheets (Tab ADMIN_USERS)
  try {
    const sheetResult = await gasService.checkIsEmailAdminInSheet(cleanEmail);
    if (sheetResult.isAdmin) {
      return {
        isAdmin: true,
        operatorName: sheetResult.nama || 'Operator LPNU',
        role: sheetResult.role || 'admin',
        source: 'Google Sheets'
      };
    }
  } catch (e) {
    console.warn('Gagal cek admin dari sheet:', e);
  }

  // 2. Cek Firestore koleksi 'admins'
  try {
    const adminDoc = await getDoc(doc(db, 'admins', cleanEmail));
    if (adminDoc.exists()) {
      const data = adminDoc.data();
      const status = (data.status || 'AKTIF').toUpperCase();
      if (status === 'AKTIF' || status === 'ACTIVE') {
        return {
          isAdmin: true,
          operatorName: data.nama || 'Operator LPNU',
          role: data.role || 'admin',
          source: 'Firestore'
        };
      }
    }
  } catch (e) {}

  if (uid) {
    try {
      const adminUidDoc = await getDoc(doc(db, 'admins', uid));
      if (adminUidDoc.exists()) {
        const data = adminUidDoc.data();
        return {
          isAdmin: true,
          operatorName: data.nama || 'Operator LPNU',
          role: data.role || 'admin',
          source: 'Firestore UID'
        };
      }
    } catch (e) {}
  }

  // 3. Fallback domain resmi LPNU
  if (cleanEmail.endsWith('@lpnu-sumenep.or.id')) {
    return {
      isAdmin: true,
      operatorName: 'Pengurus LPNU Sumenep',
      role: 'admin',
      source: 'Domain LPNU'
    };
  }

  return { isAdmin: false };
}

// Helper synchronous untuk computed
export function isAuthorizedAdmin(email) {
  if (!email) return false;
  const cleanEmail = email.toLowerCase().trim();
  const list = adminListFromSheet.value || [];
  const found = list.some(a => (a.email || '').toLowerCase().trim() === cleanEmail);
  if (found) return true;
  return cleanEmail.endsWith('@lpnu-sumenep.or.id');
}

// Current UMKM Session
const currentUmkmUser = ref(loadCurrentUser() || {
  id: "umkm_ahmad_01",
  noWa: "081234567890",
  email: "ahmad.barokah@gmail.com",
  passwordEmail: "AhmadBarokah26!",
  namaPemilik: "Ahmad Fulan",
  nik: "3529012304850001"
});

// Default Pengumuman Awal
const DEFAULT_PENGUMUMAN = [
  {
    id: "ann_001",
    judul: "Sosialisasi & Fasilitasi Sertifikasi Halal Gratis (SEHATI 2026)",
    isi: "LPNU PCNU Kabupaten Sumenep membuka pendampingan kuota Sertifikasi Halal Gratis bagi pelaku usaha kuliner dan olahan pangan se-Kabupaten Sumenep. Segera lengkapi data usaha Anda melalui aplikasi SALEHA.",
    kategori: "PENTING",
    tgl_rilis: "2026-09-25T08:00:00.000Z",
    status_aktif: true,
    penulis: "Pengurus Cabang LPNU Sumenep"
  }
];

function loadCachedPengumuman() {
  try {
    const raw = localStorage.getItem('saleha_pengumuman_cache');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return DEFAULT_PENGUMUMAN;
}

// State Reaktif Pengumuman & Konten Bantuan
const pengumumanList = ref(loadCachedPengumuman());
const kontenBantuanList = ref(typeof gasService.getCachedKontenBantuan === 'function' ? gasService.getCachedKontenBantuan() : []);
const isKontenBantuanLoading = ref(false);

// Berlangganan real-time pengumuman dari Firestore
try {
  firestoreService.subscribeToPengumuman((items) => {
    if (Array.isArray(items) && items.length > 0) {
      pengumumanList.value = items;
      localStorage.setItem('saleha_pengumuman_cache', JSON.stringify(items));
    }
  });
} catch (e) {
  console.warn('Init firestore pengumuman listener warning:', e);
}

// Ambil konten bantuan dari Google Sheet (Tab KONTEN_BANTUAN) di background
gasService.fetchKontenBantuanFromSheet().then((items) => {
  if (Array.isArray(items) && items.length > 0) {
    kontenBantuanList.value = items;
  }
}).catch(err => console.warn('Sync konten bantuan sheet warning:', err));

// Admin Session
const currentAdminUser = ref({
  id: "admin_lpnu_01",
  email: "admin@lpnu-sumenep.or.id",
  nama: "H. M. Syukron, M.E. (LPNU PCNU)",
  isLoggedIn: true
});

// Firebase Auth Reactive State
const firebaseUser = ref(null);
const isAuthLoading = ref(true);
const authErrorMessage = ref('');
let unsubscribeFirestore = null;

// Subscribe to Firebase Auth
subscribeToAuth(
  (user) => {
    firebaseUser.value = user;
    isAuthLoading.value = false;
    if (user) {
      authErrorMessage.value = '';
      if (!currentUmkmUser.value) {
        currentUmkmUser.value = {
          id: user.uid,
          email: user.email || '',
          namaPemilik: user.displayName || '',
          photoURL: user.photoURL || '',
          noWa: '',
          nik: ''
        };
      } else {
        currentUmkmUser.value.id = user.uid;
        currentUmkmUser.value.email = user.email || currentUmkmUser.value.email || '';
        currentUmkmUser.value.namaPemilik = user.displayName || currentUmkmUser.value.namaPemilik || '';
        currentUmkmUser.value.photoURL = user.photoURL || '';
      }

      // Deteksi hak akses akun Admin LPNU
      const isAdmin = isAuthorizedAdmin(user.email);
      if (isAdmin) {
        currentAdminUser.value = {
          id: user.uid,
          email: user.email,
          nama: user.displayName || 'Admin LPNU PCNU',
          photoURL: user.photoURL || '',
          isLoggedIn: true
        };
      } else {
        // Akun UMKM biasa: paksa role ke 'umkm' jika mencoba masuk admin
        if (activeRole.value === 'admin') {
          activeRole.value = 'umkm';
          localStorage.setItem(ROLE_KEY, 'umkm');
        }
      }

      // 1. Simpan/update profil user ke Firestore (/users/{uid})
      firestoreService.saveUserProfile(user, {
        nama_pemilik: currentUmkmUser.value.namaPemilik,
        no_wa: currentUmkmUser.value.noWa
      });

      // 2. Hubungkan sinkronisasi real-time Firestore (/permohonan)
      if (unsubscribeFirestore) unsubscribeFirestore();
      unsubscribeFirestore = firestoreService.subscribePermohonan({
        userId: user.uid,
        isAdmin,
        onData: (list) => {
          if (list && list.length > 0) {
            permohonanList.value = list;
          }
        }
      });

      // 3. Jika Firestore masih kosong (baru dipasang), sinkronkan data awal
      firestoreService.syncInitialDataIfEmpty(INITIAL_PERMOHONAN, user);
    } else {
      if (unsubscribeFirestore) {
        unsubscribeFirestore();
        unsubscribeFirestore = null;
      }
      activeRole.value = 'umkm';
      localStorage.setItem(ROLE_KEY, 'umkm');
    }
  },
  (error) => {
    isAuthLoading.value = false;
    authErrorMessage.value = getAuthErrorMessage(error);
  }
);

function loadPermohonan() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error loading permohonan:', e);
  }
  return INITIAL_PERMOHONAN;
}

function loadCurrentUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading user:', e);
  }
  return null;
}

// Watcher untuk auto-save ke LocalStorage
watch(permohonanList, (newVal) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal));
}, { deep: true });

watch(currentUmkmUser, (newVal) => {
  if (newVal) {
    localStorage.setItem(USER_KEY, JSON.stringify(newVal));
  } else {
    localStorage.removeItem(USER_KEY);
  }
}, { deep: true });

watch(activeRole, (newVal) => {
  localStorage.setItem(ROLE_KEY, newVal);
});

export function useSalehaStore() {
  // Generate Ticket ID otomatis format: SLH-YYYYMM-XXXX
  function generateTicketId() {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const count = permohonanList.value.length + 1;
    const xxxx = String(count).padStart(4, '0');
    return `SLH-${yyyy}${mm}-${xxxx}`;
  }

  // Buat Permohonan Baru (Modul UMKM F-UMKM-02)
  async function createPermohonan(formData) {
    const ticketId = generateTicketId();
    const nowIso = new Date().toISOString();

    const newTicket = {
      _id: "doc_" + Date.now(),
      id_ticket: ticketId,
      user_id: currentUmkmUser.value.id || "umkm_guest",
      no_wa: currentUmkmUser.value.noWa || formData.noWa,
      email: formData.email || currentUmkmUser.value.email || "",
      password_email: formData.passwordEmail || currentUmkmUser.value.passwordEmail || "",
      punya_2fa: Boolean(formData.punya2fa),
      nama_pemilik: formData.namaPemilik,
      nik: formData.nik,
      nama_usaha: formData.namaUsaha,
      alamat_usaha: {
        desa: formData.desa,
        kecamatan: formData.kecamatan,
        detail_alamat: formData.detailAlamat || ""
      },
      jenis_izin: formData.jenisIzin || ["NIB"],
      foto_ktp_url: formData.fotoKtpUrl || "",
      foto_produk_url: formData.fotoProdukUrl || "",
      status: "BARU",
      catatan_lpnu: "Permohonan baru diterima dan masuk antrean pendampingan Tim LPNU PCNU Sumenep.",
      pdf_hasil_url: "",
      operator_assigned: "",
      created_at: nowIso,
      updated_at: nowIso
    };

    // Tambahkan ke store reaktif
    permohonanList.value.unshift(newTicket);

    // Simpan dokumen permohonan ke Cloud Firestore
    firestoreService.savePermohonan(newTicket).catch(console.error);

    // Sync ke Google Sheets via GAS secara background
    gasService.syncToGoogleSheet(newTicket).catch(console.error);

    return newTicket;
  }

  // Admin Mengubah Status & Catatan & PDF (Modul Admin F-ADM-03)
  async function updateStatus(ticketId, { status, catatan, operatorName, pdfUrl }) {
    const idx = permohonanList.value.findIndex(p => p.id_ticket === ticketId);
    if (idx !== -1) {
      const item = permohonanList.value[idx];
      if (status) item.status = status;
      if (catatan !== undefined) item.catatan_lpnu = catatan;
      if (operatorName) item.operator_assigned = operatorName;
      if (pdfUrl !== undefined) item.pdf_hasil_url = pdfUrl;
      item.updated_at = new Date().toISOString();

      // Simpan perubahan ke Cloud Firestore
      firestoreService.updatePermohonan(ticketId, {
        status: item.status,
        catatan_lpnu: item.catatan_lpnu,
        pdf_hasil_url: item.pdf_hasil_url,
        operator_assigned: item.operator_assigned
      }).catch(console.error);

      // Trigger sync GAS ke Google Sheets
      gasService.syncToGoogleSheet(item).catch(console.error);
      return item;
    }
    return null;
  }

  // Operator Claim Task (F-ADM-02)
  function claimTicket(ticketId, operatorName) {
    const item = permohonanList.value.find(p => p.id_ticket === ticketId);
    if (item) {
      item.operator_assigned = operatorName || currentAdminUser.value.nama;
      if (item.status === 'BARU') {
        item.status = 'DIPROSES';
      }
      item.updated_at = new Date().toISOString();

      // Simpan klaim ke Cloud Firestore
      firestoreService.updatePermohonan(ticketId, {
        status: item.status,
        operator_assigned: item.operator_assigned
      }).catch(console.error);

      gasService.syncToGoogleSheet(item).catch(console.error);
    }
  }

  // UMKM Upload Revisi (F-UMKM-03)
  function submitRevisi(ticketId, { fotoKtpUrl, fotoProdukUrl, catatan }) {
    const item = permohonanList.value.find(p => p.id_ticket === ticketId);
    if (item) {
      if (fotoKtpUrl) item.foto_ktp_url = fotoKtpUrl;
      if (fotoProdukUrl) item.foto_produk_url = fotoProdukUrl;
      item.status = 'DIPROSES';
      item.catatan_lpnu = catatan ? `[Revisi Pemohon: ${catatan}] Menunggu tinjauan ulang admin.` : 'Berkas revisi telah diunggah. Menunggu tinjauan ulang admin.';
      item.updated_at = new Date().toISOString();

      // Simpan berkas revisi ke Cloud Firestore
      firestoreService.updatePermohonan(ticketId, {
        status: item.status,
        foto_ktp_url: item.foto_ktp_url,
        foto_produk_url: item.foto_produk_url,
        catatan_lpnu: item.catatan_lpnu
      }).catch(console.error);

      gasService.syncToGoogleSheet(item).catch(console.error);
    }
  }

  // Status hak akses admin untuk user yang sedang aktif
  const isAdminUser = computed(() => {
    return isAuthorizedAdmin(firebaseUser.value?.email);
  });

  // Switch role dengan proteksi ketat: Admin hanya boleh jika terverifikasi admin
  function setRole(role) {
    if (role === 'admin') {
      if (!isAdminUser.value) {
        console.warn('Akses ditolak: Akun bukan admin.');
        activeRole.value = 'umkm';
        localStorage.setItem(ROLE_KEY, 'umkm');
        return;
      }
      activeRole.value = 'admin';
      localStorage.setItem(ROLE_KEY, 'admin');
    } else {
      activeRole.value = 'umkm';
      localStorage.setItem(ROLE_KEY, 'umkm');
    }
  }

  // Login UMKM sederhana (F-UMKM-01)
  function loginUmkm({ noWa, email, namaPemilik, nik }) {
    currentUmkmUser.value = {
      id: "umkm_" + (noWa ? noWa.replace(/\D/g, '') : Date.now()),
      noWa,
      email: email || "",
      namaPemilik,
      nik
    };
  }

  function resetToDefaultData() {
    permohonanList.value = JSON.parse(JSON.stringify(INITIAL_PERMOHONAN));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(permohonanList.value));
  }

  // Filter permohonan milik UMKM yang aktif
  const myPermohonan = computed(() => {
    if (!currentUmkmUser.value) return [];
    return permohonanList.value.filter(
      p => p.user_id === currentUmkmUser.value.id || p.no_wa === currentUmkmUser.value.noWa
    );
  });

  // Dokumen brankas yang sudah selesai (F-UMKM-04)
  const myBrankasDocuments = computed(() => {
    return myPermohonan.value.filter(p => p.status === 'SELESAI');
  });

  // Statistik untuk Admin LPNU (F-ADM-02)
  const adminStats = computed(() => {
    const list = permohonanList.value;
    return {
      total: list.length,
      baru: list.filter(p => p.status === 'BARU').length,
      diproses: list.filter(p => p.status === 'DIPROSES').length,
      revisi: list.filter(p => p.status === 'BUTUH_REVISI').length,
      selesai: list.filter(p => p.status === 'SELESAI').length
    };
  });

  // Login UMKM melalui Pintu Depan (Google)
  async function loginGoogle() {
    isAuthLoading.value = true;
    authErrorMessage.value = '';
    const res = await loginWithGoogle();
    isAuthLoading.value = false;
    if (res.success && res.user) {
      // Login UMKM selalu masuk ke area UMKM
      activeRole.value = 'umkm';
      localStorage.setItem(ROLE_KEY, 'umkm');
    } else if (!res.userCancelled) {
      authErrorMessage.value = getAuthErrorMessage(res.error);
    }
    return res;
  }

  // Login khusus Admin melalui Google (Jalur rahasia nomor versi, terverifikasi via Google Sheet)
  async function loginAdminGoogle() {
    isAuthLoading.value = true;
    authErrorMessage.value = '';
    const res = await loginWithGoogle();

    if (res.success && res.user) {
      // Verifikasi langsung ke data Google Sheets & Firestore
      const check = await verifyAdminFromSheetOrDb(res.user.email, res.user.uid);

      if (!check.isAdmin) {
        // BUKAN ADMIN: Tolak dan keluarkan segera dari sesi
        await logoutFirebase();
        firebaseUser.value = null;
        activeRole.value = 'umkm';
        localStorage.setItem(ROLE_KEY, 'umkm');
        isAuthLoading.value = false;
        authErrorMessage.value = `Akses Ditolak: Akun Google (${res.user.email}) belum terdaftar pada Tab ADMIN_USERS di Google Sheet kontrol.`;
        return {
          success: false,
          error: new Error(authErrorMessage.value)
        };
      }

      // AKUN ADMIN TERVERIFIKASI DARI SHEET
      setRole('admin');
      currentAdminUser.value = {
        id: res.user.uid,
        email: res.user.email,
        nama: check.operatorName || res.user.displayName || 'Admin LPNU PCNU',
        photoURL: res.user.photoURL || '',
        isLoggedIn: true
      };
      isAuthLoading.value = false;
      return { success: true, user: res.user };
    } else if (!res.userCancelled) {
      authErrorMessage.value = getAuthErrorMessage(res.error);
    }
    isAuthLoading.value = false;
    return res;
  }

  async function logout() {
    isAuthLoading.value = true;
    try {
      await logoutFirebase();
    } catch (e) {
      console.warn('Firebase logout warning:', e);
    }
    firebaseUser.value = null;
    activeRole.value = 'umkm';
    localStorage.setItem(ROLE_KEY, 'umkm');
    isAuthLoading.value = false;
    return { success: true };
  }

  // Fungsi Pengumuman Admin
  async function createPengumuman(data) {
    const newPengumuman = {
      id: data.id || `ann_${Date.now()}`,
      judul: data.judul || '',
      isi: data.isi || '',
      kategori: data.kategori || 'INFO',
      tgl_rilis: data.tgl_rilis || new Date().toISOString(),
      status_aktif: data.status_aktif !== false,
      penulis: data.penulis || currentAdminUser.value?.nama || 'Admin LPNU PCNU'
    };

    // 1. Simpan ke Firestore
    const resFirestore = await firestoreService.savePengumuman(newPengumuman);

    // 2. Simpan juga ke Google Sheet (Tab PENGUMUMAN) via GAS di background
    gasService.savePengumumanToSheet(newPengumuman).catch(err => {
      console.warn('Simpan pengumuman ke Google Sheet warning:', err);
    });

    // 3. Update state lokal segera
    const existingIndex = pengumumanList.value.findIndex(p => p.id === newPengumuman.id);
    if (existingIndex >= 0) {
      pengumumanList.value[existingIndex] = newPengumuman;
    } else {
      pengumumanList.value.unshift(newPengumuman);
    }
    localStorage.setItem('saleha_pengumuman_cache', JSON.stringify(pengumumanList.value));

    return resFirestore;
  }

  async function deletePengumuman(id) {
    const res = await firestoreService.deletePengumuman(id);
    pengumumanList.value = pengumumanList.value.filter(p => p.id !== id);
    localStorage.setItem('saleha_pengumuman_cache', JSON.stringify(pengumumanList.value));
    return res;
  }

  async function refreshPengumuman() {
    try {
      const items = await gasService.fetchPengumumanFromSheet();
      if (Array.isArray(items) && items.length > 0) {
        pengumumanList.value = items;
      }
    } catch (e) {
      console.warn('Refresh pengumuman warning:', e);
    }
    return pengumumanList.value;
  }

  // Fungsi Konten Bantuan (Tab KONTEN_BANTUAN di Sheet)
  async function refreshKontenBantuan() {
    isKontenBantuanLoading.value = true;
    try {
      const items = await gasService.fetchKontenBantuanFromSheet();
      if (Array.isArray(items) && items.length > 0) {
        kontenBantuanList.value = items;
      }
    } catch (e) {
      console.warn('Gagal refresh konten bantuan:', e);
    } finally {
      isKontenBantuanLoading.value = false;
    }
    return kontenBantuanList.value;
  }

  function getKontenBantuanItem(idKey) {
    if (!idKey) return null;
    const cleanKey = String(idKey).trim().toUpperCase();
    const list = kontenBantuanList.value || [];
    return list.find(item => (item.id_key || '').trim().toUpperCase() === cleanKey) || null;
  }

  return {
    APP_VERSION,
    permohonanList,
    activeRole,
    isAdminUser,
    currentUmkmUser,
    currentAdminUser,
    firebaseUser,
    isAuthLoading,
    authErrorMessage,
    clearAuthError: () => { authErrorMessage.value = ''; },
    myPermohonan,
    myBrankasDocuments,
    adminStats,
    setRole,
    loginUmkm,
    loginGoogle,
    loginAdminGoogle,
    logout,
    createPermohonan,
    updateStatus,
    claimTicket,
    submitRevisi,
    resetToDefaultData,
    // Pengumuman
    pengumumanList,
    createPengumuman,
    deletePengumuman,
    refreshPengumuman,
    // Konten Bantuan Sheet
    kontenBantuanList,
    isKontenBantuanLoading,
    refreshKontenBantuan,
    getKontenBantuanItem
  };
}
