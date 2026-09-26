<template>
  <div class="pb-6 bg-slate-50">
    
    <!-- Top Compact Header (Edge-to-edge) -->
    <div class="bg-emerald-900 text-white px-3.5 py-3 border-b border-emerald-950 flex items-center justify-between">
      <div>
        <span class="text-[10px] text-emerald-300 uppercase tracking-wider font-semibold block leading-none">
          Portal UMKM Nahdliyin
        </span>
        <h2 class="text-sm font-extrabold text-white mt-0.5 truncate max-w-[210px]">
          Assalamu'alaikum, {{ store.currentUmkmUser.value?.namaPemilik?.split(' ')[0] || 'Sahabat' }}
        </h2>
      </div>

      <span class="text-[10px] bg-emerald-800 text-emerald-200 border border-emerald-700/80 px-2 py-0.5 rounded-full font-bold">
        Sumenep
      </span>
    </div>

    <!-- Announcement Banner LPNU (Real-time Broadcast from Admin) -->
    <div
      v-if="activePengumuman"
      @click="selectedPengumuman = activePengumuman"
      class="bg-gradient-to-r from-amber-50 via-amber-100/70 to-orange-50 border-b border-amber-200/90 px-3.5 py-2.5 flex items-center justify-between gap-2.5 cursor-pointer hover:bg-amber-100/90 active:bg-amber-200/60 transition-colors shadow-2xs"
    >
      <div class="flex items-start gap-2.5 min-w-0">
        <div class="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
          📢
        </div>
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-1.5 leading-none">
            <span
              class="px-1.5 py-0.2 rounded text-[8.5px] font-extrabold uppercase tracking-wider"
              :class="getBadgeClass(activePengumuman.kategori)"
            >
              {{ activePengumuman.kategori || 'INFO' }}
            </span>
            <span class="text-[9.5px] text-amber-900 font-bold truncate">
              Pengumuman LPNU
            </span>
          </div>
          <h4 class="text-xs font-bold text-slate-900 truncate mt-1 leading-tight">
            {{ activePengumuman.judul }}
          </h4>
          <p class="text-[10px] text-slate-600 truncate mt-0.5">
            {{ activePengumuman.isi }}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-1 shrink-0 text-amber-800 font-bold text-[10px]">
        <span class="hidden sm:inline">Lihat</span>
        <svg class="w-3.5 h-3.5 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </div>
    </div>

    <!-- Quick Action 3-Services Grid (Directly touching header/banner, no gap) -->
    <div class="bg-white border-b border-slate-200 p-3.5">
      <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2 leading-none">
        Pilih Layanan Pendampingan Gratis
      </span>

      <div class="grid grid-cols-3 gap-2">
        <!-- NIB -->
        <button
          @click="$emit('switchTab', 'pengajuan')"
          type="button"
          class="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/60 active:scale-95 transition-all text-left flex flex-col justify-between"
        >
          <div class="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center mb-2 shadow-xs shrink-0">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <div>
            <span class="text-xs font-bold text-slate-900 block leading-tight">NIB OSS</span>
            <span class="text-[9px] text-emerald-800 font-semibold block mt-0.5">Identitas Usaha</span>
          </div>
        </button>

        <!-- HALAL -->
        <button
          @click="$emit('switchTab', 'pengajuan')"
          type="button"
          class="p-2.5 rounded-xl border border-teal-200 bg-teal-50/60 active:scale-95 transition-all text-left flex flex-col justify-between"
        >
          <div class="w-8 h-8 rounded-lg bg-teal-700 text-white flex items-center justify-center mb-2 shadow-xs shrink-0">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
            </svg>
          </div>
          <div>
            <span class="text-xs font-bold text-slate-900 block leading-tight">Sertif Halal</span>
            <span class="text-[9px] text-teal-800 font-semibold block mt-0.5">SEHATI BPJPH</span>
          </div>
        </button>

        <!-- P-IRT -->
        <button
          @click="$emit('switchTab', 'pengajuan')"
          type="button"
          class="p-2.5 rounded-xl border border-amber-200 bg-amber-50/60 active:scale-95 transition-all text-left flex flex-col justify-between"
        >
          <div class="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center mb-2 shadow-xs shrink-0">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
            </svg>
          </div>
          <div>
            <span class="text-xs font-bold text-slate-900 block leading-tight">Izin P-IRT</span>
            <span class="text-[9px] text-amber-800 font-semibold block mt-0.5">Dinkes Pangan</span>
          </div>
        </button>
      </div>
    </div>

    <!-- Active Permohonan Quick Widget (Directly touching grid) -->
    <div class="bg-white border-b border-slate-200 p-3.5">
      <div class="flex items-center justify-between mb-2">
        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block leading-none">
          Status Terakhir Anda
        </span>
        <button
          @click="$emit('switchTab', 'tracking')"
          type="button"
          class="text-[10px] font-bold text-emerald-700 hover:underline"
        >
          Lihat Semua ({{ store.myPermohonan.value.length }}) ↗
        </button>
      </div>

      <!-- If has ticket -->
      <div
        v-if="latestTicket"
        @click="$emit('switchTab', 'tracking')"
        class="p-2.5 rounded-xl bg-slate-50 border border-slate-200/90 flex items-center justify-between gap-2 cursor-pointer active:bg-slate-100 transition-colors"
      >
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-1.5">
            <span class="font-mono text-[10px] font-bold text-slate-700 bg-white px-1.5 py-0.2 rounded border border-slate-200">
              {{ latestTicket.id_ticket }}
            </span>
            <StatusBadge :status="latestTicket.status" />
          </div>
          <h4 class="text-xs font-bold text-slate-900 truncate mt-1">
            {{ latestTicket.nama_usaha }}
          </h4>
        </div>
        <svg class="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </div>

      <!-- If no ticket -->
      <div v-else class="text-center py-3">
        <p class="text-xs font-bold text-slate-700">Belum ada pengajuan aktif</p>
        <button
          @click="$emit('switchTab', 'pengajuan')"
          type="button"
          class="mt-1.5 px-3 py-1 bg-emerald-700 text-white rounded-lg text-[10px] font-bold"
        >
          Daftarkan Usaha Sekarang
        </button>
      </div>
    </div>

    <!-- Info Program LPNU PCNU (Directly touching widget, divide-y) -->
    <div class="bg-white border-b border-slate-200 divide-y divide-slate-100">
      
      <!-- Point 1: 100% Gratis -->
      <div class="p-3.5 flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
          ✓
        </div>
        <div>
          <h5 class="text-xs font-bold text-slate-900 leading-tight">100% Bebas Biaya Pendampingan</h5>
          <p class="text-[10px] text-slate-500 mt-0.5 leading-snug">
            Inisiatif khidmat PCNU Sumenep untuk menguatkan ekonomi Nahdliyin.
          </p>
        </div>
      </div>

      <!-- Point 2: 27 Kecamatan -->
      <div class="p-3.5 flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs shrink-0">
          📍
        </div>
        <div>
          <h5 class="text-xs font-bold text-slate-900 leading-tight">Menjangkau Daratan & Kepulauan</h5>
          <p class="text-[10px] text-slate-500 mt-0.5 leading-snug">
            Dari Kota Sumenep hingga Kangean, Sapeken, Masalembu, dan Sepudi.
          </p>
        </div>
      </div>

      <!-- Point 3: Posko Bantuan -->
      <div class="p-3.5 flex items-center justify-between gap-2 bg-slate-50/70">
        <div>
          <h5 class="text-xs font-bold text-slate-900 leading-tight">Posko Konsultasi LPNU</h5>
          <p class="text-[10px] text-slate-500 mt-0.5">Gedung PCNU Jl. Trunojoyo No. 295 Sumenep</p>
        </div>
        <a
          href="https://api.whatsapp.com/send?phone=6281234567890&text=Konsultasi%20SALEHA"
          target="_blank"
          class="shrink-0 px-2.5 py-1.5 bg-emerald-800 text-white rounded-lg text-[10px] font-bold"
        >
          Hubungi WA
        </a>
      </div>

    </div>

    <!-- Copyright & Credits -->
    <div class="text-center pt-2 pb-6 space-y-0.5">
      <p class="text-[9.5px] text-slate-400 font-medium flex items-center justify-center gap-1.5 flex-wrap">
        <span>© 2026 SALEHA</span>
        <VersionBadge @longpress="showAdminModal = true" />
        <span>· LPNU PCNU Kabupaten Sumenep</span>
      </p>
      <p class="text-[9.5px] text-slate-400">Dibuat dengan ❤️ oleh <a href="https://situsbisnis.com/@rasyiqi/" target="_blank" rel="noopener noreferrer" class="font-bold text-emerald-800 hover:underline">Rasyiqi</a> · <a href="https://crediblemark.com" target="_blank" rel="noopener noreferrer" class="text-slate-400 hover:text-emerald-800 hover:underline">crediblemark.com</a></p>
    </div>

    <!-- Modal Jalur Login Administrator (Secret Easter Egg via Long-Press) -->
    <ModalAdminLogin
      v-if="showAdminModal"
      @close="showAdminModal = false"
    />

    <!-- Modal Detail Pengumuman LPNU -->
    <ModalDetailPengumuman
      :is-open="!!selectedPengumuman"
      :pengumuman="selectedPengumuman"
      @close="selectedPengumuman = null"
    />

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useSalehaStore } from '../composables/useSalehaStore';
import StatusBadge from './StatusBadge.vue';
import VersionBadge from './VersionBadge.vue';
import ModalAdminLogin from './ModalAdminLogin.vue';
import ModalDetailPengumuman from './ModalDetailPengumuman.vue';

defineEmits(['switchTab']);

const store = useSalehaStore();
const showAdminModal = ref(false);
const selectedPengumuman = ref(null);

// Ambil pengumuman pertama yang aktif
const activePengumuman = computed(() => {
  const list = store.pengumumanList.value || [];
  return list.find(p => p.status_aktif !== false) || null;
});

function getBadgeClass(kategori) {
  switch ((kategori || '').toUpperCase()) {
    case 'PENTING':
      return 'bg-rose-100 text-rose-800 border border-rose-300';
    case 'SEHATI':
      return 'bg-teal-100 text-teal-800 border border-teal-300';
    case 'PELATIHAN':
      return 'bg-indigo-100 text-indigo-800 border border-indigo-300';
    case 'BAZAR':
      return 'bg-amber-100 text-amber-800 border border-amber-300';
    default:
      return 'bg-emerald-100 text-emerald-800 border border-emerald-300';
  }
}

const latestTicket = computed(() => {
  return store.myPermohonan.value[0] || null;
});
</script>
