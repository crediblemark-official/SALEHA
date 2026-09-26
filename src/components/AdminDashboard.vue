<template>
  <div class="pb-6 bg-slate-50">
    
    <!-- Top Compact Header (Directly connected, no gap) -->
    <div class="bg-emerald-950 text-white px-3.5 py-2.5 flex items-center justify-between border-b border-emerald-900 gap-2">
      <div class="min-w-0 flex-1">
        <h2 class="text-xs sm:text-sm font-black tracking-tight text-white truncate leading-none">
          Back-Office LPNU
        </h2>
        <p class="text-[10px] text-emerald-300 mt-1 leading-none truncate">
          {{ store.currentAdminUser.value.nama }}
        </p>
      </div>

      <div class="flex items-center gap-1.5 shrink-0">
        <!-- Pengumuman Broadcast Button -->
        <button
          @click="showPengumumanModal = true"
          type="button"
          title="Kelola & Buat Pengumuman"
          class="h-7 px-2.5 bg-emerald-900 hover:bg-emerald-800 active:scale-95 text-emerald-100 hover:text-white rounded-lg text-[10.5px] font-bold flex items-center gap-1.5 border border-emerald-700/80 transition-all shadow-2xs"
        >
          <span class="text-xs">📢</span>
          <span>Pengumuman</span>
        </button>

        <!-- Export CSV Button -->
        <button
          @click="exportToCsv"
          type="button"
          title="Export Sheet CSV"
          class="h-7 px-2.5 bg-emerald-900 hover:bg-emerald-800 active:scale-95 text-emerald-100 hover:text-white rounded-lg text-[10.5px] font-bold flex items-center gap-1 border border-emerald-700/80 transition-all shadow-2xs"
        >
          <svg class="w-3.5 h-3.5 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <span>Export</span>
        </button>
      </div>
    </div>

    <!-- 1-Row Compact KPI Strip (Directly touching header) -->
    <div class="grid grid-cols-5 bg-white border-b border-slate-200 divide-x divide-slate-100 text-center py-2 px-1 text-xs">
      <div>
        <span class="text-[9px] text-slate-400 font-medium block">Total</span>
        <span class="text-xs font-black text-slate-800">{{ store.adminStats.value.total }}</span>
      </div>
      <div>
        <span class="text-[9px] text-amber-700 font-medium block">Baru</span>
        <span class="text-xs font-black text-amber-600">{{ store.adminStats.value.baru }}</span>
      </div>
      <div>
        <span class="text-[9px] text-blue-600 font-medium block">Proses</span>
        <span class="text-xs font-black text-blue-600">{{ store.adminStats.value.diproses }}</span>
      </div>
      <div>
        <span class="text-[9px] text-rose-600 font-medium block">Revisi</span>
        <span class="text-xs font-black text-rose-600">{{ store.adminStats.value.revisi }}</span>
      </div>
      <div>
        <span class="text-[9px] text-emerald-600 font-medium block">Terbit</span>
        <span class="text-xs font-black text-emerald-600">{{ store.adminStats.value.selesai }}</span>
      </div>
    </div>

    <!-- Filter & Search Controls (Directly touching KPI strip) -->
    <div class="bg-white border-b border-slate-200 p-2.5 space-y-2">
      
      <!-- Search Input -->
      <div class="relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari Tiket, Usaha, Pemilik..."
          class="w-full text-xs pl-8 pr-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-hidden"
        />
        <svg class="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </div>

      <!-- Filter Controls: Kecamatan + Status Chips -->
      <div class="flex items-center gap-1.5">
        <select
          v-model="filterKecamatan"
          class="text-xs p-1.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-hidden max-w-[130px] truncate"
        >
          <option value="ALL">Semua Kec (27)</option>
          <option v-for="kec in KECAMATAN_SUMENEP" :key="kec.id" :value="kec.nama">
            {{ kec.nama }}
          </option>
        </select>

        <!-- Status Filter Chips (Scrollable without visible scrollbar) -->
        <div class="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5 flex-1">
          <button
            v-for="st in ['ALL', 'BARU', 'DIPROSES', 'BUTUH_REVISI', 'SELESAI']"
            :key="st"
            @click="filterStatus = st"
            type="button"
            class="px-2 py-1 rounded-md text-[10px] font-bold shrink-0 transition-colors"
            :class="filterStatus === st ? 'bg-emerald-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
          >
            {{ st === 'ALL' ? 'Semua' : (st === 'BUTUH_REVISI' ? 'Revisi' : st) }}
          </button>
        </div>
      </div>

    </div>

    <!-- Antrean Table (Responsive horizontal scrollable table) -->
    <div class="bg-white border-b border-slate-200 overflow-x-auto">
      
      <div v-if="filteredTickets.length === 0" class="p-8 text-center text-xs text-slate-400">
        Tidak ada data permohonan yang sesuai filter.
      </div>

      <table v-else class="w-full text-left border-collapse" style="min-width: 960px">
        <thead>
          <tr class="bg-slate-100/80 border-b border-slate-200 text-[10px] font-extrabold text-slate-600 uppercase tracking-wider whitespace-nowrap">
            <th class="py-1 px-2">#</th>
            <th class="py-1 px-2">ID Tiket</th>
            <th class="py-1 px-2">Nama Usaha</th>
            <th class="py-1 px-2">Kecamatan</th>
            <th class="py-1 px-2">Nama Pemilik</th>
            <th class="py-1 px-2">No. WA</th>
            <th class="py-1 px-2">Akun OSS</th>
            <th class="py-1 px-2">Status</th>
            <th class="py-1 px-2">Petugas</th>
            <th class="py-1 px-2 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 text-xs">
          <tr
            v-for="(ticket, idx) in filteredTickets"
            :key="ticket.id_ticket"
            class="hover:bg-emerald-50/20 transition-colors whitespace-nowrap"
          >
            <!-- No urut -->
            <td class="py-1 px-2 text-slate-400 text-[10px]">{{ idx + 1 }}</td>

            <!-- ID Tiket -->
            <td class="py-1 px-2">
              <span class="font-mono text-[10px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                {{ ticket.id_ticket }}
              </span>
            </td>

            <!-- Nama Usaha -->
            <td class="py-1 px-2 font-bold text-slate-900 max-w-[160px]">
              <span class="block truncate" :title="ticket.nama_usaha">{{ ticket.nama_usaha }}</span>
            </td>

            <!-- Kecamatan -->
            <td class="py-1 px-2 text-slate-600">
              {{ ticket.alamat_usaha?.kecamatan || '-' }}
            </td>

            <!-- Nama Pemilik -->
            <td class="py-1 px-2 text-slate-700 font-medium max-w-[130px]">
              <span class="block truncate" :title="ticket.nama_pemilik">{{ ticket.nama_pemilik }}</span>
            </td>

            <!-- No WA -->
            <td class="py-1 px-2">
              <a
                v-if="ticket.no_wa"
                :href="'https://wa.me/62' + cleanPhone(ticket.no_wa)"
                target="_blank"
                class="text-emerald-700 font-semibold hover:underline"
              >0{{ cleanPhone(ticket.no_wa) }} ↗</a>
              <span v-else class="text-slate-400">-</span>
            </td>

            <!-- Akun OSS / Email -->
            <td class="py-1 px-2">
              <button
                v-if="ticket.email"
                @click.stop="openCredentialModal(ticket)"
                type="button"
                class="inline-flex items-center gap-1 px-1.5 py-0.5 bg-blue-50 hover:bg-blue-100 active:scale-95 text-blue-800 border border-blue-200 rounded text-[9.5px] font-bold transition-all max-w-[150px]"
              >
                <span>🔑</span>
                <span class="truncate font-mono">{{ ticket.email }}</span>
                <span v-if="ticket.punya_2fa" class="bg-rose-500 text-white text-[7px] font-extrabold px-1 rounded-full shrink-0">2FA</span>
                <span v-else-if="ticket.email === 'Dibuatkan oleh Tim LPNU'" class="bg-amber-100 text-amber-800 text-[7px] px-1 rounded shrink-0">Buatkan</span>
              </button>
              <span v-else class="text-slate-400 italic">-</span>
            </td>

            <!-- Status -->
            <td class="py-1 px-2">
              <StatusBadge :status="ticket.status" />
            </td>

            <!-- Petugas -->
            <td class="py-1 px-2 max-w-[120px]">
              <span v-if="ticket.operator_assigned" class="text-[10.5px] text-slate-700 block truncate" :title="ticket.operator_assigned">
                {{ ticket.operator_assigned.split(',')[0] }}
              </span>
              <span v-else class="text-[10px] text-amber-600 font-semibold italic">Belum diklaim</span>
            </td>

            <!-- Aksi -->
            <td class="py-1 px-2 text-right">
              <div class="inline-flex items-center gap-1">
                <a
                  v-if="ticket.foto_ktp_url"
                  :href="ticket.foto_ktp_url"
                  target="_blank"
                  class="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-[10px] border border-slate-200 transition-colors"
                >KTP ↗</a>
                <button
                  v-if="!ticket.operator_assigned"
                  @click="store.claimTicket(ticket.id_ticket, store.currentAdminUser.value.nama)"
                  type="button"
                  class="px-2 py-1 bg-amber-100 hover:bg-amber-200 active:scale-95 text-amber-900 font-bold rounded-lg text-[10px] border border-amber-200 transition-all"
                >Klaim</button>
                <button
                  @click="openExecuteModal(ticket)"
                  type="button"
                  class="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-bold rounded-lg text-[10px] transition-all"
                >Proses</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

    </div>



    <!-- Bottom Footer Logout Button -->
    <div class="p-4 text-center">
      <button
        @click="handleLogoutAdmin"
        type="button"
        class="text-xs font-bold text-rose-700 hover:text-rose-800 hover:underline inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg hover:bg-rose-50 transition-colors"
      >
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
        </svg>
        <span>Keluar dari Portal Admin</span>
      </button>
    </div>

    <!-- Modal Update Status -->
    <ModalUpdateStatus
      :isOpen="showUpdateModal"
      :ticket="activeTicketForUpdate"
      @close="showUpdateModal = false"
    />

    <!-- Modal Kredensial Email & 2FA -->
    <ModalKredensialEmail
      :isOpen="showCredentialModal"
      :ticket="activeTicketForCredential"
      @close="showCredentialModal = false"
    />

    <!-- Modal Konfirmasi Logout Admin Custom -->
    <ModalConfirm
      :is-open="showLogoutConfirm"
      title="Keluar dari Portal Admin?"
      message="Apakah Anda yakin ingin keluar dari Portal Administrator LPNU Sumenep?"
      confirm-text="Ya, Keluar"
      cancel-text="Batal"
      variant="danger"
      icon="logout"
      @confirm="confirmLogoutAdmin"
      @cancel="showLogoutConfirm = false"
    />

    <!-- Modal Kelola Pengumuman Admin -->
    <ModalKelolaPengumuman
      :is-open="showPengumumanModal"
      @close="showPengumumanModal = false"
    />

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { KECAMATAN_SUMENEP } from '../data/sumenep';
import { useSalehaStore } from '../composables/useSalehaStore';
import StatusBadge from './StatusBadge.vue';
import ModalUpdateStatus from './ModalUpdateStatus.vue';
import ModalKredensialEmail from './ModalKredensialEmail.vue';
import ModalConfirm from './ModalConfirm.vue';
import ModalKelolaPengumuman from './ModalKelolaPengumuman.vue';

const store = useSalehaStore();
const searchQuery = ref('');
const filterStatus = ref('ALL');
const filterKecamatan = ref('ALL');

const showPengumumanModal = ref(false);
const showUpdateModal = ref(false);
const activeTicketForUpdate = ref(null);

const showCredentialModal = ref(false);
const activeTicketForCredential = ref(null);

function openCredentialModal(ticket) {
  activeTicketForCredential.value = ticket;
  showCredentialModal.value = true;
}

const filteredTickets = computed(() => {
  let list = store.permohonanList.value;

  if (filterStatus.value !== 'ALL') {
    list = list.filter(t => t.status === filterStatus.value);
  }

  if (filterKecamatan.value !== 'ALL') {
    list = list.filter(t => t.alamat_usaha?.kecamatan === filterKecamatan.value);
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim();
    list = list.filter(t => 
      t.id_ticket.toLowerCase().includes(q) ||
      t.nama_usaha.toLowerCase().includes(q) ||
      t.nama_pemilik.toLowerCase().includes(q) ||
      (t.nik && t.nik.includes(q))
    );
  }

  return list;
});

function cleanPhone(phone) {
  if (!phone) return '';
  return phone.replace(/^0+/, '').replace(/\D/g, '');
}

function mintaOtp(ticket) {
  const cleanNo = cleanPhone(ticket.no_wa);
  const operatorName = store.currentAdminUser.value?.nama || 'Petugas LPNU';
  const text = encodeURIComponent(
    `Assalamu'alaikum wr. wb. Bapak/Ibu *${ticket.nama_pemilik}*,\n\n` +
    `Saya *${operatorName}* dari Tim Pendamping LPNU PCNU Sumenep sedang memproses pendaftaran izin usaha *${ticket.nama_usaha}* ke OSS-RBA.\n\n` +
    `Saat ini kami memerlukan verifikasi keamanan akun Google (${ticket.email}).\n\n` +
    `👉 *Mohon bantuan ketuk 'YA / IZINKAN' pada notifikasi yang baru muncul di layar HP Anda*, ATAU kirimkan kode angka verifikasi (OTP) Google yang masuk via SMS sekarang agar penerbitan NIB langsung selesai.\n\n` +
    `Matur sakalangkong / Terima kasih atas kerja samanya.`
  );
  window.open(`https://api.whatsapp.com/send?phone=62${cleanNo}&text=${text}`, '_blank');
}

function openExecuteModal(ticket) {
  activeTicketForUpdate.value = ticket;
  showUpdateModal.value = true;
}

function exportToCsv() {
  const headers = [
    "ID_Tiket", "Waktu_Pengajuan", "No_WhatsApp", "Email_OSS", "Status_2FA", "Nama_Pemilik", "NIK",
    "Nama_Usaha", "Kecamatan", "Desa", "Jenis_Izin", "Status_Proses",
    "Operator_LPNU", "Catatan_LPNU", "Link_KTP", "Link_PDF_Hasil"
  ];

  const rows = store.permohonanList.value.map(item => [
    item.id_ticket,
    item.created_at,
    item.no_wa,
    `"${item.email || ''}"`,
    item.punya_2fa ? 'AKTIF' : 'NONAKTIF',
    `"${item.nama_pemilik}"`,
    `'${item.nik}`,
    `"${item.nama_usaha}"`,
    `"${item.alamat_usaha?.kecamatan || ''}"`,
    `"${item.alamat_usaha?.desa || ''}"`,
    `"${Array.isArray(item.jenis_izin) ? item.jenis_izin.join(', ') : item.jenis_izin}"`,
    item.status,
    `"${item.operator_assigned || ''}"`,
    `"${(item.catatan_lpnu || '').replace(/"/g, '""')}"`,
    item.foto_ktp_url || '',
    item.pdf_hasil_url || ''
  ]);

  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `SALEHA_PCNU_MASTER_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

const showLogoutConfirm = ref(false);

function handleLogoutAdmin() {
  showLogoutConfirm.value = true;
}

async function confirmLogoutAdmin() {
  showLogoutConfirm.value = false;
  await store.logout();
}
</script>
