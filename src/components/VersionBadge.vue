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
}, 5000);
</script>
