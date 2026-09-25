import { ref, computed, watch } from 'vue';
import { gasService } from '../services/gasService';
import { loginWithGoogle, logoutFirebase, subscribeToAuth, getAuthErrorMessage } from '../services/firebase';

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

// Current UMKM Session
const currentUmkmUser = ref(loadCurrentUser() || {
  id: "umkm_ahmad_01",
  noWa: "081234567890",
  email: "ahmad.barokah@gmail.com",
  passwordEmail: "AhmadBarokah26!",
  namaPemilik: "Ahmad Fulan",
  nik: "3529012304850001"
});

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

      // Deteksi akun Admin LPNU
      const isAdminEmail = user.email && (
        user.email.endsWith('@lpnu-sumenep.or.id') ||
        user.email === 'rasy.ibnzawawi@gmail.com'
      );
      if (isAdminEmail) {
        currentAdminUser.value = {
          id: user.uid,
          email: user.email,
          nama: user.displayName || 'Admin LPNU PCNU',
          photoURL: user.photoURL || '',
          isLoggedIn: true
        };
      }
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
      gasService.syncToGoogleSheet(item).catch(console.error);
    }
  }

  // Switch role antara UMKM dan Admin LPNU
  function setRole(role) {
    activeRole.value = role;
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

  async function loginGoogle() {
    isAuthLoading.value = true;
    const res = await loginWithGoogle();
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
    isAuthLoading.value = false;
    return { success: true };
  }

  return {
    permohonanList,
    activeRole,
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
    logout,
    createPermohonan,
    updateStatus,
    claimTicket,
    submitRevisi,
    resetToDefaultData
  };
}
