import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Detail Produk | Melody Furniture - Koleksi Furnitur Minimalis Modern",
  twitter: { card: "summary_large_image" },
};

export default function DetailProdukLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
