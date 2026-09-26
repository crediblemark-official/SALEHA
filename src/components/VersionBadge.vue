<template>
  <span
    class="relative inline-flex items-center cursor-pointer select-none"
    v-bind="longPressProps"
    :title="'Versi ' + APP_VERSION"
  >
    <!-- Visual Text (Polos, tanpa border, tanpa box background) -->
    <span
      class="font-mono text-[9.5px] transition-colors duration-150"
      :class="[
        badgeClass,
        isPressing ? 'scale-90 text-amber-500 font-bold' : ''
      ]"
    >
      {{ APP_VERSION }}
    </span>

    <!-- Holding indicator tooltip hanya saat ditekan lama -->
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
    default: 'text-slate-400 hover:text-slate-500'
  }
});

const emit = defineEmits(['longpress']);

const { isPressing, longPressProps } = useLongPress(() => {
  emit('longpress');
}, 800);
</script>
