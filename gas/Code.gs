/**
 * =========================================================================
 * SALEHA - BACKEND GOOGLE APPS SCRIPT (GAS)
 * Lembaga Perekonomian Nahdlatul Ulama (LPNU) PCNU Kabupaten Sumenep
 * 
 * Fungsi:
 * 1. Menerima upload Base64 Foto KTP, Produk, dan PDF Legalitas ke Google Drive
 * 2. Sinkronisasi data permohonan ke Google Sheets Master: DATABASE_MASTER_SALEHA_PCNU
 * =========================================================================
 */

// Konfigurasi ID Folder Google Drive & ID Spreadsheet LPNU
// (Ganti nilai di bawah ini dengan ID folder dan sheet milik akun Google Drive PCNU Sumenep)
const CONFIG = {
  FOLDER_KTP_ID: "GANTI_DENGAN_ID_FOLDER_KTP_DRIVE",
  FOLDER_PRODUK_ID: "GANTI_DENGAN_ID_FOLDER_PRODUK_DRIVE",
  FOLDER_PDF_ID: "GANTI_DENGAN_ID_FOLDER_PDF_HASIL_DRIVE",
  SPREADSHEET_ID: "GANTI_DENGAN_ID_SPREADSHEET_MASTER_SALEHA",
  SHEET_NAME_MASTER: "MASTER_DATA",
  SHEET_NAME_REKAP: "REKAP_KECAMATAN"
};

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "online",
    service: "SALEHA LPNU Sumenep API Gateway",
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}

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
    } else {
      return responseJson({ success: false, error: "Unknown action: " + action });
    }
  } catch (err) {
    return responseJson({ success: false, error: err.toString() });
  }
}

/**
 * Handle Upload Berkas (Base64) ke Google Drive
 */
function handleUploadFile(payload) {
  const { fileName, mimeType, base64Data, folderType } = payload;
  
  if (!base64Data) {
    return responseJson({ success: false, error: "base64Data is required" });
  }

  // Pilih folder tujuan
  let folderId = CONFIG.FOLDER_KTP_ID;
  if (folderType === "produk") folderId = CONFIG.FOLDER_PRODUK_ID;
  if (folderType === "pdf") folderId = CONFIG.FOLDER_PDF_ID;

  let folder;
  try {
    folder = DriveApp.getFolderById(folderId);
  } catch (e) {
    // Fallback jika ID belum dikonfigurasi: buat/ambil folder SALEHA_UPLOADS di root drive
    const folders = DriveApp.getFoldersByName("SALEHA_UPLOADS_" + folderType.toUpperCase());
    folder = folders.hasNext() ? folders.next() : DriveApp.createFolder("SALEHA_UPLOADS_" + folderType.toUpperCase());
  }

  // Decode Base64
  const decodedData = Utilities.base64Decode(base64Data);
  const blob = Utilities.newBlob(decodedData, mimeType || "image/jpeg", fileName || "file_" + Date.now());
  const file = folder.createFile(blob);

  // Set izin publik terbatas agar dapat dilihat oleh admin & pemohon
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

  let ss;
  try {
    ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  } catch (e) {
    // Fallback: buka atau buat spreadsheet baru
    const files = DriveApp.getFilesByName("DATABASE_MASTER_SALEHA_PCNU");
    if (files.hasNext()) {
      ss = SpreadsheetApp.open(files.next());
    } else {
      ss = SpreadsheetApp.create("DATABASE_MASTER_SALEHA_PCNU");
      setupSheetHeaders(ss);
    }
  }

  let sheet = ss.getSheetByName(CONFIG.SHEET_NAME_MASTER);
  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.SHEET_NAME_MASTER);
    setupSheetHeaders(ss);
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

function setupSheetHeaders(ss) {
  let sheet = ss.getSheetByName(CONFIG.SHEET_NAME_MASTER);
  if (!sheet) {
    sheet = ss.getSheets()[0];
    sheet.setName(CONFIG.SHEET_NAME_MASTER);
  }

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
  sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#057a55").setFontColor("#ffffff");
}

function responseJson(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
