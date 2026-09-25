<template>
  <div class="min-h-screen bg-slate-900 flex flex-col justify-between text-white relative overflow-hidden">
    
    <!-- Background Islamic Geometric Pattern Accent -->
    <div class="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]"></div>
    <div class="absolute -top-24 -right-24 w-72 h-72 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-20 -left-20 w-72 h-72 bg-emerald-800/30 rounded-full blur-3xl pointer-events-none"></div>

    <!-- Top Brand Header -->
    <div class="relative z-10 px-6 pt-10 text-center">
      <div class="inline-flex items-center justify-center p-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl mb-4">
        <img src="/logo.png" alt="Logo SALEHA" class="w-16 h-16 rounded-xl drop-shadow-md object-cover" />
      </div>

      <div class="flex items-center justify-center gap-1.5 mb-1">
        <h1 class="text-2xl font-black tracking-tight text-white">SALEHA</h1>
        <span class="text-[10px] bg-amber-400 text-emerald-950 font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
          PCNU
        </span>
      </div>

      <p class="text-xs font-semibold text-emerald-300">
        Sadar Legalitas Usaha
      </p>
      <p class="text-[11px] text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
        Layanan pendampingan NIB, Sertifikasi Halal, & P-IRT untuk pelaku UMKM Nahdliyin se-Kabupaten Sumenep.
      </p>
    </div>

    <!-- Center Highlights (3 Cards) -->
    <div class="relative z-10 px-5 my-auto py-4 space-y-2">
      <!-- 1. NIB -->
      <div class="p-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 flex items-center justify-center shrink-0 shadow-inner">
          <svg class="w-4.5 h-4.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
        </div>
        <div class="min-w-0 flex-1">
          <h4 class="text-xs font-bold text-white">Pendampingan OSS-RBA</h4>
          <p class="text-[10px] text-slate-400 leading-tight">Proses pendaftaran izin usaha dibantu sampai terbit.</p>
        </div>
      </div>

      <!-- 2. Halal -->
      <div class="p-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-400/30 text-teal-300 flex items-center justify-center shrink-0 shadow-inner">
          <svg class="w-4.5 h-4.5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
          </svg>
        </div>
        <div class="min-w-0 flex-1">
          <h4 class="text-xs font-bold text-white">Sertifikat Halal SEHATI</h4>
          <p class="text-[10px] text-slate-400 leading-tight">Fasilitasi sertifikasi halal gratis jalur self-declare.</p>
        </div>
      </div>

      <!-- 3. Jaringan 27 Kecamatan -->
      <div class="p-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/30 text-amber-300 flex items-center justify-center shrink-0 shadow-inner">
          <svg class="w-4.5 h-4.5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
        </div>
        <div class="min-w-0 flex-1">
          <h4 class="text-xs font-bold text-white">Jaringan 27 Kecamatan</h4>
          <p class="text-[10px] text-slate-400 leading-tight">Didampingi langsung oleh pengurus LPNU MWC setempat.</p>
        </div>
      </div>
    </div>

    <!-- Bottom Action Gate (Login Button) -->
    <div class="relative z-10 px-6 pb-8 pt-4 space-y-3 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent">
      
      <!-- Primary Action: Google Login -->
      <button
        type="button"
        @click="handleLoginGoogle"
        :disabled="isLoading"
        class="w-full py-3.5 px-4 bg-white hover:bg-slate-100 active:scale-98 text-slate-800 rounded-xl font-bold text-xs flex items-center justify-center gap-3 shadow-lg transition-all"
      >
        <span v-if="isLoading" class="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></span>
        <template v-else>
          <!-- Official Google "G" SVG -->
          <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span class="tracking-wide">Masuk dengan Akun Google</span>
        </template>
      </button>

      <!-- Error Notice Card (if login fails) -->
      <div v-if="activeError" class="p-3 bg-red-950/70 border border-red-500/40 rounded-xl text-left text-xs animate-in fade-in">
        <div class="flex items-start justify-between gap-2">
          <div class="flex items-center gap-1.5 text-red-400 font-bold text-[11px]">
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            <span>Kendala Autentikasi Google</span>
          </div>
          <button @click="dismissError" class="text-slate-400 hover:text-white text-xs p-0.5">✕</button>
        </div>
        <p class="text-[11px] text-slate-200 mt-1 leading-relaxed">
          {{ activeError }}
        </p>
        <p v-if="activeError.includes('Authorized domains') || activeError.includes('Domain')" class="text-[10px] text-amber-300 mt-2 bg-amber-950/40 p-2 rounded-lg border border-amber-500/30">
          💡 <b>Solusi:</b> Buka <b>Firebase Console &gt; Authentication &gt; Settings &gt; Authorized domains</b>, lalu tambahkan domain tempat aplikasi ini dibuka (misal: <code>localhost</code> atau domain web Anda).
        </p>
        <p v-else-if="activeError.includes('401') || activeError.includes('OAuth') || activeError.includes('Konfigurasi')" class="text-[10px] text-amber-300 mt-2 bg-amber-950/40 p-2 rounded-lg border border-amber-500/30">
          💡 <b>Solusi:</b> Pastikan <b>Support Email</b> telah dipilih di <b>Firebase Console &gt; Authentication &gt; Sign-in method &gt; Google</b> dan status OAuth Consent Screen di Google Cloud Console sudah aktif.
        </p>
      </div>

      <!-- Footer Info -->
      <p class="text-[9.5px] text-center text-slate-500 pt-1 leading-tight">
        Lembaga Perekonomian Nahdlatul Ulama (LPNU)<br />
        Pengurus Cabang Nahdlatul Ulama (PCNU) Kabupaten Sumenep
      </p>

    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useSalehaStore } from '../composables/useSalehaStore';
import { getAuthErrorMessage } from '../services/firebase';

const emit = defineEmits(['loginSuccess']);

const store = useSalehaStore();
const isLoading = ref(false);
const errorMessage = ref('');

const activeError = computed(() => errorMessage.value || store.authErrorMessage.value);

function dismissError() {
  errorMessage.value = '';
  store.clearAuthError();
}

async function handleLoginGoogle() {
  isLoading.value = true;
  errorMessage.value = '';
  store.clearAuthError();
  try {
    const res = await store.loginGoogle();
    if (res.userCancelled) {
      isLoading.value = false;
      return;
    }
    if (res.redirecting) {
      // Sedang dialihkan ke halaman akun Google, spinner tetap aktif
      return;
    }
    if (res.success && res.user) {
      emit('loginSuccess', res.user);
      isLoading.value = false;
    } else if (res.error) {
      console.error('Login error detail:', res.error);
      errorMessage.value = getAuthErrorMessage(res.error);
      isLoading.value = false;
    }
  } catch (e) {
    console.error('Login catch error:', e);
    errorMessage.value = getAuthErrorMessage(e);
    isLoading.value = false;
  }
}
</script>
