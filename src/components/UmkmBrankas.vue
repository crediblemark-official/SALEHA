<template>
  <div class="pb-6 bg-slate-50">
    
    <!-- Top Compact Header (Directly touching list) -->
    <div class="bg-emerald-900 text-white px-3.5 py-3 flex items-center justify-between border-b border-emerald-950">
      <div>
        <h2 class="text-sm font-black tracking-tight leading-none">
          Brankas Dokumen Legalitas
        </h2>
        <p class="text-[10px] text-emerald-200 mt-1 leading-none">
          Dokumen resmi terbit siap diunduh & dicetak
        </p>
      </div>

      <span class="text-[10px] bg-emerald-800 border border-emerald-700 font-bold px-2 py-0.5 rounded-full">
        {{ documents.length }} Terbit
      </span>
    </div>

    <!-- Empty State -->
    <div v-if="documents.length === 0" class="p-8 text-center bg-white border-b border-slate-200">
      <svg class="w-8 h-8 mx-auto text-slate-300 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
      </svg>
      <p class="text-xs font-bold text-slate-700">Belum ada izin terbit</p>
      <p class="text-[10px] text-slate-400 mt-0.5">Sertifikat NIB/Halal akan tersimpan di sini setelah disetujui.</p>
    </div>

    <!-- Full-Edge Documents List (Directly touching header, seamless) -->
    <div v-else class="bg-white border-b border-slate-200 divide-y divide-slate-100">
      <div
        v-for="doc in documents"
        :key="doc.id_ticket"
        class="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
      >
        <!-- Info -->
        <div class="space-y-1 min-w-0 flex-1">
          <div class="flex items-center gap-1.5 flex-wrap">
            <span class="font-mono text-[10px] font-bold text-emerald-900 bg-emerald-50 border border-emerald-200 px-1 rounded">
              {{ doc.id_ticket }}
            </span>
            <span class="text-[10px] text-slate-400">• {{ formatDate(doc.updated_at) }}</span>
          </div>

          <h4 class="text-xs font-extrabold text-slate-900 truncate">
            {{ doc.nama_usaha }}
          </h4>

          <div class="flex items-center gap-1 flex-wrap">
            <span
              v-for="izin in doc.jenis_izin"
              :key="izin"
              class="px-1.5 py-0.2 rounded text-[9px] font-bold bg-slate-100 text-slate-700"
            >
              {{ izin }}
            </span>
          </div>
        </div>

        <!-- Quick Action Buttons -->
        <div class="flex items-center gap-1.5 shrink-0">
          <!-- Download / View PDF -->
          <a
            :href="doc.pdf_hasil_url || '#'"
            target="_blank"
            download
            title="Download PDF"
            class="p-2 bg-emerald-700 active:bg-emerald-800 text-white rounded-lg transition-colors flex items-center justify-center shadow-xs"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </a>

          <!-- Send to WhatsApp -->
          <button
            @click="shareToWhatsApp(doc)"
            type="button"
            title="Kirim ke WhatsApp"
            class="p-2 bg-emerald-50 active:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg transition-colors flex items-center justify-center"
          >
            <svg class="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
const props = defineProps({
  documents: {
    type: Array,
    default: () => []
  }
});

defineEmits(['switchTab']);

function formatDate(isoStr) {
  if (!isoStr) return '-';
  try {
    const d = new Date(isoStr);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  } catch (e) {
    return isoStr;
  }
}

function shareToWhatsApp(doc) {
  const text = encodeURIComponent(
    `*LEGALITAS USAHA RESMI (SALEHA PCNU)*\n\n` +
    `Usaha: *${doc.nama_usaha}*\n` +
    `Pemilik: ${doc.nama_pemilik}\n` +
    `No. Tiket: ${doc.id_ticket}\n` +
    `Link PDF: ${doc.pdf_hasil_url || '-'}`
  );
  window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
}
</script>
