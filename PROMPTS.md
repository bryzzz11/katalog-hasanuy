# Jurnal Prompt

Catat prompt penting selama membangun aplikasi: apa yang kamu minta, hasilnya, dan perbaikan yang dilakukan. Beri tanda **[SENDIRI]** untuk prompt yang kamu tulis sendiri (bukan dari lembar kerja).

## US-01 Katalog dari database

**Prompt:Baca AGENTS.md dan docs/user-stories.md bagian US-01.

Ubah app/page.jsx supaya daftar produk diambil dari tabel "produk" di Supabase, di sisi server, memakai SUPABASE_URL dan SUPABASE_SECRET_KEY dari environment variable. Buat koneksi Supabase untuk server di folder lib/supabase.

Tampilkan produk dengan komponen KartuProduk yang sudah ada, tanpa mengubah tampilannya. Kalau gagal mengambil data, tampilkan pesan error yang jelas di halaman. Kalau tabel kosong, tampilkan tulisan "Belum ada produk". Hapus CatatanBelumAktif dari halaman ini.**

**Hasil:Fitur US-01: Katalog dari database telah selesai dikerjakan sesuai spesifikasi.

File yang Dibuat dan Diubah

lib/supabase/server.js & lib/supabase/index.js (Baru)

Membuat fungsi buatKoneksiServer menggunakan @supabase/supabase-js dengan SUPABASE_URL dan SUPABASE_SECRET_KEY dari environment variable.
Mengatur opsi persistSession: false dan autoRefreshToken: false karena berjalan di lingkungan server tanpa session browser.
Menambahkan normalisasi URL agar kebal terhadap penulisan path REST API (misalnya akhiran /rest/v1).

app/page.jsx (Diubah)

Mengubah komponen HalamanKatalog menjadi Server Component async yang mengambil data produk langsung dari tabel produk di Supabase.
Menampilkan produk dengan komponen KartuProduk bawaan tanpa mengubah tata letak maupun tampilannya.
Menangani pesan error yang jelas jika pengambilan data gagal.
Menampilkan teks "Belum ada produk" jika tabel kosong.
Menghapus komponen CatatanBelumAktif dan impor data contoh produkContoh.

.env.local (Diperbaiki)

Menyesuaikan SUPABASE_URL ke root URL project (https://jwmangteihrhwkhmkoiv.supabase.co) tanpa akhiran path REST /rest/v1/.**

**Perbaikan:**

## US-02 Detail produk

**Prompt:Baca docs/user-stories.md bagian US-02.

Ubah app/produk/[id]/page.jsx supaya mengambil satu produk dari tabel "produk" di Supabase berdasarkan id di URL, di sisi server, memakai koneksi Supabase yang sudah dibuat di lib/supabase. Kalau produk tidak ditemukan, panggil notFound(). Jangan ubah tampilannya. Hapus CatatanBelumAktif dari halaman ini, tapi biarkan tombol WhatsApp.**

**Hasil:Build berhasil. Berikut ringkasan perubahan:

File yang diubah

app/produk/[id]/page.jsx

Mengambil produk dari tabel produk di Supabase menggunakan .eq("id", id).single() melalui buatKoneksiServer.
Memanggil notFound() jika query gagal atau produk tidak ditemukan.
Menghapus impor CatatanBelumAktif dan cariProdukContoh (data contoh).
Tampilan dan tombol WhatsApp tidak diubah.
Cara mengetes
npm run dev, buka http://localhost:3000
.
Klik salah satu kartu produk → halaman detail tampil dengan data dari database (foto, kategori, nama, harga, deskripsi, tombol WhatsApp).
Buka URL produk yang tidak ada, misalnya /produk/9999
 → halaman "tidak ditemukan" muncul.**

**Perbaikan:**

## US-03 Pesan via WhatsApp

**Prompt:Baca docs/rancangan-teknis.md bagian "Pesan WhatsApp (US-03)".

Ubah components/TombolWhatsApp.jsx menjadi tautan yang membuka https://wa.me/ ke nomor di lib/toko.js, dengan pesan otomatis berisi nama dan harga produk dalam format rupiah. Pesan di-encode dengan encodeURIComponent dan dibuka di tab baru. Pertahankan tampilan tombolnya. Hapus CatatanBelumAktif yang menyebut US-03 di halaman detail produk.**

**Hasil:Build berhasil.

File yang diubah

components/TombolWhatsApp.jsx

<button> diganti menjadi <a> dengan target="_blank" dan rel="noopener noreferrer".
Link mengarah ke https://wa.me/6281374117686?text=... menggunakan nomor dari toko.nomorWhatsApp.
Pesan otomatis berisi nama dan harga produk dalam format rupiah, di-encode dengan encodeURIComponent.
Tampilan tombol (kelas CSS) tetap sama persis.

Halaman detail produk sudah tidak ada CatatanBelumAktif (sudah dihapus saat US-02).

Cara mengetes
npm run dev, buka halaman detail produk mana saja (misal /produk/1
).
Klik tombol "Pesan via WhatsApp" → WhatsApp terbuka di tab baru dengan pesan seperti:

Halo, saya ingin memesan: Kopi Bubuk Robusta 250 g — Rp 45.000

Coba juga di HP untuk memastikan WhatsApp mobile terbuka dengan benar.**

**Perbaikan:**

## US-04 Login admin

**Prompt:**

**Hasil:**

**Perbaikan:**

## US-05 Ganti password

**Prompt:**

**Hasil:**

**Perbaikan:**

## US-06 Proteksi halaman admin

**Prompt:**

**Hasil:**

**Perbaikan:**

## Debugging dan fitur bonus

Tambahkan bagian baru untuk setiap error yang kamu perbaiki atau fitur bonus yang kamu kerjakan.
