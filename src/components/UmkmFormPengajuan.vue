<template>
  <div class="pb-6 bg-slate-50">
    
    <!-- Top Compact Header (Directly connected to form) -->
    <div class="bg-emerald-900 text-white px-3.5 py-3 border-b border-emerald-950">
      <h2 class="text-sm font-black tracking-tight leading-none">
        Formulir Pengajuan Legalitas
      </h2>
      <p class="text-[10px] text-emerald-200 mt-1 leading-none">
        Pendampingan gratis oleh Tim LPNU PCNU Sumenep
      </p>
    </div>

    <!-- Seamless Edge-to-edge Form (Divide-y, no vertical gaps) -->
    <form @submit.prevent="handleSubmit" class="bg-white border-b border-slate-200 divide-y divide-slate-100">
      
      <!-- Section 1: Identitas Pemohon -->
      <div class="px-3.5 py-3 space-y-2.5">
        <div class="flex items-center justify-between">
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block leading-none">
            1. Data Pemilik Usaha
          </span>
          <span v-if="store.firebaseUser.value" class="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-full">
            ✓ Google Terhubung
          </span>
        </div>

        <!-- Google Quick Login Banner if not signed in -->
        <div v-if="!store.firebaseUser.value" class="pb-0.5">
          <button
            type="button"
            @click="handleGoogleSignIn"
            class="w-full py-2 px-2.5 bg-white hover:bg-slate-50 active:scale-98 border border-slate-300 rounded-lg text-[11px] font-bold text-slate-700 flex items-center justify-center gap-2 shadow-2xs transition-all"
          >
            <svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Masuk Google untuk Isi Nama & Email Cepat</span>
          </button>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">
            Nama Lengkap (KTP) <span class="text-rose-500">*</span>
          </label>
          <input
            v-model="form.namaPemilik"
            type="text"
            required
            placeholder="Nama sesuai KTP"
            class="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-hidden"
          />
        </div>

        <div class="grid grid-cols-2 gap-2">
          <!-- NIK -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">
              NIK (16 Digit) <span class="text-rose-500">*</span>
            </label>
            <input
              v-model="form.nik"
              type="text"
              inputmode="numeric"
              maxlength="16"
              required
              placeholder="3529xxxxxxxxxxxx"
              @input="filterNik"
              class="w-full text-xs font-mono p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-hidden"
            />
          </div>

          <!-- No WA -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">
              No. WhatsApp <span class="text-rose-500">*</span>
            </label>
            <input
              v-model="form.noWa"
              type="tel"
              required
              placeholder="081234567890"
              class="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-hidden"
            />
          </div>
        </div>

        <!-- Opsi: Belum Punya Email -->
        <div class="pt-0.5">
          <label class="flex items-start gap-2 p-2 rounded-lg bg-emerald-50/70 border border-emerald-200 cursor-pointer">
            <input
              type="checkbox"
              v-model="buatkanEmailBaru"
              @change="handleBuatkanEmailToggle"
              class="mt-0.5 w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
            />
            <div class="text-left">
              <span class="text-xs font-bold text-emerald-950 block leading-tight">
                Belum punya email? Buatkan baru oleh Petugas LPNU
              </span>
              <span class="text-[10px] text-emerald-700 block mt-0.5 leading-snug">
                Petugas LPNU akan membuatkan email akun OSS khusus untuk usaha Anda.
              </span>
            </div>
          </label>
        </div>

        <!-- Input Email & Password (Jika sudah punya email) -->
        <div v-if="!buatkanEmailBaru" class="space-y-2">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">
              Alamat Email Pemohon <span class="text-rose-500">*</span>
            </label>
            <input
              v-model="form.email"
              type="email"
              :required="!buatkanEmailBaru"
              placeholder="contoh: namausaha@gmail.com"
              class="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-hidden"
            />
          </div>

          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="block text-xs font-semibold text-slate-700">
                Kata Sandi (Password) Email <span class="text-rose-500">*</span>
              </label>
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="text-[10px] text-emerald-700 font-semibold hover:underline"
              >
                {{ showPassword ? 'Sembunyikan' : 'Tampilkan Sandi' }}
              </button>
            </div>
            <input
              v-model="form.passwordEmail"
              :type="showPassword ? 'text' : 'password'"
              :required="!buatkanEmailBaru"
              placeholder="Password email pemohon"
              class="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-hidden"
            />
            <span class="text-[10px] text-slate-400 block mt-0.5 leading-tight">
              Diperlukan petugas LPNU untuk membuka email verifikasi aktivasi hak akses dari OSS-RBA.
            </span>
          </div>

          <!-- Info / Checkbox 2FA (Verifikasi 2 Langkah) -->
          <div class="bg-amber-50/80 border border-amber-200/90 rounded-lg p-2 text-[10px] text-amber-900 space-y-1">
            <label class="flex items-start gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                v-model="form.punya2fa"
                class="mt-0.5 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
              />
              <span class="leading-tight font-bold">
                Email saya pakai Verifikasi 2 Langkah (Google Prompt / OTP)
              </span>
            </label>
            <p class="text-[9.5px] text-amber-800 leading-snug pl-5">
              Jika aktif, petugas LPNU akan menghubungi via WhatsApp saat pendaftaran OSS untuk meminta konfirmasi ketuk <strong>"Ya / Izinkan"</strong> di HP Anda atau kode OTP SMS.
            </p>
          </div>
        </div>
      </div>

      <!-- Section 2: Data Usaha di Sumenep -->
      <div class="px-3.5 py-3 space-y-2.5">
        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block leading-none">
          2. Lokasi & Usaha
        </span>

        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">
            Nama Merk / Usaha <span class="text-rose-500">*</span>
          </label>
          <input
            v-model="form.namaUsaha"
            type="text"
            required
            placeholder="Contoh: Kopi Barokah"
            class="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-hidden"
          />
        </div>

        <div class="grid grid-cols-2 gap-2">
          <!-- Kecamatan (Searchable Picker) -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">
              Kecamatan <span class="text-rose-500">*</span>
            </label>
            <button
              type="button"
              @click="isKecamatanModalOpen = true"
              class="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg flex items-center justify-between text-left focus:ring-1 focus:ring-emerald-600 focus:outline-hidden hover:bg-slate-100 transition-colors"
            >
              <span class="truncate font-semibold text-slate-800">
                {{ form.kecamatan || 'Pilih Kecamatan' }}
              </span>
              <div class="flex items-center gap-1 shrink-0 ml-1 text-slate-400">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </button>
          </div>

          <!-- Desa -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">
              Desa / Kelurahan <span class="text-rose-500">*</span>
            </label>
            <input
              v-model="form.desa"
              type="text"
              required
              placeholder="Nama Desa"
              class="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-hidden"
            />
          </div>
        </div>

        <div>
          <input
            v-model="form.detailAlamat"
            type="text"
            placeholder="Alamat detail / RT RW (Opsional)"
            class="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-hidden"
          />
        </div>
      </div>

      <!-- Section 3: Jenis Legalitas (Compact Chips) -->
      <div class="px-3.5 py-3 space-y-2">
        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block leading-none">
          3. Izin yang Diajukan
        </span>

        <div class="grid grid-cols-3 gap-1.5">
          <label
            v-for="izin in JENIS_IZIN"
            :key="izin.id"
            class="p-2 rounded-lg border text-center cursor-pointer transition-all text-xs font-bold leading-tight"
            :class="form.jenisIzin.includes(izin.id)
              ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs'
              : 'bg-slate-50 text-slate-700 border-slate-200'"
          >
            <input type="checkbox" :value="izin.id" v-model="form.jenisIzin" class="hidden" />
            <span class="block text-[11px]">{{ izin.id }}</span>
            <span class="block text-[9px] font-normal opacity-80 mt-0.5 truncate">{{ izin.id === 'NIB' ? 'OSS-RBA' : (izin.id === 'HALAL' ? 'SEHATI' : 'Pangan') }}</span>
          </label>
        </div>
      </div>

      <!-- Section 4: Foto KTP & Produk (Compact 2 Tiles) -->
      <div class="px-3.5 py-3 space-y-2">
        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block leading-none">
          4. Foto Berkas & Produk
        </span>

        <div class="grid grid-cols-2 gap-2">
          
          <!-- Foto KTP -->
          <label
            class="relative flex flex-col items-center justify-center p-3 border-2 border-dashed rounded-xl cursor-pointer transition-colors text-center aspect-video overflow-hidden"
            :class="previewKtp ? 'border-emerald-500 bg-emerald-50/20' : 'border-slate-300 bg-slate-50'"
          >
            <input type="file" accept="image/*" class="hidden" @change="e => handleFileSelect(e, 'ktp')" />
            <img v-if="previewKtp" :src="previewKtp" alt="KTP" class="absolute inset-0 w-full h-full object-cover" />
            <div v-else class="space-y-1">
              <svg class="w-5 h-5 mx-auto text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
              </svg>
              <span class="text-[11px] font-bold text-slate-700 block leading-tight">Foto KTP *</span>
            </div>
            <span v-if="previewKtp" class="absolute bottom-1 right-1 bg-emerald-700 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">Ganti</span>
          </label>

          <!-- Foto Usaha -->
          <label
            class="relative flex flex-col items-center justify-center p-3 border-2 border-dashed rounded-xl cursor-pointer transition-colors text-center aspect-video overflow-hidden"
            :class="previewProduk ? 'border-emerald-500 bg-emerald-50/20' : 'border-slate-300 bg-slate-50'"
          >
            <input type="file" accept="image/*" class="hidden" @change="e => handleFileSelect(e, 'produk')" />
            <img v-if="previewProduk" :src="previewProduk" alt="Produk" class="absolute inset-0 w-full h-full object-cover" />
            <div v-else class="space-y-1">
              <svg class="w-5 h-5 mx-auto text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <span class="text-[11px] font-bold text-slate-700 block leading-tight">Foto Usaha *</span>
            </div>
            <span v-if="previewProduk" class="absolute bottom-1 right-1 bg-emerald-700 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">Ganti</span>
          </label>

        </div>
      </div>

      <!-- Submit Action Button (Integrated directly, no gap) -->
      <div class="p-3.5 bg-slate-50">
        <button
          type="submit"
          :disabled="isSubmitting || form.nik.length !== 16 || !previewKtp || !previewProduk || form.jenisIzin.length === 0"
          class="w-full py-3 bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 text-white rounded-xl font-bold text-xs tracking-wide shadow-xs flex items-center justify-center gap-1.5 transition-colors"
        >
          <span v-if="isSubmitting" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          <span v-else>Bismillah, Kirim Pengajuan</span>
        </button>
      </div>

    </form>

    <!-- Searchable Kecamatan Modal / Bottom Sheet -->
    <SearchableKecamatanModal
      v-model="form.kecamatan"
      :is-open="isKecamatanModalOpen"
      @close="isKecamatanModalOpen = false"
    />

  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue';
import { KECAMATAN_SUMENEP, JENIS_IZIN } from '../data/sumenep';
import { useSalehaStore } from '../composables/useSalehaStore';
import { gasService } from '../services/gasService';
import SearchableKecamatanModal from './SearchableKecamatanModal.vue';

const emit = defineEmits(['submitted']);

const store = useSalehaStore();
const isSubmitting = ref(false);
const buatkanEmailBaru = ref(false);
const showPassword = ref(false);
const isKecamatanModalOpen = ref(false);

async function handleGoogleSignIn() {
  const res = await store.loginGoogle();
  if (res.success && res.user) {
    if (!form.namaPemilik) form.namaPemilik = res.user.displayName || '';
    if (!form.email && !buatkanEmailBaru.value) form.email = res.user.email || '';
  }
}

watch(() => store.firebaseUser.value, (u) => {
  if (u) {
    if (!form.namaPemilik) form.namaPemilik = u.displayName || '';
    if (!form.email && !buatkanEmailBaru.value) form.email = u.email || '';
  }
});

const form = reactive({
  namaPemilik: store.currentUmkmUser.value?.namaPemilik || '',
  nik: store.currentUmkmUser.value?.nik || '',
  noWa: store.currentUmkmUser.value?.noWa || '',
  email: store.currentUmkmUser.value?.email || '',
  passwordEmail: store.currentUmkmUser.value?.passwordEmail || '',
  punya2fa: false,
  namaUsaha: '',
  kecamatan: 'Kota Sumenep',
  desa: '',
  detailAlamat: '',
  jenisIzin: ['NIB', 'HALAL']
});

function handleBuatkanEmailToggle() {
  if (buatkanEmailBaru.value) {
    form.email = 'Dibuatkan oleh Tim LPNU';
    form.passwordEmail = 'Dibuatkan oleh Tim LPNU';
  } else {
    form.email = store.currentUmkmUser.value?.email || '';
    form.passwordEmail = store.currentUmkmUser.value?.passwordEmail || '';
  }
}

const previewKtp = ref('');
const fileKtp = ref(null);

const previewProduk = ref('');
const fileProduk = ref(null);

function filterNik(e) {
  form.nik = form.nik.replace(/\D/g, '').slice(0, 16);
}

async function handleFileSelect(e, type) {
  const file = e.target.files[0];
  if (!file) return;

  const result = await gasService.compressImage(file);
  if (type === 'ktp') {
    previewKtp.value = result.dataUrl;
    fileKtp.value = file;
  } else {
    previewProduk.value = result.dataUrl;
    fileProduk.value = file;
  }
}

async function handleSubmit() {
  if (form.nik.length !== 16) {
    alert('NIK harus 16 digit.');
    return;
  }
  if (!buatkanEmailBaru.value) {
    if (!form.email || !form.email.includes('@')) {
      alert('Email aktif pemohon wajib diisi untuk aktivasi akun OSS-RBA.');
      return;
    }
    if (!form.passwordEmail) {
      alert('Kata sandi email wajib diisi agar petugas dapat membuka email verifikasi aktivasi akun OSS.');
      return;
    }
  }
  if (!previewKtp.value || !previewProduk.value) {
    alert('Lengkapi foto KTP dan foto usaha.');
    return;
  }
  if (form.jenisIzin.length === 0) {
    alert('Pilih minimal satu izin.');
    return;
  }

  isSubmitting.value = true;

  try {
    let finalKtpUrl = previewKtp.value;
    let finalProdukUrl = previewProduk.value;

    if (fileKtp.value) {
      const resKtp = await gasService.uploadFile({ file: fileKtp.value, folderType: 'ktp' });
      if (resKtp && resKtp.url) finalKtpUrl = resKtp.url;
    }
    if (fileProduk.value) {
      const resProduk = await gasService.uploadFile({ file: fileProduk.value, folderType: 'produk' });
      if (resProduk && resProduk.url) finalProdukUrl = resProduk.url;
    }

    const created = await store.createPermohonan({
      namaPemilik: form.namaPemilik,
      nik: form.nik,
      noWa: form.noWa,
      email: form.email,
      passwordEmail: form.passwordEmail,
      punya2fa: form.punya2fa,
      namaUsaha: form.namaUsaha,
      kecamatan: form.kecamatan,
      desa: form.desa,
      detailAlamat: form.detailAlamat,
      jenisIzin: form.jenisIzin,
      fotoKtpUrl: finalKtpUrl,
      fotoProdukUrl: finalProdukUrl
    });

    store.loginUmkm({
      noWa: form.noWa,
      email: form.email,
      passwordEmail: form.passwordEmail,
      namaPemilik: form.namaPemilik,
      nik: form.nik
    });

    alert(`Pengajuan berhasil terkirim! No Tiket: ${created.id_ticket}`);
    emit('submitted', created);
  } catch (error) {
    console.error('Submit error:', error);
    alert('Kendala pengajuan: ' + error.message);
  } finally {
    isSubmitting.value = false;
  }
}
</script>
