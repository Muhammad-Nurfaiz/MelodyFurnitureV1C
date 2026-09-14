import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Melody Furniture | Keranjang Belanja",
  description: "Melody Furniture - furnitur rumah minimalis berkualitas.",
  openGraph: {
    title: "Melody Furniture | Keranjang Belanja",
    description: "Melody Furniture - furnitur rumah minimalis berkualitas.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
