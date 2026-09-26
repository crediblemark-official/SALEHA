/**
 * Service untuk komunikasi dengan Google Apps Script (GAS)
 * Mengupload berkas Base64 ke Google Drive dan sync data ke Google Sheets
 */

export const gasService = {
  getGasUrl() {
    return (import.meta.env.VITE_GAS_URL || '').trim();
  },

  /**
   * Kompresi gambar di sisi HP client sebelum upload (PRD 5: Performance <= 1MB)
   */
  async compressImage(file, maxWidth = 1280, maxHeight = 1280, quality = 0.75) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          let { width, height } = img;
          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
          resolve({
            base64Data: compressedBase64.split(',')[1],
            dataUrl: compressedBase64,
            mimeType: 'image/jpeg',
            fileName: file.name ? file.name.replace(/\.[^/.]+$/, "") + '.jpg' : 'foto_' + Date.now() + '.jpg'
          });
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  },

  /**
   * Upload file ke Google Drive via GAS endpoint
   */
  async uploadFile({ file, folderType = 'ktp' }) {
    try {
      const { base64Data, dataUrl, mimeType, fileName } = await this.compressImage(file);
      const gasUrl = this.getGasUrl();

      // Jika GAS URL dikonfigurasi, kirim HTTP POST ke GAS
      if (gasUrl) {
        const response = await fetch(gasUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            action: 'uploadFile',
            fileName,
            mimeType,
            base64Data,
            folderType
          })
        });

        const result = await response.json();
        if (result.success) {
          return {
            success: true,
            url: result.viewUrl,
            downloadUrl: result.downloadUrl,
            preview: dataUrl
          };
        }
      }

      // Fallback lokal jika GAS URL belum dipasang (menyimpan dataUrl base64 agar langsung bisa dipratinjau & didownload)
      return {
        success: true,
        url: dataUrl,
        downloadUrl: dataUrl,
        preview: dataUrl,
        isLocalFallback: true
      };
    } catch (error) {
      console.warn('Upload GAS fallback to local preview:', error);
      // Fallback
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve({
          success: true,
          url: e.target.result,
          preview: e.target.result,
          isLocalFallback: true
        });
        reader.readAsDataURL(file);
      });
    }
  },

  /**
   * Sinkronisasi data permohonan ke Google Sheets Master
   */
  async syncToGoogleSheet(permohonanData) {
    const gasUrl = this.getGasUrl();
    if (!gasUrl) {
      console.log('GAS URL belum disetel, sync Sheets disimulasikan lokal.');
      return { success: true, simulated: true };
    }

    try {
      const response = await fetch(gasUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'syncSheet',
          data: permohonanData
        })
      });
      return await response.json();
    } catch (error) {
      console.error('Gagal sync ke Google Sheets via GAS:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Ambil daftar admin terverifikasi dari Google Sheets (Tab ADMIN_USERS)
   */
  async fetchAdminsFromSheet() {
    const gasUrl = this.getGasUrl();
    if (!gasUrl) {
      return this.getCachedAdmins();
    }

    try {
      const url = gasUrl.includes('?') ? `${gasUrl}&action=getAdmins` : `${gasUrl}?action=getAdmins`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && Array.isArray(result.admins)) {
          this.setCachedAdmins(result.admins);
          return result.admins;
        }
      }
    } catch (error) {
      console.warn('Gagal fetch admin dari GAS Google Sheets, menggunakan cache lokal:', error);
    }

    return this.getCachedAdmins();
  },

  getCachedAdmins() {
    try {
      const cached = localStorage.getItem('saleha_admin_list_cache');
      if (cached) return JSON.parse(cached);
    } catch (e) {}
    // Default kontrol lokal awal
    return [
      { email: 'rasy.ibnzawawi@gmail.com', nama: 'Rasyiqi', role: 'admin' },
      { email: 'admin@lpnu-sumenep.or.id', nama: 'Tim Operator LPNU', role: 'admin' }
    ];
  },

  setCachedAdmins(admins) {
    try {
      localStorage.setItem('saleha_admin_list_cache', JSON.stringify(admins));
    } catch (e) {}
  },

  /**
   * Cek apakah email terdaftar di Google Sheet sebagai Admin aktif
   */
  async checkIsEmailAdminInSheet(email) {
    if (!email) return { isAdmin: false };
    const cleanEmail = email.toLowerCase().trim();
    const admins = await this.fetchAdminsFromSheet();
    const match = admins.find(a => (a.email || '').toLowerCase().trim() === cleanEmail);
    if (match) {
      return {
        isAdmin: true,
        nama: match.nama || 'Operator LPNU',
        role: match.role || 'admin'
      };
    }
    return { isAdmin: false };
  },

  /**
   * Ambil teks konten bantuan dinamis dari Google Sheets (Tab KONTEN_BANTUAN)
   */
  async fetchKontenBantuanFromSheet() {
    const gasUrl = this.getGasUrl();
    if (gasUrl) {
      try {
        const url = gasUrl.includes('?') ? `${gasUrl}&action=getKontenBantuan` : `${gasUrl}?action=getKontenBantuan`;
        const res = await fetch(url);
        if (res.ok) {
          const result = await res.json();
          if (result.success && Array.isArray(result.konten)) {
            localStorage.setItem('saleha_konten_bantuan_cache', JSON.stringify(result.konten));
            return result.konten;
          }
        }
      } catch (err) {
        console.warn('Gagal ambil konten bantuan dari Sheet, pakai cache:', err);
      }
    }

    try {
      const cached = localStorage.getItem('saleha_konten_bantuan_cache');
      if (cached) return JSON.parse(cached);
    } catch (e) {}

    return [];
  },

  /**
   * Ambil pengumuman aktif dari Google Sheets (Tab PENGUMUMAN)
   */
  async fetchPengumumanFromSheet() {
    const gasUrl = this.getGasUrl();
    if (gasUrl) {
      try {
        const url = gasUrl.includes('?') ? `${gasUrl}&action=getPengumuman` : `${gasUrl}?action=getPengumuman`;
        const res = await fetch(url);
        if (res.ok) {
          const result = await res.json();
          if (result.success && Array.isArray(result.pengumuman)) {
            localStorage.setItem('saleha_pengumuman_cache', JSON.stringify(result.pengumuman));
            return result.pengumuman;
          }
        }
      } catch (err) {
        console.warn('Gagal ambil pengumuman dari Sheet:', err);
      }
    }

    try {
      const cached = localStorage.getItem('saleha_pengumuman_cache');
      if (cached) return JSON.parse(cached);
    } catch (e) {}

    return [];
  },

  /**
   * Simpan pengumuman baru/update ke Google Sheets (Tab PENGUMUMAN)
   */
  async savePengumumanToSheet(pengumumanData) {
    const gasUrl = this.getGasUrl();
    if (!gasUrl) return { success: false, simulated: true };
    try {
      const response = await fetch(gasUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'savePengumuman',
          data: pengumumanData
        })
      });
      return await response.json();
    } catch (error) {
      console.warn('Gagal simpan pengumuman ke Sheets via GAS:', error);
      return { success: false, error: error.message };
    }
  }
};
