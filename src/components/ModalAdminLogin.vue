<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
    
    <!-- Modal Card -->
    <div class="w-full max-w-sm bg-slate-900 border border-emerald-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-100 animate-in zoom-in-95 duration-200">
      
      <!-- Modal Header -->
      <div class="relative px-5 pt-5 pb-4 bg-gradient-to-b from-emerald-950/70 to-transparent border-b border-white/5">
        <div class="flex items-center justify-between">
          <!-- Secret Admin Badge -->
          <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-[10.5px] font-bold tracking-wide">
            <span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
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
          <span>🛡️ Login Administrator</span>
          <span class="text-[10px] font-mono font-normal text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-800">
            {{ store.APP_VERSION }}
          </span>
        </h3>
        <p class="text-[11px] text-slate-400 mt-1 leading-snug">
          Verifikasi hak akses pengelolaan legalitas usaha untuk Tim Pendamping & Petugas LPNU PCNU Sumenep.
        </p>
      </div>

      <!-- Modal Body -->
      <div class="p-5 space-y-4">

        <!-- ERROR ALERT (Misal akun Google bukan Admin resmi) -->
        <div v-if="localError" class="p-3 bg-rose-950/80 border border-rose-500/50 rounded-xl text-xs text-rose-200 flex items-start gap-2 animate-in fade-in">
          <span class="text-rose-400 shrink-0 mt-0.5 text-sm">⛔</span>
          <span class="leading-relaxed flex-1">{{ localError }}</span>
          <button @click="localError = ''" class="text-rose-400 hover:text-white text-xs">✕</button>
        </div>

        <!-- Security Notice Info Box -->
        <div class="p-3 bg-emerald-950/50 border border-emerald-700/40 rounded-xl text-left space-y-1.5">
          <div class="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
            <span>Kontrol Admin via Google Sheets & Firebase</span>
          </div>
          <p class="text-[11px] text-slate-300 leading-relaxed">
            Daftar admin/operator dikendalikan secara dinamis melalui <b>Google Sheets</b> pada Tab <code class="text-amber-300 font-mono">ADMIN_USERS</code>.
          </p>
          <p class="text-[10px] text-slate-400 leading-relaxed">
            Pengurus dapat menambah atau menonaktifkan email operator langsung di Spreadsheet tanpa perlu update aplikasi.
          </p>
        </div>

        <!-- Primary Action: Google Login Operator -->
        <div class="pt-1">
          <button
            type="button"
            @click="handleGoogleAdminLogin"
            :disabled="isLoading"
            class="w-full py-3.5 px-4 bg-white hover:bg-slate-100 active:scale-98 text-slate-900 font-extrabold rounded-xl text-xs flex items-center justify-center gap-3 shadow-lg shadow-emerald-950/40 transition-all border border-slate-200"
          >
            <span v-if="isLoading" class="w-4 h-4 border-2 border-emerald-700 border-t-transparent rounded-full animate-spin"></span>
            <template v-else>
              <!-- Official Google "G" SVG -->
              <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Masuk dengan Google Operator</span>
            </template>
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

const isLoading = ref(false);
const localError = ref('');

async function handleGoogleAdminLogin() {
  localError.value = '';
  isLoading.value = true;
  try {
    const res = await store.loginAdminGoogle();
    if (res.success) {
      emit('success');
      emit('close');
    } else if (!res.userCancelled) {
      localError.value = store.authErrorMessage.value || res.error?.message || 'Akses ditolak: Akun bukan admin resmi.';
    }
  } catch (err) {
    localError.value = err.message || 'Gagal login Google.';
  } finally {
    isLoading.value = false;
  }
}
</script>
