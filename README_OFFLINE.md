# Cara Menjalankan Aplikasi Secara Offline

Aplikasi ini telah dirancang untuk dapat dijalankan sepenuhnya tanpa koneksi internet setelah proses "build" selesai.

## Langkah-langkah:

1. **Build Aplikasi**:
   Di lingkungan pengembangan ini, aplikasi dikompilasi menjadi file statis.
   
2. **Export**:
   Gunakan fitur **"Export to ZIP"** dari menu Settings di AI Studio.

3. **Gunakan Folder `dist`**:
   Setelah diekspor, cari folder bernama `dist`. Folder ini berisi:
   - `index.html`
   - Folder `assets` (berisi file JavaScript dan CSS yang sudah digabung)

4. **Jalankan**:
   Anda hanya perlu menyalin isi folder `dist` ke komputer Anda. Anda bisa membukanya dengan server lokal sederhana (seperti ekstensi "Live Server" di VS Code) untuk menghindari batasan keamanan browser (CORS) saat membuka file HTML secara langsung.

**Catatan**: Anda TIDAK memerlukan folder `node_modules`, `src`, atau file konfigurasi lainnya untuk menjalankan aplikasi yang sudah jadi.
