# Product Requirement Document (PRD)
## SALEHA (Sadar Legalitas Usaha)
**Platform Pendampingan & Fasilitasi Legalitas UMKM Nahdliyin PCNU Sumenep**

---

| Metadata Dokumen | Informasi |
| :--- | :--- |
| **Nama Produk** | SALEHA (*Sadar Legalitas Usaha*) |
| **Versi Dokumen** | 1.2.0 (Updated & Aligned with Implementation) |
| **Tanggal Pembaruan** | 26 September 2026 |
| **Inisiator & Pemilik** | Lembaga Perekonomian Nahdlatul Ulama (LPNU) PCNU Kabupaten Sumenep |
| **Target Platform** | Android Native (Capacitor: `org.lpnu.sumenep.saleha`) & PWA / Web Admin Panel |
| **Stack Teknologi** | Vue 3 + Vite + Tailwind CSS v4 + Capacitor Android + Firebase Firestore & Auth + Google Apps Script (GAS) + Google Drive & Sheets |

---

## 1. Executive Summary & Konteks

### 1.1 Problem Statement
Mayoritas pelaku UMKM Nahdliyin di Kabupaten Sumenep (tersebar di 18 kecamatan daratan dan 9 kecamatan kepulauan) belum mengantongi legalitas usaha dasar seperti **NIB (Nomor Induk Berusaha via OSS-RBA)**, **Sertifikat Halal (SEHATI BPJPH)**, maupun **P-IRT (Dinkes)**. Kendala utamanya adalah:
1. **Kesenjangan Literasi Digital:** Pelaku usaha kesulitan menavigasi portal OSS-RBA dan SIHALAL yang sarat istilah perizinan teknis (KBLI, self-declare, izin edar).
2. **Kendala Akun & Autentikasi:** Registrasi OSS mewajibkan akun email aktif. Seringkali UMKM tidak memiliki email, lupa kata sandi email, atau emailnya terkunci verifikasi dua faktor (2FA/Google prompt/OTP).
3. **Inefisiensi Pengurusan Manual:** Pengumpulan berkas lewat grup WhatsApp rawan tercecer, riwayat chat tertimpa, tim operator LPNU kewalahan merespons pertanyaan status permohonan, dan PCNU kesulitan memetakan sebaran data UMKM secara terpadu.

### 1.2 Visi Produk
**SALEHA** (*Sadar Legalitas Usaha*) dirancang sebagai platform layanan pendampingan penuh (*concierge legal aid*). Pelaku UMKM cukup mengunggah foto KTP, foto usaha, dan identitas dasar via aplikasi Android yang sangat sederhana. Seluruh proses teknis pendaftaran ke portal pemerintah (OSS-RBA, SIHALAL, Dinkes) dieksekusi di balik layar oleh Tim Operator LPNU PCNU Sumenep dan jajaran LPNU MWC (tingkat kecamatan).

### 1.3 Nilai Tambah Utama (Value Propositions)
* **"Terima Beres" untuk Nahdliyin:** Pelaku UMKM tidak perlu paham alur birokrasi OSS/KBLI yang rumit.
* **Opsi Fleksibel Akun OSS:** Pemohon dapat menggunakan email miliknya sendiri (dengan sistem panduan 2FA otomatis) atau memilih opsi dibuatkan email baru khusus usaha oleh petugas LPNU.
* **Pendampingan Berbasis Wilayah MWC NU:** Menghubungkan jaringan LPNU di 27 kecamatan se-Kabupaten Sumenep (Daratan & Kepulauan).
* **Efisiensi Anggaran (Zero Server Cost):** Memadukan Firebase Spark Plan (Auth & Firestore) dengan Google Workspace PCNU (Google Apps Script, Google Drive, & Google Sheets).
* **Database Ekonomi Terpusat:** Menghasilkan master data UMKM siap cetak dan rekapitulasi capaian legalitas per kecamatan untuk laporan LPJ PCNU Sumenep.

---

## 2. User Roles & Persona

| Role | Deskripsi & Peran | Tampilan Antarmuka | Autentikasi |
| :--- | :--- | :--- | :--- |
| **Pelaku UMKM (Pemohon)** | Warga Nahdliyin pelaku usaha mikro/kecil yang membutuhkan izin legalitas usaha. | Modul UMKM (Mobile-First, Compact, 5 Menu Navigasi) | Nomor WhatsApp / Phone Session |
| **Operator / Pendamping LPNU** | Petugas back-office LPNU PCNU & relawan LPNU MWC kecamatan yang mengurus OSS. | Modul Admin Back-Office (Task Feed, Modal Kredensial, Modal Status) | Email & Password Operator (`admin@lpnu-sumenep.or.id`) |
| **Super Admin / Pengurus PCNU** | Ketua LPNU / Pengurus Tanfidziyah PCNU Sumenep untuk monitoring & audit. | Dashboard Master & Google Sheets Sync | Google Workspace PCNU |

---

## 3. Arsitektur Sistem & Alur Integrasi

### 3.1 Diagram Arsitektur Hybrid

```
┌────────────────────────────────────────────────────────┐
│             APLIKASI SALEHA (Android / Web)            │
│   (Vite + Vue 3 + Tailwind v4 + Capacitor Android)     │
├──────────────────────────┬─────────────────────────────┤
│   Modul Mandiri UMKM     │    Modul Back-Office Admin  │
│  - Form Pengajuan & 2FA  │  - Feed Antrean Sebaris     │
│  - Pelacakan Status      │  - Modal Kredensial & 2FA   │
│  - Brankas Digital PDF   │  - Update Status & Catatan  │
│  - Posko Bantuan & MWC   │  - Export CSV Master PCNU   │
└────────────┬─────────────┴──────────────┬──────────────┘
             │                            │
             ▼                            ▼
┌──────────────────────────┐    ┌──────────────────────────┐
│   FIREBASE FIRESTORE     │    │ GOOGLE APPS SCRIPT (GAS) │
│ - Database Tiket Realtime│    │ - Upload Base64 to Drive │
│ - State Permohonan       │    │ - Sync to Google Sheets  │
└──────────────────────────┘    └─────────────┬────────────┘
                                              │
                      ┌───────────────────────┴───────────────────────┐
                      ▼                                               ▼
         ┌─────────────────────────┐                     ┌─────────────────────────┐
         │    GOOGLE DRIVE LPNU    │                     │   GOOGLE SHEETS MASTER  │
         │ - Penyimpanan Foto KTP  │                     │ - Backup Realtime Data  │
         │ - Penyimpanan Produk    │                     │ - Rekapitulasi per MWC  │
         │ - Penyimpanan PDF NIB   │                     │ - Format Cetak LPJ PCNU │
         └─────────────────────────┘                     └─────────────────────────┘
```

### 3.2 Alur Data & Perjalanan Pengajuan
1. **Pengajuan (UMKM):** Pemohon mengisi nama pemilik, NIK, nama usaha, memilih kecamatan (didukung *Searchable Picker* 27 kecamatan), memilih izin (NIB, Halal, P-IRT), serta menentukan preferensi akun OSS (email sendiri atau dibuatkan LPNU).
2. **Penyimpanan Berkas:** Foto KTP & Produk dikompresi di sisi HP, lalu diunggah via Google Apps Script (GAS) ke Google Drive LPNU. URL publik Drive disimpan ke Firestore.
3. **Backup Master Sheets:** Data tiket otomatis tersinkronisasi ke Google Sheets Master PCNU.
4. **Verifikasi & Eksekusi (Operator LPNU):**
   * Operator mengklaim tiket di Dashboard Admin.
   * Operator membuka **Modal Kredensial Email & 2FA** untuk melihat akun login OSS pemohon.
   * Jika pemohon memiliki 2FA aktif, operator menekan tombol **"📲 Minta OTP"** yang langsung memicu pesan WhatsApp otomatis ke pemohon untuk konfirmasi "Ketuk Ya" di HP atau kirim kode SMS.
   * Operator mendaftarkan izin ke portal OSS-RBA / SIHALAL.
5. **Penerbitan & Serah Terima:** Operator mengunggah link PDF NIB hasil terbit dan mengubah status ke `SELESAI`. Surat izin langsung tersedia di tab **Brankas Dokumen** UMKM.

---

## 4. Spesifikasi Fungsional (Functional Requirements)

### 4.1 Modul UMKM (Mobile-First Android UI)

#### F-UMKM-01: Navigasi Mobile-First & Struktur Layar
* **Container Mobile:** Dibatasi maksimal lebar layar smartphone (`max-w-md mx-auto`) dengan estetika *full-edge* tanpa padding mengambang berlebih.
* **5-Menu Bottom Navigation Bar:**
  1. **Home:** Ringkasan layanan izin (NIB, Halal, P-IRT), profil, dan widget cepat permohonan aktif.
  2. **Status:** Daftar pemantauan tiket real-time dengan filter status (`BARU`, `DIPROSES`, `REVISI`, `TERBIT`).
  3. **Ajukan (Tombol Tengah Menonjol):** Tombol aksi utama dengan latar hijau emerald dan ikon plus untuk membuka formulir pendaftaran.
  4. **Brankas:** Brankas digital tempat penyimpanan sertifikat resmi (NIB/Halal) dengan fitur *Download PDF* dan *Share WhatsApp*.
  5. **Bantuan:** Panduan persyaratan legalitas, FAQ, dan kontak Posko LPNU PCNU & LPNU MWC.

#### F-UMKM-02: Formulir Pengajuan Ringkas (1 Layar)
* **Identitas Pemilik:** Nama lengkap dan NIK (validasi tepat 16 digit angka).
* **Kontak WhatsApp:** Nomor aktif untuk notifikasi dan koordinasi perizinan.
* **Kredensial Akun OSS-RBA (Inovasi Fitur):**
  * Opsi 1: Centang *"Belum punya email? Buatkan baru oleh Petugas LPNU"* — Petugas akan membuatkan akun Google baru tanpa kendala 2FA dan menyerahkannya setelah NIB selesai.
  * Opsi 2: Input Alamat Email & Kata Sandi Email (dilengkapi toggle intip sandi) bagi pemohon yang sudah memiliki email.
  * Checkbox & Edukasi 2FA: *"Email saya pakai Verifikasi 2 Langkah (Google Prompt / OTP)"* untuk memberi sinyal pada operator.
* **Lokasi & Teritorial 27 Kecamatan (F-GEO-01):**
  * Komponen *Searchable Kecamatan Bottom-Sheet Modal* ([SearchableKecamatanModal.vue](file:///media/rasyiqi/7653717A1C07B131/SALEHA/src/components/SearchableKecamatanModal.vue)).
  * Mendukung pencarian cepat (*instant live search*) nama kecamatan.
  * Tab filter cepat: `Semua (27)`, `Daratan (18)`, dan `Kepulauan (9)`.
  * Integrasi label teritorial LPNU MWC (tingkat kecamatan).
  * Input Nama Desa / Kelurahan dan Alamat Detail.
* **Jenis Legalitas (Checklist Multi-Select):** NIB (OSS-RBA), Halal (SEHATI), P-IRT.
* **Unggah Foto Berkas (2 Tile Compact):** Foto KTP dan Foto Produk/Tempat Usaha dengan kompresi otomatis di sisi browser/klien sebelum transmisi Base64.

#### F-UMKM-03: Pelacakan Status & Revisi Mandiri
* Indikator warna status:
  * 🟡 `BARU`: Permohonan diterima sistem, menunggu verifikasi berkas.
  * 🔵 `DIPROSES`: Operator LPNU sedang mendaftarkan akun di OSS-RBA / SIHALAL.
  * 🔴 `BUTUH_REVISI`: KTP buram / data kurang; memunculkan kotak catatan LPNU dan tombol *Unggah Berkas Revisi*.
  * 🟢 `SELESAI`: Legalitas resmi telah terbit dan tersimpan di brankas digital.
* Menampilkan nama operator LPNU pendamping yang menangani tiket.

---

### 4.2 Modul Admin Back-Office LPNU

#### F-ADM-01: Header & KPI Strip
* Informasi identitas operator yang bertugas (contoh: *H. M. Syukron, M.E.*).
* 1-Row Compact KPI Strip: Menampilkan total permohonan, tiket baru, diproses, revisi, dan selesai secara real-time.
* Filter cepat pencarian keyword tiket/nama/NIK dan dropdown filter kecamatan se-Sumenep.
* Tombol **Export CSV Master PCNU** untuk rekapan offline.

#### F-ADM-02: Antrean Tiket Sebaris (Ultra-Compact Card Layout)
Setiap tiket dalam antrean didesain kompak dengan informasi padat tanpa membuang ruang layar:
* **Baris 1:** `ID Tiket` • `Kecamatan` • `👤 Operator` | `[Status Badge]`
* **Baris 2:** `Nama Usaha (Bold)` | `Nama Pemilik • Link WhatsApp ↗`
* **Baris 3 (Sebaris Penuh):**
  * **Sisi Kiri:** Tombol Modal Kredensial `[ 🔑 email@domain [2FA] ↗ ]`
  * **Sisi Kanan:** Tombol Aksi Cepat `[ KTP ↗ ]`, `[ Klaim ]`, dan `[ Proses ]`

#### F-ADM-03: Modal Kredensial Email & 2FA Concierge ([ModalKredensialEmail.vue](file:///media/rasyiqi/7653717A1C07B131/SALEHA/src/components/ModalKredensialEmail.vue))
* Mencegah tereksposnya kata sandi secara terbuka pada feed antrean utama.
* Menampilkan alamat email lengkap dengan tombol 1-klik **`Salin`** dan shortcut **`Gmail ↗`**.
* Menampilkan kata sandi dengan fitur sembunyikan/tampilkan (`••••••••`) dan tombol **`Salin Sandi`**.
* Menampilkan status verifikasi dua langkah (`🔐 2FA Aktif`).
* **Fitur Minta OTP / Ketuk Ya WhatsApp:**
  Tombol hijau satu klik yang otomatis menyusun dan membuka pesan WhatsApp resmi ke nomor pemohon:
  > *"Assalamu'alaikum wr. wb. Bapak/Ibu [Nama Pemilik], saya [Nama Operator] dari Tim Pendamping LPNU PCNU Sumenep sedang memproses pendaftaran izin usaha [Nama Usaha] ke portal OSS-RBA.*  
  > *Saat ini kami memerlukan verifikasi keamanan akun Google ([Email]).*  
  > *👉 Mohon bantuan ketuk 'YA / IZINKAN' pada notifikasi yang baru muncul di layar HP Anda, ATAU kirimkan kode OTP Google via SMS sekarang agar penerbitan NIB langsung selesai. Matur sakalangkong."*

#### F-ADM-04: Modal Update Status & Upload Hasil PDF ([ModalUpdateStatus.vue](file:///media/rasyiqi/7653717A1C07B131/SALEHA/src/components/ModalUpdateStatus.vue))
* Mengubah status operasional (`DIPROSES`, `BUTUH_REVISI`, `SELESAI`).
* Mengisi catatan instruksi perbaikan bagi pemohon.
* Input tautan/upload file PDF resmi hasil terbitan OSS yang langsung terhubung ke Brankas Dokumen pemohon.

---

## 5. Cakupan Wilayah: Lengkap 27 Kecamatan Kabupaten Sumenep

Sistem SALEHA mencakup seluruh 27 kecamatan resmi di Kabupaten Sumenep yang terbagi ke dalam 2 zona teritorial:

### 5.1 Wilayah Daratan (18 Kecamatan)
1. **Ambunten**
2. **Batang-Batang**
3. **Batuan**
4. **Batuputih**
5. **Bluto**
6. **Dasuk**
7. **Dungkek**
8. **Ganding**
9. **Gapura**
10. **Guluk-Guluk**
11. **Kalianget**
12. **Kota Sumenep**
13. **Lenteng**
14. **Manding**
15. **Pasongsongan**
16. **Pragaan**
17. **Rubaru**
18. **Saronggi**

### 5.2 Wilayah Kepulauan (9 Kecamatan)
19. **Arjasa** (Kepulauan Kangean)
20. **Gayam** (Kepulauan Sapudi)
21. **Giligenting** (Pulau Giligenting & Giliraja)
22. **Kangayan** (Kepulauan Kangean)
23. **Masalembu** (Kepulauan Masalembu)
24. **Nonggunong** (Kepulauan Sapudi)
25. **Raas** (Kepulauan Raas)
26. **Sapeken** (Kepulauan Sapeken)
27. **Talango** (Pulau Poteran)

---

## 6. Spesifikasi Database & Integrasi Eksternal

### 6.1 Skema Data Firestore: Koleksi `permohonan`
```json
{
  "_id": "doc_1727318000000",
  "id_ticket": "SLH-202609-0001",
  "user_id": "umkm_ahmad_01",
  "no_wa": "081234567890",
  "email": "ahmad.barokah@gmail.com",
  "password_email": "AhmadBarokah26!",
  "punya_2fa": true,
  "nama_pemilik": "Ahmad Fulan",
  "nik": "3529012304850001",
  "nama_usaha": "Kopi Sumenep Barokah",
  "alamat_usaha": {
    "desa": "Pandian",
    "kecamatan": "Kota Sumenep",
    "detail_alamat": "Jl. Trunojoyo No. 45"
  },
  "jenis_izin": ["NIB", "HALAL"],
  "foto_ktp_url": "https://drive.google.com/file/d/1abc.../view",
  "foto_produk_url": "https://drive.google.com/file/d/1xyz.../view",
  "status": "DIPROSES",
  "catatan_lpnu": "Berkas lengkap. Sedang proses input portal OSS-RBA.",
  "pdf_hasil_url": "",
  "operator_assigned": "H. M. Syukron, M.E.",
  "created_at": "2026-09-26T01:10:00.000Z",
  "updated_at": "2026-09-26T02:00:00.000Z"
}
```

### 6.2 Struktur Google Sheets Master Backup
Nama Spreadsheet: **`DATABASE_MASTER_SALEHA_PCNU`**

| Kolom | Field Header | Tipe Data | Deskripsi |
| :---: | :--- | :--- | :--- |
| **A** | `ID_Tiket` | String | Kode unik permohonan (`SLH-YYYYMM-XXXX`) |
| **B** | `Waktu_Pengajuan` | Datetime | Timestamp waktu pengiriman |
| **C** | `No_WhatsApp` | String | Nomor WA aktif pemohon |
| **D** | `Email_OSS` | String | Email untuk login OSS-RBA / Info Buatkan |
| **E** | `Status_2FA` | Enum | `AKTIF` atau `NONAKTIF` |
| **F** | `Nama_Pemilik` | String | Nama pemohon sesuai KTP |
| **G** | `NIK` | String | NIK 16 digit (format string `'3529...`) |
| **H** | `Nama_Usaha` | String | Merk / Nama usaha dagang |
| **I** | `Kecamatan` | String | Wilayah kecamatan di Sumenep (27 Kecamatan) |
| **J** | `Desa` | String | Desa / Kelurahan |
| **K** | `Jenis_Izin` | String | Pilihan izin: NIB / Halal / PIRT |
| **L** | `Status_Proses` | Enum | `BARU` / `DIPROSES` / `BUTUH_REVISI` / `SELESAI` |
| **M** | `Operator_LPNU` | String | Nama operator LPNU penanggung jawab |
| **N** | `Catatan_LPNU` | String | Catatan revisi atau pesan penyelesaian |
| **O** | `Link_KTP` | URL | URL foto KTP di Google Drive |
| **P** | `Link_PDF_Hasil` | URL | URL sertifikat/NIB resmi terbit |

---

## 7. Rencana Rilis & Eksekusi Lapangan

```
[ Minggu 1-2 ] ──> [ Minggu 3-4 ] ──> [ Minggu 5 ] ──> [ Minggu 6 ]
  Setup Infra       Mobile & Web       Integrasi GAS     Sosialisasi &
  Vite+Capacitor    Development        & Test 27 MWC     Launching PCNU
```

1. **Fase 1: Infrastruktur & Dasar UI (Selesai)**
   * Setup Vite + Vue 3 + Tailwind v4 + Capacitor Android.
   * Implementasi bottom navigation 5-menu dan kontainer mobile-first.
2. **Fase 2: Fitur Kredensial, 2FA & Teritorial 27 Kecamatan (Selesai)**
   * Form pengajuan compact dengan *Searchable Kecamatan Picker* (18 Daratan + 9 Kepulauan).
   * Fitur input email OSS + opsi buatkan email baru oleh LPNU.
   * Sistem penanganan 2FA & tombol otomatis minta OTP WhatsApp.
   * Redesain antrean tiket Admin Back-Office sebaris (*1-line actions*).
3. **Fase 3: Integrasi Backend & Layanan Google (Sedang Berjalan)**
   * Uji koneksi Google Apps Script (`gasService.js` & `Code.gs`) untuk unggah berkas Base64 ke Google Drive LPNU.
   * Sinkronisasi data permohonan ke Master Google Sheets PCNU.
4. **Fase 4: Uji Coba Lapangan & Pelatihan MWC (Mendatang)**
   * Uji coba bersama 5 koordinator LPNU MWC (Daratan & Kepulauan).
   * Sosialisasi resmi pada Rapat Kerja Cabang (Rakercab) LPNU PCNU Sumenep.

---

## 8. Indikator Keberhasilan (Key Performance Indicators)
* **Kecepatan Proses:** Waktu penyelesaian NIB $\le 2$ hari kerja sejak pengajuan terverifikasi.
* **Toleransi 2FA:** 100% kelancaran proses login akun pemohon ber-2FA melalui fasilitas template WhatsApp concierge tanpa kegagalan akses.
* **Cakupan Teritorial:** Menjangkau minimal 50 UMKM dari wilayah kepulauan (Kangean, Sapudi, Sapeken, Masalembu) dalam 3 bulan pertama rilis.
* **Kelengkapan Dokumen:** 0% kasus dokumen KTP/PDF tercecer berkat otomatisasi Brankas Digital & Google Drive.