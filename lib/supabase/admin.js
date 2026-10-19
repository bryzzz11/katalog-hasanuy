import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Membuat koneksi Supabase untuk sesi admin menggunakan @supabase/ssr dan cookie.
 * Memakai SUPABASE_PUBLISHABLE_KEY agar RLS tetap berlaku berdasarkan sesi login.
 */
export async function buatKoneksiSesiAdmin() {
  const url = process.env.SUPABASE_URL;
  const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) {
    throw new Error(
      "SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY wajib diisi di environment variable."
    );
  }

  const cleanUrl = url.trim().replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");
  const cookieStore = await cookies();

  return createServerClient(cleanUrl, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Dipanggil dari Server Component — cookie hanya bisa ditulis
          // dari Server Action atau Route Handler, jadi error ini bisa diabaikan.
        }
      },
    },
  });
}

