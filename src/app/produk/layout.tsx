import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Katalog Produk | Melody Furniture - Koleksi Furnitur Minimalis Modern",
  description:
    "Jelajahi seluruh katalog produk furnitur minimalis dari Melody Furniture. Meja belajar, lemari pakaian, rak TV kualitas ekspor dengan harga lokal pabrik.",
  openGraph: {
    title: "Katalog Produk | Melody Furniture - Koleksi Furnitur Minimalis Modern",
    description:
      "Jelajahi seluruh katalog produk furnitur minimalis dari Melody Furniture. Meja belajar, lemari pakaian, rak TV kualitas ekspor dengan harga lokal pabrik.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function ProdukLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
