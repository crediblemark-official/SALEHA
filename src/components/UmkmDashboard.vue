<template>
  <div class="pb-6 bg-slate-50">
    
    <!-- Top Compact Header (Directly connected to Stats) -->
    <div class="bg-emerald-900 text-white px-3.5 py-3 flex items-center justify-between border-b border-emerald-950">
      <div>
        <span class="text-[10px] text-emerald-300 uppercase tracking-wider font-semibold block leading-none">
          Warga Nahdliyin
        </span>
        <h2 class="text-sm font-extrabold text-white mt-0.5 truncate max-w-[210px]">
          {{ store.currentUmkmUser.value?.namaPemilik || 'Pelaku Usaha' }}
        </h2>
      </div>

      <button
        @click="$emit('switchTab', 'pengajuan')"
        type="button"
        class="px-3 py-1.5 bg-amber-400 active:bg-amber-500 text-emerald-950 font-bold text-xs rounded-lg flex items-center gap-1 shadow-xs"
      >
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"></path>
        </svg>
        <span>Ajukan</span>
      </button>
    </div>

    <!-- 1-Row Compact Stats Strip (Directly touching header, no space) -->
    <div class="grid grid-cols-4 bg-white border-b border-slate-200 divide-x divide-slate-100 text-center py-2 px-1">
      <div>
        <span class="text-[10px] text-slate-400 font-medium block">Total</span>
        <span class="text-sm font-black text-slate-800">{{ store.myPermohonan.value.length }}</span>
      </div>
      <div>
        <span class="text-[10px] text-blue-600 font-medium block">Proses</span>
        <span class="text-sm font-black text-blue-600">
          {{ store.myPermohonan.value.filter(p => p.status === 'DIPROSES' || p.status === 'BARU').length }}
        </span>
      </div>
      <div>
        <span class="text-[10px] text-rose-600 font-medium block">Revisi</span>
        <span class="text-sm font-black text-rose-600">
          {{ store.myPermohonan.value.filter(p => p.status === 'BUTUH_REVISI').length }}
        </span>
      </div>
      <div>
        <span class="text-[10px] text-emerald-600 font-medium block">Terbit</span>
        <span class="text-sm font-black text-emerald-600">
          {{ store.myPermohonan.value.filter(p => p.status === 'SELESAI').length }}
        </span>
      </div>
    </div>

    <!-- Section Sub-Header (Integrated, no gap) -->
    <div class="px-3.5 py-2 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
      <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
        Daftar Tiket Permohonan
      </span>
      <span class="text-[10px] text-slate-400 font-medium">Real-time</span>
    </div>

    <!-- Empty State -->
    <div v-if="store.myPermohonan.value.length === 0" class="p-8 text-center bg-white border-b border-slate-200">
      <p class="text-xs font-bold text-slate-700">Belum ada pengajuan izin.</p>
      <button
        @click="$emit('switchTab', 'pengajuan')"
        type="button"
        class="mt-2 text-xs font-bold text-emerald-700 underline"
      >
        Mulai Ajukan Legalitas
      </button>
    </div>

    <!-- Full Edge Ticket Rows (Divide-y list, seamless) -->
    <div v-else class="bg-white border-b border-slate-200 divide-y divide-slate-100">
      
      <div
        v-for="item in store.myPermohonan.value"
        :key="item.id_ticket"
        class="p-3.5 space-y-2 hover:bg-slate-50/80 transition-colors"
      >
        <!-- Row 1: ID, Date, Status -->
        <div class="flex items-center justify-between text-xs">
          <div class="flex items-center gap-1.5">
            <span class="font-mono text-[11px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
              {{ item.id_ticket }}
            </span>
            <span class="text-[10px] text-slate-400">• {{ formatDate(item.created_at) }}</span>
          </div>
          <StatusBadge :status="item.status" />
        </div>

        <!-- Row 2: Nama Usaha & Lokasi -->
        <div class="flex items-baseline justify-between gap-2">
          <h4 class="text-sm font-extrabold text-slate-900 leading-snug truncate">
            {{ item.nama_usaha }}
          </h4>
          <span class="text-[10px] text-slate-500 shrink-0 font-medium">
            Kec. {{ item.alamat_usaha?.kecamatan }}
          </span>
        </div>

        <!-- Row 3: Jenis Izin & Petugas Pendamping -->
        <div class="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
          <div class="flex items-center gap-1 flex-wrap">
            <span
              v-for="iz in item.jenis_izin"
              :key="iz"
              class="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/80"
            >
              {{ iz }}
            </span>
          </div>
          <span class="text-[10px] text-slate-400 truncate max-w-[150px]">
            {{ item.operator_assigned ? 'Petugas: ' + item.operator_assigned : 'Menunggu antrean' }}
          </span>
        </div>

        <!-- Compact Revision Strip if BUTUH_REVISI -->
        <div v-if="item.status === 'BUTUH_REVISI'" class="p-2 bg-rose-50 border border-rose-200 rounded-lg flex items-center justify-between gap-2">
          <p class="text-[11px] text-rose-800 font-medium truncate flex-1 leading-none">
            {{ item.catatan_lpnu || 'Perlu foto KTP ulang yang jelas.' }}
          </p>
          <button
            @click="openRevisiModal(item)"
            type="button"
            class="shrink-0 px-2 py-1 bg-rose-600 active:bg-rose-700 text-white rounded text-[10px] font-bold"
          >
            Upload Ulang
          </button>
        </div>

        <!-- Direct Link to Brankas if SELESAI -->
        <div v-if="item.status === 'SELESAI'" class="pt-0.5 flex justify-end">
          <button
            @click="$emit('switchTab', 'brankas')"
            type="button"
            class="text-[11px] font-bold text-emerald-700 hover:underline flex items-center gap-1"
          >
            Lihat & Download Sertifikat ↗
          </button>
        </div>

      </div>

    </div>

    <!-- Modal Revisi -->
    <ModalRevisi
      :isOpen="showRevisiModal"
      :ticket="activeTicketForRevisi"
      @close="showRevisiModal = false"
    />

  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useSalehaStore } from '../composables/useSalehaStore';
import StatusBadge from './StatusBadge.vue';
import ModalRevisi from './ModalRevisi.vue';

defineEmits(['switchTab']);

const store = useSalehaStore();
const showRevisiModal = ref(false);
const activeTicketForRevisi = ref(null);

function formatDate(isoStr) {
  if (!isoStr) return '-';
  try {
    const d = new Date(isoStr);
    return `${d.getDate()}/${d.getMonth() + 1}`;
  } catch (e) {
    return isoStr;
  }
}

function openRevisiModal(ticket) {
  activeTicketForRevisi.value = ticket;
  showRevisiModal.value = true;
}
</script>
