  /**
  * =========================================================================
  * SALEHA - BACKEND GOOGLE APPS SCRIPT (GAS)
  * Lembaga Perekonomian Nahdlatul Ulama (LPNU) PCNU Kabupaten Sumenep
  * 
  * Fungsi:
  * 1. Menerima upload Base64 Foto KTP, Produk, dan PDF Legalitas ke Google Drive
  * 2. Sinkronisasi data permohonan ke Google Sheets Master: SALEHA
  * 3. Mengelola daftar hak akses Admin dinamis via Tab ADMIN_USERS
  * =========================================================================
  */

  // Konfigurasi ID Folder Google Drive & ID Spreadsheet LPNU
  const CONFIG = {
    // Folder Utama Penyimpanan Berkas Media SALEHA (Google Drive):
    FOLDER_MEDIA_ID: "1Uf9PEOhs8dTqLBn2x8FkNDSoGiKmbVJk",
    FOLDER_KTP_ID: "1Uf9PEOhs8dTqLBn2x8FkNDSoGiKmbVJk",
    FOLDER_PRODUK_ID: "1Uf9PEOhs8dTqLBn2x8FkNDSoGiKmbVJk",
    FOLDER_PDF_ID: "1Uf9PEOhs8dTqLBn2x8FkNDSoGiKmbVJk",
    SPREADSHEET_ID: "14HAizow9Itv-9V7KClg1HoPsI7hhjkg2qvPETRrjqIw",
    SHEET_NAME_MASTER: "MASTER_DATA",
    SHEET_NAME_REKAP: "REKAP_KECAMATAN",
    SHEET_NAME_ADMINS: "ADMIN_USERS"
  };

  /**
  * Endpoint GET (Digunakan untuk cek status, ambil admin, atau inisialisasi sheet)
  */
  function doGet(e) {
    const action = e && e.parameter ? e.parameter.action : null;
    
    if (action === "getAdmins") {
      return handleGetAdmins();
    }
    
    if (action === "initDatabase" || action === "setup") {
      return responseJson(initDatabase());
    }

    return responseJson({
      status: "online",
      service: "SALEHA LPNU Sumenep API Gateway",
      spreadsheetId: CONFIG.SPREADSHEET_ID,
      timestamp: new Date().toISOString()
    });
  }

  /**
  * Endpoint POST (Digunakan untuk upload berkas atau sinkronisasi data dari Web/Android)
  */
  function doPost(e) {
    try {
      const rawData = e.postData ? e.postData.contents : null;
      if (!rawData) {
        return responseJson({ success: false, error: "Empty request body" });
      }

      const payload = JSON.parse(rawData);
      const action = payload.action;

      if (action === "uploadFile") {
        return handleUploadFile(payload);
      } else if (action === "syncSheet") {
        return handleSyncSheet(payload);
      } else if (action === "getAdmins") {
        return handleGetAdmins();
      } else if (action === "initDatabase" || action === "setup") {
        return responseJson(initDatabase());
      } else {
        return responseJson({ success: false, error: "Unknown action: " + action });
      }
    } catch (err) {
      return responseJson({ success: false, error: err.toString() });
    }
  }

  /**
  * Mendapatkan objek Spreadsheet SALEHA secara handal
  */
  function getSalehaSpreadsheet() {
    if (CONFIG.SPREADSHEET_ID && !CONFIG.SPREADSHEET_ID.startsWith("GANTI_")) {
      try {
        return SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
      } catch (e) {
        console.warn("Gagal openById:", e);
      }
    }

    // Jika script container-bound pada spreadsheet
    try {
      const active = SpreadsheetApp.getActiveSpreadsheet();
      if (active) return active;
    } catch (e) {}

    // Fallback: cari file dengan nama SALEHA
    const files = DriveApp.getFilesByName("SALEHA");
    if (files.hasNext()) {
      return SpreadsheetApp.open(files.next());
    }

    const legacyFiles = DriveApp.getFilesByName("DATABASE_MASTER_SALEHA_PCNU");
    if (legacyFiles.hasNext()) {
      return SpreadsheetApp.open(legacyFiles.next());
    }

    const newSs = SpreadsheetApp.create("SALEHA");
    initDatabase(newSs);
    return newSs;
  }

  /**
  * Inisialisasi Tab dan Header pada Google Sheets SALEHA
  * Bisa dijalankan langsung dari editor Apps Script atau via GET ?action=initDatabase
  */
  function initDatabase(targetSs) {
    const ss = targetSs || getSalehaSpreadsheet();
    
    // 1. Inisialisasi Sheet Master Data
    let masterSheet = ss.getSheetByName(CONFIG.SHEET_NAME_MASTER);
    if (!masterSheet) {
      // Jika ada 'Sheet1' bawaan yang masih kosong, ubah namanya jadi MASTER_DATA
      const sheet1 = ss.getSheetByName("Sheet1") || ss.getSheetByName("Sheet 1");
      if (sheet1) {
        masterSheet = sheet1;
        masterSheet.setName(CONFIG.SHEET_NAME_MASTER);
      } else {
        masterSheet = ss.insertSheet(CONFIG.SHEET_NAME_MASTER);
      }
    }
    setupSheetHeaders(masterSheet);

    // 2. Inisialisasi Sheet Admin Users
    let adminSheet = ss.getSheetByName(CONFIG.SHEET_NAME_ADMINS);
    if (!adminSheet) {
      adminSheet = ss.insertSheet(CONFIG.SHEET_NAME_ADMINS);
    }
    setupAdminSheetHeaders(adminSheet);

    return {
      success: true,
      message: "Inisialisasi Database SALEHA Berhasil! Tab MASTER_DATA dan ADMIN_USERS telah siap.",
      spreadsheetUrl: ss.getUrl()
    };
  }

  /**
  * Format Header Tab MASTER_DATA
  */
  function setupSheetHeaders(sheet) {
    const headers = [
      "ID_Tiket",
      "Waktu_Pengajuan",
      "No_WhatsApp",
      "Email_OSS",
      "Nama_Pemilik",
      "NIK",
      "Nama_Usaha",
      "Kecamatan",
      "Jenis_Izin",
      "Link_KTP_Drive",
      "Link_Produk_Drive",
      "Status_Proses",
      "Catatan_LPNU",
      "Link_PDF_Hasil",
      "Operator_LPNU"
    ];

    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length)
      .setFontWeight("bold")
      .setBackground("#057a55")
      .setFontColor("#ffffff")
      .setHorizontalAlignment("center");
    
    try {
      sheet.setFrozenRows(1);
    } catch (e) {}
  }

  /**
  * Format Header Tab ADMIN_USERS dan contoh isi
  */
  function setupAdminSheetHeaders(sheet) {
    const headers = ["Email", "Nama_Operator", "Role", "Status_Aktif"];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length)
      .setFontWeight("bold")
      .setBackground("#057a55")
      .setFontColor("#ffffff")
      .setHorizontalAlignment("center");

    try {
      sheet.setFrozenRows(1);
    } catch (e) {}

    // Tambahkan admin bawaan jika masih kosong
    if (sheet.getLastRow() <= 1) {
      const defaultAdmins = [
        ["rasy.ibnzawawi@gmail.com", "Rasyiqi", "Super Admin", "AKTIF"],
        ["admin@lpnu-sumenep.or.id", "Tim Operator LPNU", "Admin", "AKTIF"]
      ];
      sheet.getRange(2, 1, defaultAdmins.length, headers.length).setValues(defaultAdmins);
    }
  }

  /**
  * Handle Upload Berkas (Base64) ke Google Drive Folder SALEHA
  */
  function handleUploadFile(payload) {
    const { fileName, mimeType, base64Data, folderType } = payload;
    
    if (!base64Data) {
      return responseJson({ success: false, error: "base64Data is required" });
    }

    // Ambil folder media utama SALEHA
    let parentFolder;
    try {
      parentFolder = DriveApp.getFolderById(CONFIG.FOLDER_MEDIA_ID);
    } catch (e) {
      const folders = DriveApp.getFoldersByName("SALEHA_MEDIA");
      parentFolder = folders.hasNext() ? folders.next() : DriveApp.createFolder("SALEHA_MEDIA");
    }

    // Pisahkan otomatis ke subfolder rapi (FOTO_KTP, FOTO_PRODUK, PDF_HASIL_LEGALITAS)
    let subfolderName = "FOTO_KTP";
    if (folderType === "produk") subfolderName = "FOTO_PRODUK";
    if (folderType === "pdf") subfolderName = "PDF_HASIL_LEGALITAS";

    let targetFolder;
    const subfolders = parentFolder.getFoldersByName(subfolderName);
    if (subfolders.hasNext()) {
      targetFolder = subfolders.next();
    } else {
      targetFolder = parentFolder.createFolder(subfolderName);
    }

    // Decode Base64 & simpan berkas ke subfolder
    const decodedData = Utilities.base64Decode(base64Data);
    const blob = Utilities.newBlob(decodedData, mimeType || "image/jpeg", fileName || "file_" + Date.now());
    const file = targetFolder.createFile(blob);

    // Set izin akses link publik (view) agar bisa dipratinjau pemohon & operator
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    const fileUrl = file.getUrl();
    const directDownloadUrl = "https://drive.google.com/uc?export=view&id=" + file.getId();

    return responseJson({
      success: true,
      fileId: file.getId(),
      viewUrl: fileUrl,
      downloadUrl: directDownloadUrl
    });
  }

  /**
  * Handle Sinkronisasi Baris Data ke Google Sheets Master
  */
  function handleSyncSheet(payload) {
    const item = payload.data;
    if (!item || !item.id_ticket) {
      return responseJson({ success: false, error: "data and id_ticket required" });
    }

    const ss = getSalehaSpreadsheet();
    let sheet = ss.getSheetByName(CONFIG.SHEET_NAME_MASTER);
    if (!sheet) {
      initDatabase(ss);
      sheet = ss.getSheetByName(CONFIG.SHEET_NAME_MASTER);
    }

    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    let rowIndexToUpdate = -1;

    // Cek apakah ID tiket sudah ada untuk di-update (kolom A = indeks 0)
    for (let i = 1; i < values.length; i++) {
      if (values[i][0] === item.id_ticket) {
        rowIndexToUpdate = i + 1; // 1-based index
        break;
      }
    }

    const rowValues = [
      item.id_ticket || "",
      item.created_at || new Date().toISOString(),
      "'" + (item.no_wa || ""),
      item.email || "",
      item.nama_pemilik || "",
      "'" + (item.nik || ""),
      item.nama_usaha || "",
      item.alamat_usaha && item.alamat_usaha.kecamatan ? item.alamat_usaha.kecamatan : "",
      Array.isArray(item.jenis_izin) ? item.jenis_izin.join(", ") : (item.jenis_izin || ""),
      item.foto_ktp_url || "",
      item.foto_produk_url || "",
      item.status || "BARU",
      item.catatan_lpnu || "",
      item.pdf_hasil_url || "",
      item.operator_assigned || ""
    ];

    if (rowIndexToUpdate > 0) {
      sheet.getRange(rowIndexToUpdate, 1, 1, rowValues.length).setValues([rowValues]);
    } else {
      sheet.appendRow(rowValues);
    }

    return responseJson({
      success: true,
      actionTaken: rowIndexToUpdate > 0 ? "updated" : "appended",
      id_ticket: item.id_ticket
    });
  }

  /**
  * Handle Pengambilan Admin Aktif dari Tab ADMIN_USERS
  */
  function handleGetAdmins() {
    const ss = getSalehaSpreadsheet();
    let sheet = ss.getSheetByName(CONFIG.SHEET_NAME_ADMINS);
    if (!sheet) {
      initDatabase(ss);
      sheet = ss.getSheetByName(CONFIG.SHEET_NAME_ADMINS);
    }

    const data = sheet.getDataRange().getValues();
    const admins = [];

    // Baris 1 adalah Header: [Email, Nama_Operator, Role, Status_Aktif]
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const email = String(row[0] || "").trim().toLowerCase();
      const nama = String(row[1] || "").trim();
      const role = String(row[2] || "admin").trim();
      const status = String(row[3] || "AKTIF").trim().toUpperCase();

      if (email && (status === "AKTIF" || status === "ACTIVE" || status === "TRUE" || status === "1")) {
        admins.push({ email: email, nama: nama, role: role });
      }
    }

    return responseJson({
      success: true,
      admins: admins
    });
  }

  function responseJson(obj) {
    return ContentService.createTextOutput(JSON.stringify(obj))
      .setMimeType(ContentService.MimeType.JSON);
  }
