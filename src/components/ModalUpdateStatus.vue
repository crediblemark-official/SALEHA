<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-xs">
    <div class="bg-white rounded-2xl max-w-sm w-full p-4 shadow-xl border border-slate-200">
      
      <!-- Modal Header -->
      <div class="flex items-center justify-between pb-2 border-b border-slate-100">
        <div>
          <h3 class="font-extrabold text-slate-800 text-sm">Update Status Tiket</h3>
          <p class="text-[10px] text-slate-400 font-mono">{{ ticket?.id_ticket }} • {{ ticket?.nama_usaha }}</p>
        </div>
        <button @click="$emit('close')" class="text-slate-400 hover:text-slate-600 p-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <form @submit.prevent="handleSave" class="mt-3 space-y-3">
        
        <!-- Status Buttons -->
        <div>
          <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Status
          </label>
          <div class="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              @click="selectedStatus = 'DIPROSES'"
              class="py-1.5 px-1 rounded-lg border text-center text-[10px] font-bold transition-all"
              :class="selectedStatus === 'DIPROSES' ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-700 border-slate-200'"
            >
              Diproses
            </button>
            <button
              type="button"
              @click="selectedStatus = 'BUTUH_REVISI'"
              class="py-1.5 px-1 rounded-lg border text-center text-[10px] font-bold transition-all"
              :class="selectedStatus === 'BUTUH_REVISI' ? 'bg-rose-600 text-white border-rose-600' : 'bg-slate-50 text-slate-700 border-slate-200'"
            >
              Revisi
            </button>
            <button
              type="button"
              @click="selectedStatus = 'SELESAI'"
              class="py-1.5 px-1 rounded-lg border text-center text-[10px] font-bold transition-all"
              :class="selectedStatus === 'SELESAI' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 text-slate-700 border-slate-200'"
            >
              Selesai
            </button>
          </div>
        </div>

        <!-- Operator Name -->
        <div>
          <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
            Petugas Pendamping
          </label>
          <input
            v-model="operatorName"
            type="text"
            class="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-hidden"
          />
        </div>

        <!-- Catatan Operator -->
        <div>
          <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
            Catatan Petugas (Terlihat UMKM)
          </label>
          <textarea
            v-model="catatan"
            rows="2"
            placeholder="Info proses atau instruksi revisi..."
            class="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-hidden"
          ></textarea>
        </div>

        <!-- PDF Field jika SELESAI -->
        <div v-if="selectedStatus === 'SELESAI'" class="p-2 bg-emerald-50 border border-emerald-200 rounded-lg space-y-1">
          <label class="block text-[10px] font-bold text-emerald-900">
            Tautkan URL PDF Legalitas Resmi
          </label>
          <input
            v-model="pdfUrl"
            type="url"
            placeholder="https://drive.google.com/..."
            class="w-full text-xs p-1.5 bg-white border border-emerald-300 rounded focus:ring-1 focus:ring-emerald-600 focus:outline-hidden"
          />
        </div>

        <!-- Quick View Berkas -->
        <div class="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100">
          <span class="text-slate-400">Berkas:</span>
          <div class="flex gap-2">
            <a v-if="ticket?.foto_ktp_url" :href="ticket.foto_ktp_url" target="_blank" class="text-emerald-700 font-semibold underline">
              KTP ↗
            </a>
            <a v-if="ticket?.foto_produk_url" :href="ticket.foto_produk_url" target="_blank" class="text-emerald-700 font-semibold underline">
              Produk ↗
            </a>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center justify-end gap-1.5 pt-2 border-t border-slate-100">
          <button
            @click="$emit('close')"
            type="button"
            class="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            Batal
          </button>
          <button
            type="submit"
            class="px-4 py-1.5 text-xs font-bold text-white bg-emerald-700 active:bg-emerald-800 rounded-lg shadow-2xs"
          >
            Simpan Status
          </button>
        </div>

      </form>

    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useSalehaStore } from '../composables/useSalehaStore';

const props = defineProps({
  isOpen: Boolean,
  ticket: Object
});

const emit = defineEmits(['close', 'updated']);

const store = useSalehaStore();
const selectedStatus = ref('DIPROSES');
const catatan = ref('');
const operatorName = ref('');
const pdfUrl = ref('');

watch(() => props.isOpen, (open) => {
  if (open && props.ticket) {
    selectedStatus.value = props.ticket.status || 'DIPROSES';
    catatan.value = props.ticket.catatan_lpnu || '';
    operatorName.value = props.ticket.operator_assigned || store.currentAdminUser.value.nama;
    pdfUrl.value = props.ticket.pdf_hasil_url || '';
  }
});

async function handleSave() {
  if (!props.ticket) return;

  await store.updateStatus(props.ticket.id_ticket, {
    status: selectedStatus.value,
    catatan: catatan.value,
    operatorName: operatorName.value,
    pdfUrl: pdfUrl.value
  });

  emit('updated');
  emit('close');
}
</script>
