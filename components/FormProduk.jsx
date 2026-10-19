"use client";

import { useState } from "react";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";
import { buatDeskripsiAI } from "@/app/admin/actions";

// Dipakai untuk tambah produk (US-08) dan ubah produk (US-09). Keduanya bonus di jalur offline.
// Nama field sama dengan kolom tabel "produk".
export default function FormProduk({ produk = {}, labelTombol, action }) {
  const [nama, setNama] = useState(produk.nama || "");
  const [kategori, setKategori] = useState(produk.kategori || "");
  const [deskripsi, setDeskripsi] = useState(produk.deskripsi || "");
  const [loadingAI, setLoadingAI] = useState(false);
  const [pesanAI, setPesanAI] = useState({ error: "", success: "" });

  const handleBuatAI = async () => {
    if (!nama.trim()) {
      setPesanAI({ error: "Isi nama produk terlebih dahulu.", success: "" });
      return;
    }

    setPesanAI({ error: "", success: "" });
    setLoadingAI(true);

    try {
      const res = await buatDeskripsiAI(nama, kategori);
      if (res.error) {
        setPesanAI({ error: res.error, success: "" });
      } else if (res.deskripsi) {
        setDeskripsi(res.deskripsi);
        setPesanAI({ error: "", success: "Deskripsi berhasil dibuat dengan AI!" });
      }
    } catch {
      setPesanAI({ error: "Gagal memanggil AI.", success: "" });
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <form action={action} className="flex max-w-xl flex-col gap-4">
      {produk.id && <input type="hidden" name="id" value={produk.id} />}
      <Input
        label="Nama produk"
        name="nama"
        value={nama}
        onChange={(e) => setNama(e.target.value)}
        required
      />
      <Input
        label="Harga (Rp)"
        name="harga"
        type="number"
        min="0"
        defaultValue={produk.harga}
        required
      />
      <Input
        label="Kategori"
        name="kategori"
        value={kategori}
        onChange={(e) => setKategori(e.target.value)}
      />
      <Input
        label="Link foto"
        name="foto_url"
        placeholder="https://... atau /produk/nama-file.svg"
        defaultValue={produk.foto_url}
      />

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold">Deskripsi</label>
          <button
            type="button"
            onClick={handleBuatAI}
            disabled={loadingAI}
            className="text-xs font-semibold text-utama hover:text-utama-gelap disabled:opacity-50"
          >
            {loadingAI ? "Membuat dengan AI…" : "✨ Buat dengan AI"}
          </button>
        </div>
        <textarea
          name="deskripsi"
          rows={4}
          value={deskripsi}
          onChange={(e) => setDeskripsi(e.target.value)}
          className="w-full rounded-lg border border-garis bg-latar px-3 py-2.5 text-base text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none"
        />
        {pesanAI.error && <p className="text-xs text-bahaya">{pesanAI.error}</p>}
        {pesanAI.success && <p className="text-xs text-utama font-medium">{pesanAI.success}</p>}
      </div>

      <div className="flex gap-3">
        <Tombol type="submit">{labelTombol}</Tombol>
        <Tombol href="/admin" varian="garis">
          Batal
        </Tombol>
      </div>
    </form>
  );
}
