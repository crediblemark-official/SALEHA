<template>
  <div
    class="min-h-screen flex justify-center"
    :class="!store.firebaseUser.value ? 'bg-slate-900' : 'bg-slate-100'"
  >
    <!-- Mobile App Container (Native Android Frame on Desktop, Full Edge on Mobile) -->
    <div
      class="w-full max-w-md min-h-screen flex flex-col relative"
      :class="!store.firebaseUser.value ? 'bg-slate-900' : 'bg-slate-50 shadow-2xl sm:border-x sm:border-slate-200/80'"
    >
      
      <!-- SPLASH / INITIAL AUTH CHECK (Mencegah kedipan LoginGate jika user sudah login) -->
      <div v-if="store.isAuthLoading.value" class="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-6 space-y-4">
        <img src="/logo.png" alt="SALEHA" class="w-16 h-16 rounded-2xl shadow-xl animate-pulse" />
        <div class="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
          <span class="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></span>
          <span>Menyiapkan sesi SALEHA...</span>
        </div>
      </div>

      <!-- PINTU MASUK WAJIB: LOGIN DENGAN GOOGLE -->
      <LoginGate v-else-if="!store.firebaseUser.value" />

      <!-- MAIN APP INTERFACE (Hanya bisa dibuka setelah login) -->
      <template v-else>
        <!-- Native Sticky Top App Bar -->
        <Navbar />

        <!-- Main Scrollable Screen -->
        <main class="flex-1 pb-16 overflow-y-auto">
          
          <!-- ADMIN LPNU VIEW (Dengan Proteksi Pintu Admin) -->
          <div v-if="store.activeRole.value === 'admin'">
            <!-- Pintu Terkunci jika belum login -->
            <div v-if="!store.firebaseUser.value" class="p-6 text-center space-y-4 my-auto py-20">
              <div class="w-14 h-14 bg-amber-100 text-amber-800 rounded-2xl flex items-center justify-center mx-auto text-2xl shadow-xs">
                🔒
              </div>
              <div>
                <h3 class="font-extrabold text-slate-800 text-sm">Pintu Masuk Khusus Operator</h3>
                <p class="text-xs text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
                  Dashboard antrean pengurusan NIB hanya dapat diakses oleh Tim Pendamping & Operator LPNU PCNU Sumenep.
                </p>
              </div>
              <button
                @click="store.loginGoogle"
                type="button"
                class="py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white rounded-xl text-xs font-bold shadow-xs inline-flex items-center gap-2 transition-all"
              >
                <span>Masuk dengan Google Operator</span>
              </button>
            </div>

            <!-- Dashboard Admin jika sudah login -->
            <AdminDashboard v-else />
          </div>

          <!-- UMKM VIEW (5 TABS) -->
          <div v-else>
            <!-- Tab 1: Home (Beranda) -->
            <div v-if="umkmTab === 'home'">
              <UmkmHome @switchTab="tab => umkmTab = tab" />
            </div>

            <!-- Tab 2: Status / Tracking -->
            <div v-else-if="umkmTab === 'tracking'">
              <UmkmDashboard @switchTab="tab => umkmTab = tab" />
            </div>

            <!-- Tab 3: Ajukan Izin Baru -->
            <div v-else-if="umkmTab === 'pengajuan'">
              <UmkmFormPengajuan @submitted="handlePermohonanSubmitted" />
            </div>

            <!-- Tab 4: Brankas Dokumen -->
            <div v-else-if="umkmTab === 'brankas'">
              <UmkmBrankas :documents="store.myBrankasDocuments.value" @switchTab="tab => umkmTab = tab" />
            </div>

            <!-- Tab 5: Panduan & Bantuan -->
            <div v-else-if="umkmTab === 'panduan'">
              <UmkmPanduan />
            </div>
          </div>

        </main>

        <!-- 5-Item Sticky Bottom Navigation Bar for UMKM -->
        <nav
          v-if="store.activeRole.value === 'umkm'"
          class="fixed bottom-0 w-full max-w-md bg-white/95 backdrop-blur-md border-t border-slate-200 z-40 py-1 px-1 flex justify-around items-center"
        >
          <!-- 1. Home / Beranda -->
          <button
            @click="umkmTab = 'home'"
            type="button"
            class="flex flex-col items-center justify-center flex-1 py-1 transition-colors"
            :class="umkmTab === 'home' ? 'text-emerald-700 font-bold' : 'text-slate-400 hover:text-slate-600'"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
            </svg>
            <span class="text-[9px] mt-0.5">Home</span>
          </button>

          <!-- 2. Status / Tracking -->
          <button
            @click="umkmTab = 'tracking'"
            type="button"
            class="flex flex-col items-center justify-center flex-1 py-1 transition-colors"
            :class="umkmTab === 'tracking' ? 'text-emerald-700 font-bold' : 'text-slate-400 hover:text-slate-600'"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
            </svg>
            <span class="text-[9px] mt-0.5">Status</span>
          </button>

          <!-- 3. Ajukan Izin Baru (Prominent Center Button) -->
          <button
            @click="umkmTab = 'pengajuan'"
            type="button"
            class="flex flex-col items-center justify-center flex-1 py-0.5 transition-colors"
            :class="umkmTab === 'pengajuan' ? 'text-emerald-700 font-bold' : 'text-slate-400 hover:text-slate-600'"
          >
            <div class="w-9 h-9 rounded-full bg-emerald-700 active:bg-emerald-800 text-white flex items-center justify-center -mt-3 shadow-md border-2 border-white transition-all">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"></path>
              </svg>
            </div>
            <span class="text-[9px] mt-0.5">Ajukan</span>
          </button>

          <!-- 4. Brankas Dokumen -->
          <button
            @click="umkmTab = 'brankas'"
            type="button"
            class="flex flex-col items-center justify-center flex-1 py-1 transition-colors"
            :class="umkmTab === 'brankas' ? 'text-emerald-700 font-bold' : 'text-slate-400 hover:text-slate-600'"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
            <span class="text-[9px] mt-0.5">Brankas</span>
          </button>

          <!-- 5. Panduan / Bantuan -->
          <button
            @click="umkmTab = 'panduan'"
            type="button"
            class="flex flex-col items-center justify-center flex-1 py-1 transition-colors"
            :class="umkmTab === 'panduan' ? 'text-emerald-700 font-bold' : 'text-slate-400 hover:text-slate-600'"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span class="text-[9px] mt-0.5">Bantuan</span>
          </button>
        </nav>
      </template>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useSalehaStore } from './composables/useSalehaStore';
import Navbar from './components/Navbar.vue';
import LoginGate from './components/LoginGate.vue';
import UmkmHome from './components/UmkmHome.vue';
import UmkmDashboard from './components/UmkmDashboard.vue';
import UmkmFormPengajuan from './components/UmkmFormPengajuan.vue';
import UmkmBrankas from './components/UmkmBrankas.vue';
import UmkmPanduan from './components/UmkmPanduan.vue';
import AdminDashboard from './components/AdminDashboard.vue';

const store = useSalehaStore();
const umkmTab = ref('home');

function handlePermohonanSubmitted(createdItem) {
  umkmTab.value = 'tracking';
}
</script>
