// Data Wilayah Kabupaten Sumenep (Lengkap 27 Kecamatan: 18 Daratan + 9 Kepulauan)
export const KECAMATAN_SUMENEP = [
  // Wilayah Daratan (18 Kecamatan)
  { id: 'ambunten', nama: 'Ambunten', zona: 'Daratan' },
  { id: 'batang_batang', nama: 'Batang-Batang', zona: 'Daratan' },
  { id: 'batuan', nama: 'Batuan', zona: 'Daratan' },
  { id: 'batuputih', nama: 'Batuputih', zona: 'Daratan' },
  { id: 'bluto', nama: 'Bluto', zona: 'Daratan' },
  { id: 'dasuk', nama: 'Dasuk', zona: 'Daratan' },
  { id: 'dungkek', nama: 'Dungkek', zona: 'Daratan' },
  { id: 'ganding', nama: 'Ganding', zona: 'Daratan' },
  { id: 'gapura', nama: 'Gapura', zona: 'Daratan' },
  { id: 'guluk_guluk', nama: 'Guluk-Guluk', zona: 'Daratan' },
  { id: 'kalianget', nama: 'Kalianget', zona: 'Daratan' },
  { id: 'kota_sumenep', nama: 'Kota Sumenep', zona: 'Daratan' },
  { id: 'lenteng', nama: 'Lenteng', zona: 'Daratan' },
  { id: 'manding', nama: 'Manding', zona: 'Daratan' },
  { id: 'pasongsongan', nama: 'Pasongsongan', zona: 'Daratan' },
  { id: 'pragaan', nama: 'Pragaan', zona: 'Daratan' },
  { id: 'rubaru', nama: 'Rubaru', zona: 'Daratan' },
  { id: 'saronggi', nama: 'Saronggi', zona: 'Daratan' },

  // Wilayah Kepulauan (9 Kecamatan)
  { id: 'arjasa', nama: 'Arjasa (Kangean)', zona: 'Kepulauan' },
  { id: 'gayam', nama: 'Gayam (Sapudi)', zona: 'Kepulauan' },
  { id: 'giligenting', nama: 'Giligenting', zona: 'Kepulauan' },
  { id: 'kangayan', nama: 'Kangayan (Kangean)', zona: 'Kepulauan' },
  { id: 'masalembu', nama: 'Masalembu', zona: 'Kepulauan' },
  { id: 'nonggunong', nama: 'Nonggunong (Sapudi)', zona: 'Kepulauan' },
  { id: 'raas', nama: 'Raas', zona: 'Kepulauan' },
  { id: 'sapeken', nama: 'Sapeken', zona: 'Kepulauan' },
  { id: 'talango', nama: 'Talango (Poteran)', zona: 'Kepulauan' }
]

export const JENIS_IZIN = [
  {
    id: 'NIB',
    nama: 'NIB (Nomor Induk Berusaha)',
    lembaga: 'OSS-RBA Kementerian Investasi/BKPM',
    keterangan: 'Legalitas pokok identitas berusaha wajib bagi seluruh UMKM.',
    waktuEstimasi: '1 - 2 Hari Kerja',
    badgeColor: 'emerald'
  },
  {
    id: 'HALAL',
    nama: 'Sertifikat Halal (SEHATI)',
    lembaga: 'BPJPH Kemenag RI',
    keterangan: 'Program Sertifikasi Halal Gratis jalur self-declare dengan pendampingan LPNU.',
    waktuEstimasi: '3 - 7 Hari Kerja',
    badgeColor: 'teal'
  },
  {
    id: 'PIRT',
    nama: 'P-IRT (Pangan Industri Rumah Tangga)',
    lembaga: 'Dinas Kesehatan Kab. Sumenep / OSS',
    keterangan: 'Izin edar olahan makanan/minuman berisiko rendah skala rumahan.',
    waktuEstimasi: '3 - 5 Hari Kerja',
    badgeColor: 'amber'
  }
]

export const STATUS_PERMOHONAN = {
  BARU: {
    label: 'BARU / MENUNGGU',
    deskripsi: 'Data terkirim, menunggu verifikasi oleh Tim LPNU PCNU Sumenep',
    color: 'amber',
    bg: 'bg-amber-500/10 text-amber-700 border-amber-200',
    dot: 'bg-amber-500'
  },
  DIPROSES: {
    label: 'SEDANG DIPROSES',
    deskripsi: 'Operator LPNU sedang mendaftarkan ke portal OSS-RBA / SIHALAL',
    color: 'blue',
    bg: 'bg-blue-500/10 text-blue-700 border-blue-200',
    dot: 'bg-blue-500'
  },
  BUTUH_REVISI: {
    label: 'BUTUH REVISI',
    deskripsi: 'Berkas KTP/Foto kurang jelas. Mohon periksa catatan perbaikan.',
    color: 'rose',
    bg: 'bg-rose-500/10 text-rose-700 border-rose-200',
    dot: 'bg-rose-500'
  },
  SELESAI: {
    label: 'SELESAI / TERBIT',
    deskripsi: 'Legalitas resmi telah terbit dan tersimpan di brankas digital.',
    color: 'emerald',
    bg: 'bg-emerald-500/10 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500'
  }
}
