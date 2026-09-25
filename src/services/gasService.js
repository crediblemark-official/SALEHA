/**
 * Service untuk komunikasi dengan Google Apps Script (GAS)
 * Mengupload berkas Base64 ke Google Drive dan sync data ke Google Sheets
 */

const GAS_URL_KEY = 'saleha_gas_webapp_url';

export const gasService = {
  getGasUrl() {
    return localStorage.getItem(GAS_URL_KEY) || import.meta.env.VITE_GAS_URL || '';
  },

  setGasUrl(url) {
    if (url) {
      localStorage.setItem(GAS_URL_KEY, url.trim());
    } else {
      localStorage.removeItem(GAS_URL_KEY);
    }
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
  }
};
