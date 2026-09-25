<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-xs">
    <div class="bg-white rounded-2xl max-w-sm w-full p-4 shadow-xl border border-slate-200">
      
      <!-- Modal Header -->
      <div class="flex items-center justify-between pb-2 border-b border-slate-100">
        <div>
          <h3 class="font-extrabold text-slate-800 text-sm">Unggah Foto Revisi</h3>
          <p class="text-[10px] text-slate-400 font-mono">{{ ticket?.id_ticket }}</p>
        </div>
        <button @click="$emit('close')" class="text-slate-400 hover:text-slate-600 p-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Revision Note from LPNU -->
      <div class="mt-2.5 p-2 bg-rose-50 border border-rose-200 rounded-lg">
        <span class="text-[10px] font-bold text-rose-800 uppercase block mb-0.5">Catatan Perbaikan:</span>
        <p class="text-xs text-rose-900 font-medium leading-snug">
          {{ ticket?.catatan_lpnu || 'Mohon unggah ulang foto KTP yang lebih jelas.' }}
        </p>
      </div>

      <form @submit.prevent="handleSubmit" class="mt-3 space-y-3">
        
        <!-- Upload Foto KTP Baru -->
        <div>
          <label class="flex items-center justify-center p-3 border-2 border-dashed border-emerald-400 bg-emerald-50/30 rounded-xl cursor-pointer text-center relative overflow-hidden aspect-video">
            <input type="file" accept="image/*" class="hidden" @change="handleFileChange" />
            <img v-if="previewImage" :src="previewImage" alt="Preview" class="absolute inset-0 w-full h-full object-cover" />
            <div v-else class="space-y-1">
              <svg class="w-6 h-6 mx-auto text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
              </svg>
              <span class="text-xs font-bold text-emerald-900 block leading-tight">Ambil / Unggah Foto KTP Baru</span>
              <span class="text-[9px] text-slate-500 block">Kompresi otomatis &le; 1 MB</span>
            </div>
            <span v-if="previewImage" class="absolute bottom-1 right-1 bg-emerald-700 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">Ganti Foto</span>
          </label>
        </div>

        <!-- Catatan Pemohon -->
        <div>
          <input
            v-model="pesanPemohon"
            type="text"
            placeholder="Pesan untuk admin (Opsional)..."
            class="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-hidden"
          />
        </div>

        <div class="flex items-center justify-end gap-1.5 pt-2 border-t border-slate-100">
          <button
            @click="$emit('close')"
            type="button"
            class="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            Batal
          </button>
          <button
            :disabled="loading || !previewImage"
            type="submit"
            class="px-4 py-1.5 text-xs font-bold text-white bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 rounded-lg shadow-2xs flex items-center gap-1.5"
          >
            <span v-if="loading" class="animate-spin w-3 h-3 border-2 border-white border-t-transparent rounded-full"></span>
            <span>{{ loading ? 'Mengirim...' : 'Kirim Foto Baru' }}</span>
          </button>
        </div>
      </form>

    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { gasService } from '../services/gasService';
import { useSalehaStore } from '../composables/useSalehaStore';

const props = defineProps({
  isOpen: Boolean,
  ticket: Object
});

const emit = defineEmits(['close', 'updated']);

const store = useSalehaStore();
const previewImage = ref('');
const pesanPemohon = ref('');
const loading = ref(false);
const selectedFile = ref(null);

watch(() => props.isOpen, (open) => {
  if (open) {
    previewImage.value = '';
    pesanPemohon.value = '';
    selectedFile.value = null;
  }
});

async function handleFileChange(e) {
  const file = e.target.files[0];
  if (!file) return;
  selectedFile.value = file;
  const result = await gasService.compressImage(file);
  previewImage.value = result.dataUrl;
}

async function handleSubmit() {
  if (!previewImage.value || !props.ticket) return;

  loading.value = true;
  try {
    let finalUrl = previewImage.value;
    if (selectedFile.value) {
      const uploadRes = await gasService.uploadFile({
        file: selectedFile.value,
        folderType: 'ktp'
      });
      if (uploadRes && uploadRes.url) {
        finalUrl = uploadRes.url;
      }
    }

    store.submitRevisi(props.ticket.id_ticket, {
      fotoKtpUrl: finalUrl,
      catatan: pesanPemohon.value
    });

    emit('updated');
    emit('close');
  } catch (error) {
    console.error('Error submitting revisi:', error);
    alert('Kendala mengirim: ' + error.message);
  } finally {
    loading.value = false;
  }
}
</script>
