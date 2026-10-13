# Task Tracker Kuliah

Aplikasi pencatat tugas kuliah yang dibuat dengan vanilla JavaScript, tanpa framework. Data tugas diambil dan diubah lewat REST API memakai `fetch`, `async/await`, dan `Promise.all`.

## Fitur

- Muat tugas dan daftar mata kuliah dari server secara paralel (`Promise.all`)
- Tambah tugas (`POST`) dengan validasi: judul minimal 3 karakter, deadline wajib
- Tandai selesai (`PATCH`) dan hapus (`DELETE`) lewat event delegation
- Filter Semua, Aktif, Selesai, plus counter tugas aktif
- Daftar diurutkan berdasarkan deadline terdekat
- Tampilan khusus untuk kondisi loading, error (dengan tombol "Coba lagi"), dan data kosong
- Tombol dikunci selama request berjalan
- Tetap berjalan saat offline, server lambat, atau server error

## Cara Kerja

Setiap aksi mengikuti alur yang sama: kirim request, tunggu respons, perbarui `state`, lalu `render()` menggambar ulang tampilan.

Semua request lewat satu fungsi `api()` yang menangani dua jenis kegagalan:

- **Jaringan putus:** `fetch` langsung gagal, ditangkap dengan `try/catch`.
- **Server membalas error (400, 500):** `fetch` tidak gagal sendiri, jadi `res.ok` dicek manual.

Keduanya diubah menjadi `Error` yang sama, sehingga bagian lain cukup memakai satu `try/catch`.

Halaman selalu berada di salah satu dari tiga status: `loading`, `error`, atau `success`. Form tidak bisa dipakai sebelum data awal berhasil dimuat.

## Endpoint

| Method | Endpoint | Fungsi |
|---|---|---|
| GET | `/api/tugas` | Ambil semua tugas |
| GET | `/api/matkul` | Ambil daftar mata kuliah |
| POST | `/api/tugas` | Tambah tugas |
| PATCH | `/api/tugas/:id` | Ubah status selesai |
| DELETE | `/api/tugas/:id` | Hapus tugas |

Server yang dipakai adalah Mock API yang berjalan di dalam browser dan menjawab `fetch` seperti server sungguhan. Karena datanya hanya ada di memori halaman, **data kembali ke awal setiap halaman di-refresh**.

## Menjalankan

Tidak perlu instalasi apa pun. Buka `index.html` dengan Live Server (VS Code), atau jalankan:

```bash
python -m http.server 3000
```

lalu buka `http://localhost:3000`.

## Menguji Kondisi Jaringan

Jalankan di Console browser:

```js
__API.setMode("offline")   // jaringan putus
muat()                     // muat ulang data
__API.setMode("lambat")    // request jadi lambat
__API.setMode("error500")  // server selalu error
__API.setMode("normal")    // kembali normal
```

## Struktur

```
.
├── index.html
├── style.css
├── app.js                # state, api(), render(), event handler
├── mock-api-kampus.js    # server tiruan
└── README.md
```

## Kredit

`mock-api-kampus.js` berasal dari materi mata kuliah Pemrograman Web (ET234305), Teknologi Informasi ITS: [modul Minggu 6](https://fuaddary.github.io/Pemrograman-Web/minggu6-async-fetch.html). Sisanya dikerjakan sendiri dengan bantuan AI sebagai alat belajar.# Task Tracker Kuliah

Aplikasi pencatat tugas kuliah yang dibuat dengan vanilla JavaScript, tanpa framework. Data tugas diambil dan diubah lewat REST API memakai `fetch`, `async/await`, dan `Promise.all`.

## Fitur

- Muat tugas dan daftar mata kuliah dari server secara paralel (`Promise.all`)
- Tambah tugas (`POST`) dengan validasi: judul minimal 3 karakter, deadline wajib
- Tandai selesai (`PATCH`) dan hapus (`DELETE`) lewat event delegation
- Filter Semua, Aktif, Selesai, plus counter tugas aktif
- Daftar diurutkan berdasarkan deadline terdekat
- Tampilan khusus untuk kondisi loading, error (dengan tombol "Coba lagi"), dan data kosong
- Tombol dikunci selama request berjalan
- Tetap berjalan saat offline, server lambat, atau server error

## Cara Kerja

Setiap aksi mengikuti alur yang sama: kirim request, tunggu respons, perbarui `state`, lalu `render()` menggambar ulang tampilan.

Semua request lewat satu fungsi `api()` yang menangani dua jenis kegagalan:

- **Jaringan putus:** `fetch` langsung gagal, ditangkap dengan `try/catch`.
- **Server membalas error (400, 500):** `fetch` tidak gagal sendiri, jadi `res.ok` dicek manual.

Keduanya diubah menjadi `Error` yang sama, sehingga bagian lain cukup memakai satu `try/catch`.

Halaman selalu berada di salah satu dari tiga status: `loading`, `error`, atau `success`. Form tidak bisa dipakai sebelum data awal berhasil dimuat.

## Endpoint

| Method | Endpoint | Fungsi |
|---|---|---|
| GET | `/api/tugas` | Ambil semua tugas |
| GET | `/api/matkul` | Ambil daftar mata kuliah |
| POST | `/api/tugas` | Tambah tugas |
| PATCH | `/api/tugas/:id` | Ubah status selesai |
| DELETE | `/api/tugas/:id` | Hapus tugas |

Server yang dipakai adalah Mock API yang berjalan di dalam browser dan menjawab `fetch` seperti server sungguhan. Karena datanya hanya ada di memori halaman, **data kembali ke awal setiap halaman di-refresh**.

## Menjalankan

Tidak perlu instalasi apa pun. Buka `index.html` dengan Live Server (VS Code), atau jalankan:

```bash
python -m http.server 3000
```

lalu buka `http://localhost:3000`.

## Menguji Kondisi Jaringan

Jalankan di Console browser:

```js
__API.setMode("offline")   // jaringan putus
muat()                     // muat ulang data
__API.setMode("lambat")    // request jadi lambat
__API.setMode("error500")  // server selalu error
__API.setMode("normal")    // kembali normal
```

## Struktur

```
.
├── index.html
├── style.css
├── app.js                # state, api(), render(), event handler
├── mock-api-kampus.js    # server tiruan
└── README.md
```

## Kredit

`mock-api-kampus.js` berasal dari materi mata kuliah Pemrograman Web (ET234305), Teknologi Informasi ITS: [modul Minggu 6](https://fuaddary.github.io/Pemrograman-Web/minggu6-async-fetch.html). Sisanya dikerjakan sendiri dengan bantuan AI sebagai alat belajar.