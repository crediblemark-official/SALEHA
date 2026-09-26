<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
    
    <!-- Modal Card -->
    <div class="w-full max-w-sm bg-slate-900 border border-emerald-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-100 animate-in zoom-in-95 duration-200">
      
      <!-- Modal Header with Amber/Emerald Glow -->
      <div class="relative px-5 pt-5 pb-4 bg-gradient-to-b from-emerald-950/60 to-transparent border-b border-white/5">
        <div class="flex items-center justify-between">
          <!-- Secret Admin Badge -->
          <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-[10.5px] font-bold tracking-wide">
            <span class="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            <span>PORTAL KHUSUS ADMIN LPNU</span>
          </div>

          <!-- Close Button -->
          <button
            @click="$emit('close')"
            type="button"
            class="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            ✕
          </button>
        </div>

        <h3 class="text-base font-extrabold text-white mt-3 flex items-center gap-2">
          <span>🛡️ Jalur Akses Operator</span>
          <span class="text-[10px] font-mono font-normal text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-800">
            {{ store.APP_VERSION }}
          </span>
        </h3>
        <p class="text-[11px] text-slate-400 mt-1 leading-snug">
          Verifikasi akun khusus Tim Pendamping & Petugas LPNU PCNU Sumenep untuk mengelola antrean legalitas.
        </p>
      </div>

      <!-- Tab Selector -->
      <div class="px-5 pt-3 flex gap-1.5 border-b border-white/5 bg-slate-950/40">
        <button
          type="button"
          @click="activeTab = 'email'"
          class="flex-1 pb-2.5 text-[11px] font-bold text-center border-b-2 transition-all"
          :class="activeTab === 'email' ? 'border-amber-400 text-amber-300' : 'border-transparent text-slate-400 hover:text-slate-200'"
        >
          🔑 Email & Sandi
        </button>
        <button
          type="button"
          @click="activeTab = 'google'"
          class="flex-1 pb-2.5 text-[11px] font-bold text-center border-b-2 transition-all"
          :class="activeTab === 'google' ? 'border-amber-400 text-amber-300' : 'border-transparent text-slate-400 hover:text-slate-200'"
        >
          🌐 Google Operator
        </button>
        <button
          type="button"
          @click="activeTab = 'demo'"
          class="flex-1 pb-2.5 text-[11px] font-bold text-center border-b-2 transition-all"
          :class="activeTab === 'demo' ? 'border-amber-400 text-amber-300' : 'border-transparent text-slate-400 hover:text-slate-200'"
        >
          ⚡ Akses Cepat
        </button>
      </div>

      <!-- Tab Body -->
      <div class="p-5 space-y-4">

        <!-- ERROR ALERT -->
        <div v-if="localError" class="p-3 bg-rose-950/70 border border-rose-500/40 rounded-xl text-xs text-rose-200 flex items-start gap-2 animate-in fade-in">
          <span class="text-rose-400 shrink-0 mt-0.5">⚠️</span>
          <span class="leading-relaxed flex-1">{{ localError }}</span>
          <button @click="localError = ''" class="text-rose-400 hover:text-white text-xs">✕</button>
        </div>

        <!-- 1. TAB: EMAIL & SANDI -->
        <form v-if="activeTab === 'email'" @submit.prevent="handleEmailLogin" class="space-y-3">
          <div>
            <label class="block text-[11px] font-semibold text-slate-300 mb-1">
              Email Petugas / Operator
            </label>
            <input
              v-model="emailInput"
              type="text"
              required
              placeholder="admin@lpnu-sumenep.or.id"
              class="w-full px-3 py-2 bg-slate-800/90 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
            />
          </div>

          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="text-[11px] font-semibold text-slate-300">
                Kata Sandi (Password)
              </label>
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="text-[10px] text-amber-400 hover:underline"
              >
                {{ showPassword ? 'Sembunyikan' : 'Lihat' }}
              </button>
            </div>
            <input
              v-model="passwordInput"
              :type="showPassword ? 'text' : 'password'"
              required
              placeholder="••••••••••••"
              class="w-full px-3 py-2 bg-slate-800/90 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
            />
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:scale-98 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all mt-4"
          >
            <span v-if="isLoading" class="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
            <span v-else>Masuk sebagai Administrator 🛡️</span>
          </button>
        </form>

        <!-- 2. TAB: GOOGLE OPERATOR -->
        <div v-else-if="activeTab === 'google'" class="space-y-3 text-center">
          <p class="text-[11px] text-slate-300 text-left leading-relaxed">
            Masuk dengan akun Google resmi pengurus LPNU. Sistem akan mendeteksi hak akses administrator secara otomatis.
          </p>
          
          <button
            type="button"
            @click="handleGoogleAdminLogin"
            :disabled="isLoading"
            class="w-full py-3 px-4 bg-white hover:bg-slate-100 active:scale-98 text-slate-900 font-bold rounded-xl text-xs flex items-center justify-center gap-2.5 shadow-lg transition-all"
          >
            <span v-if="isLoading" class="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></span>
            <template v-else>
              <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Login Google Akun Operator</span>
            </template>
          </button>
        </div>

        <!-- 3. TAB: AKSES CEPAT DEMO -->
        <div v-else-if="activeTab === 'demo'" class="space-y-3">
          <div class="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-left">
            <h5 class="text-[11.5px] font-bold text-amber-300">Akses Verifikasi Lapangan</h5>
            <p class="text-[10.5px] text-slate-300 mt-1 leading-relaxed">
              Digunakan saat petugas atau pengurus LPNU sedang mendampingi UMKM di lapangan tanpa harus login ulang Google di perangkat bersama.
            </p>
          </div>

          <button
            type="button"
            @click="handleDemoLogin"
            class="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all"
          >
            <span>⚡ Masuk Cepat Mode Operator Demo</span>
          </button>
        </div>

      </div>

      <!-- Footer Info -->
      <div class="px-5 py-3 bg-slate-950/70 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400">
        <span>© 2026 LPNU PCNU Sumenep</span>
        <button
          type="button"
          @click="$emit('close')"
          class="text-amber-400 hover:underline font-semibold"
        >
          Kembali ke Pengguna
        </button>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useSalehaStore } from '../composables/useSalehaStore';

const emit = defineEmits(['close', 'success']);
const store = useSalehaStore();

const activeTab = ref('email');
const emailInput = ref('admin@lpnu-sumenep.or.id');
const passwordInput = ref('');
const showPassword = ref(false);
const isLoading = ref(false);
const localError = ref('');

async function handleEmailLogin() {
  localError.value = '';
  isLoading.value = true;
  try {
    const res = await store.loginAdminEmail(emailInput.value, passwordInput.value);
    if (res.success) {
      emit('success');
      emit('close');
    } else {
      localError.value = store.authErrorMessage.value || 'Gagal masuk. Periksa email dan password.';
    }
  } catch (err) {
    localError.value = err.message || 'Terjadi kesalahan sistem saat autentikasi.';
  } finally {
    isLoading.value = false;
  }
}

async function handleGoogleAdminLogin() {
  localError.value = '';
  isLoading.value = true;
  try {
    const res = await store.loginAdminGoogle();
    if (res.success) {
      emit('success');
      emit('close');
    } else if (!res.userCancelled) {
      localError.value = store.authErrorMessage.value || 'Gagal login akun Google operator.';
    }
  } catch (err) {
    localError.value = err.message || 'Gagal login Google.';
  } finally {
    isLoading.value = false;
  }
}

function handleDemoLogin() {
  store.loginAdminDemo();
  emit('success');
  emit('close');
}
</script>
