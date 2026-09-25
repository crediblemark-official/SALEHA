<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-xs transition-opacity duration-200"
      @click.self="close"
    >
      <!-- Bottom Sheet Modal Content -->
      <div
        class="bg-white rounded-t-2xl max-w-md w-full mx-auto max-h-[85vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-200"
      >
        <!-- Header -->
        <div class="px-4 pt-3.5 pb-2.5 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div>
            <div class="flex items-center gap-1.5">
              <h3 class="text-sm font-bold text-slate-800">Pilih Kecamatan</h3>
              <span class="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full">
                27 Kecamatan
              </span>
            </div>
            <p class="text-[10px] text-slate-400 mt-0.5">Kabupaten Sumenep, Madura</p>
          </div>
          <button
            type="button"
            @click="close"
            class="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Search Bar & Zone Filter -->
        <div class="p-3 border-b border-slate-100 space-y-2 shrink-0 bg-slate-50/50">
          <div class="relative">
            <input
              ref="searchInputRef"
              v-model="searchQuery"
              type="text"
              placeholder="Ketik nama kecamatan (misal: Batuan, Talango)..."
              class="w-full text-xs pl-8 pr-7 py-2 bg-white border border-slate-200 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-hidden"
            />
            <svg class="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <button
              v-if="searchQuery"
              @click="searchQuery = ''"
              type="button"
              class="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              ✕
            </button>
          </div>

          <!-- Zone Pills -->
          <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[11px]">
            <button
              type="button"
              @click="selectedZona = 'ALL'"
              class="px-2 py-0.5 rounded-full font-bold whitespace-nowrap transition-colors"
              :class="selectedZona === 'ALL'
                ? 'bg-emerald-700 text-white'
                : 'bg-white text-slate-600 border border-slate-200'"
            >
              Semua ({{ KECAMATAN_SUMENEP.length }})
            </button>
            <button
              type="button"
              @click="selectedZona = 'Daratan'"
              class="px-2 py-0.5 rounded-full font-bold whitespace-nowrap transition-colors"
              :class="selectedZona === 'Daratan'
                ? 'bg-emerald-700 text-white'
                : 'bg-white text-slate-600 border border-slate-200'"
            >
              Daratan ({{ daratanCount }})
            </button>
            <button
              type="button"
              @click="selectedZona = 'Kepulauan'"
              class="px-2 py-0.5 rounded-full font-bold whitespace-nowrap transition-colors"
              :class="selectedZona === 'Kepulauan'
                ? 'bg-emerald-700 text-white'
                : 'bg-white text-slate-600 border border-slate-200'"
            >
              Kepulauan ({{ kepulauanCount }})
            </button>
          </div>
        </div>

        <!-- Scrollable List of Kecamatan -->
        <div class="overflow-y-auto flex-1 divide-y divide-slate-100 p-1">
          <button
            v-for="kec in filteredKecamatan"
            :key="kec.id"
            type="button"
            @click="selectKecamatan(kec.nama)"
            class="w-full px-3 py-2.5 flex items-center justify-between text-left hover:bg-emerald-50/60 active:bg-emerald-100/70 transition-colors rounded-lg"
            :class="modelValue === kec.nama ? 'bg-emerald-50/80 font-bold' : ''"
          >
            <div class="flex items-center gap-2">
              <span class="text-xs" :class="modelValue === kec.nama ? 'text-emerald-950 font-bold' : 'text-slate-800'">
                {{ kec.nama }}
              </span>
              <span
                class="text-[9px] font-semibold px-1.5 py-0.2 rounded"
                :class="kec.zona === 'Daratan' ? 'bg-slate-100 text-slate-600' : 'bg-cyan-100 text-cyan-800'"
              >
                {{ kec.zona }}
              </span>
            </div>

            <!-- Active checkmark -->
            <svg
              v-if="modelValue === kec.nama"
              class="w-4 h-4 text-emerald-700 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path>
            </svg>
          </button>

          <!-- Empty State -->
          <div v-if="filteredKecamatan.length === 0" class="py-8 text-center px-4">
            <p class="text-xs text-slate-500 font-semibold">Kecamatan "{{ searchQuery }}" tidak ditemukan</p>
            <p class="text-[10px] text-slate-400 mt-1">Pastikan ejaan benar atau pilih dari daftar 27 kecamatan di atas.</p>
          </div>
        </div>

        <!-- Footer Dismiss -->
        <div class="p-2 border-t border-slate-100 shrink-0 bg-white">
          <button
            type="button"
            @click="close"
            class="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, nextTick, watch } from 'vue';
import { KECAMATAN_SUMENEP } from '../data/sumenep';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  modelValue: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue', 'close']);

const searchQuery = ref('');
const selectedZona = ref('ALL'); // 'ALL' | 'Daratan' | 'Kepulauan'
const searchInputRef = ref(null);

const daratanCount = computed(() => KECAMATAN_SUMENEP.filter(k => k.zona === 'Daratan').length);
const kepulauanCount = computed(() => KECAMATAN_SUMENEP.filter(k => k.zona.includes('Kepulauan')).length);

const filteredKecamatan = computed(() => {
  let list = KECAMATAN_SUMENEP;

  if (selectedZona.value !== 'ALL') {
    list = list.filter(k => k.zona.includes(selectedZona.value));
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim();
    list = list.filter(k => k.nama.toLowerCase().includes(q));
  }

  return list;
});

function selectKecamatan(nama) {
  emit('update:modelValue', nama);
  close();
}

function close() {
  emit('close');
  searchQuery.value = '';
  selectedZona.value = 'ALL';
}

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    nextTick(() => {
      searchInputRef.value?.focus();
    });
  }
});
</script>
