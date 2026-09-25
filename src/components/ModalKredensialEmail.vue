<template>
  <div v-if="isOpen && ticket" class="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-xs">
    <div class="bg-white rounded-2xl max-w-sm w-full p-4 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
      
      <!-- Modal Header -->
      <div class="flex items-center justify-between pb-2.5 border-b border-slate-100">
        <div>
          <div class="flex items-center gap-1.5">
            <span class="text-xs">🔑</span>
            <h3 class="font-extrabold text-slate-800 text-sm">Kredensial Email & 2FA</h3>
          </div>
          <p class="text-[10px] text-slate-400 font-mono mt-0.5">{{ ticket.id_ticket }} • {{ ticket.nama_usaha }}</p>
        </div>
        <button
          type="button"
          @click="$emit('close')"
          class="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Modal Body -->
      <div class="mt-3 space-y-3 text-xs">
        
        <!-- Case 1: Dibuatkan oleh LPNU -->
        <div v-if="ticket.email === 'Dibuatkan oleh Tim LPNU'" class="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-2 text-amber-900">
          <div class="flex items-center gap-1.5 font-bold text-xs text-amber-800">
            <span>📝</span>
            <span>Permintaan Email Baru</span>
          </div>
          <p class="text-[11px] leading-relaxed text-amber-900">
            Pemohon <strong>{{ ticket.nama_pemilik }}</strong> meminta dibuatkan akun email baru oleh Tim LPNU khusus untuk pengurusan OSS-RBA.
          </p>
          <div class="pt-1">
            <a
              href="https://accounts.google.com/signup"
              target="_blank"
              class="inline-flex items-center gap-1 bg-amber-600 hover:bg-amber-700 text-white font-bold px-2.5 py-1.5 rounded-lg text-[11px] shadow-2xs"
            >
              <span>Buat Akun Google Baru ↗</span>
            </a>
          </div>
        </div>

        <!-- Case 2: Email Pemohon Disediakan -->
        <div v-else class="space-y-3">
          
          <!-- Alamat Email -->
          <div class="space-y-1">
            <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Alamat Email (Akun OSS)
            </label>
            <div class="flex items-center justify-between p-2 bg-slate-50 border border-slate-200 rounded-lg">
              <span class="font-mono font-bold text-slate-900 select-all truncate text-xs">{{ ticket.email }}</span>
              <div class="flex items-center gap-1 shrink-0 ml-1">
                <button
                  type="button"
                  @click="copyText(ticket.email, 'email')"
                  class="px-2 py-0.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 rounded text-[10px] font-bold"
                >
                  {{ copiedField === 'email' ? '✓ Disalin' : 'Salin' }}
                </button>
                <a
                  href="https://mail.google.com"
                  target="_blank"
                  class="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 rounded text-[10px] font-bold"
                >
                  Gmail ↗
                </a>
              </div>
            </div>
          </div>

          <!-- Kata Sandi -->
          <div class="space-y-1">
            <div class="flex items-center justify-between">
              <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Kata Sandi (Password)
              </label>
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="text-[10px] text-emerald-700 font-semibold hover:underline"
              >
                {{ showPassword ? 'Sembunyikan' : 'Tampilkan' }}
              </button>
            </div>
            <div class="flex items-center justify-between p-2 bg-slate-50 border border-slate-200 rounded-lg">
              <span class="font-mono font-bold text-slate-900 select-all text-xs">
                {{ showPassword ? ticket.password_email : '••••••••••••' }}
              </span>
              <button
                type="button"
                @click="copyText(ticket.password_email, 'password')"
                class="px-2 py-0.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 rounded text-[10px] font-bold shrink-0 ml-1"
              >
                {{ copiedField === 'password' ? '✓ Disalin' : 'Salin Sandi' }}
              </button>
            </div>
          </div>

          <!-- Status & Notifikasi 2FA -->
          <div
            class="p-2.5 rounded-xl border space-y-1.5"
            :class="ticket.punya_2fa
              ? 'bg-rose-50/80 border-rose-200 text-rose-900'
              : 'bg-emerald-50/60 border-emerald-200 text-emerald-900'"
          >
            <div class="flex items-center gap-1.5 font-bold text-xs">
              <span>{{ ticket.punya_2fa ? '🔐' : '✓' }}</span>
              <span>
                {{ ticket.punya_2fa ? 'Verifikasi 2 Langkah (2FA) Aktif' : 'Status 2FA Tidak Ditandai' }}
              </span>
            </div>
            <p class="text-[10.5px] leading-snug">
              {{ ticket.punya_2fa
                ? 'Google akan meminta persetujuan "Ketuk Ya" di HP pemohon atau mengirimkan kode OTP SMS saat login.'
                : 'Jika saat login Google tetap meminta verifikasi keamanan, Anda bisa langsung kirim pesan minta OTP ke pemohon di bawah ini.' }}
            </p>
          </div>

          <!-- Tombol Aksi Minta OTP via WhatsApp -->
          <div class="pt-1">
            <button
              type="button"
              @click="kirimPesanOtp"
              class="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-xl font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition-all"
            >
              <span>📲</span>
              <span>Kirim Chat Minta OTP / Ketuk Ya via WA</span>
            </button>
            <p class="text-[9.5px] text-slate-400 text-center mt-1">
              Membuka WhatsApp ke 0{{ cleanPhone(ticket.no_wa) }} ({{ ticket.nama_pemilik }})
            </p>
          </div>

        </div>

        <!-- Tombol Tutup -->
        <div class="pt-2 border-t border-slate-100">
          <button
            type="button"
            @click="$emit('close')"
            class="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition-colors"
          >
            Tutup
          </button>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useSalehaStore } from '../composables/useSalehaStore';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  ticket: {
    type: Object,
    default: null
  }
});

defineEmits(['close']);

const store = useSalehaStore();
const showPassword = ref(false);
const copiedField = ref(null);

function cleanPhone(phone) {
  if (!phone) return '';
  return phone.replace(/^0+/, '').replace(/\D/g, '');
}

function copyText(text, field) {
  if (!text) return;
  navigator.clipboard.writeText(text);
  copiedField.value = field;
  setTimeout(() => {
    copiedField.value = null;
  }, 2000);
}

function kirimPesanOtp() {
  if (!props.ticket) return;
  const cleanNo = cleanPhone(props.ticket.no_wa);
  const operatorName = store.currentAdminUser.value?.nama || 'Petugas LPNU';
  const text = encodeURIComponent(
    `Assalamu'alaikum wr. wb. Bapak/Ibu *${props.ticket.nama_pemilik}*,\n\n` +
    `Saya *${operatorName}* dari Tim Pendamping LPNU PCNU Sumenep sedang memproses pendaftaran izin usaha *${props.ticket.nama_usaha}* ke portal OSS-RBA.\n\n` +
    `Saat ini kami memerlukan verifikasi keamanan masuk akun Google (${props.ticket.email}).\n\n` +
    `👉 *Mohon bantuan ketuk 'YA / IZINKAN' pada notifikasi yang baru muncul di layar HP Anda*, ATAU kirimkan kode angka verifikasi (OTP) Google yang masuk via SMS sekarang agar penerbitan NIB langsung selesai.\n\n` +
    `Matur sakalangkong / Terima kasih atas kerja samanya.`
  );
  window.open(`https://api.whatsapp.com/send?phone=62${cleanNo}&text=${text}`, '_blank');
}
</script>
