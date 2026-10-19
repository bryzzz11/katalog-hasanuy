import { createClient } from "@supabase/supabase-js";

/**
 * Membuat koneksi Supabase untuk server memakai SUPABASE_SECRET_KEY.
 * Digunakan untuk membaca data publik (katalog dan detail produk) di sisi server,
 * melewati batasan RLS publik tanpa mengekspos kunci rahasia ke browser.
 */
export function buatKoneksiServer() {
  const rawUrl = process.env.SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!rawUrl || !secretKey) {
    throw new Error(
      "SUPABASE_URL dan SUPABASE_SECRET_KEY wajib diisi di environment variable."
    );
  }

  // Bersihkan URL jika pengguna memasukkan endpoint REST (/rest/v1) atau garis miring di akhir
  const url = rawUrl.trim().replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");

  return createClient(url, secretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export const createServerClient = buatKoneksiServer;
export default buatKoneksiServer;

