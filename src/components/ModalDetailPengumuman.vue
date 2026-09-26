<template>
  <div v-if="isOpen && pengumuman" class="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs animate-fade-in">
    <div class="bg-white rounded-2xl max-w-sm w-full p-4 shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
      
      <!-- Top Bar -->
      <div class="flex items-center justify-between pb-2.5 border-b border-slate-100 shrink-0">
        <div class="flex items-center gap-1.5">
          <span
            class="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider"
            :class="getBadgeClass(pengumuman.kategori)"
          >
            {{ pengumuman.kategori || 'INFO' }}
          </span>
          <span class="text-[10.5px] text-slate-400">
            {{ formatDate(pengumuman.tgl_rilis) }}
          </span>
        </div>

        <button
          @click="$emit('close')"
          type="button"
          class="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Scrollable Body -->
      <div class="overflow-y-auto py-3 space-y-3 flex-1 text-xs">
        <h3 class="text-sm font-black text-slate-900 leading-snug">
          {{ pengumuman.judul }}
        </h3>

        <!-- Content Body with line breaks -->
        <div class="bg-slate-50/70 p-3 rounded-xl border border-slate-200/80 text-slate-700 leading-relaxed text-[11.5px] whitespace-pre-line space-y-2">
          {{ pengumuman.isi }}
        </div>

        <div class="p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-100 flex items-center gap-2 text-[10.5px] text-emerald-900">
          <div class="w-7 h-7 rounded-lg bg-emerald-800 text-white flex items-center justify-center font-bold text-xs shrink-0">
            NU
          </div>
          <div>
            <span class="font-bold block">Disiarkan oleh:</span>
            <span class="text-slate-600">{{ pengumuman.penulis || 'Pengurus Cabang LPNU Sumenep' }}</span>
          </div>
        </div>
      </div>

      <!-- Footer Button -->
      <div class="pt-2.5 border-t border-slate-100 flex items-center justify-end shrink-0">
        <button
          @click="$emit('close')"
          type="button"
          class="w-full py-2 bg-emerald-800 hover:bg-emerald-900 active:scale-98 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
        >
          Tutup &amp; Mengerti
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  pengumuman: {
    type: Object,
    default: null
  }
});

defineEmits(['close']);

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

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch (e) {
    return dateStr;
  }
}
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.98); }
  to { opacity: 1; transform: scale(1); }
}
.animate-fade-in {
  animation: fadeIn 0.15s ease-out forwards;
}
</style>
