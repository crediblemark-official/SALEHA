<template>
  <span
    class="relative inline-flex items-center cursor-pointer select-none group"
    v-bind="longPressProps"
    :title="'Versi ' + APP_VERSION + ' (Tahan 1 detik untuk Akses Administrator)'"
  >
    <!-- Visual Badge -->
    <span
      class="font-mono text-[9px] px-1.5 py-0.5 rounded transition-all duration-200"
      :class="[
        badgeClass,
        isPressing ? 'scale-90 ring-2 ring-amber-400 bg-amber-500/20 text-amber-300 font-bold' : ''
      ]"
    >
      {{ APP_VERSION }}
    </span>

    <!-- Holding indicator tooltip -->
    <transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-1"
    >
      <span
        v-if="isPressing"
        class="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap bg-amber-400 text-slate-950 font-bold text-[9px] px-2 py-0.5 rounded-full shadow-lg pointer-events-none z-50 animate-pulse"
      >
        Tahan untuk Admin 🛡️
      </span>
    </transition>
  </span>
</template>

<script setup>
import { APP_VERSION } from '../config/appInfo';
import { useLongPress } from '../composables/useLongPress';

const props = defineProps({
  badgeClass: {
    type: String,
    default: 'bg-white/10 hover:bg-white/20 text-slate-400 hover:text-slate-200'
  }
});

const emit = defineEmits(['longpress']);

const { isPressing, longPressProps } = useLongPress(() => {
  emit('longpress');
}, 800);
</script>
