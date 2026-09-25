# SALEHA (Sadar Legalitas Usaha)
### Fasilitasi & Pendampingan Legalitas UMKM Nahdliyin PCNU Kabupaten Sumenep

Aplikasi mobile berbasis **Vite + Vue 3 + Tailwind CSS v4 + Capacitor Android**, terintegrasi dengan **Google Apps Script (GAS)**, **Google Drive**, **Google Sheets**, dan **Firebase** untuk pendampingan legalitas UMKM (NIB OSS-RBA, Sertifikat Halal BPJPH/SEHATI, dan P-IRT).

---

## 🚀 Fitur Utama

### 1. Modul Pelaku UMKM (Mobile-First)
* **Status Permohonan Real-time:** Pelacak tiket digital (format `SLH-YYYYMM-XXXX`) dengan linimasa tahapan: *Diterima $\rightarrow$ Diproses $\rightarrow$ Butuh Revisi $\rightarrow$ Terbit*.
* **Formulir 1 Layar Ramah Awam:** Pendaftaran izin NIB, Sertifikasi Halal, atau P-IRT hanya dengan identitas KTP dan foto produk/tempat usaha.
* **Kompresi Foto Otomatis:** Foto dikompresi di sisi HP ($\le 1$ MB) sebelum diunggah agar hemat kuota internet.
* **Daftar 27 Kecamatan Sumenep:** Terintegrasi wilayah Daratan dan Kepulauan (Kangean, Sapeken, Masalembu, Sepudi, Raas, Giligenting, dll).
* **Brankas Dokumen Digital:** Penyimpanan PDF resmi izin yang telah terbit dengan opsi download langsung dan tombol **"Kirim ke WhatsApp"** untuk memudahkan cetak di tempat fotokopi.
* **Fitur Tanggapan Revisi:** Unggah ulang foto KTP jika berkas sebelumnya buram atau silau dengan catatan langsung dari petugas.

### 2. Modul Admin / Back-Office LPNU
* **Dashboard Task Management:** Antrean seluruh permohonan legalitas se-Kabupaten Sumenep.
* **Filter & Pencarian Cepat:** Filter berdasarkan status pengerjaan, 27 kecamatan, atau pencarian nama usaha / NIK.
* **Fitur Klaim Tiket:** Operator dapat mengklaim tiket yang sedang dikerjakan agar tidak terjadi tumpang tindih pengerjaan antar pengurus.
* **Akses Cepat Berkas Drive:** Tombol langsung menuju berkas KTP dan foto produk di Google Drive LPNU.
* **Modal Eksekusi & Upload PDF:** Ubah status menjadi `DIPROSES`, `BUTUH REVISI`, atau `SELESAI`, tambahkan catatan untuk UMKM, dan tautkan sertifikat PDF resmi.
* **Ekspor Master Data:** Ekspor data antrean ke format CSV / Google Sheets siap cetak.

---

## 🛠️ Stack Teknologi

* **Frontend:** Vue 3 (Composition API), Vite, Tailwind CSS v4 (`@tailwindcss/vite`)
* **Mobile Runtime:** Capacitor v8 (`@capacitor/core`, `@capacitor/android`, `@capacitor/cli`)
* **Database Real-time:** Firebase Cloud Firestore & Firebase Auth
* **Storage & Sheets Gateway:** Google Apps Script Web App (`gas/Code.gs`), Google Drive, Google Sheets Master

---

## 📁 Struktur Proyek

```
SALEHA/
├── android/                   # Project Native Android Studio (Capacitor)
├── gas/
│   └── Code.gs                # Skrip Google Apps Script (Drive & Sheets Master)
├── public/
│   └── logo.svg               # Logo Resmi SALEHA LPNU
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── AdminDashboard.vue        # Dashboard Back-office Operator LPNU
│   │   ├── ModalRevisi.vue           # Modal Unggah Ulang Berkas UMKM
│   │   ├── ModalSettings.vue         # Modal Konfigurasi GAS & Database
│   │   ├── ModalUpdateStatus.vue     # Modal Eksekusi Status & Unggah PDF
│   │   ├── Navbar.vue                # Header Branding & Role Switcher
│   │   ├── StatusBadge.vue           # Badge Status Warna & Animasi
│   │   ├── UmkmBrankas.vue           # Brankas Dokumen Legalitas
│   │   ├── UmkmDashboard.vue         # Beranda & Pelacak Tiket UMKM
│   │   ├── UmkmFormPengajuan.vue     # Form Pengajuan 1 Layar
│   │   └── UmkmPanduan.vue           # Panduan NIB, Halal SEHATI, P-IRT
│   ├── composables/
│   │   └── useSalehaStore.js         # Reactive State & Persistent Storage
│   ├── data/
│   │   └── sumenep.js                # Data Master 27 Kecamatan & Jenis Izin
│   ├── services/
│   │   ├── firebase.js               # Firebase Auth & Firestore Client
│   │   └── gasService.js             # Client Bridge GAS, Kompresi & Upload
│   ├── App.vue                       # Root Component & Mobile Bottom Bar
│   ├── main.js
│   └── style.css                     # Tailwind v4 Configuration
├── capacitor.config.json      # Konfigurasi Capacitor Android (org.lpnu.sumenep.saleha)
├── firestore.rules            # Keamanan Firestore berbasis Role UMKM & Admin
├── package.json
└── vite.config.js             # Konfigurasi Vite + Tailwind v4
```

---

## 💻 Cara Menjalankan Proyek

### 1. Menjalankan di Browser (Development Mode)
```bash
npm run dev
```
Buka browser di alamat yang tampil (contoh: `http://localhost:5173` atau `http://localhost:5174`).

### 2. Build untuk Produksi
```bash
npm run build
```

### 3. Build & Jalankan di Android Studio (APK)
```bash
# Sinkronisasi aset web ke folder android
npm run cap:build

# Buka proyek di Android Studio untuk generate APK / Run ke HP
npm run cap:open
```

---

## ☁️ Integrasi Google Apps Script (GAS)

1. Buka [script.google.com](https://script.google.com) menggunakan akun Google Workspace PCNU Sumenep.
2. Buat proyek baru dan salin isi file [gas/Code.gs](file:///media/rasyiqi/7653717A1C07B131/SALEHA/gas/Code.gs).
3. Buat folder di Google Drive untuk foto KTP, Foto Produk, dan PDF Hasil, lalu masukkan ID-nya pada variabel `CONFIG` di baris atas skrip.
4. Klik **Deploy** $\rightarrow$ **New deployment** $\rightarrow$ Pilih **Web app**:
   - **Execute as:** *Me*
   - **Who has access:** *Anyone*
5. Salin URL Web App yang dihasilkan, lalu masukkan pada menu **Pengaturan (Ikon Roda Gigi di kanan atas)** di aplikasi SALEHA atau ke file `.env`.
