import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ryuki TV Stand | Melody Furniture",
  description: "Melody Furniture - furnitur rumah minimalis berkualitas.",
  openGraph: {
    title: "Ryuki TV Stand | Melody Furniture",
    description: "Melody Furniture - furnitur rumah minimalis berkualitas.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function DetailProdukLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
