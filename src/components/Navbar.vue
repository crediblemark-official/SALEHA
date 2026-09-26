<template>
  <header class="sticky top-0 z-40 bg-emerald-800 text-white shadow-xs border-b border-emerald-700/60">
    <div class="h-13 px-3.5 flex items-center justify-between">
      
      <!-- Brand Logo & Title -->
      <div class="flex items-center gap-2">
        <img src="/logo.svg" alt="SALEHA Logo" class="w-7 h-7 drop-shadow-xs shrink-0" />
        <div class="flex flex-col justify-center">
          <div class="flex items-center gap-1.5 leading-none">
            <span class="font-black text-sm tracking-tight text-white">SALEHA</span>
            <span class="text-[9px] bg-amber-400 text-emerald-950 font-extrabold px-1.5 py-0.2 rounded-full leading-tight uppercase">
              PCNU
            </span>
            <VersionBadge
              @longpress="showAdminModal = true"
              badge-class="bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/60"
            />
          </div>
          <span class="text-[10px] text-emerald-200/90 leading-tight mt-0.5 font-medium">
            LPNU Sumenep
          </span>
        </div>
      </div>

      <!-- Controls -->
      <div class="flex items-center gap-2">
        
        <!-- Admin Indicator Badge (Hanya tampil jika Admin resmi yang login) -->
        <div
          v-if="store.activeRole.value === 'admin' && store.isAdminUser.value"
          class="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-400 text-emerald-950 text-[10px] font-black tracking-wide shadow-xs border border-amber-300"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-950 animate-pulse"></span>
          <span>ADMIN OPERATOR</span>
        </div>

        <!-- Settings / User Avatar Button -->
        <button
          @click="showSettings = true"
          :title="store.firebaseUser.value ? 'Akun: ' + store.firebaseUser.value.displayName : 'Login Google & Pengaturan'"
          type="button"
          class="w-7 h-7 rounded-full bg-emerald-950/50 hover:bg-emerald-950/80 active:scale-95 border border-emerald-700/60 text-emerald-200 hover:text-white flex items-center justify-center transition-all shrink-0 overflow-hidden"
        >
          <img
            v-if="store.firebaseUser.value?.photoURL"
            :src="store.firebaseUser.value.photoURL"
            :alt="store.firebaseUser.value.displayName || 'User'"
            class="w-full h-full object-cover"
          />
          <svg v-else class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
        </button>

      </div>

    </div>

    <ModalSettings :isOpen="showSettings" @close="showSettings = false" />
    <ModalAdminLogin v-if="showAdminModal" @close="showAdminModal = false" />
  </header>
</template>

<script setup>
import { ref } from 'vue';
import { useSalehaStore } from '../composables/useSalehaStore';
import ModalSettings from './ModalSettings.vue';
import ModalAdminLogin from './ModalAdminLogin.vue';
import VersionBadge from './VersionBadge.vue';

const store = useSalehaStore();
const showSettings = ref(false);
const showAdminModal = ref(false);
</script>
