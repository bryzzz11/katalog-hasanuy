"use client";

import { useState } from "react";
import { toko } from "@/lib/toko";
import { formatRupiah } from "@/lib/format";

export default function TombolWhatsApp({ produk }) {
  const [jumlah, setJumlah] = useState(1);

  const kurangi = () => setJumlah((prev) => Math.max(1, prev - 1));
  const tambah = () => setJumlah((prev) => prev + 1);

  const totalHarga = produk.harga * jumlah;
  const pesan = `Halo, saya ingin memesan:\n${produk.nama}\nJumlah: ${jumlah}\nTotal: ${formatRupiah(totalHarga)}`;
  const href = `https://wa.me/${toko.nomorWhatsApp}?text=${encodeURIComponent(pesan)}`;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-teks-lembut">Jumlah:</span>
        <div className="inline-flex items-center rounded-lg border border-garis bg-latar">
          <button
            type="button"
            onClick={kurangi}
            disabled={jumlah <= 1}
            aria-label="Kurangi jumlah"
            className="px-3 py-1.5 text-base font-bold text-teks hover:bg-permukaan disabled:opacity-40 disabled:cursor-not-allowed rounded-l-lg transition-colors"
          >
            -
          </button>
          <span className="w-10 text-center text-sm font-semibold text-teks">
            {jumlah}
          </span>
          <button
            type="button"
            onClick={tambah}
            aria-label="Tambah jumlah"
            className="px-3 py-1.5 text-base font-bold text-teks hover:bg-permukaan rounded-r-lg transition-colors"
          >
            +
          </button>
        </div>
        {jumlah > 1 && (
          <span className="text-sm text-teks-lembut">
            (Total: <span className="font-semibold text-harga">{formatRupiah(totalHarga)}</span>)
          </span>
        )}
      </div>

      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex w-full items-center justify-center rounded-lg bg-utama px-5 py-3 font-semibold text-white hover:bg-utama-gelap sm:w-auto"
      >
        Pesan via WhatsApp ({jumlah})
      </a>
    </div>
  );
}
