# 📄 Product Requirements Document (PRD) & Software Requirements Specification (SRS)

**Nama Proyek:** LEGS (Library Engine Generate System)
**Konteks:** Portal Internal Perpustakaan Pusat Universitas Terbuka

---

## BAGIAN 1: PRD (Product Requirements Document)

### 1. Visi Produk

LEGS adalah sebuah portal web internal (Gateway Hub) yang bertindak sebagai pintu gerbang tunggal dan aman menuju seluruh aplikasi serta _engine_ yang digunakan oleh staf Perpustakaan Pusat. Sistem ini dirancang sepenuhnya dinamis, minimalis, dan elegan tanpa memerlukan perubahan _source code_ saat ada penambahan aplikasi baru.

### 2. Target Pengguna

- **Administrator (IT):** Memiliki kendali penuh untuk mengelola akses pengguna dan mendaftarkan aplikasi baru ke dalam portal.
- **Pengguna (Pustakawan/Staf Operasional/AdminIT):** Menggunakan portal murni sebagai _launcher_ atau _dashboard_ untuk mengakses aplikasi kerja (seperti ETL Karil, dll).

### 3. Ruang Lingkup & Fitur Utama

- **Sistem Autentikasi Tertutup:** Tidak ada fitur pendaftaran publik (_register_). Akses masuk murni menggunakan kombinasi **Username** dan **Password**.
- **Landing Page Dinamis (App Dashboard):** Menampilkan daftar aplikasi dalam bentuk _Grid/Card_ tipografi yang elegan dan bersih, tanpa menggunakan _file_ gambar/ikon.
- **Modul Manajemen Pengguna (User CRUD):** Antarmuka khusus admin untuk menambah, melihat, mengedit, dan menghapus staf yang berhak mengakses LEGS.
- **Modul Manajemen Aplikasi (App CRUD):** Antarmuka khusus admin untuk mendaftarkan URL aplikasi baru, lengkap dengan Nama dan Deskripsi, agar langsung tampil di _Landing Page_.

---

## BAGIAN 2: SRS (Software Requirements Specification)

### 1. Tumpukan Teknologi (Tech Stack)

Aplikasi ini akan dibangun menggunakan standar struktur **EXVAN**:

- **Backend:** Node.js dengan kerangka kerja Express.js.
- **Frontend:** Vanilla JavaScript, HTML5, dan CSS3 murni.
- **Database:** MySQL.

### 2. Kebutuhan Fungsional (Functional Requirements)

**A. Autentikasi & Keamanan**

- Sistem harus memvalidasi sesi pengguna sebelum menampilkan _dashboard_ (menggunakan JWT atau _Session Cookie_).
- Sistem wajib melakukan _hashing_ kriptografi standar industri (misal: `bcrypt`) pada setiap _password_ sebelum disimpan ke MySQL. Tidak boleh ada _password_ dalam bentuk _plaintext_.

**B. Manajemen Pengguna (Khusus Admin)**

- Sistem menyediakan form _Create User_ dengan input: `Username`, `Password`, dan `Role` (Admin/User).
- Sistem dapat mereset _password_ pengguna dan memperbarui data _role_.
- Sistem dapat menghapus akun secara permanen (_hard delete_) atau menonaktifkannya (_soft delete_).

**C. Manajemen Aplikasi (Khusus Admin)**

- Sistem menyediakan form _Create App_ dengan input: `Nama Aplikasi`, `Deskripsi Singkat`, `URL Tujuan`, dan `Status` (Aktif/Nonaktif).
- Sistem tidak menyediakan fitur unggah _file_ (logo/ikon). Tampilan aplikasi di _dashboard_ murni mengandalkan desain tipografi (teks) yang modern dan proporsional.

**D. Landing Page (Dashboard Pengguna)**

- Sistem mengambil data aplikasi yang berstatus "Aktif" dari MySQL dan menampilkannya (_Read_).
- Setiap _card_ aplikasi yang diklik akan mengarahkan (_redirect/open new tab_) pengguna ke `URL Tujuan` yang terdaftar.

### 3. Kebutuhan Non-Fungsional (Non-Functional Requirements)

- **Keamanan Database:** Semua _query_ ke MySQL harus dilindungi dari serangan _SQL Injection_ (menggunakan _Prepared Statements_ atau ORM ringan).
- **Antarmuka Pengguna (UI/UX):** Tampilan harus ekstra responsif, cantik, dan modern. Mengutamakan _whitespace_, kombinasi warna yang profesional, serta penulisan kode CSS yang modular dan rapi.
- **Struktur Kode:** Penulisan _code_ berbasis Javascript harus rapi, modular, jelas, dan menerapkan prinsip _Software Engineering_ yang baik agar sistem sangat stabil dalam jangka panjang.
