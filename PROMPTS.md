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
**Perbaikan:Tidak ada**

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

**Perbaikan:Tidak ada**

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

**Perbaikan:Tidak ada**

## US-04 Login admin

**Prompt:Baca AGENTS.md bagian aturan keamanan dan docs/user-stories.md bagian US-04.

Buat login admin memakai Supabase Auth (email dan password) dengan @supabase/ssr dan cookie, memakai SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY. Login diproses dengan Server Action di app/admin/actions.js dan disambungkan ke form di app/admin/login/page.jsx. Login berhasil diarahkan ke /admin; login gagal menampilkan pesan error yang jelas di halaman login. Buat juga tombol "Keluar" di components/NavAdmin.jsx berfungsi: mengakhiri sesi lalu kembali ke /admin/login. Jangan ubah tampilan. Hapus CatatanBelumAktif dari halaman login.**

**Hasil:Fitur US-04: Login admin telah selesai dikerjakan sesuai spesifikasi dan aturan keamanan.

File yang Dibuat dan Diubah

lib/supabase/admin.js (Baru)

Membuat fungsi buatKoneksiSesiAdmin menggunakan createServerClient dari @supabase/ssr dan cookie store dari next/headers.
Menggunakan SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY dari environment variable agar RLS tetap berlaku sesuai sesi autentikasi admin.

lib/supabase/index.js (Diperbarui)

Menambahkan re-export modul admin dari ./admin.

app/admin/actions.js (Baru)

Membuat Server Action:
login(prevState, formData): Memvalidasi input dan memanggil supabase.auth.signInWithPassword. Jika berhasil, me-redirect ke /admin; jika gagal, mengembalikan pesan error.
logout(): Memanggil supabase.auth.signOut() lalu me-redirect ke /admin/login.

app/admin/login/page.jsx (Diubah)

Menghubungkan form ke Server Action login dengan React useActionState.
Menampilkan pesan error saat login gagal dengan styling token warna text-bahaya.
Menghapus komponen CatatanBelumAktif. Tampilan form dan tombol tetap dipertahankan.

components/NavAdmin.jsx (Diubah)

Membungkus tombol "Keluar" ke dalam <form action={logout}> sehingga ketika diklik akan memproses logout di server dan mengarahkan kembali ke /admin/login.**

**Perbaikan:Tidak ada**

## US-05 Ganti password

**Prompt:Baca docs/user-stories.md bagian US-05.

Buat Server Action ganti password di app/admin/actions.js untuk admin yang sedang login, memakai Supabase Auth. Validasi di server: password baru minimal 8 karakter dan harus sama dengan konfirmasi. Tampilkan pesan berhasil atau pesan error yang jelas di halaman. Sambungkan ke form di app/admin/password/page.jsx tanpa mengubah tampilannya. Hapus CatatanBelumAktif dari halaman ini.**

**Hasil:Fitur US-05: Ganti password telah selesai dikerjakan sesuai spesifikasi.

File yang Diubah

app/admin/actions.js

Menambahkan Server Action gantiPassword.
Melakukan validasi server:
Password baru dan konfirmasi wajib diisi.
Password baru minimal 8 karakter.
Password baru harus sama dengan konfirmasi.
Memeriksa sesi admin yang sedang login via supabase.auth.getUser().
Memanggil supabase.auth.updateUser({ password: passwordBaru }) untuk memperbarui password di Supabase Auth.
Mengembalikan pesan error atau pesan sukses ({ success: "Password berhasil diganti." }).

app/admin/password/page.jsx

Mengubah halaman menjadi client component ("use client") yang terhubung ke Server Action gantiPassword menggunakan React useActionState.
Menampilkan pesan error (text-bahaya) jika validasi gagal atau terjadi kesalahan.
Menampilkan pesan berhasil (text-utama) saat password sukses diperbarui.
Menonaktifkan tombol submit saat sedang memproses (disabled={pending}).
Menghapus komponen CatatanBelumAktif dengan tetap mempertahankan tampilan form dan struktur halaman.**

**Perbaikan:Tidak ada**

## US-06 Proteksi halaman admin

**Prompt:Baca AGENTS.md aturan keamanan nomor 3 dan 4, dan docs/user-stories.md bagian US-06.

Buat file proxy.js di root proyek (Next.js 16). Semua rute /admin kecuali /admin/login wajib login dengan Supabase Auth; kalau belum login, alihkan ke /admin/login. Pastikan juga setiap Server Action yang mengubah data memeriksa login di server. Hapus CatatanBelumAktif dari halaman /admin.**

**Hasil:Fitur US-06: Proteksi halaman admin telah selesai dikerjakan sesuai aturan keamanan dan spesifikasi.

File yang Dibuat dan Diubah

proxy.js (Baru di root proyek)

Mengimplementasikan konvensi proxy.js (pengganti middleware.js di Next.js 16) untuk memproteksi rute /admin.
Menggunakan @supabase/ssr (createServerClient) untuk membaca cookie autentikasi dan memvalidasi user via supabase.auth.getUser().
Mengalihkan setiap akses ke /admin atau sub-rutenya (kecuali /admin/login) ke /admin/login jika belum terautentikasi.
Mengalihkan user yang sudah login dari /admin/login langsung ke /admin.
Menetapkan matcher: ["/admin", "/admin/:path*"].

app/admin/actions.js (Diverifikasi)

Memastikan Server Action yang mengubah data (gantiPassword) memeriksa validitas sesi admin di server (supabase.auth.getUser()) sebelum melakukan operasi pembaruan data, memenuhi Aturan Keamanan #3.

app/admin/page.jsx (Diubah)

Menghapus komponen dan impor CatatanBelumAktif dari halaman utama admin /admin.**

**Perbaikan:Tidak ada**

## Debugging dan fitur bonus

Tambahkan bagian baru untuk setiap error yang kamu perbaiki atau fitur bonus yang kamu kerjakan.
