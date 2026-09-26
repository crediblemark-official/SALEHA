<template>
  <Transition name="fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
      @click.self="$emit('cancel')"
    >
      <div
        class="bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200"
      >
        <div class="p-5 text-center">
          <!-- Icon Container -->
          <div
            class="w-12 h-12 mx-auto mb-3.5 rounded-full flex items-center justify-center"
            :class="iconContainerClass"
          >
            <!-- Logout Icon -->
            <svg v-if="icon === 'logout'" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>

            <!-- Reset / Refresh Icon -->
            <svg v-else-if="icon === 'reset'" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>

            <!-- Warning / Alert Icon -->
            <svg v-else-if="icon === 'warning'" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>

            <!-- Check / Success Icon -->
            <svg v-else-if="icon === 'success'" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>

            <!-- Default Info Icon -->
            <svg v-else class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <!-- Title -->
          <h3 class="text-base font-bold text-slate-800 mb-1.5 leading-snug">
            {{ title }}
          </h3>

          <!-- Message -->
          <p class="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
            {{ message }}
          </p>
        </div>

        <!-- Action Buttons -->
        <div class="p-3 bg-slate-50 border-t border-slate-100 flex gap-2.5">
          <button
            v-if="!hideCancel"
            type="button"
            @click="$emit('cancel')"
            class="flex-1 py-2 px-3 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-all active:scale-98 shadow-2xs"
          >
            {{ cancelText }}
          </button>
          <button
            type="button"
            @click="$emit('confirm')"
            class="flex-1 py-2 px-3 text-xs font-bold text-white rounded-xl shadow-2xs transition-all active:scale-98"
            :class="confirmButtonClass"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Konfirmasi'
  },
  message: {
    type: String,
    default: 'Apakah Anda yakin ingin melanjutkan tindakan ini?'
  },
  confirmText: {
    type: String,
    default: 'Ya, Lanjutkan'
  },
  cancelText: {
    type: String,
    default: 'Batal'
  },
  variant: {
    type: String,
    default: 'danger', // 'danger' | 'primary' | 'warning' | 'success'
    validator: (v) => ['danger', 'primary', 'warning', 'success'].includes(v)
  },
  icon: {
    type: String,
    default: 'warning' // 'logout' | 'reset' | 'warning' | 'success' | 'info'
  },
  hideCancel: {
    type: Boolean,
    default: false
  }
});

defineEmits(['confirm', 'cancel']);

const iconContainerClass = computed(() => {
  switch (props.variant) {
    case 'danger':
      return 'bg-rose-50 text-rose-600 border border-rose-100';
    case 'warning':
      return 'bg-amber-50 text-amber-600 border border-amber-100';
    case 'success':
      return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
    case 'primary':
    default:
      return 'bg-emerald-50 text-emerald-700 border border-emerald-100';
  }
});

const confirmButtonClass = computed(() => {
  switch (props.variant) {
    case 'danger':
      return 'bg-rose-600 hover:bg-rose-700 shadow-rose-200';
    case 'warning':
      return 'bg-amber-600 hover:bg-amber-700 shadow-amber-200';
    case 'success':
      return 'bg-emerald-700 hover:bg-emerald-800 shadow-emerald-200';
    case 'primary':
    default:
      return 'bg-emerald-700 hover:bg-emerald-800 shadow-emerald-200';
  }
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
