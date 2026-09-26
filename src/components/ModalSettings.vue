<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
    <div class="bg-white rounded-2xl max-w-sm w-full p-4 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-150">
      
      <!-- Header -->
      <div class="flex items-center justify-between pb-3 border-b border-slate-100">
        <div class="flex items-center gap-2">
          <div class="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
          </div>
          <div>
            <h3 class="font-bold text-slate-800 text-sm">Akun & Pengaturan</h3>
            <p class="text-[10px] text-slate-500">Firebase & Integrasi SALEHA</p>
          </div>
        </div>
        <button
          type="button"
          @click="$emit('close')"
          class="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <div class="mt-3 space-y-3 text-xs">
        
        <!-- SECTION 1: AUTENTIKASI GOOGLE (FIREBASE AUTH) -->
        <div class="p-3 rounded-xl border" :class="store.firebaseUser.value ? 'bg-emerald-50/50 border-emerald-200' : 'bg-slate-50 border-slate-200'">
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Autentikasi Akun Google
          </span>

          <!-- If Logged In with Google -->
          <div v-if="store.firebaseUser.value" class="space-y-2">
            <div class="flex items-center gap-2.5">
              <img
                v-if="store.firebaseUser.value.photoURL"
                :src="store.firebaseUser.value.photoURL"
                alt="Avatar"
                class="w-9 h-9 rounded-full border border-emerald-300 shadow-2xs shrink-0 object-cover"
              />
              <div v-else class="w-9 h-9 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center shrink-0 text-sm">
                {{ store.firebaseUser.value.displayName ? store.firebaseUser.value.displayName.charAt(0) : 'U' }}
              </div>

              <div class="min-w-0 flex-1">
                <p class="font-extrabold text-slate-900 truncate text-xs">
                  {{ store.firebaseUser.value.displayName || 'Pengguna SALEHA' }}
                </p>
                <p class="text-[10px] text-slate-500 truncate font-mono">
                  {{ store.firebaseUser.value.email }}
                </p>
                <span class="inline-block mt-0.5 text-[8.5px] bg-emerald-200/80 text-emerald-900 font-extrabold px-1.5 py-0.2 rounded-full">
                  ✓ Terhubung Firebase Auth
                </span>
              </div>
            </div>

            <button
              type="button"
              @click="requestLogout"
              :disabled="loadingAuth"
              class="w-full mt-2 py-1.5 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1"
            >
              <span v-if="loadingAuth" class="w-3 h-3 border-2 border-rose-600 border-t-transparent rounded-full animate-spin"></span>
              <span v-else>Keluar (Logout Akun)</span>
            </button>
          </div>

          <!-- If Not Logged In -->
          <div v-else class="space-y-2 text-center py-1">
            <p class="text-[11px] text-slate-600 leading-snug">
              Masuk dengan akun Google untuk sinkronisasi otomatis permohonan izin ke Cloud Firestore.
            </p>
            <button
              type="button"
              @click="handleLoginGoogle"
              :disabled="loadingAuth"
              class="w-full py-2 bg-white hover:bg-slate-50 active:scale-98 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-2"
            >
              <span v-if="loadingAuth" class="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></span>
              <template v-else>
                <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Masuk dengan Google</span>
              </template>
            </button>
          </div>
        </div>

        <!-- SECTION 2: SYSTEM INFO -->
        <div class="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-[10px] space-y-1">
          <div class="flex items-center justify-between">
            <span class="text-slate-500">Firebase Firestore:</span>
            <span class="font-bold text-emerald-700">✓ salehalpnu (Aktif)</span>
          </div>
          <div v-if="store.currentAdminUser.value?.isLoggedIn && SPREADSHEET_MASTER_URL" class="flex items-center justify-between">
            <span class="text-slate-500">Google Spreadsheet:</span>
            <a
              :href="SPREADSHEET_MASTER_URL"
              target="_blank"
              rel="noopener noreferrer"
              class="font-bold text-emerald-700 hover:underline inline-flex items-center gap-0.5"
            >
              <span>Buka Sheets ↗</span>
            </a>
          </div>
          <div v-if="store.currentAdminUser.value?.isLoggedIn && GDRIVE_MEDIA_FOLDER_URL" class="flex items-center justify-between">
            <span class="text-slate-500">Folder Media Drive:</span>
            <a
              :href="GDRIVE_MEDIA_FOLDER_URL"
              target="_blank"
              rel="noopener noreferrer"
              class="font-bold text-emerald-700 hover:underline inline-flex items-center gap-0.5"
            >
              <span>Buka Drive ↗</span>
            </a>
          </div>
        </div>

        <!-- Reset Demo Data & Sync Firestore & Sheets -->
        <div class="pt-1 space-y-2">
          <!-- Button Sync to Cloud Firestore & Google Sheets -->
          <button
            @click="handleSyncAllToFirestore"
            :disabled="syncingFirestore"
            type="button"
            class="w-full py-2 px-3 bg-emerald-50 hover:bg-emerald-100 active:scale-98 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
          >
            <span v-if="syncingFirestore" class="w-3.5 h-3.5 border-2 border-emerald-700 border-t-transparent rounded-full animate-spin"></span>
            <span v-else>☁️ Unggah &amp; Sinkronkan Data ke Firestore &amp; Sheets</span>
          </button>
          <p v-if="syncSuccessMessage" class="text-[10px] text-emerald-700 font-semibold text-center animate-in fade-in">
            {{ syncSuccessMessage }}
          </p>

          <button
            @click="requestResetData"
            type="button"
            class="text-[10.5px] text-slate-400 hover:text-rose-600 font-medium flex items-center gap-1 transition-colors mx-auto"
          >
            <span>🔄</span>
            <span>Kembalikan data contoh demo Sumenep</span>
          </button>
        </div>

        <!-- Copyright & Credit -->
        <div class="text-center pt-2 text-[10px] text-slate-400 space-y-0.5">
          <p class="flex items-center justify-center gap-1.5 flex-wrap">
            <span>© 2026 SALEHA</span>
            <VersionBadge @longpress="showAdminModal = true" badge-class="bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200" />
            <span>· LPNU PCNU Sumenep</span>
          </p>
          <p>Dibuat dengan ❤️ oleh <a href="https://situsbisnis.com/@rasyiqi/" target="_blank" rel="noopener noreferrer" class="font-bold text-emerald-800 hover:underline">Rasyiqi</a> · <a href="https://crediblemark.com" target="_blank" rel="noopener noreferrer" class="text-slate-400 hover:text-emerald-800 hover:underline">crediblemark.com</a></p>
        </div>

      </div>

      <!-- Footer Buttons -->
      <div class="mt-3 border-t border-slate-100 pt-3">
        <button
          type="button"
          @click="$emit('close')"
          class="w-full py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 active:scale-98 rounded-lg transition-all text-center"
        >
          Tutup Pengaturan
        </button>
      </div>

    </div>
  </div>

  <ModalAdminLogin
    v-if="showAdminModal"
    @close="showAdminModal = false"
    @success="() => { showAdminModal = false; $emit('close'); }"
  />

  <!-- Modal Konfirmasi Logout Akun Google Custom -->
  <ModalConfirm
    :is-open="showLogoutConfirm"
    title="Keluar dari Akun Google?"
    message="Apakah Anda yakin ingin keluar dari akun Google? Sesi Anda pada aplikasi SALEHA akan dinonaktifkan."
    confirm-text="Ya, Keluar"
    cancel-text="Batal"
    variant="danger"
    icon="logout"
    @confirm="confirmLogout"
    @cancel="showLogoutConfirm = false"
  />

  <!-- Modal Konfirmasi Reset Data Demo Custom -->
  <ModalConfirm
    :is-open="showResetConfirm"
    title="Kembalikan Data Contoh Demo?"
    message="Tindakan ini akan mengembalikan daftar permohonan ke 4 contoh UMKM Sumenep bawaan sistem."
    confirm-text="Ya, Kembalikan Data"
    cancel-text="Batal"
    variant="warning"
    icon="reset"
    @confirm="confirmResetData"
    @cancel="showResetConfirm = false"
  />
</template>

<script setup>
import { ref } from 'vue';
import { firestoreService } from '../services/firestoreService';
import { gasService } from '../services/gasService';
import { useSalehaStore } from '../composables/useSalehaStore';
import { GDRIVE_MEDIA_FOLDER_URL, SPREADSHEET_MASTER_URL } from '../config/appInfo';
import VersionBadge from './VersionBadge.vue';
import ModalAdminLogin from './ModalAdminLogin.vue';
import ModalConfirm from './ModalConfirm.vue';

defineProps({
  isOpen: Boolean
});

const emit = defineEmits(['close']);

const store = useSalehaStore();
const loadingAuth = ref(false);
const showAdminModal = ref(false);
const showLogoutConfirm = ref(false);
const showResetConfirm = ref(false);
const syncingFirestore = ref(false);
const syncSuccessMessage = ref('');

async function handleLoginGoogle() {
  loadingAuth.value = true;
  const res = await store.loginGoogle();
  loadingAuth.value = false;
  if (res.success) {
    alert(`Alhamdulillah, berhasil masuk sebagai ${res.user.displayName}!`);
  } else {
    alert(`Kendala login: ${res.error?.message || 'Login dibatalkan.'}`);
  }
}

function requestLogout() {
  showLogoutConfirm.value = true;
}

async function confirmLogout() {
  showLogoutConfirm.value = false;
  loadingAuth.value = true;
  await store.logout();
  loadingAuth.value = false;
}

function requestResetData() {
  showResetConfirm.value = true;
}

function confirmResetData() {
  showResetConfirm.value = false;
  store.resetToDefaultData();
  syncSuccessMessage.value = '✓ Data contoh demo Sumenep telah dikembalikan.';
}

async function handleSyncAllToFirestore() {
  if (!store.firebaseUser.value) {
    alert('Harap login terlebih dahulu untuk sinkronisasi ke Cloud Firestore & Google Sheets.');
    return;
  }
  syncingFirestore.value = true;
  syncSuccessMessage.value = '';
  try {
    let count = 0;
    for (const item of store.permohonanList.value) {
      await firestoreService.savePermohonan(item);
      await gasService.syncToGoogleSheet(item);
      count++;
    }
    syncSuccessMessage.value = `✓ Berhasil mengunggah ${count} data tiket ke Cloud Firestore & Google Sheets!`;
  } catch (err) {
    alert('Gagal sinkronkan: ' + (err.message || err));
  } finally {
    syncingFirestore.value = false;
  }
}
</script>
