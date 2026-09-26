<template>
  <div class="pb-8 bg-slate-50 min-h-screen">
    
    <!-- Top Header Banner -->
    <div class="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white px-4 py-5 border-b border-emerald-950 shadow-xs">
      <div class="flex items-center justify-between mb-2">
        <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-700/60 text-[10px] text-emerald-200 font-semibold">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          Pusat Bantuan &amp; Edukasi UMKM
        </span>
        <button
          @click="handleSyncFromSheet"
          type="button"
          :disabled="store.isKontenBantuanLoading.value"
          title="Perbarui teks bantuan dari Google Sheets"
          class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-800/80 hover:bg-emerald-700 border border-emerald-600/70 text-[9.5px] text-emerald-100 font-medium active:scale-95 transition-all"
        >
          <span :class="{ 'animate-spin': store.isKontenBantuanLoading.value }">🔄</span>
          <span>{{ store.isKontenBantuanLoading.value ? 'Sinkron...' : 'Sync Sheet' }}</span>
        </button>
      </div>

      <h2 class="text-base font-black tracking-tight leading-snug">
        Panduan Legalitas Usaha
      </h2>
      <p class="text-xs text-emerald-100/90 mt-1 leading-relaxed">
        Layanan pendampingan NIB, Halal SEHATI, dan P-IRT gratis untuk kemandirian ekonomi Nahdliyin se-Kabupaten Sumenep.
      </p>

      <!-- Toast Notifikasi Pembaruan Konten -->
      <div v-if="syncNotification" class="mt-2.5 p-1.5 px-2.5 bg-emerald-950/80 border border-emerald-600 rounded-lg text-[10.5px] text-emerald-200 flex items-center justify-between animate-fade-in">
        <span>{{ syncNotification }}</span>
        <button @click="syncNotification = ''" class="text-xs font-bold text-emerald-300 ml-2">✕</button>
      </div>
    </div>

    <!-- Quick Navigation Filter Chips -->
    <div class="px-3.5 py-2.5 bg-white border-b border-slate-200 flex gap-2 overflow-x-auto no-scrollbar text-xs">
      <button
        type="button"
        @click="activeSection = 'jenis'"
        class="px-3 py-1 rounded-full whitespace-nowrap transition-all font-semibold"
        :class="activeSection === 'jenis' ? 'bg-emerald-700 text-white shadow-2xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
      >
        📑 Jenis Legalitas
      </button>
      <button
        type="button"
        @click="activeSection = 'alur'"
        class="px-3 py-1 rounded-full whitespace-nowrap transition-all font-semibold"
        :class="activeSection === 'alur' ? 'bg-emerald-700 text-white shadow-2xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
      >
        🔄 Alur Pengurusan
      </button>
      <button
        type="button"
        @click="activeSection = 'faq'"
        class="px-3 py-1 rounded-full whitespace-nowrap transition-all font-semibold"
        :class="activeSection === 'faq' ? 'bg-emerald-700 text-white shadow-2xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
      >
        ❓ Tanya Jawab (FAQ)
      </button>
      <button
        type="button"
        @click="activeSection = 'kontak'"
        class="px-3 py-1 rounded-full whitespace-nowrap transition-all font-semibold"
        :class="activeSection === 'kontak' ? 'bg-emerald-700 text-white shadow-2xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
      >
        📍 Posko &amp; Kontak
      </button>
    </div>

    <!-- MAIN CONTENT SECTIONS -->
    <div class="p-3.5 space-y-4">

      <!-- SECTION 1: JENIS LEGALITAS (ACCORDION DETAIL) -->
      <div v-show="activeSection === 'jenis' || activeSection === 'all'" class="space-y-3">
        <div class="flex items-center justify-between">
          <h3 class="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <span>📑</span>
            <span>Jenis &amp; Manfaat Legalitas</span>
          </h3>
          <span class="text-[10px] text-slate-400">Ketuk untuk lihat rincian</span>
        </div>

        <!-- 1. NIB Card -->
        <div class="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs transition-all">
          <div
            @click="toggleExpand('nib')"
            class="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-50/70 select-none"
          >
            <div class="flex items-center gap-2.5">
              <span class="px-2 py-0.5 rounded text-[10px] font-extrabold tracking-tight shrink-0 leading-none bg-emerald-100 text-emerald-800 border border-emerald-300">
                NIB
              </span>
              <div>
                <h4 class="text-xs font-bold text-slate-800">{{ nibData.judul }}</h4>
                <p class="text-[10.5px] text-slate-500 mt-0.5">Kementerian Investasi / BKPM RI</p>
              </div>
            </div>
            <span class="text-slate-400 text-xs transition-transform duration-200" :class="expanded === 'nib' ? 'rotate-180' : ''">
              ▼
            </span>
          </div>

          <div v-if="expanded === 'nib'" class="px-3.5 pb-3.5 pt-1 border-t border-slate-100 text-xs text-slate-600 space-y-2 bg-slate-50/40">
            <p class="leading-relaxed whitespace-pre-line">
              {{ nibData.deskripsi }}
            </p>
            <div v-if="nibData.syarat.length > 0" class="bg-white p-2.5 rounded-lg border border-slate-200 space-y-1">
              <span class="font-bold text-slate-800 block text-[11px]">Syarat Pengajuan:</span>
              <ul class="list-disc list-inside text-[11px] text-slate-600 space-y-0.5">
                <li v-for="(syarat, idx) in nibData.syarat" :key="idx">{{ syarat }}</li>
              </ul>
            </div>
            <div v-if="nibData.manfaat.length > 0" class="bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-200 space-y-1">
              <span class="font-bold text-emerald-900 block text-[11px]">Manfaat untuk UMKM:</span>
              <ul class="list-disc list-inside text-[11px] text-emerald-800 space-y-0.5">
                <li v-for="(manfaat, idx) in nibData.manfaat" :key="idx">{{ manfaat }}</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 2. HALAL SEHATI Card -->
        <div class="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs transition-all">
          <div
            @click="toggleExpand('halal')"
            class="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-50/70 select-none"
          >
            <div class="flex items-center gap-2.5">
              <span class="px-2 py-0.5 rounded text-[10px] font-extrabold tracking-tight shrink-0 leading-none bg-teal-100 text-teal-800 border border-teal-300">
                HALAL
              </span>
              <div>
                <h4 class="text-xs font-bold text-slate-800">{{ halalData.judul }}</h4>
                <p class="text-[10.5px] text-slate-500 mt-0.5">BPJPH Kementerian Agama RI</p>
              </div>
            </div>
            <span class="text-slate-400 text-xs transition-transform duration-200" :class="expanded === 'halal' ? 'rotate-180' : ''">
              ▼
            </span>
          </div>

          <div v-if="expanded === 'halal'" class="px-3.5 pb-3.5 pt-1 border-t border-slate-100 text-xs text-slate-600 space-y-2 bg-slate-50/40">
            <p class="leading-relaxed whitespace-pre-line">
              {{ halalData.deskripsi }}
            </p>
            <div v-if="halalData.syarat.length > 0" class="bg-white p-2.5 rounded-lg border border-slate-200 space-y-1">
              <span class="font-bold text-slate-800 block text-[11px]">Kriteria Produk yang Berhak:</span>
              <ul class="list-disc list-inside text-[11px] text-slate-600 space-y-0.5">
                <li v-for="(syarat, idx) in halalData.syarat" :key="idx">{{ syarat }}</li>
              </ul>
            </div>
            <div v-if="halalData.manfaat.length > 0" class="bg-teal-50/70 p-2.5 rounded-lg border border-teal-200 space-y-1">
              <span class="font-bold text-teal-900 block text-[11px]">Keuntungan Memiliki Label Halal:</span>
              <ul class="list-disc list-inside text-[11px] text-teal-800 space-y-0.5">
                <li v-for="(manfaat, idx) in halalData.manfaat" :key="idx">{{ manfaat }}</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 3. P-IRT Card -->
        <div class="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs transition-all">
          <div
            @click="toggleExpand('pirt')"
            class="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-50/70 select-none"
          >
            <div class="flex items-center gap-2.5">
              <span class="px-2 py-0.5 rounded text-[10px] font-extrabold tracking-tight shrink-0 leading-none bg-amber-100 text-amber-800 border border-amber-300">
                P-IRT
              </span>
              <div>
                <h4 class="text-xs font-bold text-slate-800">{{ pirtData.judul }}</h4>
                <p class="text-[10.5px] text-slate-500 mt-0.5">Dinas Kesehatan &amp; BPOM RI</p>
              </div>
            </div>
            <span class="text-slate-400 text-xs transition-transform duration-200" :class="expanded === 'pirt' ? 'rotate-180' : ''">
              ▼
            </span>
          </div>

          <div v-if="expanded === 'pirt'" class="px-3.5 pb-3.5 pt-1 border-t border-slate-100 text-xs text-slate-600 space-y-2 bg-slate-50/40">
            <p class="leading-relaxed whitespace-pre-line">
              {{ pirtData.deskripsi }}
            </p>
            <div v-if="pirtData.syarat.length > 0" class="bg-white p-2.5 rounded-lg border border-slate-200 space-y-1">
              <span class="font-bold text-slate-800 block text-[11px]">Contoh Produk P-IRT:</span>
              <ul class="list-disc list-inside text-[11px] text-slate-600 space-y-0.5">
                <li v-for="(syarat, idx) in pirtData.syarat" :key="idx">{{ syarat }}</li>
              </ul>
            </div>
            <div v-if="pirtData.manfaat.length > 0" class="bg-amber-50/70 p-2.5 rounded-lg border border-amber-200 space-y-1">
              <span class="font-bold text-amber-900 block text-[11px]">Catatan Penting:</span>
              <ul class="list-disc list-inside text-[11px] text-amber-800 space-y-0.5">
                <li v-for="(manfaat, idx) in pirtData.manfaat" :key="idx">{{ manfaat }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- SECTION 2: ALUR PENGURUSAN STEP-BY-STEP -->
      <div v-show="activeSection === 'alur' || activeSection === 'all'" class="space-y-3">
        <h3 class="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <span>🔄</span>
          <span>4 Langkah Alur Pendampingan</span>
        </h3>

        <div class="bg-white rounded-xl border border-slate-200 p-4 space-y-4">
          <!-- Step 1 -->
          <div class="flex gap-3">
            <div class="w-7 h-7 rounded-full bg-emerald-700 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
              1
            </div>
            <div class="flex-1">
              <h4 class="text-xs font-bold text-slate-800">Ajukan Tiket di Aplikasi SALEHA</h4>
              <p class="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                Pilih tab <strong>"Ajukan"</strong>, isi data nama usaha, alamat kecamatan/desa di Sumenep, serta unggah foto KTP dan produk usaha.
              </p>
            </div>
          </div>

          <!-- Step 2 -->
          <div class="flex gap-3">
            <div class="w-7 h-7 rounded-full bg-emerald-700 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
              2
            </div>
            <div class="flex-1">
              <h4 class="text-xs font-bold text-slate-800">Verifikasi &amp; Klaim Operator LPNU</h4>
              <p class="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                Petugas operator LPNU di kecamatan atau PCNU Sumenep akan memverifikasi berkas Anda. Jika ada kekurangan, notifikasi revisi akan dikirim via aplikasi.
              </p>
            </div>
          </div>

          <!-- Step 3 -->
          <div class="flex gap-3">
            <div class="w-7 h-7 rounded-full bg-emerald-700 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
              3
            </div>
            <div class="flex-1">
              <h4 class="text-xs font-bold text-slate-800">Pendaftaran ke Sistem Pemerintah</h4>
              <p class="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                Operator mendaftarkan izin ke portal resmi: OSS-RBA (BKPM), SIHALAL (BPJPH Kemenag), atau SPP-IRT (Dinkes).
              </p>
            </div>
          </div>

          <!-- Step 4 -->
          <div class="flex gap-3">
            <div class="w-7 h-7 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
              ✓
            </div>
            <div class="flex-1">
              <h4 class="text-xs font-bold text-emerald-800">Sertifikat Terbit &amp; Siap Diunduh</h4>
              <p class="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                Setelah disetujui, file PDF sertifikat legalitas Anda akan otomatis tersimpan di tab <strong>"Brankas"</strong> dan siap dicetak kapan saja.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- SECTION 3: FAQ (TANYA JAWAB SERING DITANYAKAN) -->
      <div v-show="activeSection === 'faq' || activeSection === 'all'" class="space-y-3">
        <h3 class="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <span>❓</span>
          <span>Pertanyaan Sering Diajukan (FAQ)</span>
        </h3>

        <div class="space-y-2">
          <!-- FAQ Loop -->
          <div
            v-for="(faq, fIdx) in faqList"
            :key="fIdx"
            class="bg-white rounded-xl border border-slate-200 p-3 shadow-2xs"
          >
            <h4 class="text-xs font-bold text-slate-800 flex items-start gap-1.5 leading-snug">
              <span class="text-emerald-700 font-black">Q:</span>
              <span>{{ faq.tanya }}</span>
            </h4>
            <p class="text-[11px] text-slate-600 mt-1.5 pl-4 leading-relaxed whitespace-pre-line">
              {{ faq.jawab }}
            </p>
          </div>
        </div>
      </div>

      <!-- SECTION 4: POSKO & KONTAK KONSULTASI -->
      <div v-show="activeSection === 'kontak' || activeSection === 'all'" class="space-y-3">
        <h3 class="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <span>📍</span>
          <span>Posko Layanan &amp; Konsultasi</span>
        </h3>

        <!-- Posko Card -->
        <div class="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3">
          <div class="flex items-start gap-3">
            <div class="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-lg shrink-0">
              🏢
            </div>
            <div>
              <h4 class="text-xs font-bold text-slate-800">{{ poskoData.judul }}</h4>
              <p class="text-[11px] text-slate-500 mt-0.5 leading-snug whitespace-pre-line">
                {{ poskoData.deskripsi }}
              </p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-[10.5px]">
            <div class="bg-slate-50 p-2 rounded-lg border border-slate-200">
              <span class="text-slate-400 block font-medium">Hari Kerja:</span>
              <span class="font-bold text-slate-700">{{ poskoData.hari }}</span>
            </div>
            <div class="bg-slate-50 p-2 rounded-lg border border-slate-200">
              <span class="text-slate-400 block font-medium">Jam Layanan:</span>
              <span class="font-bold text-slate-700">{{ poskoData.jam }}</span>
            </div>
          </div>

          <!-- Direct WhatsApp Button -->
          <a
            href="https://api.whatsapp.com/send?phone=6281234567890&text=Halo%20LPNU%20PCNU%20Sumenep,%20saya%20ingin%20konsultasi%20pendampingan%20legalitas%20usaha%20SALEHA."
            target="_blank"
            rel="noopener noreferrer"
            class="w-full py-2.5 px-3 bg-emerald-800 hover:bg-emerald-900 active:scale-98 text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition-all"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
            <span>Hubungi Hotline Pendamping LPNU</span>
          </a>
        </div>
      </div>

    </div>

    <!-- Copyright & Credits Footer -->
    <div class="text-center pt-2 pb-8 space-y-0.5">
      <p class="text-[9.5px] text-slate-400 font-medium flex items-center justify-center gap-1.5 flex-wrap">
        <span>© 2026 SALEHA</span>
        <VersionBadge @longpress="showAdminModal = true" />
        <span>· LPNU PCNU Kabupaten Sumenep</span>
      </p>
      <p class="text-[9.5px] text-slate-400">
        Dibuat dengan ❤️ oleh <a href="https://situsbisnis.com/@rasyiqi/" target="_blank" rel="noopener noreferrer" class="font-bold text-emerald-800 hover:underline">Rasyiqi</a> · <a href="https://crediblemark.com" target="_blank" rel="noopener noreferrer" class="text-slate-400 hover:text-emerald-800 hover:underline">crediblemark.com</a>
      </p>
    </div>

    <!-- Modal Jalur Login Administrator (Secret Easter Egg via Long-Press Nomor Versi) -->
    <ModalAdminLogin
      v-if="showAdminModal"
      @close="showAdminModal = false"
    />

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useSalehaStore } from '../composables/useSalehaStore';
import VersionBadge from './VersionBadge.vue';
import ModalAdminLogin from './ModalAdminLogin.vue';

const store = useSalehaStore();

const activeSection = ref('all');
const expanded = ref('nib'); // default open NIB
const showAdminModal = ref(false);
const syncNotification = ref('');

function toggleExpand(key) {
  expanded.value = expanded.value === key ? null : key;
}

async function handleSyncFromSheet() {
  syncNotification.value = '';
  const list = await store.refreshKontenBantuan();
  if (list && list.length > 0) {
    syncNotification.value = `Berhasil menyinkronkan ${list.length} item panduan dari Google Sheets.`;
  } else {
    syncNotification.value = 'Teks panduan diperbarui ke data bawaan sistem.';
  }
  setTimeout(() => {
    syncNotification.value = '';
  }, 4000);
}

// 1. Data NIB Dinamis (Sheet Key: "NIB")
const nibData = computed(() => {
  const item = store.getKontenBantuanItem('NIB');
  return {
    judul: item?.judul || 'Nomor Induk Berusaha (OSS-RBA)',
    deskripsi: item?.deskripsi_utama || 'NIB adalah identitas resmi pelaku usaha yang menggantikan TDP, SIUP, dan IUI. Berlaku sebagai izin edar dasar bagi usaha skala mikro dan kecil berisiko rendah.',
    syarat: item?.poin_syarat ? item.poin_syarat.split('\n').filter(s => s.trim()) : [
      'KTP elektronik (NIK) pemilik usaha yang masih aktif.',
      'Nomor WhatsApp aktif untuk konfirmasi petugas.',
      'Email aktif (dibantu pembuatan jika belum punya).',
      'Foto tempat usaha atau proses produksi.'
    ],
    manfaat: item?.poin_manfaat ? item.poin_manfaat.split('\n').filter(s => s.trim()) : [
      'Syarat wajib pengajuan pinjaman KUR perbankan tanpa agunan.',
      'Mendapatkan perlindungan dan kepastian hukum berusaha.',
      'Syarat mutlak untuk mendaftar Sertifikasi Halal dan P-IRT.'
    ]
  };
});

// 2. Data Halal Dinamis (Sheet Key: "HALAL")
const halalData = computed(() => {
  const item = store.getKontenBantuanItem('HALAL');
  return {
    judul: item?.judul || 'Sertifikat Halal (SEHATI BPJPH)',
    deskripsi: item?.deskripsi_utama || 'Program Sertifikasi Halal Gratis (SEHATI) jalur Self-Declare untuk usaha mikro dan kecil dengan pendampingan langsung oleh Petugas Pendamping Produk Halal (P3H) LPNU.',
    syarat: item?.poin_syarat ? item.poin_syarat.split('\n').filter(s => s.trim()) : [
      'Produk makanan/minuman dengan bahan baku tidak berisiko (non-sembelihan hewan mandiri).',
      'Bahan baku sudah bersertifikat halal atau terdaftar dalam positive list BPJPH.',
      'Proses pengolahan sederhana dan higienis.',
      'Memiliki NIB yang telah terbit.'
    ],
    manfaat: item?.poin_manfaat ? item.poin_manfaat.split('\n').filter(s => s.trim()) : [
      'Meningkatkan kepercayaan konsumen dan berkah usaha bagi masyarakat Nahdliyin.',
      'Memenuhi kewajiban sertifikasi halal sesuai UU Jaminan Produk Halal.',
      'Membuka peluang masuk ke toko swalayan, oleh-oleh haji/umrah, dan minimarket modern.'
    ]
  };
});

// 3. Data PIRT Dinamis (Sheet Key: "PIRT")
const pirtData = computed(() => {
  const item = store.getKontenBantuanItem('PIRT');
  return {
    judul: item?.judul || 'Sertifikat P-IRT (Dinas Kesehatan)',
    deskripsi: item?.deskripsi_utama || 'Izin Edar Pangan Industri Rumah Tangga (SPP-IRT) adalah jaminan bahwa produk makanan dan minuman olahan rumahan di Kabupaten Sumenep telah memenuhi standar higiene sanitasi pangan.',
    syarat: item?.poin_syarat ? item.poin_syarat.split('\n').filter(s => s.trim()) : [
      'Kerupuk, rengginang lorjuk, keripik singkong, kacang asin khas Sumenep.',
      'Kue kering, roti kering, biskuit, dan olahan tepung.',
      'Minuman serbuk jahe, kopi bubuk, jamu serbuk, dan gula aren semut.'
    ],
    manfaat: item?.poin_manfaat ? item.poin_manfaat.split('\n').filter(s => s.trim()) : [
      'Produk dengan ketahanan simpan kurang dari 7 hari atau olahan daging beku (frozen food) masuk ke kategori izin BPOM langsung.'
    ]
  };
});

// 4. Data FAQ Dinamis (Sheet Key: "FAQ_1", "FAQ_2", ...)
const faqList = computed(() => {
  const list = [];
  const defaultFaq = [
    {
      tanya: 'Apakah pendampingan dari LPNU dipungut biaya?',
      jawab: 'Tidak dipungut biaya (Gratis) untuk pengurusan NIB dan Sertifikasi Halal skema SEHATI (Self-Declare) bagi pelaku UMKM Nahdliyin skala mikro dan kecil se-Kabupaten Sumenep.'
    },
    {
      tanya: 'Berapa lama waktu proses hingga izin terbit?',
      jawab: '• NIB: 1–3 hari kerja jika berkas identitas dan KBLI lengkap.\n• Halal SEHATI: 7–21 hari kerja (mengikuti alur verifikasi BPJPH dan fatwa MUI).\n• P-IRT: 3–7 hari kerja setelah peninjauan Dinkes.'
    },
    {
      tanya: 'Bagaimana jika saya belum memiliki email aktif?',
      jawab: 'Anda tidak perlu khawatir. Petugas operator LPNU di kecamatan Anda akan memandu dan membantu pembuatan akun email resmi khusus untuk aktivasi portal OSS pemerintah.'
    },
    {
      tanya: 'Apakah pelaku usaha di kepulauan Sumenep bisa ikut?',
      jawab: 'Tentu bisa! Layanan SALEHA mencakup seluruh 27 kecamatan di Kabupaten Sumenep, baik wilayah daratan maupun kepulauan (Kangean, Sapeken, Masalembu, Raas, Gayam, Nonggunong, dll.) secara daring penuh.'
    }
  ];

  for (let i = 1; i <= 4; i++) {
    const item = store.getKontenBantuanItem(`FAQ_${i}`);
    if (item && item.judul && item.deskripsi_utama) {
      list.push({
        tanya: item.judul,
        jawab: item.deskripsi_utama
      });
    } else {
      list.push(defaultFaq[i - 1]);
    }
  }

  // Tambahan FAQ kustom lain dari sheet jika ada
  const allItems = store.kontenBantuanList.value || [];
  allItems.forEach(item => {
    const key = (item.id_key || '').toUpperCase();
    if (key.startsWith('FAQ_') && !['FAQ_1', 'FAQ_2', 'FAQ_3', 'FAQ_4'].includes(key)) {
      list.push({
        tanya: item.judul,
        jawab: item.deskripsi_utama
      });
    }
  });

  return list;
});

// 5. Data Posko Dinamis (Sheet Key: "POSKO")
const poskoData = computed(() => {
  const item = store.getKontenBantuanItem('POSKO');
  return {
    judul: item?.judul || 'Posko Pusat LPNU PCNU Sumenep',
    deskripsi: item?.deskripsi_utama || 'Gedung PCNU Kabupaten Sumenep\nJl. Trunojoyo No. 295, Gedungan, Kec. Batuan, Kabupaten Sumenep, Jawa Timur 69451',
    hari: item?.poin_syarat || 'Senin – Sabtu',
    jam: item?.poin_manfaat || '08.00 – 16.00 WIB'
  };
});
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.2s ease-out forwards;
}
</style>
