<template>
  <span
    class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold tracking-tight border leading-none"
    :class="statusConfig.badgeClass"
  >
    <span class="w-1.5 h-1.5 rounded-full" :class="statusConfig.dotClass"></span>
    {{ statusConfig.label }}
  </span>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  status: {
    type: String,
    default: 'BARU'
  }
});

const statusConfig = computed(() => {
  switch (props.status) {
    case 'BARU':
      return {
        label: 'Verifikasi',
        badgeClass: 'bg-amber-50 text-amber-800 border-amber-300',
        dotClass: 'bg-amber-500'
      };
    case 'DIPROSES':
      return {
        label: 'Diproses OSS',
        badgeClass: 'bg-blue-50 text-blue-800 border-blue-300',
        dotClass: 'bg-blue-500'
      };
    case 'BUTUH_REVISI':
      return {
        label: 'Perlu Revisi',
        badgeClass: 'bg-rose-50 text-rose-800 border-rose-300',
        dotClass: 'bg-rose-500 animate-ping'
      };
    case 'SELESAI':
      return {
        label: 'Terbit',
        badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-300',
        dotClass: 'bg-emerald-500'
      };
    default:
      return {
        label: props.status || 'Draft',
        badgeClass: 'bg-slate-100 text-slate-700 border-slate-300',
        dotClass: 'bg-slate-400'
      };
  }
});
</script>
