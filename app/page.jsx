import Link from "next/link";
import KartuProduk from "@/components/KartuProduk";
import { toko } from "@/lib/toko";
import { buatKoneksiServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function HalamanKatalog({ searchParams }) {
  const { q = "", kategori = "" } = (await searchParams) || {};
  let semuaProduk = [];
  let pesanError = null;

  try {
    const supabase = buatKoneksiServer();
    const { data, error } = await supabase
      .from("produk")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      pesanError = error.message || "Gagal mengambil data produk dari database.";
    } else {
      semuaProduk = data || [];
    }
  } catch (err) {
    pesanError = err.message || "Terjadi kesalahan saat menghubungkan ke database.";
  }

  // Daftar kategori unik untuk filter
  const kategoriUnik = [
    "Semua",
    ...new Set(semuaProduk.map((p) => p.kategori).filter(Boolean)),
  ];

  const kataKunci = q.trim().toLowerCase();
  const kategoriDipilih = kategori.trim();

  // Filter berdasarkan kategori dan pencarian
  const daftarProduk = semuaProduk.filter((p) => {
    const cocokKategori =
      !kategoriDipilih ||
      kategoriDipilih === "Semua" ||
      p.kategori?.toLowerCase() === kategoriDipilih.toLowerCase();

    const cocokKataKunci =
      !kataKunci ||
      p.nama?.toLowerCase().includes(kataKunci) ||
      p.deskripsi?.toLowerCase().includes(kataKunci);

    return cocokKategori && cocokKataKunci;
  });

  return (
    <>
      <section className="py-10 sm:py-14">
        <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          {toko.nama}
        </h1>
        <p className="mt-3 max-w-xl text-lg text-teks-lembut">{toko.tagline}</p>
        <p className="mt-4 text-sm text-teks-lembut">{toko.jamBuka}</p>
      </section>

      <section aria-labelledby="judul-produk" className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 id="judul-produk" className="text-xl font-bold">
            Produk kami
          </h2>

          {/* Form Pencarian */}
          <form method="GET" action="/" className="flex items-center gap-2">
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Cari nama produk..."
              className="w-full rounded-lg border border-garis bg-latar px-3 py-1.5 text-sm placeholder:text-teks-lembut focus:border-utama focus:outline-none sm:w-60"
            />
            {kategoriDipilih && kategoriDipilih !== "Semua" && (
              <input type="hidden" name="kategori" value={kategoriDipilih} />
            )}
            <button
              type="submit"
              className="rounded-lg bg-utama px-3 py-1.5 text-sm font-semibold text-white hover:bg-utama-gelap"
            >
              Cari
            </button>
            {q && (
              <Link
                href={
                  kategoriDipilih && kategoriDipilih !== "Semua"
                    ? `/?kategori=${encodeURIComponent(kategoriDipilih)}`
                    : "/"
                }
                className="text-xs text-teks-lembut hover:text-bahaya"
              >
                Reset
              </Link>
            )}
          </form>
        </div>

        {/* Filter Kategori */}
        {kategoriUnik.length > 1 && (
          <div className="flex flex-wrap gap-2">
            {kategoriUnik.map((kat) => {
              const isAktif =
                (!kategoriDipilih && kat === "Semua") ||
                kategoriDipilih.toLowerCase() === kat.toLowerCase();

              const params = new URLSearchParams();
              if (q) params.set("q", q);
              if (kat !== "Semua") params.set("kategori", kat);
              const href = params.toString() ? `/?${params.toString()}` : "/";

              return (
                <Link
                  key={kat}
                  href={href}
                  className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-colors ${
                    isAktif
                      ? "bg-utama text-white"
                      : "border border-garis bg-permukaan text-teks-lembut hover:border-utama hover:text-utama"
                  }`}
                >
                  {kat}
                </Link>
              );
            })}
          </div>
        )}

        {pesanError ? (
          <div className="rounded-xl border border-garis bg-permukaan p-4 text-bahaya">
            <p className="font-semibold">Gagal memuat produk</p>
            <p className="mt-1 text-sm">{pesanError}</p>
          </div>
        ) : semuaProduk.length === 0 ? (
          <p className="py-8 text-teks-lembut">Belum ada produk</p>
        ) : daftarProduk.length === 0 ? (
          <p className="py-8 text-teks-lembut">
            Tidak ada produk yang cocok dengan pencarian atau filter.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {daftarProduk.map((produk) => (
              <KartuProduk key={produk.id} produk={produk} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
