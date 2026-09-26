<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs animate-fade-in">
    <div class="bg-white rounded-2xl max-w-md w-full p-4 shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
      
      <!-- Header Modal -->
      <div class="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
            📢
          </div>
          <div>
            <h3 class="text-sm font-extrabold text-slate-800 leading-tight">
              Kelola Pengumuman LPNU
            </h3>
            <p class="text-[10.5px] text-slate-500">
              Publikasikan info resmi & siaran ke seluruh UMKM
            </p>
          </div>
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

      <!-- Tab Switcher (Buat Baru vs Daftar Aktif) -->
      <div class="flex border-b border-slate-200 mt-2 shrink-0">
        <button
          @click="activeTab = 'create'"
          type="button"
          class="flex-1 py-2 text-xs font-bold text-center border-b-2 transition-colors flex items-center justify-center gap-1.5"
          :class="activeTab === 'create' ? 'border-emerald-700 text-emerald-800' : 'border-transparent text-slate-400 hover:text-slate-600'"
        >
          <span>✍️ Tulis Pengumuman</span>
        </button>
        <button
          @click="activeTab = 'list'"
          type="button"
          class="flex-1 py-2 text-xs font-bold text-center border-b-2 transition-colors flex items-center justify-center gap-1.5"
          :class="activeTab === 'list' ? 'border-emerald-700 text-emerald-800' : 'border-transparent text-slate-400 hover:text-slate-600'"
        >
          <span>📋 Daftar ({{ store.pengumumanList.value.length }})</span>
        </button>
      </div>

      <!-- Content Scrollable -->
      <div class="overflow-y-auto py-3 space-y-3 flex-1 text-xs">
        
        <!-- Tab 1: Form Buat Pengumuman Baru -->
        <div v-if="activeTab === 'create'" class="space-y-3">
          
          <!-- Judul -->
          <div>
            <label class="block text-[11px] font-bold text-slate-700 mb-1">
              Judul Pengumuman <span class="text-rose-500">*</span>
            </label>
            <input
              v-model="form.judul"
              type="text"
              placeholder="Contoh: Pembukaan Kuota 100 Sertifikat Halal 2026"
              class="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-1 focus:ring-emerald-600 focus:outline-hidden"
            />
          </div>

          <!-- Kategori & Penulis (Grid) -->
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1">
                Kategori
              </label>
              <select
                v-model="form.kategori"
                class="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-1 focus:ring-emerald-600 focus:outline-hidden"
              >
                <option value="INFO">ℹ️ INFO UMUM</option>
                <option value="PENTING">🚨 PENTING</option>
                <option value="SEHATI">🕌 HALAL SEHATI</option>
                <option value="PELATIHAN">📚 PELATIHAN</option>
                <option value="BAZAR">🎪 BAZAR &amp; EXPO</option>
                <option value="DINKES">🏥 P-IRT DINKES</option>
              </select>
            </div>

            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1">
                Penulis / Lembaga
              </label>
              <input
                v-model="form.penulis"
                type="text"
                class="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-1 focus:ring-emerald-600 focus:outline-hidden"
              />
            </div>
          </div>

          <!-- Isi Teks Pengumuman -->
          <div>
            <label class="block text-[11px] font-bold text-slate-700 mb-1">
              Isi Pengumuman <span class="text-rose-500">*</span>
            </label>
            <textarea
              v-model="form.isi"
              rows="5"
              placeholder="Tuliskan isi pengumuman atau instruksi untuk seluruh UMKM binaan LPNU di Sumenep..."
              class="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-1 focus:ring-emerald-600 focus:outline-hidden leading-relaxed"
            ></textarea>
            <span class="text-[10px] text-slate-400 mt-0.5 block">
              Pengumuman ini otomatis tayang di halaman utama aplikasi UMKM dan tercatat di Google Sheet.
            </span>
          </div>

          <!-- Alert Pesan Sukses / Error -->
          <div v-if="successMsg" class="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold flex items-center gap-1.5">
            <span>✅</span>
            <span>{{ successMsg }}</span>
          </div>
          <div v-if="errorMsg" class="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-[11px] font-semibold flex items-center gap-1.5">
            <span>⚠️</span>
            <span>{{ errorMsg }}</span>
          </div>

        </div>

        <!-- Tab 2: Daftar Pengumuman Aktif -->
        <div v-else class="space-y-2.5">
          <div v-if="store.pengumumanList.value.length === 0" class="text-center py-8 text-slate-400">
            Belum ada pengumuman yang diunggah.
          </div>

          <div
            v-for="item in store.pengumumanList.value"
            :key="item.id"
            class="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 relative group"
          >
            <div class="flex items-center justify-between gap-1">
              <span
                class="px-2 py-0.5 rounded text-[9.5px] font-extrabold uppercase tracking-wider"
                :class="getBadgeClass(item.kategori)"
              >
                {{ item.kategori || 'INFO' }}
              </span>
              <span class="text-[10px] text-slate-400">
                {{ formatDate(item.tgl_rilis) }}
              </span>
            </div>

            <h4 class="text-xs font-bold text-slate-800 leading-snug">
              {{ item.judul }}
            </h4>

            <p class="text-[11px] text-slate-600 line-clamp-3 leading-relaxed">
              {{ item.isi }}
            </p>

            <div class="pt-1.5 border-t border-slate-200/60 flex items-center justify-between text-[10px]">
              <span class="text-slate-400">Oleh: <strong class="text-slate-600">{{ item.penulis || 'LPNU' }}</strong></span>
              
              <button
                @click="handleDelete(item.id)"
                type="button"
                :disabled="isDeleting === item.id"
                class="px-2 py-0.5 rounded bg-rose-100 hover:bg-rose-200 active:scale-95 text-rose-700 font-bold transition-all flex items-center gap-1"
              >
                <span>🗑️</span>
                <span>{{ isDeleting === item.id ? 'Menghapus...' : 'Hapus' }}</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      <!-- Footer Buttons -->
      <div v-if="activeTab === 'create'" class="pt-3 border-t border-slate-100 flex items-center justify-end gap-2 shrink-0">
        <button
          @click="$emit('close')"
          type="button"
          class="px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
        >
          Tutup
        </button>
        <button
          @click="handlePublish"
          type="button"
          :disabled="isSubmitting"
          class="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 active:scale-95 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all"
        >
          <span v-if="isSubmitting" class="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          <span>📢 Publikasikan Sekarang</span>
        </button>
      </div>

      <div v-else class="pt-3 border-t border-slate-100 flex items-center justify-between shrink-0">
        <button
          @click="store.refreshPengumuman()"
          type="button"
          class="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
        >
          <span>🔄 Muat Ulang</span>
        </button>
        <button
          @click="$emit('close')"
          type="button"
          class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
        >
          Tutup
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useSalehaStore } from '../composables/useSalehaStore';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close']);
const store = useSalehaStore();

const activeTab = ref('create'); // 'create' | 'list'
const isSubmitting = ref(false);
const isDeleting = ref(null);
const successMsg = ref('');
const errorMsg = ref('');

const form = reactive({
  judul: '',
  kategori: 'PENTING',
  penulis: store.currentAdminUser.value?.nama || 'Admin LPNU PCNU Sumenep',
  isi: ''
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

async function handlePublish() {
  if (!form.judul.trim()) {
    errorMsg.value = 'Judul pengumuman wajib diisi!';
    return;
  }
  if (!form.isi.trim()) {
    errorMsg.value = 'Isi pengumuman wajib diisi!';
    return;
  }

  errorMsg.value = '';
  successMsg.value = '';
  isSubmitting.value = true;

  try {
    const res = await store.createPengumuman({
      judul: form.judul.trim(),
      kategori: form.kategori,
      penulis: form.penulis.trim() || 'Admin LPNU',
      isi: form.isi.trim(),
      tgl_rilis: new Date().toISOString(),
      status_aktif: true
    });

    if (res.success) {
      successMsg.value = 'Pengumuman berhasil disiarkan ke seluruh UMKM!';
      form.judul = '';
      form.isi = '';
      setTimeout(() => {
        successMsg.value = '';
        activeTab.value = 'list';
      }, 1200);
    } else {
      errorMsg.value = res.error || 'Gagal menyimpan pengumuman.';
    }
  } catch (err) {
    errorMsg.value = err.message || 'Terjadi kesalahan sistem.';
  } finally {
    isSubmitting.value = false;
  }
}

async function handleDelete(id) {
  if (!confirm('Apakah Anda yakin ingin menghapus pengumuman ini?')) return;
  isDeleting.value = id;
  try {
    await store.deletePengumuman(id);
  } catch (e) {
    alert('Gagal menghapus pengumuman.');
  } finally {
    isDeleting.value = null;
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
