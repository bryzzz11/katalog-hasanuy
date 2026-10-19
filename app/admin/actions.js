"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { buatKoneksiSesiAdmin } from "@/lib/supabase/admin";

export async function login(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  const supabase = await buatKoneksiSesiAdmin();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: "Email atau password salah. Silakan coba lagi." };
  }

  redirect("/admin");
}

export async function logout() {
  const supabase = await buatKoneksiSesiAdmin();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function gantiPassword(prevState, formData) {
  const passwordBaru = formData.get("password_baru");
  const konfirmasiPassword = formData.get("konfirmasi_password");

  if (!passwordBaru || !konfirmasiPassword) {
    return { error: "Password baru dan konfirmasi password wajib diisi." };
  }

  if (passwordBaru.length < 8) {
    return { error: "Password baru minimal 8 karakter." };
  }

  if (passwordBaru !== konfirmasiPassword) {
    return { error: "Password baru dan konfirmasi password tidak sama." };
  }

  const supabase = await buatKoneksiSesiAdmin();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "Kamu harus login terlebih dahulu untuk mengganti password." };
  }

  const { error } = await supabase.auth.updateUser({
    password: passwordBaru,
  });

  if (error) {
    return { error: error.message || "Gagal mengganti password. Silakan coba lagi." };
  }

  return { success: "Password berhasil diganti." };
}

export async function tambahProduk(prevState, formData) {
  const form = formData instanceof FormData ? formData : prevState;
  const supabase = await buatKoneksiSesiAdmin();

  // Periksa login admin di server
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Kamu harus login terlebih dahulu.");
  }

  const nama = form.get("nama");
  const harga = parseInt(form.get("harga"), 10);
  const kategori = form.get("kategori") || "";
  const foto_url = form.get("foto_url") || "";
  const deskripsi = form.get("deskripsi") || "";

  if (!nama || isNaN(harga) || harga < 0) {
    throw new Error("Nama dan harga produk (minimal 0) wajib diisi.");
  }

  const { error } = await supabase.from("produk").insert({
    nama,
    harga,
    kategori,
    foto_url,
    deskripsi,
  });

  if (error) {
    throw new Error(error.message || "Gagal menambah produk.");
  }

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function ubahProduk(prevState, formData) {
  const form = formData instanceof FormData ? formData : prevState;
  const supabase = await buatKoneksiSesiAdmin();

  // Periksa login admin di server
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Kamu harus login terlebih dahulu.");
  }

  const id = form.get("id");
  const nama = form.get("nama");
  const harga = parseInt(form.get("harga"), 10);
  const kategori = form.get("kategori") || "";
  const foto_url = form.get("foto_url") || "";
  const deskripsi = form.get("deskripsi") || "";

  if (!id || !nama || isNaN(harga) || harga < 0) {
    throw new Error("Data produk tidak lengkap atau tidak valid.");
  }

  const { error } = await supabase
    .from("produk")
    .update({
      nama,
      harga,
      kategori,
      foto_url,
      deskripsi,
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message || "Gagal mengubah produk.");
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath(`/produk/${id}`);
  redirect("/admin");
}

export async function hapusProduk(id) {
  const supabase = await buatKoneksiSesiAdmin();

  // Periksa login admin di server
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Kamu harus login terlebih dahulu.");
  }

  const { error } = await supabase.from("produk").delete().eq("id", id);

  if (error) {
    throw new Error(error.message || "Gagal menghapus produk.");
  }

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function buatDeskripsiAI(nama, kategori) {
  const supabase = await buatKoneksiSesiAdmin();

  // Pastikan admin login di server
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "Kamu harus login terlebih dahulu." };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return { error: "GEMINI_API_KEY belum diisi di environment variable (.env.local)." };
  }

  if (!nama) {
    return { error: "Nama produk harus diisi terlebih dahulu." };
  }

  const prompt = `Buatkan deskripsi produk UMKM yang menarik, singkat, dan menjual (1 sampai 2 kalimat dalam Bahasa Indonesia) untuk produk berikut:\nNama produk: ${nama}\nKategori: ${kategori || "Umum"}\nLangsung tuliskan deskripsinya saja tanpa tanda petik atau kalimat pembuka/penutup.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error?.message || "Gagal memanggil API Gemini." };
    }

    const parts = data.candidates?.[0]?.content?.parts || [];
    const textPart = parts.find((p) => p.text && !p.thought)?.text || parts.find((p) => p.text)?.text || "";
    const deskripsi = textPart.trim();
    return { deskripsi };
  } catch (err) {
    return { error: err.message || "Terjadi kesalahan saat memproses permintaan AI." };
  }
}
